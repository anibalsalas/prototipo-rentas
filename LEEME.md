# Demostración del Sistema de Rentas

Esta carpeta muestra **cómo quedará el sistema de rentas terminado**, con todos sus módulos y las capacidades de asistencia inteligente. Usa **datos de ejemplo**: las personas, los documentos y los montos no son reales. No es el sistema en funcionamiento y no tiene valor legal.

## Cómo abrirla

1. Abre la carpeta `docs/prototipo/`.
2. Haz doble clic en `index.html`. Funciona sin internet y sin instalar nada, en Edge, Chrome o Firefox actuales.
3. Aparece la pantalla **Ingresar al sistema**. En «Usuarios de demostración», elige un usuario (por ejemplo `cajero.demo`): se completan el usuario y la contraseña. Pulsa **Continuar**, escribe cualquier código de 6 dígitos (por ejemplo `123456`) y pulsa **Ingresar**.
4. Cada usuario tiene un perfil: Operador de Rentas, Cajero, Fiscalizador, Ejecutor coactivo, Supervisor, Gerencia, Administrador o Auditor. Cada perfil ve los módulos y acciones de su cargo; lo que no puede usar aparece atenuado con el motivo. Para cambiar de usuario, usa **Cerrar sesión** en la barra superior.

La sesión se cierra al cerrar la pestaña. La demostración no guarda contraseñas.

**Atajo:** para entrar sin pasar por el ingreso, agrega `?como=<perfil>` al final de la dirección, por ejemplo `index.html#/inicio?como=cajero`. Los perfiles son `operador`, `cajero`, `fiscalizador`, `ejecutor`, `supervisor`, `gerencia`, `admin` y `auditor`.

## Recorrido sugerido para la reunión (unos 25 minutos)

| Paso | Usuario | Dónde | Qué mostrar |
|---|---|---|---|
| 1 | Cualquiera | Ingreso | El ingreso en dos pasos: usuario y contraseña, luego un código de verificación |
| 2 | `operador.demo` | Inicio | Los módulos agrupados por área y el recorrido completo de arriba |
| 3 | `operador.demo` | Contribuyentes → buscar «Ana Prueba» | El aviso de personas con el mismo nombre y la ficha completa |
| 4 | `operador.demo` | Predios y Declaraciones juradas | La declaración en 5 pasos y la revisión automática de datos incoherentes |
| 5 | `operador.demo` | Determinación | El impuesto predial explicado paso a paso, con sus cuotas |
| 6 | `operador.demo` y `supervisor.demo` | Emisión masiva 2027 | Preparación, simulación con revisión previa, aprobación del supervisor y cuponera con control de reparto |
| 7 | `supervisor.demo` | Amnistía tributaria y beneficios → Campañas | Activar la campaña de demostración y ver el descuento en el estado de cuenta y en caja |
| 8 | `cajero.demo` | Estado de cuenta → marcar deudas → Cobrar en caja | El cobro con recibo (con el descuento de amnistía si la campaña está activa); prueba «simular corte de conexión»: no se cobra dos veces |
| 9 | `cajero.demo` y luego `supervisor.demo` | Caja → Extornos | El cajero solicita y el supervisor aprueba con su propio código |
| 10 | `operador.demo` y `supervisor.demo` | Fraccionamiento | La simulación de cuotas y la aprobación del convenio |
| 11 | `coactivo.demo` | Coactivo | La revisión antes de iniciar y el levantamiento en 24 horas |
| 12 | `gerencia.demo` | Gerencia e indicadores | Los indicadores con gráficos y la consulta en palabras simples |
| 13 | `operador.demo` | Asistente normativo | La respuesta con la norma citada, y cómo se abstiene cuando no hay norma cargada |

## Qué contiene

| Área | Módulos |
|---|---|
| Administración Tributaria | Contribuyentes, Predios, Declaraciones juradas, Determinación, Emisión masiva 2027, Arbitrios, Amnistía tributaria y beneficios |
| Recaudación y Cobranza | Cuenta corriente (estado de cuenta), Valores, Fraccionamiento, Caja |
| Gestión de Deuda | Multas, Fiscalización, Coactivo, Descargos y transferencias |
| Gestión y Control | Gerencia e indicadores, Reportes, Maestros y parámetros, Seguridad y auditoría |
| Asistencia inteligente | Bandejas de cobranza, alertas de plazos, calidad del padrón, atípicos y omisos, asistente normativo, control interno y gobierno de la IA. Siempre sugiere; decide una persona |
| Módulos por confirmar | Espectáculos, Merced conductiva, Comercio ambulatorio, Vehicular, Alcabala, Apuestas y juegos, Portal del contribuyente. Completos, con la insignia «Módulo por confirmar» |

### Emisión masiva 2027

Prepara la emisión del impuesto predial 2027 de todos los contribuyentes en cuatro pantallas: **Preparación** (qué datos oficiales usa y cuáles faltan), **Simulación** (calcula a todos sin crear deudas y señala los casos dudosos), **Aprobación y emisión** (un supervisor distinto de quien preparó aprueba; si el proceso se corta, continúa sin duplicar) y **Cuponera y reparto** (vista previa de la cuponera y avance de entrega por sector). La emisión definitiva queda deshabilitada mientras falten datos oficiales; en la demostración, una casilla simula que ya llegaron.

### Amnistía tributaria y beneficios

La campaña de amnistía se configura con su ordenanza, su vigencia y sus porcentajes. Con el botón **Activar campaña de demostración**, el estado de cuenta muestra el monto sin amnistía tachado y el monto a pagar; caja cobra el monto con descuento y el recibo lo detalla. Si se paga solo una parte, no se aplica el descuento. Los porcentajes y fechas son de ejemplo.

## Valores de ejemplo

Donde falta un dato oficial de la Municipalidad (tasas, formatos, calendario, ordenanzas), la pantalla se ve terminada con un valor de ejemplo y una marca **«Por confirmar»**. Al confirmarse el dato, la marca cambia a «Confirmado».

## Cómo actualizar

- **Dato confirmado:** en `data/pendientes.js`, cambia `estado` a `'cerrado'` y escribe en `cierre` lo decidido. La marca cambia a «Confirmado» en todas las pantallas.
- **Logo y colores oficiales:** reemplaza `img/logo-placeholder.svg` y los tres colores `--c-primario*` de `css/tokens.css`.
- **Formato de montos:** se cambia en un solo lugar (`R.fmt.moneda` en `js/util.js`).

## Accesibilidad

Se puede usar completo con el teclado y tiene foco visible, contraste AA comprobado, aumento del tamaño del texto (A− / A+) y diseño adaptable desde 360 px de ancho, como un celular. En pantallas angostas, las tablas anchas se desplazan dentro de su propio recuadro.
