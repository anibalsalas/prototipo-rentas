/* Gestión y Control: Gerencia (GER), Reportes (REP), Maestros (MAE) y Seguridad (SEG). */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt, D = R.datos;
  function fila(cols) { return '<tr>' + cols.map(function (c) { return '<td' + (c && c.num ? ' class="num"' : '') + '>' + (c && c.h !== undefined ? c.h : c) + '</td>'; }).join('') + '</tr>'; }
  function n(h) { return { h: h, num: true }; }
  var MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
  function mes(ym) { var p = ym.split('-'); return MESES[Number(p[1]) - 1] + ' ' + p[0].slice(2); }
  function miles(c) { return 'S/ ' + F.entero(Math.round(c / 100000)) + ' mil'; }

  /* Gráfico de barras de UNA serie (color primario). Tooltip nativo y foco por barra; tabla equivalente. */
  R.grafBarras = function (id, datos, o) {
    o = o || {};
    var W = 640, H = 260, pad = { l: 78, r: 8, t: 14, b: 38 }, max = Math.max.apply(null, datos.map(function (d) { return d[1]; }));
    var paso = Math.pow(10, Math.floor(Math.log10(max))), tope = Math.ceil(max / paso) * paso;
    var ancho = (W - pad.l - pad.r) / datos.length, bw = Math.min(28, ancho * 0.55);
    var y = function (v) { return pad.t + (H - pad.t - pad.b) * (1 - v / tope); };
    var grid = [0, 0.5, 1].map(function (f) { var v = tope * f; return '<line x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" class="graf__grid"/><text x="' + (pad.l - 8) + '" y="' + (y(v) + 4) + '" text-anchor="end" class="graf__eje">' + miles(v) + '</text>'; }).join('');
    var barras = datos.map(function (d, i) {
      var x = pad.l + ancho * i + (ancho - bw) / 2, top = y(d[1]), h = Math.max(1, y(0) - top), r = Math.min(4, h);
      var path = 'M' + x + ',' + y(0) + 'V' + (top + r) + 'Q' + x + ',' + top + ' ' + (x + r) + ',' + top + 'H' + (x + bw - r) + 'Q' + (x + bw) + ',' + top + ' ' + (x + bw) + ',' + (top + r) + 'V' + y(0) + 'Z';
      var et = o.etiqueta ? o.etiqueta(d[0]) : d[0];
      return '<g class="graf__barra" tabindex="0" role="img" aria-label="' + esc(et + ': ' + F.moneda(d[1])) + '"><title>' + esc(et + ': ' + F.moneda(d[1])) + '</title>' +
        '<rect x="' + (pad.l + ancho * i) + '" y="' + pad.t + '" width="' + ancho + '" height="' + (H - pad.t - pad.b) + '" fill="transparent"/><path d="' + path + '"/>' +
        '<text x="' + (x + bw / 2) + '" y="' + (H - 12) + '" text-anchor="middle" class="graf__eje">' + esc(o.corta ? o.corta(d[0]) : et) + '</text></g>';
    }).join('');
    return '<figure class="graf" id="' + id + '"><svg viewBox="0 0 ' + W + ' ' + H + '" role="group" aria-label="' + esc(o.titulo || 'Gráfico') + '">' + grid + barras + '</svg>' +
      '<details class="desplegable" style="margin-top:var(--s-2)"><summary>Ver como tabla</summary><div><table><thead><tr><th scope="col">' + esc(o.col || 'Periodo') + '</th><th scope="col" class="num">Importe</th></tr></thead><tbody>' +
      datos.map(function (d) { return fila([esc(o.etiqueta ? o.etiqueta(d[0]) : d[0]), n(F.moneda(d[1]))]); }).join('') + '</tbody></table></div></details></figure>';
  };
  R.grafHorizontal = function (datos) {
    var max = Math.max.apply(null, datos.map(function (d) { return d[1]; }));
    return '<ul class="graf-h">' + datos.map(function (d) {
      return '<li tabindex="0" aria-label="' + esc(d[0] + ': ' + F.moneda(d[1])) + '" title="' + esc(d[0] + ': ' + F.moneda(d[1])) + '"><span class="graf-h__et">' + esc(d[0]) + '</span><span class="graf-h__barra"><span style="width:' + Math.max(1, Math.round(d[1] / max * 100)) + '%"></span></span><span class="graf-h__val num">' + miles(d[1]) + '</span></li>';
    }).join('') + '</ul>';
  };

  /* ======================= GER-01 Panel de indicadores ======================= */
  R.vistas['GER-01'] = function (ctx) {
    var total = D.recaudacionTributo.reduce(function (a, d) { return a + d[1]; }, 0);
    return {
      subtitulo: 'Cifras al ' + F.fecha(R.config.fechaCorte) + ' · ' + esc(R.config.ambito) + ' · ' + R.ficticio(),
      acciones: '<button type="button" class="btn btn--primario" id="g-corte">Cambiar fecha de corte</button><a class="btn" href="#/reportes/catalogo">Ver reportes</a><a class="btn btn--terciario" href="#/gerencia/consulta">Preguntar por un indicador</a>',
      contenido: '<div class="kpis">' + D.indicadores.map(function (k) {
        return '<div class="kpi"><div class="kpi__etiqueta">' + esc(k.nombre) + ' <button type="button" class="termino" data-tip="' + esc(k.definicion) + '" aria-label="Qué significa ' + esc(k.nombre) + '">' + R.icono('info') + '</button></div><div class="kpi__valor">' + (k.valor === null ? k.numero : F.moneda(k.valor)) + '</div><div class="kpi__contexto">' + esc(k.contexto) + '</div></div>';
      }).join('') + '</div>' +
        '<p class="micro">Definiciones de los indicadores ' + R.pend('PE-150') + ' · Volúmenes de ejemplo ' + R.pend('PE-004') + '</p>' +
        '<div class="rejilla-2"><section class="panel"><h2>Recaudación confirmada por mes</h2><p class="pequeno texto-2">Últimos 12 meses. Los picos coinciden con los vencimientos de febrero, mayo, agosto y noviembre.</p>' +
        R.grafBarras('g-mes', D.recaudacionMensual, { etiqueta: mes, corta: function (ym) { var m = MESES[Number(ym.split('-')[1]) - 1]; return m === 'ene' ? m + ' ' + ym.slice(2, 4) : m; }, titulo: 'Recaudación confirmada por mes', col: 'Mes' }) + '</section>' +
        '<section class="panel"><h2>Recaudación del año por concepto</h2><p class="pequeno texto-2">Enero a marzo de 2027 · total ' + F.moneda(total) + '</p>' + R.grafHorizontal(D.recaudacionTributo) + '</section></div>' +
        '<section class="panel"><h2>Alertas para la gerencia</h2><ul class="lista-simple pequeno"><li>Arbitrios 2027 sin emitir: falta la ordenanza.</li><li>Una tarea de levantamiento coactivo vence hoy.</li><li>' + F.entero(488) + ' Órdenes de Pago de arbitrios en revisión.</li></ul></section>',
      despues: function () { $('#g-corte').addEventListener('click', function () { R.avisar('info', 'Fecha de corte', 'En el sistema se elige la fecha y el ámbito; las cifras se recalculan y queda registrada la consulta.'); }); }
    };
  };

  /* ======================= GER-02 Consulta en lenguaje natural ======================= */
  R.vistas['GER-02'] = function (ctx) {
    return {
      subtitulo: 'Escribe tu pregunta. El sistema la traduce a un indicador del catálogo; las cifras salen siempre de la consulta, nunca del asistente.',
      acciones: '<button type="button" class="btn btn--primario" id="q-ir">Consultar</button>',
      contenido: '<section class="panel">' + R.campo({ id: 'q-texto', label: 'Tu pregunta', valor: '¿Cuánto se recaudó de predial en febrero frente a febrero del año pasado?', ancho: true }) +
        '<div id="q-res" style="margin-top:var(--s-4)"></div></section>' +
        '<section class="panel panel--ia"><h2>' + R.icono('chispa') + ' Proyección de recaudación</h2><p class="pequeno">Capacidad construida y <strong>desactivada</strong>: necesita al menos 3 ejercicios conciliados del sistema nuevo. Activarla antes sería mostrar una predicción sin sustento.</p></section>',
      despues: function () {
        $('#q-ir').addEventListener('click', function () {
          var t = R.normalizar($('#q-texto').value);
          $('#q-res').innerHTML = /recaud/.test(t) ? R.aviso('info', 'Entendí: «Recaudación confirmada» · Impuesto predial · febrero 2027 frente a febrero 2026', 'Si no es lo que buscabas, cambia la pregunta.') +
            '<div class="kpis" style="margin-top:var(--s-3)"><div class="kpi"><div class="kpi__etiqueta">Febrero 2027</div><div class="kpi__valor">' + F.moneda(24350000) + '</div><div class="kpi__contexto">consulta del catálogo · ' + R.ficticio() + '</div></div>' +
            '<div class="kpi"><div class="kpi__etiqueta">Febrero 2026</div><div class="kpi__valor">' + F.moneda(21980000) + '</div><div class="kpi__contexto">+10.8 %</div></div></div>'
            : R.aviso('alerta', 'No encontré un indicador para esa pregunta', 'Prueba con recaudación, conciliado, cartera o expedientes.');
        });
      }
    };
  };

  /* ======================= REP-01 Catálogo de reportes ======================= */
  R.vistas['REP-01'] = function (ctx) {
    return {
      subtitulo: 'Cada exportación queda registrada en la auditoría.',
      acciones: '<button type="button" class="btn btn--primario" id="r-gen">Generar reporte</button>',
      contenido: '<section class="panel"><div class="filtros">' + R.campo({ id: 'r-tipo', label: 'Reporte', opciones: D.reportes.map(function (r, i) { return [i, r[0]]; }) }) +
        R.campo({ id: 'r-desde', label: 'Desde', tipo: 'date', valor: '2027-03-01' }) + R.campo({ id: 'r-hasta', label: 'Hasta', tipo: 'date', valor: R.config.fechaCorte }) +
        R.campo({ id: 'r-fmt', label: 'Formato', opciones: ['PDF', 'Excel'] }) + '</div><div id="r-res" style="margin-top:var(--s-4)"></div></section>' +
        '<section class="panel"><h2>Reportes disponibles</h2><table><thead><tr><th scope="col">Reporte</th><th scope="col">Área</th><th scope="col">Contenido</th></tr></thead><tbody>' +
        D.reportes.map(function (r) { return fila(['<strong>' + esc(r[0]) + '</strong>', esc(r[1]), esc(r[2])]); }).join('') + '</tbody></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Reportes obligatorios y formatos ' + R.pend('PE-151') + '</p></section>',
      despues: function () {
        $('#r-gen').addEventListener('click', function () {
          var r = D.reportes[Number($('#r-tipo').value)];
          $('#r-res').innerHTML = R.aviso('exito', 'Reporte generado: ' + r[0], 'Del ' + F.fecha($('#r-desde').value) + ' al ' + F.fecha($('#r-hasta').value) + ' en ' + esc($('#r-fmt').value) + '. Archivo de ejemplo.') +
            R.huella({ accion: 'Exportar reporte', recurso: r[0], resultado: 'Generado' });
        });
      }
    };
  };

  /* ======================= REP-02 Saldos por cobrar ======================= */
  R.vistas['REP-02'] = function (ctx) {
    var cols = ['Saldo inicial', 'Altas', 'Bajas', 'Ingresos', 'Descargos', 'Fraccionado', 'Saldo final'];
    var tot = [0, 0, 0, 0, 0, 0, 0];
    D.saldosPorCobrar.forEach(function (f) { for (var i = 1; i < 8; i++) tot[i - 1] += f[i]; });
    return {
      subtitulo: 'Al 31/12/2026 · cómo cambió la deuda por cobrar en el año · ' + R.ficticio(),
      acciones: '<button type="button" class="btn btn--primario" id="s-proc">Procesar otro corte</button><button type="button" class="btn" onclick="window.print()">Imprimir</button>',
      contenido: '<section class="panel"><div class="tabla-marco"><table><caption class="sr-only">Saldos por cobrar</caption><thead><tr><th scope="col">Concepto</th>' + cols.map(function (c) { return '<th scope="col" class="num">' + c + '</th>'; }).join('') + '</tr></thead><tbody>' +
        D.saldosPorCobrar.map(function (f) { return fila([esc(f[0])].concat(f.slice(1).map(function (v, i) { return n(i === 6 ? '<strong>' + F.moneda(v) + '</strong>' : F.moneda(v)); }))); }).join('') +
        '</tbody><tfoot><tr><td>Total</td>' + tot.map(function (v) { return '<td class="num">' + F.moneda(v) + '</td>'; }).join('') + '</tr></tfoot></table></div>' +
        '<p class="micro" style="margin-top:var(--s-2)">Saldo final = inicial + altas − bajas − ingresos − descargos − fraccionado. Cada cifra tiene su detalle; se puede volver a generar en cualquier momento.</p></section>' +
        '<section class="panel"><h2>Por situación al 31/12/2026</h2><table><thead><tr><th scope="col">Situación</th><th scope="col" class="num">Saldo</th></tr></thead><tbody>' +
        fila(['Ordinaria', n(F.moneda(201300000))]) + fila(['Con valor emitido', n(F.moneda(78200000))]) + fila(['En coactivo', n(F.moneda(30200000))]) + '</tbody><tfoot><tr><td>Total</td><td class="num">' + F.moneda(309700000) + '</td></tr></tfoot></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Cada deuda se cuenta una sola vez, en su situación actual. Formato del reporte ' + R.pend('PE-151') + '</p></section>',
      despues: function () { $('#s-proc').addEventListener('click', function () { R.avisar('info', 'Proceso de saldos', 'Se elige la fecha de corte y el proceso se ejecuta en segundo plano; el resultado queda guardado.'); }); }
    };
  };

  /* ======================= MAE-01 Normas y evidencias ======================= */
  R.vistas['MAE-01'] = function (ctx) {
    var tipo = { 'Verificado': 'exito', 'Local histórico': 'info', 'Local parcial': 'alerta', 'Falta': 'error' };
    return {
      subtitulo: 'Cada parámetro del sistema apunta a una norma registrada aquí, con su archivo, artículos y vigencia.',
      acciones: R.btn(ctx, 'Registrar norma', { tipo: 'primario', id: 'btn-norma' }),
      contenido: '<div id="res-n"></div><section class="panel">' + R.tabla('t-normas', { caption: 'Normas', filas: D.normas, columnas: [
        { clave: 'nombre', titulo: 'Norma', orden: true }, { clave: 'tipo', titulo: 'Ámbito', orden: true }, { clave: 'articulos', titulo: 'Artículos' },
        { clave: 'vigencia', titulo: 'Vigencia' }, { clave: 'estado', titulo: 'Evidencia', orden: true, render: function (x) { return R.ins(x.estado, tipo[x.estado]); } }] }) +
        '<p class="micro" style="margin-top:var(--s-2)">Ordenanzas que faltan cargar ' + R.pend('PE-174') + '</p></section>' +
        '<section class="panel" id="form-norma" hidden><h2>Nueva norma</h2><div class="form-rejilla">' +
        R.campo({ id: 'nn-nombre', label: 'Número y nombre', obligatorio: true }) + R.campo({ id: 'nn-pub', label: 'Fecha de publicación', tipo: 'date' }) +
        R.campo({ id: 'nn-desde', label: 'Rige desde', tipo: 'date' }) + R.campo({ id: 'nn-arch', label: 'Archivo firmado (PDF)', tipo: 'file' }) + '</div>' +
        '<p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="nn-ok">Guardar</button></p></section>',
      despues: function () {
        var b = $('#btn-norma'); if (b && !b.disabled) b.addEventListener('click', function () { $('#form-norma').hidden = false; $('#nn-nombre').focus(); });
        $('#nn-ok').addEventListener('click', function () {
          R.limpiarError('nn-nombre'); if (!$('#nn-nombre').value.trim()) { R.marcarError('nn-nombre', 'Escribe el número y nombre de la norma.').focus(); return; }
          $('#form-norma').hidden = true; $('#res-n').innerHTML = R.aviso('exito', 'Norma registrada', 'Se guardó el archivo con su huella digital. Ahora puedes crear parámetros que la citen.');
        });
      }
    };
  };

  /* ======================= MAE-02 Parámetros y versiones ======================= */
  R.vistas['MAE-02'] = function (ctx) {
    var tipo = { 'Publicado': 'exito', 'En revisión': 'alerta', 'Borrador': 'info', 'Sin fuente': 'error', 'No habilitado': 'neutra', 'No activable': 'neutra' };
    return {
      subtitulo: 'Borrador → revisado → publicado → sustituido. Quien propone no publica. Lo publicado no se modifica: se crea una versión nueva.',
      acciones: R.btn(ctx, 'Nuevo borrador', { tipo: 'primario', id: 'btn-par' }),
      contenido: '<div id="res-p"></div><section class="panel"><div class="tabla-marco"><table><caption class="sr-only">Parámetros</caption><thead><tr><th scope="col">Parámetro</th><th scope="col">Versión</th><th scope="col">Valor</th><th scope="col">Fuente</th><th scope="col">Autor / revisor</th><th scope="col">Estado</th><th scope="col">Acción</th></tr></thead><tbody>' +
        D.parametros.map(function (p, i) {
          return fila(['<strong>' + esc(p.nombre) + '</strong><div class="micro mono">' + p.clave + '</div>', esc(p.version), esc(p.valor), esc(p.fuente) + (p.pend ? ' ' + R.pend(p.pend) : ''), esc(p.autor) + '<div class="micro">' + esc(p.revisor) + '</div>',
            R.ins(p.estado, tipo[p.estado]), p.estado === 'En revisión' ? R.btn(ctx, 'Publicar', { chico: true, id: 'pub-' + i }) : '']);
        }).join('') + '</tbody></table></div><p class="micro" style="margin-top:var(--s-2)">Si un parámetro no está publicado, el sistema permite simular pero no emitir ni cobrar.</p></section>',
      despues: function () {
        var b = $('#btn-par'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Nuevo borrador', 'Se elige el parámetro, la norma que lo sustenta, el artículo, la vigencia y los valores.'); });
        var p = document.getElementById('pub-5'); if (p && !p.disabled) p.addEventListener('click', function () {
          $('#res-p').innerHTML = R.aviso('alerta', 'No se puede publicar todavía', 'La versión no tiene una norma registrada como fuente. Primero registra el reglamento de fraccionamiento en «Normas y evidencias» ' + R.pend('PE-090') + '. Así se evita publicar un valor sin sustento.');
        });
      }
    };
  };

  /* ======================= MAE-03 Calendario legal ======================= */
  R.vistas['MAE-03'] = function (ctx) {
    return {
      subtitulo: 'Vencimientos y prórrogas por concepto y periodo, y días no laborables para contar plazos en días hábiles.',
      acciones: R.btn(ctx, 'Agregar vencimiento', { tipo: 'primario', id: 'btn-cal' }),
      contenido: '<section class="panel"><table><thead><tr><th scope="col">Concepto</th><th scope="col">Periodo</th><th scope="col">Fecha</th><th scope="col">Tipo</th><th scope="col">Fuente</th></tr></thead><tbody>' +
        D.calendario.map(function (c, i) { return fila([esc(c[0]), esc(c[1]), F.fecha(c[2]), esc(c[3]), R.pend(i === 5 ? 'PE-160' : 'PE-042')]); }).join('') + '</tbody></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Las fechas se guardan como fecha legal de Lima. Una prórroga crea una versión nueva y conserva la anterior.</p></section>',
      despues: function () { var b = $('#btn-cal'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Nuevo vencimiento', 'Se registra con la norma o el decreto que lo establece.'); }); }
    };
  };

  /* ======================= MAE-04 Catálogos y territorio ======================= */
  R.vistas['MAE-04'] = function (ctx) {
    return {
      subtitulo: 'Listas que usan los formularios: vías, sectores, usos, condiciones, motivos y tarifario.',
      acciones: R.btn(ctx, 'Agregar elemento', { tipo: 'primario', id: 'btn-cat' }),
      contenido: '<section class="panel"><table><thead><tr><th scope="col">Catálogo</th><th scope="col" class="num">Elementos</th><th scope="col">Ejemplos</th><th scope="col">Por confirmar</th></tr></thead><tbody>' +
        D.catalogos.map(function (c) { return fila(['<strong>' + esc(c[0]) + '</strong>', n(c[1]), esc(c[2]), R.pend(c[3])]); }).join('') + '</tbody></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">Departamento, provincia y distrito usan el ubigeo oficial del INEI. Un elemento usado no se borra: se da de baja con fecha.</p></section>',
      despues: function () { var b = $('#btn-cat'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Nuevo elemento', 'Se agrega con vigencia desde una fecha.'); }); }
    };
  };

  /* ======================= MAE-05 Importación y plantillas ======================= */
  R.vistas['MAE-05'] = function (ctx) {
    var I = D.importacion;
    return {
      subtitulo: 'Carga tablas oficiales (aranceles, valores unitarios, depreciación) con vista previa. Nada se publica sin revisión.',
      acciones: R.btn(ctx, 'Validar archivo', { tipo: 'primario', id: 'btn-imp' }),
      contenido: '<section class="panel"><div class="form-rejilla">' + R.campo({ id: 'i-tabla', label: 'Tabla', opciones: ['Valores unitarios de edificación', 'Aranceles de terreno', 'Depreciación'], pend: 'PE-040' }) +
        R.campo({ id: 'i-arch', label: 'Archivo', tipo: 'file' }) + '</div><div id="i-res" style="margin-top:var(--s-4)"></div></section>' +
        '<section class="panel"><h2>Plantillas de documentos</h2><table><thead><tr><th scope="col">Plantilla</th><th scope="col">Versión</th><th scope="col">Estado</th></tr></thead><tbody>' +
        fila(['Recibo de pago', 'v2', R.ins('Vigente', 'exito')]) + fila(['Orden de Pago', 'v1', R.ins('Borrador', 'alerta')]) + fila(['Resolución de Ejecución Coactiva', 'v1', R.ins('Borrador', 'alerta')]) +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">Formatos oficiales ' + R.pend('PE-045') + ' · Un documento emitido conserva la versión de plantilla con que se generó.</p></section>',
      despues: function () {
        var b = $('#btn-imp'); if (b && !b.disabled) b.addEventListener('click', function () {
          $('#i-res').innerHTML = R.aviso('alerta', I.archivo + ': ' + F.entero(I.validas) + ' de ' + F.entero(I.filas) + ' filas válidas', 'Corrige los errores y vuelve a cargar, o envía a revisión sin las filas con error.') +
            '<table style="margin-top:var(--s-3)"><thead><tr><th scope="col">Fila</th><th scope="col">Error</th></tr></thead><tbody>' + I.errores.map(function (e) { return fila([e[0], esc(e[1])]); }).join('') + '</tbody></table>';
        });
      }
    };
  };

  /* ======================= MAE-06 Migración del legado ======================= */
  R.vistas['MAE-06'] = function (ctx) {
    var tipo = { 'Conciliado con observaciones': 'info', 'En revisión': 'alerta', 'Diferencias por explicar': 'error' };
    return {
      subtitulo: 'La información del sistema actual se carga por lotes y se concilia por componente antes del cambio de sistema.',
      acciones: '<button type="button" class="btn btn--primario" id="btn-mig">Ver errores del lote</button>',
      contenido: R.aviso('pend', 'Información del sistema actual', 'Ejercicios disponibles, diccionario y totales certificados ' + R.pend('PE-161')) +
        '<section class="panel"><h2>Lotes de prueba</h2><table><thead><tr><th scope="col">Lote</th><th scope="col">Contenido</th><th scope="col" class="num">Registros</th><th scope="col" class="num">Cargados</th><th scope="col" class="num">Con error</th><th scope="col">Estado</th></tr></thead><tbody>' +
        D.migracion.map(function (m) { return fila(['<span class="mono">' + m.lote + '</span>', esc(m.origen), n(F.entero(m.registros)), n(F.entero(m.cargados)), n(F.entero(m.errores)), R.ins(m.estado, tipo[m.estado])]); }).join('') + '</tbody></table></section>' +
        '<section class="panel"><h2>Conciliación de deudas por componente (MIG-PILOTO-03)</h2><table><thead><tr><th scope="col">Componente</th><th scope="col" class="num">Sistema actual</th><th scope="col" class="num">Sistema nuevo</th><th scope="col" class="num">Diferencia</th></tr></thead><tbody>' +
        D.conciliacionMig.map(function (c) { var d = c[2] - c[1]; return fila([esc(c[0]), n(F.moneda(c[1])), n(F.moneda(c[2])), n(d ? '<strong style="color:var(--c-error)">' + F.moneda(d) + '</strong>' : F.moneda(0))]); }).join('') + '</tbody></table>' +
        R.aviso('error', 'No se puede hacer el cambio de sistema', 'Hay una diferencia de interés sin explicar. Las diferencias se investigan; no se «ajustan» para que cuadren.') + '</section>',
      despues: function () { $('#btn-mig').addEventListener('click', function () { R.avisar('info', 'Errores del lote', 'Lista de registros rechazados con el motivo, para corregir en el origen.'); }); }
    };
  };

  /* ======================= SEG-01 Usuarios y asignaciones ======================= */
  R.vistas['SEG-01'] = function (ctx) {
    return {
      subtitulo: 'Cada persona tiene su propio usuario. Los roles se asignan con ámbito y vigencia, y otra persona los aprueba.',
      acciones: R.btn(ctx, 'Proponer asignación', { tipo: 'primario', id: 'btn-asig' }) + R.btn(ctx, 'Revocar sesiones', { id: 'btn-rev' }),
      contenido: '<div id="res-u"></div><section class="panel">' + R.tabla('t-usr', { caption: 'Usuarios', filas: D.usuarios, columnas: [
        { clave: 'usuario', titulo: 'Usuario', orden: true, render: function (u) { return '<span class="mono">' + u.usuario + '</span>'; } }, { clave: 'nombre', titulo: 'Nombre', orden: true },
        { clave: 'rol', titulo: 'Rol', orden: true }, { clave: 'ambito', titulo: 'Ámbito' }, { clave: 'vigencia', titulo: 'Vigencia' }, { clave: 'mfa', titulo: 'Verificación en dos pasos' },
        { clave: 'estado', titulo: 'Estado', orden: true, render: function (u) { return R.ins(u.estado, u.estado === 'Activo' ? 'exito' : 'neutra'); } }] }) +
        '<p class="micro" style="margin-top:var(--s-2)">Nombres de cargos según el ROF ' + R.pend('PE-002') + ' · Tiempo de sesión ' + R.pend('PE-162') + '</p></section>',
      despues: function () {
        var b = $('#btn-asig'); if (b && !b.disabled) b.addEventListener('click', function () {
          R.confirmarSensible({ titulo: 'Proponer asignación de rol', accion: 'Enviar a aprobación', recurso: 'usr.demo.cajero4', sinMotivo: true, textoConfirmacion: 'La asignación queda pendiente hasta que otra persona autorizada la apruebe.',
            resumen: [['Usuario', 'usr.demo.cajero4'], ['Rol', 'Cajero'], ['Ámbito', 'Caja 2 · Sede central'], ['Vigencia', '15/03/2027 – 31/12/2027']],
            alConfirmar: function (huella) { $('#res-u').innerHTML = R.aviso('exito', 'Asignación propuesta', 'APR-2027-0142 · aparece en «Aprobaciones pendientes».') + huella; } });
        });
        var r = $('#btn-rev'); if (r && !r.disabled) r.addEventListener('click', function () { R.avisar('exito', 'Sesiones revocadas', 'usr.demo.cajero3 ya no puede hacer operaciones.'); });
      }
    };
  };

  /* ======================= SEG-02 Roles y permiso efectivo ======================= */
  R.vistas['SEG-02'] = function (ctx) {
    var perfiles = R.perfiles;
    return {
      subtitulo: 'Qué permite cada rol y qué combinaciones no se permiten a una misma persona.',
      acciones: '<button type="button" class="btn btn--primario" id="btn-sim">Simular acceso</button>',
      contenido: '<section class="panel"><div class="tabla-marco"><table><caption class="sr-only">Matriz de permisos</caption><thead><tr><th scope="col">Permiso</th>' +
        perfiles.map(function (p) { return '<th scope="col" style="text-align:center">' + esc(p.nombre) + '</th>'; }).join('') + '</tr></thead><tbody>' +
        Object.keys(D.matrizPermisos).map(function (k) { return '<tr><th scope="row" style="position:static;background:none">' + esc(k) + '</th>' + perfiles.map(function (p) { var si = D.matrizPermisos[k].indexOf(p.id) >= 0; return '<td style="text-align:center">' + (si ? '<span style="color:var(--c-exito)">' + R.icono('check') + '<span class="sr-only">Sí</span></span>' : '<span class="sr-only">No</span>') + '</td>'; }).join('') + '</tr>'; }).join('') +
        '</tbody></table></div></section>' +
        '<p class="micro">Nombres de los roles según el ROF ' + R.pend('PE-002') + '</p><div class="rejilla-2"><section class="panel"><h2>Combinaciones no permitidas</h2><ul class="lista-simple pequeno">' + D.incompatibles.map(function (x) { return '<li>' + esc(x[0]) + ' + ' + esc(x[1]) + '</li>'; }).join('') + '</ul></section>' +
        '<section class="panel"><h2>¿Qué puede hacer esta persona?</h2>' + R.campo({ id: 'sim-u', label: 'Usuario', opciones: D.usuarios.map(function (u) { return [u.usuario, u.usuario + ' · ' + u.rol]; }) }) + '<div id="sim-res" style="margin-top:var(--s-3)"></div></section></div>',
      despues: function () {
        $('#btn-sim').addEventListener('click', function () {
          var u = D.usuarios.filter(function (x) { return x.usuario === $('#sim-u').value; })[0];
          var perm = Object.keys(D.matrizPermisos).filter(function (k) { var id = { 'Operador de Rentas': 'operador', 'Cajero': 'cajero', 'Supervisor de Rentas': 'supervisor', 'Ejecutor coactivo': 'ejecutor', 'Fiscalizador': 'fiscalizador' }[u.rol]; return D.matrizPermisos[k].indexOf(id) >= 0; });
          $('#sim-res').innerHTML = u.estado !== 'Activo' ? R.aviso('error', 'Sin acceso', 'La asignación de este usuario venció o fue revocada.') : '<p class="pequeno"><strong>' + esc(u.usuario) + '</strong> · ámbito ' + esc(u.ambito) + '</p><ul class="lista-simple pequeno">' + perm.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>';
        });
      }
    };
  };

  /* ======================= SEG-03 Aprobaciones pendientes ======================= */
  R.vistas['SEG-03'] = function (ctx) {
    return {
      subtitulo: 'Todas las solicitudes que esperan la aprobación de otra persona. Nunca verás aquí una solicitud tuya como aprobable.',
      acciones: '<a class="btn btn--primario" href="' + D.aprobaciones[0].destino + '">Revisar la más antigua</a>',
      contenido: '<section class="panel">' + R.tabla('t-apr', { caption: 'Aprobaciones', filas: D.aprobaciones, columnas: [
        { clave: 'id', titulo: 'Solicitud', orden: true, render: function (a) { return '<span class="mono">' + a.id + '</span>'; } }, { clave: 'tipo', titulo: 'Tipo', orden: true }, { clave: 'detalle', titulo: 'Detalle' },
        { clave: 'solicitante', titulo: 'Solicitó', orden: true }, { clave: 'fecha', titulo: 'Fecha', orden: true },
        { clave: 'x', titulo: 'Acción', render: function (a) { var propia = a.solicitante === R.usuarioDemo(ctx.perfil.id); return propia ? '<span class="micro">Solicitud tuya</span>' : '<a class="btn btn--chico" href="' + a.destino + '">Revisar</a>'; } }] }) + '</section>'
    };
  };

  /* ======================= SEG-04 Auditoría ======================= */
  R.vistas['SEG-04'] = function (ctx) {
    var filas = D.auditoria.map(function (a) { return { fecha: a[0], actor: a[1], accion: a[2], recurso: a[3], corr: a[4], res: a[5] }; });
    return {
      subtitulo: 'Quién hizo qué, cuándo y con qué resultado. Solo lectura. No guarda contraseñas ni datos innecesarios.',
      acciones: '<button type="button" class="btn btn--primario" id="btn-exp">Exportar (autorizado)</button>',
      contenido: '<section class="panel"><div class="filtros">' + R.campo({ id: 'a-actor', label: 'Usuario', opciones: [['', 'Todos']].concat(D.usuarios.map(function (u) { return [u.usuario, u.usuario]; })) }) +
        R.campo({ id: 'a-res', label: 'Resultado', opciones: [['', 'Todos'], ['Correcto', 'Correcto'], ['Denegado', 'Denegado'], ['Pendiente', 'Pendiente']] }) + '</div>' +
        '<div style="margin-top:var(--s-4)">' + R.tabla('t-aud', { caption: 'Eventos', filas: filas, porPagina: 10, columnas: [
          { clave: 'fecha', titulo: 'Fecha y hora', orden: true }, { clave: 'actor', titulo: 'Usuario', orden: true, render: function (f) { return '<span class="mono">' + f.actor + '</span>'; } },
          { clave: 'accion', titulo: 'Acción', orden: true }, { clave: 'recurso', titulo: 'Recurso' }, { clave: 'corr', titulo: 'Correlación', render: function (f) { return '<span class="mono micro">' + f.corr + '</span>'; } },
          { clave: 'res', titulo: 'Resultado', orden: true, render: function (f) { return R.ins(f.res, /Denegado/.test(f.res) ? 'error' : /Pendiente/.test(f.res) ? 'alerta' : /alerta/.test(f.res) ? 'info' : 'exito'); } }] }) + '</div>' +
        '<p class="micro" style="margin-top:var(--s-2)">Plazo de conservación ' + R.pend('PE-163') + '</p></section>',
      despues: function () {
        function f() { var a = $('#a-actor').value, r = $('#a-res').value; R.tablaDatos('t-aud', filas.filter(function (x) { return (!a || x.actor === a) && (!r || x.res.indexOf(r) === 0); })); }
        $('#a-actor').addEventListener('change', f); $('#a-res').addEventListener('change', f);
        $('#btn-exp').addEventListener('click', function () { R.avisar('info', 'Exportación registrada', 'La propia exportación queda en la auditoría.'); });
      }
    };
  };

  /* ======================= SEG-05 Capacidades y salud ======================= */
  R.vistas['SEG-05'] = function (ctx) {
    var tipo = { 'Habilitado': 'exito', 'Simulación': 'alerta', 'Deshabilitado': 'error', 'Piloto': 'info' };
    return {
      subtitulo: 'Qué está habilitado por ejercicio y ámbito, y por qué. Un faltante solo apaga la operación afectada, no todo el sistema.',
      acciones: R.btn(ctx, 'Proponer cambio de capacidad', { tipo: 'primario', id: 'btn-capa' }),
      contenido: '<section class="panel"><table><thead><tr><th scope="col">Capacidad</th><th scope="col">Ejercicio</th><th scope="col">Ámbito</th><th scope="col">Estado</th><th scope="col">Motivo</th></tr></thead><tbody>' +
        D.capacidades.map(function (c) { return fila(['<strong>' + esc(c[0]) + '</strong>', esc(c[1]), esc(c[2]), R.ins(c[3], tipo[c[3]]), esc(c[4])]); }).join('') + '</tbody></table></section>' +
        '<section class="panel"><h2>Salud del servicio</h2>' + R.dl([['Aplicación', R.ins('En funcionamiento', 'exito')], ['Base de datos', R.ins('En funcionamiento', 'exito')], ['Último respaldo', '15/03/2027 02:00 · restauración probada el 01/03/2027'], ['Trabajos en cola', '0']]) + '</section>',
      despues: function () { var b = $('#btn-capa'); if (b && !b.disabled) b.addEventListener('click', function () { R.avisar('info', 'Cambio de capacidad', 'Requiere aprobación y queda auditado.'); }); }
    };
  };
})(window.RENTAS = window.RENTAS || {});
