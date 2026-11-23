/* =====================================================================
   DATOS DE EJEMPLO — personas, predios, declaraciones y deudas FICTICIAS.
   Nombres con «Prueba», «Demo» o «Ejemplo»; DNI 99000101–99000199;
   RUC 2099999xxxx. Montos en CÉNTIMOS enteros. No son datos reales.
   ===================================================================== */
(function (R) {
  R.datos = {};

  /* ---------- Contribuyentes ---------- */
  R.datos.contribuyentes = [
    { codigo: 'CTB-000101', tipo: 'Natural', doc: 'DNI', num: '99000101', nombre: 'Ana Prueba Quispe', nombres: 'Ana', apPat: 'Prueba', apMat: 'Quispe',
      domicilio: 'Jr. Los Ejemplos 145, Sector Centro', distrito: 'Bagua Grande', celular: '999 000 101', correo: 'ana.prueba@ejemplo.pe',
      alta: '2012-04-10', estado: 'Activo', conyuge: 'Raúl Demo Torres (DNI 99000131)',
      historial: [['2012-04-10', 'Alta en el padrón', 'Registro inicial'], ['2019-08-02', 'Cambio de domicilio', 'De Calle Prueba 33 a Jr. Los Ejemplos 145'], ['2024-03-15', 'Actualización de contacto', 'Celular y correo']] },
    { codigo: 'CTB-000117', tipo: 'Natural', doc: 'DNI', num: '99000117', nombre: 'Ana Prueba Quispe', nombres: 'Ana', apPat: 'Prueba', apMat: 'Quispe',
      domicilio: 'Av. Demostración 820, Sector Norte', distrito: 'Bagua Grande', celular: '999 000 117', correo: '', alta: '2016-01-22', estado: 'Activo',
      nota: 'Homónimo: otra persona con el mismo nombre y distinto documento.', historial: [['2016-01-22', 'Alta en el padrón', 'Registro inicial']] },
    { codigo: 'CTB-000140', tipo: 'Natural', doc: 'Sin documento', num: '—', nombre: 'Ana Prueva Quispe', nombres: 'Ana', apPat: 'Prueva', apMat: 'Quispe',
      domicilio: 'Jr. Los Ejemplos 145, Sector Centro', distrito: 'Bagua Grande', celular: '', correo: '', alta: '2009-06-30', estado: 'Activo',
      nota: 'Registro antiguo, posible duplicado de CTB-000101.', historial: [['2009-06-30', 'Alta en el padrón', 'Registro del sistema anterior']] },
    { codigo: 'CTB-000102', tipo: 'Natural', doc: 'DNI', num: '99000102', nombre: 'Luis Demo Rojas', nombres: 'Luis', apPat: 'Demo', apMat: 'Rojas',
      domicilio: 'Calle Prueba 33, Sector Sur', distrito: 'Bagua Grande', celular: '999 000 102', correo: '', alta: '2010-02-11', estado: 'Activo', historial: [] },
    { codigo: 'CTB-000103', tipo: 'Jurídica', doc: 'RUC', num: '20999999011', nombre: 'Comercial Ejemplo S.A.C.', razon: 'Comercial Ejemplo S.A.C.',
      domicilio: 'Av. Demostración 1200, Sector Centro', distrito: 'Bagua Grande', celular: '999 000 103', correo: 'contacto@comercial-ejemplo.pe', alta: '2015-09-01', estado: 'Activo',
      representante: 'Jorge Prueba Salazar (DNI 99000105), gerente general, poder vigente hasta 31/12/2027', historial: [] },
    { codigo: 'CTB-000104', tipo: 'Natural', doc: 'DNI', num: '99000104', nombre: 'Rosa Ejemplo Vargas', nombres: 'Rosa', apPat: 'Ejemplo', apMat: 'Vargas',
      domicilio: 'Pje. Muestra 12, Sector Norte', distrito: 'Bagua Grande', celular: '', correo: '', alta: '2018-05-14', estado: 'Activo', historial: [] },
    { codigo: 'CTB-000105', tipo: 'Natural', doc: 'DNI', num: '99000105', nombre: 'Jorge Prueba Salazar', nombres: 'Jorge', apPat: 'Prueba', apMat: 'Salazar',
      domicilio: 'Jr. Los Ejemplos 300, Sector Centro', distrito: 'Bagua Grande', celular: '999 000 105', correo: '', alta: '2014-07-07', estado: 'Activo', historial: [] },
    { codigo: 'CTB-000106', tipo: 'Natural', doc: 'DNI', num: '99000106', nombre: 'Marta Demo Torres', nombres: 'Marta', apPat: 'Demo', apMat: 'Torres',
      domicilio: 'Calle Prueba 87, Sector Sur', distrito: 'Bagua Grande', celular: '999 000 106', correo: '', alta: '2008-03-03', estado: 'Activo',
      nota: 'Solicitó beneficio de pensionista.', historial: [] },
    { codigo: 'CTB-000107', tipo: 'Natural', doc: 'Carné de extranjería', num: '990001070', nombre: 'Pedro Ejemplo Chávez', nombres: 'Pedro', apPat: 'Ejemplo', apMat: 'Chávez',
      domicilio: 'Av. Demostración 455, Sector Norte', distrito: 'Bagua Grande', celular: '', correo: '', alta: '2021-11-19', estado: 'Activo', historial: [] },
    { codigo: 'CTB-000108', tipo: 'Jurídica', doc: 'RUC', num: '20999999022', nombre: 'Asociación de Vivienda Ejemplo', razon: 'Asociación de Vivienda Ejemplo',
      domicilio: 'Mz. A Lt. 1, Sector Ejemplo Alto', distrito: 'Bagua Grande', celular: '', correo: '', alta: '2017-02-28', estado: 'Activo', historial: [] },
    { codigo: 'CTB-000109', tipo: 'Natural', doc: 'DNI', num: '99000109', nombre: 'Sucesión Prueba Díaz', nombres: 'Sucesión', apPat: 'Prueba', apMat: 'Díaz',
      domicilio: 'Jr. Los Ejemplos 512, Sector Centro', distrito: 'Bagua Grande', celular: '', correo: '', alta: '2005-10-10', estado: 'Activo', historial: [] }
  ];

  /* ---------- Predios ---------- */
  R.datos.predios = [
    { codigo: 'PRD-000201', titular: 'CTB-000101', direccion: 'Jr. Los Ejemplos 145', sector: 'Sector Centro', tipo: 'Urbano', clase: 'Casa independiente',
      uso: 'Vivienda', estadoPredio: 'Terminado', condicion: 'Sociedad conyugal', participacion: 100, areaTerreno: 160, areaComun: 0, areaConstruida: 210, frente: 8,
      adquisicion: '2012-03-20', parque: 'No', valTerreno: 2400000, valEdif: 2830000, valInst: 0, autoavaluo: 5230000,
      pisos: [
        { nivel: '1', clasif: 'Casa habitación', material: 'Concreto', estado: 'Bueno', cat: 'C · C · D · E · E · E · F', anio: 2012, area: 120, valor: 1780000 },
        { nivel: '2', clasif: 'Casa habitación', material: 'Concreto', estado: 'Bueno', cat: 'C · D · D · E · E · F · F', anio: 2018, area: 90, valor: 1050000 }],
      instalaciones: [], version: 3 },
    { codigo: 'PRD-000202', titular: 'CTB-000101', direccion: 'Av. Demostración 640', sector: 'Sector Norte', tipo: 'Urbano', clase: 'Local comercial',
      uso: 'Comercio', estadoPredio: 'Terminado', condicion: 'Condominio', participacion: 50, areaTerreno: 200, areaComun: 0, areaConstruida: 180, frente: 10,
      adquisicion: '2020-07-15', parque: 'Frente a parque', valTerreno: 3800000, valEdif: 5340000, valInst: 400000, autoavaluo: 9540000, valorParte: 4770000,
      pisos: [{ nivel: '1', clasif: 'Comercio', material: 'Concreto', estado: 'Muy bueno', cat: 'B · C · C · D · D · E · E', anio: 2020, area: 180, valor: 5340000 }],
      instalaciones: [{ tipo: 'Cerco perimétrico', medida: '40 m', anio: 2020, valor: 250000 }, { tipo: 'Tanque elevado', medida: '5 m³', anio: 2020, valor: 150000 }],
      copropietarios: [{ codigo: 'CTB-000105', nombre: 'Jorge Prueba Salazar', participacion: 50 }], version: 2 }
  ];
  /* Titularidad del PRD-000202 */
  R.datos.titularidad = {
    'PRD-000201': [
      { codigo: 'CTB-000101', nombre: 'Ana Prueba Quispe', condicion: 'Sociedad conyugal', participacion: 100, desde: '2012-03-20', hasta: '', documento: 'Escritura de compraventa (ejemplo)' }],
    'PRD-000202': [
      { codigo: 'CTB-000101', nombre: 'Ana Prueba Quispe', condicion: 'Condominio', participacion: 50, desde: '2020-07-15', hasta: '', documento: 'Escritura de compraventa (ejemplo)' },
      { codigo: 'CTB-000105', nombre: 'Jorge Prueba Salazar', condicion: 'Condominio', participacion: 50, desde: '2020-07-15', hasta: '', documento: 'Escritura de compraventa (ejemplo)' }]
  };

  /* ---------- Declaraciones juradas ---------- */
  R.datos.djs = [
    { numero: 'DJ-2027-000318', anio: 2027, contribuyente: 'CTB-000101', motivo: 'Actualización anual', fecha: '2027-02-10', estado: 'Presentada', version: 1, predios: 2, base: 10000000 },
    { numero: 'DJ-2026-000977', anio: 2026, contribuyente: 'CTB-000101', motivo: 'Modificación (ampliación 2.º piso)', fecha: '2026-06-18', estado: 'Rectificada', version: 2, predios: 2, base: 9620000 },
    { numero: 'DJ-2025-000412', anio: 2025, contribuyente: 'CTB-000101', motivo: 'Actualización anual', fecha: '2025-02-21', estado: 'Presentada', version: 1, predios: 2, base: 8950000 },
    { numero: 'DJ-2027-000402', anio: 2027, contribuyente: 'CTB-000101', motivo: 'Alta de predio', fecha: '2027-03-14', estado: 'Borrador', version: 1, predios: 1, base: 0 }
  ];
  /* Comparación de versiones de la DJ-2026-000977 */
  R.datos.versionesDj = [
    ['Predio Jr. Los Ejemplos 145 · área construida', '120 m²', '210 m²'],
    ['Predio Jr. Los Ejemplos 145 · pisos', '1 piso', '2 pisos'],
    ['Predio Jr. Los Ejemplos 145 · valor de edificación', 'S/ 17,800.00', 'S/ 28,300.00'],
    ['Base imponible total', 'S/ 85,700.00', 'S/ 96,200.00']
  ];

  /* ---------- Cuenta corriente de CTB-000101 ----------
     estado: pendiente | parcial | pagado ; situacion: ordinaria | valor | reclamada | coactiva | fraccionada
     interes: se calcula con tasa de ejemplo (por confirmar). */
  R.datos.obligaciones = [
    { id: 'OB-27-P1', contribuyente: 'CTB-000101', tributo: 'Impuesto predial', anio: 2027, periodo: 'Cuota 1', vence: '2027-02-26', principal: 6750, reajuste: 0, pagado: 0, multa: 0, situacion: 'ordinaria' },
    { id: 'OB-27-P2', contribuyente: 'CTB-000101', tributo: 'Impuesto predial', anio: 2027, periodo: 'Cuota 2', vence: '2027-05-31', principal: 6750, reajuste: 0, pagado: 0, multa: 0, situacion: 'ordinaria' },
    { id: 'OB-27-P3', contribuyente: 'CTB-000101', tributo: 'Impuesto predial', anio: 2027, periodo: 'Cuota 3', vence: '2027-08-31', principal: 6750, reajuste: 0, pagado: 0, multa: 0, situacion: 'ordinaria' },
    { id: 'OB-27-P4', contribuyente: 'CTB-000101', tributo: 'Impuesto predial', anio: 2027, periodo: 'Cuota 4', vence: '2027-11-30', principal: 6750, reajuste: 0, pagado: 0, multa: 0, situacion: 'ordinaria' },
    { id: 'OB-27-A1', contribuyente: 'CTB-000101', tributo: 'Arbitrios', anio: 2027, periodo: '1.er trimestre', vence: '2027-02-26', principal: 8400, reajuste: 0, pagado: 0, multa: 0, situacion: 'ordinaria' },
    { id: 'OB-26-P4', contribuyente: 'CTB-000101', tributo: 'Impuesto predial', anio: 2026, periodo: 'Cuota 4', vence: '2026-11-30', principal: 6450, reajuste: 85, pagado: 3000, multa: 0, situacion: 'valor', valor: 'Orden de Pago OP-2027-000155 (notificada el 20/01/2027)' },
    { id: 'OB-26-A3', contribuyente: 'CTB-000101', tributo: 'Arbitrios', anio: 2026, periodo: '3.er trimestre', vence: '2026-08-31', principal: 8100, reajuste: 0, pagado: 0, multa: 0, situacion: 'reclamada', valor: 'Reclamo en trámite (expediente EXP-2026-004512)' },
    { id: 'OB-26-A4', contribuyente: 'CTB-000101', tributo: 'Arbitrios', anio: 2026, periodo: '4.º trimestre', vence: '2026-11-30', principal: 8100, reajuste: 0, pagado: 0, multa: 0, situacion: 'ordinaria' },
    { id: 'OB-25-MT', contribuyente: 'CTB-000101', tributo: 'Multa tributaria', anio: 2025, periodo: 'DJ fuera de plazo', vence: '2025-09-15', principal: 0, reajuste: 0, pagado: 0, multa: 13750, situacion: 'valor', sinInteres: true, valor: 'Resolución de Multa RM-2025-000088 (notificada)' },
    { id: 'OB-25-P1', contribuyente: 'CTB-000101', tributo: 'Impuesto predial', anio: 2025, periodo: 'Cuotas 1 a 4', vence: '2025-11-28', principal: 24800, reajuste: 310, pagado: 25110, multa: 0, situacion: 'ordinaria', migrada: true },
    /* Luis Demo Rojas: deuda en coactivo (para el flujo de coactivo) */
    { id: 'OB-24-L1', contribuyente: 'CTB-000102', tributo: 'Impuesto predial', anio: 2024, periodo: 'Cuotas 1 a 4', vence: '2024-11-29', principal: 51200, reajuste: 640, pagado: 0, multa: 0, situacion: 'coactiva', valor: 'Expediente coactivo EC-2025-000231', costas: 4500 }
  ];

  R.datos.pagos = [
    { recibo: 'R-001-0004512', fecha: '2025-05-30', caja: 'Caja 1', monto: 12550, concepto: 'Predial 2025 cuotas 1 y 2', estado: 'Válido' },
    { recibo: 'R-001-0006120', fecha: '2025-11-28', caja: 'Caja 2', monto: 12560, concepto: 'Predial 2025 cuotas 3 y 4', estado: 'Válido' },
    { recibo: 'R-001-0007733', fecha: '2027-02-02', caja: 'Caja 1', monto: 3000, concepto: 'Pago a cuenta predial 2026 cuota 4', estado: 'Válido' },
    { recibo: 'R-002-0000981', fecha: '2026-03-12', caja: 'Caja 2', monto: 8400, concepto: 'Arbitrios 2026 1.er trimestre', estado: 'Extornado', nota: 'Extorno aprobado el 12/03/2026 por cobro a contribuyente equivocado' }
  ];

  R.datos.expedientes = [
    { numero: 'EXP-2026-004512', tipo: 'Reclamo', asunto: 'Arbitrios 2026, 3.er trimestre', fecha: '2026-09-20', estado: 'En evaluación', plazo: '2027-04-30' },
    { numero: 'EXP-2027-000210', tipo: 'Beneficio', asunto: 'Solicitud de deducción (pensionista) — cónyuge', fecha: '2027-01-15', estado: 'Observado', plazo: '2027-03-30' }
  ];

  /* Movimientos de la obligación OB-26-P4 (para la pantalla de movimientos) */
  R.datos.movimientos = {
    'OB-26-P4': [
      ['2026-02-20', 'Cargo', 'Determinación predial 2026', 'Principal', 6450, 0],
      ['2026-11-30', 'Cargo', 'Reajuste de la cuota 4', 'Reajuste', 85, 0],
      ['2027-01-20', 'Acto', 'Orden de Pago OP-2027-000155 notificada', '—', 0, 0],
      ['2027-02-02', 'Abono', 'Pago a cuenta · recibo R-001-0007733', 'Principal', 0, 3000]
    ],
    'OB-26-A3': [
      ['2026-02-20', 'Cargo', 'Emisión de arbitrios 2026', 'Principal', 8100, 0],
      ['2026-09-20', 'Acto', 'Reclamo presentado (EXP-2026-004512): cobranza suspendida', '—', 0, 0]
    ]
  };

  /* Beneficios y campañas */
  R.datos.beneficios = [
    { numero: 'BEN-2027-0012', contribuyente: 'CTB-000106', nombre: 'Marta Demo Torres', tipo: 'Deducción de 50 UIT (pensionista)', fecha: '2027-01-08', estado: 'Aprobado', resolucion: 'RG-2027-0034 (ejemplo)' },
    { numero: 'BEN-2027-0019', contribuyente: 'CTB-000101', nombre: 'Ana Prueba Quispe', tipo: 'Deducción de 50 UIT (pensionista) — cónyuge', fecha: '2027-01-15', estado: 'Observado', resolucion: '—', obs: 'Falta constancia de pensión vigente' },
    { numero: 'BEN-2027-0023', contribuyente: 'CTB-000104', nombre: 'Rosa Ejemplo Vargas', tipo: 'Deducción de 50 UIT (pensionista)', fecha: '2027-02-27', estado: 'En evaluación', resolucion: '—' }
  ];

  /* Lote de emisión masiva (ejemplo) */
  R.datos.lote = { numero: 'LOTE-EM-2027-01', ejercicio: 2027, contribuyentes: 4812, predios: 6230, ok: 4790, observados: 22, estado: 'Preparado para revisión',
    errores: [['CTB-000140', 'Ana Prueva Quispe', 'Posible duplicado sin resolver'], ['CTB-000877', 'Contribuyente Demo 877', 'Predio sin valor de terreno'], ['CTB-001204', 'Contribuyente Demo 1204', 'Copropiedad suma 120 %']] };

  /* Arbitrios: servicios del régimen (estructura de ejemplo) */
  R.datos.arbitrios = [
    { servicio: 'Limpieza pública', criterio: 'Uso del predio y tamaño (m²)', zona: 'Zona urbana', periodicidad: 'Trimestral', ejemplo: 4200 },
    { servicio: 'Parques y jardines', criterio: 'Cercanía a áreas verdes', zona: 'Zona urbana', periodicidad: 'Trimestral', ejemplo: 1500 },
    { servicio: 'Serenazgo', criterio: 'Uso del predio y zona', zona: 'Zona urbana', periodicidad: 'Trimestral', ejemplo: 2700 }
  ];

  /* ---------- Caja (sesión de demostración abierta) ---------- */
  R.datos.caja = {
    cajas: ['Caja 1 · Sede central', 'Caja 2 · Sede central', 'Caja 3 · Agencia (ejemplo)'],
    medios: ['Efectivo', 'Tarjeta de débito o crédito', 'Transferencia o depósito'],
    sesion: { numero: 'SES-2027-0312', caja: 'Caja 1 · Sede central', cajero: 'usr.demo.cajero', abierta: '08:02', fondo: 20000, estado: 'Abierta' },
    siguienteRecibo: 7801,
    operaciones: [
      { recibo: 'R-001-0007790', hora: '08:15', contribuyente: 'Jorge Prueba Salazar', concepto: 'Predial 2027 cuota 1', medio: 'Efectivo', monto: 4520, estado: 'Válido' },
      { recibo: 'R-001-0007791', hora: '08:40', contribuyente: 'Comercial Ejemplo S.A.C.', concepto: 'Arbitrios 2027 1.er trimestre', medio: 'Tarjeta de débito o crédito', monto: 16800, estado: 'Válido' },
      { recibo: 'R-001-0007792', hora: '09:05', contribuyente: 'Rosa Ejemplo Vargas', concepto: 'Fraccionamiento CV-2026-000120 cuota 4', medio: 'Efectivo', monto: 12150, estado: 'Válido' },
      { recibo: 'R-001-0007793', hora: '09:22', contribuyente: 'Pedro Ejemplo Chávez', concepto: 'Constancia de no adeudo', medio: 'Efectivo', monto: 1500, estado: 'Válido' },
      { recibo: 'R-001-0007794', hora: '09:48', contribuyente: 'Marta Demo Torres', concepto: 'Predial 2027 cuota 1', medio: 'Transferencia o depósito', monto: 3200, estado: 'Válido' }
    ],
    solicitudesExtorno: [
      { id: 'EXT-2027-0009', recibo: 'R-001-0007794', contribuyente: 'Marta Demo Torres', monto: 3200, motivo: 'Se cobró a la contribuyente equivocada: el pago era de otra persona con el mismo apellido.', solicitante: 'usr.demo.cajero', perfilSolicitante: 'cajero', hora: '10:05', estado: 'Pendiente de aprobación' }
    ],
    otrosIngresos: [
      ['Constancia de no adeudo', 1500], ['Duplicado de declaración jurada', 1000], ['Copia certificada de documento', 800]
    ]
  };

  /* ---------- Valores (OP / RD / RM) ---------- */
  R.datos.valores = [
    { numero: 'OP-2027-000155', tipo: 'Orden de Pago', contribuyente: 'CTB-000101', nombre: 'Ana Prueba Quispe', emision: '2027-01-12', importe: 6535, estado: 'Notificado', notificado: '2027-01-20', obligaciones: ['OB-26-P4'] },
    { numero: 'RM-2025-000088', tipo: 'Resolución de Multa', contribuyente: 'CTB-000101', nombre: 'Ana Prueba Quispe', emision: '2025-10-02', importe: 13750, estado: 'Notificado', notificado: '2025-10-09', obligaciones: ['OB-25-MT'] },
    { numero: 'OP-2025-000901', tipo: 'Orden de Pago', contribuyente: 'CTB-000102', nombre: 'Luis Demo Rojas', emision: '2025-01-20', importe: 51840, estado: 'En coactivo', notificado: '2025-01-28', obligaciones: ['OB-24-L1'] },
    { numero: 'OP-2027-000171', tipo: 'Orden de Pago', contribuyente: 'CTB-000104', nombre: 'Rosa Ejemplo Vargas', emision: '2027-02-15', importe: 9120, estado: 'Emitido', notificado: '', obligaciones: [] },
    { numero: 'RD-2027-000012', tipo: 'Resolución de Determinación', contribuyente: 'CTB-000103', nombre: 'Comercial Ejemplo S.A.C.', emision: '2027-02-03', importe: 48600, estado: 'Reclamado', notificado: '2027-02-08', obligaciones: [] }
  ];
  R.datos.lotesValores = [
    { numero: 'LV-2027-003', tipo: 'Orden de Pago', criterio: 'Predial 2026 cuota 4 impaga', fecha: '2027-01-12', cantidad: 312, importe: 2045300, estado: 'Notificando' },
    { numero: 'LV-2027-004', tipo: 'Orden de Pago', criterio: 'Arbitrios 2026 4.º trimestre impago', fecha: '2027-03-10', cantidad: 488, importe: 3952800, estado: 'En revisión' },
    { numero: 'LV-2026-021', tipo: 'Resolución de Multa', criterio: 'DJ presentada fuera de plazo', fecha: '2026-10-02', cantidad: 57, importe: 783750, estado: 'Emitido' }
  ];
  R.datos.diligencias = {
    'OP-2027-000155': [
      { fecha: '2027-01-18', hora: '10:20', resultado: 'Sin respuesta en el domicilio', recibe: '—', vinculo: '—', doc: '—', notificador: 'Notificador Demo 03', canal: 'Personal en domicilio fiscal' },
      { fecha: '2027-01-20', hora: '16:05', resultado: 'Recibido', recibe: 'Raúl Demo Torres', vinculo: 'Cónyuge', doc: 'DNI 99000131', notificador: 'Notificador Demo 03', canal: 'Personal en domicilio fiscal' }
    ]
  };

  /* ---------- Fraccionamiento ---------- */
  R.datos.fracc = { inicialPct: 20, interesBp: 80, maxCuotas: 12, minCuota: 5000 }; /* EJEMPLO: reglamento por confirmar (PE-090) */
  R.datos.convenios = [
    { numero: 'CV-2026-000120', contribuyente: 'CTB-000104', nombre: 'Rosa Ejemplo Vargas', fecha: '2026-09-15', cuotas: 10, pagadas: 4, vencidas: 2, saldo: 72900, estado: 'Con cuotas vencidas' },
    { numero: 'CV-2026-000098', contribuyente: 'CTB-000105', nombre: 'Jorge Prueba Salazar', fecha: '2026-07-01', cuotas: 6, pagadas: 5, vencidas: 0, saldo: 8400, estado: 'Al día' },
    { numero: 'CV-2025-000301', contribuyente: 'CTB-000107', nombre: 'Pedro Ejemplo Chávez', fecha: '2025-11-20', cuotas: 12, pagadas: 3, vencidas: 4, saldo: 154200, estado: 'Causal de pérdida' },
    { numero: 'PC-2027-000045', contribuyente: 'CTB-000101', nombre: 'Ana Prueba Quispe', fecha: '2027-03-15', cuotas: 6, pagadas: 0, vencidas: 0, saldo: 0, estado: 'Pre-convenio: falta cuota inicial' }
  ];

  /* ---------- Conciliación (banco de ejemplo) ---------- */
  R.datos.conciliacion = [
    { ref: 'R-001-0007791', fecha: '2027-03-15', caja: 16800, banco: 16800, fuente: 'Tarjeta (proveedor de pagos)', estado: 'Conciliado' },
    { ref: 'R-001-0007794', fecha: '2027-03-15', caja: 3200, banco: 3200, fuente: 'Transferencia', estado: 'Conciliado' },
    { ref: 'DEP-2027-0315-01', fecha: '2027-03-15', caja: 18170, banco: 18170, fuente: 'Depósito de efectivo', estado: 'Conciliado' },
    { ref: 'R-002-0001120', fecha: '2027-03-14', caja: 9850, banco: 0, fuente: 'Tarjeta (proveedor de pagos)', estado: 'Pendiente en banco' },
    { ref: 'BCO-778812', fecha: '2027-03-14', caja: 0, banco: 4200, fuente: 'Transferencia sin identificar', estado: 'Sin pago en caja' }
  ];

  /* ---------- Consultas ---------- */
  R.datos.contribuyente = function (c) { return R.datos.contribuyentes.filter(function (x) { return x.codigo === c; })[0]; };
  R.datos.prediosDe = function (c) { return R.datos.predios.filter(function (p) { return p.titular === c || (p.copropietarios || []).some(function (x) { return x.codigo === c; }); }); };
  R.datos.predio = function (c) { return R.datos.predios.filter(function (p) { return p.codigo === c; })[0]; };
  R.datos.obligacionesDe = function (c) { return R.datos.obligaciones.filter(function (o) { return o.contribuyente === c; }); };

  /* Interés ILUSTRATIVO: tasa de ejemplo 0.90 % mensual (la TIM real está por confirmar).
     Aritmética entera: capital(céntimos) × 90 / 10000 / 30 × días. */
  R.datos.TASA_EJEMPLO_BP = 90; /* puntos básicos por mes = 0.90 % */
  R.datos.interes = function (capital, desdeIso, hastaIso) {
    var dias = Math.max(0, Math.round((Date.parse(hastaIso) - Date.parse(desdeIso)) / 86400000));
    return Math.round(capital * R.datos.TASA_EJEMPLO_BP * dias / 300000);
  };
  R.datos.saldo = function (o, fecha) {
    var capital = Math.max(0, o.principal + o.reajuste + o.multa - o.pagado);
    var vencida = (fecha || R.config.fechaCorte) > o.vence;
    var interes = (vencida && capital > 0 && !o.sinInteres) ? R.datos.interes(capital, o.vence, fecha || R.config.fechaCorte) : 0;
    var total = capital + interes + (o.costas || 0);
    var c = R.datos.campana, desc = 0;
    if (c && c.activa && vencida && capital > 0 && o.anio <= c.hastaAnio && o.situacion !== 'coactiva') {
      desc = Math.round(interes * c.pctInteres / 100) + (o.multa > 0 && o.pagado === 0 ? Math.round(o.multa * c.pctMulta / 100) : 0);
    }
    return { capital: capital, interes: interes, costas: o.costas || 0, total: total, descuento: desc, pagar: total - desc, vencida: vencida,
      estado: capital === 0 ? 'pagado' : (o.pagado > 0 ? 'parcial' : 'pendiente') };
  };

  /* Campaña de amnistía de EJEMPLO: porcentajes y fechas por confirmar con la ordenanza (PE-049, PE-060).
     Empieza desactivada; se activa en «Campañas de amnistía» para ver su efecto en el estado de cuenta y en caja. */
  R.datos.campana = { nombre: 'Campaña de regularización 2027 (ejemplo)', activa: false, hastaAnio: 2026, pctInteres: 100, pctMulta: 50,
    inicio: '2027-03-01', fin: '2027-04-30', acumulable: false, conceptos: ['Impuesto predial', 'Arbitrios', 'Multa tributaria'],
    resultados: { contribuyentes: 1240, condonado: 18560000, recaudado: 42310000 } };
})(window.RENTAS = window.RENTAS || {});
