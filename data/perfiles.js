/* Perfiles de demostración (plantillas, no cargos del ROF: PE-002).
   En el sistema real la autorización la decide el backend (RN-26). */
(function (R) {
  R.perfiles = [
    { id: 'operador', nombre: 'Operador de Rentas', añadido: true,
      descripcion: 'Registra contribuyentes, predios y DJ; simula y emite la determinación.',
      puede: ['Registrar personas y predios', 'Preparar y presentar DJ', 'Simular y emitir determinación', 'Solicitar descargos y fusiones'],
      noPuede: ['Aprobar sus propias solicitudes', 'Cobrar en caja'] },
    { id: 'cajero', nombre: 'Cajero',
      descripcion: 'Abre y cierra caja, cobra y solicita extornos.',
      puede: ['Abrir y cerrar caja', 'Cotizar y confirmar pagos', 'Emitir duplicado de recibo', 'Solicitar extorno'],
      noPuede: ['Aprobar su propio extorno', 'Cambiar la deuda base', 'Emitir valores'] },
    { id: 'fiscalizador', nombre: 'Fiscalizador',
      descripcion: 'Atiende casos asignados, inspecciona y propone diferencias.',
      puede: ['Ver casos asignados', 'Registrar inspecciones', 'Proponer diferencias', 'Revisar candidatos de IA'],
      noPuede: ['Emitir valores', 'Ver expedientes no asignados'] },
    { id: 'ejecutor', nombre: 'Ejecutor coactivo',
      descripcion: 'Evalúa el ingreso a coactivo, emite REC, ordena medidas y levantamientos.',
      puede: ['Evaluar exigibilidad', 'Emitir REC', 'Ordenar y levantar medidas'],
      noPuede: ['Cobrar en caja', 'Cambiar parámetros'] },
    { id: 'supervisor', nombre: 'Supervisor',
      descripcion: 'Aprueba como segunda persona: extornos, descargos, fusiones, convenios y parámetros.',
      nota: 'En el sistema real son roles distintos: Supervisor de Rentas, de Tesorería y Resolutor.',
      puede: ['Aprobar solicitudes de otras personas', 'Publicar parámetros revisados', 'Emitir valores'],
      noPuede: ['Aprobar una solicitud que él mismo presentó'] },
    { id: 'gerencia', nombre: 'Gerencia',
      descripcion: 'Consulta indicadores y reportes; no modifica datos.',
      puede: ['Ver indicadores con fecha de corte', 'Generar reportes', 'Consultar indicadores en lenguaje natural'],
      noPuede: ['Cualquier operación que cambie datos'] },
    { id: 'admin', nombre: 'Administrador',
      descripcion: 'Administra usuarios, roles, capacidades y auditoría técnica.',
      puede: ['Proponer asignaciones de rol', 'Revocar sesiones', 'Gestionar capacidades'],
      noPuede: ['Condonar, cobrar o emitir REC (RN-26)', 'Ver deuda de contribuyentes'] },
    { id: 'auditor', nombre: 'Auditor / Control interno', añadido: true,
      descripcion: 'Recibe alertas de control interno y consulta la auditoría.',
      puede: ['Atender alertas de caja, accesos y descargos', 'Consultar y exportar auditoría autorizada'],
      noPuede: ['Cambiar deuda o parámetros'] }
  ];
})(window.RENTAS = window.RENTAS || {});
