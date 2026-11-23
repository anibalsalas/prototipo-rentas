/* =====================================================================
   PENDIENTES DE ENERO — única fuente de las etiquetas «PENDIENTE ENERO»,
   de los contadores de las cards y del Panel de pendientes.
   Para cerrar un pendiente: cambiar `estado` a 'cerrado' y anotar `cierre`.
   estado: abierto | en-consulta | cerrado | no-activable
   pregunta: ID del cuestionario a la Municipalidad (P-xxx) cuando se conoce.
   responsable: sugerido en docs/12 (no es una designación institucional).
   ===================================================================== */
(function (R) {
  var SIN_P = 'P-xxx por asignar';
  function p(id, modulo, pantallas, descripcion, fuente, pregunta, responsable, estado, cierre) {
    return { id: id, modulo: modulo, pantallas: pantallas, descripcion: descripcion, fuente: fuente,
      paraCliente: (R.preguntasCliente || {})[id] || descripcion,
      pregunta: pregunta || SIN_P, responsable: responsable || 'Por definir', estado: estado || 'abierto', cierre: cierre || '' };
  }
  R.pendientes = [
    /* Transversal */
    p('PE-001', 'transversal', ['GEN-02'], 'Logo, escudo y colores oficiales de la Municipalidad', 'docs/09 (colores propuestos)', null, 'Imagen institucional'),
    p('PE-002', 'seguridad', ['SEG-01', 'SEG-02'], 'Nombres de perfiles y cargos según el ROF vigente', 'B08', null, 'RRHH + Secretaría + Jurídica'),
    p('PE-003', 'transversal', ['GEN-02'], 'Ámbito administrado por tributo (cercado o provincia) y distritos del filtro', 'RN-01, docs/02', null, 'Jurídica + Rentas'),
    p('PE-004', 'gerencia', ['GER-01'], 'Volumen: contribuyentes, predios, recibos diarios y expedientes por año', 'propuesta-ia §7, pregunta 4', null, 'Rentas + TI'),
    p('PE-005', 'transversal', ['GEN-01'], 'Confirmar los perfiles añadidos «Operador de Rentas» y «Auditor»', 'mapa-pantallas §1', null, 'Equipo del proyecto', 'cerrado', 'Aprobado en la revisión del 22/11/2026'),

    /* Contribuyentes */
    p('PE-010', 'contribuyentes', ['CON-02'], 'Tipos de documento admitidos y regla del documento excepcional', 'RF-UTC-012', null, 'Rentas'),
    p('PE-011', 'contribuyentes', ['CON-02', 'PRE-02'], 'Catálogo oficial de vías, sectores y zonas', 'RF-UTC-061, propuesta-ia §7 pregunta 6', null, 'Catastro + Rentas'),
    p('PE-012', 'contribuyentes', ['CON-03'], 'Formato y numeración del código de contribuyente', 'RF-PRE-027', null, 'Rentas + TI'),
    p('PE-013', 'contribuyentes', ['CON-04'], 'Quién autoriza la fusión de duplicados y qué expediente se exige', 'RF-UTC-014', null, 'Rentas + Jurídica'),
    p('PE-014', 'contribuyentes', ['CON-02'], 'Convenio RENIEC/SUNAT para validar identidad (si no existe: verificación documental manual)', 'B11, propuesta-ia §7 pregunta 7', null, 'TI + responsables del convenio'),
    p('PE-015', 'contribuyentes', ['CON-02'], 'Tratamiento de nombres repetidos (se diseña como advertencia, no rechazo)', 'RF-PRE-030, RN-04', 'P-027', 'Rentas'),

    /* Predios */
    p('PE-020', 'predios', ['PRE-02'], 'Catálogos vigentes de condición, estado, tipo y uso del predio', 'RF-PRE-019..022, 046, 048..050', null, 'Rentas + Catastro'),
    p('PE-021', 'predios', ['PRE-02'], 'Tablas de predios rústicos: clasificación, nivel y categoría', 'RF-PRE-070..072, B03', 'P-037', 'Catastro + Rentas + MVCS'),
    p('PE-022', 'predios', ['PRE-02'], 'Definición y uso de «cerca o frente a parque»', 'RF-PRE-018, RF-PRE-053', null, 'Rentas'),
    p('PE-023', 'predios', ['PRE-03'], 'Regla de copropiedad y responsable solidario en la emisión', 'RN-05, docs/01 punto 4', null, 'Rentas + Jurídica'),
    p('PE-024', 'predios', ['PRE-02'], 'Códigos secundarios de cochera o depósito y su relación con el «anexo»', 'RF-PRE-063', 'P-008', 'Rentas + Catastro'),
    p('PE-025', 'predios', ['PRE-02'], 'Campos de otras instalaciones y si pertenecen al piso o al predio', 'RF-PRE-056', 'P-036', 'Rentas + Catastro'),

    /* Declaraciones juradas */
    p('PE-030', 'declaraciones', ['DJ-02'], 'Formato vigente de HR/PU y numeración de la DJ', 'RF-PRE-033, RF-PRE-067, docs/01', null, 'Rentas'),
    p('PE-031', 'declaraciones', ['DJ-02'], 'Motivos de DJ y efecto de cada motivo', 'RF-PRE-016, RF-PRE-034', null, 'Rentas'),
    p('PE-032', 'declaraciones', ['DJ-02', 'IA-05'], 'Umbrales de las validaciones de coherencia de la DJ (IA-008)', 'IA-008', null, 'Rentas + Catastro'),
    p('PE-033', 'declaraciones', ['DJ-03'], 'Quién puede cambiar el número de HR y con qué aprobación', 'RF-PRE-038', null, 'Rentas'),

    /* Determinación y emisión */
    p('PE-040', 'determinacion', ['DET-01'], 'Aranceles, valores unitarios y depreciación aplicables al ejercicio', 'B03', null, 'Catastro + Rentas + MVCS'),
    p('PE-041', 'determinacion', ['DET-01'], '¿La Municipalidad ejerce el mínimo predial de 0,6 % de la UIT?', 'RF-PRE-003, RN-08', null, 'Rentas + Jurídica'),
    p('PE-042', 'determinacion', ['DET-01', 'MAE-03', 'EMI-01'], 'Vencimientos y número de cuotas del predial 2027', 'B04, RF-PRE-012', null, 'Secretaría + Rentas'),
    p('PE-043', 'emision', ['EMI-01'], 'Derecho de emisión: ordenanza y estudio de costos vigentes', 'RF-PRE-004, L02', null, 'Rentas + Secretaría'),
    p('PE-044', 'emision', ['EMI-01', 'MAE-02'], '«Porcentaje adicional por PU»: sin fundamento identificado, no se activa', 'RF-PRE-005, docs/12 (nota tras B12)', null, 'Rentas + Jurídica', 'no-activable'),
    p('PE-046', 'determinacion', ['DET-01'], 'UIT 2027: la publica el MEF; mientras tanto el ejemplo usa la UIT 2026 (S/ 5,500)', 'N11 (solo acredita 2026)', null, 'MEF (dato nacional)'),
    p('PE-047', 'cuenta', ['CTA-01'], 'Interés de multas tributarias: régimen de transición de la Ley 31962 por confirmar antes de calcularlo', 'N08, RN-17', null, 'Rentas + Jurídica'),
    p('PE-048', 'emision', ['EMI-01', 'EMI-04'], 'Emisión 2027: si ya se hizo en el sistema actual o se hace en el nuevo; formato de la cuponera y forma de reparto', 'Decisión del 22/11/2026 (módulo propio de emisión)', null, 'Gerencia de Rentas'),
    p('PE-049', 'beneficios', ['BEN-02'], 'Ordenanza de amnistía 2027 (si se aprobará): periodos, conceptos, porcentajes, vigencia y acumulación', 'RF-UTC-059, RN-10', null, 'Rentas + Secretaría General'),
    p('PE-045', 'determinacion', ['DET-03'], 'Formatos oficiales de documentos (HR, PU, constancias)', 'docs/12 evidencia 10', null, 'Rentas + Secretaría'),

    /* Arbitrios */
    p('PE-050', 'arbitrios', ['ARB-01', 'ARB-02'], 'Ordenanza de arbitrios 2026/2027: anexos, costos y publicación', 'B01', null, 'Rentas + Secretaría + Servicios + Jurídica'),
    p('PE-051', 'arbitrios', ['ARB-01'], 'Ámbito de cobertura por servicio (¿solo zona urbana?)', 'L01, B01', null, 'Servicios + Rentas'),

    /* Beneficios */
    p('PE-060', 'beneficios', ['BEN-02', 'BEN-03'], 'Campañas vigentes: porcentajes, exclusiones y fecha de fin', 'B04, L04, L05', null, 'Secretaría + Rentas'),
    p('PE-061', 'beneficios', ['BEN-01'], 'Autoridad que concede beneficios individuales', 'B08, RF-UTC-021', null, 'Jurídica + Rentas'),

    /* Cuenta corriente */
    p('PE-070', 'cuenta', ['CTA-01', 'CTA-03'], 'TIM municipal vigente e historial de cambios', 'B02', null, 'Rentas + Jurídica'),
    p('PE-071', 'cuenta', ['CTA-01'], 'Plantillas de explicación del estado de cuenta (IA-003) aprobadas por Rentas', 'IA-003', null, 'Rentas'),
    p('PE-072', 'cuenta', ['CTA-01'], 'Calidad de la deuda migrada (detalle por componente)', 'B10, propuesta-ia §7 pregunta 5', null, 'TI + Rentas + Tesorería'),

    /* Valores */
    p('PE-080', 'valores', ['VAL-01', 'VAL-02'], 'Tipos de valor y formatos firmados de OP, RD y RM', 'docs/12 evidencia 10, RF-UTC-039', null, 'Rentas + Jurídica'),
    p('PE-081', 'valores', ['VAL-01'], 'Montos mínimos y criterios de los lotes de valores', 'RF-VAL-003', null, 'Rentas'),
    p('PE-082', 'valores', ['VAL-02'], 'Canales de notificación válidos y procedimiento', 'RF-UTC-040, RN-22', null, 'Rentas + Jurídica'),

    /* Fraccionamiento */
    p('PE-090', 'fraccionamiento', ['FRA-01'], 'Reglamento vigente: tasa, cuota inicial, número de cuotas y mínimos', 'B06, RF-FRA-003..010', null, 'Rentas + Jurídica'),
    p('PE-091', 'fraccionamiento', ['FRA-02'], 'Garantías exigibles en el convenio', 'B06', null, 'Rentas + Jurídica'),
    p('PE-092', 'fraccionamiento', ['FRA-03'], 'Causales y procedimiento de pérdida del fraccionamiento', 'B06, RF-FRA-015', null, 'Rentas + Jurídica'),

    /* Caja */
    p('PE-100', 'caja', ['CAJ-01'], 'Cajas, agencias, medios de pago y bancos', 'docs/02 (Tesorería), B12', null, 'Tesorería + TI'),
    p('PE-101', 'caja', ['CAJ-02'], 'Orden de imputación de pagos y costas (el TdR pide costas primero; RN-19 lo prohíbe como regla universal)', 'RF-CAJ-006, RN-19', null, 'Rentas + Jurídica + Tesorería'),
    p('PE-102', 'caja', ['CAJ-02', 'MAE-04'], 'Tarifario de ingresos, partidas presupuestales y TUPA integrado', 'RF-CAJ-001, RF-CAJ-007, B07', 'P-054', 'Tesorería + áreas emisoras'),
    p('PE-103', 'caja', ['CAJ-02'], 'Formato del recibo y serie de numeración', 'RF-UTC-051', null, 'Tesorería'),
    p('PE-104', 'caja', ['CAJ-03'], 'Política de extorno: plazo, motivos y aprobador', 'RF-UTC-037, RF-CAJ-010', null, 'Tesorería'),
    p('PE-105', 'caja', ['CAJ-04'], 'Política de arqueo y tratamiento de diferencias', 'RN-18', null, 'Tesorería'),
    p('PE-106', 'caja', ['CAJ-05'], 'Convenios y archivos bancarios para conciliar', 'B11', null, 'Tesorería + TI'),

    /* Multas */
    p('PE-110', 'multas', ['MUL-01'], 'Tabla de multas y gradualidad aplicable (con caso de prueba)', 'RF-MTR-001..004', null, 'Rentas + Jurídica'),
    p('PE-111', 'multas', ['MUL-02'], 'RAS y CUIS vigentes', 'B07', null, 'Áreas emisoras + Jurídica'),
    p('PE-112', 'multas', ['MUL-02'], 'Áreas que imponen multas y su numeración', 'RF-MAD-014', null, 'Secretaría + áreas emisoras'),

    /* Fiscalización */
    p('PE-120', 'fiscalizacion', ['FIS-01'], 'Tipos y formatos de requerimiento de fiscalización', 'RF-FIS-008', null, 'Fiscalización'),
    p('PE-121', 'ia-atipicos', ['IA-05'], 'Fuentes internas autorizadas para cruces (licencias, catastro)', 'IA-009', null, 'Rentas + áreas emisoras'),
    p('PE-122', 'fiscalizacion', ['FIS-02'], '¿Fiscalización integrada con Rentas o base paralela? (se diseña integrada)', 'RF-FIS-003', 'P-003, P-103', 'Fiscalización + TI'),

    /* Coactivo */
    p('PE-130', 'coactivo', ['COA-02'], 'Designación del ejecutor y de los auxiliares coactivos', 'B08, B09', null, 'RRHH + Secretaría'),
    p('PE-131', 'coactivo', ['COA-02', 'COA-03'], 'Formatos de REC y de medidas', 'B09', null, 'Ejecutor coactivo'),
    p('PE-132', 'coactivo', ['COA-03'], 'Costas y gastos procesales sustentados', 'RF-COA-005, RF-COA-008', null, 'Ejecutor coactivo + Jurídica'),
    p('PE-133', 'coactivo', ['COA-02'], 'Qué documento llama hoy «REC» la Municipalidad y si se emite en masa', 'RF-COA-007', 'P-083', 'Ejecutor coactivo'),

    /* Descargos */
    p('PE-140', 'descargos', ['DES-01'], 'Tipos de descargo adicionales a los cuatro del TdR', 'RF-DES-001', null, 'Rentas'),
    p('PE-141', 'descargos', ['DES-01', 'DES-02'], 'Autoridad que firma descargos y transferencias', 'B08, RF-DES-002..005', null, 'Jurídica + Secretaría'),
    p('PE-142', 'descargos', ['DES-03', 'IA-02'], 'Política de cálculo de prescripción aprobada por Jurídica', 'IA-005, RN-23', null, 'Jurídica'),

    /* Gerencia y reportes */
    p('PE-150', 'gerencia', ['GER-01'], 'Definición de los indicadores (recaudación neta, cartera)', 'RF-UTC-055, docs/09', null, 'Rentas + Tesorería'),
    p('PE-151', 'reportes', ['REP-01', 'REP-02'], 'Reportes obligatorios y sus formatos', 'RF-SPC-001..010, RF-CAJ-013..016', null, 'Rentas + Tesorería'),

    /* Maestros y seguridad */
    p('PE-160', 'maestros', ['MAE-03'], 'Feriados y días no laborables locales', 'RN-03', null, 'Secretaría'),
    p('PE-161', 'maestros', ['MAE-06'], 'Legado: ejercicios disponibles, diccionario y totales certificados', 'B10', null, 'TI + Rentas + Tesorería'),
    p('PE-162', 'seguridad', ['SEG-01'], 'Tiempo de inactividad y jornada máxima de sesión (propuesta: 15 min y 8 h)', 'docs/08', null, 'TI + seguridad'),
    p('PE-163', 'seguridad', ['SEG-04'], 'Plazos de retención de la auditoría y de las inferencias', 'propuesta-ia §5', null, 'Archivo + Jurídica'),

    /* Asistencia inteligente */
    p('PE-170', 'ia-normativo', ['IA-06', 'IA-08'], 'Infraestructura para modelos: local o nube de la entidad', 'propuesta-ia §7 preguntas 1 y 2', null, 'TI'),
    p('PE-171', 'ia-gobierno', ['IA-08'], 'Responsable de datos personales designado', 'propuesta-ia §7 pregunta 3', null, 'Secretaría'),
    p('PE-172', 'ia-control', ['IA-07'], 'Receptor de las alertas de control interno (OCI u otro)', 'propuesta-ia §7 pregunta 9', null, 'OCI'),
    p('PE-173', 'ia-cobranza', ['IA-01'], 'Criterios de la bandeja de cobranza aprobados por Rentas', 'IA-006', null, 'Rentas'),
    p('PE-174', 'ia-normativo', ['IA-06', 'MAE-01'], 'Corpus normativo cargado (ordenanzas faltantes)', 'B01–B07', null, 'Secretaría + Rentas'),

    /* Alcance por confirmar */
    p('PE-180', 'alc-espectaculos', ['ALC-01'], 'Espectáculos: actividad gravada real y si entra al alcance', 'RF-UTC-029', 'P-060', 'Rentas'),
    p('PE-181', 'alc-merced', ['ALC-02'], 'Contratos de alquiler y concesión vigentes, y si entran al alcance', 'B07, RF-UTC-031', 'P-060', 'Áreas emisoras + Jurídica'),
    p('PE-182', 'alc-ambulatorio', ['ALC-03'], 'Ordenanza y tasa de comercio ambulatorio, y si entra al alcance', 'RF-UTC-030', 'P-060', 'Área competente + Rentas'),
    p('PE-183', 'alc-vehicular', ['ALC-04'], 'Vehicular: procedimiento, prioridad y si entra al alcance contratado (no figura en el TdR)', 'docs/12 evidencia 6, RF-UTC-024', null, 'Rentas'),
    p('PE-184', 'alc-alcabala', ['ALC-05'], 'Alcabala: FIM, competencia y si entra al alcance contratado (no figura en el TdR)', 'B05, RF-UTC-026', null, 'Jurídica + Rentas'),
    p('PE-185', 'alc-apuestas', ['ALC-06'], 'Apuestas y juegos: modalidades realmente presentes en la provincia', 'RF-UTC-028, docs/12', null, 'Rentas'),
    p('PE-186', 'alc-portal', ['ALC-07'], 'Portal: identidad ciudadana, proveedor de pagos y convenio', 'RF-UTC-053, RF-UTC-054, B11', null, 'TI + Tesorería')
  ];
})(window.RENTAS = window.RENTAS || {});
