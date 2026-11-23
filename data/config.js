/* Configuración general del prototipo. Datos ficticios, no vinculantes. */
(function (R) {
  R.config = {
    sistema: 'Sistema de Rentas',
    entidad: 'Municipalidad (nombre por confirmar, PE-001)',
    ejercicio: 2027,
    ejercicios: [2027, 2026, 2025],
    fechaCorte: '2027-03-15',          // fecha ficticia de demostración
    ambito: 'Cercado (Bagua Grande)',  // PE-003
    contribuyenteDemo: 'CTB-000101',   // Ana Prueba Quispe (ficticia)
    version: '1.0 · versión para la Municipalidad',
    vista: 'cliente'                   // 'cliente' oculta códigos técnicos (IDs, RF, incrementos)
  };
})(window.RENTAS = window.RENTAS || {});
