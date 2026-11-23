/* Componentes reutilizables: insignias, PENDIENTE ENERO, términos, avisos, tablas,
   pestañas, diálogo de acción sensible y huella de auditoría. */
(function (R) {
  'use strict';
  var esc = R.esc;

  /* ---------- Insignias ---------- */
  R.cliente = function () { return R.config.vista === 'cliente'; };
  R.insIncr = function (incr) { if (R.cliente()) return ''; return '<span class="insignia insignia--incr" title="Incremento del plan">' + esc(incr) + '</span>'; };
  R.insEstadoModulo = function (estado) {
    if (estado === 'ia') return '<span class="insignia insignia--ia">' + R.icono('chispa') + 'IA</span>';
    if (estado === 'confirmar') return '<span class="insignia insignia--confirmar">' + (R.cliente() ? 'Módulo por confirmar' : 'Por confirmar') + '</span>';
    return R.cliente() ? '' : '<span class="insignia insignia--alcance">En alcance</span>';
  };
  R.ins = function (texto, tipo) { return '<span class="insignia insignia--' + (tipo || 'neutra') + '">' + esc(texto) + '</span>'; };
  R.ficticio = function () { return '<span class="ficticio">' + (R.cliente() ? 'datos de ejemplo' : 'cifras ficticias') + '</span>'; };

  /* ---------- PENDIENTE ENERO (lee data/pendientes.js) ---------- */
  R.pend = function (id, corto) {
    var p = R.pendiente(id);
    if (!p) return '<span class="insignia insignia--error">Pendiente ' + esc(id) + ' no registrado</span>';
    var cerrado = !R.pendienteVivo(p);
    if (R.cliente()) {
      /* En la versión del cliente no se muestran las preguntas: solo un marcador con explicación genérica. */
      var txt = p.estado === 'cerrado' ? 'Confirmado' : p.estado === 'no-activable' ? 'No se aplicará' : 'Por confirmar';
      var tip = p.estado === 'cerrado' ? 'Dato confirmado por la Municipalidad' : p.estado === 'no-activable' ? 'Esta regla no se aplicará' : 'Dato de ejemplo: se ajusta con la información oficial de la Municipalidad';
      return '<span class="pend pend--suave' + (cerrado ? ' pend--cerrado' : '') + '" title="' + tip + '">' + R.icono('info') + txt + '<span class="sr-only">. ' + tip + '</span></span>';
    }
    return '<button type="button" class="pend' + (cerrado ? ' pend--cerrado' : '') + '" data-pendiente="' + esc(id) + '"' +
      ' aria-haspopup="dialog" aria-label="Pendiente de enero ' + esc(id) + ': ' + esc(p.descripcion) + '. Ver detalle">' +
      R.icono('rombo') + (corto ? '' : (cerrado ? R.ESTADOS_PEND[p.estado].t.toUpperCase() : 'PENDIENTE ENERO') + ' · ') + esc(id) + '</button>';
  };
  /* Lista de pendientes de una pantalla, como bloque */
  R.bloquePendientes = function (pid, titulo) {
    var lista = R.pendientesDePantalla(pid);
    if (!lista.length) return '';
    if (R.cliente()) return ''; /* Las preguntas viven en la versión del equipo (cuestionario GEN-08). */
    return '<div class="aviso aviso--pend" role="note">' + R.icono('rombo') + '<div><strong>' + esc(titulo || 'Pendientes de enero en esta pantalla') + '</strong>' +
      '<ul class="lista-simple">' + lista.map(function (p) {
        return '<li>' + R.pend(p.id) + ' ' + esc(p.descripcion) + '</li>';
      }).join('') + '</ul></div></div>';
  };

  var popoverAbierto = null;
  function cerrarPopover() {
    if (popoverAbierto) { popoverAbierto.el.remove(); popoverAbierto.btn.setAttribute('aria-expanded', 'false'); popoverAbierto = null; }
  }
  function abrirPopover(btn) {
    var id = btn.getAttribute('data-pendiente'), p = R.pendiente(id);
    if (!p) return;
    if (popoverAbierto && popoverAbierto.btn === btn) { cerrarPopover(); return; }
    cerrarPopover();
    var est = R.ESTADOS_PEND[p.estado];
    var el = document.createElement('div');
    el.className = 'popover'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Pendiente ' + id);
    if (R.cliente()) {
      el.innerHTML = '<strong>' + (p.estado === 'cerrado' ? 'Confirmado' : p.estado === 'no-activable' ? 'No se aplicará' : 'Por confirmar con la Municipalidad') + '</strong>' +
        '<p style="margin:var(--s-2) 0">' + esc(p.paraCliente) + '</p>' + (p.cierre ? '<p class="pequeno">' + esc(p.cierre) + '</p>' : '') +
        '<p class="micro" style="margin:0">Área: ' + esc(p.responsable) + ' · <a href="#/pendientes">Ver todas las preguntas</a></p>';
    } else
    el.innerHTML = '<strong>' + esc(id) + ' · ' + esc(p.descripcion) + '</strong><dl>' +
      '<dt>Estado</dt><dd><span class="insignia ' + est.c + '">' + est.t + '</span>' + (p.cierre ? ' ' + esc(p.cierre) : '') + '</dd>' +
      '<dt>Pregunta</dt><dd>' + esc(p.pregunta) + '</dd>' +
      '<dt>Fuente</dt><dd>' + esc(p.fuente) + '</dd>' +
      '<dt>Responsable</dt><dd>' + esc(p.responsable) + ' <span class="micro">(sugerido)</span></dd>' +
      '<dt>Pantallas</dt><dd>' + p.pantallas.map(function (x) { return '<a href="' + R.rutaPantalla(x) + '">' + esc(x) + '</a>'; }).join(', ') + '</dd></dl>' +
      '<p class="micro" style="margin:var(--s-2) 0 0">Se edita en data/pendientes.js · <a href="#/pendientes?id=' + esc(id) + '">Ver en el panel</a></p>';
    document.body.appendChild(el);
    var r = btn.getBoundingClientRect();
    var left = Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - el.offsetWidth - 8);
    el.style.left = Math.max(8, left) + 'px';
    el.style.top = (window.scrollY + r.bottom + 6) + 'px';
    btn.setAttribute('aria-expanded', 'true');
    popoverAbierto = { el: el, btn: btn };
  }

  /* ---------- Términos con explicación ---------- */
  R.term = function (clave, texto) {
    if (!R.glosario[clave]) return esc(texto || clave);
    return '<button type="button" class="termino" data-termino="' + esc(clave) + '">' + esc(texto || clave) + '</button>';
  };
  var tooltip = null;
  function mostrarTooltip(btn) {
    ocultarTooltip();
    var t = document.createElement('div');
    t.className = 'tooltip'; t.id = 'tooltip-activo'; t.setAttribute('role', 'tooltip');
    t.textContent = btn.getAttribute('data-tip') || R.glosario[btn.getAttribute('data-termino')];
    document.body.appendChild(t);
    var r = btn.getBoundingClientRect();
    t.style.left = Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + document.documentElement.clientWidth - t.offsetWidth - 8)) + 'px';
    t.style.top = (window.scrollY + r.bottom + 6) + 'px';
    btn.setAttribute('aria-describedby', 'tooltip-activo');
    tooltip = { el: t, btn: btn };
  }
  function ocultarTooltip() {
    if (tooltip) { tooltip.btn.removeAttribute('aria-describedby'); tooltip.el.remove(); tooltip = null; }
  }

  /* ---------- Avisos ---------- */
  var ICONO_AVISO = { info: 'info', exito: 'check', alerta: 'alerta', error: 'error', pend: 'rombo' };
  R.aviso = function (tipo, titulo, texto, rol) {
    return '<div class="aviso aviso--' + tipo + '" role="' + (rol || (tipo === 'error' ? 'alert' : 'status')) + '">' +
      R.icono(ICONO_AVISO[tipo] || 'info') + '<div>' + (titulo ? '<strong>' + esc(titulo) + '</strong>' : '') + (texto || '') + '</div></div>';
  };
  R.avisar = function (tipo, titulo, texto) {
    var cont = document.getElementById('emergentes');
    var w = document.createElement('div');
    w.innerHTML = R.aviso(tipo, titulo, esc(texto || ''));
    var el = w.firstChild;
    var cerrar = document.createElement('button');
    cerrar.type = 'button'; cerrar.className = 'btn btn--terciario btn--chico'; cerrar.setAttribute('aria-label', 'Cerrar aviso');
    cerrar.innerHTML = R.icono('cerrar');
    el.appendChild(cerrar);
    cont.appendChild(el);
    var t, quitar = function () { el.remove(); };
    var programar = function () { t = setTimeout(quitar, 6000); };
    cerrar.addEventListener('click', quitar);
    el.addEventListener('mouseenter', function () { clearTimeout(t); });
    el.addEventListener('mouseleave', programar);
    el.addEventListener('focusin', function () { clearTimeout(t); });
    programar();
  };

  R.estadoVacio = function (icono, titulo, texto, accionHtml) {
    return '<div class="estado-vacio">' + R.icono(icono || 'info') + '<h3>' + esc(titulo) + '</h3>' +
      (texto ? '<p>' + texto + '</p>' : '') + (accionHtml || '') + '</div>';
  };

  /* ---------- Tablas con orden, filtros externos y paginación ---------- */
  R._tablas = {};
  /* cfg: { columnas:[{clave,titulo,orden:true,tipo:'texto'|'num'|'moneda'|'fecha',render(fila)}],
           filas:[], porPagina:10, caption, vacio:{titulo,texto}, totales(filas)->html } */
  R.tabla = function (id, cfg) {
    R._tablas[id] = { cfg: cfg, filas: cfg.filas || [], orden: cfg.ordenInicial || null, dir: 1, pagina: 1 };
    return '<div data-tabla="' + esc(id) + '"></div>';
  };
  R.tablaDatos = function (id, filas) {
    var t = R._tablas[id]; if (!t) return;
    t.filas = filas; t.pagina = 1; R.pintarTabla(id);
  };
  R.pintarTabla = function (id) {
    var t = R._tablas[id], cont = document.querySelector('[data-tabla="' + id + '"]');
    if (!t || !cont) return;
    var cfg = t.cfg, filas = t.filas.slice();
    if (t.orden) {
      var col = cfg.columnas.filter(function (c) { return c.clave === t.orden; })[0];
      filas.sort(function (a, b) {
        var x = a[t.orden], y = b[t.orden];
        if (col && (col.tipo === 'num' || col.tipo === 'moneda')) return (x - y) * t.dir;
        return String(x).localeCompare(String(y), 'es', { numeric: true }) * t.dir;
      });
    }
    var porPag = cfg.porPagina || 10, total = filas.length, paginas = Math.max(1, Math.ceil(total / porPag));
    if (t.pagina > paginas) t.pagina = paginas;
    var desde = (t.pagina - 1) * porPag, vista = filas.slice(desde, desde + porPag);
    if (!total) {
      cont.innerHTML = '<div class="panel panel--plano">' + R.estadoVacio('filtro', (cfg.vacio || {}).titulo || 'No hay resultados',
        (cfg.vacio || {}).texto || 'Prueba con otros filtros.') + '</div>';
      return;
    }
    var h = '<div class="tabla-marco"><table>' + (cfg.caption ? '<caption class="sr-only">' + esc(cfg.caption) + '</caption>' : '') + '<thead><tr>';
    cfg.columnas.forEach(function (c) {
      var alinear = (c.tipo === 'num' || c.tipo === 'moneda') ? ' class="num"' : '';
      if (c.orden) {
        var activo = t.orden === c.clave, sort = activo ? (t.dir > 0 ? 'ascending' : 'descending') : 'none';
        var ic = activo ? (t.dir > 0 ? 'ordenAsc' : 'ordenDesc') : 'orden';
        h += '<th scope="col" aria-sort="' + sort + '"' + alinear + '><button type="button" class="th-orden" data-tabla-id="' + esc(id) + '" data-col="' + esc(c.clave) + '">' +
          esc(c.titulo) + R.icono(ic) + '<span class="sr-only">, ordenar</span></button></th>';
      } else h += '<th scope="col"' + alinear + '>' + esc(c.titulo) + '</th>';
    });
    h += '</tr></thead><tbody>';
    vista.forEach(function (f) {
      h += '<tr>' + cfg.columnas.map(function (c) {
        var v = c.render ? c.render(f) : (c.tipo === 'moneda' ? R.fmt.moneda(f[c.clave]) : c.tipo === 'fecha' ? R.fmt.fecha(f[c.clave]) : esc(f[c.clave]));
        return '<td' + ((c.tipo === 'num' || c.tipo === 'moneda') ? ' class="num"' : '') + '>' + v + '</td>';
      }).join('') + '</tr>';
    });
    h += '</tbody>' + (cfg.totales ? '<tfoot>' + cfg.totales(filas) + '</tfoot>' : '') + '</table></div>';
    h += '<div class="tabla-pie"><span aria-live="polite">' + (desde + 1) + '–' + (desde + vista.length) + ' de ' + total + '</span>' +
      '<div class="paginacion"><button type="button" class="btn btn--chico" data-pag="-1" data-tabla-id="' + esc(id) + '"' + (t.pagina <= 1 ? ' disabled' : '') + '>' + R.icono('flechaIzq') + 'Anterior</button>' +
      '<span>Página ' + t.pagina + ' de ' + paginas + '</span>' +
      '<button type="button" class="btn btn--chico" data-pag="1" data-tabla-id="' + esc(id) + '"' + (t.pagina >= paginas ? ' disabled' : '') + '>Siguiente' + R.icono('flechaDer') + '</button></div></div>';
    cont.innerHTML = h;
  };
  R.montarTablas = function () { Object.keys(R._tablas).forEach(R.pintarTabla); };

  /* ---------- Pestañas ---------- */
  R.pestanas = function (id, lista) {
    var h = '<div class="pestanas"><div role="tablist" aria-label="Secciones">';
    lista.forEach(function (p, i) {
      h += '<button type="button" role="tab" id="tab-' + id + '-' + p.id + '" aria-controls="panel-' + id + '-' + p.id + '" aria-selected="' + (i === 0) + '" tabindex="' + (i === 0 ? 0 : -1) + '">' + esc(p.t) + '</button>';
    });
    h += '</div>';
    lista.forEach(function (p, i) {
      h += '<div role="tabpanel" id="panel-' + id + '-' + p.id + '" aria-labelledby="tab-' + id + '-' + p.id + '" tabindex="0"' + (i === 0 ? '' : ' hidden') + '>' + p.html + '</div>';
    });
    return h + '</div>';
  };
  function activarTab(tab) {
    var lista = tab.closest('[role="tablist"]'), tabs = lista.querySelectorAll('[role="tab"]');
    tabs.forEach(function (x) {
      var sel = x === tab; x.setAttribute('aria-selected', sel); x.tabIndex = sel ? 0 : -1;
      document.getElementById(x.getAttribute('aria-controls')).hidden = !sel;
    });
    tab.focus();
  }

  /* ---------- Huella de auditoría ---------- */
  R.huella = function (h) {
    var perfil = R.perfilActual() || {};
    return '<div class="huella" aria-label="Huella de auditoría"><strong>Huella de auditoría</strong> <span class="micro">(simulada)</span><dl>' +
      '<dt>Actor</dt><dd>' + esc(h.actor || R.usuarioDemo(perfil.id)) + '</dd>' +
      '<dt>Perfil</dt><dd>' + esc(h.perfil || perfil.nombre) + '</dd>' +
      (h.aprobador ? '<dt>Aprobador</dt><dd>' + esc(h.aprobador) + '</dd>' : '') +
      '<dt>Fecha y hora</dt><dd>' + R.fmt.fechaHora(R.config.fechaCorte, R.horaActual()) + ' (America/Lima)</dd>' +
      '<dt>Acción</dt><dd>' + esc(h.accion) + '</dd>' +
      '<dt>Recurso</dt><dd>' + esc(h.recurso) + '</dd>' +
      (h.motivo ? '<dt>Motivo</dt><dd>' + esc(h.motivo) + '</dd>' : '') +
      '<dt>Correlación</dt><dd>' + esc(h.correlacion || R.correlacion()) + '</dd>' +
      '<dt>Resultado</dt><dd>' + esc(h.resultado || 'Registrado') + '</dd></dl>' +
      '<a href="#/seguridad/auditoria">Ver en Auditoría</a></div>';
  };

  /* ---------- Diálogo de acción sensible (dos pasos) ----------
     op: { titulo, accion (texto del botón final), resumen:[[k,v]], recurso,
           aprobador: { perfil:'supervisor' } | null, solicitante: perfilId | null,
           peligro: true, alConfirmar: function(huellaHtml, datos) } */
  R.confirmarSensible = function (op) {
    var dlg = document.getElementById('dialogo');
    var perfil = R.perfilActual();
    var previo = document.activeElement;
    var paso = 1;
    function pintar() {
      var cab = '<div class="dialogo__cab"><span class="pasos-dialogo">Paso ' + paso + ' de 2 · ' + (paso === 1 ? 'Resumen' : 'Confirmación') + '</span>' +
        '<h2 id="dialogo-titulo">' + esc(op.titulo) + '</h2></div>';
      var cuerpo = '', pie = '';
      if (paso === 1) {
        cuerpo = '<p>Revisa qué va a cambiar. Esta acción queda registrada en la auditoría.</p><table class="tabla-resumen"><tbody>' +
          op.resumen.map(function (r) { return '<tr><th scope="row">' + esc(r[0]) + '</th><td>' + r[1] + '</td></tr>'; }).join('') + '</tbody></table>';
        pie = '<button type="button" class="btn btn--terciario" data-dlg="cancelar">Cancelar</button><button type="button" class="btn btn--primario" data-dlg="seguir">Continuar</button>';
      } else {
        var mismo = op.aprobador && op.solicitante && perfil && op.solicitante === perfil.id && op.aprobador.perfil === perfil.id;
        cuerpo = op.sinMotivo ? '<p>' + esc(op.textoConfirmacion || 'Confirma para continuar.') + '</p>' : '<div class="campo" id="campo-motivo"><label for="dlg-motivo">' + esc(op.etiquetaMotivo || 'Motivo') + ' <span class="obligatorio">(obligatorio)</span></label>' +
          '<textarea id="dlg-motivo" aria-describedby="dlg-motivo-ayuda"></textarea><span class="ayuda" id="dlg-motivo-ayuda">Explica por qué. Queda en la huella de auditoría.</span></div>';
        if (op.aprobador) {
          var ap = R.perfilPorId(op.aprobador.perfil);
          var propio = op.aprobador.propio; /* el mismo funcionario firma su acto con autenticación reforzada */
          cuerpo += '<fieldset><legend>' + (propio ? 'Firma con autenticación reforzada' : 'Autorización del aprobador') + '</legend>' +
            '<p class="pequeno texto-2">' + (propio ? esc(op.aprobador.texto || 'Solo el funcionario competente puede emitir este acto. Confirma tu identidad con tu código de verificación.') : 'Aprueba otra persona, en su propia sesión. No se comparten contraseñas (RF-UTC-037, RF-UTC-064).') + '</p>' +
            (mismo && !propio ? R.aviso('error', 'No puedes aprobar una solicitud que tú presentaste', 'Pide a otra persona con perfil ' + esc(ap.nombre) + ' que la revise.') : '') +
            '<div class="form-rejilla"><div class="campo"><label for="dlg-aprobador">' + (propio ? 'Funcionario' : 'Usuario aprobador') + '</label><input id="dlg-aprobador" value="' + esc(R.usuarioDemo(ap.id) + (propio ? '' : '2')) + '" readonly></div>' +
            '<div class="campo" id="campo-mfa"><label for="dlg-mfa">' + (propio ? 'Tu código de verificación' : 'Código MFA del aprobador') + '</label><input id="dlg-mfa" inputmode="numeric" maxlength="6" autocomplete="one-time-code" aria-describedby="dlg-mfa-ayuda">' +
            '<span class="ayuda" id="dlg-mfa-ayuda">Simulado: acepta cualquier código de 6 dígitos.</span></div></div></fieldset>';
        }
        pie = '<button type="button" class="btn btn--terciario" data-dlg="atras">Atrás</button>' +
          '<button type="button" class="btn ' + (op.peligro ? 'btn--peligro' : 'btn--primario') + '" data-dlg="confirmar"' + (mismo ? ' disabled' : '') + '>' + esc(op.accion) + '</button>';
      }
      dlg.innerHTML = cab + '<div class="dialogo__cuerpo">' + cuerpo + '</div><div class="dialogo__pie">' + pie + '</div>';
      dlg.setAttribute('aria-labelledby', 'dialogo-titulo');
      var f = dlg.querySelector('textarea, #dlg-mfa, [data-dlg="seguir"], [data-dlg="confirmar"]'); if (f) f.focus();
    }
    function cerrar() { dlg.close(); if (previo && previo.focus) previo.focus(); }
    function error(campoId, texto) {
      var c = document.getElementById(campoId);
      c.classList.add('campo--error');
      var e = c.querySelector('.error'); if (e) e.remove();
      var s = document.createElement('span'); s.className = 'error'; s.id = campoId + '-err';
      s.innerHTML = R.icono('error') + esc(texto); c.appendChild(s);
      var inp = c.querySelector('input, textarea'); inp.setAttribute('aria-invalid', 'true');
      inp.setAttribute('aria-describedby', (inp.getAttribute('aria-describedby') || '') + ' ' + s.id);
      return inp;
    }
    dlg.onclick = function (ev) {
      var b = ev.target.closest('[data-dlg]'); if (!b) return;
      var a = b.getAttribute('data-dlg');
      if (a === 'cancelar') cerrar();
      else if (a === 'seguir') { paso = 2; pintar(); }
      else if (a === 'atras') { paso = 1; pintar(); }
      else if (a === 'confirmar') {
        var motivo = op.sinMotivo ? '' : document.getElementById('dlg-motivo').value.trim(), primero = null;
        if (!op.sinMotivo && motivo.length < 5) primero = error('campo-motivo', 'Escribe el motivo (al menos 5 caracteres).');
        if (op.aprobador && !/^\d{6}$/.test(document.getElementById('dlg-mfa').value)) primero = primero || error('campo-mfa', 'Escribe los 6 dígitos del código.');
        if (primero) { primero.focus(); return; }
        b.disabled = true; b.textContent = 'Procesando…';
        var datos = { motivo: motivo, aprobador: op.aprobador ? document.getElementById('dlg-aprobador').value : null };
        var huella = R.huella({ accion: op.titulo, recurso: op.recurso, motivo: motivo, aprobador: datos.aprobador, resultado: 'Registrado (simulado)' });
        setTimeout(function () { cerrar(); if (op.alConfirmar) op.alConfirmar(huella, datos); }, 400);
      }
    };
    dlg.oncancel = function (ev) { if (paso === 2 && op.aprobador) { ev.preventDefault(); } else { ev.preventDefault(); cerrar(); } };
    pintar();
    dlg.showModal();
  };

  /* ---------- Eventos delegados ---------- */
  document.addEventListener('click', function (ev) {
    var pb = ev.target.closest('.pend'); if (pb) { ev.preventDefault(); ocultarTooltip(); abrirPopover(pb); return; }
    if (popoverAbierto && !ev.target.closest('.popover')) cerrarPopover();
    var tb = ev.target.closest('.termino'); if (tb) { tooltip && tooltip.btn === tb ? ocultarTooltip() : mostrarTooltip(tb); return; }
    var th = ev.target.closest('.th-orden');
    if (th) {
      var t = R._tablas[th.getAttribute('data-tabla-id')], col = th.getAttribute('data-col');
      if (t.orden === col) t.dir = -t.dir; else { t.orden = col; t.dir = 1; }
      R.pintarTabla(th.getAttribute('data-tabla-id'));
      var nuevo = document.querySelector('.th-orden[data-tabla-id="' + th.getAttribute('data-tabla-id') + '"][data-col="' + col + '"]'); if (nuevo) nuevo.focus();
      return;
    }
    var pg = ev.target.closest('[data-pag]');
    if (pg) { var tt = R._tablas[pg.getAttribute('data-tabla-id')]; tt.pagina += Number(pg.getAttribute('data-pag')); R.pintarTabla(pg.getAttribute('data-tabla-id')); return; }
    var tab = ev.target.closest('[role="tab"]'); if (tab) activarTab(tab);
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      if (popoverAbierto) { var b = popoverAbierto.btn; cerrarPopover(); b.focus(); }
      ocultarTooltip();
    }
    var tab = ev.target.closest && ev.target.closest('[role="tab"]');
    if (tab && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].indexOf(ev.key) >= 0) {
      var tabs = Array.prototype.slice.call(tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]'));
      var i = tabs.indexOf(tab);
      var n = ev.key === 'Home' ? 0 : ev.key === 'End' ? tabs.length - 1 : (i + (ev.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      ev.preventDefault(); activarTab(tabs[n]);
    }
  });
  document.addEventListener('mouseover', function (ev) { var t = ev.target.closest && ev.target.closest('.termino, .pend--suave'); if (t && (!tooltip || tooltip.btn !== t)) mostrarTooltip(t); });
  document.addEventListener('mouseout', function (ev) { var t = ev.target.closest && ev.target.closest('.termino, .pend--suave'); if (t && tooltip && tooltip.btn === t && document.activeElement !== t) ocultarTooltip(); });
  document.addEventListener('focusin', function (ev) { var t = ev.target.closest && ev.target.closest('.termino'); if (t) mostrarTooltip(t); else ocultarTooltip(); });
})(window.RENTAS = window.RENTAS || {});
