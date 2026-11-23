/* =====================================================================
   DATOS DE EJEMPLO — Emisión masiva 2027. Cifras FICTICIAS (céntimos enteros).
   ===================================================================== */
(function (R) {
  R.datos.emision = {
    lote: 'EM-2027-001',
    parametros: [
      { nombre: 'UIT del ejercicio', estado: 'ejemplo', detalle: 'Se usa la UIT 2026 (S/ 5,500) hasta que el MEF publique la de 2027', pend: 'PE-046' },
      { nombre: 'Tramos y tasas del impuesto predial', estado: 'listo', detalle: 'Ley de Tributación Municipal, art. 13' },
      { nombre: 'Aranceles, valores unitarios y depreciación 2027', estado: 'falta', detalle: 'Por cargar desde las tablas oficiales', pend: 'PE-040' },
      { nombre: 'Vencimientos y número de cuotas 2027', estado: 'falta', detalle: 'Por registrar en el calendario legal', pend: 'PE-042' },
      { nombre: 'Derecho de emisión 2027', estado: 'falta', detalle: 'Ordenanza y estudio de costos', pend: 'PE-043' },
      { nombre: 'Régimen de arbitrios 2027', estado: 'opcional', detalle: 'Se agrega al lote solo si la ordenanza está vigente', pend: 'PE-050' },
      { nombre: '«Porcentaje adicional por PU»', estado: 'no', detalle: 'Sin sustento identificado: no se aplica', pend: 'PE-044' }
    ],
    resumen: { contribuyentes: 4812, predios: 6230, listos: 4790, observados: 22,
      conceptos: [['Impuesto predial', 81240000], ['Derecho de emisión (ejemplo)', 3850000]] },
    rangos: [['Hasta S/ 100', 2210], ['S/ 100 a S/ 300', 1640], ['S/ 300 a S/ 1,000', 760], ['Más de S/ 1,000', 180]],
    observados: [
      { codigo: 'CTB-000140', nombre: 'Ana Prueva Quispe', motivo: 'Posible duplicado de CTB-000101', origen: 'Revisión previa (IA)', accion: 'Resolver antes de emitir' },
      { codigo: 'CTB-000877', nombre: 'Contribuyente Demo 877', motivo: 'Predio sin valor de terreno', origen: 'Validación', accion: 'Completar la ficha del predio' },
      { codigo: 'CTB-001204', nombre: 'Contribuyente Demo 1204', motivo: 'Copropiedad suma 120 %', origen: 'Validación', accion: 'Corregir la titularidad' },
      { codigo: 'CTB-002318', nombre: 'Contribuyente Demo 2318', motivo: 'Área construida 3 veces mayor que la declarada el año anterior', origen: 'Revisión previa (IA)', accion: 'Confirmar con la declaración' },
      { codigo: 'CTB-003051', nombre: 'Contribuyente Demo 3051', motivo: 'Domicilio fiscal sin sector', origen: 'Revisión previa (IA)', accion: 'Ordenar la dirección' }
    ],
    reparto: [
      { sector: 'Sector Centro', cuponeras: 1620, impresas: 1620, entregadas: 1310, devueltas: 18 },
      { sector: 'Sector Norte', cuponeras: 1385, impresas: 1385, entregadas: 960, devueltas: 25 },
      { sector: 'Sector Sur', cuponeras: 1240, impresas: 1240, entregadas: 702, devueltas: 11 },
      { sector: 'Sector Ejemplo Alto', cuponeras: 545, impresas: 0, entregadas: 0, devueltas: 0 }
    ]
  };
})(window.RENTAS = window.RENTAS || {});
