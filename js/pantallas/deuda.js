/* Gestión de Deuda: Multas (MUL), Fiscalización (FIS), Coactivo (COA), Descargos y transferencias (DES). */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;
  function fila(cols) { return '<tr>' + cols.map(function (c) { return '<td' + (c && c.num ? ' class="num"' : '') + '>' + (c && c.h !== undefined ? c.h : c) + '</td>'; }).join('') + '</tr>'; }
  function n(h) { return { h: h, num: true }; }

  /* ======================= MUL-01 Multas tributarias ======================= */
  R.vistas['MUL-01'] = function (ctx) {
    var tipo = function (e) { return /Emitida/.test(e) ? 'exito' : 'alerta'; };
    return {
      subtitulo: 'La multa se calcula con la tabla de infracciones aplicable y se revisa antes de emitir la Resolución de Multa.',
      acciones: R.btn(ctx, 'Proponer multa', { tipo: 'primario', id: 'btn-mul' }),
      contenido: '<div id="res-mul"></div><section class="panel"><h2>Nueva multa</h2><div class="form-rejilla">' +
        R.campo({ id: 'm-contrib', label: 'Contribuyente', opciones: D.contribuyentes.map(function (c) { return [c.codigo, c.nombre]; }), valor: 'CTB-000105' }) +
        R.campo({ id: 'm-inf', label: 'Infracción', opciones: ['Presentar la declaración jurada fuera de plazo', 'No presentar la declaración jurada en el plazo', 'No comunicar el cambio de domicilio fiscal'], pend: 'PE-110' }) +
        R.campo({ id: 'm-fecha', label: 'Fecha de la infracción', tipo: 'date', valor: '2027-03-02', obligatorio: true }) +
        R.campo({ id: 'm-subs', label: 'Situación', opciones: ['Sin subsanar', 'Subsanada voluntariamente', 'Subsanada tras requerimiento'] }) + '</div>' +
        '<div class="calculo" style="margin-top:var(--s-4);max-width:34rem">' +
        '<div class="calculo__fila"><span>Sanción según la tabla aplicable ' + R.pend('PE-110') + '</span><span class="num">' + F.moneda(27500) + '</span></div>' +
        '<div class="calculo__fila"><span>Rebaja por gradualidad</span><span class="num" id="m-grad">' + F.moneda(-13750) + '</span></div>' +
        '<div class="calculo__fila"><span>Interés ' + R.pend('PE-047') + '</span><span class="num">Se calcula al emitir</span></div>' +
        '<div class="calculo__fila calculo__fila--total"><span>Multa propuesta</span><span class="num" id="m-total">' + F.moneda(13750) + '</span></div></div>' +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · El cálculo usa la norma vigente a la fecha de la infracción y queda como caso reproducible.</p></section>' +
        '<section class="panel"><h2>Multas registradas</h2>' + R.tabla('t-mul', { caption: 'Multas', filas: D.multas, columnas: [
          { clave: 'numero', titulo: 'Número', orden: true, render: function (m) { return '<span class="mono">' + m.numero + '</span>'; } },
          { clave: 'nombre', titulo: 'Contribuyente', orden: true }, { clave: 'infraccion', titulo: 'Infracción' }, { clave: 'fecha', titulo: 'Fecha', tipo: 'fecha', orden: true },
          { clave: 'monto', titulo: 'Monto', tipo: 'moneda', orden: true }, { clave: 'estado', titulo: 'Estado', orden: true, render: function (m) { return R.ins(m.estado, tipo(m.estado)); } }] }) + '</section>',
      despues: function () {
        $('#m-subs').addEventListener('change', function (e) {
          var r = e.target.value === 'Sin subsanar' ? 0 : e.target.value === 'Subsanada voluntariamente' ? 13750 : 6875;
          $('#m-grad').textContent = F.moneda(-r); $('#m-total').textContent = F.moneda(27500 - r);
        });
        $('#m-subs').value = 'Subsanada voluntariamente';
        var b = $('#btn-mul'); if (b && !b.disabled) b.addEventListener('click', function () {
          R.limpiarError('m-fecha'); if (!$('#m-fecha').value) { R.marcarError('m-fecha', 'Indica la fecha de la infracción.').focus(); return; }
          $('#res-mul').innerHTML = R.aviso('exito', 'Multa propuesta', 'MT-2027-000015 queda en revisión. Un supervisor la revisa antes de emitir la Resolución de Multa; luego pasa a la cuenta corriente.');
        });
      }
    };
  };

  /* ======================= MUL-02 Sanciones administrativas ======================= */
  R.vistas['MUL-02'] = function (ctx) {
    var PASOS = ['Notificación de infracción', 'Descargo', 'Aprobación', 'Resolución de sanción', 'Cuenta corriente'];
    return {
      subtitulo: 'Cada área impone sus sanciones con su propia numeración y autoridad. Rentas registra la deuda y la cobra; no es una multa tributaria.',
      acciones: R.btn(ctx, 'Registrar notificación de infracción', { tipo: 'primario', id: 'btn-ni' }),
      contenido: '<div id="res-ma"></div>' + R.aviso('pend', 'Reglamento y cuadro de infracciones', 'Las infracciones y montos salen del RAS y el CUIS vigentes ' + R.pend('PE-111') + '. Áreas que sancionan y su numeración ' + R.pend('PE-112') + '.') +
        '<section class="panel"><h2>Expedientes sancionadores</h2><div class="tabla-marco"><table><caption class="sr-only">Sanciones</caption><thead><tr><th scope="col">Número</th><th scope="col">Área</th><th scope="col">Infractor</th><th scope="col">Infracción</th><th scope="col" class="num">Monto</th><th scope="col">Etapa</th><th scope="col">Acción</th></tr></thead><tbody>' +
        D.sanciones.map(function (s) {
          return fila(['<span class="mono">' + s.numero + '</span>', esc(s.area), '<a href="#/contribuyentes/ficha/' + s.codigo + '">' + esc(s.infractor) + '</a>', esc(s.infraccion), n(F.moneda(s.monto)),
            R.ins(PASOS[s.paso - 1] + ' · ' + s.estado, s.paso >= 5 ? 'exito' : 'info'),
            s.paso === 3 ? R.btn(ctx, 'Generar resolución', { chico: true, id: 'gr-' + s.numero }) : s.paso >= 5 ? '<a href="#/cuenta/estado/' + s.codigo + '">Ver deuda</a>' : '']);
        }).join('') + '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Las infracciones son códigos de ejemplo.</p></section>' +
        '<section class="panel"><h2>Etapas del procedimiento</h2>' + R.pasos(PASOS, 2) + '<p class="pequeno texto-2" style="margin-top:var(--s-3)">El infractor puede presentar su descargo antes de que se resuelva. La resolución se notifica; si no se paga ni se impugna, puede ir a coactivo como deuda no tributaria.</p></section>' +
        '<section class="panel" id="form-ni" hidden><h2>Notificación de infracción</h2><div class="form-rejilla">' +
        R.campo({ id: 'ni-area', label: 'Área que sanciona', opciones: ['Gerencia de Desarrollo Económico (ejemplo)', 'Subgerencia de Transporte (ejemplo)'] }) +
        R.campo({ id: 'ni-inf', label: 'Infractor', opciones: D.contribuyentes.map(function (c) { return [c.codigo, c.nombre]; }) }) +
        R.campo({ id: 'ni-cod', label: 'Infracción (cuadro vigente)', opciones: ['C-01 · Atender sin licencia vigente', 'C-04 · Ocupar la vía pública sin autorización', 'T-07 · Estacionar en zona prohibida'] }) +
        R.campo({ id: 'ni-fecha', label: 'Fecha y lugar', valor: '15/03/2027 · Av. Demostración 640' }) +
        R.campo({ id: 'ni-notif', label: 'Notificador', opciones: ['Notificador Demo 01', 'Notificador Demo 02'] }) + '</div>' +
        '<p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="ni-guardar">Guardar notificación</button></p></section>',
      despues: function () {
        var b = $('#btn-ni'); if (b && !b.disabled) b.addEventListener('click', function () { $('#form-ni').hidden = false; $('#ni-area').focus(); });
        $('#ni-guardar').addEventListener('click', function () { $('#form-ni').hidden = true; $('#res-ma').innerHTML = R.aviso('exito', 'Notificación registrada', 'GDE-NI-2027-0042 · el infractor tiene plazo para presentar su descargo.'); });
        var g = document.getElementById('gr-TRA-NI-2027-0108');
        if (g && !g.disabled) g.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Generar resolución de sanción', accion: 'Emitir resolución', recurso: 'expediente TRA-NI-2027-0108', sinMotivo: true, textoConfirmacion: 'La resolución la firma la autoridad del área. Se crea la deuda en la cuenta corriente del infractor.',
            resumen: [['Infractor', 'Pedro Ejemplo Chávez'], ['Monto', F.moneda(11000) + ' ' + R.ficticio()], ['Área', 'Subgerencia de Transporte (ejemplo)']],
            aprobador: { perfil: 'supervisor', propio: true, texto: 'Firma la autoridad competente del área sancionadora.' },
            alConfirmar: function (huella) { $('#res-ma').innerHTML = R.aviso('exito', 'Resolución emitida', 'TRA-RS-2027-0051 · pasa a notificación y la deuda aparece en la cuenta corriente.') + huella; g.disabled = true; } });
        });
      }
    };
  };

  /* ======================= FIS-01 Bandeja de casos ======================= */
  R.vistas['FIS-01'] = function (ctx) {
    var est = { 'Inspección realizada': 'info', 'Requerimiento notificado': 'alerta', 'Diferencia en revisión': 'exito' };
    function pintarCand() {
      $('#fis-cand').innerHTML = D.candidatosFis.length ? '<ul style="list-style:none;padding:0;margin:0">' + D.candidatosFis.map(function (c) {
        return '<li style="padding:var(--s-3) 0;border-bottom:1px solid var(--c-borde);display:flex;flex-wrap:wrap;gap:var(--s-3);justify-content:space-between"><span><strong>' + esc(c.nombre) + '</strong> · ' + esc(c.predio) + '<br><span class="pequeno">' + esc(c.regla) + '</span><br><span class="micro">' + esc(c.fuente) + '</span></span>' +
          '<span style="display:flex;gap:var(--s-2);align-items:center">' + R.btn(ctx, 'Abrir caso', { chico: true, id: 'ac-' + c.id }) + R.btn(ctx, 'Descartar', { chico: true, tipo: 'terciario', id: 'dc-' + c.id }) + '</span></li>';
      }).join('') + '</ul>' : R.estadoVacio('check', 'No hay candidatos pendientes', 'Los nuevos indicios aparecerán aquí.');
    }
    return {
      subtitulo: 'Casos asignados a ti y posibles omisos o subvaluadores detectados por reglas. Solo ves los casos que te asignaron.',
      acciones: R.btn(ctx, 'Nuevo requerimiento', { tipo: 'primario', id: 'btn-req' }),
      contenido: '<div id="res-fis"></div><section class="panel"><h2>Mis casos</h2>' + R.tabla('t-fis', { caption: 'Casos de fiscalización', filas: D.casosFis, columnas: [
          { clave: 'numero', titulo: 'Caso', orden: true, render: function (c) { return '<a class="mono" href="#/fiscalizacion/caso/' + c.numero + '">' + c.numero + '</a>'; } },
          { clave: 'nombre', titulo: 'Contribuyente', orden: true }, { clave: 'predio', titulo: 'Predio' }, { clave: 'origen', titulo: 'Origen' },
          { clave: 'plazo', titulo: 'Plazo', tipo: 'fecha', orden: true }, { clave: 'estado', titulo: 'Estado', orden: true, render: function (c) { return R.ins(c.estado, est[c.estado]); } }] }) +
        '<p class="micro" style="margin-top:var(--s-2)">Tipos y formatos de requerimiento ' + R.pend('PE-120') + '</p></section>' +
        '<section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Posibles omisos y subvaluadores · una persona decide</h2><p class="pequeno">Indicios de reglas y cruces internos. Nunca se emite un valor automáticamente: primero se abre un caso, se inspecciona y se revisa. ' + R.pend('PE-121') + '</p><div id="fis-cand"></div></section>' +
        '<section class="panel" id="fis-desc" hidden><h2>Descartar candidato</h2>' + R.campo({ id: 'fd-motivo', label: 'Motivo del descarte', tipo: 'textarea', obligatorio: true, ayuda: 'Sirve para medir la calidad de las reglas.' }) + '<p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="fd-ok">Descartar</button></p></section>',
      despues: function () {
        pintarCand();
        var actual = null;
        $('#fis-cand').addEventListener('click', function (e) {
          var b = e.target.closest('button'); if (!b || b.disabled) return;
          var id = b.id.slice(3);
          if (b.id.indexOf('ac-') === 0) { D.candidatosFis = D.candidatosFis.filter(function (c) { return c.id !== id; }); pintarCand(); $('#res-fis').innerHTML = R.aviso('exito', 'Caso abierto', 'FIS-2027-000022 a partir del candidato ' + id + '. Se registró la fuente del indicio.'); }
          else { actual = id; $('#fis-desc').hidden = false; $('#fd-motivo').focus(); }
        });
        $('#fd-ok').addEventListener('click', function () {
          R.limpiarError('fd-motivo'); if ($('#fd-motivo').value.trim().length < 5) { R.marcarError('fd-motivo', 'Escribe el motivo del descarte.').focus(); return; }
          D.candidatosFis = D.candidatosFis.filter(function (c) { return c.id !== actual; }); pintarCand(); $('#fis-desc').hidden = true;
          $('#res-fis').innerHTML = R.aviso('info', 'Candidato descartado', 'Motivo registrado para evaluar la regla.');
        });
        var b = $('#btn-req'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Nuevo requerimiento', 'Se elige el contribuyente, el tipo de requerimiento y el plazo; se imprime individual o masivamente.'); });
      }
    };
  };

  /* ======================= FIS-02 Caso: declarado frente a fiscalizado ======================= */
  R.vistas['FIS-02'] = function (ctx) {
    var c = D.casosFis.filter(function (x) { return x.numero === ctx.param; })[0] || D.casosFis[0];
    return {
      titulo: 'Caso ' + c.numero + ' · ' + c.nombre,
      subtitulo: esc(c.predio) + ' · ' + esc(c.origen),
      acciones: R.btn(ctx, 'Registrar inspección', { tipo: 'primario', id: 'btn-insp' }) + '<a class="btn" href="#/fiscalizacion/diferencia/' + c.numero + '">Determinar diferencia</a>',
      contenido: '<div id="res-c"></div>' + R.aviso('info', 'Lo declarado queda congelado', 'La comparación usa una copia de la declaración al abrir el caso. Si el contribuyente rectifica después, la evidencia de la inspección se conserva. Fiscalización trabaja integrada con Rentas ' + R.pend('PE-122') + '.') +
        '<section class="panel"><h2>Declarado frente a fiscalizado</h2><div class="tabla-marco"><table><caption class="sr-only">Comparación</caption><thead><tr><th scope="col">Dato</th><th scope="col">Declarado (DJ 2026)</th><th scope="col">Encontrado en la inspección</th><th scope="col">¿Difiere?</th></tr></thead><tbody>' +
        D.comparacionFis.map(function (r) { return fila([esc(r[0]), esc(r[1]), r[3] ? '<strong>' + esc(r[2]) + '</strong>' : esc(r[2]), r[3] ? R.ins('Sí', 'alerta') : R.ins('No', 'neutra')]); }).join('') +
        '</tbody></table></div></section>' +
        '<div class="rejilla-2"><section class="panel"><h2>Inspección</h2>' + R.dl([['Fecha', '05/03/2027 10:30'], ['Fiscalizador', 'usr.demo.fiscalizador'], ['Atendió', 'Jorge Prueba Salazar (titular)'], ['Acta', 'ACT-FIS-2027-0033']]) +
        '<h3 style="margin-top:var(--s-3)">Evidencias</h3><ul class="lista-simple pequeno"><li>Fotos de la fachada y del 2.º piso (3 archivos)</li><li>Croquis con medidas</li><li>Acta firmada</li></ul></section>' +
        '<section class="panel"><h2>Requerimientos del caso</h2><ul class="lista-simple pequeno"><li>REQ-2027-0112 · Presentar licencia de edificación · notificado 20/02/2027 · ' + R.ins('Atendido', 'exito') + '</li><li>REQ-2027-0140 · Citación a inspección · ' + R.ins('Atendido', 'exito') + '</li></ul></section></div>',
      despues: function () { var b = $('#btn-insp'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Nueva inspección', 'Se registra la ficha técnica con las mismas ayudas que el registro de predios, más fotos y acta.'); }); }
    };
  };

  /* ======================= FIS-03 Determinación de diferencia ======================= */
  R.vistas['FIS-03'] = function (ctx) {
    var c = D.casosFis.filter(function (x) { return x.numero === ctx.param; })[0] || D.casosFis[0];
    var filas = D.diferenciaFis.map(function (d) { var a = R.calcPredial(d.declarada).total, b = R.calcPredial(d.fiscalizada).total; return { anio: d.anio, bd: d.declarada, bf: d.fiscalizada, ia: a, ib: b, dif: b - a }; });
    var tot = filas.reduce(function (s, f) { return s + f.dif; }, 0);
    return {
      titulo: 'Diferencia · caso ' + c.numero,
      subtitulo: esc(c.nombre) + ' · ' + esc(c.predio),
      acciones: R.btn(ctx, 'Enviar a revisión', { tipo: 'primario', id: 'btn-rev' }) + '<a class="btn" href="#/fiscalizacion/caso/' + c.numero + '">Ver caso</a>',
      contenido: '<div id="res-d"></div><section class="panel"><h2>Impuesto predial: declarado frente a fiscalizado</h2><div class="tabla-marco"><table><caption class="sr-only">Diferencia por ejercicio</caption><thead><tr><th scope="col">Ejercicio</th><th scope="col" class="num">Base declarada</th><th scope="col" class="num">Base fiscalizada</th><th scope="col" class="num">Impuesto declarado</th><th scope="col" class="num">Impuesto fiscalizado</th><th scope="col" class="num">Diferencia</th></tr></thead><tbody>' +
        filas.map(function (f) { return fila([f.anio, n(F.moneda(f.bd)), n(F.moneda(f.bf)), n(F.moneda(f.ia)), n(F.moneda(f.ib)), n('<strong>' + F.moneda(f.dif) + '</strong>')]); }).join('') +
        '</tbody><tfoot><tr><td colspan="5">Total de la diferencia</td><td class="num">' + F.moneda(tot) + '</td></tr></tfoot></table></div>' +
        '<p class="micro" style="margin-top:var(--s-2)">Mismo cálculo del impuesto predial (tramos aplicados a la base total). ' + R.ficticio() + ' · Se usa la UIT 2026 en ambos ejercicios ' + R.pend('PE-046') + '</p></section>' +
        '<div class="rejilla-2"><section class="panel"><h2>Qué se emitirá</h2><ul class="lista-simple pequeno"><li>Resolución de Determinación por la diferencia de cada ejercicio, enlazada a la base declarada.</li><li>Resolución de Multa si corresponde ' + R.pend('PE-110') + '.</li><li>Formato de los valores ' + R.pend('PE-080') + '.</li></ul></section>' +
        '<section class="panel"><h2>Revisión</h2><p class="pequeno">El fiscalizador propone. Un supervisor revisa la diferencia, su sustento y la norma antes de emitir y notificar. El contribuyente conserva su derecho a reclamar.</p></section></div>',
      despues: function () {
        var b = $('#btn-rev'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Emitir valores de fiscalización', accion: 'Aprobar y emitir', recurso: 'caso ' + c.numero, etiquetaMotivo: 'Conformidad de la revisión',
            resumen: [['Contribuyente', esc(c.nombre)], ['Diferencia total', F.moneda(tot) + ' ' + R.ficticio()], ['Valores', '2 Resoluciones de Determinación']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'fiscalizador',
            alConfirmar: function (huella) { $('#res-d').innerHTML = R.aviso('exito', 'Valores emitidos', 'RD-2027-000015 y RD-2027-000016 pasan a notificación. Si no se pagan ni se reclaman, pueden ir a coactivo.') + huella; b.disabled = true; } });
        });
      }
    };
  };

  /* ======================= COA-01 Bandeja coactiva ======================= */
  R.vistas['COA-01'] = function (ctx) {
    var est = { 'Con medida': 'error', 'Levantamiento urgente': 'error', 'Suspendido': 'neutra', 'REC notificada': 'alerta' };
    var deuda = D.expedientesCoa.reduce(function (a, e) { return a + e.deuda; }, 0);
    var kpi = function (e, v, x) { return '<div class="kpi"><div class="kpi__etiqueta">' + e + '</div><div class="kpi__valor">' + v + '</div><div class="kpi__contexto">' + x + '</div></div>'; };
    return {
      subtitulo: 'Expedientes, propuestas de ingreso y tareas con plazo. El ejecutor coactivo decide cada actuación.',
      acciones: '<a class="btn btn--primario" href="#/coactivo/ingreso">Evaluar propuestas de ingreso</a><a class="btn" href="#/coactivo/levantamiento">' + R.icono('reloj') + 'Tareas urgentes (1)</a>',
      contenido: R.aviso('error', 'Levantamiento urgente', 'EC-2026-000102 · Rosa Ejemplo Vargas: se aprobó un fraccionamiento y hay una retención bancaria. Quedan <strong>23 h</strong> para ordenar el levantamiento (Ley 32678). <a href="#/coactivo/levantamiento">Atender</a>') +
        '<div class="kpis">' + kpi('Expedientes activos', D.expedientesCoa.length, 'en esta bandeja') + kpi('Deuda en coactivo', F.moneda(deuda), R.ficticio()) + kpi('Propuestas de ingreso', D.candidatosCoa.length, 'por evaluar') + kpi('Tareas con plazo', 1, 'vence hoy') + '</div>' +
        '<section class="panel"><h2>Expedientes</h2>' + R.tabla('t-coa', { caption: 'Expedientes coactivos', filas: D.expedientesCoa, columnas: [
          { clave: 'numero', titulo: 'Expediente', orden: true, render: function (e) { return '<a class="mono" href="#/coactivo/expediente/' + e.numero + '">' + e.numero + '</a>'; } },
          { clave: 'nombre', titulo: 'Obligado', orden: true }, { clave: 'titulo', titulo: 'Título', render: function (e) { return '<span class="mono">' + e.titulo + '</span>'; } },
          { clave: 'deuda', titulo: 'Deuda', tipo: 'moneda', orden: true }, { clave: 'costas', titulo: 'Costas', tipo: 'moneda' },
          { clave: 'inicio', titulo: 'Inicio', tipo: 'fecha', orden: true },
          { clave: 'estado', titulo: 'Estado', orden: true, render: function (e) { return R.ins(e.estado, est[e.estado]) + '<div class="micro">' + esc(e.medida) + '</div>'; } }] }) + '</section>' +
        '<section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Propuestas de ingreso · el ejecutor decide</h2><ul class="lista-simple pequeno">' +
        D.candidatosCoa.map(function (c) { return '<li>' + esc(c.valor) + ' · ' + esc(c.nombre) + ' · ' + F.moneda(c.importe) + ' · ' + esc(c.origen) + '</li>'; }).join('') + '</ul></section>'
    };
  };

  /* ======================= COA-02 Evaluar ingreso y emitir REC ======================= */
  R.vistas['COA-02'] = function (ctx) {
    var ok = function (b, t) { return '<span style="display:inline-flex;gap:var(--s-1);align-items:center;color:' + (b ? 'var(--c-exito)' : 'var(--c-error)') + '">' + R.icono(b ? 'check' : 'error') + '<span class="pequeno">' + t + '</span></span>'; };
    return {
      subtitulo: 'Antes de iniciar, se verifica el título, que sea exigible, la notificación válida y que no haya causal de suspensión. Solo el ejecutor competente emite la REC.',
      acciones: R.btn(ctx, 'Emitir REC de las seleccionadas', { tipo: 'primario', id: 'btn-rec' }),
      contenido: '<div id="res-rec"></div>' + R.aviso('pend', 'Competencia del ejecutor', 'Designación del ejecutor y auxiliares ' + R.pend('PE-130') + ' · Formatos de REC ' + R.pend('PE-131') + ' · Documento que hoy se llama «REC» ' + R.pend('PE-133')) +
        '<section class="panel"><h2>Propuestas de ingreso</h2><div class="tabla-marco"><table><caption class="sr-only">Lista de verificación</caption><thead><tr><th scope="col"><span class="sr-only">Elegir</span></th><th scope="col">Título</th><th scope="col">Obligado</th><th scope="col" class="num">Importe</th><th scope="col">Título válido</th><th scope="col">Notificación válida</th><th scope="col">Exigible</th><th scope="col">Sin suspensión</th><th scope="col">Resultado</th></tr></thead><tbody>' +
        D.candidatosCoa.map(function (c) {
          var adm = c.notif && c.plazo && !c.susp;
          return fila([adm ? '<input type="checkbox" data-rec="' + c.valor + '" checked aria-label="Elegir ' + c.valor + '" style="width:1.1rem;height:1.1rem">' : '', '<a class="mono" href="#/valores/detalle/' + c.valor + '">' + c.valor + '</a>', esc(c.nombre), n(F.moneda(c.importe)),
            ok(true, 'Sí'), ok(c.notif, c.notif ? 'Sí' : 'No'), ok(c.plazo, c.plazo ? 'Sí' : 'No'), ok(!c.susp, c.susp ? 'No' : 'Sí'),
            adm ? R.ins('Admisible', 'exito') : '<span class="pequeno">Falta notificación válida</span> ' + R.btn(ctx, 'Devolver al área', { chico: true, tipo: 'terciario', id: 'dv-' + c.valor })]);
        }).join('') + '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">La REC se puede emitir de forma individual o para varios títulos a la vez; cada una genera su propio expediente o se agrupa por obligado.</p></section>',
      despues: function () {
        var dv = document.getElementById('dv-OP-2027-000171'); if (dv && !dv.disabled) dv.addEventListener('click', function () { $('#res-rec').innerHTML = R.aviso('info', 'Título devuelto', 'OP-2027-000171 vuelve a Valores para completar la notificación.'); dv.disabled = true; });
        var b = $('#btn-rec'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          var sel = Array.prototype.slice.call(document.querySelectorAll('[data-rec]:checked')).map(function (x) { return x.dataset.rec; });
          if (!sel.length) { R.avisar('alerta', 'Elige al menos un título', 'Marca los títulos admisibles.'); return; }
          R.confirmarSensible({ titulo: 'Emitir Resolución de Ejecución Coactiva', accion: 'Emitir ' + sel.length + ' REC', peligro: true, recurso: 'títulos ' + sel.join(', '), sinMotivo: true,
            textoConfirmacion: 'Se inicia el procedimiento coactivo y se otorga al obligado el plazo de ley para pagar.',
            resumen: [['Títulos', sel.join(', ')], ['Obligado', 'Ana Prueba Quispe'], ['Expediente', sel.length > 1 ? 'Uno, agrupado por obligado' : 'Uno']],
            aprobador: { perfil: 'ejecutor', propio: true, texto: 'Solo el ejecutor coactivo designado puede emitir la REC. Confirma tu identidad.' },
            alConfirmar: function (huella) { $('#res-rec').innerHTML = R.aviso('exito', 'REC emitida', 'Expediente EC-2027-000019 · REC N.º 1 lista para notificar.') + huella; b.disabled = true; } });
        });
      }
    };
  };

  /* ======================= COA-03 Expediente coactivo ======================= */
  R.vistas['COA-03'] = function (ctx) {
    var e = D.expedientesCoa.filter(function (x) { return x.numero === ctx.param; })[0] || D.expedientesCoa[0];
    return {
      titulo: 'Expediente ' + e.numero,
      subtitulo: esc(e.nombre) + ' · título ' + e.titulo + ' · iniciado el ' + F.fecha(e.inicio),
      acciones: R.btn(ctx, 'Registrar actuación', { tipo: 'primario', id: 'btn-act' }) + R.btn(ctx, 'Ordenar medida', { id: 'btn-med' }) + R.btn(ctx, 'Acumular expedientes', { tipo: 'terciario', id: 'btn-acu' }),
      contenido: '<div id="res-exp"></div><div class="kpis">' +
        [['Deuda', F.moneda(e.deuda)], ['Costas y gastos', F.moneda(e.costas)], ['Total', F.moneda(e.deuda + e.costas)], ['Estado', esc(e.estado)]].map(function (k) { return '<div class="kpi"><div class="kpi__etiqueta">' + k[0] + '</div><div class="kpi__valor" style="font-size:var(--t-h2)">' + k[1] + '</div><div class="kpi__contexto">' + R.ficticio() + '</div></div>'; }).join('') + '</div>' +
        '<section class="panel"><h2>Cronología <span class="micro">· formatos de resoluciones ' + R.pend('PE-131') + '</span></h2><div class="tabla-marco"><table><caption class="sr-only">Actuaciones</caption><thead><tr><th scope="col">Fecha</th><th scope="col">Actuación</th><th scope="col">Detalle</th><th scope="col">Notificación o evidencia</th></tr></thead><tbody>' +
        D.actuacionesCoa.map(function (a) { return fila([F.fecha(a[0]), '<strong>' + esc(a[1]) + '</strong>', esc(a[2]), esc(a[3])]); }).join('') + '</tbody></table></div></section>' +
        '<div class="rejilla-2"><section class="panel"><h2>Medidas</h2><table><thead><tr><th scope="col">Medida</th><th scope="col">Tercero</th><th scope="col" class="num">Monto</th><th scope="col">Estado</th></tr></thead><tbody>' +
        fila(['Embargo en forma de retención', 'Banco de ejemplo A', n(F.moneda(51840)), R.ins('Trabada', 'error')]) + fila(['Embargo en forma de retención', 'Banco de ejemplo B', n(F.moneda(0)), R.ins('Sin fondos', 'neutra')]) +
        '</tbody></table></section><section class="panel"><h2>Costas y gastos ' + R.pend('PE-132') + '</h2><table><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Importe</th></tr></thead><tbody>' +
        fila(['Costas procesales (ejemplo)', n(F.moneda(3000))]) + fila(['Gastos de diligencia (ejemplo)', n(F.moneda(1500))]) + '</tbody><tfoot><tr><td>Total</td><td class="num">' + F.moneda(e.costas) + '</td></tr></tfoot></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Se pueden pagar a cuenta. Solo se cobran costas con sustento.</p></section></div>' +
        R.aviso('info', 'Sin asistencia de IA en medidas', 'Las resoluciones que ordenan medidas no usan borradores asistidos. Las redacta y firma el ejecutor.'),
      despues: function () {
        var a = $('#btn-act'); if (a && !a.disabled) a.addEventListener('click', function () { R.avisar('info', 'Registrar actuación', 'Se elige el tipo de resolución o diligencia, se adjunta la evidencia y se calcula el plazo.'); });
        var c = $('#btn-acu'); if (c && !c.disabled) c.addEventListener('click', function () { R.avisar('info', 'Acumular', 'Se eligen los expedientes del mismo obligado y la deuda se unifica en el expediente principal.'); });
        var m = $('#btn-med'); if (m && !m.disabled) m.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Ordenar medida cautelar', accion: 'Ordenar embargo', peligro: true, recurso: 'expediente ' + e.numero, etiquetaMotivo: 'Fundamento de la medida',
            resumen: [['Medida', 'Embargo en forma de retención'], ['Terceros', 'Entidades financieras (ejemplo)'], ['Hasta por', F.moneda(e.deuda + e.costas)]],
            aprobador: { perfil: 'ejecutor', propio: true },
            alConfirmar: function (huella) { $('#res-exp').innerHTML = R.aviso('exito', 'Medida ordenada', 'Resolución N.º 4 y oficios a las entidades financieras generados.') + huella; } });
        });
      }
    };
  };

  /* ======================= COA-04 Suspensión y levantamiento ======================= */
  R.vistas['COA-04'] = function (ctx) {
    return {
      subtitulo: 'Si se paga la deuda o se aprueba un fraccionamiento y hay una retención bancaria, el levantamiento es urgente.',
      acciones: R.btn(ctx, 'Ordenar levantamiento', { tipo: 'primario', id: 'btn-lev', icono: 'reloj' }) + R.btn(ctx, 'Suspender procedimiento', { id: 'btn-susp' }),
      contenido: '<div id="res-lev"></div><section class="panel" style="border-left:4px solid var(--c-error)"><h2>EC-2026-000102 · Rosa Ejemplo Vargas</h2>' +
        R.dl([['Motivo', 'Convenio de fraccionamiento CV-2027-000046 aprobado el 15/03/2027 a las 09:10'], ['Medida vigente', 'Retención bancaria en Banco de ejemplo A'], ['Plazo para actuar', '<strong style="color:var(--c-error)">Vence el 16/03/2027 a las 09:10 · quedan 23 h</strong>'], ['Base legal', 'Ley 32678 (incorpora arts. 33-C a 33-E a la Ley 26979)']]) + '</section>' +
        '<section class="panel" id="form-susp" hidden><h2>Suspender procedimiento</h2><div class="form-rejilla">' +
        R.campo({ id: 's-causal', label: 'Causal', opciones: ['Deuda pagada', 'Fraccionamiento aprobado', 'Reclamo presentado dentro del plazo', 'Deuda prescrita', 'Otra causal de la ley'] }) +
        R.campo({ id: 's-sust', label: 'Documento de sustento', opciones: ['Recibo de pago', 'Resolución de aprobación del convenio', 'Cargo del reclamo'] }) + '</div>' +
        '<p class="micro" style="margin-top:var(--s-2)">Causales de suspensión según la Ley 26979 (art. 31). Suspender impide ordenar nuevas medidas.</p>' +
        '<p><button type="button" class="btn btn--primario" id="s-ok">Suspender</button></p></section>' +
        '<section class="panel"><h2>Historial de levantamientos</h2><table><thead><tr><th scope="col">Expediente</th><th scope="col">Motivo</th><th scope="col">Ordenado</th><th scope="col">Recepción del banco</th></tr></thead><tbody>' +
        fila(['EC-2025-000190', 'Deuda pagada', '02/02/2027 11:20 (a las 6 h)', 'Cargo del 02/02/2027']) + fila(['EC-2025-000207', 'Fraccionamiento aprobado', '14/01/2027 16:00 (a las 20 h)', 'Cargo del 15/01/2027']) +
        '</tbody></table></section>',
      despues: function () {
        var s = $('#btn-susp'); if (s && !s.disabled) s.addEventListener('click', function () { $('#form-susp').hidden = false; $('#s-causal').focus(); });
        $('#s-ok').addEventListener('click', function () { $('#form-susp').hidden = true; $('#res-lev').innerHTML = R.aviso('info', 'Procedimiento suspendido', 'Causal: ' + esc($('#s-causal').value) + '. No se pueden ordenar nuevas medidas.'); });
        var b = $('#btn-lev'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Ordenar levantamiento de la retención', accion: 'Ordenar levantamiento', recurso: 'expediente EC-2026-000102', sinMotivo: true, textoConfirmacion: 'Se genera la resolución de levantamiento y el oficio al banco. Registra luego el cargo de recepción.',
            resumen: [['Expediente', 'EC-2026-000102'], ['Medida', 'Retención en Banco de ejemplo A'], ['Motivo', 'Fraccionamiento aprobado']],
            aprobador: { perfil: 'ejecutor', propio: true },
            alConfirmar: function (huella) { $('#res-lev').innerHTML = R.aviso('exito', 'Levantamiento ordenado a tiempo', 'Resolución N.º 5 y oficio al banco generados a las ' + R.horaActual() + '. Pendiente: registrar el cargo de recepción del banco.') + huella; b.disabled = true; } });
        });
      }
    };
  };

  /* ======================= DES-01 Descargos ======================= */
  R.vistas['DES-01'] = function (ctx) {
    function pintar() {
      $('#des-lista').innerHTML = '<div class="tabla-marco"><table><caption class="sr-only">Descargos</caption><thead><tr><th scope="col">Número</th><th scope="col">Tipo</th><th scope="col">Contribuyente</th><th scope="col">Deuda</th><th scope="col" class="num">Monto</th><th scope="col">Expediente y resolución</th><th scope="col">Estado</th><th scope="col">Acción</th></tr></thead><tbody>' +
        D.descargos.map(function (d) {
          return fila(['<span class="mono">' + d.numero + '</span>', esc(d.tipo), esc(d.contribuyente), esc(d.deuda), n(F.moneda(d.monto)), esc(d.expediente) + '<div class="micro">' + esc(d.resolucion) + '</div>',
            R.ins(d.estado, d.estado === 'Aplicado' ? 'exito' : d.estado === 'Extornado' ? 'neutra' : 'alerta'),
            d.estado === 'Aplicado' ? R.btn(ctx, 'Extornar', { chico: true, tipo: 'terciario', id: 'xd-' + d.numero }) : '']);
        }).join('') + '</tbody></table></div>';
    }
    return {
      subtitulo: 'Dar de baja una deuda por compensación, prescripción, exoneración o anulación exige expediente, resolución y la aprobación de otra persona.',
      acciones: R.btn(ctx, 'Solicitar descargo', { tipo: 'primario', id: 'btn-des' }),
      contenido: '<div id="res-des"></div><section class="panel"><h2>Nuevo descargo</h2><div class="form-rejilla">' +
        R.campo({ id: 'd-tipo', label: 'Tipo de descargo', opciones: ['Compensación', 'Prescripción', 'Exoneración', 'Anulación'], pend: 'PE-140' }) +
        R.campo({ id: 'd-contrib', label: 'Contribuyente', opciones: [['CTB-000101', 'Ana Prueba Quispe']] }) +
        R.campo({ id: 'd-deuda', label: 'Deuda', opciones: D.obligacionesDe('CTB-000101').filter(function (o) { return D.saldo(o).total > 0; }).map(function (o) { return [o.id, o.tributo + ' ' + o.anio + ' · ' + o.periodo]; }) }) +
        R.campo({ id: 'd-monto', label: 'Monto (S/)', tipo: 'number', valor: '64.50', obligatorio: true }) +
        R.campo({ id: 'd-exp', label: 'N.º de expediente', obligatorio: true, valor: '' }) +
        R.campo({ id: 'd-res', label: 'N.º y fecha de la resolución', obligatorio: true, valor: '', pend: 'PE-141' }) + '</div>' +
        '<p class="micro" style="margin-top:var(--s-2)">La baja se registra como un movimiento con su sustento; la deuda original y su historia se conservan.</p></section>' +
        '<section class="panel"><h2>Descargos registrados</h2><div id="des-lista"></div></section>',
      despues: function () {
        pintar();
        $('#des-lista').addEventListener('click', function (e) {
          var b = e.target.closest('[id^="xd-"]'); if (!b || b.disabled) return;
          var d = D.descargos.filter(function (x) { return x.numero === b.id.slice(3); })[0];
          R.confirmarSensible({ titulo: 'Extornar descargo ' + d.numero, accion: 'Extornar descargo', peligro: true, recurso: 'descargo ' + d.numero, etiquetaMotivo: 'Motivo y documento de sustento',
            resumen: [['Descargo', d.tipo + ' · ' + esc(d.deuda)], ['Monto', F.moneda(d.monto)], ['Efecto', 'La deuda vuelve a estar pendiente; el descargo queda en el historial']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) { d.estado = 'Extornado'; pintar(); $('#res-des').innerHTML = R.aviso('exito', 'Descargo extornado', d.numero + ' quedó revertido con un movimiento inverso.') + huella; } });
        });
        var b = $('#btn-des'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          var errs = [];
          ['d-monto', 'd-exp', 'd-res'].forEach(R.limpiarError);
          if (!(Number($('#d-monto').value) > 0)) errs.push(['d-monto', 'Escribe el monto.']);
          if (!$('#d-exp').value.trim()) errs.push(['d-exp', 'El número de expediente es obligatorio.']);
          if (!$('#d-res').value.trim()) errs.push(['d-res', 'La resolución es obligatoria.']);
          if (errs.length) { errs.forEach(function (x) { R.marcarError(x[0], x[1]); }); $('#' + errs[0][0]).focus(); return; }
          var monto = Math.round(Number($('#d-monto').value) * 100);
          R.confirmarSensible({ titulo: 'Aprobar descargo por ' + $('#d-tipo').value.toLowerCase(), accion: 'Aprobar descargo', recurso: 'deuda ' + $('#d-deuda').value, etiquetaMotivo: 'Comentario de la aprobación',
            resumen: [['Tipo', esc($('#d-tipo').value)], ['Deuda', esc($('#d-deuda').selectedOptions[0].textContent)], ['Monto', F.moneda(monto)], ['Expediente', esc($('#d-exp').value)], ['Resolución', esc($('#d-res').value)]],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) {
              D.descargos.unshift({ numero: 'DES-2027-0014', tipo: $('#d-tipo').value, contribuyente: 'Ana Prueba Quispe', deuda: $('#d-deuda').selectedOptions[0].textContent, monto: monto, expediente: $('#d-exp').value, resolucion: $('#d-res').value, estado: 'Aplicado' });
              pintar(); $('#res-des').innerHTML = R.aviso('exito', 'Descargo aplicado', 'DES-2027-0014 · se registró un movimiento de baja enlazado a la resolución.') + huella;
            } });
        });
      }
    };
  };

  /* ======================= DES-02 Transferencia de pagos ======================= */
  R.vistas['DES-02'] = function (ctx) {
    return {
      subtitulo: 'Cuando un pago se registró a nombre de otra persona, se traslada con movimientos de salida y entrada. El recibo original no cambia.',
      acciones: R.btn(ctx, 'Solicitar transferencia', { tipo: 'primario', id: 'btn-tr' }),
      contenido: '<div id="res-tr"></div><section class="panel"><h2>Datos de la transferencia</h2><div class="form-rejilla">' +
        R.campo({ id: 't-rec', label: 'Recibo pagado', opciones: [['R-002-0001044', 'R-002-0001044 · Luis Demo Rojas · S/ 54.00 · 10/03/2027']] }) +
        R.campo({ id: 't-dest', label: 'Contribuyente correcto', opciones: [['CTB-000104', 'Rosa Ejemplo Vargas']] }) +
        R.campo({ id: 't-monto', label: 'Monto a transferir (S/)', tipo: 'number', valor: '54.00' }) +
        R.campo({ id: 't-exp', label: 'Expediente y resolución', valor: 'EXP-2027-000470 · RG-2027-0040 (ejemplo)', pend: 'PE-141' }) + '</div></section>' +
        '<section class="panel"><h2>Así se registrará</h2><table><thead><tr><th scope="col">Contribuyente</th><th scope="col">Movimiento</th><th scope="col" class="num">Importe</th></tr></thead><tbody>' +
        fila(['Luis Demo Rojas', 'Salida del pago (vuelve a quedar pendiente su deuda)', n(F.moneda(-5400))]) + fila(['Rosa Ejemplo Vargas', 'Entrada del pago (se aplica a su deuda)', n(F.moneda(5400))]) +
        fila(['Recibo R-002-0001044', 'Sin cambios: se anota la referencia de la transferencia', n('—')]) + '</tbody></table></section>' +
        '<section class="panel"><h2>Transferencias registradas</h2><ul class="lista-simple pequeno">' +
        D.transferencias.map(function (t) { return '<li><span class="mono">' + t.numero + '</span> · recibo ' + t.recibo + ' · de ' + esc(t.origen) + ' a ' + esc(t.destino) + ' · ' + F.moneda(t.monto) + ' · ' + R.ins(t.estado, 'exito') + '</li>'; }).join('') + '</ul></section>',
      despues: function () {
        var b = $('#btn-tr'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Aprobar transferencia de pago', accion: 'Aprobar transferencia', recurso: 'recibo R-002-0001044', etiquetaMotivo: 'Comentario de la aprobación',
            resumen: [['De', 'Luis Demo Rojas'], ['A', 'Rosa Ejemplo Vargas'], ['Monto', F.moneda(5400)], ['Recibo', 'No se modifica']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) { $('#res-tr').innerHTML = R.aviso('exito', 'Transferencia aplicada', 'TRP-2027-0004 · movimientos de salida y entrada registrados.') + huella; b.disabled = true; } });
        });
      }
    };
  };

  /* ======================= DES-03 Recursos y prescripción ======================= */
  R.vistas['DES-03'] = function (ctx) {
    var tipo = { 'En evaluación': 'alerta', 'Elevado al Tribunal Fiscal': 'info', 'Cálculo con evidencia incompleta': 'error' };
    return {
      subtitulo: 'Reclamos, apelaciones y solicitudes de prescripción con sus plazos. La prescripción no borra deuda por antigüedad: se resuelve con un cálculo documentado.',
      acciones: R.btn(ctx, 'Registrar expediente', { tipo: 'primario', id: 'btn-expr' }),
      contenido: '<div id="res-rec2"></div><section class="panel"><h2>Expedientes</h2>' + R.tabla('t-rec', { caption: 'Expedientes', filas: D.expedientesRec, columnas: [
          { clave: 'numero', titulo: 'Expediente', orden: true, render: function (x) { return '<span class="mono">' + x.numero + '</span>'; } },
          { clave: 'tipo', titulo: 'Tipo', orden: true }, { clave: 'contribuyente', titulo: 'Contribuyente', orden: true }, { clave: 'asunto', titulo: 'Asunto' },
          { clave: 'presentado', titulo: 'Presentado', tipo: 'fecha', orden: true }, { clave: 'plazo', titulo: 'Plazo para resolver', render: function (x) { return x.plazo === '—' ? '—' : F.fecha(x.plazo); } },
          { clave: 'estado', titulo: 'Estado', orden: true, render: function (x) { return R.ins(x.estado, tipo[x.estado]); } }] }) + '</section>' +
        '<section class="panel"><h2>Solicitud de prescripción EXP-2027-000318 · Pedro Ejemplo Chávez</h2><p class="pequeno">Impuesto predial 2019. Plazo general: 4 años si se presentó declaración y 6 años si no (Código Tributario, art. 43). El cómputo considera interrupciones y suspensiones (arts. 44 a 46).</p>' +
        '<div class="tabla-marco"><table><caption class="sr-only">Eventos</caption><thead><tr><th scope="col">Fecha</th><th scope="col">Evento</th><th scope="col">Efecto</th><th scope="col">Evidencia</th></tr></thead><tbody>' +
        D.eventosPrescripcion.map(function (ev) { var falta = /no registrada/.test(ev[3]); return fila([F.fecha(ev[0]), esc(ev[1]), esc(ev[2]), falta ? R.ins(ev[3], 'error') : esc(ev[3])]); }).join('') +
        '</tbody></table></div>' + R.aviso('alerta', 'No se puede concluir todavía', 'Falta la evidencia de un evento que suspende el plazo. El sistema no la asume: se pide a Archivo o a Jurídica antes de resolver. Política de cálculo ' + R.pend('PE-142')) +
        '<p style="margin-top:var(--s-3)">' + R.btn(ctx, 'Registrar resolución', { id: 'btn-resolver' }) + '</p></section>',
      despues: function () {
        var b = $('#btn-expr'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Nuevo expediente', 'Se registra el tipo de trámite, la fecha de presentación y las deudas afectadas; el plazo se calcula desde la presentación.'); });
        var r = $('#btn-resolver'); if (r && !r.disabled) r.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Resolver solicitud de prescripción', accion: 'Registrar resolución', recurso: 'EXP-2027-000318', etiquetaMotivo: 'Fundamento de la decisión',
            resumen: [['Deuda', 'Impuesto predial 2019'], ['Decisión', 'Improcedente por ahora: evidencia incompleta'], ['Efecto', 'La deuda sigue vigente; no se borra nada']],
            aprobador: { perfil: 'supervisor', propio: true, texto: 'Resuelve la autoridad competente.' },
            alConfirmar: function (huella) { $('#res-rec2').innerHTML = R.aviso('exito', 'Resolución registrada', 'Se notificará al contribuyente. Si luego se acredita la evidencia, puede volver a evaluarse.') + huella; r.disabled = true; } });
        });
      }
    };
  };
})(window.RENTAS = window.RENTAS || {});
