/* Utilidades: escape, formato (moneda, fechas), almacenamiento, permisos y consultas a data/. */
(function (R) {
  'use strict';

  R.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* ---------- Formato ---------- */
  R.fmt = {
    /* Montos en CÉNTIMOS enteros (sin coma flotante). 123450 → "S/ 1,234.50" */
    moneda: function (centimos) {
      var n = Math.round(Number(centimos) || 0), neg = n < 0; n = Math.abs(n);
      var ent = String(Math.floor(n / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      var dec = String(n % 100).padStart(2, '0');
      return (neg ? '-' : '') + 'S/ ' + ent + '.' + dec;
    },
    /* 'aaaa-mm-dd' → 'dd/mm/aaaa' (sin zona horaria) */
    fecha: function (iso) {
      if (!iso) return '—';
      var p = String(iso).slice(0, 10).split('-');
      return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : String(iso);
    },
    fechaHora: function (iso, hhmm) { return R.fmt.fecha(iso) + ' ' + (hhmm || '00:00'); },
    entero: function (n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  };

  /* ---------- Almacenamiento (solo comodidades; puede fallar) ---------- */
  R.leer = function (k, def) {
    try { var v = window.localStorage.getItem('rentas-proto:' + k); return v == null ? def : JSON.parse(v); }
    catch (e) { return def; }
  };
  R.guardar = function (k, v) {
    try { window.localStorage.setItem('rentas-proto:' + k, JSON.stringify(v)); } catch (e) { /* sin almacenamiento */ }
  };

  /* ---------- Consultas ---------- */
  /* Sesión de demostración (solo versión cliente): guarda usuario y perfil de ejemplo en sessionStorage,
     se borra al cerrar la pestaña. Nunca guarda contraseñas ni tokens. */
  R.sesion = function () {
    try { return JSON.parse(window.sessionStorage.getItem('rentas-proto:sesion') || 'null'); } catch (e) { return null; }
  };
  R.fijarSesion = function (s) {
    try { if (s) window.sessionStorage.setItem('rentas-proto:sesion', JSON.stringify(s)); else window.sessionStorage.removeItem('rentas-proto:sesion'); } catch (e) { /* sin almacenamiento */ }
  };
  R.perfilActual = function () {
    var enCliente = R.config && R.config.vista === 'cliente';
    var id = R._perfil || (enCliente ? (R.sesion() || {}).perfil : R.leer('perfil', null));
    return R.perfiles.filter(function (p) { return p.id === id; })[0] || null;
  };
  R.perfilPorId = function (id) { return R.perfiles.filter(function (p) { return p.id === id; })[0]; };
  R.modulo = function (id) { return R.modulos.filter(function (m) { return m.id === id; })[0]; };
  R.seccion = function (id) { return R.secciones.filter(function (s) { return s.id === id; })[0]; };

  R.pantalla = function (id) {
    for (var i = 0; i < R.modulos.length; i++) {
      var m = R.modulos[i];
      for (var j = 0; j < m.pantallas.length; j++) if (m.pantallas[j].id === id) return { modulo: m, pantalla: m.pantallas[j] };
    }
    var g = R.pantallasGlobales.filter(function (x) { return x.id === id; })[0];
    return g ? { modulo: null, pantalla: g } : null;
  };
  R.rutaPantalla = function (id) {
    var r = R.pantalla(id);
    if (!r) return '#/inicio';
    if (!r.modulo) return '#/' + r.pantalla.ruta;
    return '#/' + r.modulo.id + '/' + r.pantalla.slug;
  };

  /* Acceso de demostración: 'total' | 'lectura' | 'ninguno' */
  R.acceso = function (modulo, perfilId) {
    if (!modulo) return 'total';
    perfilId = perfilId || (R.perfilActual() || {}).id;
    if (modulo.total.indexOf(perfilId) >= 0) return 'total';
    if (modulo.lectura.indexOf(perfilId) >= 0) return 'lectura';
    return 'ninguno';
  };
  R.motivoSinPermiso = function (modulo) {
    var ids = modulo.total.length ? modulo.total : modulo.lectura;
    var nombres = ids.map(function (id) { return R.perfilPorId(id).nombre; });
    if (!nombres.length) return 'Sin perfil habilitado en el prototipo';
    if (nombres.length > 2) return 'Requiere perfil ' + nombres.slice(0, 2).join(', ') + ' u otro autorizado';
    return 'Requiere perfil ' + nombres.join(' o ');
  };

  /* ---------- Pendientes ---------- */
  R.ESTADOS_PEND = {
    'abierto': { t: 'Abierto', c: 'insignia--alerta' },
    'en-consulta': { t: 'En consulta', c: 'insignia--info' },
    'cerrado': { t: 'Cerrado', c: 'insignia--exito' },
    'no-activable': { t: 'No activable', c: 'insignia--neutra' }
  };
  R.pendienteVivo = function (p) { return p.estado === 'abierto' || p.estado === 'en-consulta'; };
  R.pendiente = function (id) { return R.pendientes.filter(function (p) { return p.id === id; })[0]; };
  R.pendientesDePantalla = function (pid) {
    return R.pendientes.filter(function (p) { return p.pantallas.indexOf(pid) >= 0; });
  };
  R.pendientesDeModulo = function (m) {
    var ids = m.pantallas.map(function (x) { return x.id; });
    return R.pendientes.filter(function (p) {
      return p.modulo === m.id || p.pantallas.some(function (x) { return ids.indexOf(x) >= 0; });
    });
  };
  R.contarVivos = function (lista) { return lista.filter(R.pendienteVivo).length; };

  /* ---------- Varios ---------- */
  R.normalizar = function (s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  };
  R.correlacion = function () {
    var h = ''; for (var i = 0; i < 12; i++) h += Math.floor(Math.random() * 16).toString(16);
    return 'corr-' + h;
  };
  R.horaActual = function () {
    var d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  };
  R.usuarioDemo = function (perfilId) { return 'usr.demo.' + perfilId; };
})(window.RENTAS = window.RENTAS || {});
