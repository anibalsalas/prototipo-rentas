/* =====================================================================
   DATOS DE EJEMPLO — Gestión de Deuda (multas, fiscalización, coactivo, descargos).
   Personas y montos FICTICIOS. Montos en céntimos enteros.
   ===================================================================== */
(function (R) {
  var D = R.datos;

  /* ---------- Multas tributarias ---------- */
  D.multas = [
    { numero: 'MT-2027-000014', contribuyente: 'CTB-000105', nombre: 'Jorge Prueba Salazar', infraccion: 'Presentar la declaración jurada fuera de plazo', fecha: '2027-03-02', monto: 13750, estado: 'En revisión' },
    { numero: 'MT-2027-000009', contribuyente: 'CTB-000108', nombre: 'Asociación de Vivienda Ejemplo', infraccion: 'No presentar la declaración jurada en el plazo', fecha: '2027-02-18', monto: 27500, estado: 'Emitida (RM-2027-000031)' },
    { numero: 'MT-2025-000088', contribuyente: 'CTB-000101', nombre: 'Ana Prueba Quispe', infraccion: 'Presentar la declaración jurada fuera de plazo', fecha: '2025-09-15', monto: 13750, estado: 'Emitida (RM-2025-000088)' }
  ];

  /* ---------- Sanciones administrativas (otras áreas, numeración propia) ---------- */
  D.sanciones = [
    { numero: 'GDE-NI-2027-0041', area: 'Gerencia de Desarrollo Económico (ejemplo)', infractor: 'Comercial Ejemplo S.A.C.', codigo: 'CTB-000103', infraccion: 'Código de ejemplo C-01 · Atender sin licencia vigente', fecha: '2027-02-20', monto: 55000, paso: 2, estado: 'Descargo presentado' },
    { numero: 'TRA-NI-2027-0108', area: 'Subgerencia de Transporte (ejemplo)', infractor: 'Pedro Ejemplo Chávez', codigo: 'CTB-000107', infraccion: 'Código de ejemplo T-07 · Estacionar en zona prohibida', fecha: '2027-03-01', monto: 11000, paso: 3, estado: 'Aprobada para resolución' },
    { numero: 'GDE-NI-2027-0029', area: 'Gerencia de Desarrollo Económico (ejemplo)', infractor: 'Rosa Ejemplo Vargas', codigo: 'CTB-000104', infraccion: 'Código de ejemplo C-04 · Ocupar la vía pública sin autorización', fecha: '2027-01-30', monto: 27500, paso: 5, estado: 'Resolución notificada' }
  ];

  /* ---------- Fiscalización ---------- */
  D.casosFis = [
    { numero: 'FIS-2027-000021', contribuyente: 'CTB-000105', nombre: 'Jorge Prueba Salazar', predio: 'Jr. Los Ejemplos 300', origen: 'Atípico en DJ (área construida baja para la zona)', fiscalizador: 'usr.demo.fiscalizador', estado: 'Inspección realizada', plazo: '2027-04-15' },
    { numero: 'FIS-2027-000018', contribuyente: 'CTB-000108', nombre: 'Asociación de Vivienda Ejemplo', predio: 'Mz. A Lt. 1, Sector Ejemplo Alto', origen: 'Requerimiento programado', fiscalizador: 'usr.demo.fiscalizador', estado: 'Requerimiento notificado', plazo: '2027-03-30' },
    { numero: 'FIS-2027-000012', contribuyente: 'CTB-000104', nombre: 'Rosa Ejemplo Vargas', predio: 'Pje. Muestra 12', origen: 'Cruce: licencia de edificación sin DJ actualizada', fiscalizador: 'usr.demo.fiscalizador', estado: 'Diferencia en revisión', plazo: '2027-03-25' }
  ];
  D.candidatosFis = [
    { id: 'CAND-0451', nombre: 'Luis Demo Rojas', predio: 'Calle Prueba 33', regla: 'Valor por m² 45 % por debajo de los predios de la misma vía', fuente: 'Estadística de la zona (IA-008)' },
    { id: 'CAND-0452', nombre: 'Marta Demo Torres', predio: 'Calle Prueba 87', regla: 'Transferencia de alcabala sin actualización del titular predial', fuente: 'Cruce interno (IA-009)' },
    { id: 'CAND-0453', nombre: 'Sucesión Prueba Díaz', predio: 'Jr. Los Ejemplos 512', regla: 'Unidades de arbitrios sin declaración vigente', fuente: 'Cruce interno (IA-009)' }
  ];
  /* Caso FIS-2027-000021: declarado frente a fiscalizado */
  D.comparacionFis = [
    ['Área de terreno', '200 m²', '200 m²', false],
    ['Área construida total', '120 m²', '180 m²', true],
    ['Pisos', '1', '2', true],
    ['Categoría de muros y columnas', 'D', 'C', true],
    ['Estado de conservación', 'Regular', 'Bueno', true],
    ['Otras instalaciones', 'Ninguna', 'Cerco perimétrico 40 m', true]
  ];
  D.diferenciaFis = [ /* bases en céntimos por ejercicio */
    { anio: 2026, declarada: 6000000, fiscalizada: 8400000 },
    { anio: 2027, declarada: 6000000, fiscalizada: 8400000 }
  ];

  /* ---------- Coactivo ---------- */
  D.expedientesCoa = [
    { numero: 'EC-2025-000231', contribuyente: 'CTB-000102', nombre: 'Luis Demo Rojas', titulo: 'OP-2025-000901', deuda: 51840, costas: 4500, inicio: '2025-04-10', estado: 'Con medida', medida: 'Retención bancaria trabada' },
    { numero: 'EC-2026-000102', contribuyente: 'CTB-000104', nombre: 'Rosa Ejemplo Vargas', titulo: 'OP-2026-000612', deuda: 72900, costas: 3000, inicio: '2026-08-01', estado: 'Levantamiento urgente', medida: 'Retención bancaria · convenio aprobado hoy' },
    { numero: 'EC-2026-000088', contribuyente: 'CTB-000103', nombre: 'Comercial Ejemplo S.A.C.', titulo: 'RD-2026-000044', deuda: 98400, costas: 3000, inicio: '2026-06-15', estado: 'Suspendido', medida: 'Sin medidas' },
    { numero: 'EC-2026-000131', contribuyente: 'CTB-000109', nombre: 'Sucesión Prueba Díaz', titulo: 'OP-2026-000700', deuda: 23900, costas: 1500, inicio: '2026-10-20', estado: 'REC notificada', medida: 'Plazo para pagar en curso' }
  ];
  D.candidatosCoa = [
    { valor: 'OP-2027-000155', nombre: 'Ana Prueba Quispe', codigo: 'CTB-000101', importe: 6535, notif: true, plazo: true, susp: false, origen: 'Constancia de exigibilidad CE-2027-000041' },
    { valor: 'RM-2025-000088', nombre: 'Ana Prueba Quispe', codigo: 'CTB-000101', importe: 13750, notif: true, plazo: true, susp: false, origen: 'Bandeja de cobranza (prioridad alta)' },
    { valor: 'OP-2027-000171', nombre: 'Rosa Ejemplo Vargas', codigo: 'CTB-000104', importe: 9120, notif: false, plazo: false, susp: false, origen: 'Propuesta manual' }
  ];
  D.actuacionesCoa = [
    ['2025-04-10', 'Resolución de Ejecución Coactiva N.º 1', 'Inicio del procedimiento y plazo para pagar', 'Notificada el 15/04/2025'],
    ['2025-05-05', 'Resolución N.º 2', 'Embargo en forma de retención en entidades financieras', 'Oficios enviados a 3 bancos'],
    ['2025-05-12', 'Respuesta del banco (ejemplo)', 'Retención trabada por ' + 'S/ 518.40', 'Cargo de recepción registrado'],
    ['2026-01-20', 'Resolución N.º 3', 'Actualización de costas y gastos', 'Notificada el 27/01/2026']
  ];

  /* ---------- Descargos y transferencias ---------- */
  D.descargos = [
    { numero: 'DES-2027-0007', tipo: 'Prescripción', contribuyente: 'Sucesión Prueba Díaz', deuda: 'Impuesto predial 2018', monto: 18400, expediente: 'EXP-2026-003310', resolucion: 'RG-2027-0012 (ejemplo)', estado: 'Aplicado' },
    { numero: 'DES-2027-0011', tipo: 'Anulación', contribuyente: 'Marta Demo Torres', deuda: 'Arbitrios 2026 · 2.º trimestre (emitido por error)', monto: 7800, expediente: 'EXP-2027-000401', resolucion: 'RG-2027-0029 (ejemplo)', estado: 'Aplicado' },
    { numero: 'DES-2027-0013', tipo: 'Compensación', contribuyente: 'Jorge Prueba Salazar', deuda: 'Impuesto predial 2027 · cuota 2', monto: 4520, expediente: 'EXP-2027-000455', resolucion: 'RG-2027-0033 (ejemplo)', estado: 'Pendiente de aprobación' }
  ];
  D.transferencias = [
    { numero: 'TRP-2027-0003', recibo: 'R-001-0006991', origen: 'Ana Prueva Quispe (CTB-000140)', destino: 'Ana Prueba Quispe (CTB-000101)', monto: 6200, expediente: 'EXP-2027-000390', estado: 'Aplicada' }
  ];
  D.expedientesRec = [
    { numero: 'EXP-2026-004512', tipo: 'Reclamo', contribuyente: 'Ana Prueba Quispe', asunto: 'Arbitrios 2026 · 3.er trimestre', presentado: '2026-09-20', plazo: '2027-04-30', estado: 'En evaluación' },
    { numero: 'EXP-2027-000210', tipo: 'Apelación', contribuyente: 'Comercial Ejemplo S.A.C.', asunto: 'RD-2027-000012', presentado: '2027-03-01', plazo: '—', estado: 'Elevado al Tribunal Fiscal' },
    { numero: 'EXP-2027-000318', tipo: 'Prescripción', contribuyente: 'Pedro Ejemplo Chávez', asunto: 'Impuesto predial 2019 y 2020', presentado: '2027-03-08', plazo: '2027-04-30', estado: 'Cálculo con evidencia incompleta' }
  ];
  D.eventosPrescripcion = [
    ['2020-01-01', 'Inicio del plazo (predial 2019)', 'Hecho', 'Registro de la obligación'],
    ['2021-03-15', 'Orden de Pago notificada', 'Interrumpe el plazo', 'Cargo escaneado'],
    ['2022-06-10', 'Reclamo presentado', 'Suspende el plazo', 'Evidencia no registrada'],
    ['2023-02-01', 'Pago parcial', 'Interrumpe el plazo', 'Recibo R-001-0002210']
  ];
})(window.RENTAS = window.RENTAS || {});
