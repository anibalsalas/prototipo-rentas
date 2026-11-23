/* Íconos SVG propios (trazo 1.75, 24×24, currentColor). Uso: R.icono('caja'). */
(function (R) {
  'use strict';
  var P = {
    inicio: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    persona: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
    personas: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.5 3.6-5.5 6.5-5.5s5.5 2 6.5 5.5"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4"/><path d="M18 14.8c1.7.7 2.9 2.4 3.5 5.2"/>',
    casa: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9v12h14V9"/><rect x="9.5" y="13" width="5" height="8"/>',
    documento: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
    calculadora: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8"/><path d="M8.5 12h1M12 12h0M15 12h.5M8.5 16h1M12 16h0M15 16h.5"/>',
    hoja: '<path d="M5 20c0-9 5-15 15-16-1 10-7 15-15 16z"/><path d="M5 20l7-7"/>',
    etiqueta: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>',
    libro: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/><path d="M8 7h7M8 11h7"/>',
    sello: '<path d="M9 3h6l-1 7h-4z"/><path d="M5 14h14v3H5z"/><path d="M7 21h10"/><path d="M10 10h4l1 4H9z"/>',
    calendario: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="M7 14h2M11 14h2M15 14h2M7 17h2M11 17h2"/>',
    caja: '<rect x="3" y="10" width="18" height="10" rx="1.5"/><path d="M6 10V5h8v5"/><path d="M16 7h3v3"/><path d="M7 14h2M11 14h2M15 14h2"/>',
    balanza: '<path d="M12 3v18M7 21h10"/><path d="M5 7h14"/><path d="M5 7 2.5 13h5zM19 7l-2.5 6h5z"/>',
    lupaDoc: '<path d="M13 3H5v18h6"/><path d="M13 3v4h4v3"/><circle cx="16" cy="16" r="3.5"/><path d="m18.5 18.5 2.5 2.5"/>',
    mazo: '<path d="m13 4 7 7"/><path d="m10.5 6.5 7 7"/><path d="m11.8 5.2 7 7"/><path d="m14 10-9.5 9.5"/><path d="M3 21h8"/>',
    transferencia: '<path d="M4 8h13l-3-3"/><path d="M20 16H7l3 3"/>',
    grafico: '<path d="M4 20V4"/><path d="M4 20h16"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/>',
    informe: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M9 17v-3M12 17v-5M15 17v-2"/>',
    engranaje: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
    escudo: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><rect x="9" y="11" width="6" height="5" rx="1"/><path d="M10 11V9.5a2 2 0 0 1 4 0V11"/>',
    chispa: '<path d="M12 3c.6 4 2 5.4 6 6-4 .6-5.4 2-6 6-.6-4-2-5.4-6-6 4-.6 5.4-2 6-6z"/><path d="M19 15c.3 1.8.9 2.4 2.5 2.7-1.6.3-2.2.9-2.5 2.7-.3-1.8-.9-2.4-2.5-2.7 1.6-.3 2.2-.9 2.5-2.7z"/>',
    pregunta: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7v.5"/><path d="M12 17.2v.1"/>',
    candado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    rombo: '<path d="M12 3 21 12 12 21 3 12z"/>',
    alerta: '<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.1"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 3 3 5-6"/>',
    error: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.1"/>',
    cerrar: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    buscar: '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    flechaIzq: '<path d="M15 5l-7 7 7 7"/>',
    flechaDer: '<path d="M9 5l7 7-7 7"/>',
    colapsar: '<path d="M4 4v16"/><path d="M17 7l-5 5 5 5"/>',
    expandir: '<path d="M4 4v16"/><path d="M11 7l5 5-5 5"/>',
    orden: '<path d="M8 10l4-4 4 4M8 14l4 4 4-4"/>',
    ordenAsc: '<path d="M8 14l4-4 4 4"/>',
    ordenDesc: '<path d="M8 10l4 4 4-4"/>',
    descargar: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4 19h16"/>',
    entrada: '<path d="M14 4h5v16h-5"/><path d="M3 12h11M10 8l4 4-4 4"/>',
    ticket: '<path d="M3 7h18v3a2 2 0 0 0 0 4v3H3v-3a2 2 0 0 0 0-4z"/><path d="M13 7v10" stroke-dasharray="2 2"/>',
    tienda: '<path d="M4 9 5.5 4h13L20 9"/><path d="M4 9h16v2a3 3 0 0 1-5.3 1.9A3 3 0 0 1 12 14a3 3 0 0 1-2.7-1.1A3 3 0 0 1 4 11z"/><path d="M5 14v6h14v-6"/>',
    carro: '<path d="M3 16v-4l2-5h14l2 5v4z"/><circle cx="7.5" cy="16.5" r="1.8"/><circle cx="16.5" cy="16.5" r="1.8"/><path d="M5 12h14"/>',
    llave: '<circle cx="8" cy="15" r="4"/><path d="m11 12 9-9M17 6l2 2M15 8l2 2"/>',
    dados: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 9h.1M15 9h.1M12 12h.1M9 15h.1M15 15h.1"/>',
    monitor: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    contrato: '<path d="M14 3H6v18h12V7z"/><path d="M14 3v4h4"/><path d="M8 17c1.5-2 2.5-2 3 0s1.5 2 3 0"/>',
    reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    alertaCampana: '<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    filtro: '<path d="M4 5h16l-6 7v6l-4 2v-8z"/>',
    ojo: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    salir: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M9 16l-4-4 4-4M5 12h11"/>'
  };
  R.icono = function (nombre, clase, etiqueta) {
    var d = P[nombre] || P.rombo;
    var a = etiqueta ? ' role="img" aria-label="' + R.esc(etiqueta) + '"' : ' aria-hidden="true" focusable="false"';
    return '<svg class="icono ' + (clase || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"' + a + '>' + d + '</svg>';
  };
  R.iconosDisponibles = Object.keys(P);
})(window.RENTAS = window.RENTAS || {});
