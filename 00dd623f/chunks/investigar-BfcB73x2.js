const u=`Eres un analista experto en ecommerce y dropshipping con pago contra entrega en Colombia. Ayudas a jóvenes de ISKAIROS que venden con Effi o Dropi y anuncian en Meta y TikTok.
Reglas:
- Todo en pesos colombianos (COP), números enteros sin puntos ni símbolos dentro del JSON.
- Usa solo datos que encuentres o que te dé el estudiante; si algo es estimado, márcalo como estimado. Nunca inventes fuentes ni URLs.
- Lenguaje simple y directo, tuteo, frases cortas.`;function v({nombre:a,costo:e,descripcion:o,origen:i,vistos:r}){return{sistema:u,mensaje:`Investiga en internet este producto para venderlo en Colombia con pago contra entrega:
Producto: ${a}
${o?`Descripción o link del proveedor: ${o}
`:""}Costo del proveedor para el estudiante: ${e?`$${e}`:"no lo dio"}
Despacha desde: ${i||"el proveedor de Effi/Dropi (normalmente Bogotá, Medellín o Cali)"}
${r?`Precios y tarifas que el estudiante vio con sus propios ojos (son datos reales, úsalos): ${r}
`:""}
Haz esto:
1. Busca a qué precio lo venden otras tiendas online y landings en Colombia (tiendas contra entrega, Mercado Libre, Falabella, Instagram/Facebook, otras tiendas). Mínimo 3 precios reales si existen.
2. Investiga cuánto cuesta enviar un paquete pequeño (hasta 1-2 kg) con pago contra entrega en Colombia con las transportadoras más usadas en dropshipping (Interrapidísimo, Servientrega, Coordinadora, Envía, TCC y otras que encuentres), incluyendo la comisión de recaudo si aplica. Aclara que el valor real depende de la tarifa de Effi o Dropi y de la ciudad destino.
3. Estima el CPA (costo por venta en anuncios de Meta) razonable para este tipo de producto y precio en Colombia.
4. Recomienda un precio de venta que sea competitivo y que deje ganancia con la Regla 3X (precio ≥ 3 veces el costo) y la Fórmula KAIROS: precio − costo − envío − CPA = ganancia.

JSON con esta forma exacta:
{"resumen":"2-3 frases","precios":[{"fuente":"nombre de la tienda o sitio","precio":0,"url":"url si la tienes o vacío","nota":"ej: incluye envío, combo, etc."}],"precio_min":0,"precio_max":0,"precio_mediano":0,"precio_recomendado":0,"razon_precio":"por qué ese precio","envio":[{"transportadora":"...","costo":0,"recaudo":"comisión de recaudo si aplica","tiempo":"días","nota":"..."}],"envio_recomendado":0,"razon_envio":"...","cpa":{"bajo":0,"esperado":0,"alto":0,"razon":"..."},"devoluciones":"porcentaje típico estimado de pedidos que no se reciben y cómo bajarlo","alertas":["riesgos: saturación, producto regulado, frágil, marca registrada, precio muy bajo, etc."],"siguiente_paso":"1 frase"}`}}function b({nombre:a,costo:e,pvp:o}){return{sistema:u,mensaje:`Evalúa si este producto es buena opción para vender por dropshipping contra entrega en Colombia ahora mismo.
Producto: ${a}
Costo proveedor: ${e?`$${e}`:"no lo dio"} · Precio de venta pensado: ${o?`$${o}`:"no lo dio"}
Busca en internet: cuántas tiendas lo venden, si hay anuncios activos, tendencia (TikTok, Google), precios de la competencia, y riesgos (regulaciones como INVIMA, marcas registradas, fragilidad, devoluciones).
JSON: {"puntaje":0-100,"veredicto":"probar|probar con cuidado|no recomendado","resumen":"2-3 frases","demanda":"...","competencia":"...","precios_competencia":"rango encontrado","angulos":["3 ángulos de venta"],"publico":"a quién venderle","riesgos":["..."],"recomendaciones":["3 acciones concretas"]}`}}const g=[["gasto","Importe gastado","$"],["impresiones","Impresiones",""],["alcance","Alcance",""],["frecuencia","Frecuencia","x"],["cpm","CPM (costo por 1.000 impresiones)","$"],["clics","Clics en el enlace",""],["cpc","CPC (costo por clic)","$"],["reproducciones3s","Reproducciones de 3 segundos",""],["thruplays","ThruPlays (vieron 15 s o completo)",""],["visitas","Visitas a la página de destino",""],["conversaciones","Conversaciones de WhatsApp iniciadas",""],["pagos","Pagos iniciados / formularios",""],["compras","Compras / pedidos",""]];function f({producto:a,m:e,reporte:o,objetivo:i,dias:r,historial:n}){const p=g.filter(([t])=>Number(e[t])>0).map(([t,d])=>`- ${d}: ${e[t]}`).join(`
`)||"- (no escribió métricas sueltas)";return{sistema:`${u}
Ahora eres un media buyer senior de Meta Ads y también profesor: además de decir qué hacer, enseñas por qué, para que el estudiante aprenda a estudiar sus campañas solo.
Referencias orientativas para Colombia (dilo como orientativo, cambia por nicho): CTR de enlace sano ≥ 1%; CPM típico $8.000–$25.000; frecuencia > 3 en pocos días indica fatiga; tasa de gancho (reproducciones 3 s / impresiones) sana ≥ 25%; conversión de landing contra entrega 2–5%; decidir con al menos 1.000 impresiones por anuncio y gasto de ~2 veces el CPA máximo.`,mensaje:`Estudia esta campaña por completo.
Producto: ${a.nombre||"no indicado"} · Precio $${a.pvp} · Costo $${a.costo} · Envío $${a.flete} · CPA máximo (break-even) $${a.pvp-a.costo-a.flete}
Objetivo de la campaña: ${i||"ventas"} · Días activa: ${r||"no indicado"}

Métricas totales:
${p}
${o?`
Reporte copiado del Administrador de anuncios (puede venir por conjunto o por anuncio):
"""
${String(o).slice(0,12e3)}
"""`:""}
${n?`
Análisis anterior de este estudiante (para comparar evolución):
${n}`:""}

Analiza el embudo completo (impresiones → gancho → clic → visita → conversación/formulario → compra), encuentra dónde se rompe, compara anuncios si hay varios y da un plan.
JSON con esta forma exacta:
{"veredicto":{"accion":"escalar|mantener|mejorar|apagar|esperar","titulo":"frase corta","explicacion":"2-3 frases"},
"embudo":[{"etapa":"Atención|Gancho|Clic|Página|Conversación|Compra|Rentabilidad","metrica":"nombre","valor":"valor con unidad","referencia":"rango sano orientativo","estado":"bien|regular|mal|sin datos","lectura":"qué significa en 1 frase"}],
"cuello_de_botella":"dónde se pierde más dinero y por qué",
"anuncios":[{"nombre":"...","lectura":"...","accion":"escalar|mantener|apagar|cambiar gancho|..."}],
"acciones":[{"prioridad":1,"accion":"qué hacer","porque":"...","como":"paso a paso corto"}],
"pruebas":["2-3 pruebas A/B concretas para la próxima semana"],
"aprende":[{"concepto":"métrica o idea","explicacion":"explicación simple con un ejemplo con sus números"}],
"faltan":["datos que faltan para un análisis más preciso"],
"comparacion":"si hay análisis anterior: qué mejoró o empeoró; si no, vacío"}`}}function $(a){const e=String(a||"").trim().split(/\r?\n/).filter(Boolean);if(e.length<2)return null;const o=e[0].includes("	")?"	":e[0].split(";").length>e[0].split(",").length?";":",",i=s=>s.split(o).map(c=>c.replace(/^"|"$/g,"").trim()),r=i(e[0]).map(s=>s.toLowerCase()),n=(...s)=>r.findIndex(c=>s.some(l=>c.includes(l))),p={gasto:n("importe gastado","amount spent","gastado"),impresiones:n("impresiones","impressions"),alcance:n("alcance","reach"),clics:n("clics en el enlace","link clicks"),compras:n("compras","purchases","resultados","results"),visitas:n("visitas a la página de destino","landing page views")},t=s=>Number(String(s||"").replace(/[^\d,.-]/g,"").replace(/\.(?=\d{3}(\D|$))/g,"").replace(",","."))||0,d={};for(const[s,c]of Object.entries(p))c<0||(d[s]=Math.round(e.slice(1).reduce((l,m)=>l+t(i(m)[c]),0)));return Object.keys(d).length?d:null}export{g as M,f as a,b,v as p,$ as t};
