/* Recaudación: Cuenta corriente (CTA): estado de cuenta, movimientos y proyección de intereses. */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;

  function concepto(o) { return o.tributo + ' ' + o.anio + ' · ' + o.periodo; }

  /* Texto de explicación generado con plantilla (no con un modelo): las cifras salen del cálculo. */
  function explicacion(c, filas) {
    var pend = filas.filter(function (f) { return f.s.total > 0; });
    var total = pend.reduce(function (a, f) { return a + f.s.total; }, 0);
    var venc = pend.filter(function (f) { return f.s.vencida; }), totVenc = venc.reduce(function (a, f) { return a + f.s.total; }, 0);
    var p = ['Al ' + F.fecha(R.config.fechaCorte) + ', ' + esc(c.nombre.split(' ')[0]) + ' tiene una deuda de <strong>' + F.moneda(total) + '</strong>. De ese monto, ' + F.moneda(totVenc) + ' ya venció y ' + F.moneda(total - totVenc) + ' vence más adelante.'];
    var conInt = venc.filter(function (f) { return f.s.interes > 0; });
    if (conInt.length) p.push('Las deudas vencidas generan interés moratorio desde el día siguiente a su vencimiento: hoy suman ' + F.moneda(conInt.reduce(function (a, f) { return a + f.s.interes; }, 0)) + '.');
    var valor = pend.filter(function (f) { return f.o.situacion === 'valor'; });
    if (valor.length) p.push('Hay ' + valor.length + ' deuda' + (valor.length > 1 ? 's' : '') + ' con un documento de cobranza ya notificado (' + valor.map(function (f) { return esc(f.o.valor.split(' (')[0]); }).join(', ') + '). Si no se paga, puede pasar a cobranza coactiva.');
    var recl = pend.filter(function (f) { return f.o.situacion === 'reclamada'; });
    if (recl.length) p.push('El ' + esc(concepto(recl[0].o).toLowerCase()) + ' está en reclamo: su cobranza está suspendida mientras se resuelve.');
    var mul = pend.filter(function (f) { return f.o.sinInteres; });
    if (mul.length) p.push('La multa tributaria se muestra sin interés hasta confirmar la regla de cálculo ' + R.pend('PE-047') + '.');
    return '<p style="margin:0 0 var(--s-2)">' + p.join('</p><p style="margin:0 0 var(--s-2)">') + '</p>';
  }

  /* ======================= CTA-01 Estado de cuenta ======================= */
  R.vistas['CTA-01'] = function (ctx) {
    var c = R.ctxContribuyente(ctx);
    if (!c) return { contenido: R.estadoVacio('buscar', 'No encontramos ese contribuyente', '<a href="#/contribuyentes/buscar">Buscar</a>') };
    var todas = D.obligacionesDe(c.codigo).map(function (o) { return { o: o, s: D.saldo(o) }; });
    var st = { anio: '', tributo: '', ver: 'pendientes', vista: 'detallada', sel: {} };
    var sum = function (l, k) { return l.reduce(function (a, f) { return a + f.s[k]; }, 0); };
    var pend = todas.filter(function (f) { return f.s.total > 0; });
    var kpi = function (e, v, x, color) { return '<div class="kpi"><div class="kpi__etiqueta">' + e + '</div><div class="kpi__valor"' + (color ? ' style="color:' + color + '"' : '') + '>' + v + '</div><div class="kpi__contexto">' + x + '</div></div>'; };
    var anios = []; todas.forEach(function (f) { if (anios.indexOf(f.o.anio) < 0) anios.push(f.o.anio); });
    var tributos = []; todas.forEach(function (f) { if (tributos.indexOf(f.o.tributo) < 0) tributos.push(f.o.tributo); });

    function visibles() {
      return todas.filter(function (f) {
        return (!st.anio || String(f.o.anio) === st.anio) && (!st.tributo || f.o.tributo === st.tributo) && (st.ver === 'todas' || f.s.total > 0);
      }).sort(function (a, b) { return a.o.vence < b.o.vence ? -1 : 1; });
    }
    function pintarTabla() {
      var filas = visibles(), det = st.vista === 'detallada';
      var cab = '<th scope="col"><span class="sr-only">Seleccionar</span></th><th scope="col">Concepto</th><th scope="col">Vence</th>' +
        (det ? '<th scope="col" class="num">Principal</th><th scope="col" class="num">Reajuste</th><th scope="col" class="num">Interés</th><th scope="col" class="num">Multa y costas</th><th scope="col" class="num">Pagado</th>' : '') +
        '<th scope="col" class="num">Saldo</th><th scope="col">Estado y situación</th>';
      var cuerpo = filas.map(function (f) {
        var o = f.o, s = f.s, pagable = s.total > 0;
        return '<tr><td>' + (pagable ? '<input type="checkbox" data-sel="' + o.id + '"' + (st.sel[o.id] ? ' checked' : '') + ' aria-label="Seleccionar ' + esc(concepto(o)) + '" style="width:1.1rem;height:1.1rem">' : '') + '</td>' +
          '<td><a href="#/cuenta/movimientos/' + o.id + '">' + esc(concepto(o)) + '</a>' + (o.valor ? '<div class="micro">' + esc(o.valor) + '</div>' : '') + (o.migrada ? '<div class="micro">Viene del sistema anterior ' + R.pend('PE-072') + '</div>' : '') + '</td>' +
          '<td>' + F.fecha(o.vence) + (s.vencida && pagable ? '<div class="micro" style="color:var(--c-error)">Vencida</div>' : '') + '</td>' +
          (det ? '<td class="num">' + F.moneda(o.principal) + '</td><td class="num">' + F.moneda(o.reajuste) + '</td><td class="num">' + (o.sinInteres ? '—' : F.moneda(s.interes)) + '</td><td class="num">' + F.moneda(o.multa + s.costas) + '</td><td class="num">' + F.moneda(o.pagado) + '</td>' : '') +
          '<td class="num">' + (s.descuento ? '<s class="micro">' + F.moneda(s.total) + '</s><br>' : '') + '<strong>' + F.moneda(s.pagar) + '</strong></td><td><div class="estado-sit">' + R.insEstadoDeuda(s.estado) + R.insSituacion(o.situacion) + '</div></td></tr>';
      }).join('');
      var cols = det ? 5 : 0;
      var pie = '<tr><td colspan="' + (3 + cols) + '">Total (' + filas.length + ' deuda' + (filas.length === 1 ? '' : 's') + ')</td><td class="num">' + F.moneda(sum(filas, 'pagar')) + '</td><td></td></tr>';
      $('#cta-tabla').innerHTML = filas.length ? '<div class="tabla-marco"><table class="tabla-cta' + (det ? ' tabla-cta--det' : '') + '"><caption class="sr-only">Deudas del contribuyente</caption><thead><tr>' + cab + '</tr></thead><tbody>' + cuerpo + '</tbody><tfoot>' + pie + '</tfoot></table></div><p class="micro" style="margin-top:var(--s-2)">Interés calculado con una tasa de ejemplo ' + R.pend('PE-070') + '</p>'
        : '<div class="panel panel--plano">' + R.estadoVacio('check', 'No hay deudas con estos filtros', 'Prueba con «Ver: todas» para incluir lo ya pagado.') + '</div>';
      pintarSel();
    }
    function pintarSel() {
      var ids = Object.keys(st.sel).filter(function (k) { return st.sel[k]; });
      var tot = todas.filter(function (f) { return ids.indexOf(f.o.id) >= 0; }).reduce(function (a, f) { return a + f.s.pagar; }, 0);
      $('#cta-sel').innerHTML = '<span><strong>' + ids.length + '</strong> seleccionada' + (ids.length === 1 ? '' : 's') + ' · Total <strong class="num">' + F.moneda(tot) + '</strong></span>' +
        '<span style="display:flex;gap:var(--s-2);flex-wrap:wrap"><a class="btn btn--primario' + (ids.length ? '' : '" aria-disabled="true" tabindex="-1" style="pointer-events:none;opacity:.6') + '" href="#/caja/cobranza/' + c.codigo + '?sel=' + ids.join(',') + '">' + R.icono('caja') + 'Cobrar en caja</a>' +
        '<a class="btn' + (ids.length ? '' : '" aria-disabled="true" tabindex="-1" style="pointer-events:none;opacity:.6') + '" href="#/fraccionamiento/simulacion/' + c.codigo + '?sel=' + ids.join(',') + '">Fraccionar</a></span>';
    }

    var coactiva = pend.filter(function (f) { return f.o.situacion === 'coactiva' || f.o.situacion === 'valor'; });
    return {
      titulo: 'Estado de cuenta',
      subtitulo: esc(c.nombre) + ' · calculado al ' + F.fecha(R.config.fechaCorte) + ' ' + R.ficticio(),
      acciones: '<button type="button" class="btn btn--primario" id="cta-todo">Seleccionar todo lo vencido</button>' +
        '<a class="btn" href="#/cuenta/proyeccion/' + c.codigo + '">' + R.icono('calendario') + 'Proyectar a otra fecha</a>' +
        '<button type="button" class="btn btn--terciario" onclick="window.print()">Imprimir</button>' +
        '<span class="acciones__fin"><a class="btn btn--terciario" href="#/contribuyentes/ficha/' + c.codigo + '">Ficha del contribuyente</a></span>',
      contenido: R.cabeceraContribuyente(c) + (D.campana.activa && sum(pend, 'descuento') ? R.aviso('exito', 'Amnistía vigente: ' + esc(D.campana.nombre), 'Este contribuyente ahorra ' + F.moneda(sum(pend, 'descuento')) + ' si paga durante la campaña. Los montos tachados son sin amnistía. <a href="#/beneficios/campanas">Ver la campaña</a>') : '') +
        '<div class="kpis">' + kpi('Deuda total', F.moneda(sum(pend, 'pagar')), D.campana.activa && sum(pend, 'descuento') ? 'Con amnistía · sin ella ' + F.moneda(sum(pend, 'total')) : 'Al ' + F.fecha(R.config.fechaCorte)) +
        kpi('Vencida', F.moneda(sum(pend.filter(function (f) { return f.s.vencida; }), 'total')), 'Incluye intereses', 'var(--c-error)') +
        kpi('Por vencer', F.moneda(sum(pend.filter(function (f) { return !f.s.vencida; }), 'total')), 'Cuotas futuras') +
        kpi('Con documento de cobranza', F.moneda(sum(coactiva, 'total')), coactiva.length + ' deuda(s) en valor o coactivo') + '</div>' +
        '<section class="panel"><h2>Deudas</h2><form class="filtros" id="cta-filtros" onsubmit="return false">' +
        R.campo({ id: 'f-anio', label: 'Año', opciones: [['', 'Todos']].concat(anios.map(function (a) { return [String(a), String(a)]; })) }) +
        R.campo({ id: 'f-trib', label: 'Tributo', opciones: [['', 'Todos']].concat(tributos.map(function (t) { return [t, t]; })) }) +
        R.campo({ id: 'f-ver', label: 'Ver', opciones: [['pendientes', 'Solo pendientes'], ['todas', 'Todas, incluidas las pagadas']] }) +
        R.campo({ id: 'f-vista', label: 'Presentación', opciones: [['detallada', 'Detallada (por componente)'], ['resumida', 'Resumida']] }) + '</form>' +
        '<div id="cta-tabla" style="margin-top:var(--s-4)"></div><div class="resumen-fijo" id="cta-sel" aria-live="polite"></div></section>' +
        '<div class="rejilla-2"><section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Explicación en palabras simples</h2>' + explicacion(c, todas) +
        '<p class="micro" style="margin:var(--s-2) 0 0">Texto generado con una plantilla aprobada a partir de las cifras del cálculo ' + R.pend('PE-071') + '. El monto oficial es el del estado de cuenta.</p></section>' +
        '<section class="panel"><h2>Cómo leer este estado de cuenta</h2><ul class="lista-simple pequeno">' +
        '<li><strong>Principal:</strong> el tributo o la cuota.</li><li><strong>Reajuste:</strong> actualización de cuotas con el ' + R.term('IPM') + '.</li>' +
        '<li><strong>Interés:</strong> ' + R.term('TIM', 'interés moratorio') + ' por pagar después del vencimiento. En esta demostración se usa una tasa de ejemplo de 0.90 % mensual ' + R.pend('PE-070') + '.</li>' +
        '<li><strong>Años anteriores:</strong> la deuda que viene del sistema actual se muestra con el detalle disponible ' + R.pend('PE-072') + '.</li>' +
        '<li><strong>Situación:</strong> si la deuda tiene un documento de cobranza, está en reclamo o en ' + R.term('Coactivo', 'coactivo') + '.</li></ul></section></div>',
      despues: function () {
        pintarTabla();
        $('#cta-filtros').addEventListener('change', function () { st.anio = $('#f-anio').value; st.tributo = $('#f-trib').value; st.ver = $('#f-ver').value; st.vista = $('#f-vista').value; pintarTabla(); });
        $('#cta-tabla').addEventListener('change', function (e) { var x = e.target.closest('[data-sel]'); if (x) { st.sel[x.dataset.sel] = x.checked; pintarSel(); } });
        $('#cta-todo').addEventListener('click', function () { pend.forEach(function (f) { if (f.s.vencida) st.sel[f.o.id] = true; }); pintarTabla(); R.avisar('info', 'Selección', 'Se marcaron todas las deudas vencidas.'); });
      }
    };
  };

  /* ======================= CTA-02 Movimientos de una obligación ======================= */
  R.vistas['CTA-02'] = function (ctx) {
    var id = ctx.param && D.movimientos[ctx.param] ? ctx.param : (ctx.param && ctx.param.indexOf('OB-') === 0 ? ctx.param : 'OB-26-P4');
    var o = D.obligaciones.filter(function (x) { return x.id === id; })[0] || D.obligaciones[5];
    var movs = D.movimientos[o.id] || [[o.vence.slice(0, 4) + '-01-15', 'Cargo', 'Emisión', 'Principal', o.principal + o.multa, 0]].concat(o.reajuste ? [[o.vence, 'Cargo', 'Reajuste', 'Reajuste', o.reajuste, 0]] : []).concat(o.pagado ? [[o.vence, 'Abono', 'Pago en caja', 'Principal', 0, o.pagado]] : []);
    var saldo = 0, s = D.saldo(o);
    var c = D.contribuyente(o.contribuyente);
    return {
      titulo: 'Movimientos · ' + concepto(o),
      subtitulo: esc(c.nombre) + ' · saldo actual ' + F.moneda(s.total) + ' ' + R.ficticio(),
      acciones: '<a class="btn btn--primario" href="#/cuenta/estado/' + o.contribuyente + '">' + R.icono('flechaIzq') + 'Volver al estado de cuenta</a>',
      contenido: '<section class="panel"><div class="filtros">' + R.campo({ id: 'm-obl', label: 'Deuda', valor: o.id, opciones: D.obligacionesDe(o.contribuyente).map(function (x) { return [x.id, concepto(x)]; }) }) + '</div>' +
        R.dl([['Vencimiento', F.fecha(o.vence)], ['Estado', R.insEstadoDeuda(s.estado)], ['Situación', R.insSituacion(o.situacion)], ['Documento de cobranza', esc(o.valor || '—')]]) + '</section>' +
        '<section class="panel"><h2>Movimientos</h2><div class="tabla-marco"><table><caption class="sr-only">Movimientos</caption><thead><tr><th scope="col">Fecha</th><th scope="col">Tipo</th><th scope="col">Detalle</th><th scope="col">Componente</th><th scope="col" class="num">Cargo</th><th scope="col" class="num">Abono</th><th scope="col" class="num">Saldo</th></tr></thead><tbody>' +
        movs.map(function (m) { saldo += m[4] - m[5]; return '<tr><td>' + F.fecha(m[0]) + '</td><td>' + R.ins(m[1], m[1] === 'Abono' ? 'exito' : m[1] === 'Acto' ? 'info' : 'neutra') + '</td><td>' + esc(m[2]) + '</td><td>' + esc(m[3]) + '</td><td class="num">' + (m[4] ? F.moneda(m[4]) : '') + '</td><td class="num">' + (m[5] ? F.moneda(m[5]) : '') + '</td><td class="num">' + F.moneda(saldo) + '</td></tr>'; }).join('') +
        (s.interes ? '<tr><td>' + F.fecha(R.config.fechaCorte) + '</td><td>' + R.ins('Cálculo', 'alerta') + '</td><td>Interés moratorio a la fecha (no es un cargo registrado)</td><td>Interés</td><td class="num">' + F.moneda(s.interes) + '</td><td></td><td class="num">' + F.moneda(saldo + s.interes) + '</td></tr>' : '') +
        '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">El saldo es la suma de los movimientos. Ningún movimiento se borra: un error se corrige con un movimiento inverso.</p></section>',
      despues: function () { $('#m-obl').addEventListener('change', function (e) { location.hash = '#/cuenta/movimientos/' + e.target.value; }); }
    };
  };

  /* ======================= CTA-03 Proyección de intereses ======================= */
  R.vistas['CTA-03'] = function (ctx) {
    var c = R.ctxContribuyente(ctx);
    var pend = D.obligacionesDe(c.codigo).filter(function (o) { return D.saldo(o).total > 0; });
    function calcular(fecha) {
      var tot = 0, filas = pend.map(function (o) {
        var hoy = D.saldo(o), fut = D.saldo(o, fecha); tot += fut.total;
        return '<tr><td>' + esc(concepto(o)) + '</td><td class="num">' + F.moneda(fut.capital) + '</td><td class="num">' + (o.sinInteres ? '—' : F.moneda(hoy.interes)) + '</td><td class="num">' + (o.sinInteres ? '—' : F.moneda(fut.interes)) + '</td><td class="num"><strong>' + F.moneda(fut.total) + '</strong></td></tr>';
      }).join('');
      return '<div class="tabla-marco"><table><caption class="sr-only">Proyección</caption><thead><tr><th scope="col">Deuda</th><th scope="col" class="num">Capital</th><th scope="col" class="num">Interés al ' + F.fecha(R.config.fechaCorte) + '</th><th scope="col" class="num">Interés al ' + F.fecha(fecha) + '</th><th scope="col" class="num">Total al ' + F.fecha(fecha) + '</th></tr></thead><tbody>' + filas +
        '</tbody><tfoot><tr><td colspan="4">Total si paga el ' + F.fecha(fecha) + '</td><td class="num">' + F.moneda(tot) + '</td></tr></tfoot></table></div>';
    }
    var fecha0 = '2027-04-30';
    return {
      subtitulo: esc(c.nombre) + ' · cuánto pagaría en una fecha futura',
      acciones: '<button type="button" class="btn btn--primario" id="btn-proy">Proyectar</button><a class="btn" href="#/cuenta/estado/' + c.codigo + '">Volver al estado de cuenta</a>' +
        '<button type="button" class="btn btn--terciario" onclick="window.print()">Imprimir proyección</button>',
      contenido: R.aviso('info', 'La proyección no cambia la deuda', 'Es un cálculo informativo. Si la tasa de interés cambia antes de esa fecha, el cálculo se divide por tramos con cada tasa vigente.') +
        '<section class="panel"><div class="filtros">' + R.campo({ id: 'p-fecha', label: 'Fecha de pago prevista', tipo: 'date', valor: fecha0, obligatorio: true, extra: ' min="' + R.config.fechaCorte + '"' }) + '</div>' +
        '<div id="p-res" style="margin-top:var(--s-4)">' + calcular(fecha0) + '</div>' +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Tasa de interés de ejemplo: 0.90 % mensual ' + R.pend('PE-070') + ' · Multas sin interés hasta confirmar la regla ' + R.pend('PE-047') + '</p></section>',
      despues: function () {
        function ir() {
          R.limpiarError('p-fecha'); var f = $('#p-fecha').value;
          if (!f || f < R.config.fechaCorte) { R.marcarError('p-fecha', 'Elige una fecha igual o posterior al ' + F.fecha(R.config.fechaCorte) + '.').focus(); return; }
          $('#p-res').innerHTML = calcular(f);
        }
        $('#btn-proy').addEventListener('click', ir); $('#p-fecha').addEventListener('change', ir);
      }
    };
  };
})(window.RENTAS = window.RENTAS || {});
