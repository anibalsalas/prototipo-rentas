/* Administración Tributaria: Determinación y emisión (DET), Arbitrios (ARB), Descuentos y beneficios (BEN). */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;
  var UIT = 550000; /* S/ 5,500 = UIT 2026 (DS 301-2025-EF), usada como ejemplo: PE-046 */

  /* Impuesto predial con tramos nacionales (TUO de Tributación Municipal, art. 13), aplicados una vez a la base total. */
  function predial(base) {
    var l1 = 15 * UIT, l2 = 60 * UIT;
    var b1 = Math.min(base, l1), b2 = Math.max(0, Math.min(base, l2) - l1), b3 = Math.max(0, base - l2);
    var t1 = Math.round(b1 * 2 / 1000), t2 = Math.round(b2 * 6 / 1000), t3 = Math.round(b3 * 10 / 1000);
    return { b1: b1, b2: b2, b3: b3, t1: t1, t2: t2, t3: t3, total: t1 + t2 + t3 };
  }
  R.calcPredial = predial;

  /* ======================= DET-01 Determinación predial explicada ======================= */
  R.vistas['DET-01'] = function (ctx) {
    var c = R.ctxContribuyente(ctx), predios = D.prediosDe(c.codigo);
    var base = predios.reduce(function (s, p) { return s + (p.valorParte || p.autoavaluo); }, 0);
    var r = predial(base);
    var porSeparado = predios.reduce(function (s, p) { return s + predial(p.valorParte || p.autoavaluo).total; }, 0);
    var cuota = Math.floor(r.total / 4), resto = r.total - cuota * 4;
    var venc = ['2027-02-26', '2027-05-31', '2027-08-31', '2027-11-30'];
    var fila = function (t, v, cls) { return '<div class="calculo__fila' + (cls ? ' ' + cls : '') + '"><span>' + t + '</span><span class="num">' + v + '</span></div>'; };
    return {
      titulo: 'Impuesto predial 2027 · ' + c.nombre,
      subtitulo: 'Primero se simula y revisa; luego se emite. La simulación no genera deuda.',
      acciones: R.btn(ctx, 'Emitir determinación', { tipo: 'primario', id: 'btn-emitir', icono: 'check' }) +
        '<button type="button" class="btn" id="btn-resimular">Volver a simular</button><a class="btn btn--terciario" href="#/declaraciones/lista/' + c.codigo + '">Ver declaración</a>',
      contenido: '<div id="res-det"></div>' + R.cabeceraContribuyente(c) +
        '<section class="panel">' + R.pasos(['Simular', 'Revisar', 'Emitir'], 1) + '</section>' +
        '<section class="panel"><h2>1. Valor de los predios</h2><div class="tabla-marco"><table><caption class="sr-only">Predios</caption><thead><tr><th scope="col">Predio</th><th scope="col" class="num">Autoavalúo</th><th scope="col" class="num">Participación</th><th scope="col" class="num">Valor que le corresponde</th></tr></thead><tbody>' +
        predios.map(function (p) { return '<tr><td>' + esc(p.direccion) + '</td><td class="num">' + F.moneda(p.autoavaluo) + '</td><td class="num">' + (p.valorParte ? '50 %' : '100 %') + '</td><td class="num">' + F.moneda(p.valorParte || p.autoavaluo) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td colspan="3">Base imponible (suma de todos sus predios en el distrito)</td><td class="num">' + F.moneda(base) + '</td></tr></tfoot></table></div>' +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Autoavalúo con aranceles, valores unitarios y depreciación del ejercicio ' + R.pend('PE-040') + '</p></section>' +
        '<div class="rejilla-2"><section class="panel"><h2>2. Cómo se calculó</h2><div class="calculo">' +
        fila('UIT del ejercicio ' + R.pend('PE-046'), F.moneda(UIT)) +
        fila('Tramo 1: hasta 15 UIT (' + F.moneda(r.b1) + ') × 0.2 %', F.moneda(r.t1)) +
        fila('Tramo 2: más de 15 y hasta 60 UIT (' + F.moneda(r.b2) + ') × 0.6 %', F.moneda(r.t2)) +
        fila('Tramo 3: más de 60 UIT (' + F.moneda(r.b3) + ') × 1.0 %', F.moneda(r.t3)) +
        fila('Monto mínimo ' + R.pend('PE-041'), 'No aplica') +
        fila('Deducción por beneficio', 'No aplica (solicitud observada)') +
        fila('Impuesto predial anual', F.moneda(r.total), 'calculo__fila--total') + '</div>' +
        '<p class="micro" style="margin-top:var(--s-3)">Tramos y tasas: Ley de Tributación Municipal, art. 13. Los tramos se aplican una sola vez a la suma de todos los predios: calcularlos predio por predio daría ' + F.moneda(porSeparado) + ', que sería incorrecto.</p></section>' +
        '<section class="panel"><h2>3. Cuotas</h2><table><thead><tr><th scope="col">Cuota</th><th scope="col">Vence ' + R.pend('PE-042') + '</th><th scope="col" class="num">Monto</th></tr></thead><tbody>' +
        venc.map(function (v, i) { return '<tr><td>Cuota ' + (i + 1) + '</td><td>' + F.fecha(v) + '</td><td class="num">' + F.moneda(cuota + (i === 3 ? resto : 0)) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td colspan="2">Total anual</td><td class="num">' + F.moneda(r.total) + '</td></tr></tfoot></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">También puede pagar todo al contado hasta el primer vencimiento. Las cuotas 2 a 4 se reajustan con el IPM a la fecha de pago.</p></section></div>',
      despues: function () {
        $('#btn-resimular').addEventListener('click', function () { R.avisar('info', 'Simulación actualizada', 'Se usaron los datos vigentes de la declaración y los parámetros.'); });
        var b = $('#btn-emitir'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Emitir impuesto predial 2027', accion: 'Emitir ' + F.moneda(r.total), recurso: 'determinación predial 2027 de ' + c.codigo, sinMotivo: true,
            textoConfirmacion: 'Se crearán 4 cuotas en el estado de cuenta y la Hoja de liquidación. Si vuelves a pulsar, no se duplica.',
            resumen: [['Contribuyente', esc(c.nombre)], ['Base imponible', F.moneda(base)], ['Impuesto anual', F.moneda(r.total) + ' ' + R.ficticio()], ['Cuotas', '4']],
            alConfirmar: function (huella) {
              $('#res-det').innerHTML = R.aviso('exito', 'Determinación emitida', 'DET-2027-000318 · 4 cuotas. <a href="#/cuenta/estado/' + c.codigo + '">Ver estado de cuenta</a> · <a href="#/determinacion/documentos">Ver documentos</a>') + huella;
              b.disabled = true; $('#res-det').scrollIntoView();
            } });
        });
      }
    };
  };

  /* ======================= DET-03 Documentos emitidos ======================= */
  R.vistas['DET-03'] = function (ctx) {
    var c = R.ctxContribuyente(ctx);
    var docs = [
      { doc: 'Hoja de liquidación del impuesto predial 2027', tipo: 'Liquidación', fecha: '2027-02-12', estado: 'Emitido', ver: 'a3f9-71c2' },
      { doc: 'Hoja Resumen (HR) 2027', tipo: 'Declaración', fecha: '2027-02-10', estado: 'Emitido', ver: '5b20-9e4d' },
      { doc: 'Hoja de predio urbano · Jr. Los Ejemplos 145', tipo: 'Declaración', fecha: '2027-02-10', estado: 'Emitido', ver: 'c41e-0a77' },
      { doc: 'Hoja de predio urbano · Av. Demostración 640', tipo: 'Declaración', fecha: '2027-02-10', estado: 'Emitido', ver: 'e8d1-33b0' },
      { doc: 'Constancia de presentación DJ-2027-000318', tipo: 'Constancia', fecha: '2027-02-10', estado: 'Emitido', ver: '17aa-c5f2' },
      { doc: 'Cuponera de pago 2027', tipo: 'Cuponera', fecha: '2027-02-12', estado: 'Emitido', ver: '90bc-4e18' },
      { doc: 'Hoja de predio urbano · alta en trámite', tipo: 'Declaración', fecha: '2027-03-14', estado: 'Borrador', ver: '—' }
    ];
    return {
      acciones: '<button type="button" class="btn btn--primario" id="btn-desc-todo">' + R.icono('descargar') + 'Descargar todo (PDF)</button>',
      contenido: R.cabeceraContribuyente(c) + '<section class="panel"><h2>Documentos</h2>' + R.tabla('t-docs', { caption: 'Documentos emitidos', filas: docs, ordenInicial: 'fecha',
        columnas: [
          { clave: 'doc', titulo: 'Documento', orden: true }, { clave: 'tipo', titulo: 'Tipo', orden: true }, { clave: 'fecha', titulo: 'Fecha', tipo: 'fecha', orden: true },
          { clave: 'estado', titulo: 'Estado', orden: true, render: function (d) { return R.ins(d.estado, d.estado === 'Emitido' ? 'exito' : 'alerta'); } },
          { clave: 'ver', titulo: 'Código de verificación', render: function (d) { return '<span class="mono micro">' + d.ver + '</span>'; } },
          { clave: 'x', titulo: 'Acción', render: function (d) { return d.estado === 'Emitido' ? '<button type="button" class="btn btn--chico" data-desc>Descargar</button>' : '<span class="micro">Aún no se puede descargar</span>'; } }]
      }) + '<p class="micro" style="margin-top:var(--s-2)">Formatos oficiales ' + R.pend('PE-045') + ' · El documento emitido no cambia; si hay un error se emite uno nuevo que lo reemplaza.</p></section>',
      despues: function () {
        $('[data-tabla="t-docs"]').addEventListener('click', function (e) { if (e.target.closest('[data-desc]')) R.avisar('info', 'Documento de ejemplo', 'En el sistema se descarga el PDF con su código de verificación.'); });
        $('#btn-desc-todo').addEventListener('click', function () { R.avisar('info', 'Descarga de ejemplo', 'Se descargan los 6 documentos emitidos en un solo archivo.'); });
      }
    };
  };

  /* ======================= ARB-01 Régimen de arbitrios ======================= */
  R.vistas['ARB-01'] = function (ctx) {
    return {
      titulo: 'Arbitrios 2027',
      subtitulo: 'Cada servicio se calcula con la ordenanza y el estudio de costos aprobados. No se escriben tasas a mano.',
      acciones: '<a class="btn btn--primario" href="#/arbitrios/liquidacion">Simular liquidación</a>' + R.btn(ctx, 'Registrar ordenanza', { id: 'btn-ord' }),
      contenido: R.aviso('alerta', 'Emisión en espera de la ordenanza', 'Los arbitrios 2027 se emitirán cuando se registre la ordenanza vigente con sus anexos ' + R.pend('PE-050') + '.') +
        '<section class="panel"><h2>Ordenanza</h2>' + R.dl([['Número', 'Por registrar ' + R.pend('PE-050')], ['Publicación', '—'], ['Vigencia', 'Ejercicio 2027'], ['Estudio de costos', 'Por adjuntar']]) + '</section>' +
        '<section class="panel"><h2>Servicios</h2><table><thead><tr><th scope="col">Servicio</th><th scope="col">Cómo se reparte el costo</th><th scope="col">Dónde se presta ' + R.pend('PE-051') + '</th><th scope="col">Periodicidad</th><th scope="col" class="num">Predio típico (trimestre)</th></tr></thead><tbody>' +
        D.arbitrios.map(function (a) { return '<tr><td>' + esc(a.servicio) + '</td><td>' + esc(a.criterio) + '</td><td>' + esc(a.zona) + '</td><td>' + esc(a.periodicidad) + '</td><td class="num">' + F.moneda(a.ejemplo) + '</td></tr>'; }).join('') +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Los montos reales salen de la ordenanza.</p></section>',
      despues: function () { var b = $('#btn-ord'); if (b && !b.disabled) b.addEventListener('click', function () { location.hash = '#/maestros/normas'; }); }
    };
  };

  /* ======================= ARB-02 Liquidación de arbitrios ======================= */
  R.vistas['ARB-02'] = function (ctx) {
    var c = R.ctxContribuyente(ctx), predios = D.prediosDe(c.codigo);
    function tabla(cod) {
      var p = D.predio(cod), f = p.uso === 'Comercio' ? 2 : 1;
      var filas = D.arbitrios.map(function (a) { return { s: a.servicio, cr: a.criterio, tri: a.ejemplo * f }; });
      var tot = filas.reduce(function (s, x) { return s + x.tri; }, 0);
      return '<table><caption class="sr-only">Liquidación</caption><thead><tr><th scope="col">Servicio</th><th scope="col">Criterio aplicado</th><th scope="col" class="num">Trimestral</th><th scope="col" class="num">Anual</th></tr></thead><tbody>' +
        filas.map(function (x) { return '<tr><td>' + esc(x.s) + '</td><td>' + esc(x.cr) + ' · uso ' + esc(p.uso.toLowerCase()) + '</td><td class="num">' + F.moneda(x.tri) + '</td><td class="num">' + F.moneda(x.tri * 4) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td colspan="2">Total del predio</td><td class="num">' + F.moneda(tot) + '</td><td class="num">' + F.moneda(tot * 4) + '</td></tr></tfoot></table>';
    }
    return {
      titulo: 'Liquidación de arbitrios 2027',
      subtitulo: 'Simulación: no genera deuda hasta que se publique la ordenanza.',
      acciones: '<button type="button" class="btn btn--primario" id="btn-sim-arb">Simular</button><a class="btn" href="#/arbitrios/regimen">Ver régimen</a>',
      contenido: R.cabeceraContribuyente(c) + '<section class="panel"><div class="filtros">' +
        R.campo({ id: 'a-predio', label: 'Predio', opciones: predios.map(function (p) { return [p.codigo, p.direccion + ' (' + p.uso + ')']; }) }) + '</div>' +
        '<div id="a-tabla" style="margin-top:var(--s-4)">' + tabla(predios[0].codigo) + '</div>' +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Simulación ' + R.pend('PE-050') + '</p></section>',
      despues: function () {
        function act() { $('#a-tabla').innerHTML = tabla($('#a-predio').value); }
        $('#a-predio').addEventListener('change', act);
        $('#btn-sim-arb').addEventListener('click', function () { act(); R.avisar('info', 'Simulación lista', 'Montos de ejemplo según el uso del predio.'); });
      }
    };
  };

  /* ======================= BEN-01 Beneficios individuales ======================= */
  R.vistas['BEN-01'] = function (ctx) {
    var tipo = { 'Aprobado': 'exito', 'Observado': 'alerta', 'En evaluación': 'info' };
    return {
      subtitulo: 'Cada beneficio necesita su solicitud, sus documentos y la aprobación de la autoridad.',
      acciones: R.btn(ctx, 'Registrar solicitud', { tipo: 'primario', id: 'btn-nueva-ben' }),
      contenido: '<div id="res-ben"></div><section class="panel"><h2>Solicitudes</h2>' + R.tabla('t-ben', { caption: 'Solicitudes de beneficio', filas: D.beneficios,
        columnas: [
          { clave: 'numero', titulo: 'Solicitud', orden: true, render: function (b) { return '<span class="mono">' + b.numero + '</span>'; } },
          { clave: 'nombre', titulo: 'Contribuyente', orden: true, render: function (b) { return '<a href="#/contribuyentes/ficha/' + b.contribuyente + '">' + esc(b.nombre) + '</a>'; } },
          { clave: 'tipo', titulo: 'Beneficio' }, { clave: 'fecha', titulo: 'Fecha', tipo: 'fecha', orden: true },
          { clave: 'estado', titulo: 'Estado', orden: true, render: function (b) { return R.ins(b.estado, tipo[b.estado]) + (b.obs ? '<div class="micro">' + esc(b.obs) + '</div>' : ''); } },
          { clave: 'resolucion', titulo: 'Resolución' },
          { clave: 'x', titulo: 'Acción', render: function (b) { return b.estado === 'En evaluación' ? R.btn(ctx, 'Resolver', { chico: true, id: 'res-' + b.numero }) : ''; } }]
      }) + '<p class="micro" style="margin-top:var(--s-2)">Quién aprueba: ' + R.pend('PE-061') + ' · El beneficio se aplica desde la fecha que indica la norma, sin borrar lo ya pagado.</p></section>' +
        '<section class="panel" id="form-ben" hidden><h2>Nueva solicitud</h2><div class="form-rejilla">' +
        R.campo({ id: 'n-contrib', label: 'Contribuyente', opciones: D.contribuyentes.map(function (c) { return [c.codigo, c.nombre]; }) }) +
        R.campo({ id: 'n-tipo', label: 'Beneficio', opciones: ['Deducción de 50 UIT (pensionista)'] }) + '</div>' +
        '<fieldset style="margin-top:var(--s-4)"><legend>Documentos presentados</legend>' +
        ['Documento que acredita la condición de pensionista', 'Declaración de ser propietario de un solo predio', 'Otros requisitos de la norma'].map(function (t, i) {
          return '<label style="display:flex;gap:var(--s-2);align-items:center;padding:var(--s-1) 0"><input type="checkbox" id="req-' + i + '" style="width:1.1rem;height:1.1rem"> ' + esc(t) + '</label>'; }).join('') +
        '</fieldset><p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="btn-guardar-ben">Guardar solicitud</button></p></section>',
      despues: function () {
        var b = $('#btn-nueva-ben'); if (b && !b.disabled) b.addEventListener('click', function () { $('#form-ben').hidden = false; $('#n-contrib').focus(); });
        $('#btn-guardar-ben').addEventListener('click', function () {
          var falta = [0, 1].filter(function (i) { return !$('#req-' + i).checked; }).length;
          $('#res-ben').innerHTML = falta ? R.aviso('alerta', 'Solicitud registrada como observada', 'Faltan ' + falta + ' documento(s). Se notifica al contribuyente para que los presente.') : R.aviso('exito', 'Solicitud registrada', 'BEN-2027-0031 · pasa a evaluación.');
          $('#form-ben').hidden = true; $('#res-ben').scrollIntoView();
        });
        var r = document.getElementById('res-BEN-2027-0023');
        if (r && !r.disabled) r.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Resolver solicitud BEN-2027-0023', accion: 'Aprobar beneficio', recurso: 'solicitud BEN-2027-0023', etiquetaMotivo: 'Fundamento de la decisión',
            resumen: [['Contribuyente', 'Rosa Ejemplo Vargas'], ['Beneficio', 'Deducción de 50 UIT (pensionista)'], ['Desde', 'Ejercicio 2027']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) { $('#res-ben').innerHTML = R.aviso('exito', 'Beneficio aprobado', 'Resolución RG-2027-0041. La determinación 2027 se ajusta con un movimiento enlazado.') + huella; r.disabled = true; } });
        });
      }
    };
  };

})(window.RENTAS = window.RENTAS || {});
