window.ISC = window.ISC || {};
ISC.content = {
  profile: {
    nombre: "Lucas Valencia Acosta",
    corto: "Lucas",
    inicial: "L",
    email: "lucasvalencia6bnazareth@gmail.com",
    whatsappSoporte: "573135302569",
    grupoWhatsApp: "https://chat.whatsapp.com/II6X7tHYui7JpmPZMWbWaw?mode=gi_t"
  },

  tools: [
    { id:"producto", icon:"search", title:"Checklist de producto ganador", desc:"Pasa tu producto por los filtros antes de venderlo.", step:"Paso 1" },
    { id:"costeo", icon:"calc", title:"Calculadora de costeo", desc:"Precio, costo, envío y CPA: cuánto ganas por venta.", step:"Paso 2" },
    { id:"meta", icon:"flame", title:"Meta de facturación", desc:"Cuántas ventas, chats y pauta necesitas para tu meta.", step:"Paso 2" },
    { id:"guion", icon:"video", title:"Creador de guiones", desc:"Llena 4 datos y obtén el prompt maestro para tu video.", step:"Paso 5" },
    { id:"video", icon:"video", title:"Creador de videos con IA", desc:"Tu idea → video completo en formato de 4 zonas: guion, tomas, edición y caption.", step:"Paso 5" },
    { id:"mensajes", icon:"chat", title:"Mensajes de WhatsApp", desc:"Bienvenida, cierre, objeciones, envío y seguimiento.", step:"Paso 12" },
    { id:"simulador", icon:"users", title:"Simulador de ventas", desc:"Practica con clientes difíciles hechos con IA y recibe tu puntaje.", step:"Paso 12" },
    { id:"anuncios", icon:"flame", title:"Creador de anuncios con IA", desc:"Estrategia, 6 ganchos, 3 anuncios para probar, creativo, público y cómo medirlo.", step:"Paso 11" },
    { id:"campana", icon:"chart", title:"Analizador de campaña", desc:"¿Escalar, mantener o apagar? Decide con tu CPA.", step:"Paso 11" },
    { id:"ventas", icon:"card", title:"Mis ventas", desc:"Registra cada pedido y mira tu ganancia real.", step:"Paso 13" },
    { id:"rutina", icon:"task", title:"Rutina diaria", desc:"Tu checklist de 1 a 2 horas para facturar todos los días.", step:"Paso 14" },
    { id:"landings", icon:"spark", title:"Creador de landings IA", desc:"Tu página de venta con estructuras que ya venden + pedidos contra entrega.", step:"Módulo 3" },
    { id:"ia", icon:"link", title:"Conectar mi IA", desc:"Pega tu llave de Gemini (gratis), OpenAI o Claude. Activa KAIROS IA y las herramientas con IA.", step:"Módulo 3" }
  ],

  toolGroups: [
    { id:"elegir", icon:"search", title:"Elegir y calcular", sub:"Antes de vender: producto y números", tools:["producto","costeo","meta"] },
    { id:"crear", icon:"video", title:"Crear y vender", sub:"Guiones para tus videos y mensajes para cerrar", tools:["video","guion","mensajes","simulador"] },
    { id:"tienda", icon:"spark", title:"Tu landing de venta", sub:"Crea, revisa y mide tu página con IA", tools:["landings","ia"] },
    { id:"medir", icon:"chart", title:"Anunciar y medir", sub:"Anuncios con IA, campañas, pedidos y tu constancia", tools:["anuncios","campana","ventas","rutina"] }
  ],

  providers: __PROVIDERS__,

  routine: {
    tasks: [
      { id:"numeros", min:15, title:"Revisar mis números", desc:"Ventas de ayer, conversaciones, CPA y ganancia. Ajusta lo que toque." },
      { id:"grabar", min:30, title:"Grabar o editar un video", desc:"Un video nuevo al día. Guion corto, una idea, un deseo." },
      { id:"publicar", min:10, title:"Publicar el video", desc:"Súbelo a TikTok, Reels y estado. Responde los primeros comentarios." },
      { id:"mensajes", min:20, title:"Responder mensajes", desc:"Contesta rápido, pregunta y lleva la conversación al cierre." },
      { id:"seguimiento", min:10, title:"Hacer seguimiento", desc:"Escribe a quienes no respondieron ayer. Sin presión, con valor." },
      { id:"pedidos", min:15, title:"Confirmar y despachar pedidos", desc:"Guías, direcciones, despachos y recaudo al día." },
      { id:"novedades", min:5, title:"Ver novedades de proveedores", desc:"Stock nuevo, combos y productos que están moviendo." },
      { id:"registrar", min:5, title:"Registrar ventas y gastos", desc:"Anota todo en Mis ventas para saber tu ganancia real." }
    ]
  },

  agenda: {
    topics: [
      "Elegir producto", "Costos y precios", "Effi y envíos", "Guion y video",
      "Campañas y anuncios", "Vender y cerrar", "Mentalidad y bloqueos",
      "La app y mi cuenta", "Pagos y mi plan", "RUT e impuestos",
      "Revisión de mi avance", "Otro tema"
    ],
    schedule: {
      "0": { label:"Domingo", start:"07:00", end:"16:45" },
      "1": { label:"Lunes", start:"15:30", end:"20:45" },
      "2": { label:"Martes", start:"15:30", end:"20:45" },
      "3": { label:"Miércoles", start:"15:30", end:"20:45" },
      "4": { label:"Jueves", start:"15:30", end:"20:45" },
      "5": { label:"Viernes", start:"07:00", end:"16:45" },
      "6": { label:"Sábado", start:"07:00", end:"16:45" }
    }
  },

  wallet: {
    code: "LUCAS714",
    link: "https://iskairos.com/?ref=LUCAS714",
    commission: 20,
    upgrade: 30,
    minPayout: 20000,
    holdHours: 24,
    days: 3,
    examples: [ { ventas:3, valor:72000 }, { ventas:10, valor:240000 }, { ventas:20, valor:600000 } ]
  },

  landing: {
    structures: [
      { id:"pas", name:"PAS: Problema → Solución", desc:"Duele, lo entiende y le muestras la salida. La estructura más usada para tráfico frío." },
      { id:"demo", name:"Demostración visual", desc:"Muestra el producto resolviendo el problema en segundos. Ideal para antes/después." },
      { id:"oferta", name:"Oferta irresistible", desc:"Precio, combo, garantía y urgencia en primer plano. Para productos con margen." },
      { id:"historia", name:"Historia que conecta", desc:"Un relato personal que lleva al cliente de la identificación a la compra." },
      { id:"comparativa", name:"Comparativa premium", desc:"Contrasta lo mediocre con tu oferta y justifica el precio con valor." },
      { id:"referencia", name:"Referencia", desc:"Estructura de la biblioteca que puedes usar como punto de partida." }
    ],
    sections: [
      { id:"barra", name:"Barra superior", desc:"Envío gratis, contraentrega o promoción." },
      { id:"hero", name:"Hero", desc:"Titular, subeneficio, foto y precio con CTA." },
      { id:"problema", name:"Problema", desc:"El dolor específico del cliente en sus palabras." },
      { id:"beneficios", name:"Beneficios", desc:"3 a 6 beneficios con resultado, no características." },
      { id:"demostracion", name:"Demostración", desc:"Video o fotos de uso real." },
      { id:"pasos", name:"Cómo funciona", desc:"3 pasos simples para recibirlo y usarlo." },
      { id:"comparativa", name:"Comparativa", desc:"Tu oferta contra la alternativa." },
      { id:"historia", name:"Historia", desc:"Origen, misión o transformación de un cliente." },
      { id:"testimonios", name:"Testimonios", desc:"Prueba social con nombre y foto si es real." },
      { id:"garantia", name:"Garantía", desc:"Quita el miedo a comprar sin ver." },
      { id:"oferta", name:"Oferta", desc:"Precio, combo y qué incluye." },
      { id:"faq", name:"Preguntas frecuentes", desc:"Envío, pago, tallas, garantía y cambios." },
      { id:"cierre", name:"Cierre", desc:"CTA final con WhatsApp y resumen de la oferta." }
    ]
  },

  messages: {
    fields: [
      { id:"producto", label:"Producto", value:"Organizador de nevera" },
      { id:"precio", label:"Precio", value:"$89.900" },
      { id:"beneficio", label:"Beneficio principal", value:"organiza toda tu nevera en minutos" },
      { id:"cliente", label:"Nombre del cliente", value:"María" },
      { id:"guia", label:"Número de guía", value:"EFFI-48291" },
      { id:"transportadora", label:"Transportadora", value:"Envía" },
      { id:"hora", label:"Franja de entrega", value:"mañana" }
    ],
    templates: [
      { cat:"Venta", title:"Saludo y descubrimiento", text:"Hola {cliente}, ¿cómo estás? Te escribo porque vi que te interesa el {producto}. Cuéntame una cosa: ¿lo necesitas para tu casa o es para regalar? Así te ayudo a elegir la mejor opción." },
      { cat:"Venta", title:"Presentación de la oferta", text:"{cliente}, el {producto} cuesta {precio} y su función es {beneficio}. Incluye envío contraentrega: pagas cuando lo recibes y lo revisas. ¿Te gustaría que te separe uno hoy?" },
      { cat:"Venta", title:"Cierre con opciones", text:"Perfecto, {cliente}. Tengo dos opciones para ti: 1) un solo {producto} por {precio}, o 2) el combo de 2 con envío gratis. ¿Cuál te acomoda mejor?" },
      { cat:"Venta", title:"Cierre asumido", text:"Listo, {cliente}. Voy a dejar tu pedido del {producto} reservado. Solo necesito confirmarme nombre completo, dirección, ciudad y teléfono para generar la guía. ¿Me los compartes?" },
      { cat:"Objeción", title:"Está caro", text:"Te entiendo, {cliente}. No es solo el precio: con el {producto} resuelves {beneficio} todos los días. Divide {precio} entre los meses que lo vas a usar y te sale más barato que reemplazarlo cada rato. Además pagas contraentrega, sin riesgo." },
      { cat:"Objeción", title:"Lo voy a pensar", text:"Claro, {cliente}. Solo te dejo un dato: el stock se mueve rápido y el precio de hoy incluye envío gratis. Si quieres, te lo reservo sin compromiso por un par de horas y si decides que no, lo libero. ¿Te parece?" },
      { cat:"Objeción", title:"Desconfianza", text:"Es normal desconfiar, {cliente}. Compra contraentrega: pagas cuando el transportador te entrega en la puerta y puedes revisar el {producto}. Si llega con algún problema, tienes garantía. ¿Te comparto las opiniones de otras clientas?" },
      { cat:"Pedido", title:"Confirmar datos", text:"{cliente}, para dejar tu pedido listo necesito: nombre completo, cédula, dirección exacta, ciudad, barrio y teléfono. Con esos datos genero la guía del {producto} y te la comparto." },
      { cat:"Pedido", title:"Envío de guía", text:"{cliente}, tu pedido va en camino. Transportadora: {transportadora}. Guía: {guia}. Llega a tu dirección y pagas {precio} contraentrega. Cualquier cosa me escribes por aquí." },
      { cat:"Pedido", title:"Pago contraentrega", text:"Recuerda, {cliente}: el pago es contraentrega. Prepara {precio} para cuando llegue el transportador. Puedes revisar el paquete antes de pagar. Si no estás, déjale el dinero a alguien de confianza." },
      { cat:"Pedido", title:"Recordatorio de entrega", text:"Hola {cliente}, tu pedido del {producto} llega en la {hora}. Ten listo el pago de {precio}. Si necesitas cambiar la dirección o la hora, avísame ahora para actualizar la guía {guia}." },
      { cat:"Seguimiento", title:"Cliente que no respondió", text:"Hola {cliente}, te escribo sin compromiso. Veo que te interesó el {producto} y no quiero que se te quede sin stock. ¿Sigue en pie o lo dejamos para otra ocasión?" },
      { cat:"Seguimiento", title:"Post-compra", text:"{cliente}, ¿ya te llegó el {producto}? Quiero asegurarme de que quedaste feliz y de que {beneficio}. Si tienes cualquier duda, aquí estoy." },
      { cat:"Seguimiento", title:"Recompra o combo", text:"Hola {cliente}, como te fue con el {producto}, tengo una novedad: llegó el combo para complementarlo. A quienes ya compraron les dejo un precio especial. ¿Te lo muestro?" },
      { cat:"Postventa", title:"Pedir reseña", text:"{cliente}, me alegra que te haya servido. ¿Me regalarías una foto o un comentario corto de tu experiencia con el {producto}? Me ayuda muchísimo a que más personas lo conozcan. Gracias de verdad." }
    ]
  },

  guion: {
    types: ["producto","promoción","testimonio","educativo","historia"],
    structures: [
      { id:"pas", name:"Dolor → solución → prueba → CTA" },
      { id:"demo", name:"Demostración en 3 pasos" },
      { id:"antes", name:"Antes y después" },
      { id:"testimonio", name:"Testimonio en primera persona" },
      { id:"historia", name:"Historia personal" },
      { id:"comparativa", name:"Esto vs. aquello" },
      { id:"oferta", name:"Oferta directa con escasez" }
    ],
    zones: [
      { name:"Aquí nada", range:"0–15%", desc:"Gancho visual y frase que detiene el scroll." },
      { name:"Persona", range:"15–55%", desc:"Tú en cámara explicando el problema y la solución." },
      { name:"Subs", range:"55–68%", desc:"Texto en pantalla con la prueba o el beneficio clave." },
      { name:"Elementos", range:"68–100%", desc:"Producto en uso, detalles, precio y llamado a la acción." }
    ]
  },

  tutorials: [
    { id:"meta-ads", kicker:"META ADS", title:"Cómo montar una campaña de anuncios", desc:"Paso a paso para crear tu campaña de anuncios desde cero.", youtube:"APLGmmxOBCY" }
  ],

  simulator: {
    personas: [
      { id:"precio", name:"Cliente que dice que está caro", tag:"Precio", opening:"Uy, me parece muy caro. Vi uno parecido más barato.", follow:["¿Y por qué vale eso?", "Bueno, pero no sé..."], keywords:["valor","beneficio","contraentrega","garantía","divide","resultado"], bad:["descuento","rebaja","regalar"] },
      { id:"desconfiado", name:"Cliente desconfiado", tag:"Confianza", opening:"¿Y si pago y no me llega nada?", follow:["¿Y si no me gusta?", "¿Tienen referencias?"], keywords:["contraentrega","pagas al recibir","garantía","revisar","opiniones","guía"], bad:["confía","seguro","te lo juro"] },
      { id:"piensa", name:"Cliente que lo va a pensar", tag:"Cierre", opening:"Déjame pensarlo y mañana te aviso.", follow:["No sé, tengo que ver la plata.", "¿Me lo puedes reservar?"], keywords:["reservo","stock","hoy","envío","opciones","te escribo"], bad:["ok","listo","cuando quieras"] },
      { id:"comparador", name:"Cliente comparador", tag:"Competencia", opening:"Lo vi en otra parte más barato, ¿por qué debería comprarte a ti?", follow:["Eso mismo dice el otro.", "¿Qué incluye el tuyo?"], keywords:["envío","garantía","contraentrega","incluye","acompañamiento","calidad"], bad:["porque sí","somos mejores","no sé"] },
      { id:"envio", name:"Cliente preocupado por el envío", tag:"Logística", opening:"¿Cuánto tarda el envío? Necesito que llegue rápido.", follow:["¿Y si no estoy en casa?", "¿Puedo cambiar la dirección?"], keywords:["guía","transportadora","días","coordinar","contraentrega","aviso"], bad:["no sé","tal vez","depende"] },
      { id:"sorpresa", name:"Cliente que no esperaba el mensaje", tag:"Apertura", opening:"¿Quién eres? Yo no pedí nada.", follow:["¿Dónde viste mi número?", "No me interesa."], keywords:["viste","interés","producto","sin compromiso","ayudarte","opción"], bad:["spam","lista","base de datos"] }
    ]
  },

  chat: {
    suggestions: [
      "¿Qué debo hacer hoy según mi avance?",
      "Explícame la Regla 3X con un ejemplo",
      "Ayúdame a calcular el precio de venta de mi producto",
      "Escríbeme un guion de 30 segundos para vender mi producto",
      "¿Cómo respondo a un cliente que dice que está caro?",
      "Hazme un plan de 7 días para mi primera venta",
      "Usar un prompt de la biblioteca"
    ]
  },

  helpCats: {
    producto: { label:"Producto", icon:"search" },
    costos: { label:"Costos y precios", icon:"calc" },
    effi: { label:"Effi y envíos", icon:"card" },
    contenido: { label:"Contenido y video", icon:"video" },
    anuncios: { label:"Anuncios", icon:"flame" },
    ventas: { label:"Ventas y WhatsApp", icon:"chat" },
    mentalidad: { label:"Mentalidad", icon:"spark" },
    plataforma: { label:"La plataforma", icon:"help" },
    pagos: { label:"Pagos y plan", icon:"wallet" },
    formalizar: { label:"RUT y formalización", icon:"book" }
  }
};
