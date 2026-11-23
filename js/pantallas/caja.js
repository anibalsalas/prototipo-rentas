/* Recaudación: Caja (CAJ): apertura, cobranza, extornos, cierre y conciliación. */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;
  function C() { return D.caja; }
  function concepto(o) { return o.tributo + ' ' + o.anio + ' · ' + o.periodo; }
  function tarjetaSesion() {
    var s = C().sesion;
    if (!s || s.estado !== 'Abierta') return R.aviso('alerta', 'La caja está cerrada', 'Abre la caja para empezar a cobrar. <a href="#/caja/apertura">Abrir caja</a>');
    var cobrado = C().operaciones.filter(function (o) { return o.estado === 'Válido'; }).reduce(function (a, o) { return a + o.monto; }, 0);
    return '<section class="panel panel--plano cab-contrib" aria-label="Sesión de caja"><div class="cab-contrib__id"><span class="card__icono">' + R.icono('caja', 'icono-lg') + '</span><div><h2 style="font-size:var(--t-h3)">' + esc(s.caja) + ' ' + R.ins('Abierta', 'exito') + '</h2>' +
      '<div class="pequeno texto-2">Sesión ' + s.numero + ' · abierta a las ' + s.abierta + ' · fondo inicial ' + F.moneda(s.fondo) + '</div></div></div>' +
      '<div class="pequeno"><strong>' + C().operaciones.length + '</strong> operaciones · cobrado <strong>' + F.moneda(cobrado) + '</strong></div></section>';
  }

  /* ======================= CAJ-01 Apertura ======================= */
  R.vistas['CAJ-01'] = function (ctx) {
    var abierta = C().sesion && C().sesion.estado === 'Abierta';
    return {
      subtitulo: 'Cada cajero trabaja con su propia sesión. Solo puede haber una sesión abierta por caja.',
      acciones: abierta ? '<a class="btn btn--primario" href="#/caja/cobranza">' + R.icono('caja') + 'Ir a cobranza</a><a class="btn" href="#/caja/cierre">Cerrar caja</a>'
        : R.btn(ctx, 'Abrir caja', { tipo: 'primario', id: 'btn-abrir' }),
      contenido: '<div id="res-ap"></div>' + (abierta ? tarjetaSesion() + R.aviso('info', 'Ya tienes una caja abierta', 'Ciérrala al terminar el turno con su arqueo.') + R.bloquePendientes('CAJ-01') :
        '<section class="panel"><h2>Datos de apertura</h2><div class="form-rejilla">' +
        R.campo({ id: 'a-caja', label: 'Caja', opciones: C().cajas, obligatorio: true, pend: 'PE-100' }) +
        R.campo({ id: 'a-fondo', label: 'Fondo inicial en efectivo (S/)', tipo: 'number', valor: '200.00', obligatorio: true, ayuda: 'Dinero para dar vuelto. Se cuenta otra vez al cerrar.' }) +
        R.campo({ id: 'a-fecha', label: 'Fecha', valor: F.fecha(R.config.fechaCorte), readonly: true }) +
        R.campo({ id: 'a-cajero', label: 'Cajero', valor: R.usuarioDemo((ctx.perfil || {}).id), readonly: true }) + '</div></section>'),
      despues: function () {
        var b = $('#btn-abrir'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          R.limpiarError('a-fondo');
          var v = Math.round(Number($('#a-fondo').value) * 100);
          if (!(v >= 0) || $('#a-fondo').value === '') { R.marcarError('a-fondo', 'Escribe el fondo inicial (puede ser 0).').focus(); return; }
          C().sesion = { numero: 'SES-2027-0313', caja: $('#a-caja').value, cajero: R.usuarioDemo(ctx.perfil.id), abierta: R.horaActual(), fondo: v, estado: 'Abierta' };
          C().operaciones = [];
          R.render(); R.avisar('exito', 'Caja abierta', 'Sesión SES-2027-0313');
        });
      }
    };
  };

  /* ======================= CAJ-02 Cobranza ======================= */
  R.vistas['CAJ-02'] = function (ctx) {
    var c = R.ctxContribuyente(ctx);
    var abierta = C().sesion && C().sesion.estado === 'Abierta';
    var preSel = (ctx.q.sel || '').split(',').filter(Boolean);
    var st = { sel: {}, cot: null, recibo: null };
    var deudas = function () { return D.obligacionesDe(c.codigo).map(function (o) { return { o: o, s: D.saldo(o) }; }).filter(function (f) { return f.s.total > 0; }).sort(function (a, b) { return a.o.vence < b.o.vence ? -1 : 1; }); };
    deudas().forEach(function (f) { if (preSel.indexOf(f.o.id) >= 0) st.sel[f.o.id] = true; });
    var lectura = ctx.acceso === 'lectura' || !abierta;

    function totalSel() { return deudas().filter(function (f) { return st.sel[f.o.id]; }).reduce(function (a, f) { return a + f.s.pagar; }, 0); }
    function descSel() { return deudas().filter(function (f) { return st.sel[f.o.id]; }).reduce(function (a, f) { return a + f.s.descuento; }, 0); }
    function pintarDeudas() {
      var l = deudas();
      $('#cj-deudas').innerHTML = l.length ? '<div class="tabla-marco"><table><caption class="sr-only">Deudas a cobrar</caption><thead><tr><th scope="col"><span class="sr-only">Elegir</span></th><th scope="col">Concepto</th><th scope="col">Vence</th><th scope="col" class="num">Interés</th><th scope="col" class="num">Total</th><th scope="col">Situación</th></tr></thead><tbody>' +
        l.map(function (f) {
          return '<tr><td><input type="checkbox" data-cj="' + f.o.id + '"' + (st.sel[f.o.id] ? ' checked' : '') + (lectura ? ' disabled' : '') + ' aria-label="Cobrar ' + esc(concepto(f.o)) + '" style="width:1.1rem;height:1.1rem"></td><td>' + esc(concepto(f.o)) + (f.o.costas ? '<div class="micro">Incluye costas ' + F.moneda(f.o.costas) + '</div>' : '') + '</td><td>' + F.fecha(f.o.vence) + '</td><td class="num">' + (f.o.sinInteres ? '—' : F.moneda(f.s.interes)) + '</td><td class="num">' + (f.s.descuento ? '<s class="micro">' + F.moneda(f.s.total) + '</s><br>' : '') + '<strong>' + F.moneda(f.s.pagar) + '</strong></td><td>' + R.insSituacion(f.o.situacion) + '</td></tr>';
        }).join('') + '</tbody></table></div>' : R.estadoVacio('check', 'No tiene deudas pendientes', 'Puedes cobrar otros ingresos en la pestaña de al lado.');
    }
    function pintarPago() {
      var tot = totalSel(), n = Object.keys(st.sel).filter(function (k) { return st.sel[k]; }).length;
      if (st.recibo) { $('#cj-pago').innerHTML = st.recibo; return; }
      if (!st.cot) {
        $('#cj-pago').innerHTML = '<h2>Pago</h2><p class="pequeno texto-2">' + n + ' deuda' + (n === 1 ? '' : 's') + ' seleccionada' + (n === 1 ? '' : 's') + '</p>' +
          '<div class="calculo"><div class="calculo__fila calculo__fila--total"><span>Total seleccionado</span><span class="num">' + F.moneda(tot) + '</span></div></div>' +
          '<p class="micro">Orden en que se aplica un pago parcial: interés primero y luego el tributo, de la deuda más antigua a la más reciente ' + R.pend('PE-101') + '</p>' +
          '<button type="button" class="btn btn--primario" id="cj-cotizar" style="width:100%"' + (n && !lectura ? '' : ' disabled') + '>Calcular monto a pagar</button>';
        var b = $('#cj-cotizar'); if (b) b.addEventListener('click', function () { st.cot = { total: tot, numero: 'COT-2027-' + String(Math.floor(Math.random() * 90000) + 10000), vence: '15 minutos' }; pintarPago(); });
        return;
      }
      $('#cj-pago').innerHTML = '<h2>Pago</h2>' + R.aviso('info', 'Monto calculado al ' + F.fecha(R.config.fechaCorte), 'Válido por ' + st.cot.vence + '. Si la deuda cambia antes de cobrar, se vuelve a calcular.') +
        '<div class="calculo" style="margin-top:var(--s-3)"><div class="calculo__fila calculo__fila--total"><span>A pagar</span><span class="num">' + F.moneda(st.cot.total) + '</span></div></div>' +
        '<div style="display:grid;gap:var(--s-3);margin-top:var(--s-3)">' +
        R.campo({ id: 'cj-medio', label: 'Medio de pago', opciones: C().medios, pend: 'PE-100' }) +
        R.campo({ id: 'cj-monto', label: 'Monto que paga ahora (S/)', tipo: 'number', valor: (st.cot.total / 100).toFixed(2), ayuda: 'Si paga menos, se registra un pago a cuenta.' }) +
        R.campo({ id: 'cj-recibe', label: 'Efectivo recibido (S/)', tipo: 'number', valor: '', ayuda: 'Para calcular el vuelto.' }) + '<p id="cj-vuelto" class="pequeno" aria-live="polite" style="margin:0"></p>' +
        '<label class="pequeno" style="display:flex;gap:var(--s-2);align-items:center"><input type="checkbox" id="cj-corte"> Simular corte de conexión al confirmar (demostración)</label>' +
        '<button type="button" class="btn btn--primario" id="cj-confirmar">Confirmar pago</button><button type="button" class="btn btn--terciario" id="cj-cancelar">Cambiar selección</button></div>';
      function vuelto() {
        var m = Math.round(Number($('#cj-monto').value) * 100), r = Math.round(Number($('#cj-recibe').value) * 100);
        $('#cj-vuelto').innerHTML = r ? (r >= m ? 'Vuelto: <strong>' + F.moneda(r - m) + '</strong>' : '<span style="color:var(--c-error)">El efectivo recibido es menor que el monto.</span>') : '';
      }
      $('#cj-monto').addEventListener('input', vuelto); $('#cj-recibe').addEventListener('input', vuelto);
      $('#cj-cancelar').addEventListener('click', function () { st.cot = null; pintarPago(); });
      $('#cj-confirmar').addEventListener('click', function () {
        R.limpiarError('cj-monto');
        var monto = Math.round(Number($('#cj-monto').value) * 100);
        if (!(monto > 0)) { R.marcarError('cj-monto', 'Escribe un monto mayor que cero.').focus(); return; }
        if (monto > st.cot.total) { R.marcarError('cj-monto', 'El monto no puede ser mayor que la deuda seleccionada (' + F.moneda(st.cot.total) + ').').focus(); return; }
        var medio = $('#cj-medio').value, corte = $('#cj-corte').checked;
        R.confirmarSensible({ titulo: 'Confirmar pago', accion: 'Cobrar ' + F.moneda(monto), recurso: 'pago de ' + c.codigo, sinMotivo: true,
          textoConfirmacion: 'El pago y el recibo se registran juntos. Si se pierde la conexión, no se cobrará dos veces.',
          resumen: [['Contribuyente', esc(c.nombre)], ['Monto', F.moneda(monto) + (monto < st.cot.total ? ' (pago a cuenta)' : '')], ['Medio', esc(medio)], ['Deudas', String(Object.keys(st.sel).filter(function (k) { return st.sel[k]; }).length)]],
          alConfirmar: function (huella) {
            if (corte) {
              $('#cj-pago').innerHTML = '<h2>Pago</h2>' + R.aviso('alerta', 'Estamos verificando el pago…', 'Se perdió la conexión. No vuelvas a cobrar: el sistema consulta si el pago ya se registró.');
              setTimeout(function () { registrar(monto, medio, huella, true); }, 1200);
            } else registrar(monto, medio, huella, false);
          } });
      });
    }
    function registrar(monto, medio, huella, recuperado) {
      var descTot = descSel(), completo = descTot > 0 && monto >= totalSel();
      var resto = monto + (completo ? descTot : 0), aplic = [];
      deudas().filter(function (f) { return st.sel[f.o.id]; }).forEach(function (f) {
        if (resto <= 0) return;
        var o = f.o, s = f.s, aInt = Math.min(resto, s.interes); resto -= aInt;
        var aCap = Math.min(resto, s.capital + s.costas); resto -= aCap;
        o.pagado += Math.min(aCap, s.capital); if (aCap > s.capital) o.costas = Math.max(0, (o.costas || 0) - (aCap - s.capital));
        aplic.push([concepto(o), aInt, aCap, completo ? s.descuento : 0]);
      });
      var num = 'R-001-' + String(C().siguienteRecibo++).padStart(7, '0');
      C().operaciones.push({ recibo: num, hora: R.horaActual(), contribuyente: c.nombre, concepto: aplic.map(function (a) { return a[0]; }).join('; '), medio: medio, monto: monto, estado: 'Válido' });
      st.recibo = '<h2>Recibo ' + num + '</h2>' + R.aviso('exito', recuperado ? 'El pago sí se registró' : 'Pago registrado', (recuperado ? 'Se recuperó el mismo recibo; no se cobró dos veces. ' : '') + esc(c.nombre) + ' · ' + F.moneda(monto) + ' · ' + esc(medio)) +
        '<table style="margin-top:var(--s-3)"><caption class="sr-only">Aplicación del pago</caption><thead><tr><th scope="col">Deuda</th><th scope="col" class="num">Interés</th><th scope="col" class="num">Tributo</th>' + (completo ? '<th scope="col" class="num">Descuento amnistía</th>' : '') + '</tr></thead><tbody>' +
        aplic.map(function (a) { return '<tr><td>' + esc(a[0]) + '</td><td class="num">' + F.moneda(a[1]) + '</td><td class="num">' + F.moneda(a[2]) + '</td>' + (completo ? '<td class="num">' + (a[3] ? '−' + F.moneda(a[3]) : '—') + '</td>' : '') + '</tr>'; }).join('') + '</tbody></table>' +
        (completo ? '<p class="pequeno" style="margin-top:var(--s-2)"><strong>Descuento por amnistía: ' + F.moneda(descTot) + '</strong> · ' + esc(D.campana.nombre) + '. El recibo muestra el descuento.</p>' : '') +
        (!completo && descTot > 0 ? R.aviso('info', 'Sin descuento de amnistía en este pago', 'El descuento se aplica al pagar el total seleccionado durante la campaña (regla de ejemplo, por confirmar con la ordenanza).') : '') +
        '<p class="micro" style="margin-top:var(--s-2)">Formato del recibo ' + R.pend('PE-103') + '</p>' +
        '<div style="display:flex;gap:var(--s-2);flex-wrap:wrap;margin-top:var(--s-3)"><button type="button" class="btn btn--primario" onclick="window.print()">Imprimir recibo</button><a class="btn" href="#/cuenta/estado/' + c.codigo + '">Ver estado de cuenta</a><button type="button" class="btn btn--terciario" id="cj-nuevo">Nuevo cobro</button></div>' +
        '<div style="margin-top:var(--s-3)">' + huella + '</div>';
      pintarDeudas(); pintarPago();
      var n = $('#cj-nuevo'); if (n) n.addEventListener('click', function () { st = { sel: {}, cot: null, recibo: null }; pintarDeudas(); pintarPago(); });
      R.avisar('exito', 'Pago registrado', num);
    }
    var otros = '<div class="form-rejilla">' + R.campo({ id: 'oi-concepto', label: 'Concepto del tarifario', opciones: C().otrosIngresos.map(function (x, i) { return [i, x[0] + ' · ' + F.moneda(x[1])]; }), pend: 'PE-102' }) +
      R.campo({ id: 'oi-cant', label: 'Cantidad', tipo: 'number', valor: 1 }) + '</div><p style="margin-top:var(--s-3)">' + R.btn(ctx, 'Cobrar este concepto', { id: 'oi-cobrar' }) + '</p><div id="oi-res"></div>';
    return {
      titulo: 'Cobranza en caja',
      subtitulo: 'Elige las deudas, calcula el monto, confirma y entrega el recibo.',
      acciones: '<a class="btn" href="#/contribuyentes/buscar">' + R.icono('buscar') + 'Buscar otro contribuyente</a><a class="btn btn--terciario" href="#/caja/extornos">Extornos</a><a class="btn btn--terciario" href="#/caja/cierre">Cerrar caja</a>',
      contenido: tarjetaSesion() + R.cabeceraContribuyente(c) +
        '<div class="caja-grid"><section class="panel">' + R.pestanas('caja', [
          { id: 'deu', t: 'Deudas del contribuyente', html: '<div id="cj-deudas"></div>' },
          { id: 'otr', t: 'Otros ingresos (TUPA)', html: otros }]) + '</section>' +
        '<section class="panel caja-pago" id="cj-pago" aria-live="polite"></section></div>' + R.bloquePendientes('CAJ-02'),
      despues: function () {
        pintarDeudas(); pintarPago();
        $('#cj-deudas').addEventListener('change', function (e) { var x = e.target.closest('[data-cj]'); if (x) { st.sel[x.dataset.cj] = x.checked; st.cot = null; pintarPago(); } });
        var oi = $('#oi-cobrar');
        if (oi && !oi.disabled) oi.addEventListener('click', function () {
          var it = C().otrosIngresos[Number($('#oi-concepto').value)], cant = Math.max(1, Number($('#oi-cant').value) || 1);
          var num = 'R-001-' + String(C().siguienteRecibo++).padStart(7, '0');
          C().operaciones.push({ recibo: num, hora: R.horaActual(), contribuyente: c.nombre, concepto: it[0], medio: 'Efectivo', monto: it[1] * cant, estado: 'Válido' });
          $('#oi-res').innerHTML = R.aviso('exito', 'Cobrado', 'Recibo ' + num + ' · ' + esc(it[0]) + ' × ' + cant + ' · ' + F.moneda(it[1] * cant) + ' ' + R.ficticio());
        });
      }
    };
  };

  /* ======================= CAJ-03 Extornos ======================= */
  R.vistas['CAJ-03'] = function (ctx) {
    var perfil = ctx.perfil.id, esAprobador = perfil === 'supervisor';
    function pintar() {
      var sol = C().solicitudesExtorno;
      $('#ex-sol').innerHTML = sol.length ? '<div class="tabla-marco"><table><caption class="sr-only">Solicitudes de extorno</caption><thead><tr><th scope="col">Solicitud</th><th scope="col">Recibo</th><th scope="col">Contribuyente</th><th scope="col" class="num">Monto</th><th scope="col">Motivo</th><th scope="col">Solicitó</th><th scope="col">Estado</th><th scope="col">Acción</th></tr></thead><tbody>' +
        sol.map(function (s) {
          var acc = s.estado !== 'Pendiente de aprobación' ? '' : esAprobador ? '<button type="button" class="btn btn--chico btn--peligro" data-aprobar="' + s.id + '">Revisar y aprobar</button>' : '<span class="micro">' + R.icono('candado') + ' Aprueba un supervisor</span>';
          return '<tr><td class="mono">' + s.id + '</td><td class="mono">' + s.recibo + '</td><td>' + esc(s.contribuyente) + '</td><td class="num">' + F.moneda(s.monto) + '</td><td class="pequeno">' + esc(s.motivo) + '</td><td>' + esc(s.solicitante) + ' · ' + s.hora + '</td><td>' + R.ins(s.estado, s.estado === 'Extornado' ? 'neutra' : 'alerta') + '</td><td>' + acc + '</td></tr>';
        }).join('') + '</tbody></table></div>' : R.estadoVacio('check', 'No hay solicitudes', 'Las solicitudes de extorno aparecerán aquí.');
      var ops = C().operaciones;
      $('#ex-ops').innerHTML = '<div class="tabla-marco"><table><caption class="sr-only">Operaciones de la sesión</caption><thead><tr><th scope="col">Recibo</th><th scope="col">Hora</th><th scope="col">Contribuyente</th><th scope="col">Concepto</th><th scope="col" class="num">Monto</th><th scope="col">Estado</th><th scope="col">Acción</th></tr></thead><tbody>' +
        ops.map(function (o) {
          var ya = C().solicitudesExtorno.some(function (s) { return s.recibo === o.recibo; });
          return '<tr><td class="mono">' + o.recibo + '</td><td>' + o.hora + '</td><td>' + esc(o.contribuyente) + '</td><td class="pequeno">' + esc(o.concepto) + '</td><td class="num">' + F.moneda(o.monto) + '</td><td>' + R.ins(o.estado, o.estado === 'Válido' ? 'exito' : 'neutra') + '</td><td>' +
            (o.estado === 'Válido' && !ya && ctx.acceso !== 'lectura' ? '<button type="button" class="btn btn--chico" data-solicitar="' + o.recibo + '">Solicitar extorno</button>' : ya ? '<span class="micro">Solicitud en curso</span>' : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    return {
      subtitulo: 'Un extorno revierte un pago registrado por error. Lo solicita el cajero y lo aprueba otra persona, cada uno en su propia sesión.',
      acciones: '<a class="btn btn--primario" href="#/caja/cobranza">' + R.icono('caja') + 'Volver a cobranza</a>',
      contenido: '<div id="ex-res"></div>' + R.aviso('info', 'Doble autorización', 'Primero el cajero solicita con el motivo y la evidencia; luego un supervisor la revisa y aprueba con su propia clave y código de verificación. No se comparten contraseñas. El recibo original no se borra: queda marcado como extornado y se registra un movimiento inverso. ' + R.pend('PE-104')) +
        '<section class="panel"><h2>Solicitudes de extorno</h2><div id="ex-sol"></div></section>' +
        '<section class="panel"><h2>Operaciones de la sesión</h2><div id="ex-ops"></div></section>' +
        '<section class="panel" id="ex-form" hidden><h2>Solicitar extorno del recibo <span id="ex-rec" class="mono"></span></h2><div class="form-rejilla">' +
        R.campo({ id: 'ex-motivo', label: 'Motivo', tipo: 'textarea', obligatorio: true, ancho: true }) +
        R.campo({ id: 'ex-evid', label: 'Evidencia', opciones: ['Declaración del contribuyente', 'Copia del recibo', 'Comprobante del banco', 'Otro'] }) + '</div>' +
        '<p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="ex-enviar">Enviar solicitud</button> <button type="button" class="btn btn--terciario" id="ex-cerrar">Cancelar</button></p></section>',
      despues: function () {
        pintar();
        var recibo = null;
        $('#ex-ops').addEventListener('click', function (e) { var b = e.target.closest('[data-solicitar]'); if (!b) return; recibo = b.dataset.solicitar; $('#ex-rec').textContent = recibo; $('#ex-form').hidden = false; $('#ex-motivo').focus(); });
        $('#ex-cerrar').addEventListener('click', function () { $('#ex-form').hidden = true; });
        $('#ex-enviar').addEventListener('click', function () {
          R.limpiarError('ex-motivo');
          if ($('#ex-motivo').value.trim().length < 10) { R.marcarError('ex-motivo', 'Explica el motivo (al menos 10 caracteres).').focus(); return; }
          var op = C().operaciones.filter(function (o) { return o.recibo === recibo; })[0];
          var id = 'EXT-2027-00' + (10 + C().solicitudesExtorno.length);
          C().solicitudesExtorno.push({ id: id, recibo: recibo, contribuyente: op.contribuyente, monto: op.monto, motivo: $('#ex-motivo').value.trim(), solicitante: R.usuarioDemo(perfil), perfilSolicitante: perfil, hora: R.horaActual(), estado: 'Pendiente de aprobación' });
          $('#ex-form').hidden = true; pintar();
          $('#ex-res').innerHTML = R.aviso('exito', 'Solicitud enviada', id + ' · queda pendiente hasta que la apruebe un supervisor. Cambia al perfil Supervisor para verla.') + R.huella({ accion: 'Solicitar extorno', recurso: 'recibo ' + recibo + ' (' + op.contribuyente + ')', motivo: C().solicitudesExtorno[C().solicitudesExtorno.length - 1].motivo, resultado: 'Pendiente de aprobación' });
        });
        $('#ex-sol').addEventListener('click', function (e) {
          var b = e.target.closest('[data-aprobar]'); if (!b) return;
          var s = C().solicitudesExtorno.filter(function (x) { return x.id === b.dataset.aprobar; })[0];
          R.confirmarSensible({ titulo: 'Aprobar extorno ' + s.id, accion: 'Extornar ' + F.moneda(s.monto), peligro: true, recurso: 'recibo ' + s.recibo, etiquetaMotivo: 'Comentario de la aprobación',
            resumen: [['Recibo', s.recibo], ['Contribuyente', esc(s.contribuyente)], ['Monto', F.moneda(s.monto)], ['Solicitó', esc(s.solicitante) + ' a las ' + s.hora], ['Motivo', esc(s.motivo)], ['Qué pasa', 'Se crea un movimiento inverso; el recibo queda «extornado», no se borra']],
            aprobador: { perfil: 'supervisor' }, solicitante: s.perfilSolicitante,
            alConfirmar: function (huella) {
              s.estado = 'Extornado';
              C().operaciones.forEach(function (o) { if (o.recibo === s.recibo) o.estado = 'Extornado'; });
              pintar();
              $('#ex-res').innerHTML = R.aviso('exito', 'Extorno realizado', s.recibo + ' quedó extornado. La deuda vuelve a estar pendiente.') + huella;
            } });
        });
      }
    };
  };

  /* ======================= CAJ-04 Cierre y arqueo ======================= */
  R.vistas['CAJ-04'] = function (ctx) {
    var ops = C().operaciones.filter(function (o) { return o.estado === 'Válido'; });
    var porMedio = {}; C().medios.forEach(function (m) { porMedio[m] = 0; });
    ops.forEach(function (o) { porMedio[o.medio] = (porMedio[o.medio] || 0) + o.monto; });
    var fondo = (C().sesion || {}).fondo || 0;
    var sistema = { 'Efectivo': porMedio['Efectivo'] + fondo };
    C().medios.forEach(function (m) { if (m !== 'Efectivo') sistema[m] = porMedio[m]; });
    var porConcepto = {};
    ops.forEach(function (o) { var k = /Predial/.test(o.concepto) ? 'Impuesto predial' : /Arbitrios/.test(o.concepto) ? 'Arbitrios' : /Fraccionamiento/.test(o.concepto) ? 'Fraccionamiento' : 'Otros ingresos (TUPA)'; porConcepto[k] = (porConcepto[k] || 0) + o.monto; });
    var total = ops.reduce(function (a, o) { return a + o.monto; }, 0);
    return {
      subtitulo: 'Cuenta lo que hay en caja por cada medio de pago. Las diferencias se explican; nunca se corrigen recibos para cuadrar.',
      acciones: R.btn(ctx, 'Cerrar caja', { tipo: 'primario', id: 'btn-cerrar' }) + '<button type="button" class="btn" onclick="window.print()">Imprimir parte diario</button>',
      contenido: '<div id="res-cierre"></div>' + tarjetaSesion() +
        '<section class="panel"><h2>Arqueo por medio de pago</h2><div class="tabla-marco"><table><caption class="sr-only">Arqueo</caption><thead><tr><th scope="col">Medio</th><th scope="col" class="num">Según el sistema</th><th scope="col">Contado</th><th scope="col" class="num">Diferencia</th></tr></thead><tbody>' +
        C().medios.map(function (m, i) { return '<tr><td>' + esc(m) + (m === 'Efectivo' ? '<div class="micro">Incluye fondo inicial ' + F.moneda(fondo) + '</div>' : '') + '</td><td class="num">' + F.moneda(sistema[m]) + '</td><td><label class="sr-only" for="aq-' + i + '">Contado ' + esc(m) + '</label><input id="aq-' + i + '" type="number" step="0.01" value="' + (sistema[m] / 100).toFixed(2) + '" data-sis="' + sistema[m] + '" style="max-width:9rem;min-height:2.25rem;border:1px solid var(--c-borde-control);border-radius:var(--r-2);padding:0 var(--s-2)"></td><td class="num" id="aq-d-' + i + '">' + F.moneda(0) + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">Prueba a cambiar el efectivo contado para ver cómo se pide justificar la diferencia.</p>' +
        '<div id="aq-just" hidden style="margin-top:var(--s-3)">' + R.campo({ id: 'aq-motivo', label: 'Justificación de la diferencia', tipo: 'textarea', obligatorio: true, pend: 'PE-105' }) + '</div></section>' +
        '<div class="rejilla-2"><section class="panel"><h2>Parte diario por concepto</h2><table><thead><tr><th scope="col">Concepto</th><th scope="col" class="num">Importe</th></tr></thead><tbody>' +
        Object.keys(porConcepto).map(function (k) { return '<tr><td>' + esc(k) + '</td><td class="num">' + F.moneda(porConcepto[k]) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td>Total recaudado</td><td class="num">' + F.moneda(total) + '</td></tr></tfoot></table><p class="micro" style="margin-top:var(--s-2)">Partidas presupuestales según el tarifario ' + R.pend('PE-102') + '</p></section>' +
        '<section class="panel"><h2>Resumen</h2>' + R.dl([['Operaciones válidas', String(ops.length)], ['Extornadas', String(C().operaciones.length - ops.length)], ['Total recaudado', F.moneda(total)], ['Cajero', esc((C().sesion || {}).cajero || '—')]]) + '</section></div>',
      despues: function () {
        function dif() {
          var hay = false;
          C().medios.forEach(function (m, i) { var inp = $('#aq-' + i), d = Math.round(Number(inp.value) * 100) - Number(inp.dataset.sis); if (d) hay = true; $('#aq-d-' + i).innerHTML = d ? '<strong style="color:var(--c-error)">' + F.moneda(d) + '</strong>' : F.moneda(0); });
          $('#aq-just').hidden = !hay; return hay;
        }
        document.querySelectorAll('[id^="aq-"][data-sis]').forEach(function (i) { i.addEventListener('input', dif); });
        var b = $('#btn-cerrar'); if (!b || b.disabled) return;
        if (!C().sesion || C().sesion.estado !== 'Abierta') { b.disabled = true; return; }
        b.addEventListener('click', function () {
          var hay = dif();
          if (hay && $('#aq-motivo').value.trim().length < 10) { R.marcarError('aq-motivo', 'Explica la diferencia (al menos 10 caracteres).').focus(); return; }
          R.confirmarSensible({ titulo: 'Cerrar caja', accion: 'Cerrar caja', recurso: 'sesión ' + C().sesion.numero, sinMotivo: true, textoConfirmacion: 'Después de cerrar no se pueden registrar más cobros en esta sesión.',
            resumen: [['Sesión', C().sesion.numero], ['Total recaudado', F.moneda(total)], ['Diferencias', hay ? 'Sí, justificadas' : 'No']],
            alConfirmar: function (huella) { C().sesion.estado = 'Cerrada'; $('#res-cierre').innerHTML = R.aviso('exito', 'Caja cerrada', 'Parte diario generado. Tesorería lo concilia con el banco.') + huella; b.disabled = true; } });
        });
      }
    };
  };

  /* ======================= CAJ-05 Conciliación ======================= */
  R.vistas['CAJ-05'] = function (ctx) {
    var L = D.conciliacion, tipo = { 'Conciliado': 'exito', 'Pendiente en banco': 'alerta', 'Sin pago en caja': 'error' };
    var cnt = function (e) { return L.filter(function (x) { return x.estado === e; }).length; };
    return {
      subtitulo: 'Compara lo cobrado en caja con lo que informa el banco o el proveedor de pagos. Que exista un voucher no significa que esté conciliado.',
      acciones: R.btn(ctx, 'Registrar conciliación del día', { tipo: 'primario', id: 'btn-conc' }) + '<button type="button" class="btn" id="btn-archivo">' + R.icono('descargar') + 'Cargar archivo del banco</button>',
      contenido: '<div id="res-conc"></div><div class="kpis">' +
        ['Conciliado', 'Pendiente en banco', 'Sin pago en caja'].map(function (e) { return '<div class="kpi"><div class="kpi__etiqueta">' + e + '</div><div class="kpi__valor">' + cnt(e) + '</div><div class="kpi__contexto">movimientos</div></div>'; }).join('') + '</div>' +
        '<section class="panel"><div class="filtros">' + R.campo({ id: 'cc-fecha', label: 'Fecha', tipo: 'date', valor: R.config.fechaCorte }) + R.campo({ id: 'cc-fuente', label: 'Banco o proveedor', opciones: ['Todos', 'Banco (ejemplo)', 'Proveedor de pagos con tarjeta (ejemplo)'], pend: 'PE-106' }) + '</div>' +
        '<div style="margin-top:var(--s-4)">' + R.tabla('t-conc', { caption: 'Conciliación', filas: L, columnas: [
          { clave: 'ref', titulo: 'Referencia', orden: true, render: function (x) { return '<span class="mono">' + x.ref + '</span>'; } },
          { clave: 'fecha', titulo: 'Fecha', tipo: 'fecha', orden: true }, { clave: 'fuente', titulo: 'Fuente', orden: true },
          { clave: 'caja', titulo: 'En caja', tipo: 'moneda', orden: true }, { clave: 'banco', titulo: 'En banco', tipo: 'moneda', orden: true },
          { clave: 'estado', titulo: 'Estado', orden: true, render: function (x) { return R.ins(x.estado, tipo[x.estado]); } },
          { clave: 'x', titulo: 'Responsable', render: function (x) { return x.estado === 'Conciliado' ? '—' : 'Tesorería · ' + (x.estado === 'Pendiente en banco' ? 'esperar abono' : 'identificar pagador'); } }] }) + '</div>' +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + '</p></section>',
      despues: function () {
        $('#btn-archivo').addEventListener('click', function () { R.avisar('info', 'Archivo de ejemplo', 'En el sistema se carga el archivo del banco y se cruza automáticamente por referencia e importe.'); });
        var b = $('#btn-conc'); if (b && !b.disabled) b.addEventListener('click', function () { $('#res-conc').innerHTML = R.aviso('exito', 'Conciliación registrada', '3 conciliados y 2 diferencias asignadas a Tesorería para seguimiento.') + R.huella({ accion: 'Registrar conciliación', recurso: 'conciliación ' + F.fecha(R.config.fechaCorte), resultado: 'Registrada con 2 diferencias' }); b.disabled = true; });
      }
    };
  };
})(window.RENTAS = window.RENTAS || {});
