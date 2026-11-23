/* Ayudas compartidas por las pantallas de negocio. */
(function (R) {
  'use strict';
  var esc = R.esc;
  R.vistas = R.vistas || {};

  /* Botón de acción: deshabilitado si el perfil solo consulta. tipo: primario|secundario|terciario|peligro */
  R.btn = function (ctx, texto, o) {
    o = o || {};
    var cls = 'btn' + (o.tipo && o.tipo !== 'secundario' ? ' btn--' + o.tipo : '') + (o.chico ? ' btn--chico' : '');
    var bloqueado = o.escribe !== false && ctx && ctx.acceso === 'lectura';
    var ic = o.icono ? R.icono(o.icono) : '';
    if (o.href && !bloqueado) return '<a class="' + cls + '" href="' + o.href + '"' + (o.id ? ' id="' + o.id + '"' : '') + '>' + ic + esc(texto) + '</a>';
    return '<button type="button" class="' + cls + '"' + (o.id ? ' id="' + o.id + '"' : '') +
      (bloqueado ? ' disabled aria-disabled="true" title="Tu perfil solo puede consultar"' : '') + '>' + ic + esc(texto) + '</button>';
  };

  /* Campo de formulario. o: {id, label, valor, tipo, opciones[], ayuda, obligatorio, readonly, extra} */
  R.campo = function (o) {
    var ayudaId = o.ayuda ? o.id + '-ayuda' : '';
    var attrs = ' id="' + o.id + '"' + (ayudaId ? ' aria-describedby="' + ayudaId + '"' : '') + (o.readonly ? ' readonly' : '') + (o.obligatorio ? ' required aria-required="true"' : '');
    var control;
    if (o.opciones) control = '<select' + attrs + '>' + o.opciones.map(function (x) { var v = Array.isArray(x) ? x : [x, x]; return '<option value="' + esc(v[0]) + '"' + (String(v[0]) === String(o.valor) ? ' selected' : '') + '>' + esc(v[1]) + '</option>'; }).join('') + '</select>';
    else if (o.tipo === 'textarea') control = '<textarea' + attrs + '>' + esc(o.valor || '') + '</textarea>';
    else control = '<input type="' + (o.tipo || 'text') + '"' + attrs + ' value="' + esc(o.valor == null ? '' : o.valor) + '"' + (o.extra || '') + '>';
    return '<div class="campo" id="campo-' + o.id + '"' + (o.ancho ? ' style="grid-column:1/-1"' : '') + '><label for="' + o.id + '">' + esc(o.label) +
      (o.obligatorio ? ' <span class="obligatorio">(obligatorio)</span>' : '') + (o.pend ? ' ' + R.pend(o.pend) : '') + '</label>' + control +
      (o.ayuda ? '<span class="ayuda" id="' + ayudaId + '">' + o.ayuda + '</span>' : '') + '</div>';
  };
  R.marcarError = function (id, texto) {
    var c = document.getElementById('campo-' + id); if (!c) return null;
    c.classList.add('campo--error');
    var e = c.querySelector('.error'); if (e) e.remove();
    var s = document.createElement('span'); s.className = 'error'; s.id = id + '-err'; s.innerHTML = R.icono('error') + esc(texto);
    c.appendChild(s);
    var inp = document.getElementById(id); inp.setAttribute('aria-invalid', 'true');
    inp.setAttribute('aria-describedby', ((inp.getAttribute('aria-describedby') || '') + ' ' + s.id).trim());
    return inp;
  };
  R.limpiarError = function (id) {
    var c = document.getElementById('campo-' + id); if (!c) return;
    c.classList.remove('campo--error'); var e = c.querySelector('.error'); if (e) e.remove();
    var inp = document.getElementById(id); inp.removeAttribute('aria-invalid');
    inp.setAttribute('aria-describedby', (inp.getAttribute('aria-describedby') || '').replace(id + '-err', '').trim());
  };

  /* Contribuyente de la pantalla (parámetro o el de demostración) */
  R.ctxContribuyente = function (ctx) {
    return R.datos.contribuyente(ctx.param && ctx.param.indexOf('CTB-') === 0 ? ctx.param : R.config.contribuyenteDemo);
  };

  /* Franja con la identidad del contribuyente */
  R.cabeceraContribuyente = function (c, extra) {
    return '<section class="panel panel--plano cab-contrib" aria-label="Contribuyente">' +
      '<div class="cab-contrib__id"><span class="card__icono">' + R.icono(c.tipo === 'Jurídica' ? 'tienda' : 'persona', 'icono-lg') + '</span>' +
      '<div><h2 style="font-size:var(--t-h3)">' + esc(c.nombre) + '</h2><div class="pequeno texto-2">' + esc(c.doc) + ' ' + esc(c.num) + ' · Código ' + esc(c.codigo) + ' · Persona ' + esc(c.tipo.toLowerCase()) + '</div>' +
      '<div class="pequeno texto-2">' + esc(c.domicilio) + ', ' + esc(c.distrito) + '</div></div></div>' +
      '<div class="cab-contrib__acc">' + (extra || '') + '</div></section>';
  };

  R.insSituacion = function (s) {
    return ({ ordinaria: R.ins('Ordinaria', 'neutra'), valor: R.ins('Con valor emitido', 'info'), reclamada: R.ins('Reclamada · suspendida', 'alerta'),
      coactiva: R.ins('En coactivo', 'error'), fraccionada: R.ins('Fraccionada', 'info') })[s] || R.ins(s, 'neutra');
  };
  R.insEstadoDeuda = function (e) {
    return ({ pendiente: R.ins('Pendiente', 'alerta'), parcial: R.ins('Pago parcial', 'info'), pagado: R.ins('Pagado', 'exito') })[e];
  };

  /* Indicador de pasos */
  R.pasos = function (lista, actual) {
    return '<ol class="pasos" aria-label="Pasos">' + lista.map(function (t, i) {
      var est = i < actual ? 'hecho' : i === actual ? 'actual' : '';
      return '<li class="pasos__item ' + est + '"' + (i === actual ? ' aria-current="step"' : '') + '><span class="pasos__n">' + (i < actual ? '✓' : i + 1) + '</span>' + esc(t) + '</li>';
    }).join('') + '</ol><p class="sr-only">Paso ' + (actual + 1) + ' de ' + lista.length + '</p>';
  };

  R.dl = function (pares) {
    return '<dl class="datos">' + pares.map(function (p) { return '<div><dt>' + esc(p[0]) + '</dt><dd>' + p[1] + '</dd></div>'; }).join('') + '</dl>';
  };
  R.m2 = function (n) { return R.fmt.entero(n) + ' m²'; };
})(window.RENTAS = window.RENTAS || {});
