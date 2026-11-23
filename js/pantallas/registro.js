/* Administración Tributaria: Contribuyentes (CON), Predios (PRE) y Declaraciones juradas (DJ). */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;

  function enlaceFicha(c) { return '<a href="#/contribuyentes/ficha/' + c.codigo + '">' + esc(c.nombre) + '</a>'; }

  /* ======================= CON-01 Buscar contribuyente ======================= */
  R.vistas['CON-01'] = function (ctx) {
    var q = ctx.q.buscar || '';
    return {
      subtitulo: 'Busca siempre antes de registrar, para no crear a la misma persona dos veces.',
      acciones: '<a class="btn" href="#/contribuyentes/registrar" id="btn-ir-registrar" hidden>' + R.icono('persona') + 'Registrar contribuyente</a>',
      contenido:
        '<section class="panel"><form class="filtros" id="form-busca" role="search">' +
        R.campo({ id: 'b-tipo', label: 'Buscar por', opciones: [['todo', 'Documento, nombre o código'], ['doc', 'Número de documento'], ['nombre', 'Nombre o razón social'], ['codigo', 'Código de contribuyente']] }) +
        '<div class="campo" style="flex:1"><label for="b-texto">Texto a buscar</label><input id="b-texto" type="search" value="' + esc(q) + '" placeholder="Ejemplo: 99000101, Ana Prueba o CTB-000101" aria-describedby="b-ayuda"><span class="ayuda" id="b-ayuda">Prueba con «Ana Prueba» para ver cómo el sistema avisa de un homónimo.</span></div>' +
        '<button type="submit" class="btn btn--primario">' + R.icono('buscar') + 'Buscar</button></form></section>' +
        '<div id="res-busca"><div class="panel">' + R.estadoVacio('buscar', 'Escribe un documento, nombre o código', 'Los resultados aparecerán aquí.') + '</div></div>',
      despues: function () {
        function buscar() {
          var t = R.normalizar($('#b-texto').value.trim()), tipo = $('#b-tipo').value;
          if (!t) { $('#res-busca').innerHTML = R.aviso('alerta', 'Escribe qué buscar', 'Ingresa al menos un documento, nombre o código.'); return; }
          var res = D.contribuyentes.filter(function (c) {
            var campos = { doc: c.num, nombre: c.nombre, codigo: c.codigo }, txt = tipo === 'todo' ? [c.num, c.nombre, c.codigo].join(' ') : campos[tipo];
            return R.normalizar(txt).indexOf(t) >= 0;
          });
          var nombres = {}; res.forEach(function (c) { var k = R.normalizar(c.nombre); nombres[k] = (nombres[k] || 0) + 1; });
          var homonimo = Object.keys(nombres).some(function (k) { return nombres[k] > 1; });
          var h = '';
          if (homonimo) h += R.aviso('info', 'Hay personas con el mismo nombre', 'Son personas distintas: revisa el documento antes de elegir. Un nombre repetido no impide registrar ' + R.pend('PE-015') + '.');
          h += '<section class="panel" style="margin-top:var(--s-4)"><h2>' + res.length + ' resultado' + (res.length === 1 ? '' : 's') + '</h2>' + R.tabla('t-busca', {
            caption: 'Resultados de la búsqueda', porPagina: 8, filas: res,
            vacio: { titulo: 'No encontramos a nadie con ese dato', texto: 'Revisa el documento o busca por nombre. Si no existe, regístralo.' },
            columnas: [
              { clave: 'codigo', titulo: 'Código', orden: true, render: function (c) { return '<span class="mono">' + c.codigo + '</span>'; } },
              { clave: 'nombre', titulo: 'Nombre o razón social', orden: true, render: function (c) { return enlaceFicha(c) + (c.nota ? '<div class="micro">' + esc(c.nota) + '</div>' : ''); } },
              { clave: 'num', titulo: 'Documento', orden: true, render: function (c) { return esc(c.doc) + ' ' + esc(c.num); } },
              { clave: 'tipo', titulo: 'Persona', orden: true },
              { clave: 'domicilio', titulo: 'Domicilio fiscal' },
              { clave: 'x', titulo: 'Ir a', render: function (c) { return '<a href="#/cuenta/estado/' + c.codigo + '">Estado de cuenta</a>'; } }]
          }) + '<p class="pequeno" style="margin:var(--s-3) 0 0">¿No está en la lista? <a href="#/contribuyentes/registrar">Registrar contribuyente</a></p></section>';
          $('#res-busca').innerHTML = h; R.pintarTabla('t-busca');
          $('#btn-ir-registrar').hidden = false;
        }
        $('#form-busca').addEventListener('submit', function (e) { e.preventDefault(); buscar(); });
        if (q) buscar();
      }
    };
  };

  /* ======================= CON-02 Registrar contribuyente ======================= */
  R.vistas['CON-02'] = function (ctx) {
    return {
      subtitulo: 'Los datos con «(obligatorio)» son necesarios para guardar.',
      acciones: R.btn(ctx, 'Registrar contribuyente', { tipo: 'primario', id: 'btn-registrar', icono: 'check' }) +
        '<a class="btn btn--terciario" href="#/contribuyentes/buscar">Cancelar</a>',
      contenido:
        '<div id="res-registro"></div><div id="resumen-errores"></div>' +
        '<form id="form-reg" novalidate style="display:grid;gap:var(--s-5)">' +
        '<fieldset><legend>Identidad</legend><div class="form-rejilla">' +
        R.campo({ id: 'r-tipo', label: 'Tipo de persona', opciones: ['Natural', 'Jurídica'], obligatorio: true }) +
        R.campo({ id: 'r-doc', label: 'Tipo de documento', opciones: ['DNI', 'RUC', 'Carné de extranjería', 'Pasaporte', 'Sin documento (excepcional)'], obligatorio: true, pend: 'PE-010' }) +
        R.campo({ id: 'r-num', label: 'Número de documento', obligatorio: true, ayuda: 'DNI: 8 dígitos. RUC: 11 dígitos. Datos de ejemplo: 99000150 a 99000199.', extra: ' inputmode="numeric" autocomplete="off"' }) +
        R.campo({ id: 'r-nombres', label: 'Nombres', obligatorio: true }) +
        R.campo({ id: 'r-paterno', label: 'Apellido paterno', obligatorio: true }) +
        R.campo({ id: 'r-materno', label: 'Apellido materno' }) +
        '</div><p class="micro" style="margin-top:var(--s-3)">Si hay convenio, el documento se valida en línea con RENIEC o SUNAT; si no, se verifica con el documento físico ' + R.pend('PE-014') + ' · Un nombre repetido solo genera un aviso ' + R.pend('PE-015') + '</p><div id="aviso-identidad" style="margin-top:var(--s-4)"></div></fieldset>' +
        '<fieldset><legend>Domicilio fiscal</legend><div class="form-rejilla">' +
        R.campo({ id: 'r-ubigeo', label: 'Departamento / provincia / distrito', valor: 'Amazonas / Utcubamba / Bagua Grande', readonly: true }) +
        R.campo({ id: 'r-sector', label: 'Sector', opciones: ['Sector Centro', 'Sector Norte', 'Sector Sur', 'Sector Ejemplo Alto'], pend: 'PE-011' }) +
        R.campo({ id: 'r-libre', label: 'Dirección como la indica el contribuyente', valor: 'jr los ejemplos 145 frente al mercado', ancho: true, ayuda: 'El sistema propone la dirección ordenada; tú la confirmas.' }) +
        '</div><div class="panel panel--ia" style="margin-top:var(--s-4)" id="ia-direccion"><h3>' + R.icono('chispa') + ' Sugerencia: una persona decide</h3>' +
        '<p class="pequeno">Dirección propuesta a partir del texto escrito, comparada con el catálogo de vías:</p>' +
        R.dl([['Tipo de vía', 'Jirón'], ['Nombre de vía', 'Los Ejemplos'], ['Número', '145'], ['Referencia', 'Frente al mercado'], ['Coincidencia con el catálogo', R.ins('Alta', 'exito')]]) +
        '<p style="margin:var(--s-3) 0 0"><button type="button" class="btn btn--chico" id="ia-dir-ok">Usar esta dirección</button> <button type="button" class="btn btn--chico btn--terciario" id="ia-dir-no">Corregir a mano</button></p></div></fieldset>' +
        '<fieldset><legend>Contacto</legend><div class="form-rejilla">' +
        R.campo({ id: 'r-cel', label: 'Celular', tipo: 'tel', ayuda: 'Opcional. Para avisos informativos; no reemplaza la notificación oficial.' }) +
        R.campo({ id: 'r-correo', label: 'Correo electrónico', tipo: 'email' }) +
        '</div></fieldset></form>',
      despues: function () {
        function revisarIdentidad() {
          var nom = R.normalizar([$('#r-nombres').value, $('#r-paterno').value, $('#r-materno').value].join(' ').trim());
          var cont = $('#aviso-identidad'); if (!nom) { cont.innerHTML = ''; return; }
          var iguales = D.contribuyentes.filter(function (c) { return R.normalizar(c.nombre) === nom; });
          var parecidos = D.contribuyentes.filter(function (c) {
            var n = R.normalizar(c.nombre); return n !== nom && n.split(' ').filter(function (w) { return nom.indexOf(w.slice(0, 4)) >= 0; }).length >= 2;
          });
          var h = '';
          if (iguales.length) h += R.aviso('info', 'Ya hay ' + iguales.length + ' persona' + (iguales.length > 1 ? 's' : '') + ' con este nombre', 'Puede ser un homónimo. Compara el documento: ' + iguales.map(function (c) { return enlaceFicha(c) + ' (' + esc(c.doc + ' ' + c.num) + ')'; }).join(', ') + '. Puedes continuar si es otra persona.');
          if (parecidos.length) h += '<div class="panel panel--ia" style="margin-top:var(--s-3)"><h3>' + R.icono('chispa') + ' Posibles duplicados · una persona decide</h3><ul class="lista-simple">' +
            parecidos.map(function (c) { return '<li class="pequeno">' + enlaceFicha(c) + ' — ' + esc(c.doc + ' ' + c.num) + ', ' + esc(c.domicilio) + '</li>'; }).join('') + '</ul>' +
            '<p class="micro" style="margin:var(--s-2) 0 0">Nombre parecido y mismo domicilio. Si es la misma persona, usa el registro existente o pide unirlos.</p></div>';
          cont.innerHTML = h;
        }
        ['r-nombres', 'r-paterno', 'r-materno'].forEach(function (id) { $('#' + id).addEventListener('blur', revisarIdentidad); });
        $('#r-num').addEventListener('blur', function () {
          R.limpiarError('r-num'); var v = $('#r-num').value.trim();
          var ex = D.contribuyentes.filter(function (c) { return c.num === v; })[0];
          if (ex) R.marcarError('r-num', 'Este documento ya pertenece a ' + ex.nombre + ' (' + ex.codigo + '). Usa ese registro.');
        });
        $('#ia-dir-ok').addEventListener('click', function () { $('#r-libre').value = 'Jr. Los Ejemplos 145 (frente al mercado)'; R.avisar('exito', 'Dirección confirmada', 'Se guardará ordenada; el texto original queda registrado.'); });
        $('#ia-dir-no').addEventListener('click', function () { $('#r-libre').focus(); });
        var btn = $('#btn-registrar');
        if (btn && !btn.disabled) btn.addEventListener('click', function () {
          var errores = [];
          ['r-num', 'r-nombres', 'r-paterno'].forEach(R.limpiarError);
          var doc = $('#r-doc').value, num = $('#r-num').value.trim();
          if (doc === 'DNI' && !/^\d{8}$/.test(num)) errores.push(['r-num', 'Escribe los 8 dígitos del DNI.']);
          else if (doc === 'RUC' && !/^\d{11}$/.test(num)) errores.push(['r-num', 'Escribe los 11 dígitos del RUC.']);
          else if (doc.indexOf('Sin documento') < 0 && !num) errores.push(['r-num', 'Escribe el número de documento.']);
          else if (D.contribuyentes.some(function (c) { return c.num === num; })) errores.push(['r-num', 'Este documento ya está registrado.']);
          if (!$('#r-nombres').value.trim()) errores.push(['r-nombres', 'Escribe los nombres.']);
          if (!$('#r-paterno').value.trim()) errores.push(['r-paterno', 'Escribe el apellido paterno.']);
          if (errores.length) {
            errores.forEach(function (e) { R.marcarError(e[0], e[1]); });
            $('#resumen-errores').innerHTML = R.aviso('error', 'Revisa ' + errores.length + ' dato' + (errores.length > 1 ? 's' : ''), '<ul class="lista-simple">' + errores.map(function (e) { return '<li><a href="#" data-foco="' + e[0] + '">' + esc(e[1]) + '</a></li>'; }).join('') + '</ul>');
            $('#resumen-errores').querySelectorAll('[data-foco]').forEach(function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); $('#' + a.dataset.foco).focus(); }); });
            $('#resumen-errores [data-foco]').focus();
            return;
          }
          var nombre = [$('#r-nombres').value, $('#r-paterno').value, $('#r-materno').value].join(' ').replace(/\s+/g, ' ').trim();
          var codigo = 'CTB-' + String(150 + D.contribuyentes.length).padStart(6, '0');
          D.contribuyentes.push({ codigo: codigo, tipo: $('#r-tipo').value, doc: doc, num: num || '—', nombre: nombre, domicilio: $('#r-libre').value, distrito: 'Bagua Grande', alta: R.config.fechaCorte, estado: 'Activo', historial: [[R.config.fechaCorte, 'Alta en el padrón', 'Registro en ventanilla']] });
          $('#resumen-errores').innerHTML = '';
          $('#form-reg').hidden = true; btn.hidden = true;
          $('#res-registro').innerHTML = R.aviso('exito', 'Contribuyente registrado', esc(nombre) + ' · código <strong>' + codigo + '</strong>. <a href="#/contribuyentes/ficha/' + codigo + '">Ver ficha</a> · <a href="#/predios/lista/' + codigo + '">Registrar sus predios</a>') +
            '<div style="margin-top:var(--s-3)">' + R.huella({ accion: 'Registrar contribuyente', recurso: 'contribuyente ' + codigo, resultado: 'Registrado' }) + '</div>';
          $('#res-registro').scrollIntoView(); R.avisar('exito', 'Registrado', 'Código ' + codigo);
        });
      }
    };
  };

  /* ======================= CON-03 Ficha del contribuyente ======================= */
  R.vistas['CON-03'] = function (ctx) {
    var c = R.ctxContribuyente(ctx);
    if (!c) return { contenido: R.estadoVacio('buscar', 'No encontramos ese contribuyente', '<a href="#/contribuyentes/buscar">Buscar otro</a>') };
    var predios = D.prediosDe(c.codigo), djs = D.djs.filter(function (d) { return d.contribuyente === c.codigo; });
    var obl = D.obligacionesDe(c.codigo), total = obl.reduce(function (a, o) { return a + D.saldo(o).total; }, 0);
    var porTributo = {};
    obl.forEach(function (o) { var s = D.saldo(o); if (s.total) porTributo[o.tributo] = (porTributo[o.tributo] || 0) + s.total; });
    var pagos = c.codigo === 'CTB-000101' ? D.pagos : [], exps = c.codigo === 'CTB-000101' ? D.expedientes : [];
    var kpi = function (e, v, x) { return '<div class="kpi"><div class="kpi__etiqueta">' + e + '</div><div class="kpi__valor">' + v + '</div><div class="kpi__contexto">' + x + '</div></div>'; };
    var tabs = [
      { id: 'res', t: 'Resumen', html: R.dl([['Tipo de persona', esc(c.tipo)], ['Documento', esc(c.doc + ' ' + c.num)], ['Código', '<span class="mono">' + c.codigo + '</span> ' + R.pend('PE-012')],
        ['Domicilio fiscal', esc(c.domicilio + ', ' + c.distrito)], ['Celular', esc(c.celular || '—')], ['Correo', esc(c.correo || '—')], ['En el padrón desde', F.fecha(c.alta)], ['Estado', R.ins(c.estado, 'exito')]]) +
        (c.nota ? '<div style="margin-top:var(--s-4)">' + R.aviso('info', 'Nota', esc(c.nota)) + '</div>' : '') },
      { id: 'bie', t: 'Bienes (' + predios.length + ')', html: predios.length ? '<ul class="lista-simple">' + predios.map(function (p) {
        return '<li><a href="#/predios/ficha/' + p.codigo + '">' + esc(p.direccion) + '</a> · ' + esc(p.uso) + ' · ' + (p.titular === c.codigo ? p.participacion : 50) + ' % de participación</li>'; }).join('') + '</ul>'
        : '<p class="texto-2">No tiene predios registrados. <a href="#/predios/lista/' + c.codigo + '">Registrar predio</a></p>' },
      { id: 'dj', t: 'Declaraciones (' + djs.length + ')', html: djs.length ? '<ul class="lista-simple">' + djs.map(function (d) { return '<li>' + esc(d.numero) + ' · ' + d.anio + ' · ' + esc(d.motivo) + ' · ' + esc(d.estado) + '</li>'; }).join('') + '</ul><p><a href="#/declaraciones/lista/' + c.codigo + '">Ver declaraciones</a></p>' : '<p class="texto-2">Sin declaraciones.</p>' },
      { id: 'deu', t: 'Deuda', html: Object.keys(porTributo).length ? '<table><thead><tr><th scope="col">Tributo</th><th scope="col" class="num">Saldo al ' + F.fecha(R.config.fechaCorte) + '</th></tr></thead><tbody>' +
        Object.keys(porTributo).map(function (k) { return '<tr><td>' + esc(k) + '</td><td class="num">' + F.moneda(porTributo[k]) + '</td></tr>'; }).join('') + '</tbody><tfoot><tr><td>Total</td><td class="num">' + F.moneda(total) + '</td></tr></tfoot></table>' +
        '<p style="margin-top:var(--s-3)"><a class="btn btn--chico" href="#/cuenta/estado/' + c.codigo + '">Ver estado de cuenta</a> ' + R.ficticio() + '</p>' : '<p class="texto-2">No tiene deuda pendiente.</p>' },
      { id: 'pag', t: 'Pagos', html: pagos.length ? '<table><thead><tr><th scope="col">Recibo</th><th scope="col">Fecha</th><th scope="col">Concepto</th><th scope="col" class="num">Monto</th><th scope="col">Estado</th></tr></thead><tbody>' +
        pagos.map(function (p) { return '<tr><td class="mono">' + p.recibo + '</td><td>' + F.fecha(p.fecha) + '</td><td>' + esc(p.concepto) + (p.nota ? '<div class="micro">' + esc(p.nota) + '</div>' : '') + '</td><td class="num">' + F.moneda(p.monto) + '</td><td>' + R.ins(p.estado, p.estado === 'Válido' ? 'exito' : 'neutra') + '</td></tr>'; }).join('') + '</tbody></table>' : '<p class="texto-2">Sin pagos registrados.</p>' },
      { id: 'exp', t: 'Expedientes', html: exps.length ? '<ul class="lista-simple">' + exps.map(function (e) { return '<li>' + esc(e.numero) + ' · ' + esc(e.tipo) + ': ' + esc(e.asunto) + ' · ' + R.ins(e.estado, 'alerta') + ' · plazo ' + F.fecha(e.plazo) + '</li>'; }).join('') + '</ul>' : '<p class="texto-2">Sin expedientes.</p>' },
      { id: 'rep', t: 'Representantes y cónyuge', html: '<p>' + esc(c.representante || c.conyuge || 'No tiene representantes registrados.') + '</p><p class="micro">Cada representación guarda su documento de poder y vigencia.</p>' },
      { id: 'his', t: 'Historial', html: (c.historial && c.historial.length) ? '<ul class="lista-simple">' + c.historial.map(function (h) { return '<li>' + F.fecha(h[0]) + ' · <strong>' + esc(h[1]) + '</strong> · ' + esc(h[2]) + '</li>'; }).join('') + '</ul><p class="micro">Los cambios no borran los datos anteriores.</p>' : '<p class="texto-2">Sin cambios registrados.</p>' }
    ];
    return {
      titulo: 'Ficha de ' + c.nombre,
      acciones: '<a class="btn btn--primario" href="#/cuenta/estado/' + c.codigo + '">' + R.icono('libro') + 'Ver estado de cuenta</a>' +
        R.btn(ctx, 'Nueva declaración', { href: '#/declaraciones/asistente', icono: 'documento' }) + R.btn(ctx, 'Editar datos', { id: 'btn-editar' }) +
        '<button type="button" class="btn btn--terciario" onclick="window.print()">Imprimir ficha</button>',
      contenido: R.cabeceraContribuyente(c) +
        '<div class="kpis">' + kpi('Deuda total', F.moneda(total), 'Al ' + F.fecha(R.config.fechaCorte) + ' · ' + R.ficticio()) + kpi('Predios', predios.length, 'Registrados a su nombre') +
        kpi('Declaraciones', djs.length, 'Todas las versiones se conservan') + kpi('Expedientes', exps.length, 'Abiertos') + '</div>' +
        '<section class="panel">' + R.pestanas('ficha', tabs) + '</section>',
      despues: function () { var b = $('#btn-editar'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Edición de datos', 'Cada cambio guarda el dato anterior en el historial.'); }); }
    };
  };

  /* ======================= CON-04 Fusionar duplicados ======================= */
  R.vistas['CON-04'] = function (ctx) {
    var a = D.contribuyente('CTB-000101'), b = D.contribuyente('CTB-000140');
    function tarjeta(c, sel) {
      return '<button type="button" class="panel perfil-op" data-principal="' + c.codigo + '" aria-pressed="' + sel + '"><h3>' + esc(c.nombre) + '</h3>' +
        R.dl([['Código', '<span class="mono">' + c.codigo + '</span>'], ['Documento', esc(c.doc + ' ' + c.num)], ['Domicilio', esc(c.domicilio)], ['En el padrón desde', F.fecha(c.alta)]]) +
        '<p class="micro" style="margin:var(--s-3) 0 0">' + (sel ? 'Registro que se conserva como principal' : 'Pulsa para elegirlo como principal') + '</p></button>';
    }
    return {
      subtitulo: 'Une dos registros de la misma persona. Nada se borra: el registro absorbido queda enlazado al principal.',
      acciones: R.btn(ctx, 'Solicitar unión de registros', { tipo: 'primario', id: 'btn-fusion' }) + '<a class="btn btn--terciario" href="#/ia-padron/duplicados">Ver otros posibles duplicados</a>',
      contenido: '<div id="res-fusion"></div>' +
        '<section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Por qué parecen la misma persona</h2><ul class="lista-simple">' +
        '<li>Nombre casi igual: «Prueba» y «Prueva» (una letra distinta).</li><li>Mismo domicilio: Jr. Los Ejemplos 145.</li><li>El registro antiguo no tiene documento de identidad.</li><li>Ambos aparecen en declaraciones del mismo predio.</li></ul>' +
        '<p class="micro" style="margin:var(--s-2) 0 0">Coincidencia alta. Es una sugerencia: una persona autorizada decide.</p></section>' +
        '<section class="panel"><h2>Elige el registro principal</h2><div class="par-dup" id="par-dup">' + tarjeta(a, true) + tarjeta(b, false) + '</div></section>' +
        '<section class="panel"><h2>Sustento</h2><div class="form-rejilla">' +
        R.campo({ id: 'f-exp', label: 'Número de expediente', obligatorio: true, valor: 'EXP-2027-000388', pend: 'PE-013' }) +
        R.campo({ id: 'f-doc', label: 'Documento de sustento', opciones: ['Copia de DNI y declaración del contribuyente', 'Informe de verificación', 'Otro'] }) + '</div>' +
        '<p class="pequeno texto-2" style="margin-top:var(--s-3)">Qué pasará: las deudas, pagos y declaraciones del registro absorbido pasan a verse en el principal. Los recibos emitidos no se modifican.</p></section>',
      despues: function () {
        var principal = 'CTB-000101';
        $('#par-dup').addEventListener('click', function (e) {
          var t = e.target.closest('[data-principal]'); if (!t) return;
          principal = t.dataset.principal;
          $('#par-dup').querySelectorAll('[data-principal]').forEach(function (x) { var s = x.dataset.principal === principal; x.setAttribute('aria-pressed', s); x.querySelector('.micro').textContent = s ? 'Registro que se conserva como principal' : 'Pulsa para elegirlo como principal'; });
        });
        var btn = $('#btn-fusion'); if (!btn || btn.disabled) return;
        btn.addEventListener('click', function () {
          var otro = principal === 'CTB-000101' ? 'CTB-000140' : 'CTB-000101';
          R.confirmarSensible({ titulo: 'Unir registros duplicados', accion: 'Unir registros', recurso: 'contribuyentes ' + otro + ' → ' + principal,
            resumen: [['Registro principal', principal], ['Registro que se enlaza', otro], ['Expediente', esc($('#f-exp').value)], ['Qué no cambia', 'Recibos, pagos y documentos emitidos']],
            aprobador: { perfil: 'supervisor' }, solicitante: 'operador',
            alConfirmar: function (huella) {
              $('#res-fusion').innerHTML = R.aviso('exito', 'Registros unidos', otro + ' quedó enlazado a ' + principal + '. El historial de ambos se conserva.') +
                '<section class="panel" style="margin-top:var(--s-3)"><h2>Mapa de identidades</h2><table><thead><tr><th scope="col">Registro anterior</th><th scope="col">Ahora se consulta en</th><th scope="col">Desde</th></tr></thead><tbody><tr><td class="mono">' + otro + '</td><td class="mono">' + principal + '</td><td>' + F.fecha(R.config.fechaCorte) + '</td></tr></tbody></table></section>' + huella;
              btn.disabled = true; $('#res-fusion').scrollIntoView();
            } });
        });
      }
    };
  };

  /* ======================= PRE-01 Predios del contribuyente ======================= */
  R.vistas['PRE-01'] = function (ctx) {
    var c = R.ctxContribuyente(ctx), predios = D.prediosDe(c.codigo);
    var base = predios.reduce(function (s, p) { return s + (p.titular === c.codigo ? p.autoavaluo * p.participacion / 100 : p.autoavaluo * 0.5); }, 0);
    return {
      acciones: R.btn(ctx, 'Registrar predio', { tipo: 'primario', id: 'btn-nuevo-predio', icono: 'casa' }) + '<a class="btn" href="#/contribuyentes/ficha/' + c.codigo + '">Ver ficha</a>',
      contenido: R.cabeceraContribuyente(c) +
        '<section class="panel"><h2>Predios declarados</h2>' + R.tabla('t-predios', { caption: 'Predios', filas: predios.map(function (p) {
          return Object.assign({}, p, { part: p.titular === c.codigo ? p.participacion : 50 }); }),
          vacio: { titulo: 'Sin predios', texto: 'Registra el primer predio de esta persona.' },
          columnas: [
            { clave: 'direccion', titulo: 'Dirección', orden: true, render: function (p) { return '<a href="#/predios/ficha/' + p.codigo + '">' + esc(p.direccion) + '</a><div class="micro">' + esc(p.sector) + '</div>'; } },
            { clave: 'tipo', titulo: 'Tipo', orden: true }, { clave: 'uso', titulo: 'Uso', orden: true },
            { clave: 'condicion', titulo: 'Condición', orden: true },
            { clave: 'part', titulo: 'Participación', tipo: 'num', orden: true, render: function (p) { return p.part + ' %'; } },
            { clave: 'areaTerreno', titulo: 'Terreno', tipo: 'num', orden: true, render: function (p) { return R.m2(p.areaTerreno); } },
            { clave: 'areaConstruida', titulo: 'Construido', tipo: 'num', orden: true, render: function (p) { return R.m2(p.areaConstruida); } },
            { clave: 'autoavaluo', titulo: 'Autoavalúo', tipo: 'moneda', orden: true }],
          totales: function () { return '<tr><td colspan="7">Base imponible del contribuyente (según participación)</td><td class="num">' + F.moneda(base) + '</td></tr>'; }
        }) + '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Los valores dependen de los aranceles del ejercicio ' + R.pend('PE-040') + '</p></section>',
      despues: function () { var b = $('#btn-nuevo-predio'); if (b && !b.disabled) b.addEventListener('click', function () { location.hash = '#/predios/ficha/nuevo'; }); }
    };
  };

  /* ======================= PRE-02 Ficha del predio ======================= */
  R.vistas['PRE-02'] = function (ctx) {
    var nuevo = ctx.param === 'nuevo';
    var p = D.predio(ctx.param) || D.predio('PRD-000201');
    if (nuevo) {
      return {
        titulo: 'Registrar predio',
        acciones: R.btn(ctx, 'Guardar predio', { tipo: 'primario', id: 'btn-guardar-predio' }) + '<a class="btn btn--terciario" href="#/predios/lista">Cancelar</a>',
        contenido: '<div id="res-predio"></div><form style="display:grid;gap:var(--s-5)" onsubmit="return false">' +
          '<fieldset><legend>Ubicación</legend><div class="form-rejilla">' +
          R.campo({ id: 'p-tipo', label: 'Tipo de predio', opciones: ['Urbano', 'Rústico'], obligatorio: true }) +
          R.campo({ id: 'p-sector', label: 'Sector', opciones: ['Sector Centro', 'Sector Norte', 'Sector Sur'], pend: 'PE-011' }) +
          R.campo({ id: 'p-via', label: 'Vía', opciones: ['Jr. Los Ejemplos', 'Av. Demostración', 'Calle Prueba', 'Pje. Muestra'], obligatorio: true }) +
          R.campo({ id: 'p-num', label: 'Número municipal', valor: '' }) + '</div></fieldset>' +
          '<fieldset><legend>Características</legend><div class="form-rejilla">' +
          R.campo({ id: 'p-clase', label: 'Clase de predio', opciones: ['Casa independiente', 'Departamento en edificio', 'Local comercial', 'Terreno sin construir'], pend: 'PE-020' }) +
          R.campo({ id: 'p-uso', label: 'Uso', opciones: ['Vivienda', 'Comercio', 'Industria', 'Otros'] }) +
          R.campo({ id: 'p-cond', label: 'Condición de propiedad', opciones: ['Propietario único', 'Sociedad conyugal', 'Condominio', 'Sucesión indivisa', 'Poseedor'] }) +
          R.campo({ id: 'p-area', label: 'Área de terreno (m²)', tipo: 'number', obligatorio: true }) + '</div></fieldset></form>',
        despues: function () {
          var b = $('#btn-guardar-predio'); if (!b || b.disabled) return;
          b.addEventListener('click', function () {
            R.limpiarError('p-area');
            if (!(Number($('#p-area').value) > 0)) { R.marcarError('p-area', 'Escribe el área del terreno en m².').focus(); return; }
            $('#res-predio').innerHTML = R.aviso('exito', 'Predio registrado', 'Código PRD-000250. Ahora registra sus pisos y titulares. <a href="#/predios/ficha/PRD-000201">Ver una ficha completa de ejemplo</a>');
          });
        }
      };
    }
    var tit = D.titularidad[p.codigo] || [];
    var tabs = [
      { id: 'ubi', t: 'Ubicación', html: R.dl([['Dirección', esc(p.direccion)], ['Sector', esc(p.sector) + ' ' + R.pend('PE-011')], ['Distrito', 'Bagua Grande'], ['Tipo', esc(p.tipo)], ['Ubicación respecto a parques', esc(p.parque) + ' ' + R.pend('PE-022')]]) },
      { id: 'ter', t: 'Terreno y construcción', html: R.dl([['Clase de predio', esc(p.clase) + ' ' + R.pend('PE-020')], ['Uso', esc(p.uso)], ['Estado', esc(p.estadoPredio)], ['Condición de propiedad', esc(p.condicion)],
        ['Área de terreno', R.m2(p.areaTerreno)], ['Área común', R.m2(p.areaComun)], ['Área construida', R.m2(p.areaConstruida)], ['Frente', p.frente + ' m'], ['Fecha de adquisición', F.fecha(p.adquisicion)],
        ['Cocheras o depósitos asociados', 'Ninguno ' + R.pend('PE-024')]]) +
        '<p class="micro" style="margin-top:var(--s-3)">Para predios rústicos se registran además clasificación, nivel y categoría del terreno ' + R.pend('PE-021') + '</p>' },
      { id: 'pis', t: 'Pisos (' + p.pisos.length + ')', html: '<div class="tabla-marco"><table><caption class="sr-only">Pisos</caption><thead><tr><th scope="col">Nivel</th><th scope="col">Clasificación</th><th scope="col">Material</th><th scope="col">Conservación</th><th scope="col">Categorías</th><th scope="col" class="num">Año</th><th scope="col" class="num">Área</th><th scope="col" class="num">Valor</th></tr></thead><tbody>' +
        p.pisos.map(function (x) { return '<tr><td>' + x.nivel + '</td><td>' + esc(x.clasif) + '</td><td>' + esc(x.material) + '</td><td>' + esc(x.estado) + '</td><td class="mono micro" title="Muros · techos · pisos · puertas y ventanas · revestimientos · baños · instalaciones eléctricas">' + esc(x.cat) + '</td><td class="num">' + x.anio + '</td><td class="num">' + R.m2(x.area) + '</td><td class="num">' + F.moneda(x.valor) + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">Categorías en orden: muros, techos, pisos, puertas y ventanas, revestimientos, baños e instalaciones eléctricas. ' + R.ficticio() + ' ' + R.pend('PE-040') + '</p>' },
      { id: 'ins', t: 'Otras instalaciones (' + p.instalaciones.length + ')', html: (p.instalaciones.length ? '<table><thead><tr><th scope="col">Instalación</th><th scope="col">Medida</th><th scope="col" class="num">Año</th><th scope="col" class="num">Valor</th></tr></thead><tbody>' +
        p.instalaciones.map(function (x) { return '<tr><td>' + esc(x.tipo) + '</td><td>' + esc(x.medida) + '</td><td class="num">' + x.anio + '</td><td class="num">' + F.moneda(x.valor) + '</td></tr>'; }).join('') + '</tbody></table>' : '<p class="texto-2">No tiene otras instalaciones.</p>') +
        '<p class="micro" style="margin-top:var(--s-2)">Cercos, tanques, piscinas y similares ' + R.pend('PE-025') + '</p>' },
      { id: 'tit', t: 'Titulares (' + tit.length + ')', html: '<ul class="lista-simple">' + tit.map(function (t) { return '<li>' + esc(t.nombre) + ' · ' + t.participacion + ' % · ' + esc(t.condicion) + '</li>'; }).join('') + '</ul><p><a href="#/predios/titularidad/' + p.codigo + '">Ver o cambiar titularidad</a></p>' },
      { id: 'ver', t: 'Versiones (' + p.version + ')', html: '<ul class="lista-simple">' + (p.version >= 3 ? '<li>Versión 3 · 18/06/2026 · ampliación del 2.º piso (actual)</li>' : '') + '<li>Versión 2 · 10/02/2020 · actualización de categorías' + (p.version === 2 ? ' (actual)' : '') + '</li><li>Versión 1 · alta del predio</li></ul><p class="micro">Cada cambio físico crea una versión nueva; las anteriores se conservan para los años ya declarados.</p>' }
    ];
    return {
      titulo: p.direccion,
      subtitulo: 'Predio ' + esc(p.tipo.toLowerCase()) + ' · ' + esc(p.uso) + ' · autoavalúo ' + F.moneda(p.autoavaluo) + ' ' + R.ficticio(),
      acciones: R.btn(ctx, 'Registrar cambio físico', { tipo: 'primario', id: 'btn-version' }) + '<a class="btn" href="#/predios/titularidad/' + p.codigo + '">Titularidad</a>' +
        R.btn(ctx, 'Declarar', { href: '#/declaraciones/asistente' }),
      contenido: '<section class="panel">' + R.pestanas('predio', tabs) + '</section>',
      despues: function () { var b = $('#btn-version'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Nueva versión física', 'Se crea la versión ' + (p.version + 1) + '; la actual queda en el historial.'); }); }
    };
  };

  /* ======================= PRE-03 Titularidad y copropiedad ======================= */
  R.vistas['PRE-03'] = function (ctx) {
    var p = D.predio(ctx.param) || D.predio('PRD-000202');
    var lista = D.titularidad[p.codigo] = D.titularidad[p.codigo] || [];
    function pintar() {
      var suma = lista.reduce(function (s, t) { return s + t.participacion; }, 0);
      $('#tit-tabla').innerHTML = '<div class="tabla-marco"><table><caption class="sr-only">Titulares</caption><thead><tr><th scope="col">Titular</th><th scope="col">Condición</th><th scope="col" class="num">Participación</th><th scope="col">Desde</th><th scope="col">Documento</th></tr></thead><tbody>' +
        lista.map(function (t) { return '<tr><td><a href="#/contribuyentes/ficha/' + t.codigo + '">' + esc(t.nombre) + '</a></td><td>' + esc(t.condicion) + '</td><td class="num">' + t.participacion + ' %</td><td>' + F.fecha(t.desde) + '</td><td>' + esc(t.documento) + '</td></tr>'; }).join('') +
        '</tbody><tfoot><tr><td colspan="2">Total</td><td class="num">' + suma + ' %</td><td colspan="2"></td></tr></tfoot></table></div>' +
        '<div class="barra-total' + (suma > 100 ? ' barra-total--error' : '') + '" role="img" aria-label="Participación asignada: ' + suma + ' %" style="margin-top:var(--s-3)"><span style="width:' + Math.min(100, suma) + '%"></span></div>' +
        '<p class="pequeno texto-2" style="margin-top:var(--s-2)">' + (suma === 100 ? 'La participación suma 100 %.' : 'Falta asignar ' + (100 - suma) + ' %.') + '</p>';
    }
    return {
      titulo: 'Titularidad · ' + p.direccion,
      acciones: R.btn(ctx, 'Agregar titular', { tipo: 'primario', id: 'btn-add-tit' }) + '<a class="btn" href="#/predios/ficha/' + p.codigo + '">Ver predio</a>',
      contenido: '<section class="panel"><h2>Titulares vigentes</h2><div id="tit-tabla"></div></section>' +
        R.aviso('info', 'Deuda de un predio con varios dueños', 'Cada copropietario declara su parte. La deuda no se duplica: el sistema controla que la suma no pase del 100 %. ' + R.pend('PE-023')) +
        '<section class="panel"><h2>Agregar titular</h2><div id="res-tit"></div><form class="form-rejilla" id="form-tit" onsubmit="return false">' +
        R.campo({ id: 't-quien', label: 'Contribuyente', opciones: D.contribuyentes.filter(function (c) { return !lista.some(function (t) { return t.codigo === c.codigo; }); }).map(function (c) { return [c.codigo, c.nombre + ' (' + c.codigo + ')']; }) }) +
        R.campo({ id: 't-cond', label: 'Condición', opciones: ['Condominio', 'Sociedad conyugal', 'Sucesión indivisa'] }) +
        R.campo({ id: 't-part', label: 'Participación (%)', tipo: 'number', obligatorio: true, ayuda: 'Prueba con 30 para ver cómo el sistema avisa que se pasa del 100 %.' }) +
        R.campo({ id: 't-desde', label: 'Vigente desde', tipo: 'date', valor: R.config.fechaCorte }) + '</form></section>',
      despues: function () {
        pintar();
        var b = $('#btn-add-tit'); if (!b || b.disabled) return;
        b.addEventListener('click', function () {
          R.limpiarError('t-part');
          var v = Number($('#t-part').value), suma = lista.reduce(function (s, t) { return s + t.participacion; }, 0);
          if (!(v > 0)) { R.marcarError('t-part', 'Escribe el porcentaje de participación.').focus(); return; }
          if (suma + v > 100) { R.marcarError('t-part', 'Con ' + v + ' % la participación sumaría ' + (suma + v) + ' %. Primero ajusta la de otro titular.').focus(); return; }
          var c = D.contribuyente($('#t-quien').value);
          lista.push({ codigo: c.codigo, nombre: c.nombre, condicion: $('#t-cond').value, participacion: v, desde: $('#t-desde').value, hasta: '', documento: 'Por adjuntar' });
          pintar(); $('#res-tit').innerHTML = R.aviso('exito', 'Titular agregado', esc(c.nombre) + ' con ' + v + ' %.');
        });
      }
    };
  };

  /* ======================= DJ-01 Declaraciones juradas ======================= */
  R.vistas['DJ-01'] = function (ctx) {
    var c = R.ctxContribuyente(ctx), djs = D.djs.filter(function (d) { return d.contribuyente === c.codigo; });
    var tipoEst = { 'Presentada': 'exito', 'Rectificada': 'info', 'Borrador': 'alerta' };
    return {
      acciones: R.btn(ctx, 'Nueva declaración', { tipo: 'primario', href: '#/declaraciones/asistente', icono: 'documento' }) + '<a class="btn" href="#/declaraciones/versiones">Comparar versiones</a>',
      contenido: R.cabeceraContribuyente(c) + '<section class="panel"><h2>Declaraciones</h2>' + R.tabla('t-dj', { caption: 'Declaraciones juradas', filas: djs, ordenInicial: 'fecha',
        vacio: { titulo: 'Sin declaraciones', texto: 'Presenta la primera declaración de esta persona.' },
        columnas: [
          { clave: 'numero', titulo: 'Número', orden: true, render: function (d) { return '<span class="mono">' + d.numero + '</span>'; } },
          { clave: 'anio', titulo: 'Ejercicio', orden: true }, { clave: 'motivo', titulo: 'Motivo', orden: true },
          { clave: 'fecha', titulo: 'Fecha', tipo: 'fecha', orden: true },
          { clave: 'version', titulo: 'Versión', tipo: 'num', orden: true },
          { clave: 'predios', titulo: 'Predios', tipo: 'num' },
          { clave: 'base', titulo: 'Base declarada', tipo: 'moneda', orden: true, render: function (d) { return d.base ? F.moneda(d.base) : '—'; } },
          { clave: 'estado', titulo: 'Estado', orden: true, render: function (d) { return R.ins(d.estado, tipoEst[d.estado]) + (d.estado === 'Rectificada' ? ' <a href="#/declaraciones/versiones" class="micro">ver cambios</a>' : d.estado === 'Borrador' ? ' <a href="#/declaraciones/asistente" class="micro">continuar</a>' : ''); } }]
      }) + '<p class="micro" style="margin-top:var(--s-2)">Una declaración presentada no se borra ni se sobrescribe: para corregirla se rectifica y se crea una versión nueva.</p></section>'
    };
  };

  /* ======================= DJ-02 Asistente de declaración jurada ======================= */
  R.vistas['DJ-02'] = function (ctx) {
    var c = R.ctxContribuyente(ctx), predios = D.prediosDe(c.codigo);
    var PASOS = ['Contribuyente', 'Predios', 'Características', 'Resumen', 'Presentación'];
    var st = { paso: 0, motivo: 'Actualización anual', sel: predios.map(function (p) { return p.codigo; }), area1: 120, ok: false };
    function contenidoPaso() {
      if (st.paso === 0) return '<h2>¿Quién declara?</h2>' + R.cabeceraContribuyente(c) + '<div class="form-rejilla" style="margin-top:var(--s-4)">' +
        R.campo({ id: 'dj-anio', label: 'Ejercicio', opciones: [2027, 2026], valor: 2027 }) +
        R.campo({ id: 'dj-motivo', label: 'Motivo de la declaración', opciones: ['Actualización anual', 'Alta de predio', 'Baja de predio', 'Modificación'], valor: st.motivo, pend: 'PE-031' }) + '</div>';
      if (st.paso === 1) return '<h2>¿Qué predios declara?</h2><fieldset><legend class="sr-only">Predios</legend>' + predios.map(function (p) {
        return '<label style="display:flex;gap:var(--s-3);align-items:flex-start;padding:var(--s-3) 0;border-bottom:1px solid var(--c-borde)"><input type="checkbox" data-predio="' + p.codigo + '"' + (st.sel.indexOf(p.codigo) >= 0 ? ' checked' : '') + ' style="width:1.25rem;height:1.25rem;margin-top:.2rem">' +
          '<span><strong>' + esc(p.direccion) + '</strong><br><span class="pequeno texto-2">' + esc(p.uso) + ' · ' + R.m2(p.areaTerreno) + ' de terreno · ' + (p.titular === c.codigo ? p.participacion : 50) + ' % de participación</span></span></label>';
      }).join('') + '</fieldset><p style="margin-top:var(--s-3)"><a href="#/predios/ficha/nuevo">Agregar un predio que no aparece</a></p>';
      if (st.paso === 2) {
        var aviso = st.area1 > 160 ? R.aviso('alerta', 'Revisa el área construida', 'El área del 1.er piso (' + st.area1 + ' m²) supera el área del terreno (160 m²). Puedes continuar si es correcto; quedará marcado para revisión.') : '';
        return '<h2>Características de Jr. Los Ejemplos 145</h2><div class="form-rejilla">' +
          R.campo({ id: 'dj-area1', label: 'Área construida del 1.er piso (m²)', tipo: 'number', valor: st.area1, ayuda: 'Prueba con 200 para ver la validación automática.' }) +
          R.campo({ id: 'dj-area2', label: 'Área construida del 2.º piso (m²)', tipo: 'number', valor: 90 }) +
          R.campo({ id: 'dj-cons', label: 'Estado de conservación', opciones: ['Muy bueno', 'Bueno', 'Regular', 'Malo'], valor: 'Bueno' }) +
          R.campo({ id: 'dj-anio1', label: 'Año de construcción del 1.er piso', tipo: 'number', valor: 2012 }) + '</div>' +
          '<div class="panel panel--ia" style="margin-top:var(--s-4)"><h3>' + R.icono('chispa') + ' Revisión automática de coherencia ' + R.pend('PE-032') + '</h3><div id="dj-ia">' + (aviso || '<p class="pequeno" style="margin:0">' + R.icono('check') + ' Los datos son coherentes con el área del terreno y los pisos.</p>') + '</div>' +
          '<p class="micro" style="margin:var(--s-2) 0 0">Las reglas solo avisan o piden revisión; no cambian lo declarado.</p></div>';
      }
      if (st.paso === 3) {
        var sel = predios.filter(function (p) { return st.sel.indexOf(p.codigo) >= 0; });
        var base = sel.reduce(function (s, p) { return s + (p.valorParte || p.autoavaluo); }, 0);
        return '<h2>Resumen de lo declarado</h2><table><thead><tr><th scope="col">Predio</th><th scope="col" class="num">Terreno</th><th scope="col" class="num">Edificación</th><th scope="col" class="num">Instalaciones</th><th scope="col" class="num">Autoavalúo</th><th scope="col" class="num">Su parte</th></tr></thead><tbody>' +
          sel.map(function (p) { return '<tr><td>' + esc(p.direccion) + '</td><td class="num">' + F.moneda(p.valTerreno) + '</td><td class="num">' + F.moneda(p.valEdif) + '</td><td class="num">' + F.moneda(p.valInst) + '</td><td class="num">' + F.moneda(p.autoavaluo) + '</td><td class="num">' + F.moneda(p.valorParte || p.autoavaluo) + '</td></tr>'; }).join('') +
          '</tbody><tfoot><tr><td colspan="5">Base imponible declarada</td><td class="num">' + F.moneda(base) + '</td></tr></tfoot></table>' +
          '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Valores calculados con los aranceles y tablas del ejercicio ' + R.pend('PE-040') + ' · El impuesto se calcula después, en Determinación.</p>';
      }
      return '<h2>Presentar la declaración</h2><p>Formato de la declaración: Hoja Resumen y una hoja por predio ' + R.pend('PE-030') + '</p>' +
        '<label style="display:flex;gap:var(--s-3);align-items:flex-start"><input type="checkbox" id="dj-acepto" style="width:1.25rem;height:1.25rem;margin-top:.2rem"' + (st.ok ? ' checked' : '') + '><span>El contribuyente declara que los datos son verdaderos y firmó la declaración.</span></label><div id="dj-err"></div>';
    }
    function pintar() {
      $('#dj-pasos').innerHTML = R.pasos(PASOS, st.paso);
      $('#dj-cuerpo').innerHTML = contenidoPaso();
      $('#dj-atras').disabled = st.paso === 0;
      $('#dj-sig').textContent = st.paso === PASOS.length - 1 ? 'Presentar declaración' : 'Siguiente';
      var h = $('#dj-cuerpo h2'); if (h) { h.tabIndex = -1; h.focus(); }
      var a1 = $('#dj-area1'); if (a1) a1.addEventListener('input', function () { st.area1 = Number(a1.value) || 0; $('#dj-ia').innerHTML = st.area1 > 160 ? R.aviso('alerta', 'Revisa el área construida', 'El área del 1.er piso (' + st.area1 + ' m²) supera el área del terreno (160 m²). Puedes continuar si es correcto; quedará marcado para revisión.') : '<p class="pequeno" style="margin:0">' + R.icono('check') + ' Los datos son coherentes con el área del terreno y los pisos.</p>'; });
    }
    function guardarCampos() {
      if ($('#dj-motivo')) st.motivo = $('#dj-motivo').value;
      document.querySelectorAll('[data-predio]').forEach(function (x) { var i = st.sel.indexOf(x.dataset.predio); if (x.checked && i < 0) st.sel.push(x.dataset.predio); if (!x.checked && i >= 0) st.sel.splice(i, 1); });
      if ($('#dj-acepto')) st.ok = $('#dj-acepto').checked;
    }
    var lectura = ctx.acceso === 'lectura';
    return {
      subtitulo: 'Puedes guardar como borrador en cualquier paso.',
      acciones: '<button type="button" class="btn" id="dj-atras">' + R.icono('flechaIzq') + 'Atrás</button>' +
        R.btn(ctx, 'Guardar borrador', { id: 'dj-borrador' }) +
        '<button type="button" class="btn btn--primario" id="dj-sig"' + (lectura ? ' disabled' : '') + '>Siguiente</button>',
      contenido: '<div id="dj-res"></div><section class="panel"><div id="dj-pasos"></div><div id="dj-cuerpo" style="margin-top:var(--s-5)"></div></section>' + R.bloquePendientes('DJ-02', 'Datos que confirmaremos para este trámite'),
      despues: function () {
        pintar();
        $('#dj-atras').addEventListener('click', function () { guardarCampos(); if (st.paso > 0) { st.paso--; pintar(); } });
        var bb = $('#dj-borrador'); if (bb && !bb.disabled) bb.addEventListener('click', function () { guardarCampos(); R.avisar('exito', 'Borrador guardado', 'DJ-2027-000402 · paso ' + (st.paso + 1) + ' de 5'); });
        $('#dj-sig').addEventListener('click', function () {
          guardarCampos();
          if (st.paso === 1 && !st.sel.length) { R.avisar('alerta', 'Elige al menos un predio', 'La declaración debe incluir un predio.'); return; }
          if (st.paso < PASOS.length - 1) { st.paso++; pintar(); return; }
          if (!st.ok) { $('#dj-err').innerHTML = '<p class="error" style="color:var(--c-error);margin-top:var(--s-2)">' + R.icono('error') + ' Marca la casilla de conformidad para presentar.</p>'; $('#dj-acepto').focus(); return; }
          $('#dj-res').innerHTML = R.aviso('exito', 'Declaración presentada', 'Número <strong>DJ-2027-000403</strong> · ' + st.sel.length + ' predio' + (st.sel.length > 1 ? 's' : '') + '. Ya puedes <a href="#/determinacion/predial">calcular el impuesto</a> o <a href="#/determinacion/documentos">descargar la constancia</a>.') +
            '<div style="margin-top:var(--s-3)">' + R.huella({ accion: 'Presentar declaración jurada', recurso: 'DJ-2027-000403', resultado: 'Presentada' }) + '</div>';
          document.querySelector('#dj-pasos').closest('.panel').hidden = true;
          ['dj-atras', 'dj-sig', 'dj-borrador'].forEach(function (id) { var x = $('#' + id); if (x) x.disabled = true; });
          $('#dj-res').scrollIntoView();
        });
      }
    };
  };

  /* ======================= DJ-03 Versiones y rectificación ======================= */
  R.vistas['DJ-03'] = function (ctx) {
    return {
      titulo: 'Versiones de la DJ-2026-000977',
      acciones: R.btn(ctx, 'Rectificar declaración', { tipo: 'primario', href: '#/declaraciones/asistente' }) +
        '<button type="button" class="btn" disabled aria-disabled="true" title="Requiere aprobación de un supervisor">Cambiar número de declaración</button> ' + R.pend('PE-033'),
      contenido: '<section class="panel"><h2>Qué cambió entre la versión 1 y la versión 2</h2><div class="tabla-marco"><table><caption class="sr-only">Comparación</caption><thead><tr><th scope="col">Dato</th><th scope="col">Versión 1 (21/02/2026)</th><th scope="col">Versión 2 (18/06/2026)</th></tr></thead><tbody>' +
        D.versionesDj.map(function (v) { return '<tr><td>' + esc(v[0]) + '</td><td class="diff-antes">' + esc(v[1]) + '</td><td class="diff-despues">' + esc(v[2]) + '</td></tr>'; }).join('') +
        '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + '</p></section>' +
        R.aviso('info', 'La versión 1 se conserva', 'La rectificación no borra lo presentado. Si cambia el impuesto, se emite un ajuste enlazado a la determinación anterior; no se recalcula en silencio lo ya emitido.') +
        '<section class="panel"><h2>Historial de versiones</h2><ul class="lista-simple"><li><strong>Versión 2</strong> · 18/06/2026 · Modificación (ampliación 2.º piso) · ' + R.ins('Vigente', 'exito') + '</li><li><strong>Versión 1</strong> · 21/02/2026 · Actualización anual · ' + R.ins('Reemplazada', 'neutra') + '</li></ul></section>'
    };
  };
})(window.RENTAS = window.RENTAS || {});
