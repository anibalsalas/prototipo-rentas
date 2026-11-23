/* Recaudación: Valores (VAL) y Fraccionamiento (FRA). */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;
  function concepto(o) { return o.tributo + ' ' + o.anio + ' · ' + o.periodo; }
  function obl(id) { return D.obligaciones.filter(function (o) { return o.id === id; })[0]; }
  var TIPO_EST = { 'Emitido': 'info', 'Notificado': 'alerta', 'Exigible': 'error', 'En coactivo': 'error', 'Reclamado': 'neutra', 'Pagado': 'exito' };

  /* ======================= VAL-01 Lotes de valores ======================= */
  R.vistas['VAL-01'] = function (ctx) {
    var candidatos = [
      { nombre: 'Ana Prueba Quispe', codigo: 'CTB-000101', concepto: 'Arbitrios 2026 · 4.º trimestre', importe: 8355 },
      { nombre: 'Rosa Ejemplo Vargas', codigo: 'CTB-000104', concepto: 'Arbitrios 2026 · 4.º trimestre', importe: 8355 },
      { nombre: 'Jorge Prueba Salazar', codigo: 'CTB-000105', concepto: 'Arbitrios 2026 · 4.º trimestre', importe: 16710 },
      { nombre: 'Asociación de Vivienda Ejemplo', codigo: 'CTB-000108', concepto: 'Arbitrios 2026 · 4.º trimestre', importe: 25065 },
      { nombre: 'Sucesión Prueba Díaz', codigo: 'CTB-000109', concepto: 'Arbitrios 2026 · 4.º trimestre', importe: 8355 }
    ];
    return {
      subtitulo: 'El valor (Orden de Pago, Resolución de Determinación o de Multa) se emite sobre deuda que ya existe: no crea una deuda nueva.',
      acciones: R.btn(ctx, 'Preparar lote', { tipo: 'primario', id: 'btn-lv' }),
      contenido: '<div id="res-lv"></div><section class="panel"><h2>Criterios del lote</h2><div class="form-rejilla">' +
        R.campo({ id: 'lv-tipo', label: 'Tipo de valor', opciones: ['Orden de Pago', 'Resolución de Determinación', 'Resolución de Multa'], pend: 'PE-080' }) +
        R.campo({ id: 'lv-trib', label: 'Tributo y periodo', opciones: ['Arbitrios 2026 · 4.º trimestre', 'Impuesto predial 2026 · cuota 4', 'Impuesto predial 2027 · cuota 1'] }) +
        R.campo({ id: 'lv-min', label: 'Monto mínimo por contribuyente (S/)', tipo: 'number', valor: '50.00', pend: 'PE-081' }) +
        R.campo({ id: 'lv-modo', label: 'Generación', opciones: ['Masiva (todos los que cumplen)', 'Selectiva (elegir contribuyentes)'] }) +
        R.campo({ id: 'lv-fecha', label: 'Proyectar intereses al', tipo: 'date', valor: '2027-03-31' }) + '</div></section>' +
        '<div id="lv-prev"></div>' +
        '<section class="panel"><h2>Lotes recientes</h2>' + R.tabla('t-lotes', { caption: 'Lotes', filas: D.lotesValores, columnas: [
          { clave: 'numero', titulo: 'Lote', orden: true, render: function (l) { return '<span class="mono">' + l.numero + '</span>'; } },
          { clave: 'tipo', titulo: 'Tipo', orden: true }, { clave: 'criterio', titulo: 'Criterio' }, { clave: 'fecha', titulo: 'Fecha', tipo: 'fecha', orden: true },
          { clave: 'cantidad', titulo: 'Valores', tipo: 'num', orden: true }, { clave: 'importe', titulo: 'Importe', tipo: 'moneda', orden: true },
          { clave: 'estado', titulo: 'Estado', orden: true, render: function (l) { return R.ins(l.estado, l.estado === 'Emitido' ? 'exito' : l.estado === 'En revisión' ? 'alerta' : 'info'); } }] }) +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + '</p></section>',
      despues: function () {
        var b = $('#btn-lv'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          var tot = candidatos.reduce(function (a, x) { return a + x.importe; }, 0);
          $('#lv-prev').innerHTML = '<section class="panel"><h2>Vista previa: ' + esc($('#lv-tipo').value) + ' · ' + esc($('#lv-trib').value) + '</h2>' +
            '<div class="kpis"><div class="kpi"><div class="kpi__etiqueta">Contribuyentes que cumplen</div><div class="kpi__valor">488</div><div class="kpi__contexto">se muestran 5 · ' + R.ficticio() + '</div></div>' +
            '<div class="kpi"><div class="kpi__etiqueta">Excluidos</div><div class="kpi__valor">37</div><div class="kpi__contexto">con reclamo, convenio o bajo el mínimo</div></div></div>' +
            '<table style="margin-top:var(--s-4)"><thead><tr><th scope="col">Contribuyente</th><th scope="col">Deuda</th><th scope="col" class="num">Importe al ' + F.fecha($('#lv-fecha').value) + '</th></tr></thead><tbody>' +
            candidatos.map(function (x) { return '<tr><td><a href="#/contribuyentes/ficha/' + x.codigo + '">' + esc(x.nombre) + '</a></td><td>' + esc(x.concepto) + '</td><td class="num">' + F.moneda(x.importe) + '</td></tr>'; }).join('') +
            '</tbody><tfoot><tr><td colspan="2">Subtotal mostrado</td><td class="num">' + F.moneda(tot) + '</td></tr></tfoot></table>' +
            '<p style="margin-top:var(--s-4)"><button type="button" class="btn btn--primario" id="btn-lv-rev">Enviar a revisión y emisión</button></p></section>';
          $('#btn-lv-rev').addEventListener('click', function () {
            R.confirmarSensible({ titulo: 'Emitir lote LV-2027-005', accion: 'Emitir 488 valores', recurso: 'lote LV-2027-005', sinMotivo: true, textoConfirmacion: 'Firma y emite la autoridad competente. Después se imprimen y se entregan a los notificadores.',
              resumen: [['Tipo', esc($('#lv-tipo').value)], ['Valores', '488'], ['Deuda vinculada', 'Existente (no se duplica)']],
              aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
              alConfirmar: function (huella) { $('#res-lv').innerHTML = R.aviso('exito', 'Lote emitido', 'LV-2027-005 · 488 valores listos para imprimir y notificar.') + huella; $('#lv-prev').innerHTML = ''; } });
          });
          b.textContent = 'Volver a preparar';
        });
      }
    };
  };

  /* ======================= VAL-02 Detalle del valor y notificación ======================= */
  R.vistas['VAL-02'] = function (ctx) {
    var v = D.valores.filter(function (x) { return x.numero === ctx.param; })[0] || D.valores[0];
    var dil = D.diligencias[v.numero] || [];
    var linea = ['Emitido', 'Notificado', 'Exigible', 'En coactivo'];
    var idx = Math.max(0, linea.indexOf(v.estado));
    return {
      titulo: v.tipo + ' ' + v.numero,
      subtitulo: esc(v.nombre) + ' · emitido el ' + F.fecha(v.emision) + ' · ' + F.moneda(v.importe) + ' ' + R.ficticio(),
      acciones: R.btn(ctx, 'Registrar notificación', { tipo: 'primario', id: 'btn-notif' }) + '<button type="button" class="btn" id="btn-dup">Reimprimir (duplicado)</button>' +
        '<a class="btn btn--terciario" href="#/valores/exigibilidad">Ver exigibilidad</a>',
      contenido: '<div id="res-val"></div><section class="panel">' + R.pasos(linea, idx) + '</section>' +
        '<div class="rejilla-2"><section class="panel"><h2>Deuda que sustenta el valor</h2><table><thead><tr><th scope="col">Deuda</th><th scope="col" class="num">Importe al emitir</th></tr></thead><tbody>' +
        (v.obligaciones.length ? v.obligaciones.map(function (id) { var o = obl(id); return '<tr><td><a href="#/cuenta/movimientos/' + id + '">' + esc(concepto(o)) + '</a></td><td class="num">' + F.moneda(v.importe) + '</td></tr>'; }).join('') : '<tr><td>Deuda del contribuyente</td><td class="num">' + F.moneda(v.importe) + '</td></tr>') +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">El valor se enlaza a la deuda existente; no la vuelve a cargar.</p></section>' +
        '<section class="panel"><h2>Datos del acto</h2>' + R.dl([['Tipo', esc(v.tipo)], ['Número', '<span class="mono">' + v.numero + '</span>'], ['Fecha de emisión', F.fecha(v.emision)], ['Firma', 'Autoridad competente ' + R.pend('PE-080')], ['Estado', R.ins(v.estado, TIPO_EST[v.estado])]]) + '</section></div>' +
        '<section class="panel"><h2>Notificación ' + R.pend('PE-082') + '</h2>' + (dil.length ? '<div class="tabla-marco"><table><caption class="sr-only">Diligencias</caption><thead><tr><th scope="col">Fecha y hora</th><th scope="col">Medio</th><th scope="col">Resultado</th><th scope="col">Recibió</th><th scope="col">Vínculo</th><th scope="col">Documento</th><th scope="col">Notificador</th></tr></thead><tbody>' +
        dil.map(function (d) { return '<tr><td>' + F.fechaHora(d.fecha, d.hora) + '</td><td>' + esc(d.canal) + '</td><td>' + R.ins(d.resultado, d.resultado === 'Recibido' ? 'exito' : 'alerta') + '</td><td>' + esc(d.recibe) + '</td><td>' + esc(d.vinculo) + '</td><td>' + esc(d.doc) + '</td><td>' + esc(d.notificador) + '</td></tr>'; }).join('') + '</tbody></table></div>'
          : R.estadoVacio('documento', 'Aún no se ha notificado', 'Registra cada intento de notificación con su evidencia.')) +
        '<p class="micro" style="margin-top:var(--s-2)">Un correo o un mensaje informativo no reemplaza la notificación válida.</p></section>' +
        '<section class="panel" id="form-notif" hidden><h2>Registrar diligencia</h2><div class="form-rejilla">' +
        R.campo({ id: 'n-fecha', label: 'Fecha', tipo: 'date', valor: R.config.fechaCorte, obligatorio: true }) + R.campo({ id: 'n-hora', label: 'Hora', tipo: 'time', valor: '10:30' }) +
        R.campo({ id: 'n-res', label: 'Resultado', opciones: ['Recibido', 'Se negó a recibir', 'Sin respuesta en el domicilio', 'Domicilio no existe'] }) +
        R.campo({ id: 'n-recibe', label: 'Nombre de quien recibe' }) + R.campo({ id: 'n-vinc', label: 'Vínculo con el contribuyente', opciones: ['El mismo', 'Cónyuge', 'Familiar', 'Trabajador', 'Otro'] }) +
        R.campo({ id: 'n-doc', label: 'Documento de quien recibe' }) + R.campo({ id: 'n-evid', label: 'Evidencia', opciones: ['Cargo firmado escaneado', 'Acta de negativa', 'Fotografía del domicilio'] }) + '</div>' +
        '<p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="n-guardar">Guardar diligencia</button></p></section>' +
        '<section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Borrador de respuesta asistido · una persona revisa</h2><p class="pequeno">Si el contribuyente pide información sobre este valor, el sistema propone un borrador de carta con los datos del expediente. Los montos y números salen del sistema y no se pueden editar en el borrador; la autoridad revisa, corrige y firma.</p>' +
        '<p style="margin:0"><button type="button" class="btn btn--chico" id="btn-borrador">Generar borrador</button></p><div id="borrador"></div></section>',
      despues: function () {
        var b = $('#btn-notif'); if (b && !b.disabled) b.addEventListener('click', function () { $('#form-notif').hidden = false; $('#n-recibe').focus(); });
        $('#n-guardar').addEventListener('click', function () {
          R.limpiarError('n-recibe');
          if ($('#n-res').value === 'Recibido' && !$('#n-recibe').value.trim()) { R.marcarError('n-recibe', 'Escribe el nombre de quien recibió.').focus(); return; }
          $('#form-notif').hidden = true;
          $('#res-val').innerHTML = R.aviso('exito', 'Diligencia registrada', 'Con su evidencia. La fecha en que surte efecto se calcula según el medio usado.');
        });
        $('#btn-dup').addEventListener('click', function () { R.avisar('info', 'Duplicado', 'Se reimprime el mismo valor con su fecha de emisión original, marcado «Duplicado».'); });
        $('#btn-borrador').addEventListener('click', function () {
          $('#borrador').innerHTML = '<div class="panel" style="margin-top:var(--s-3);background:var(--c-superficie)"><p class="micro">BORRADOR ASISTIDO · requiere revisión</p><p class="pequeno">Contribuyente ' + esc(v.nombre) + ':</p><p class="pequeno">En atención a su consulta, le informamos que la ' + esc(v.tipo) + ' N.º <strong>' + v.numero + '</strong>, emitida el <strong>' + F.fecha(v.emision) + '</strong>, corresponde a la deuda de <strong>' + F.moneda(v.importe) + '</strong> … <em>[el revisor completa los fundamentos]</em></p></div>';
        });
      }
    };
  };

  /* ======================= VAL-03 Exigibilidad y envío a coactivo ======================= */
  R.vistas['VAL-03'] = function (ctx) {
    var filas = [
      { v: 'OP-2027-000155', nombre: 'Ana Prueba Quispe', notif: true, plazo: true, recl: false, conv: false },
      { v: 'RM-2025-000088', nombre: 'Ana Prueba Quispe', notif: true, plazo: true, recl: false, conv: false },
      { v: 'OP-2027-000171', nombre: 'Rosa Ejemplo Vargas', notif: false, plazo: false, recl: false, conv: true },
      { v: 'RD-2027-000012', nombre: 'Comercial Ejemplo S.A.C.', notif: true, plazo: false, recl: true, conv: false }
    ];
    var ok = function (b) { return b ? '<span style="color:var(--c-exito)">' + R.icono('check') + '<span class="sr-only">Sí</span></span>' : '<span style="color:var(--c-error)">' + R.icono('error') + '<span class="sr-only">No</span></span>'; };
    return {
      subtitulo: 'Un valor pasa a coactivo solo si fue notificado, venció su plazo y no tiene reclamo ni fraccionamiento. El ejecutor coactivo decide.',
      acciones: '<a class="btn btn--primario" href="#/coactivo/bandeja">Ir a la bandeja coactiva</a>',
      contenido: '<div id="res-ex"></div><section class="panel"><h2>Revisión de exigibilidad</h2><div class="tabla-marco"><table><caption class="sr-only">Exigibilidad</caption><thead><tr><th scope="col">Valor</th><th scope="col">Contribuyente</th><th scope="col">Notificado</th><th scope="col">Plazo vencido</th><th scope="col">Sin reclamo</th><th scope="col">Sin fraccionamiento</th><th scope="col">Resultado</th></tr></thead><tbody>' +
        filas.map(function (f) {
          var exig = f.notif && f.plazo && !f.recl && !f.conv;
          var motivo = !f.notif ? 'Falta notificación válida' : f.recl ? 'Tiene reclamo en trámite' : f.conv ? 'Está en un convenio' : !f.plazo ? 'Plazo aún no vence' : '';
          return '<tr><td><a class="mono" href="#/valores/detalle/' + f.v + '">' + f.v + '</a></td><td>' + esc(f.nombre) + '</td><td>' + ok(f.notif) + '</td><td>' + ok(f.plazo) + '</td><td>' + ok(!f.recl) + '</td><td>' + ok(!f.conv) + '</td><td>' +
            (exig ? R.btn(ctx, 'Generar constancia', { chico: true, id: 'ce-' + f.v }) : '<span class="pequeno texto-2">' + esc(motivo) + '</span>') + '</td></tr>';
        }).join('') + '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">Los plazos se calculan con el calendario legal y la fecha en que surtió efecto la notificación.</p></section>',
      despues: function () {
        document.querySelectorAll('[id^="ce-"]').forEach(function (b) {
          if (b.disabled) return;
          b.addEventListener('click', function () {
            var v = b.id.slice(3);
            $('#res-ex').innerHTML = R.aviso('exito', 'Constancia de exigibilidad generada', 'CE-2027-000' + (40 + Math.floor(Math.random() * 9)) + ' para ' + v + '. Se envió como propuesta a la bandeja coactiva; el ejecutor decide si inicia el procedimiento.') + R.huella({ accion: 'Generar constancia de exigibilidad', recurso: v, resultado: 'Propuesta enviada a coactivo' });
            b.disabled = true; b.textContent = 'Constancia generada';
          });
        });
      }
    };
  };

  /* ======================= Fraccionamiento: cálculo ilustrativo =======================
     Amortización con cuota de capital constante e interés sobre saldo, con parámetros DE EJEMPLO (PE-090). */
  function cronograma(deuda, n) {
    var p = D.fracc, inicial = Math.round(deuda * p.inicialPct / 100), saldo = deuda - inicial, base = Math.floor(saldo / n), resto = saldo - base * n, filas = [];
    var meses = ['2027-04-30', '2027-05-31', '2027-06-30', '2027-07-30', '2027-08-31', '2027-09-30', '2027-10-29', '2027-11-30', '2027-12-30', '2028-01-31', '2028-02-29', '2028-03-31'];
    for (var i = 0; i < n; i++) {
      var cap = base + (i === n - 1 ? resto : 0), int = Math.round(saldo * p.interesBp / 10000);
      filas.push({ n: i + 1, vence: meses[i], capital: cap, interes: int, total: cap + int }); saldo -= cap;
    }
    return { inicial: inicial, filas: filas };
  }
  R.cronogramaFracc = cronograma;

  /* ======================= FRA-01 Simulación ======================= */
  R.vistas['FRA-01'] = function (ctx) {
    var c = R.ctxContribuyente(ctx), pre = (ctx.q.sel || '').split(',').filter(Boolean);
    var lista = D.obligacionesDe(c.codigo).map(function (o) { return { o: o, s: D.saldo(o) }; }).filter(function (f) { return f.s.total > 0 && f.s.vencida; });
    var st = { sel: {}, n: 6 };
    lista.forEach(function (f) { if (f.o.situacion !== 'coactiva' && (!pre.length || pre.indexOf(f.o.id) >= 0)) st.sel[f.o.id] = true; });
    function pintar() {
      var deuda = lista.filter(function (f) { return st.sel[f.o.id]; }).reduce(function (a, f) { return a + f.s.total; }, 0);
      var cr = cronograma(deuda, st.n), totInt = cr.filas.reduce(function (a, x) { return a + x.interes; }, 0);
      var bajoMin = cr.filas.length && cr.filas[0].capital < D.fracc.minCuota;
      $('#fr-res').innerHTML = !deuda ? R.estadoVacio('info', 'Elige al menos una deuda', 'Marca las deudas que quiere fraccionar.') :
        '<div class="kpis"><div class="kpi"><div class="kpi__etiqueta">Deuda a fraccionar</div><div class="kpi__valor">' + F.moneda(deuda) + '</div><div class="kpi__contexto">al ' + F.fecha(R.config.fechaCorte) + '</div></div>' +
        '<div class="kpi"><div class="kpi__etiqueta">Cuota inicial (' + D.fracc.inicialPct + ' %)</div><div class="kpi__valor">' + F.moneda(cr.inicial) + '</div><div class="kpi__contexto">se paga para activar el convenio</div></div>' +
        '<div class="kpi"><div class="kpi__etiqueta">Interés del fraccionamiento</div><div class="kpi__valor">' + F.moneda(totInt) + '</div><div class="kpi__contexto">' + (D.fracc.interesBp / 100).toFixed(2) + ' % mensual sobre saldo</div></div></div>' +
        (bajoMin ? R.aviso('alerta', 'La cuota queda por debajo del mínimo', 'Con ' + st.n + ' cuotas, cada cuota baja de ' + F.moneda(D.fracc.minCuota) + '. Elige menos cuotas.') : '') +
        '<table style="margin-top:var(--s-4)"><caption class="sr-only">Cronograma</caption><thead><tr><th scope="col">Cuota</th><th scope="col">Vence</th><th scope="col" class="num">Capital</th><th scope="col" class="num">Interés</th><th scope="col" class="num">Total</th></tr></thead><tbody>' +
        '<tr><td>Inicial</td><td>Al firmar</td><td class="num">' + F.moneda(cr.inicial) + '</td><td class="num">' + F.moneda(0) + '</td><td class="num">' + F.moneda(cr.inicial) + '</td></tr>' +
        cr.filas.map(function (x) { return '<tr><td>' + x.n + '</td><td>' + F.fecha(x.vence) + '</td><td class="num">' + F.moneda(x.capital) + '</td><td class="num">' + F.moneda(x.interes) + '</td><td class="num">' + F.moneda(x.total) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td colspan="4">Total a pagar</td><td class="num">' + F.moneda(deuda + totInt) + '</td></tr></tfoot></table>';
    }
    return {
      subtitulo: esc(c.nombre) + ' · propuesta ilustrativa; las condiciones reales salen del reglamento vigente.',
      acciones: R.btn(ctx, 'Solicitar convenio', { tipo: 'primario', href: '#/fraccionamiento/convenio/' + c.codigo }) + '<button type="button" class="btn" onclick="window.print()">Imprimir propuesta</button>',
      contenido: R.cabeceraContribuyente(c) + R.aviso('pend', 'Condiciones de ejemplo', 'Cuota inicial ' + D.fracc.inicialPct + ' %, hasta ' + D.fracc.maxCuotas + ' cuotas, interés ' + (D.fracc.interesBp / 100).toFixed(2) + ' % mensual y cuota mínima ' + F.moneda(D.fracc.minCuota) + ': se reemplazan por las del reglamento ' + R.pend('PE-090')) +
        '<div class="rejilla-2"><section class="panel"><h2>Deudas que puede fraccionar</h2><ul style="list-style:none;padding:0;margin:0" id="fr-lista">' +
        lista.map(function (f) {
          var bloq = f.o.situacion === 'coactiva';
          return '<li style="padding:var(--s-2) 0;border-bottom:1px solid var(--c-borde)"><label style="display:flex;gap:var(--s-3);align-items:flex-start"><input type="checkbox" data-fr="' + f.o.id + '"' + (st.sel[f.o.id] ? ' checked' : '') + (bloq ? ' disabled' : '') + ' style="width:1.1rem;height:1.1rem;margin-top:.2rem"><span>' + esc(concepto(f.o)) + ' · <strong>' + F.moneda(f.s.total) + '</strong>' +
            (bloq ? '<br><span class="micro">No se puede: está en cobranza coactiva</span>' : '') + '</span></label></li>';
        }).join('') + '</ul><div class="filtros" style="margin-top:var(--s-4)">' +
        R.campo({ id: 'fr-n', label: 'Número de cuotas', opciones: [3, 4, 6, 8, 10, 12], valor: 6 }) + '</div></section>' +
        '<section class="panel"><h2>Propuesta</h2><div id="fr-res" aria-live="polite"></div><p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + '</p></section></div>',
      despues: function () {
        pintar();
        $('#fr-lista').addEventListener('change', function (e) { var x = e.target.closest('[data-fr]'); if (x) { st.sel[x.dataset.fr] = x.checked; pintar(); } });
        $('#fr-n').addEventListener('change', function (e) { st.n = Number(e.target.value); pintar(); });
      }
    };
  };

  /* ======================= FRA-02 Convenio y cronograma ======================= */
  R.vistas['FRA-02'] = function (ctx) {
    var c = R.ctxContribuyente(ctx);
    var ids = ['OB-26-P4', 'OB-26-A4', 'OB-27-P1', 'OB-27-A1'];
    var vinc = ids.map(function (id) { var o = obl(id); return { o: o, s: D.saldo(o) }; });
    var deuda = vinc.reduce(function (a, f) { return a + f.s.total; }, 0), cr = cronograma(deuda, 6);
    var st = { paso: 1 };
    function pintar() {
      $('#cv-pasos').innerHTML = R.pasos(['Pre-convenio registrado', 'Cuota inicial pagada', 'Convenio aprobado'], st.paso);
      $('#cv-estado').innerHTML = st.paso === 1 ? R.aviso('alerta', 'Falta la cuota inicial', 'Pre-convenio PC-2027-000045. Cuando se pague la cuota inicial de ' + F.moneda(cr.inicial) + ' en caja, el convenio pasa a aprobación.') + '<p style="margin-top:var(--s-3)"><button type="button" class="btn" id="cv-inicial">Registrar pago de la cuota inicial (demostración)</button></p>'
        : st.paso === 2 ? R.aviso('info', 'Cuota inicial pagada', 'Recibo R-001-0007802. Falta la aprobación de un supervisor.')
          : R.aviso('exito', 'Convenio vigente', 'CV-2027-000046. Las deudas vinculadas se pagan solo por el cronograma.');
      var b = $('#cv-inicial'); if (b) b.addEventListener('click', function () { st.paso = 2; pintar(); });
      var ap = $('#btn-aprobar'); if (ap) ap.disabled = st.paso !== 2 || ctx.acceso === 'lectura';
    }
    return {
      titulo: 'Convenio de fraccionamiento · ' + c.nombre,
      acciones: '<button type="button" class="btn btn--primario" id="btn-aprobar" disabled>Aprobar convenio</button><a class="btn" href="#/fraccionamiento/simulacion/' + c.codigo + '">Volver a la simulación</a>' +
        R.btn(ctx, 'Anular pre-convenio', { tipo: 'terciario', id: 'btn-anular' }),
      contenido: '<div id="res-cv"></div><section class="panel"><div id="cv-pasos"></div><div id="cv-estado" style="margin-top:var(--s-4)"></div></section>' +
        '<div class="rejilla-2"><section class="panel"><h2>Deudas vinculadas</h2><table><thead><tr><th scope="col">Deuda</th><th scope="col" class="num">Saldo vinculado</th></tr></thead><tbody>' +
        vinc.map(function (f) { return '<tr><td>' + esc(concepto(f.o)) + '</td><td class="num">' + F.moneda(f.s.total) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td>Total</td><td class="num">' + F.moneda(deuda) + '</td></tr></tfoot></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Al aprobarse, estas deudas no se cobran por separado: cada pago de cuota se aplica a ellas y al cronograma a la vez, sin duplicar el monto.</p></section>' +
        '<section class="panel"><h2>Condiciones</h2>' + R.dl([['Cuota inicial', F.moneda(cr.inicial)], ['Cuotas', '6 mensuales'], ['Interés', (D.fracc.interesBp / 100).toFixed(2) + ' % mensual ' + R.pend('PE-090')], ['Garantía', 'No requerida ' + R.pend('PE-091')], ['Pérdida del beneficio', 'Según el reglamento ' + R.pend('PE-092')]]) +
        '<p class="micro" style="margin-top:var(--s-3)">Si alguna deuda tenía una retención bancaria en coactivo, al aprobarse el convenio se crea una tarea urgente de levantamiento. <a href="#/coactivo/levantamiento">Ver levantamientos</a></p></section></div>',
      despues: function () {
        pintar();
        $('#btn-aprobar').addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Aprobar convenio de fraccionamiento', accion: 'Aprobar convenio', recurso: 'pre-convenio PC-2027-000045', etiquetaMotivo: 'Observación de la aprobación',
            resumen: [['Contribuyente', esc(c.nombre)], ['Deuda vinculada', F.moneda(deuda)], ['Cuota inicial', F.moneda(cr.inicial) + ' (pagada)'], ['Cuotas', '6']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) { st.paso = 3; pintar(); $('#res-cv').innerHTML = R.aviso('exito', 'Convenio aprobado', 'CV-2027-000046 · 6 cuotas. El cronograma aparece en el estado de cuenta.') + huella; } });
        });
        var an = $('#btn-anular'); if (an && !an.disabled) an.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Anular pre-convenio PC-2027-000045', accion: 'Anular', peligro: true, recurso: 'pre-convenio PC-2027-000045',
            resumen: [['Efecto', 'Las deudas vuelven a cobrarse por separado'], ['Pagos realizados', 'Se conservan']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) { $('#res-cv').innerHTML = R.aviso('info', 'Pre-convenio anulado', 'Las deudas quedaron libres.') + huella; } });
        });
      }
    };
  };

  /* ======================= FRA-03 Seguimiento y pérdida ======================= */
  R.vistas['FRA-03'] = function (ctx) {
    var tipo = { 'Al día': 'exito', 'Con cuotas vencidas': 'alerta', 'Causal de pérdida': 'error', 'Pre-convenio: falta cuota inicial': 'info' };
    return {
      subtitulo: 'El atraso no cambia el convenio por sí solo: primero se requiere el pago y, si corresponde, se emite un acto de pérdida.',
      acciones: '<a class="btn btn--primario" href="#/ia-cobranza/bandejas">Ver bandeja de cobranza</a>',
      contenido: '<div id="res-seg"></div><section class="panel"><h2>Convenios</h2>' + R.tabla('t-conv', { caption: 'Convenios', filas: D.convenios, columnas: [
        { clave: 'numero', titulo: 'Convenio', orden: true, render: function (x) { return '<span class="mono">' + x.numero + '</span>'; } },
        { clave: 'nombre', titulo: 'Contribuyente', orden: true, render: function (x) { return '<a href="#/contribuyentes/ficha/' + x.contribuyente + '">' + esc(x.nombre) + '</a>'; } },
        { clave: 'fecha', titulo: 'Desde', tipo: 'fecha', orden: true },
        { clave: 'pagadas', titulo: 'Pagadas', tipo: 'num', render: function (x) { return x.pagadas + ' de ' + x.cuotas; } },
        { clave: 'vencidas', titulo: 'Vencidas', tipo: 'num', orden: true },
        { clave: 'saldo', titulo: 'Saldo', tipo: 'moneda', orden: true },
        { clave: 'estado', titulo: 'Estado', orden: true, render: function (x) { return R.ins(x.estado, tipo[x.estado]); } },
        { clave: 'x', titulo: 'Acción', render: function (x) {
          if (x.estado === 'Con cuotas vencidas') return R.btn(ctx, 'Requerir pago', { chico: true, id: 'rq-' + x.numero });
          if (x.estado === 'Causal de pérdida') return R.btn(ctx, 'Proponer pérdida', { chico: true, tipo: 'peligro', id: 'pp-' + x.numero });
          return ''; } }] }) +
        '<p class="micro" style="margin-top:var(--s-2)">Causales y procedimiento de pérdida según el reglamento ' + R.pend('PE-092') + ' · ' + R.ficticio() + '</p></section>',
      despues: function () {
        var rq = document.getElementById('rq-CV-2026-000120');
        if (rq && !rq.disabled) rq.addEventListener('click', function () { $('#res-seg').innerHTML = R.aviso('exito', 'Requerimiento generado', 'Carta de requerimiento de pago para Rosa Ejemplo Vargas, lista para notificar.'); rq.disabled = true; });
        var pp = document.getElementById('pp-CV-2025-000301');
        if (pp && !pp.disabled) pp.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Proponer resolución de pérdida', accion: 'Emitir resolución de pérdida', peligro: true, recurso: 'convenio CV-2025-000301', etiquetaMotivo: 'Causal y fundamento',
            resumen: [['Contribuyente', 'Pedro Ejemplo Chávez'], ['Cuotas vencidas', '4'], ['Saldo', F.moneda(154200)], ['Efecto', 'Se notifica la pérdida; los pagos hechos se conservan y el saldo vuelve a ser exigible']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) { $('#res-seg').innerHTML = R.aviso('exito', 'Resolución de pérdida emitida', 'RP-2027-000007 · pasa a notificación. Solo después de notificada, el saldo puede ir a coactivo.') + huella; pp.disabled = true; } });
        });
      }
    };
  };
})(window.RENTAS = window.RENTAS || {});
