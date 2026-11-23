/* =====================================================================
   DATOS DE EJEMPLO — Gestión y Control + Asistencia inteligente.
   Cifras FICTICIAS (céntimos enteros). Normas citadas: solo las verificadas en docs/02.
   ===================================================================== */
(function (R) {
  var D = R.datos;

  /* ---------- Gerencia ---------- */
  D.recaudacionMensual = [ ['2026-04', 18240000], ['2026-05', 31580000], ['2026-06', 15920000], ['2026-07', 14310000], ['2026-08', 29870000], ['2026-09', 13450000],
    ['2026-10', 12980000], ['2026-11', 27640000], ['2026-12', 16720000], ['2027-01', 14050000], ['2027-02', 38960000], ['2027-03', 17230000] ];
  D.recaudacionTributo = [ ['Impuesto predial', 21450000], ['Arbitrios', 9820000], ['Multas', 1340000], ['Fraccionamiento', 2610000], ['Otros ingresos (TUPA)', 1960000] ];
  D.indicadores = [
    { id: 'recaudado', nombre: 'Recaudación confirmada', valor: 17230000, contexto: 'Marzo 2027 hasta el corte', definicion: 'Pagos confirmados en caja y en línea, menos extornos del periodo. No incluye devoluciones en trámite.' },
    { id: 'conciliado', nombre: 'Importe conciliado', valor: 15980000, contexto: '92.7 % de lo recaudado', definicion: 'Parte de lo recaudado que ya se cruzó con el banco o el proveedor de pagos.' },
    { id: 'cartera', nombre: 'Cartera pendiente al corte', valor: 284500000, contexto: 'Ordinaria + en valor + en coactivo', definicion: 'Saldo exigible y por vencer. Cuenta cada deuda una sola vez, aunque tenga valor o esté en coactivo.' },
    { id: 'expedientes', nombre: 'Expedientes con actuación pendiente', valor: null, numero: 37, contexto: 'Reclamos, coactivo y fiscalización', definicion: 'Expedientes con un plazo o una tarea pendiente a la fecha de corte.' }
  ];

  /* ---------- Reportes ---------- */
  D.reportes = [
    ['Parte diario por cajero', 'Caja', 'Operaciones de cada cajero en el día, por medio de pago'], ['Parte diario por partida presupuestal', 'Caja', 'Recaudación del día agrupada por partida'],
    ['Resumen por partida y rango de fechas', 'Caja', 'Totales por partida entre dos fechas'], ['Recaudación por tributo y periodo', 'Recaudación', 'Lo cobrado por concepto, año de deuda y mes de pago'],
    ['Cartera por situación', 'Cartera', 'Deuda ordinaria, en valor y en coactivo, sin duplicar'], ['Contribuyentes con mayor deuda', 'Cartera', 'Ranking por saldo al corte'],
    ['Valores emitidos y notificados', 'Cobranza', 'Seguimiento de lotes de valores'], ['Convenios de fraccionamiento', 'Cobranza', 'Convenios vigentes, al día y con cuotas vencidas']
  ];
  D.saldosPorCobrar = [ /* concepto, inicial, altas, bajas, ingresos, descargos, fraccionado, final */
    ['Impuesto predial', 182400000, 96500000, 1800000, 64200000, 2100000, 6300000, 204500000],
    ['Arbitrios', 74300000, 41200000, 900000, 28400000, 800000, 2900000, 82500000],
    ['Multas tributarias', 12600000, 3400000, 200000, 1900000, 300000, 600000, 13000000],
    ['Sanciones administrativas', 8900000, 2700000, 0, 1500000, 400000, 0, 9700000]
  ];

  /* ---------- Maestros y parámetros ---------- */
  D.normas = [
    { id: 'N01', nombre: 'TUO de la Ley de Tributación Municipal (DS 156-2004-EF)', tipo: 'Nacional', vigencia: 'Vigente (con modificaciones)', estado: 'Verificado', articulos: 'Arts. 8–59 citados' },
    { id: 'N02', nombre: 'TUO del Código Tributario (DS 133-2013-EF)', tipo: 'Nacional', vigencia: 'Vigente (con modificaciones)', estado: 'Verificado', articulos: 'Arts. 28–181 citados' },
    { id: 'N07', nombre: 'Ley 32678 (incorpora arts. 33-C a 33-E a la Ley 26979)', tipo: 'Nacional', vigencia: 'Publicada el 25/06/2026', estado: 'Verificado', articulos: 'Artículo único' },
    { id: 'N11', nombre: 'DS 301-2025-EF · UIT 2026', tipo: 'Nacional', vigencia: 'Ejercicio 2026', estado: 'Verificado', articulos: 'Art. 1' },
    { id: 'L01', nombre: 'Ordenanza de arbitrios 2024 (OM 19-2023-MPU/BG)', tipo: 'Local', vigencia: 'Ejercicio 2024', estado: 'Local histórico', articulos: 'Arts. 1, 3 y 5' },
    { id: 'L04', nombre: 'Ordenanza de beneficios 2026 (OM 03-2026-MPU/BG)', tipo: 'Local', vigencia: 'Por confirmar', estado: 'Local parcial', articulos: 'Sin texto completo' },
    { id: '—', nombre: 'Ordenanza de arbitrios 2027', tipo: 'Local', vigencia: '—', estado: 'Falta', articulos: '—' },
    { id: '—', nombre: 'Ordenanza de TIM vigente', tipo: 'Local', vigencia: '—', estado: 'Falta', articulos: '—' }
  ];
  D.parametros = [
    { clave: 'UIT_ANUAL', nombre: 'UIT', version: '2026 · v1', valor: 'S/ 5,500.00', fuente: 'DS 301-2025-EF, art. 1', autor: 'usr.demo.operador', revisor: 'usr.demo.supervisor', estado: 'Publicado' },
    { clave: 'TRAMOS_PREDIAL', nombre: 'Tramos del impuesto predial', version: 'v1', valor: '0.2 % · 0.6 % · 1.0 % (15 y 60 UIT)', fuente: 'TUO Tributación Municipal, art. 13', autor: 'usr.demo.operador', revisor: 'usr.demo.supervisor', estado: 'Publicado' },
    { clave: 'UIT_ANUAL', nombre: 'UIT', version: '2027 · v1', valor: '—', fuente: 'Por publicar por el MEF', autor: '—', revisor: '—', estado: 'Sin fuente', pend: 'PE-046' },
    { clave: 'TIM_MUNICIPAL', nombre: 'Tasa de interés moratorio', version: 'borrador', valor: '0.90 % mensual (ejemplo)', fuente: 'Ordenanza por registrar', autor: 'usr.demo.operador', revisor: '—', estado: 'Borrador', pend: 'PE-070' },
    { clave: 'MINIMO_PREDIAL', nombre: 'Monto mínimo del predial', version: '—', valor: '—', fuente: 'Decisión municipal por confirmar', autor: '—', revisor: '—', estado: 'No habilitado', pend: 'PE-041' },
    { clave: 'FRACCIONAMIENTO', nombre: 'Condiciones de fraccionamiento', version: 'borrador', valor: 'Inicial 20 % · 12 cuotas (ejemplo)', fuente: 'Reglamento por registrar', autor: 'usr.demo.operador', revisor: 'usr.demo.supervisor', estado: 'En revisión', pend: 'PE-090' },
    { clave: 'EMISION', nombre: '«Porcentaje adicional por PU»', version: '—', valor: '—', fuente: 'Sin fundamento identificado', autor: '—', revisor: '—', estado: 'No activable', pend: 'PE-044' }
  ];
  D.calendario = [
    ['Impuesto predial 2027', 'Cuota 1 / pago al contado', '2027-02-26', 'Calendario', 'Por confirmar'], ['Impuesto predial 2027', 'Cuota 2', '2027-05-31', 'Calendario', 'Por confirmar'],
    ['Impuesto predial 2027', 'Cuota 3', '2027-08-31', 'Calendario', 'Por confirmar'], ['Impuesto predial 2027', 'Cuota 4', '2027-11-30', 'Calendario', 'Por confirmar'],
    ['Arbitrios 2027', '1.er trimestre', '2027-02-26', 'Calendario', 'Por confirmar'], ['Feriado local', 'Aniversario (ejemplo)', '2027-05-30', 'No laborable', 'Por confirmar']
  ];
  D.catalogos = [ ['Vías', 128, 'Jr. Los Ejemplos, Av. Demostración, Calle Prueba…', 'PE-011'], ['Sectores', 6, 'Centro, Norte, Sur, Ejemplo Alto…', 'PE-011'], ['Usos del predio', 9, 'Vivienda, Comercio, Industria…', 'PE-020'],
    ['Condición de propiedad', 6, 'Propietario único, Sociedad conyugal, Condominio…', 'PE-020'], ['Motivos de declaración', 5, 'Alta, Baja, Modificación, Actualización…', 'PE-031'], ['Tarifario de ingresos', 42, 'Constancia de no adeudo, Duplicados…', 'PE-102'] ];
  D.importacion = { archivo: 'valores_unitarios_2027.xlsx (ejemplo)', filas: 1260, validas: 1251, errores: [['Fila 214', 'Categoría «H» no existe en la tabla'], ['Fila 377', 'Valor vacío'], ['Fila 902', 'Zona sin código']] };
  D.migracion = [
    { lote: 'MIG-PILOTO-01', origen: 'Padrón de contribuyentes', registros: 5120, cargados: 5004, errores: 116, estado: 'Conciliado con observaciones' },
    { lote: 'MIG-PILOTO-02', origen: 'Predios y declaraciones', registros: 6890, cargados: 6702, errores: 188, estado: 'En revisión' },
    { lote: 'MIG-PILOTO-03', origen: 'Deudas por componente', registros: 41250, cargados: 40990, errores: 260, estado: 'Diferencias por explicar' }
  ];
  D.conciliacionMig = [ ['Principal', 312450000, 312450000], ['Reajuste', 4210000, 4210000], ['Interés', 58900000, 58120000], ['Multas', 12600000, 12600000] ];

  /* ---------- Seguridad ---------- */
  D.usuarios = [
    { usuario: 'usr.demo.operador', nombre: 'Operador Demo 1', rol: 'Operador de Rentas', ambito: 'Cercado', vigencia: 'Hasta 31/12/2027', mfa: 'Sí', estado: 'Activo' },
    { usuario: 'usr.demo.cajero', nombre: 'Cajero Demo 1', rol: 'Cajero', ambito: 'Caja 1 · Sede central', vigencia: 'Hasta 31/12/2027', mfa: 'No requerido', estado: 'Activo' },
    { usuario: 'usr.demo.supervisor', nombre: 'Supervisor Demo 1', rol: 'Supervisor de Rentas', ambito: 'Cercado', vigencia: 'Hasta 31/12/2027', mfa: 'Sí', estado: 'Activo' },
    { usuario: 'usr.demo.ejecutor', nombre: 'Ejecutor Demo 1', rol: 'Ejecutor coactivo', ambito: 'Provincia', vigencia: 'Según designación', mfa: 'Sí', estado: 'Activo' },
    { usuario: 'usr.demo.fiscalizador', nombre: 'Fiscalizador Demo 1', rol: 'Fiscalizador', ambito: 'Casos asignados', vigencia: 'Hasta 30/06/2027', mfa: 'No requerido', estado: 'Activo' },
    { usuario: 'usr.demo.cajero3', nombre: 'Cajero Demo 3', rol: 'Cajero', ambito: 'Caja 3 · Agencia', vigencia: 'Venció el 28/02/2027', mfa: 'No requerido', estado: 'Revocado' }
  ];
  D.matrizPermisos = { /* permiso: perfiles */
    'Registrar contribuyentes y predios': ['operador', 'supervisor'], 'Emitir determinación': ['operador', 'supervisor'], 'Cobrar en caja': ['cajero', 'supervisor'],
    'Solicitar extorno': ['cajero', 'supervisor'], 'Aprobar extorno': ['supervisor'], 'Publicar parámetros': ['supervisor'], 'Emitir REC y medidas': ['ejecutor'],
    'Ver indicadores': ['gerencia', 'supervisor'], 'Administrar usuarios': ['admin'], 'Atender alertas de control': ['auditor'] };
  D.incompatibles = [['Solicitar extorno', 'Aprobar el mismo extorno'], ['Proponer parámetro', 'Publicar el mismo parámetro'], ['Administrar usuarios', 'Cobrar o emitir actos']];
  D.aprobaciones = [
    { id: 'APR-2027-0141', tipo: 'Extorno', detalle: 'R-001-0007794 · S/ 32.00', solicitante: 'usr.demo.cajero', fecha: '15/03/2027 10:05', destino: '#/caja/extornos' },
    { id: 'APR-2027-0139', tipo: 'Descargo (compensación)', detalle: 'DES-2027-0013 · S/ 45.20', solicitante: 'usr.demo.operador', fecha: '15/03/2027 09:31', destino: '#/descargos/descargos' },
    { id: 'APR-2027-0137', tipo: 'Parámetro', detalle: 'FRACCIONAMIENTO · borrador', solicitante: 'usr.demo.operador', fecha: '14/03/2027 17:20', destino: '#/maestros/parametros' },
    { id: 'APR-2027-0133', tipo: 'Asignación de rol', detalle: 'usr.demo.cajero4 → Cajero · Caja 2', solicitante: 'usr.demo.admin', fecha: '14/03/2027 11:02', destino: '#/seguridad/usuarios' },
    { id: 'APR-2027-0130', tipo: 'Unión de duplicados', detalle: 'CTB-000140 → CTB-000101', solicitante: 'usr.demo.operador', fecha: '13/03/2027 16:45', destino: '#/contribuyentes/fusionar' }
  ];
  D.auditoria = [
    ['15/03/2027 10:05:12', 'usr.demo.cajero', 'Solicitar extorno', 'pago R-001-0007794', 'corr-3f1a9c02be71', 'Pendiente'],
    ['15/03/2027 09:48:40', 'usr.demo.cajero', 'Confirmar pago', 'pago R-001-0007794', 'corr-a71c55e019d4', 'Correcto'],
    ['15/03/2027 09:31:07', 'usr.demo.operador', 'Solicitar descargo', 'DES-2027-0013', 'corr-0c9e7b2d4f18', 'Pendiente'],
    ['15/03/2027 09:12:55', 'usr.demo.operador', 'Consultar estado de cuenta', 'contribuyente CTB-000101', 'corr-77b2e1a90c3f', 'Correcto'],
    ['15/03/2027 08:59:21', 'usr.demo.fiscalizador', 'Consultar caso no asignado', 'caso FIS-2027-000030', 'corr-5e0d3a8c7b61', 'Denegado'],
    ['15/03/2027 08:02:03', 'usr.demo.cajero', 'Abrir caja', 'sesión SES-2027-0312', 'corr-c41f9a37e2d0', 'Correcto'],
    ['14/03/2027 22:41:18', 'usr.demo.operador', 'Exportar padrón', '5 120 registros', 'corr-91ad0e6b2c57', 'Correcto · alerta generada']
  ];
  D.capacidades = [
    ['Contribuyentes y predios', '2027', 'Cercado', 'Habilitado', ''], ['Impuesto predial (emisión)', '2027', 'Cercado', 'Simulación', 'Faltan aranceles y vencimientos (PE-040, PE-042)'],
    ['Arbitrios (emisión)', '2027', 'Cercado', 'Deshabilitado', 'Falta ordenanza 2027 (PE-050)'], ['Caja y cobranza', '2027', 'Cercado', 'Habilitado', ''],
    ['Fraccionamiento', '2027', 'Cercado', 'Simulación', 'Falta reglamento (PE-090)'], ['Alcabala (emisión provincial)', '2027', 'Provincia', 'Deshabilitado', 'Falta acreditar el FIM (PE-184)'],
    ['Asistente normativo (IA-001)', '—', '—', 'Piloto', 'Infraestructura de modelos por decidir (PE-170)']
  ];

  /* ---------- Asistencia inteligente ---------- */
  D.bandejaCobranza = [
    { nombre: 'Luis Demo Rojas', codigo: 'CTB-000102', monto: 56340, antig: 28, prescr: 'Más de 2 años', situacion: 'En coactivo', distrito: 'Bagua Grande', prioridad: 92, accion: 'Seguimiento coactivo' },
    { nombre: 'Pedro Ejemplo Chávez', codigo: 'CTB-000107', monto: 154200, antig: 16, prescr: 'Más de 2 años', situacion: 'Convenio con 4 cuotas vencidas', distrito: 'Bagua Grande', prioridad: 88, accion: 'Evaluar pérdida del convenio' },
    { nombre: 'Asociación de Vivienda Ejemplo', codigo: 'CTB-000108', monto: 98400, antig: 14, prescr: 'Más de 2 años', situacion: 'Valor notificado', distrito: 'Bagua Grande', prioridad: 81, accion: 'Proponer a coactivo' },
    { nombre: 'Ana Prueba Quispe', codigo: 'CTB-000101', monto: 69804, antig: 6, prescr: 'Más de 2 años', situacion: 'Valor notificado', distrito: 'Bagua Grande', prioridad: 64, accion: 'Recordatorio y visita' },
    { nombre: 'Rosa Ejemplo Vargas', codigo: 'CTB-000104', monto: 72900, antig: 3, prescr: 'Más de 2 años', situacion: 'Convenio con 2 cuotas vencidas', distrito: 'Bagua Grande', prioridad: 58, accion: 'Requerir pago de cuotas' }
  ];
  D.alertasPlazo = [
    { tipo: 'Prescripción', detalle: 'Sucesión Prueba Díaz · Impuesto predial 2022', vence: '2027-01-01 + eventos', estado: 'Sin evidencia de interrupción registrada', nivel: 'error' },
    { tipo: 'Levantamiento', detalle: 'EC-2026-000102 · retención bancaria tras convenio', vence: '16/03/2027 09:10', estado: 'Quedan 23 h', nivel: 'error' },
    { tipo: 'Recurso', detalle: 'EXP-2026-004512 · reclamo de arbitrios', vence: '30/04/2027', estado: 'Plazo para resolver', nivel: 'alerta' },
    { tipo: 'REC', detalle: 'EC-2026-000131 · plazo para pagar de la REC', vence: '22/03/2027', estado: 'Luego se puede evaluar medidas', nivel: 'info' }
  ];
  D.paresDuplicados = [
    { a: 'Ana Prueba Quispe (CTB-000101 · DNI 99000101)', b: 'Ana Prueva Quispe (CTB-000140 · sin documento)', puntaje: 94, evidencias: ['Nombre casi igual (1 letra)', 'Mismo domicilio', 'Mismo predio declarado'] },
    { a: 'Jorge Prueba Salazar (CTB-000105)', b: 'Jorge Prueba Salasar (CTB-000188 · sin documento)', puntaje: 81, evidencias: ['Nombre casi igual', 'Mismo celular'] },
    { a: 'Ana Prueba Quispe (CTB-000101)', b: 'Ana Prueba Quispe (CTB-000117)', puntaje: 22, evidencias: ['Mismo nombre', 'Documentos distintos', 'Domicilios distintos: probable homónimo'] }
  ];
  D.direcciones = [
    { original: 'jr los ejemplos 145 frente al mercado', via: 'Jirón Los Ejemplos', num: '145', ref: 'Frente al mercado', sector: 'Centro', confianza: 'Alta' },
    { original: 'av demostracion cdra 8 s/n', via: 'Avenida Demostración', num: 'S/N (cuadra 8)', ref: '—', sector: 'Norte', confianza: 'Media' },
    { original: 'caserio el ejemplo alto lote 3', via: '— (zona rural)', num: 'Lote 3', ref: 'Caserío El Ejemplo Alto', sector: 'Por confirmar', confianza: 'Baja' }
  ];
  D.atipicos = [
    { nombre: 'Luis Demo Rojas', predio: 'Calle Prueba 33', regla: 'Valor por m² 45 % por debajo de la vía', tipo: 'Estadística por zona (IA-008)', nivel: 'Media' },
    { nombre: 'Rosa Ejemplo Vargas', predio: 'Pje. Muestra 12', regla: 'Licencia de edificación 2025 sin declaración actualizada', tipo: 'Cruce interno (IA-009)', nivel: 'Alta' },
    { nombre: 'Jorge Prueba Salazar', predio: 'Jr. Los Ejemplos 300', regla: 'Área construida bajó 40 % entre versiones sin rectificación', tipo: 'Regla de coherencia (IA-008)', nivel: 'Alta' }
  ];
  /* Asistente normativo: respuestas SOLO desde normas verificadas en docs/02 */
  D.asistente = [
    { p: '¿Cuáles son los tramos del impuesto predial?', r: 'El impuesto se calcula sobre la base imponible total del contribuyente en el distrito, con una escala progresiva: hasta 15 UIT, 0.2 %; más de 15 y hasta 60 UIT, 0.6 %; más de 60 UIT, 1.0 %.', citas: [['TUO de la Ley de Tributación Municipal (DS 156-2004-EF)', 'art. 13', 'Verificado']] },
    { p: '¿Quién paga la alcabala y cuánto?', r: 'La paga el comprador (adquirente) del inmueble. La tasa es 3 % y las primeras 10 UIT del valor no están afectas. La competencia depende del distrito del inmueble.', citas: [['TUO de la Ley de Tributación Municipal', 'arts. 21–29 (tasa y tramo no afecto: arts. 24–26)', 'Verificado']] },
    { p: '¿En cuánto tiempo hay que levantar una retención bancaria si se fracciona la deuda?', r: 'Cuando se cancela la deuda o se aprueba un fraccionamiento y existe una retención bancaria, el ejecutor debe actuar en el plazo de 24 horas en el supuesto previsto por la ley.', citas: [['Ley 32678, que incorpora los arts. 33-C a 33-E a la Ley 26979', 'artículo único', 'Verificado']] },
    { p: '¿Cuál es la tasa de arbitrios 2027?', r: null, citas: [] }
  ];
  D.alertasControl = [
    { id: 'ALC-CI-0031', regla: 'Extorno poco después del cobro', detalle: 'R-001-0007794 extornado 17 min después del cobro', sujeto: 'Caja 1 · usr.demo.cajero', nivel: 'Media', estado: 'Abierta' },
    { id: 'ALC-CI-0029', regla: 'Exportación inusual', detalle: 'Exportación del padrón completo a las 22:41', sujeto: 'usr.demo.operador', nivel: 'Alta', estado: 'Abierta' },
    { id: 'ALC-CI-0027', regla: 'Consulta de expediente no asignado', detalle: 'Intento denegado de abrir FIS-2027-000030', sujeto: 'usr.demo.fiscalizador', nivel: 'Baja', estado: 'Abierta' },
    { id: 'ALC-CI-0022', regla: 'Descargos concentrados', detalle: '3 anulaciones en una semana por el mismo usuario', sujeto: 'usr.demo.operador', nivel: 'Media', estado: 'Cerrada: justificada (campaña de depuración)' }
  ];
  D.capacidadesIA = [
    ['IA-012 Duplicados', 'Calidad del padrón', 'Reglas y similitud', 'Local', 'Activa', 'Precisión ≥ 95 % en pares de puntaje alto'],
    ['IA-013 Direcciones', 'Calidad del padrón', 'Reglas y catálogo', 'Local', 'Activa', '0 errores de distrito aceptados'],
    ['IA-006 Bandejas de cobranza', 'Cobranza', 'Reglas', 'Local', 'Activa', 'Criterio aprobado por Rentas'],
    ['IA-005 Plazos', 'Cobranza', 'Reglas', 'Local', 'Activa', 'Evidencia faltante siempre visible'],
    ['IA-008/009 Atípicos y omisos', 'Fiscalización', 'Reglas y estadística', 'Local', 'Activa', 'Tasa de confirmación medida'],
    ['IA-019/020/021 Control interno', 'Control', 'Reglas', 'Local', 'Activa', 'Ajustar si > 80 % es ruido'],
    ['IA-001 Asistente normativo', 'Normativa', 'Búsqueda en normas + modelo', 'Por decidir', 'Piloto', '≥ 90 % correctas y 0 citas inventadas'],
    ['IA-018 Borradores', 'Documentos', 'Plantilla + modelo', 'Por decidir', 'Piloto', 'Muestreo mensual de Jurídica'],
    ['IA-007 Propensión de pago', 'Cobranza', 'Modelo estadístico', 'Local', 'Construida, desactivada', 'Necesita 2–3 años de datos y superar a IA-006'],
    ['IA-023 Proyección de recaudación', 'Gerencia', 'Series de tiempo', 'Local', 'Construida, desactivada', 'Necesita 3 ejercicios conciliados']
  ];
  D.inferencias = [
    ['15/03/2027 10:21', 'IA-001', 'usr.demo.operador', 'Respuesta con 1 cita', 'Aceptada'],
    ['15/03/2027 10:02', 'IA-012', 'usr.demo.operador', 'Par CTB-000101 / CTB-000140 (94)', 'Aceptada → solicitud de unión'],
    ['15/03/2027 09:40', 'IA-008', 'usr.demo.operador', 'Advertencia de área construida', 'Editada por el operador'],
    ['15/03/2027 09:15', 'IA-009', 'usr.demo.fiscalizador', 'Candidato CAND-0451', 'Descartada: predio en construcción']
  ];
})(window.RENTAS = window.RENTAS || {});
