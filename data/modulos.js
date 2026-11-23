/* Secciones, módulos y pantallas. Fuente: docs/prototipo/mapa-pantallas.md §3–§4.
   total   = perfiles con acceso completo · lectura = perfiles solo consulta.
   etapa   = etapa del prototipo en que se diseña la pantalla en detalle. */
(function (R) {
  R.secciones = [
    { id: 'at',   titulo: 'Administración Tributaria', desc: 'Registro del contribuyente y sus bienes, declaración y determinación de tributos.' },
    { id: 'rc',   titulo: 'Recaudación y Cobranza', desc: 'Estado de cuenta, valores, fraccionamiento y caja.' },
    { id: 'gd',   titulo: 'Gestión de Deuda', desc: 'Multas, fiscalización, ejecución coactiva, descargos y transferencias.' },
    { id: 'gc',   titulo: 'Gestión y Control', desc: 'Indicadores, reportes, parámetros normativos, seguridad y auditoría.' },
    { id: 'ia',   titulo: 'Asistencia inteligente', desc: 'Sugerencias y alertas. Siempre con revisión humana: la IA no calcula montos, no emite ni cobra.' },
    { id: 'alc',  titulo: 'Alcance por confirmar', desc: 'Módulos cuyo alcance o sustento falta confirmar. Solo se presenta lo que se sabe y lo que falta.' }
  ];

  var TODOS = ['operador', 'cajero', 'fiscalizador', 'ejecutor', 'supervisor', 'gerencia', 'admin', 'auditor'];
  /* Módulos por confirmar: un resumen (ALC-0n) + sus pantallas principales.
     total: perfiles que operarían el módulo si se confirma. */
  function alc(id, nombre, desc, icono, incr, rf, sin, total, extras) {
    return { id: id, seccion: 'alc', nombre: nombre, desc: desc, icono: icono, incr: incr, estado: 'confirmar',
      total: total, lectura: TODOS.filter(function (x) { return total.indexOf(x) < 0; }), sinonimos: sin,
      pantallas: [{ id: 'ALC-0' + (R._alc = (R._alc || 0) + 1), slug: 'resumen', nombre: 'Resumen del módulo',
        para: 'Conocer qué hará este módulo y qué necesitamos confirmar para incluirlo.', incr: incr, rf: rf, etapa: 2 }]
        .concat(extras.map(function (e) { return { id: e[0], slug: e[1], nombre: e[2], para: e[3], incr: incr, rf: rf, etapa: 6 }; })) };
  }

  R.modulos = [
    /* ---------------- Administración Tributaria ---------------- */
    { id: 'contribuyentes', seccion: 'at', nombre: 'Contribuyentes', icono: 'personas', incr: 'P0-C', estado: 'alcance',
      desc: 'Registro único de personas, documentos, domicilios y representantes.',
      total: ['operador', 'supervisor'], lectura: ['cajero', 'fiscalizador', 'ejecutor', 'auditor'],
      sinonimos: 'persona padrón dni ruc homónimo duplicado domicilio representante',
      pantallas: [
        { id: 'CON-01', slug: 'buscar', nombre: 'Buscar contribuyente', para: 'Encontrar a una persona por documento, nombre o código antes de registrarla.', incr: 'P0-C', rf: ['RF-UTC-012', 'RF-PRE-027', 'RF-PRE-028'], etapa: 3 },
        { id: 'CON-02', slug: 'registrar', nombre: 'Registrar contribuyente', para: 'Dar de alta a una persona natural o jurídica, con documento, domicilio y contacto.', incr: 'P0-C', rf: ['RF-UTC-012', 'RF-UTC-013', 'RF-UTC-061', 'RF-PRE-028', 'RF-PRE-029', 'RF-PRE-030', 'RF-PRE-031', 'RF-PRE-032', 'RF-PRE-035'], etapa: 3 },
        { id: 'CON-03', slug: 'ficha', nombre: 'Ficha del contribuyente', para: 'Ver en un solo lugar la identidad, bienes, declaraciones, deuda, pagos y expedientes de una persona.', incr: 'P0-C', rf: ['RF-UTC-012', 'RF-UTC-013', 'RF-UTC-032', 'RF-PRE-040', 'RF-PRE-041'], etapa: 3 },
        { id: 'CON-04', slug: 'fusionar', nombre: 'Fusionar duplicados', para: 'Unir dos registros de la misma persona con expediente y aprobación, sin borrar el historial.', incr: 'P1-C', rf: ['RF-UTC-014', 'RF-UTC-064', 'RF-PRE-029'], etapa: 3, sensible: true }
      ] },
    { id: 'predios', seccion: 'at', nombre: 'Predios', icono: 'casa', incr: 'P1-A', estado: 'alcance',
      desc: 'Ubicación, características, pisos, instalaciones y titularidad.',
      total: ['operador', 'supervisor'], lectura: ['fiscalizador', 'ejecutor', 'auditor'],
      sinonimos: 'inmueble terreno pisos instalaciones copropiedad condominio titular urbano rústico',
      pantallas: [
        { id: 'PRE-01', slug: 'lista', nombre: 'Predios del contribuyente', para: 'Ver los predios de una persona con ubicación, uso y participación.', incr: 'P1-A', rf: ['RF-UTC-015', 'RF-UTC-016', 'RF-PRE-045', 'RF-PRE-048', 'RF-PRE-049', 'RF-PRE-050', 'RF-PRE-051'], etapa: 3 },
        { id: 'PRE-02', slug: 'ficha', nombre: 'Ficha del predio', para: 'Registrar y versionar los datos físicos del predio: terreno, pisos y otras instalaciones.', incr: 'P1-A', rf: ['RF-UTC-015', 'RF-PRE-055', 'RF-PRE-056', 'RF-PRE-057', 'RF-PRE-062', 'RF-PRE-063', 'RF-PRE-070', 'RF-PRE-071', 'RF-PRE-072'], etapa: 3 },
        { id: 'PRE-03', slug: 'titularidad', nombre: 'Titularidad y copropiedad', para: 'Registrar copropietarios con su participación y vigencia, sin pasar del 100 %.', incr: 'P1-A', rf: ['RF-UTC-016', 'RF-PRE-046', 'RF-PRE-047'], etapa: 3 }
      ] },
    { id: 'declaraciones', seccion: 'at', nombre: 'Declaraciones juradas', icono: 'documento', incr: 'P1-A', estado: 'alcance',
      desc: 'Presentación, versiones y rectificación de la declaración jurada.',
      total: ['operador', 'supervisor'], lectura: ['fiscalizador', 'auditor'],
      sinonimos: 'dj hr pu hoja resumen rectificación autoavalúo declaración',
      pantallas: [
        { id: 'DJ-01', slug: 'lista', nombre: 'Declaraciones juradas', para: 'Ver las DJ de una persona por ejercicio, con su estado y versiones.', incr: 'P1-A', rf: ['RF-UTC-017', 'RF-PRE-033', 'RF-PRE-034', 'RF-PRE-040'], etapa: 3 },
        { id: 'DJ-02', slug: 'asistente', nombre: 'Asistente de declaración jurada', para: 'Preparar y presentar una DJ paso a paso, con borrador y validaciones.', incr: 'P1-A', rf: ['RF-UTC-017', 'RF-PRE-033', 'RF-PRE-034', 'RF-PRE-035', 'RF-PRE-036', 'RF-PRE-064'], etapa: 3 },
        { id: 'DJ-03', slug: 'versiones', nombre: 'Versiones y rectificación', para: 'Comparar versiones de una DJ y rectificarla sin sobrescribir la presentada.', incr: 'P1-A', rf: ['RF-UTC-017', 'RF-PRE-037', 'RF-PRE-038'], etapa: 3 }
      ] },
    { id: 'determinacion', seccion: 'at', nombre: 'Determinación', icono: 'calculadora', incr: 'P1-A', estado: 'alcance',
      desc: 'Cálculo explicado del impuesto, cuotas y documentos de cada contribuyente.',
      total: ['operador', 'supervisor'], lectura: ['auditor'],
      sinonimos: 'cálculo impuesto predial cuotas simulación autoavalúo liquidación',
      pantallas: [
        { id: 'DET-01', slug: 'predial', nombre: 'Determinación predial explicada', para: 'Simular, revisar y emitir el impuesto predial, viendo cómo se calculó paso a paso.', incr: 'P1-A', rf: ['RF-UTC-018', 'RF-UTC-019', 'RF-UTC-020', 'RF-UTC-063', 'RF-PRE-007', 'RF-PRE-064', 'RF-PRE-073'], etapa: 3 },
        { id: 'DET-03', slug: 'documentos', nombre: 'Documentos emitidos', para: 'Consultar HR, PU, constancias y su estado (borrador o emitido).', incr: 'P1-A', rf: ['RF-UTC-051', 'RF-PRE-067'], etapa: 3 }
      ] },
    { id: 'emision', seccion: 'at', nombre: 'Emisión masiva 2027', icono: 'informe', incr: 'P1-C', estado: 'alcance',
      desc: 'Emisión anual de todos los contribuyentes: preparación, simulación, aprobación y cuponera.',
      total: ['operador', 'supervisor'], lectura: ['auditor', 'gerencia'],
      sinonimos: 'emisión masiva cuponera lote anual 2027 hoja de liquidación reparto impresión',
      pantallas: [
        { id: 'EMI-01', slug: 'preparacion', nombre: 'Preparación de la emisión', para: 'Comprobar que los datos 2027 estén publicados y definir qué y a quiénes se emite.', incr: 'P1-C', rf: ['RF-UTC-052', 'RF-UTC-009', 'RF-UTC-010', 'RF-EMI-001', 'RF-EMI-002', 'RF-EMI-003', 'RF-EMI-004', 'RF-EMI-006'], etapa: 8 },
        { id: 'EMI-02', slug: 'simulacion', nombre: 'Simulación y revisión del lote', para: 'Calcular a todos los contribuyentes sin crear deudas y corregir los casos observados.', incr: 'P1-C', rf: ['RF-UTC-052', 'RF-UTC-019', 'RF-EMI-007', 'IA-012', 'IA-008'], etapa: 8 },
        { id: 'EMI-03', slug: 'emision', nombre: 'Aprobación y emisión definitiva', para: 'Aprobar el lote revisado y crear las deudas y cuotas 2027 sin duplicar.', incr: 'P1-C', rf: ['RF-UTC-020', 'RF-UTC-052', 'RF-UTC-064'], etapa: 8, sensible: true },
        { id: 'EMI-04', slug: 'cuponera', nombre: 'Cuponera y reparto', para: 'Generar las cuponeras y documentos, imprimirlos y controlar su entrega.', incr: 'P1-C', rf: ['RF-UTC-051', 'RF-EMI-008', 'RF-PRE-067', 'RF-PRE-076'], etapa: 8 }
      ] },
    { id: 'arbitrios', seccion: 'at', nombre: 'Arbitrios', icono: 'hoja', incr: 'P1-C', estado: 'alcance',
      desc: 'Régimen por servicio y unidad de uso; emisión bloqueada si falta la ordenanza.',
      total: ['operador', 'supervisor'], lectura: ['auditor'],
      sinonimos: 'limpieza barrido serenazgo parques ordenanza servicios',
      pantallas: [
        { id: 'ARB-01', slug: 'regimen', nombre: 'Régimen de arbitrios', para: 'Ver servicios, zonas, criterios y ordenanza del ejercicio; sin ordenanza no se emite.', incr: 'P1-C', rf: ['RF-UTC-022', 'RF-ARB-001', 'RF-ARB-003', 'RF-ARB-008', 'RF-ARB-011', 'RF-ARB-013'], etapa: 3 },
        { id: 'ARB-02', slug: 'liquidacion', nombre: 'Liquidación de arbitrios', para: 'Simular el cálculo por servicio y unidad de uso.', incr: 'P1-C', rf: ['RF-UTC-023', 'RF-ARB-014', 'RF-ARB-015', 'RF-ARB-016', 'RF-ARB-017'], etapa: 3 }
      ] },
    { id: 'beneficios', seccion: 'at', nombre: 'Amnistía tributaria y beneficios', icono: 'etiqueta', incr: 'P1-B', estado: 'alcance',
      desc: 'Campañas de amnistía y beneficios individuales, aplicados solo según ordenanza.',
      total: ['operador', 'supervisor'], lectura: ['auditor', 'cajero', 'gerencia'],
      sinonimos: 'amnistía condonación campaña exoneración deducción pensionista descuento intereses multas',
      pantallas: [
        { id: 'BEN-02', slug: 'campanas', nombre: 'Campañas de amnistía', para: 'Configurar la campaña desde su ordenanza y ver su efecto en el estado de cuenta y en caja.', incr: 'P1-B', rf: ['RF-UTC-059', 'RF-WEB-002', 'RF-CAJ-008'], etapa: 8 },
        { id: 'BEN-01', slug: 'individuales', nombre: 'Beneficios individuales', para: 'Registrar la solicitud de un beneficio con su evidencia y resolverla según competencia.', incr: 'P1-A', rf: ['RF-UTC-021'], etapa: 3 },
        { id: 'BEN-03', slug: 'reporte', nombre: 'Reporte de amnistía y beneficios', para: 'Ver cuánto se condonó y cuánto se recaudó con cada campaña y beneficio.', incr: 'P1-B', rf: ['RF-UTC-059', 'RF-UTC-055'], etapa: 8 }
      ] },

    /* ---------------- Recaudación y Cobranza ---------------- */
    { id: 'cuenta', seccion: 'rc', nombre: 'Cuenta corriente', icono: 'libro', incr: 'P1-B', estado: 'alcance',
      desc: 'Estado de cuenta, componentes, movimientos y proyección de intereses.',
      total: ['operador', 'supervisor'], lectura: ['cajero', 'fiscalizador', 'ejecutor', 'auditor'],
      sinonimos: 'estado de cuenta deuda saldo intereses tim movimientos',
      pantallas: [
        { id: 'CTA-01', slug: 'estado', nombre: 'Estado de cuenta', para: 'Ver toda la deuda de una persona por obligación y componente, con su estado y fecha de corte.', incr: 'P1-B', rf: ['RF-UTC-032', 'RF-UTC-033', 'RF-PRE-065', 'RF-PRE-066', 'RF-PRE-069', 'RF-PRE-075', 'RF-ARB-015', 'RF-WEB-001'], etapa: 3, central: true },
        { id: 'CTA-02', slug: 'movimientos', nombre: 'Movimientos de una obligación', para: 'Ver cada cargo, abono, ajuste y extorno que explica el saldo.', incr: 'P1-B', rf: ['RF-UTC-032'], etapa: 3 },
        { id: 'CTA-03', slug: 'proyeccion', nombre: 'Proyección de intereses', para: 'Calcular el interés a una fecha futura sin modificar la deuda emitida.', incr: 'P1-B', rf: ['RF-UTC-033', 'RF-VAL-004', 'RF-WEB-004'], etapa: 3 }
      ] },
    { id: 'valores', seccion: 'rc', nombre: 'Valores', icono: 'sello', incr: 'P2-B', estado: 'alcance',
      desc: 'Lotes de OP, RD y RM; notificación y constancia de exigibilidad.',
      total: ['operador', 'supervisor'], lectura: ['ejecutor', 'auditor'],
      sinonimos: 'orden de pago resolución de determinación multa notificación exigibilidad op rd rm',
      pantallas: [
        { id: 'VAL-01', slug: 'lotes', nombre: 'Lotes de valores', para: 'Generar lotes de OP, RD o RM con criterios y revisión antes de emitir.', incr: 'P2-B', rf: ['RF-UTC-039', 'RF-UTC-052', 'RF-VAL-001', 'RF-VAL-002', 'RF-VAL-003', 'RF-VAL-005', 'RF-VAL-008', 'RF-PRE-042', 'RF-PRE-043', 'RF-PRE-044'], etapa: 4 },
        { id: 'VAL-02', slug: 'detalle', nombre: 'Detalle del valor y notificación', para: 'Ver el acto, su deuda enlazada y registrar la notificación con evidencia.', incr: 'P2-B', rf: ['RF-UTC-039', 'RF-UTC-040', 'RF-VAL-006', 'RF-VAL-007', 'RF-VAL-009', 'RF-VAL-010'], etapa: 4 },
        { id: 'VAL-03', slug: 'exigibilidad', nombre: 'Constancia de exigibilidad y envío a coactivo', para: 'Verificar notificación y plazo, generar la constancia y proponer el envío a coactivo.', incr: 'P2-B', rf: ['RF-UTC-039', 'RF-UTC-048', 'RF-VAL-011', 'RF-VAL-012'], etapa: 4 }
      ] },
    { id: 'fraccionamiento', seccion: 'rc', nombre: 'Fraccionamiento', icono: 'calendario', incr: 'P2-B', estado: 'alcance',
      desc: 'Simulación, convenio, cronograma, seguimiento y pérdida.',
      total: ['operador', 'supervisor'], lectura: ['cajero', 'ejecutor', 'auditor'],
      sinonimos: 'convenio cuotas cronograma pérdida beneficio facilidades',
      pantallas: [
        { id: 'FRA-01', slug: 'simulacion', nombre: 'Simulación de fraccionamiento', para: 'Elegir deudas elegibles y ver una propuesta ilustrativa de cuotas.', incr: 'P2-B', rf: ['RF-UTC-042', 'RF-FRA-002', 'RF-FRA-011', 'RF-FRA-012', 'RF-FRA-014'], etapa: 4 },
        { id: 'FRA-02', slug: 'convenio', nombre: 'Convenio y cronograma', para: 'Aprobar el convenio vinculando las deudas, sin crear una segunda deuda cobrable.', incr: 'P2-B', rf: ['RF-UTC-042', 'RF-UTC-064', 'RF-FRA-001', 'RF-FRA-013'], etapa: 4, sensible: true },
        { id: 'FRA-03', slug: 'seguimiento', nombre: 'Seguimiento y pérdida', para: 'Controlar cuotas vencidas y proponer la pérdida con un acto separado.', incr: 'P2-B', rf: ['RF-UTC-043', 'RF-FRA-015', 'RF-FRA-016', 'RF-FRA-017'], etapa: 4 }
      ] },
    { id: 'caja', seccion: 'rc', nombre: 'Caja', icono: 'caja', incr: 'P1-B', estado: 'alcance',
      desc: 'Apertura, cobranza, extornos, cierre, arqueo y conciliación.',
      total: ['cajero', 'supervisor'], lectura: ['auditor'],
      sinonimos: 'cobro pago recibo extorno arqueo cierre tesorería conciliación tupa',
      pantallas: [
        { id: 'CAJ-01', slug: 'apertura', nombre: 'Apertura de caja', para: 'Abrir la sesión de caja del día con su fondo inicial.', incr: 'P1-B', rf: ['RF-UTC-034'], etapa: 4 },
        { id: 'CAJ-02', slug: 'cobranza', nombre: 'Cobranza', para: 'Cobrar deudas seleccionadas con una cotización vigente y emitir el recibo.', incr: 'P1-B', rf: ['RF-UTC-035', 'RF-UTC-036', 'RF-CAJ-003', 'RF-CAJ-004', 'RF-CAJ-005', 'RF-CAJ-006', 'RF-CAJ-007', 'RF-CAJ-008', 'RF-CAJ-009', 'RF-CAJ-011', 'RF-PRE-068'], etapa: 4 },
        { id: 'CAJ-03', slug: 'extornos', nombre: 'Extornos', para: 'Solicitar o aprobar la reversión de un pago, sin borrar el recibo original.', incr: 'P1-B', rf: ['RF-UTC-037', 'RF-UTC-064', 'RF-CAJ-010', 'RF-CAJ-012'], etapa: 4, sensible: true },
        { id: 'CAJ-04', slug: 'cierre', nombre: 'Cierre y arqueo', para: 'Cerrar la caja contando por medio de pago y justificando diferencias.', incr: 'P1-B', rf: ['RF-UTC-034', 'RF-CAJ-013', 'RF-CAJ-014'], etapa: 4 },
        { id: 'CAJ-05', slug: 'conciliacion', nombre: 'Conciliación', para: 'Cruzar lo cobrado en caja con banco y proveedor, y asignar diferencias.', incr: 'P1-B', rf: ['RF-UTC-038', 'RF-CAJ-015', 'RF-CAJ-016'], etapa: 4 }
      ] },

    /* ---------------- Gestión de Deuda ---------------- */
    { id: 'multas', seccion: 'gd', nombre: 'Multas', icono: 'balanza', incr: 'P2-B', estado: 'alcance',
      desc: 'Multas tributarias y sanciones administrativas, por separado.',
      total: ['operador', 'supervisor', 'fiscalizador'], lectura: ['ejecutor', 'auditor'],
      sinonimos: 'infracción sanción ras cuis gradualidad resolución de multa',
      pantallas: [
        { id: 'MUL-01', slug: 'tributarias', nombre: 'Multas tributarias', para: 'Proponer una multa tributaria con su infracción, tabla, gradualidad y caso reproducible.', incr: 'P2-B', rf: ['RF-UTC-046', 'RF-MTR-001', 'RF-MTR-003', 'RF-MTR-006', 'RF-MTR-007', 'RF-MTR-008'], etapa: 5 },
        { id: 'MUL-02', slug: 'administrativas', nombre: 'Sanciones administrativas', para: 'Registrar la notificación de infracción y generar la resolución con su propia autoridad.', incr: 'P2-B', rf: ['RF-UTC-047', 'RF-MAD-001', 'RF-MAD-006', 'RF-MAD-007', 'RF-MAD-008', 'RF-MAD-009', 'RF-MAD-013', 'RF-MAD-014'], etapa: 5 }
      ] },
    { id: 'fiscalizacion', seccion: 'gd', nombre: 'Fiscalización', icono: 'lupaDoc', incr: 'P2-B', estado: 'alcance',
      desc: 'Casos, inspección, declarado frente a fiscalizado y diferencias.',
      total: ['fiscalizador', 'supervisor'], lectura: ['auditor'],
      sinonimos: 'inspección omisos subvaluadores requerimiento ficha técnica',
      pantallas: [
        { id: 'FIS-01', slug: 'bandeja', nombre: 'Bandeja de casos', para: 'Ver casos y requerimientos asignados, y aceptar o descartar candidatos.', incr: 'P2-B', rf: ['RF-UTC-044', 'RF-FIS-001', 'RF-FIS-008'], etapa: 5 },
        { id: 'FIS-02', slug: 'caso', nombre: 'Caso: declarado frente a fiscalizado', para: 'Comparar lo declarado con lo inspeccionado, por predio y por periodo.', incr: 'P2-B', rf: ['RF-UTC-044', 'RF-FIS-002', 'RF-FIS-003', 'RF-FIS-004', 'RF-FIS-007', 'RF-FIS-009'], etapa: 5 },
        { id: 'FIS-03', slug: 'diferencia', nombre: 'Determinación de diferencia', para: 'Determinar la diferencia con su base y norma, y enviarla a revisión antes de emitir.', incr: 'P2-B', rf: ['RF-UTC-045', 'RF-FIS-010', 'RF-FIS-011'], etapa: 5 }
      ] },
    { id: 'coactivo', seccion: 'gd', nombre: 'Coactivo', icono: 'mazo', incr: 'P2-C', estado: 'alcance',
      desc: 'Bandeja, ingreso, REC, medidas, suspensión y levantamiento.',
      total: ['ejecutor'], lectura: ['supervisor', 'auditor'],
      sinonimos: 'ejecución coactiva rec embargo medida cautelar levantamiento retención bancaria expediente',
      pantallas: [
        { id: 'COA-01', slug: 'bandeja', nombre: 'Bandeja coactiva', para: 'Ver expedientes y candidatos con su estado y plazos; el ejecutor decide.', incr: 'P2-C', rf: ['RF-UTC-048', 'RF-COA-001', 'RF-COA-002', 'RF-COA-003'], etapa: 5 },
        { id: 'COA-02', slug: 'ingreso', nombre: 'Evaluar ingreso y emitir REC', para: 'Verificar título, exigibilidad y notificación, y emitir la Resolución de Ejecución Coactiva.', incr: 'P2-C', rf: ['RF-UTC-048', 'RF-COA-001', 'RF-COA-007'], etapa: 5, sensible: true },
        { id: 'COA-03', slug: 'expediente', nombre: 'Expediente coactivo', para: 'Seguir la cronología, resoluciones, medidas, costas y acumulación del expediente.', incr: 'P2-C', rf: ['RF-UTC-049', 'RF-COA-004', 'RF-COA-005', 'RF-COA-006', 'RF-COA-008'], etapa: 5 },
        { id: 'COA-04', slug: 'levantamiento', nombre: 'Suspensión y levantamiento', para: 'Atender en plazo la suspensión o el levantamiento de medidas tras un pago o convenio.', incr: 'P2-C', rf: ['RF-UTC-050'], etapa: 5, sensible: true }
      ] },
    { id: 'descargos', seccion: 'gd', nombre: 'Descargos y transferencias', icono: 'transferencia', incr: 'P2-B', estado: 'alcance',
      desc: 'Compensación, prescripción, exoneración, anulación, transferencias y recursos.',
      total: ['supervisor', 'operador'], lectura: ['auditor'],
      sinonimos: 'anulación compensación prescripción exoneración recurso reclamo apelación',
      pantallas: [
        { id: 'DES-01', slug: 'descargos', nombre: 'Descargos de cuenta corriente', para: 'Solicitar un descargo con expediente y resolución, aprobado por otra persona.', incr: 'P2-B', rf: ['RF-UTC-060', 'RF-UTC-064', 'RF-DES-001', 'RF-DES-002', 'RF-DES-003', 'RF-DES-004', 'RF-DES-005', 'RF-DES-006'], etapa: 5, sensible: true },
        { id: 'DES-02', slug: 'transferencias', nombre: 'Transferencia de pagos', para: 'Pasar un pago a otro contribuyente con movimientos, sin reescribir el recibo.', incr: 'P2-B', rf: ['RF-UTC-014', 'RF-TRA-001', 'RF-TRA-002', 'RF-TRA-003', 'RF-TRA-004'], etapa: 5, sensible: true },
        { id: 'DES-03', slug: 'recursos', nombre: 'Recursos y prescripción', para: 'Tramitar reclamos, apelaciones y prescripciones con plazos y decisión motivada.', incr: 'P2-B', rf: ['RF-UTC-041'], etapa: 5 }
      ] },

    /* ---------------- Gestión y Control ---------------- */
    { id: 'gerencia', seccion: 'gc', nombre: 'Gerencia e indicadores', icono: 'grafico', incr: 'P0-B / P2-D', estado: 'alcance',
      desc: 'Recaudación, conciliado, cartera y expedientes, con fecha de corte.',
      total: ['gerencia', 'supervisor'], lectura: ['auditor'],
      sinonimos: 'dashboard tablero kpi recaudación cartera indicadores',
      pantallas: [
        { id: 'GER-01', slug: 'panel', nombre: 'Panel de indicadores', para: 'Ver los indicadores principales con su definición, fecha de corte y fuente.', incr: 'P0-B', rf: ['RF-UTC-006', 'RF-UTC-055'], etapa: 6 },
        { id: 'GER-02', slug: 'consulta', nombre: 'Consulta de indicadores y proyección', para: 'Preguntar por un indicador en lenguaje natural y ver la cifra que da la consulta.', incr: 'P2-D', rf: ['RF-UTC-055', 'IA-022', 'IA-023'], etapa: 6 }
      ] },
    { id: 'reportes', seccion: 'gc', nombre: 'Reportes', icono: 'informe', incr: 'P1-B / P2-B', estado: 'alcance',
      desc: 'Saldos por cobrar, parte diario, recaudación y cartera.',
      total: ['gerencia', 'supervisor'], lectura: ['cajero', 'auditor'],
      sinonimos: 'parte diario saldos por cobrar exportar excel reporte cajero',
      pantallas: [
        { id: 'REP-01', slug: 'catalogo', nombre: 'Catálogo de reportes', para: 'Generar reportes de caja, recaudación y cartera con exportación auditada.', incr: 'P1-B', rf: ['RF-UTC-055', 'RF-CAJ-013', 'RF-CAJ-014', 'RF-CAJ-015', 'RF-CAJ-016'], etapa: 6 },
        { id: 'REP-02', slug: 'saldos', nombre: 'Saldos por cobrar', para: 'Ver saldo inicial, altas, bajas, ingresos, descargos y saldo final por concepto.', incr: 'P2-B', rf: ['RF-UTC-032', 'RF-UTC-055', 'RF-SPC-001', 'RF-SPC-003', 'RF-SPC-004', 'RF-SPC-006', 'RF-SPC-009', 'RF-SPC-010'], etapa: 6 }
      ] },
    { id: 'maestros', seccion: 'gc', nombre: 'Maestros y parámetros', icono: 'engranaje', incr: 'P0-C / P1-C', estado: 'alcance',
      desc: 'Normas, versiones de parámetros, calendario, catálogos, plantillas y migración.',
      total: ['supervisor', 'operador'], lectura: ['admin', 'auditor', 'gerencia'],
      sinonimos: 'uit tim ipm tramos arancel depreciación calendario vencimientos vías catálogo plantilla migración legado norma ordenanza',
      pantallas: [
        { id: 'MAE-01', slug: 'normas', nombre: 'Normas y evidencias', para: 'Registrar normas con archivo, artículos, publicación y vigencia.', incr: 'P0-C', rf: ['RF-UTC-008'], etapa: 6 },
        { id: 'MAE-02', slug: 'parametros', nombre: 'Parámetros y versiones', para: 'Proponer, revisar y publicar parámetros con fuente, vigencia y revisor distinto.', incr: 'P0-C', rf: ['RF-UTC-009', 'RF-UTC-011', 'RF-PRE-001', 'RF-PRE-002', 'RF-PRE-003', 'RF-PRE-005', 'RF-PRE-007', 'RF-PRE-013', 'RF-PRE-014', 'RF-PRE-015'], etapa: 6, sensible: true },
        { id: 'MAE-03', slug: 'calendario', nombre: 'Calendario legal', para: 'Registrar vencimientos, prórrogas y días hábiles por concepto y periodo.', incr: 'P0-C', rf: ['RF-UTC-010', 'RF-PRE-012', 'RF-ARB-011'], etapa: 6 },
        { id: 'MAE-04', slug: 'catalogos', nombre: 'Catálogos y territorio', para: 'Mantener ubigeo, vías, sectores, catálogos del predio y tarifario de ingresos.', incr: 'P0-C', rf: ['RF-UTC-061', 'RF-PRE-016', 'RF-PRE-017', 'RF-PRE-019', 'RF-PRE-020', 'RF-PRE-021', 'RF-CAJ-001', 'RF-CAJ-002'], etapa: 6 },
        { id: 'MAE-05', slug: 'importacion', nombre: 'Importación de tablas y plantillas', para: 'Validar tablas oficiales antes de publicarlas y versionar plantillas de documentos.', incr: 'P0-C', rf: ['RF-UTC-011', 'RF-UTC-051', 'RF-EMI-001', 'RF-EMI-002', 'RF-EMI-003', 'RF-EMI-004', 'RF-EMI-005', 'RF-EMI-006'], etapa: 6 },
        { id: 'MAE-06', slug: 'migracion', nombre: 'Migración del legado', para: 'Revisar lotes de migración, errores y conciliación por componente.', incr: 'P1-C', rf: ['RF-UTC-057'], etapa: 6 }
      ] },
    { id: 'seguridad', seccion: 'gc', nombre: 'Seguridad y auditoría', icono: 'escudo', incr: 'P0-B', estado: 'alcance',
      desc: 'Usuarios, roles, aprobaciones, capacidades y auditoría.',
      total: ['admin'], lectura: ['auditor'],
      sinonimos: 'usuarios roles permisos mfa sesión auditoría bitácora aprobaciones capacidades',
      pantallas: [
        { id: 'SEG-01', slug: 'usuarios', nombre: 'Usuarios y asignaciones', para: 'Proponer asignaciones de rol con ámbito y vigencia, sujetas a aprobación.', incr: 'P0-B', rf: ['RF-UTC-003', 'RF-UTC-004'], etapa: 6 },
        { id: 'SEG-02', slug: 'roles', nombre: 'Roles y permiso efectivo', para: 'Ver qué permite cada rol y qué puede hacer realmente una persona.', incr: 'P0-B', rf: ['RF-UTC-002', 'RF-UTC-003'], etapa: 6 },
        { id: 'SEG-03', slug: 'aprobaciones', nombre: 'Aprobaciones pendientes', para: 'Revisar las solicitudes sensibles que presentó otra persona.', incr: 'P0-B', rf: ['RF-UTC-064'], etapa: 6 },
        { id: 'SEG-04', slug: 'auditoria', nombre: 'Auditoría', para: 'Consultar quién hizo qué, cuándo y con qué resultado.', incr: 'P0-B', rf: ['RF-UTC-005'], etapa: 6 },
        { id: 'SEG-05', slug: 'capacidades', nombre: 'Capacidades y salud', para: 'Ver qué módulos están habilitados por ejercicio y ámbito, y por qué.', incr: 'P0-B', rf: ['RF-UTC-058', 'RF-UTC-062'], etapa: 6 }
      ] },

    /* ---------------- Asistencia inteligente ---------------- */
    { id: 'ia-cobranza', seccion: 'ia', nombre: 'Bandejas de cobranza', icono: 'filtro', incr: 'P1-B → P2-C', estado: 'ia',
      desc: 'Cartera ordenada por reglas transparentes (IA-006).',
      total: ['supervisor', 'operador', 'ejecutor'], lectura: ['gerencia', 'auditor'],
      sinonimos: 'priorizar cartera morosos gestión cobranza ia-006',
      pantallas: [{ id: 'IA-01', slug: 'bandejas', nombre: 'Bandejas de cobranza', para: 'Ordenar la cartera por reglas visibles para decidir a quién gestionar primero.', incr: 'P1-B', rf: ['IA-006', 'RF-UTC-032', 'RF-UTC-055', 'RF-FRA-016'], etapa: 6 }] },
    { id: 'ia-plazos', seccion: 'ia', nombre: 'Alertas de plazos', icono: 'reloj', incr: 'P2-B / P2-C', estado: 'ia',
      desc: 'Prescripción, caducidad y levantamiento en 24 horas (IA-005).',
      total: ['supervisor', 'ejecutor'], lectura: ['operador', 'auditor'],
      sinonimos: 'prescripción vencimiento plazo 24 horas ley 32678 ia-005',
      pantallas: [{ id: 'IA-02', slug: 'alertas', nombre: 'Alertas de prescripción y plazos', para: 'Ver deudas y medidas con plazos próximos, sin asumir lo que no está registrado.', incr: 'P2-B', rf: ['IA-005', 'RF-UTC-041', 'RF-UTC-048', 'RF-UTC-050', 'RF-DES-003'], etapa: 6 }] },
    { id: 'ia-padron', seccion: 'ia', nombre: 'Calidad del padrón', icono: 'personas', incr: 'P0-C / P1-C', estado: 'ia',
      desc: 'Duplicados, direcciones y documentos (IA-012, IA-013, IA-014).',
      total: ['operador', 'supervisor'], lectura: ['auditor'],
      sinonimos: 'duplicados direcciones ubigeo normalizar homónimo ia-012 ia-013 ia-014',
      pantallas: [
        { id: 'IA-03', slug: 'duplicados', nombre: 'Duplicados posibles', para: 'Revisar pares de registros que podrían ser la misma persona, con evidencias.', incr: 'P0-C', rf: ['IA-012', 'RF-UTC-012', 'RF-UTC-014', 'RF-UTC-057'], etapa: 6 },
        { id: 'IA-04', slug: 'direcciones', nombre: 'Direcciones por normalizar', para: 'Confirmar o corregir direcciones propuestas en formato estructurado.', incr: 'P0-C', rf: ['IA-013', 'IA-014', 'RF-UTC-061', 'RF-UTC-013'], etapa: 6 }
      ] },
    { id: 'ia-atipicos', seccion: 'ia', nombre: 'Atípicos y omisos', icono: 'lupaDoc', incr: 'P1-A → P2-B', estado: 'ia',
      desc: 'Inconsistencias en DJ y cruces internos (IA-008, IA-009).',
      total: ['fiscalizador', 'supervisor'], lectura: ['auditor'],
      sinonimos: 'atípico omiso subvaluador cruce ia-008 ia-009',
      pantallas: [{ id: 'IA-05', slug: 'atipicos', nombre: 'Atípicos en DJ y posibles omisos', para: 'Revisar declaraciones inusuales y posibles omisos para proponer un caso de fiscalización.', incr: 'P1-A', rf: ['IA-008', 'IA-009', 'RF-UTC-015', 'RF-UTC-017', 'RF-UTC-044', 'RF-PRE-039'], etapa: 6 }] },
    { id: 'ia-normativo', seccion: 'ia', nombre: 'Asistente normativo', icono: 'chispa', incr: 'P1-C / P2-B', estado: 'ia',
      desc: 'Respuestas solo desde normas registradas, con cita (IA-001).',
      total: ['operador', 'supervisor', 'fiscalizador', 'ejecutor', 'gerencia', 'auditor', 'admin'], lectura: [],
      sinonimos: 'pregunta norma artículo ordenanza rag consulta legal ia-001',
      pantallas: [{ id: 'IA-06', slug: 'asistente', nombre: 'Asistente normativo', para: 'Consultar qué norma aplica, con cita y vigencia; si no hay fuente, el asistente lo dice.', incr: 'P1-C', rf: ['IA-001', 'RF-UTC-008', 'RF-UTC-010'], etapa: 6 }] },
    { id: 'ia-control', seccion: 'ia', nombre: 'Control interno', icono: 'alertaCampana', incr: 'P0-B → P2-B', estado: 'ia',
      desc: 'Alertas de caja, accesos y descargos (IA-019, IA-020, IA-021).',
      total: ['auditor'], lectura: [],
      sinonimos: 'fraude extornos anomalías accesos reserva tributaria oci ia-019 ia-020 ia-021',
      pantallas: [{ id: 'IA-07', slug: 'alertas', nombre: 'Alertas de control interno', para: 'Atender indicios en caja, accesos y descargos; una alerta no es una acusación.', incr: 'P0-B', rf: ['IA-019', 'IA-020', 'IA-021', 'RF-UTC-005', 'RF-UTC-037', 'RF-UTC-064'], etapa: 6 }] },
    { id: 'ia-gobierno', seccion: 'ia', nombre: 'Gobierno de IA', icono: 'engranaje', incr: 'P0-B → P2-D', estado: 'ia',
      desc: 'Interruptores, registro de inferencias y evaluación.',
      total: ['admin', 'auditor'], lectura: ['supervisor', 'gerencia'],
      sinonimos: 'interruptor inferencias evaluación modelos privacidad',
      pantallas: [{ id: 'IA-08', slug: 'gobierno', nombre: 'Gobierno de IA', para: 'Ver qué capacidades de IA están activas, por qué y cómo se registran sus sugerencias.', incr: 'P0-B', rf: ['RF-UTC-058', 'IA-007', 'IA-023'], etapa: 6 }] },

    /* ---------------- Alcance por confirmar ---------------- */
    alc('alc-espectaculos', 'Espectáculos públicos', 'Espectáculos públicos no deportivos.', 'ticket', 'P2-D', ['RF-ESP-001', 'RF-ESP-002', 'RF-ESP-003', 'RF-ESP-004', 'RF-ESP-005', 'RF-UTC-029'], 'cine bingo espectáculo evento',
      ['operador', 'supervisor'], [
        ['ESP-01', 'eventos', 'Eventos y declaraciones', 'Registrar el evento, el local y la declaración de entradas vendidas.'],
        ['ESP-02', 'liquidacion', 'Liquidación del espectáculo', 'Calcular el impuesto del evento y emitir la orden de pago.']]),
    alc('alc-merced', 'Merced conductiva', 'Alquileres, convenios y concesiones.', 'contrato', 'P2-D', ['RF-MER-001', 'RF-MER-002', 'RF-MER-003', 'RF-UTC-031'], 'alquiler concesión convenio contrato',
      ['operador', 'supervisor'], [
        ['MER-01', 'contratos', 'Contratos de alquiler y concesión', 'Registrar cada contrato con su arrendatario, bien, cuota y vigencia.'],
        ['MER-02', 'cuotas', 'Cuotas del contrato', 'Ver las cuotas generadas por el contrato, pagadas y por pagar.']]),
    alc('alc-ambulatorio', 'Comercio ambulatorio', 'Vendedores autorizados y su cuenta.', 'tienda', 'P2-D', ['RF-AMB-001', 'RF-AMB-002', 'RF-AMB-003', 'RF-UTC-030'], 'ambulante vendedor vía pública',
      ['operador', 'supervisor'], [
        ['AMB-01', 'padron', 'Padrón de vendedores', 'Registrar al vendedor autorizado con su giro, horario y ubicación.'],
        ['AMB-02', 'cuenta', 'Cuenta del vendedor', 'Ver lo que debe y lo que pagó cada vendedor, e imprimir su estado de cuenta.']]),
    alc('alc-vehicular', 'Vehicular', 'Impuesto al patrimonio vehicular.', 'carro', 'P2-A', ['RF-UTC-024', 'RF-UTC-025'], 'vehículo placa auto patrimonio',
      ['operador', 'supervisor'], [
        ['VEH-01', 'vehiculos', 'Registro de vehículos', 'Registrar el vehículo, su propietario y la fecha de su primera inscripción.'],
        ['VEH-02', 'liquidacion', 'Declaración y liquidación vehicular', 'Calcular el impuesto de los años afectos y emitir sus cuotas.']]),
    alc('alc-alcabala', 'Alcabala', 'Impuesto a la transferencia de inmuebles.', 'llave', 'P2-A', ['RF-UTC-026', 'RF-UTC-027'], 'transferencia compraventa inmueble',
      ['operador', 'supervisor'], [
        ['ALB-01', 'transferencia', 'Registro de transferencia', 'Registrar la compraventa: comprador, vendedor, inmueble, fecha y valor.'],
        ['ALB-02', 'liquidacion', 'Liquidación de alcabala', 'Calcular el impuesto con el tramo no afecto y emitir la deuda del comprador.']]),
    alc('alc-apuestas', 'Apuestas y juegos', 'Impuestos a las apuestas y a los juegos, según modalidad.', 'dados', 'P2-D', ['RF-UTC-028'], 'apuesta juego bingo lotería',
      ['operador', 'supervisor'], [
        ['APU-01', 'declaraciones', 'Declaraciones mensuales', 'Registrar la declaración mensual del organizador y calcular el impuesto.']]),
    alc('alc-portal', 'Portal del contribuyente', 'Consulta y pago en línea del propio contribuyente.', 'monitor', 'P2-D', ['RF-WEB-001', 'RF-WEB-011', 'RF-WEB-012', 'RF-WEB-015', 'RF-WEB-016', 'RF-UTC-053', 'RF-UTC-054'], 'web en línea ciudadano pago online constancia no adeudo',
      ['supervisor'], [
        ['WEB-01', 'consulta', 'Mi deuda en línea', 'Vista del contribuyente: consultar su deuda resumida o detallada desde casa.'],
        ['WEB-02', 'pago', 'Pago en línea', 'Vista del contribuyente: pagar con tarjeta o banca por internet y descargar el recibo.'],
        ['WEB-03', 'constancias', 'Constancias en línea', 'Vista del contribuyente: solicitar y descargar la constancia de no adeudo.']])
  ];
  delete R._alc;

  /* Pantallas globales */
  R.pantallasGlobales = [
    { id: 'GEN-01', ruta: 'perfil', nombre: 'Selector de perfil', incr: 'P0-B', rf: ['RF-UTC-002', 'RF-UTC-007'], para: 'Elegir con qué perfil recorrer el prototipo.' },
    { id: 'GEN-02', ruta: 'inicio', nombre: 'Inicio', incr: 'P0-B', rf: ['RF-UTC-006', 'RF-UTC-007'], para: 'Ver los módulos disponibles para tu perfil y entrar al flujo central.' },
    { id: 'GEN-03', ruta: 'pendientes', nombre: 'Panel de pendientes', incr: '—', rf: [], para: 'Ver y filtrar lo que falta confirmar con la Municipalidad en enero.' },
    { id: 'GEN-04', ruta: 'glosario', nombre: 'Glosario', incr: '—', rf: ['RNF-09'], para: 'Entender en palabras simples los términos tributarios que usa el sistema.' },
    { id: 'GEN-05', ruta: 'error', nombre: 'Error, sin permiso o no encontrado', incr: 'P0-B', rf: ['RF-UTC-002', 'RNF-05'], para: 'Explicar qué pasó y qué puedes hacer.' },
    { id: 'GEN-07', ruta: 'ingreso', nombre: 'Ingreso al sistema', incr: 'P0-B', rf: ['RF-UTC-001', 'RF-UTC-004'], para: 'Ingresar con el usuario institucional y la verificación en dos pasos.' },
    { id: 'GEN-08', ruta: 'cuestionario', nombre: 'Cuestionario para la Municipalidad', incr: '—', rf: [], para: 'Preguntas en lenguaje simple para enviar a la Municipalidad, agrupadas por área y listas para imprimir.' },
    { id: 'GEN-06', ruta: 'componentes', nombre: 'Componentes del prototipo', incr: '—', rf: [], para: 'Ver los componentes de la guía de estilo funcionando, para revisarlos y ajustarlos.' }
  ];

  /* Flujo central (franja del Inicio) */
  R.flujo = [
    { n: 1, nombre: 'Contribuyente', ruta: 'contribuyentes/ficha/CTB-000101', modulo: 'contribuyentes' },
    { n: 2, nombre: 'Predio', ruta: 'predios/ficha/PRD-000201', modulo: 'predios' },
    { n: 3, nombre: 'DJ', ruta: 'declaraciones/asistente', modulo: 'declaraciones' },
    { n: 4, nombre: 'Determinación', ruta: 'determinacion/predial', modulo: 'determinacion' },
    { n: 5, nombre: 'Estado de cuenta', ruta: 'cuenta/estado/CTB-000101', modulo: 'cuenta' },
    { n: 6, nombre: 'Caja', ruta: 'caja/cobranza', modulo: 'caja' },
    { n: 7, nombre: 'Fraccionamiento', ruta: 'fraccionamiento/simulacion', modulo: 'fraccionamiento' },
    { n: 8, nombre: 'Coactivo', ruta: 'coactivo/bandeja', modulo: 'coactivo' }
  ];
})(window.RENTAS = window.RENTAS || {});
