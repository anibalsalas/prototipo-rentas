/* Contenido de las pantallas «Alcance por confirmar» (ALC-01..07).
   Fuentes: matrices/brechas-reclasificadas-234.csv, docs/02, docs/03, docs/04, docs/12. */
(function (R) {
  R.alcance = {
    'alc-espectaculos': {
      comoFunciona: ['Se registra cada evento con su local, organizador y fechas.', 'El organizador declara las entradas vendidas y el sistema calcula el impuesto.', 'Se emite la orden de pago y se cobra en caja.'],
      competenciaCliente: 'La municipalidad del distrito donde se realiza el espectáculo.',
      queEs: 'Impuesto a los espectáculos públicos no deportivos (cine, conciertos y otros) del distrito donde se realizan.',
      tdr: 'El TdR pide registrar DJ de bingo y cines, emitir la liquidación, la cuenta corriente, la Orden de Pago y la Resolución de Multa (RF-ESP-001..005). La matriz lo marca como «candidato nuevo, no está en el índice del TdR».',
      competencia: 'Distrito donde se realiza el espectáculo (TUO de Tributación Municipal, arts. 54–59). La tasa depende de la clase de espectáculo; bingo y cine no comparten tasa (RF-UTC-029).',
      seSabe: ['Hay una regla nacional verificada por clase de espectáculo (docs/02).', 'Diseño propuesto: estrategia por modalidad, sin elegir tasa por texto libre (RN-14).'],
      falta: ['Si existe actividad gravada en el ámbito.', 'Agente perceptor y garantía.', 'Si el módulo entra al alcance contratado.']
    },
    'alc-merced': {
      comoFunciona: ['Se registra cada contrato de alquiler o concesión con su cuota y vigencia.', 'El sistema genera las cuotas mensuales según el contrato.', 'Las cuotas se pagan en caja y se ven en el estado de cuenta, separadas de los tributos.'],
      competenciaCliente: 'La Municipalidad, según cada contrato.',
      queEs: 'Ingresos por alquileres, convenios y concesiones de bienes municipales.',
      tdr: 'El TdR pide registrar los contratos, generar la deuda según los contratos vigentes y emitir su cuenta corriente (RF-MER-001..003). La matriz lo marca como «candidato nuevo».',
      competencia: 'Son ingresos contractuales, no tributarios: se rigen por el contrato (cuota, reajuste y penalidad), no por la TIM ni por las infracciones tributarias (RN-15).',
      seSabe: ['El SRS lo cubre con RF-UTC-031.', 'Deben separarse del régimen tributario en la cuenta y en los reportes.'],
      falta: ['Contratos vigentes y sus cláusulas (B07).', 'Área responsable de cada contrato.', 'Si el módulo entra al alcance contratado.']
    },
    'alc-ambulatorio': {
      comoFunciona: ['Se registra al vendedor autorizado con su giro, horario y ubicación.', 'El sistema genera lo que debe pagar según la ordenanza.', 'El vendedor paga en caja y se puede imprimir su estado de cuenta.'],
      competenciaCliente: 'La Municipalidad, según su ordenanza y la autorización del área competente.',
      queEs: 'Cobro a vendedores ambulantes autorizados, por la tasa o derecho que fije la ordenanza.',
      tdr: 'El TdR pide registrar al vendedor con giro, horario y ubicación, generar su cuenta corriente e imprimir su estado de cuenta (RF-AMB-001..003). La matriz lo marca como «candidato nuevo».',
      competencia: 'Tasa o derecho según ordenanza y autorización del área competente. No es un impuesto nuevo.',
      seSabe: ['El SRS lo cubre dentro de tasas y derechos (RF-UTC-030).', 'La autorización la otorga otra área; Rentas registra y cobra.'],
      falta: ['Ordenanza y tasa vigentes.', 'Área que autoriza y su procedimiento.', 'Si el módulo entra al alcance contratado.']
    },
    'alc-vehicular': {
      comoFunciona: ['Se registra el vehículo, su propietario y la fecha de su primera inscripción.', 'El sistema calcula el impuesto de cada año afecto con la tabla oficial del MEF.', 'Las cuotas se cobran en caja y se ven en el estado de cuenta.'],
      competenciaCliente: 'La municipalidad provincial del domicilio del propietario.',
      queEs: 'Impuesto anual al patrimonio vehicular, a cargo de la municipalidad provincial del domicilio del propietario.',
      tdr: 'No figura en las 234 filas del TdR. Sí está en el SRS (RF-UTC-024, RF-UTC-025) y en el plan como incremento P2-A, que aclara que no es opcional.',
      competencia: 'Municipalidad provincial del domicilio del propietario (TUO de Tributación Municipal, art. 30-A). Se aplica durante tres años desde la primera inscripción en SUNARP.',
      seSabe: ['Tasa y mínimo nacionales verificados (docs/02).', 'Tabla de valores 2026 publicada por el MEF (RM 008-2026-EF/15), por importar completa.'],
      falta: ['Procedimiento vehicular de la Municipalidad.', 'Fuente registral disponible (convenio SUNARP, B11).', 'Si entra al alcance contratado.']
    },
    'alc-alcabala': {
      comoFunciona: ['Se registra la compraventa con comprador, vendedor, inmueble y valor.', 'El sistema compara valores, descuenta el tramo no afecto y calcula el impuesto.', 'El comprador paga en caja y recibe su constancia.'],
      competenciaCliente: 'Por regla general, la municipalidad del distrito del inmueble; fuera del cercado depende de lo que se confirme.',
      queEs: 'Impuesto a la transferencia de inmuebles; lo paga el comprador.',
      tdr: 'No figura en las 234 filas del TdR. Sí está en el SRS (RF-UTC-026, RF-UTC-027) y en el plan como incremento P2-A.',
      competencia: 'Regla distrital, con una excepción provincial ligada al Fondo de Inversión Municipal (TUO, arts. 21–29). Fuera del cercado depende del FIM.',
      seSabe: ['Tasa y tramo no afecto nacionales verificados (docs/02).', 'Se diseña con una liquidación por operación, sin doble cobro por reintento.'],
      falta: ['Existencia y alcance del FIM de la provincia (B05).', 'Si entra al alcance contratado.']
    },
    'alc-apuestas': {
      comoFunciona: ['El organizador presenta una declaración mensual.', 'El sistema calcula el impuesto según la modalidad.', 'Se emite la deuda y se cobra en caja.'],
      competenciaCliente: 'Depende de la modalidad: la provincia o el distrito.',
      queEs: 'Impuestos a las apuestas y a los juegos, según la modalidad.',
      tdr: 'No figura en las 234 filas del TdR. El SRS lo incluye (RF-UTC-028).',
      competencia: 'Apuestas: provincia de la sede de la entidad organizadora. Juegos: distrito o provincia según la modalidad (TUO, arts. 38–53). Casinos y juegos a distancia tienen régimen especial.',
      seSabe: ['La modalidad define base, sujeto, competencia y calendario.', 'docs/12: no hay prueba de que hoy se cobre; se puede diseñar, no afirmar recaudación.'],
      falta: ['Modalidades presentes en la provincia.', 'Si entra al alcance contratado.']
    },
    'alc-portal': {
      comoFunciona: ['El contribuyente entra con su cuenta y ve solo su deuda.', 'Puede pagar en línea y descargar su recibo.', 'Puede descargar su constancia de no adeudo.'],
      competenciaCliente: 'La Municipalidad, a través de su página web.',
      queEs: 'Portal en línea para que el contribuyente consulte su deuda, pague y obtenga constancias.',
      tdr: 'El TdR pide pagos en línea, consulta resumida o detallada, filtros, proyección, recibos, historial y constancias de no adeudo y de prescripción (RF-WEB-001..016).',
      competencia: 'Servicio institucional. La cuenta del ciudadano es distinta de las de los trabajadores y solo ve lo propio o lo que representa (RF-UTC-053).',
      seSabe: ['El pago se confirma solo por aviso autenticado del proveedor, nunca por el retorno del navegador (RF-UTC-054).', 'La explicación del estado de cuenta en el portal (IA-003) y el asistente de trámites (IA-004) son de P2-D.'],
      falta: ['Mecanismo de identidad ciudadana.', 'Proveedor de pagos y convenio (B11).', 'Constancias que la Municipalidad emitirá en línea.']
    }
  };
})(window.RENTAS = window.RENTAS || {});
