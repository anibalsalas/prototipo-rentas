/* Asistencia inteligente (IA-01..08). Siempre sugerencias: una persona decide.
   Ninguna acción de esta sección escribe en la deuda ni en la caja (propuesta-ia §4). */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;
  function fila(cols) { return '<tr>' + cols.map(function (c) { return '<td' + (c && c.num ? ' class="num"' : '') + '>' + (c && c.h !== undefined ? c.h : c) + '</td>'; }).join('') + '</tr>'; }
  function n(h) { return { h: h, num: true }; }
  function franja(capacidad, extra) {
    return R.aviso('info', 'Sugerencia: una persona decide', 'Capacidad <strong>' + esc(capacidad) + '</strong> activa. La IA ordena, alerta o propone; no emite, no cobra y no cambia deudas. ' + (extra || '') +
      ' <button type="button" class="btn btn--chico btn--terciario" data-reportar>Esta sugerencia es incorrecta</button>');
  }
  function reportes() {
    document.querySelectorAll('[data-reportar]').forEach(function (b) { b.addEventListener('click', function () { R.avisar('info', 'Gracias', 'El reporte se revisa cada semana para mejorar las reglas.'); }); });
  }

  /* ======================= IA-01 Bandejas de cobranza ======================= */
  R.vistas['IA-01'] = function (ctx) {
    var filas = D.bandejaCobranza.slice().sort(function (a, b) { return b.prioridad - a.prioridad; });
    return {
      subtitulo: 'Cartera ordenada por reglas visibles: monto, antigüedad, cercanía a la prescripción y situación.',
      acciones: R.btn(ctx, 'Asignar gestión a los seleccionados', { tipo: 'primario', id: 'btn-asg' }),
      contenido: '<div id="res-ia1"></div>' + franja('IA-006 Bandejas de cobranza') +
        '<section class="panel"><h2>Criterio de orden ' + R.pend('PE-173') + '</h2><p class="pequeno">Puntaje = 40 % monto + 25 % antigüedad + 20 % cercanía a la prescripción + 15 % situación (valor notificado, convenio con cuotas vencidas). Criterio de ejemplo; lo aprueba Rentas.</p></section>' +
        '<section class="panel"><div class="tabla-marco"><table><caption class="sr-only">Bandeja</caption><thead><tr><th scope="col"><span class="sr-only">Elegir</span></th><th scope="col" class="num">Prioridad</th><th scope="col">Contribuyente</th><th scope="col" class="num">Deuda</th><th scope="col" class="num">Meses de atraso</th><th scope="col">Situación</th><th scope="col">Acción sugerida</th></tr></thead><tbody>' +
        filas.map(function (f) { return fila(['<input type="checkbox" data-ia1 aria-label="Elegir ' + esc(f.nombre) + '" style="width:1.1rem;height:1.1rem">', n('<strong>' + f.prioridad + '</strong>'), '<a href="#/cuenta/estado/' + f.codigo + '">' + esc(f.nombre) + '</a>', n(F.moneda(f.monto)), n(f.antig), esc(f.situacion), esc(f.accion)]); }).join('') +
        '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · La distribución por distrito y tipo de persona se revisa para evitar sesgos.</p></section>',
      despues: function () {
        reportes();
        var b = $('#btn-asg'); if (b && !b.disabled) b.addEventListener('click', function () {
          var nsel = document.querySelectorAll('[data-ia1]:checked').length;
          $('#res-ia1').innerHTML = nsel ? R.aviso('exito', nsel + ' gestión(es) asignada(s)', 'Se registran como tareas del gestor; el resultado de cada gestión alimenta la mejora del criterio.') : R.aviso('alerta', 'Elige al menos un contribuyente', '');
        });
      }
    };
  };

  /* ======================= IA-02 Alertas de plazos ======================= */
  R.vistas['IA-02'] = function (ctx) {
    return {
      subtitulo: 'Plazos de prescripción, recursos, REC y levantamientos. La alerta no prescribe ni decide nada.',
      acciones: '<a class="btn btn--primario" href="#/coactivo/levantamiento">Atender la más urgente</a>',
      contenido: franja('IA-005 Alertas de plazos', 'Si falta la evidencia de una interrupción, se muestra; nunca se asume.') +
        '<section class="panel"><table><thead><tr><th scope="col">Tipo</th><th scope="col">Detalle</th><th scope="col">Vence</th><th scope="col">Estado</th></tr></thead><tbody>' +
        D.alertasPlazo.map(function (a) { return fila(['<strong>' + esc(a.tipo) + '</strong>', esc(a.detalle), esc(a.vence), R.ins(a.estado, a.nivel)]); }).join('') + '</tbody></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Política de cálculo de la prescripción ' + R.pend('PE-142') + '</p></section>',
      despues: reportes
    };
  };

  /* ======================= IA-03 Duplicados posibles ======================= */
  R.vistas['IA-03'] = function (ctx) {
    return {
      subtitulo: 'Pares de registros que podrían ser la misma persona. Nunca se unen automáticamente.',
      acciones: '<a class="btn btn--primario" href="#/contribuyentes/fusionar">Revisar el par de mayor puntaje</a>',
      contenido: franja('IA-012 Duplicados') + '<section class="panel"><table><thead><tr><th scope="col">Registro A</th><th scope="col">Registro B</th><th scope="col" class="num">Puntaje</th><th scope="col">Evidencias</th><th scope="col">Sugerencia</th></tr></thead><tbody>' +
        D.paresDuplicados.map(function (p) { return fila([esc(p.a), esc(p.b), n('<strong>' + p.puntaje + '</strong>'), '<ul class="lista-simple pequeno">' + p.evidencias.map(function (e) { return '<li>' + esc(e) + '</li>'; }).join('') + '</ul>',
          p.puntaje >= 80 ? R.ins('Posible duplicado', 'alerta') : R.ins('Probable homónimo', 'neutra')]); }).join('') + '</tbody></table></section>',
      despues: reportes
    };
  };

  /* ======================= IA-04 Direcciones por normalizar ======================= */
  R.vistas['IA-04'] = function (ctx) {
    return {
      subtitulo: 'Direcciones escritas a mano, propuestas en formato ordenado. El operador confirma; se guarda el texto original.',
      acciones: R.btn(ctx, 'Confirmar las de confianza alta', { tipo: 'primario', id: 'btn-dir' }),
      contenido: '<div id="res-ia4"></div>' + franja('IA-013 Direcciones', 'El distrito nunca se deduce solo por el nombre.') +
        '<section class="panel"><table><thead><tr><th scope="col">Texto original</th><th scope="col">Vía</th><th scope="col">Número</th><th scope="col">Referencia</th><th scope="col">Sector</th><th scope="col">Confianza</th></tr></thead><tbody>' +
        D.direcciones.map(function (d) { return fila(['<span class="mono pequeno">' + esc(d.original) + '</span>', esc(d.via), esc(d.num), esc(d.ref), esc(d.sector), R.ins(d.confianza, d.confianza === 'Alta' ? 'exito' : d.confianza === 'Media' ? 'alerta' : 'error')]); }).join('') +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">Catálogo de vías y sectores ' + R.pend('PE-011') + '</p></section>',
      despues: function () { reportes(); var b = $('#btn-dir'); if (b && !b.disabled) b.addEventListener('click', function () { $('#res-ia4').innerHTML = R.aviso('exito', '1 dirección confirmada', 'Las de confianza media o baja se revisan una por una.'); }); }
    };
  };

  /* ======================= IA-05 Atípicos en DJ y posibles omisos ======================= */
  R.vistas['IA-05'] = function (ctx) {
    return {
      subtitulo: 'Declaraciones inusuales y cruces con información de otras áreas. Solo proponen un caso de fiscalización.',
      acciones: '<a class="btn btn--primario" href="#/fiscalizacion/bandeja">Ir a la bandeja de fiscalización</a>',
      contenido: franja('IA-008 y IA-009', 'Nunca se emite un valor automáticamente por un indicio.') + '<section class="panel"><table><thead><tr><th scope="col">Contribuyente</th><th scope="col">Predio</th><th scope="col">Indicio</th><th scope="col">Origen</th><th scope="col">Nivel</th></tr></thead><tbody>' +
        D.atipicos.map(function (a) { return fila([esc(a.nombre), esc(a.predio), esc(a.regla), esc(a.tipo), R.ins(a.nivel, a.nivel === 'Alta' ? 'alerta' : 'info')]); }).join('') + '</tbody></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Umbrales ' + R.pend('PE-032') + ' · Fuentes de otras áreas ' + R.pend('PE-121') + '</p></section>',
      despues: reportes
    };
  };

  /* ======================= IA-06 Asistente normativo ======================= */
  R.vistas['IA-06'] = function (ctx) {
    return {
      subtitulo: 'Responde solo con normas registradas en el sistema y cita la fuente. Si no hay fuente, lo dice. Es orientación, no un dictamen.',
      acciones: '<button type="button" class="btn btn--primario" id="as-ir">Preguntar</button>',
      contenido: '<section class="panel">' + R.campo({ id: 'as-p', label: 'Tu pregunta', opciones: D.asistente.map(function (x, i) { return [i, x.p]; }), ayuda: 'Preguntas de ejemplo. No escribas nombres ni documentos de contribuyentes.' }) +
        '<div id="as-res" style="margin-top:var(--s-4)" aria-live="polite"></div></section>' +
        '<p class="micro">Infraestructura del modelo ' + R.pend('PE-170') + ' · Normas cargadas ' + R.pend('PE-174') + '</p>',
      despues: function () {
        $('#as-ir').addEventListener('click', function () {
          var x = D.asistente[Number($('#as-p').value)];
          $('#as-res').innerHTML = x.r ? '<div class="panel panel--ia"><p>' + esc(x.r) + '</p><h3>Fuentes</h3><ul class="lista-simple pequeno">' + x.citas.map(function (c) { return '<li>' + esc(c[0]) + ', ' + esc(c[1]) + ' · ' + R.ins(c[2], 'exito') + '</li>'; }).join('') + '</ul>' +
            '<p class="micro" style="margin:var(--s-2) 0 0">Orientación, no dictamen. Verifica la vigencia antes de aplicarla a un caso.</p></div>'
            : R.aviso('alerta', 'No hay una fuente registrada para responder', 'La ordenanza de arbitrios 2027 no está cargada en el sistema ' + R.pend('PE-050') + '. El asistente no completa con suposiciones.');
        });
      }
    };
  };

  /* ======================= IA-07 Control interno ======================= */
  R.vistas['IA-07'] = function (ctx) {
    return {
      subtitulo: 'Indicios en caja, accesos y descargos. Una alerta no es una acusación. Las alertas sobre un supervisor se envían a un nivel superior.',
      acciones: R.btn(ctx, 'Cerrar alerta seleccionada', { tipo: 'primario', id: 'btn-ci' }),
      contenido: '<div id="res-ci"></div>' + franja('IA-019, IA-020 e IA-021') + '<section class="panel"><table><thead><tr><th scope="col"><span class="sr-only">Elegir</span></th><th scope="col">Alerta</th><th scope="col">Regla</th><th scope="col">Detalle</th><th scope="col">Relacionado</th><th scope="col">Nivel</th><th scope="col">Estado</th></tr></thead><tbody>' +
        D.alertasControl.map(function (a) { return fila([/Abierta/.test(a.estado) ? '<input type="radio" name="ci" value="' + a.id + '" aria-label="Elegir ' + a.id + '">' : '', '<span class="mono">' + a.id + '</span>', esc(a.regla), esc(a.detalle), '<span class="mono pequeno">' + esc(a.sujeto) + '</span>', R.ins(a.nivel, a.nivel === 'Alta' ? 'error' : a.nivel === 'Media' ? 'alerta' : 'neutra'), esc(a.estado)]); }).join('') +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">Área que recibe estas alertas ' + R.pend('PE-172') + '</p></section>' +
        '<section class="panel" id="ci-form" hidden><h2>Cerrar alerta</h2><div class="form-rejilla">' + R.campo({ id: 'ci-res', label: 'Resultado', opciones: ['Justificada', 'Sin hallazgo', 'Derivada a investigación'] }) +
        R.campo({ id: 'ci-mot', label: 'Motivo', tipo: 'textarea', obligatorio: true }) + '</div><p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="ci-ok">Cerrar</button></p></section>',
      despues: function () {
        reportes();
        var b = $('#btn-ci'); if (b && !b.disabled) b.addEventListener('click', function () {
          if (!document.querySelector('[name="ci"]:checked')) { R.avisar('alerta', 'Elige una alerta', 'Marca la alerta que quieres cerrar.'); return; }
          $('#ci-form').hidden = false; $('#ci-mot').focus();
        });
        $('#ci-ok').addEventListener('click', function () {
          R.limpiarError('ci-mot'); if ($('#ci-mot').value.trim().length < 5) { R.marcarError('ci-mot', 'Escribe el motivo del cierre.').focus(); return; }
          $('#ci-form').hidden = true; $('#res-ci').innerHTML = R.aviso('exito', 'Alerta cerrada', 'Resultado: ' + esc($('#ci-res').value) + '. El motivo queda registrado.');
        });
      }
    };
  };

  /* ======================= IA-08 Gobierno de IA ======================= */
  R.vistas['IA-08'] = function (ctx) {
    var tipo = { 'Activa': 'exito', 'Piloto': 'info', 'Construida, desactivada': 'neutra' };
    return {
      subtitulo: 'Qué capacidades están activas, dónde se procesan, con qué umbral se evalúan y qué decidieron las personas con cada sugerencia.',
      acciones: R.btn(ctx, 'Desactivar una capacidad', { tipo: 'primario', id: 'btn-gob' }),
      contenido: '<section class="panel"><h2>Capacidades</h2><div class="tabla-marco"><table><caption class="sr-only">Capacidades de IA</caption><thead><tr><th scope="col">Capacidad</th><th scope="col">Área</th><th scope="col">Técnica</th><th scope="col">Dónde se procesa</th><th scope="col">Estado</th><th scope="col">Umbral para seguir activa</th></tr></thead><tbody>' +
        D.capacidadesIA.map(function (c) { return fila(['<strong>' + esc(c[0]) + '</strong>', esc(c[1]), esc(c[2]), esc(c[3]), R.ins(c[4], tipo[c[4]]), esc(c[5])]); }).join('') + '</tbody></table></div>' +
        '<p class="micro" style="margin-top:var(--s-2)">Responsable de datos personales ' + R.pend('PE-171') + ' · Infraestructura ' + R.pend('PE-170') + '</p></section>' +
        '<section class="panel"><h2>Registro de sugerencias</h2><table><thead><tr><th scope="col">Fecha</th><th scope="col">Capacidad</th><th scope="col">Usuario</th><th scope="col">Sugerencia</th><th scope="col">Decisión de la persona</th></tr></thead><tbody>' +
        D.inferencias.map(function (i) { return fila([esc(i[0]), esc(i[1]), '<span class="mono pequeno">' + esc(i[2]) + '</span>', esc(i[3]), esc(i[4])]); }).join('') + '</tbody></table></section>' +
        '<section class="panel"><h2>Garantías</h2><ul class="lista-simple pequeno"><li>Ninguna capacidad calcula montos oficiales, emite, notifica, firma ni cobra.</li><li>La información con reserva tributaria no se envía a servicios externos.</li><li>Cada capacidad se puede apagar sin afectar el trabajo manual.</li></ul></section>',
      despues: function () { var b = $('#btn-gob'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Interruptor por capacidad', 'Se apaga sin desplegar; el proceso manual sigue funcionando. Queda auditado.'); }); }
    };
  };
})(window.RENTAS = window.RENTAS || {});
