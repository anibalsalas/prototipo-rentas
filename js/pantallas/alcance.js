/* Módulos por confirmar: pantallas internas (ESP, MER, AMB, VEH, ALB, APU, WEB).
   Todas llevan «Módulo por confirmar». Las tasas citadas son nacionales y están verificadas en docs/02;
   los montos son de ejemplo y nada se emite ni se cobra. */
(function (R) {
  'use strict';
  var esc = R.esc, $ = function (s) { return document.querySelector(s); }, F = R.fmt;
  var UIT = 550000; /* UIT 2026 como ejemplo (PE-046) */
  function fila(cols) { return '<tr>' + cols.map(function (c) { return '<td' + (c && c.num ? ' class="num"' : '') + '>' + (c && c.h !== undefined ? c.h : c) + '</td>'; }).join('') + '</tr>'; }
  function n(h) { return { h: h, num: true }; }
  function calc(filas) { return '<div class="calculo">' + filas.map(function (f) { return '<div class="calculo__fila' + (f[2] ? ' calculo__fila--total' : '') + '"><span>' + f[0] + '</span><span class="num">' + f[1] + '</span></div>'; }).join('') + '</div>'; }
  function porConfirmar(pend, texto) {
    return R.aviso('info', 'Módulo por confirmar', esc(texto) + ' Les mostramos cómo funcionaría; no se emite ni se cobra hasta confirmarlo. ' + R.pend(pend));
  }
  function acc(extra) { return (extra || '') + '<span class="acciones__fin">' + R.insEstadoModulo('confirmar') + '</span>'; }
  function simular(id, titulo, texto) {
    var b = $('#' + id); if (!b || b.disabled) return;
    b.addEventListener('click', function () { R.avisar('info', titulo, texto); });
  }

  /* ======================= Espectáculos ======================= */
  R.vistas['ESP-01'] = function (ctx) {
    var ev = [['EVT-2027-0004', 'Función de cine (ejemplo)', 'Cine Demostración', '2027-03-12', 'Cine', 'Declarado'], ['EVT-2027-0006', 'Concierto de música (ejemplo)', 'Coliseo Ejemplo', '2027-03-28', 'Concierto', 'Programado'], ['EVT-2027-0002', 'Feria con espectáculos (ejemplo)', 'Explanada Prueba', '2027-02-14', 'Otros espectáculos', 'Liquidado']];
    return {
      subtitulo: 'Cada evento se registra con su local, organizador y fechas; luego se declaran las entradas vendidas.',
      acciones: acc(R.btn(ctx, 'Registrar evento', { tipo: 'primario', id: 'esp-nuevo' })),
      contenido: porConfirmar('PE-180', 'Falta confirmar si hay espectáculos gravados en el distrito y si el módulo entra al alcance.') +
        '<section class="panel"><h2>Eventos</h2><table><thead><tr><th scope="col">Evento</th><th scope="col">Nombre</th><th scope="col">Local</th><th scope="col">Fecha</th><th scope="col">Clase</th><th scope="col">Estado</th></tr></thead><tbody>' +
        ev.map(function (e) { return fila(['<span class="mono">' + e[0] + '</span>', esc(e[1]), esc(e[2]), F.fecha(e[3]), esc(e[4]), R.ins(e[5], e[5] === 'Liquidado' ? 'exito' : 'info')]); }).join('') + '</tbody></table></section>' +
        '<section class="panel"><h2>Declaración de entradas · EVT-2027-0004</h2><table><thead><tr><th scope="col">Tipo de entrada</th><th scope="col" class="num">Vendidas</th><th scope="col" class="num">Precio</th><th scope="col" class="num">Importe</th></tr></thead><tbody>' +
        fila(['General', n('820'), n(F.moneda(1200)), n(F.moneda(984000))]) + fila(['Niños', n('150'), n(F.moneda(800)), n(F.moneda(120000))]) +
        '</tbody><tfoot><tr><td colspan="3">Total vendido</td><td class="num">' + F.moneda(1104000) + '</td></tr></tfoot></table><p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + '</p></section>',
      despues: function () { simular('esp-nuevo', 'Nuevo evento', 'Se registran local, organizador, fechas, clase de espectáculo y entradas autorizadas.'); }
    };
  };
  R.vistas['ESP-02'] = function (ctx) {
    return {
      subtitulo: 'El impuesto depende de la clase de espectáculo. Cine y bingo no comparten tasa.',
      acciones: acc(R.btn(ctx, 'Emitir orden de pago', { tipo: 'primario', id: 'esp-op' })),
      contenido: porConfirmar('PE-180', 'Falta confirmar la actividad gravada real.') +
        '<div class="rejilla-2"><section class="panel"><h2>Liquidación · Función de cine (ejemplo)</h2>' +
        calc([['Total de entradas vendidas', F.moneda(1104000)], ['Tasa para cine', '10 %'], ['Impuesto a pagar', F.moneda(110400), true]]) +
        '<p class="micro" style="margin-top:var(--s-2)">Tasa según la clase de espectáculo: Ley de Tributación Municipal, art. 57. ' + R.ficticio() + '</p></section>' +
        '<section class="panel"><h2>Otras clases (referencia)</h2><ul class="lista-simple pequeno"><li>Cine y otros espectáculos: 10 %.</li><li>Carreras de caballos: 15 %.</li><li>Conciertos y otras categorías culturales previstas por la ley: 0 %.</li></ul>' +
        '<p class="micro" style="margin-top:var(--s-2)">El espectáculo se clasifica antes de liquidar; nunca se elige la tasa escribiendo texto libre.</p></section></div>',
      despues: function () { simular('esp-op', 'Demostración', 'En el sistema se emitiría la Orden de Pago al organizador. En este módulo por confirmar no se emite.'); }
    };
  };

  /* ======================= Merced conductiva ======================= */
  R.vistas['MER-01'] = function (ctx) {
    var c = [['CON-2026-014', 'Comercial Ejemplo S.A.C.', 'Puesto 12 del mercado (ejemplo)', 'Alquiler', 85000, '2026-01-01', '2027-12-31'], ['CON-2025-031', 'Rosa Ejemplo Vargas', 'Kiosco en parque (ejemplo)', 'Concesión', 42000, '2025-07-01', '2028-06-30'], ['CON-2027-002', 'Asociación de Vivienda Ejemplo', 'Local comunal (ejemplo)', 'Convenio', 15000, '2027-02-01', '2027-12-31']];
    return {
      subtitulo: 'Alquileres, concesiones y convenios. Son ingresos de contrato: se rigen por sus cláusulas, no por las reglas de los tributos.',
      acciones: acc(R.btn(ctx, 'Registrar contrato', { tipo: 'primario', id: 'mer-nuevo' })),
      contenido: porConfirmar('PE-181', 'Falta la lista de contratos vigentes y sus cláusulas.') +
        '<section class="panel"><h2>Contratos</h2><table><thead><tr><th scope="col">Contrato</th><th scope="col">Arrendatario</th><th scope="col">Bien</th><th scope="col">Tipo</th><th scope="col" class="num">Cuota mensual</th><th scope="col">Vigencia</th></tr></thead><tbody>' +
        c.map(function (x) { return fila(['<a class="mono" href="#/alc-merced/cuotas">' + x[0] + '</a>', esc(x[1]), esc(x[2]), esc(x[3]), n(F.moneda(x[4])), F.fecha(x[5]) + ' – ' + F.fecha(x[6])]); }).join('') + '</tbody></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + ' · Reajuste y penalidad según cada contrato; no se aplica el interés moratorio de los tributos.</p></section>',
      despues: function () { simular('mer-nuevo', 'Nuevo contrato', 'Se registra la contraparte, el bien, la cuota, el reajuste, la penalidad y la vigencia, con el contrato escaneado.'); }
    };
  };
  R.vistas['MER-02'] = function (ctx) {
    var cuotas = [['Enero 2027', '2027-01-10', 85000, 'Pagada'], ['Febrero 2027', '2027-02-10', 85000, 'Pagada'], ['Marzo 2027', '2027-03-10', 85000, 'Vencida'], ['Abril 2027', '2027-04-10', 85000, 'Por vencer']];
    return {
      subtitulo: 'Contrato CON-2026-014 · Comercial Ejemplo S.A.C. · Puesto 12 del mercado (ejemplo)',
      acciones: acc('<a class="btn btn--primario" href="#/caja/cobranza/CTB-000103">Cobrar en caja</a>'),
      contenido: porConfirmar('PE-181', 'Falta confirmar los contratos vigentes.') +
        '<section class="panel"><table><thead><tr><th scope="col">Cuota</th><th scope="col">Vence</th><th scope="col" class="num">Monto</th><th scope="col">Estado</th></tr></thead><tbody>' +
        cuotas.map(function (x) { return fila([esc(x[0]), F.fecha(x[1]), n(F.moneda(x[2])), R.ins(x[3], x[3] === 'Pagada' ? 'exito' : x[3] === 'Vencida' ? 'error' : 'neutra')]); }).join('') + '</tbody></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">La cuota vencida genera la penalidad que diga la cláusula del contrato. ' + R.ficticio() + '</p></section>'
    };
  };

  /* ======================= Comercio ambulatorio ======================= */
  R.vistas['AMB-01'] = function (ctx) {
    var v = [['AMB-0021', 'Pedro Ejemplo Chávez', 'Venta de frutas', 'Lunes a sábado, 7:00–13:00', 'Av. Demostración cdra. 6', 'Vigente'], ['AMB-0034', 'Marta Demo Torres', 'Venta de periódicos', 'Todos los días, 6:00–11:00', 'Jr. Los Ejemplos cdra. 1', 'Vigente'], ['AMB-0012', 'Jorge Prueba Salazar', 'Comida al paso', 'Viernes a domingo, 17:00–22:00', 'Explanada Prueba', 'Vencida']];
    return {
      subtitulo: 'Vendedores con autorización vigente, con su giro, horario y ubicación. La autorización la da el área competente; Rentas cobra.',
      acciones: acc(R.btn(ctx, 'Registrar vendedor', { tipo: 'primario', id: 'amb-nuevo' })),
      contenido: porConfirmar('PE-182', 'Falta la ordenanza y la tasa vigentes.') +
        '<section class="panel"><table><thead><tr><th scope="col">Autorización</th><th scope="col">Vendedor</th><th scope="col">Giro</th><th scope="col">Horario</th><th scope="col">Ubicación</th><th scope="col">Estado</th></tr></thead><tbody>' +
        v.map(function (x) { return fila(['<a class="mono" href="#/alc-ambulatorio/cuenta">' + x[0] + '</a>', esc(x[1]), esc(x[2]), esc(x[3]), esc(x[4]), R.ins(x[5], x[5] === 'Vigente' ? 'exito' : 'neutra')]); }).join('') + '</tbody></table></section>',
      despues: function () { simular('amb-nuevo', 'Nuevo vendedor', 'Se registra con el número de autorización del área competente, giro, horario y ubicación.'); }
    };
  };
  R.vistas['AMB-02'] = function (ctx) {
    var m = [['Enero 2027', 3000, 'Pagado'], ['Febrero 2027', 3000, 'Pagado'], ['Marzo 2027', 3000, 'Pendiente']];
    return {
      subtitulo: 'AMB-0021 · Pedro Ejemplo Chávez · Venta de frutas',
      acciones: acc('<button type="button" class="btn btn--primario" onclick="window.print()">Imprimir estado de cuenta</button>'),
      contenido: porConfirmar('PE-182', 'El monto mensual sale de la ordenanza.') +
        '<section class="panel"><table><thead><tr><th scope="col">Mes</th><th scope="col" class="num">Derecho (ejemplo)</th><th scope="col">Estado</th></tr></thead><tbody>' +
        m.map(function (x) { return fila([esc(x[0]), n(F.moneda(x[1])), R.ins(x[2], x[2] === 'Pagado' ? 'exito' : 'alerta')]); }).join('') + '</tbody><tfoot><tr><td>Pendiente</td><td class="num">' + F.moneda(3000) + '</td><td></td></tr></tfoot></table>' +
        '<p class="micro" style="margin-top:var(--s-2)">' + R.ficticio() + '</p></section>'
    };
  };

  /* ======================= Vehicular ======================= */
  R.vistas['VEH-01'] = function (ctx) {
    return {
      subtitulo: 'Se registra el vehículo, su propietario y la fecha de su primera inscripción en SUNARP, que define los años en que paga.',
      acciones: acc(R.btn(ctx, 'Registrar vehículo', { tipo: 'primario', id: 'veh-nuevo' })),
      contenido: porConfirmar('PE-183', 'Falta confirmar el procedimiento vehicular y si entra al alcance contratado.') +
        '<section class="panel"><h2>Vehículos</h2><table><thead><tr><th scope="col">Placa</th><th scope="col">Vehículo</th><th scope="col">Propietario</th><th scope="col">Primera inscripción</th><th scope="col">Años afectos</th></tr></thead><tbody>' +
        fila(['<span class="mono">ZZZ-901</span>', 'Automóvil 2025 (ejemplo)', 'Ana Prueba Quispe', '18/08/2025', '2026, 2027 y 2028']) +
        fila(['<span class="mono">ZZZ-455</span>', 'Camioneta 2024 (ejemplo)', 'Comercial Ejemplo S.A.C.', '05/03/2024', '2025, 2026 y 2027']) +
        fila(['<span class="mono">ZZZ-120</span>', 'Automóvil 2018 (ejemplo)', 'Jorge Prueba Salazar', '10/01/2019', 'Ya no paga (pasaron los 3 años)']) +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">Placas ficticias. Paga la municipalidad provincial del domicilio del propietario, durante tres años desde la primera inscripción. No se usa el año de fabricación como reemplazo.</p></section>',
      despues: function () { simular('veh-nuevo', 'Nuevo vehículo', 'Se registran placa, categoría, valor de adquisición, fecha de primera inscripción y propietario con su domicilio.'); }
    };
  };
  R.vistas['VEH-02'] = function (ctx) {
    var adq = 6000000, ref = 5820000, base = Math.max(adq, ref), imp = Math.round(base / 100), min = Math.round(UIT * 15 / 1000);
    return {
      subtitulo: 'ZZZ-901 · Automóvil 2025 (ejemplo) · Ana Prueba Quispe · ejercicio 2026',
      acciones: acc(R.btn(ctx, 'Emitir cuotas', { tipo: 'primario', id: 'veh-emitir' })),
      contenido: porConfirmar('PE-183', 'Falta confirmar el procedimiento vehicular.') +
        '<div class="rejilla-2"><section class="panel"><h2>Cálculo</h2>' + calc([
          ['Valor de adquisición', F.moneda(adq)], ['Valor referencial de la tabla del MEF (ejemplo)', F.moneda(ref)], ['Base: el mayor de los dos', F.moneda(base)],
          ['Impuesto: 1 % de la base', F.moneda(imp)], ['Mínimo: 1.5 % de la UIT ' + R.pend('PE-046'), F.moneda(min)], ['Impuesto anual (el mayor)', F.moneda(Math.max(imp, min)), true]]) +
        '<p class="micro" style="margin-top:var(--s-2)">Ley de Tributación Municipal, arts. 30 a 35. Tabla 2026: RM 008-2026-EF/15, por importar completa. ' + R.ficticio() + '</p></section>' +
        '<section class="panel"><h2>Años afectos</h2>' + R.pasos(['2026', '2027', '2028'], 0) + '<p class="pequeno" style="margin-top:var(--s-3)">Primera inscripción: 18/08/2025. El impuesto se paga los tres años siguientes, con el propietario al 1 de enero de cada año.</p></section></div>',
      despues: function () { simular('veh-emitir', 'Demostración', 'En el sistema se emitirían las cuotas del impuesto vehicular. En este módulo por confirmar no se emite.'); }
    };
  };

  /* ======================= Alcabala ======================= */
  R.vistas['ALB-01'] = function (ctx) {
    return {
      subtitulo: 'Se registra la compraventa con sus partes, el inmueble, la fecha y el valor pactado.',
      acciones: acc(R.btn(ctx, 'Registrar transferencia', { tipo: 'primario', id: 'alb-nuevo' })),
      contenido: porConfirmar('PE-184', 'Falta acreditar el FIM y la competencia fuera del cercado.') +
        '<section class="panel"><h2>Transferencias</h2><table><thead><tr><th scope="col">Transferencia</th><th scope="col">Comprador</th><th scope="col">Vendedor</th><th scope="col">Inmueble</th><th scope="col" class="num">Valor pactado</th><th scope="col">Competencia</th></tr></thead><tbody>' +
        fila(['<a class="mono" href="#/alc-alcabala/liquidacion">TRF-2027-0011</a>', 'Jorge Prueba Salazar', 'Sucesión Prueba Díaz', 'Jr. Los Ejemplos 512 · Bagua Grande', n(F.moneda(20000000)), R.ins('Cercado: competente', 'exito')]) +
        fila(['<span class="mono">TRF-2027-0014</span>', 'Rosa Ejemplo Vargas', 'Pedro Ejemplo Chávez', 'Lote en otro distrito de la provincia (ejemplo)', n(F.moneda(9500000)), R.ins('Competencia no acreditada', 'error')]) +
        '</tbody></table><p class="micro" style="margin-top:var(--s-2)">Si el inmueble está fuera del cercado y no se acredita el FIM, ese caso no se emite. Los demás casos siguen funcionando. ' + R.ficticio() + '</p></section>',
      despues: function () { simular('alb-nuevo', 'Nueva transferencia', 'Se registran comprador, vendedor, inmueble, derechos transferidos, fecha, valor y documentos.'); }
    };
  };
  R.vistas['ALB-02'] = function (ctx) {
    var pactado = 20000000, autoav = 18240000, base = Math.max(pactado, autoav), noAf = 10 * UIT, afecta = base - noAf, imp = Math.round(afecta * 3 / 100);
    return {
      subtitulo: 'TRF-2027-0011 · comprador Jorge Prueba Salazar · Jr. Los Ejemplos 512',
      acciones: acc(R.btn(ctx, 'Emitir liquidación', { tipo: 'primario', id: 'alb-emitir' })),
      contenido: porConfirmar('PE-184', 'Falta acreditar el FIM y la competencia provincial.') +
        '<div class="rejilla-2"><section class="panel"><h2>Cálculo</h2>' + calc([
          ['Valor pactado en la compraventa', F.moneda(pactado)], ['Autoavalúo ajustado (ejemplo)', F.moneda(autoav)], ['Base: el mayor de los dos', F.moneda(base)],
          ['Tramo no afecto: 10 UIT ' + R.pend('PE-046'), '−' + F.moneda(noAf)], ['Base afecta', F.moneda(afecta)], ['Impuesto: 3 %', F.moneda(imp), true]]) +
        '<p class="micro" style="margin-top:var(--s-2)">Ley de Tributación Municipal, arts. 21 a 29. Lo paga el comprador. ' + R.ficticio() + '</p></section>' +
        '<section class="panel"><h2>Después del pago</h2><p class="pequeno">Con el pago confirmado se emite la constancia y se avisa a Predios para actualizar al nuevo titular. Si el comprador vuelve a presentar la misma transferencia, no se cobra dos veces.</p></section></div>',
      despues: function () { simular('alb-emitir', 'Demostración', 'En el sistema se emitiría la liquidación de alcabala. En este módulo por confirmar no se emite.'); }
    };
  };

  /* ======================= Apuestas y juegos ======================= */
  R.vistas['APU-01'] = function (ctx) {
    var ingreso = 12000000, premios = 8400000, base = ingreso - premios, imp = Math.round(base * 20 / 100);
    return {
      subtitulo: 'El organizador presenta una declaración mensual. La modalidad define la base, la tasa y qué municipalidad cobra.',
      acciones: acc(R.btn(ctx, 'Registrar declaración', { tipo: 'primario', id: 'apu-nueva' })),
      contenido: porConfirmar('PE-185', 'Falta confirmar qué modalidades existen en la provincia.') +
        '<div class="rejilla-2"><section class="panel"><h2>Declaración de febrero 2027 · Organizador de ejemplo</h2>' + calc([
          ['Modalidad', 'Apuestas'], ['Ingresos del mes', F.moneda(ingreso)], ['Premios pagados', '−' + F.moneda(premios)], ['Base del mes', F.moneda(base)], ['Tasa para apuestas', '20 %'], ['Impuesto del mes', F.moneda(imp), true]]) +
        '<p class="micro" style="margin-top:var(--s-2)">Tasas: Ley de Tributación Municipal, art. 42 (apuestas 20 %, hípicas 12 %). La forma de calcular la base por modalidad se confirma con Jurídica. ' + R.ficticio() + '</p></section>' +
        '<section class="panel"><h2>Quién cobra</h2><ul class="lista-simple pequeno"><li>Apuestas: la provincia donde está la sede del organizador, que luego distribuye según la ley.</li><li>Juegos: el distrito o la provincia, según la modalidad.</li><li>Casinos y juegos a distancia tienen un régimen especial y no se cobran aquí.</li></ul></section></div>',
      despues: function () { simular('apu-nueva', 'Nueva declaración', 'Se registra la modalidad, el periodo, los ingresos y los premios, con su sustento.'); }
    };
  };

  /* ======================= Portal del contribuyente (vista del ciudadano) ======================= */
  function marcoPortal(cuerpo) {
    return '<div class="portal"><div class="portal__barra">' + R.icono('monitor') + ' <strong>Portal del contribuyente</strong> <span class="micro">· así lo vería el ciudadano en su celular o computadora</span></div><div class="portal__cuerpo">' + cuerpo + '</div></div>';
  }
  R.vistas['WEB-01'] = function (ctx) {
    var c = R.datos.contribuyente('CTB-000101'), obl = R.datos.obligacionesDe('CTB-000101').map(function (o) { return { o: o, s: R.datos.saldo(o) }; }).filter(function (f) { return f.s.total > 0; });
    var tot = obl.reduce(function (a, f) { return a + f.s.total; }, 0);
    return {
      subtitulo: 'El contribuyente entra con su cuenta y solo ve su propia deuda o la de quien representa.',
      acciones: acc('<a class="btn btn--primario" href="#/alc-portal/pago">Ir al pago en línea</a>'),
      contenido: porConfirmar('PE-186', 'Falta definir la identidad ciudadana y el proveedor de pagos.') +
        marcoPortal('<p>Hola, <strong>' + esc(c.nombres) + '</strong>. Esto debes al ' + F.fecha(R.config.fechaCorte) + ':</p><div class="kpi" style="max-width:20rem"><div class="kpi__etiqueta">Deuda total (incluye cuotas por vencer)</div><div class="kpi__valor">' + F.moneda(tot) + '</div><div class="kpi__contexto">' + R.ficticio() + '</div></div>' +
          '<table style="margin-top:var(--s-4)"><thead><tr><th scope="col">Concepto</th><th scope="col">Vence</th><th scope="col" class="num">Monto</th></tr></thead><tbody>' +
          obl.map(function (f) { return fila([esc(f.o.tributo + ' ' + f.o.anio + ' · ' + f.o.periodo), F.fecha(f.o.vence), n(F.moneda(f.s.total))]); }).join('') + '</tbody></table>' +
          '<p class="micro" style="margin-top:var(--s-3)">El monto oficial es el de este estado de cuenta. Si tienes dudas, acércate a la Municipalidad.</p>')
    };
  };
  R.vistas['WEB-02'] = function (ctx) {
    return {
      subtitulo: 'El pago se confirma solo cuando el banco o el proveedor avisa al sistema; volver a la página no basta.',
      acciones: acc(''),
      contenido: porConfirmar('PE-186', 'Falta el proveedor de pagos y su convenio.') +
        marcoPortal('<h3>Pagar en línea</h3><div class="form-rejilla">' + R.campo({ id: 'w-conc', label: 'Qué vas a pagar', opciones: ['Impuesto predial 2027 · cuota 1 · ' + F.moneda(6784)] }) +
          R.campo({ id: 'w-medio', label: 'Medio de pago', opciones: ['Tarjeta de débito o crédito', 'Banca por internet'] }) + '</div>' +
          '<p style="margin-top:var(--s-3)"><button type="button" class="btn btn--primario" id="w-pagar">Pagar ' + F.moneda(6784) + '</button></p><div id="w-res" aria-live="polite"></div>'),
      despues: function () {
        $('#w-pagar').addEventListener('click', function () {
          var b = $('#w-pagar'); b.disabled = true;
          $('#w-res').innerHTML = R.aviso('alerta', 'Pago en verificación', 'Estamos esperando la confirmación del banco. No vuelvas a pagar.');
          setTimeout(function () { $('#w-res').innerHTML = R.aviso('exito', 'Pago confirmado', 'El banco confirmó el pago. Recibo R-WEB-0000412 (ejemplo). <a href="#/alc-portal/constancias">Ver constancias</a>'); }, 1200);
        });
      }
    };
  };
  R.vistas['WEB-03'] = function (ctx) {
    return {
      subtitulo: 'El contribuyente puede descargar su constancia de no adeudo cuando no tiene deudas, o solicitar la prescripción.',
      acciones: acc(''),
      contenido: porConfirmar('PE-186', 'Falta confirmar qué constancias se emitirán en línea.') +
        marcoPortal('<h3>Constancias</h3><div class="rejilla-2"><div class="panel panel--plano"><h4>Constancia de no adeudo</h4>' + R.aviso('alerta', 'Aún no puedes descargarla', 'Tienes deudas pendientes. Cuando las pagues, podrás descargarla aquí.') + '</div>' +
          '<div class="panel panel--plano"><h4>Solicitud de prescripción</h4><p class="pequeno">Puedes presentar tu solicitud en línea. La Municipalidad la evalúa y te responde; la prescripción no es automática.</p><button type="button" class="btn" id="w-presc">Presentar solicitud</button><div id="w-presc-res"></div></div></div>'),
      despues: function () { $('#w-presc').addEventListener('click', function () { $('#w-presc-res').innerHTML = R.aviso('exito', 'Solicitud presentada', 'Número EXP-WEB-2027-0019 (ejemplo). Te avisaremos cuando se resuelva.'); }); }
    };
  };
})(window.RENTAS = window.RENTAS || {});
