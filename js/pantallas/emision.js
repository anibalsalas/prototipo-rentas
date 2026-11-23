/* Emisión masiva 2027 (EMI-01..04) y Amnistía tributaria y beneficios (BEN-02, BEN-03). */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;
  function fila(cols) { return '<tr>' + cols.map(function (c) { return '<td' + (c && c.num ? ' class="num"' : '') + '>' + (c && c.h !== undefined ? c.h : c) + '</td>'; }).join('') + '</tr>'; }
  function n(h) { return { h: h, num: true }; }
  var E = function () { return D.emision; };
  var ST = { listo: ['Listo', 'exito'], ejemplo: ['Valor de ejemplo', 'alerta'], falta: ['Falta', 'error'], opcional: ['Opcional', 'neutra'], no: ['No se aplica', 'neutra'] };
  function faltantes() { return E().parametros.filter(function (p) { return p.estado === 'falta' || p.estado === 'ejemplo'; }); }
  function kpi(e, v, x, color) { return '<div class="kpi"><div class="kpi__etiqueta">' + e + '</div><div class="kpi__valor"' + (color ? ' style="color:' + color + '"' : '') + '>' + v + '</div><div class="kpi__contexto">' + x + '</div></div>'; }
  function barras(lista, max) {
    return '<ul class="graf-h">' + lista.map(function (d) { return '<li tabindex="0" aria-label="' + esc(d[0] + ': ' + F.entero(d[1])) + '" title="' + esc(d[0] + ': ' + F.entero(d[1])) + '"><span class="graf-h__et">' + esc(d[0]) + '</span><span class="graf-h__barra"><span style="width:' + Math.max(1, Math.round(d[1] / max * 100)) + '%"></span></span><span class="graf-h__val num">' + F.entero(d[1]) + '</span></li>'; }).join('') + '</ul>';
  }
  function pasosEmision(i) { return '<section class="panel">' + R.pasos(['Preparación', 'Simulación', 'Revisión', 'Aprobación', 'Emisión', 'Cuponera'], i) + '</section>'; }

  /* ======================= EMI-01 Preparación ======================= */
  R.vistas['EMI-01'] = function (ctx) {
    var falta = faltantes();
    return {
      subtitulo: 'Lote ' + E().lote + ' · impuesto predial 2027 de todos los contribuyentes del cercado',
      acciones: '<a class="btn btn--primario" href="#/emision/simulacion">Ir a la simulación</a>' + R.btn(ctx, 'Guardar alcance', { id: 'emi-guardar' }),
      contenido: pasosEmision(0) +
        (falta.length ? R.aviso('alerta', 'Se puede simular, todavía no emitir', 'Faltan ' + falta.length + ' datos oficiales. La simulación usa valores de ejemplo; la emisión definitiva se habilita cuando estén publicados.') : R.aviso('exito', 'Todo listo para emitir', 'Los datos oficiales 2027 están publicados.')) +
        '<section class="panel"><h2>Datos que usa la emisión</h2><table><thead><tr><th scope="col">Dato</th><th scope="col">Estado</th><th scope="col">Detalle</th></tr></thead><tbody>' +
        E().parametros.map(function (p) { return fila(['<strong>' + esc(p.nombre) + '</strong>', R.ins(ST[p.estado][0], ST[p.estado][1]), esc(p.detalle) + (p.pend ? ' ' + R.pend(p.pend) : '')]); }).join('') +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">Cada dato viene de su norma publicada en «Maestros y parámetros». Ninguno se escribe a mano en este módulo.</p></section>' +
        '<section class="panel"><h2>Alcance del lote</h2><div class="form-rejilla">' +
        R.campo({ id: 'emi-anio', label: 'Ejercicio', opciones: [2027] }) +
        R.campo({ id: 'emi-ambito', label: 'Contribuyentes', opciones: ['Todos los del cercado', 'Solo Sector Centro', 'Solo Sector Norte', 'Solo Sector Sur'] }) +
        R.campo({ id: 'emi-trib', label: 'Qué se emite', opciones: ['Impuesto predial 2027', 'Impuesto predial y arbitrios 2027 (si hay ordenanza)'] }) +
        R.campo({ id: 'emi-docs', label: 'Documentos', opciones: ['Hoja de liquidación, declaración y cuponera', 'Solo cuponera'] }) + '</div>' +
        '<p class="micro" style="margin-top:var(--s-3)">Si la emisión 2027 ya se hizo en el sistema actual, se migra en lugar de emitirse otra vez ' + R.pend('PE-048') + '</p></section>',
      despues: function () { var b = $('#emi-guardar'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('exito', 'Alcance guardado', 'Lote ' + E().lote + ' listo para simular.'); }); }
    };
  };

  /* ======================= EMI-02 Simulación y revisión ======================= */
  R.vistas['EMI-02'] = function (ctx) {
    var S = E().resumen;
    function resultado() {
      var total = S.conceptos.reduce(function (a, c) { return a + c[1]; }, 0);
      return '<div class="kpis">' + kpi('Contribuyentes', F.entero(S.contribuyentes), R.ficticio()) + kpi('Predios', F.entero(S.predios), 'incluidos en el cálculo') +
        kpi('Listos para emitir', F.entero(S.listos), 'sin observaciones', 'var(--c-exito)') + kpi('Observados', S.observados, 'se corrigen antes de emitir', 'var(--c-alerta)') + '</div>' +
        '<div class="rejilla-2"><section class="panel"><h2>Monto simulado por concepto</h2><table><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Monto 2027</th></tr></thead><tbody>' +
        S.conceptos.map(function (c) { return fila([esc(c[0]), n(F.moneda(c[1]))]); }).join('') + '</tbody><tfoot><tr><td>Total</td><td class="num">' + F.moneda(total) + '</td></tr></tfoot></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Simulación: no crea deudas. ' + R.ficticio() + '</p></section>' +
        '<section class="panel"><h2>Contribuyentes por monto anual</h2>' + barras(E().rangos, 2210) + '</section></div>' +
        '<section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Revisión previa del lote · una persona decide</h2><p class="pequeno">Casos con datos dudosos que conviene corregir antes de emitir. Un caso observado no detiene a los demás; si no se corrige, se emite después de forma individual.</p>' +
        '<div class="tabla-marco"><table><caption class="sr-only">Observados</caption><thead><tr><th scope="col">Contribuyente</th><th scope="col">Motivo</th><th scope="col">Detectado por</th><th scope="col">Qué hacer</th></tr></thead><tbody>' +
        E().observados.map(function (o) { return fila(['<a href="#/contribuyentes/ficha/' + (o.codigo === 'CTB-000140' ? 'CTB-000140' : 'CTB-000101') + '">' + esc(o.nombre) + '</a><div class="micro mono">' + o.codigo + '</div>', esc(o.motivo), esc(o.origen), esc(o.accion)]); }).join('') +
        '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">Se muestran 5 de ' + S.observados + '.</p></section>';
    }
    return {
      subtitulo: 'Lote ' + E().lote + ' · se calcula a todos sin crear deudas, para revisar antes de emitir.',
      acciones: R.btn(ctx, 'Simular lote', { tipo: 'primario', id: 'emi-sim' }) + '<a class="btn" href="#/emision/emision">Enviar a aprobación</a>',
      contenido: pasosEmision(1) + '<div id="emi-res"></div>',
      despues: function () {
        var b = $('#emi-sim');
        if (b && !b.disabled) b.addEventListener('click', function () {
          b.disabled = true; b.textContent = 'Simulando…';
          $('#emi-res').innerHTML = '<section class="panel"><p aria-live="polite">Calculando ' + F.entero(S.contribuyentes) + ' contribuyentes…</p><div class="barra-total"><span style="width:65%"></span></div></section>';
          setTimeout(function () { $('#emi-res').innerHTML = resultado(); b.disabled = false; b.textContent = 'Volver a simular'; R.avisar('exito', 'Simulación lista', F.entero(S.listos) + ' listos y ' + S.observados + ' observados.'); }, 700);
        });
        else $('#emi-res').innerHTML = resultado();
      }
    };
  };

  /* ======================= EMI-03 Aprobación y emisión definitiva ======================= */
  R.vistas['EMI-03'] = function (ctx) {
    var S = E().resumen, st = { datosListos: false };
    function pintar() {
      var falta = st.datosListos ? [] : faltantes();
      $('#emi-estado').innerHTML = falta.length
        ? R.aviso('alerta', 'Todavía no se puede emitir', 'Faltan datos oficiales: ' + falta.map(function (p) { return esc(p.nombre); }).join('; ') + '.') +
          '<label class="pequeno" style="display:flex;gap:var(--s-2);align-items:center;margin-top:var(--s-3)"><input type="checkbox" id="emi-demo"> Simular que los datos oficiales ya llegaron (demostración)</label>'
        : R.aviso('exito', 'Lote listo para aprobar', 'Datos oficiales publicados, simulación revisada y ' + S.observados + ' observados apartados para emisión individual.');
      var b = $('#emi-aprobar'); if (b) b.disabled = !!falta.length || ctx.acceso === 'lectura';
      var c = $('#emi-demo'); if (c) c.addEventListener('change', function () { st.datosListos = c.checked; pintar(); });
    }
    return {
      subtitulo: 'Lote ' + E().lote + ' · la emisión crea las deudas y cuotas 2027 en el estado de cuenta.',
      acciones: '<button type="button" class="btn btn--primario" id="emi-aprobar" disabled>Aprobar y emitir</button><a class="btn" href="#/emision/simulacion">Volver a la simulación</a>',
      contenido: pasosEmision(3) + '<div id="emi-fin"></div><section class="panel"><h2>Estado del lote</h2><div id="emi-estado"></div></section>' +
        '<section class="panel"><h2>Qué se emitirá</h2>' + R.dl([['Contribuyentes', F.entero(S.listos)], ['Observados (no se emiten ahora)', String(S.observados)], ['Cuotas por contribuyente', '4, o pago al contado'], ['Preparó', 'usr.demo.operador'], ['Aprueba', 'Un supervisor distinto de quien preparó']]) +
        '<p class="micro" style="margin-top:var(--s-3)">Si el proceso se interrumpe y se vuelve a lanzar, continúa donde quedó y no duplica deudas.</p></section>',
      despues: function () {
        pintar();
        $('#emi-aprobar').addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Aprobar y emitir el lote ' + E().lote, accion: 'Emitir ' + F.entero(S.listos) + ' contribuyentes', recurso: 'lote de emisión ' + E().lote, etiquetaMotivo: 'Conformidad de la revisión',
            resumen: [['Contribuyentes', F.entero(S.listos)], ['Observados apartados', String(S.observados)], ['Ejercicio', '2027'], ['Qué crea', 'Deudas, cuotas y documentos; nada se borra']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) {
              $('#emi-fin').innerHTML = '<section class="panel"><p aria-live="polite">Emitiendo…</p><div class="barra-total"><span style="width:80%"></span></div></section>';
              setTimeout(function () {
                $('#emi-fin').innerHTML = R.aviso('exito', 'Emisión 2027 completada', F.entero(S.listos) + ' contribuyentes emitidos. Las deudas ya aparecen en sus estados de cuenta. <a href="#/emision/cuponera">Ir a cuponera y reparto</a>') + huella;
                $('#emi-aprobar').disabled = true;
              }, 600);
            } });
        });
      }
    };
  };

  /* ======================= EMI-04 Cuponera y reparto ======================= */
  R.vistas['EMI-04'] = function (ctx) {
    var rep = E().reparto, t = rep.reduce(function (a, r) { return { c: a.c + r.cuponeras, i: a.i + r.impresas, e: a.e + r.entregadas, d: a.d + r.devueltas }; }, { c: 0, i: 0, e: 0, d: 0 });
    var venc = ['2027-02-26', '2027-05-31', '2027-08-31', '2027-11-30'];
    var cupon = function (i) { return '<div class="cupon"><div class="cupon__n">Cuota ' + (i + 1) + '</div><div class="cupon__m">' + F.moneda(6750) + '</div><div class="micro">Vence ' + F.fecha(venc[i]) + '</div><div class="cupon__cod mono">CTB-000101-27-' + (i + 1) + '</div></div>'; };
    return {
      subtitulo: 'Lote ' + E().lote + ' · documentos por contribuyente, impresión y control de entrega.',
      acciones: '<button type="button" class="btn btn--primario" id="emi-desc">' + R.icono('descargar') + 'Descargar cuponeras por sector</button>' + R.btn(ctx, 'Registrar entrega', { id: 'emi-entrega' }),
      contenido: pasosEmision(5) + '<div id="emi-r"></div><div class="kpis">' + kpi('Cuponeras generadas', F.entero(t.c), R.ficticio()) + kpi('Impresas', F.entero(t.i), Math.round(t.i / t.c * 100) + ' %') +
        kpi('Entregadas', F.entero(t.e), Math.round(t.e / t.c * 100) + ' % del total', 'var(--c-exito)') + kpi('Devueltas', t.d, 'domicilio no ubicado o rechazo', 'var(--c-alerta)') + '</div>' +
        '<section class="panel"><h2>Avance por sector</h2><div class="tabla-marco"><table><caption class="sr-only">Reparto</caption><thead><tr><th scope="col">Sector</th><th scope="col" class="num">Cuponeras</th><th scope="col" class="num">Impresas</th><th scope="col">Entregadas</th><th scope="col" class="num">Devueltas</th></tr></thead><tbody>' +
        rep.map(function (r) { var pct = Math.round(r.entregadas / r.cuponeras * 100); return fila([esc(r.sector), n(F.entero(r.cuponeras)), n(F.entero(r.impresas)), '<div class="barra-total" role="img" aria-label="' + pct + ' % entregado" style="max-width:10rem;display:inline-block;width:10rem;vertical-align:middle"><span style="width:' + pct + '%"></span></div> <span class="pequeno">' + pct + ' %</span>', n(r.devueltas)]); }).join('') +
        '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">Formato de la cuponera y forma de reparto ' + R.pend('PE-048') + ' · Las devueltas pasan a revisión de domicilio.</p></section>' +
        '<section class="panel"><h2>Vista previa · cuponera de Ana Prueba Quispe</h2><div class="cuponera"><div class="cuponera__cab"><strong>Impuesto predial 2027</strong><span class="pequeno">CTB-000101 · Jr. Los Ejemplos 145 · base imponible ' + F.moneda(10000000) + '</span></div><div class="cuponera__cupones">' + [0, 1, 2, 3].map(cupon).join('') + '</div>' +
        '<p class="micro" style="margin:var(--s-3) 0 0">También puede pagar el total de ' + F.moneda(27000) + ' al contado hasta el primer vencimiento. Fechas de vencimiento por confirmar ' + R.pend('PE-042') + ' · ' + R.ficticio() + '</p></div></section>',
      despues: function () {
        $('#emi-desc').addEventListener('click', function () { R.avisar('info', 'Descarga de ejemplo', 'En el sistema se descarga un PDF por sector, ordenado por ruta de reparto.'); });
        var b = $('#emi-entrega'); if (b && !b.disabled) b.addEventListener('click', function () { $('#emi-r').innerHTML = R.aviso('exito', 'Entrega registrada', 'Sector Sur: 120 cuponeras entregadas y 3 devueltas con su motivo.'); });
      }
    };
  };

  /* ======================= BEN-02 Campañas de amnistía ======================= */
  R.vistas['BEN-02'] = function (ctx) {
    var c = D.campana;
    function efecto() {
      var filas = D.obligacionesDe('CTB-000101').map(function (o) { return { o: o, s: D.saldo(o) }; }).filter(function (f) { return f.s.total > 0 && f.s.vencida; });
      var tot = filas.reduce(function (a, f) { return a + f.s.total; }, 0), desc = filas.reduce(function (a, f) { return a + f.s.descuento; }, 0);
      return '<table><thead><tr><th scope="col">Deuda vencida</th><th scope="col" class="num">Sin amnistía</th><th scope="col" class="num">Descuento</th><th scope="col" class="num">A pagar</th></tr></thead><tbody>' +
        filas.map(function (f) { return fila([esc(f.o.tributo + ' ' + f.o.anio + ' · ' + f.o.periodo), n(F.moneda(f.s.total)), n(f.s.descuento ? '−' + F.moneda(f.s.descuento) : '—'), n('<strong>' + F.moneda(f.s.pagar) + '</strong>')]); }).join('') +
        '</tbody><tfoot><tr><td>Total</td><td class="num">' + F.moneda(tot) + '</td><td class="num">' + (desc ? '−' + F.moneda(desc) : '—') + '</td><td class="num">' + F.moneda(tot - desc) + '</td></tr></tfoot></table>' +
        (c.activa ? '' : '<p class="pequeno texto-2" style="margin-top:var(--s-2)">La campaña no está activa: no hay descuento. Actívala para ver el efecto.</p>');
    }
    function pintar() {
      $('#cam-estado').innerHTML = c.activa ? R.ins('Activa (demostración)', 'exito') : R.ins('En preparación', 'alerta');
      $('#cam-efecto').innerHTML = efecto();
      var b = $('#cam-toggle'); if (b) b.textContent = c.activa ? 'Desactivar campaña de demostración' : 'Activar campaña de demostración';
    }
    return {
      subtitulo: 'La amnistía se aplica solo con su ordenanza publicada y solo mientras está vigente. Al vencer, deja de aplicarse sola y lo ya pagado no cambia.',
      acciones: R.btn(ctx, 'Activar campaña de demostración', { tipo: 'primario', id: 'cam-toggle' }) + '<a class="btn" href="#/cuenta/estado/CTB-000101">Ver estado de cuenta</a><a class="btn btn--terciario" href="#/caja/cobranza/CTB-000101">Cobrar en caja</a>',
      contenido: '<div id="cam-res"></div><section class="panel"><h2>' + esc(c.nombre) + ' <span id="cam-estado"></span></h2>' +
        R.dl([['Norma', 'Ordenanza por confirmar ' + R.pend('PE-049')], ['Vigencia', F.fecha(c.inicio) + ' al ' + F.fecha(c.fin) + ' (ejemplo)'], ['Deudas incluidas', 'Vencidas hasta el ejercicio ' + c.hastaAnio + ', excepto las que están en coactivo'],
          ['Conceptos', esc(c.conceptos.join(', '))], ['Descuento en intereses', c.pctInteres + ' % (ejemplo)'], ['Descuento en multas', c.pctMulta + ' % (ejemplo)'], ['Se acumula con otros beneficios', c.acumulable ? 'Sí' : 'No']]) +
        '<p class="micro" style="margin-top:var(--s-3)">Porcentajes, conceptos y fechas de ejemplo: se reemplazan por los de la ordenanza ' + R.pend('PE-060') + '. En el sistema real, la campaña la publica un supervisor después de registrar la ordenanza.</p></section>' +
        '<section class="panel"><h2>Efecto en un contribuyente · Ana Prueba Quispe</h2><div id="cam-efecto"></div><p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + '</p></section>',
      despues: function () {
        pintar();
        var b = $('#cam-toggle'); if (b && !b.disabled) b.addEventListener('click', function () {
          c.activa = !c.activa; pintar();
          $('#cam-res').innerHTML = c.activa ? R.aviso('exito', 'Campaña activa (demostración)', 'El descuento ya se ve en el estado de cuenta y en caja, y aparece en el recibo.') : R.aviso('info', 'Campaña desactivada', 'Los montos vuelven a calcularse sin descuento.');
        });
      }
    };
  };

  /* ======================= BEN-03 Reporte ======================= */
  R.vistas['BEN-03'] = function (ctx) {
    var r = D.campana.resultados;
    return {
      subtitulo: esc(D.campana.nombre) + ' · ' + R.ficticio(),
      acciones: '<button type="button" class="btn btn--primario" onclick="window.print()">Imprimir reporte</button>',
      contenido: '<div class="kpis">' + kpi('Contribuyentes acogidos', F.entero(r.contribuyentes), 'en la campaña') + kpi('Monto condonado', F.moneda(r.condonado), 'intereses y multas') +
        kpi('Monto recaudado', F.moneda(r.recaudado), 'pagado durante la campaña', 'var(--c-exito)') + kpi('Recaudado por cada sol condonado', 'S/ ' + (r.recaudado / r.condonado).toFixed(2), 'relación de la campaña') + '</div>' +
        '<div class="rejilla-2"><section class="panel"><h2>Por concepto</h2><table><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Condonado</th><th scope="col" class="num">Recaudado</th></tr></thead><tbody>' +
        fila(['Impuesto predial', n(F.moneda(9840000)), n(F.moneda(25620000))]) + fila(['Arbitrios', n(F.moneda(6120000)), n(F.moneda(14230000))]) + fila(['Multa tributaria', n(F.moneda(2600000)), n(F.moneda(2460000))]) +
        '</tbody><tfoot><tr><td>Total</td><td class="num">' + F.moneda(r.condonado) + '</td><td class="num">' + F.moneda(r.recaudado) + '</td></tr></tfoot></table></section>' +
        '<section class="panel"><h2>Beneficios individuales del año</h2><table><thead><tr><th scope="col">Beneficio</th><th scope="col" class="num">Aprobados</th><th scope="col" class="num">En trámite</th></tr></thead><tbody>' +
        fila(['Deducción de 50 UIT (pensionista)', n('1'), n('2')]) + '</tbody></table><p class="micro" style="margin-top:var(--s-2)">Cada descuento queda enlazado a su norma y, si es individual, a su resolución.</p></section></div>' +
        R.aviso('info', 'Control', 'Un descuento aplicado fuera de la regla de la campaña genera una alerta para el área de control interno.') +
        R.bloquePendientes('BEN-03')
    };
  };
})(window.RENTAS = window.RENTAS || {});
