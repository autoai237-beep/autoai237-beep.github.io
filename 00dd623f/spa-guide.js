/* ============ ISKAIROS · guía de 17 pasos (SPA interna) ============ */
(function(){
  "use strict";
  var ISC = window.ISC;
  if(!ISC) return;

  var steps = [
    {
      kicker: "BIENVENIDO A ISKAIROS",
      title: "¡Hola, Lucas! Te muestro tu app paso a paso",
      route: "#/inicio",
      body: "<p>ISKAIROS es la escuela de emprendimiento digital para jóvenes que fundó Santiago Cruz. La meta: que aprendas a vender por internet y consigas tu primera venta online.</p>" +
            "<p>En esta guía te llevo por cada parte de la app. Mira la pantalla detrás de esta tarjeta: así sabrás dónde está todo.</p>" +
            "<p>Dura unos 3 minutos. Puedes verla de nuevo cuando quieras desde tu Perfil.</p>"
    },
    {
      kicker: "LO PRIMERO QUE DEBES HACER",
      title: "Conecta tu IA",
      route: "#/herramientas/ia",
      body: "<p>La app tiene herramientas con inteligencia artificial: crea tu landing de venta, investiga precios, envíos y CPA, estudia tus campañas, escribe guiones y te ayuda a responder clientes.</p>" +
            "<p>En esta versión local funcionan en modo guiado: generan el prompt exacto para pegar en tu IA (Gemini, ChatGPT o la que uses), sin pedirte llaves ni conexión.</p>" +
            "<ul><li><strong>Tu IA, tus datos</strong><br>Los prompts se generan en tu equipo. Nada se envía a internet.</li>" +
            "<li><strong>Gratis y a tu ritmo</strong><br>Copia el prompt, pégalo en tu IA y trae la respuesta a la herramienta.</li></ul>" +
            "<p class=\"note\">Todo queda guardado en este navegador.</p>"
    },
    {
      kicker: "EL MÉTODO",
      title: "El CÓDIGO CRUX",
      route: "#/clases",
      body: "<p>Todo lo que vas a aprender sigue un método de tres pasos:</p>" +
            "<ul><li><strong>C · Conexión</strong><br>Vender es servir. Defines tu propósito y vences el miedo a vender.</li>" +
            "<li><strong>R · Resultado rápido</strong><br>Tu Victoria Mínima Viable: el primer logro pequeño que te da dinero y confianza.</li>" +
            "<li><strong>UX · Ejecución exponencial</strong><br>La IA como tu primer empleado para hacer más en menos tiempo.</li></ul>"
    },
    {
      kicker: "INICIO",
      title: "Tu punto de partida cada día",
      route: "#/inicio",
      body: "<ul><li><strong>Tu avance</strong><br>El porcentaje de clases completadas y tu racha.</li>" +
            "<li><strong>Continúa donde ibas</strong><br>Un toque y sigues con tu siguiente clase.</li>" +
            "<li><strong>Primeros pasos</strong><br>Tu lista para arrancar: conectar la IA, ver tu primera clase, costear tu producto y crear tu landing.</li>" +
            "<li><strong>Accesos rápidos</strong><br>Agenda, exámenes, Effi, Creador de landings y el Asistente KAIROS.</li></ul>"
    },
    {
      kicker: "CLASES",
      title: "Mira, practica y marca tu avance",
      route: "#/clases",
      body: "<ol><li><strong>Mira el video</strong><br>Toma notas. Puedes pausarlo y repetirlo.</li>" +
            "<li><strong>Haz la actividad</strong><br>Escribe tu entrega y guárdala en la clase. Queda en tu equipo.</li>" +
            "<li><strong>Márcala como completada</strong><br>Así sube tu avance y desbloqueas tus logros.</li></ol>" +
            "<p class=\"quote\">Una clase al día. Constancia antes que velocidad.</p>"
    },
    {
      kicker: "MANUAL",
      title: "Todo explicado por escrito",
      route: "#/manual",
      body: "<p>Cada clase está paso a paso, con su tarea, organizada por módulos:</p>" +
            "<ul><li><strong>Mindset KAIROS</strong><br>Las clases del Reto, por escrito.</li>" +
            "<li><strong>Ruta para facturar</strong><br>14 pasos: producto, costeo, guion, video, campañas y ventas.</li>" +
            "<li><strong>Landing pages que venden</strong><br>Crea, revisa y analiza tu página de venta.</li>" +
            "<li><strong>Investiga y analiza con IA</strong><br>Costeo con datos reales y estudio de campañas.</li></ul>"
    },
    {
      kicker: "PROMPTS",
      title: "Instrucciones listas para la IA",
      route: "#/prompts",
      body: "<p>Clase por clase tienes los prompts que vas a necesitar. Toca \"Ver prompt\", cópialo y cambia lo que está entre [corchetes] por tus datos.</p>" +
            "<p>Ejemplo: [tu producto] → \"kit de lluvia para moto\".</p>"
    },
    {
      kicker: "EXÁMENES",
      title: "Demuestra lo que aprendiste",
      route: "#/examenes",
      body: "<p>Cada clase tiene un examen corto con nota mínima. Si no la alcanzas, repasa y vuelve a intentarlo. Algunas preguntas abiertas las revisas con la guía de respuesta.</p>"
    },
    {
      kicker: "HERRAMIENTAS",
      title: "Tu caja de herramientas",
      route: "#/herramientas",
      body: "<p>Están ordenadas según la ruta para facturar:</p>" +
            "<ul><li><strong>Elegir y calcular</strong><br>Checklist de producto ganador, calculadora de costeo y meta de facturación.</li>" +
            "<li><strong>Crear y vender</strong><br>Creador de guiones y mensajes de WhatsApp.</li>" +
            "<li><strong>Tu landing de venta</strong><br>Creador de landings con IA y conexión de tu IA.</li>" +
            "<li><strong>Medir y mejorar</strong><br>Analizador de campaña, mis ventas y rutina diaria.</li></ul>" +
            "<p class=\"quote\">Regla de oro: nunca inviertas un peso en anuncios sin saber tu margen.</p>"
    },
    {
      kicker: "CALCULADORA DE COSTEO",
      title: "Precio − costo − envío − CPA",
      route: "#/herramientas/costeo",
      body: "<p>Aquí sabes cuánto ganas por venta. Con \"Investigar con mi IA\" te recomienda el precio según la competencia, el envío por transportadora y el CPA esperado, y los pasa a la calculadora con un toque.</p>"
    },
    {
      kicker: "CREADOR DE LANDINGS",
      title: "Tu página de venta en minutos",
      route: "#/landings",
      body: "<ol><li><strong>Crea</strong><br>Llenas los datos del producto, eliges una estructura que ya vende y tu IA la escribe.</li>" +
            "<li><strong>Revisa</strong><br>Nota de 0 a 100 y revisión con IA antes de publicar.</li>" +
            "<li><strong>Vende y mide</strong><br>Recibes pedidos contra entrega, los confirmas por WhatsApp y ves visitas, pedidos y conversión.</li></ol>"
    },
    {
      kicker: "ANALIZADOR DE CAMPAÑA",
      title: "Decide con números, no con emociones",
      route: "#/herramientas/campana",
      body: "<p>Pega el reporte del Administrador de anuncios y tu IA estudia el embudo completo, anuncio por anuncio, y te dice qué hacer primero. Además te enseña cada métrica con tus propios números.</p>"
    },
    {
      kicker: "MIS VENTAS Y RUTINA",
      title: "Lleva tus números y tu constancia",
      route: "#/herramientas/ventas",
      body: "<p>Registra cada pedido para ver tu ganancia real (entregados, devueltos y cobrados), y marca tu rutina diaria de 1 a 2 horas para facturar todos los días.</p>"
    },
    {
      kicker: "AYUDA",
      title: "El Asistente KAIROS te responde",
      route: "#/ayuda",
      body: "<p>Escribe tu duda y te responde al instante. Si no se resuelve, se la envías al equipo o agendas una sesión.</p>"
    },
    {
      kicker: "AGENDA 1 A 1",
      title: "Habla con tu mentor",
      route: "#/agenda",
      body: "<p>Reserva tu sesión por Google Meet. Cuéntanos para qué la quieres: si la respuesta está en la app, te la mostramos de una vez y aun así puedes agendar.</p>"
    },
    {
      kicker: "EFFI Y COMUNIDAD",
      title: "Tu proveedor y tu gente",
      route: "#/proveedores",
      body: "<p>En Inicio tienes el acceso a Effi: ábrelo o regístrate con el enlace de ISKAIROS para buscar productos, despachar pedidos y ver tu Wallet.</p>" +
            "<p>Únete a la comunidad de WhatsApp: ahí se anuncian las clases en vivo y conoces a otros jóvenes que van en el mismo camino.</p>"
    },
    {
      kicker: "TU PLAN",
      title: "Empieza hoy con estos pasos",
      route: null,
      body: "<ol><li><strong>Conecta tu IA</strong><br>Herramientas → Conectar mi IA.</li>" +
            "<li><strong>Ve tu primera clase</strong><br>Y márcala como completada.</li>" +
            "<li><strong>Regístrate en Effi</strong><br>Desde Inicio, con el enlace de ISKAIROS.</li>" +
            "<li><strong>Costea tu producto</strong><br>Con la calculadora y tu IA.</li>" +
            "<li><strong>Crea tu landing</strong><br>Y publícala cuando tenga 80 o más en la revisión.</li></ol>" +
            "<p class=\"quote\">La edad no es una excusa. Es tu mayor ventaja.</p>"
    }
  ];

  var overlay, kickerEl, titleEl, contentEl, countEl, progressEl, backEl, nextEl, exitEl, startEl;
  var index = 0, lastFocus = null, closeTimer = null, open = false, bound = false;

  function q(id){ return document.getElementById(id); }

  function ensure(){
    if(overlay) return true;
    overlay = q("guideOverlay");
    if(!overlay) return false;
    kickerEl = q("guideKicker");
    titleEl = q("guideTitle");
    contentEl = q("guideContent");
    countEl = q("guideCount");
    progressEl = q("guideProgress");
    backEl = q("guideBack");
    nextEl = q("guideNext");
    exitEl = q("guideExit");
    if(!startEl){
      startEl = document.createElement("a");
      startEl.className = "btn-next";
      startEl.id = "guideStart";
      startEl.hidden = true;
      if(nextEl && nextEl.parentNode) nextEl.parentNode.insertBefore(startEl, nextEl.nextSibling);
    }
    return !!(kickerEl && titleEl && contentEl && countEl && progressEl && backEl && nextEl && exitEl);
  }

  function navigateBehind(route){
    if(!route) return;
    if(location.hash !== route) ISC.go(route);
  }

  function render(animate){
    var step = steps[index];
    if(!step) return;
    kickerEl.textContent = step.kicker;
    titleEl.textContent = step.title;
    contentEl.innerHTML = step.body;
    countEl.textContent = (index + 1) + " de " + steps.length;
    progressEl.style.width = (((index + 1) / steps.length) * 100) + "%";
    backEl.disabled = index === 0;
    var last = index === steps.length - 1;
    nextEl.hidden = last;
    startEl.hidden = !last;
    if(last){
      var current = ISC.currentClass();
      startEl.href = current ? "#/clase/" + current.id : "#/clases";
      startEl.textContent = "Empezar mi primera clase";
    } else {
      nextEl.textContent = index === 0 ? "Empezar la guía" : "Siguiente";
    }
    var body = overlay.querySelector(".guide-body");
    if(body) body.scrollTop = 0;
    navigateBehind(step.route);
    var reduce = document.documentElement.classList.contains("reduce-motion");
    if(animate !== false && !reduce && titleEl.animate){
      [titleEl, contentEl].forEach(function(el, i){
        el.animate([
          { opacity: 0, transform: "translateY(6px)" },
          { opacity: 1, transform: "none" }
        ], { duration: 220, delay: i * 35, easing: "cubic-bezier(.2,.7,.2,1)" });
      });
    }
  }

  function openGuide(){
    if(!ensure()) return;
    lastFocus = document.activeElement;
    clearTimeout(closeTimer);
    overlay.hidden = false;
    open = true;
    document.body.classList.add("modal-open");
    index = 0;
    render(false);
    requestAnimationFrame(function(){
      overlay.classList.add("open");
      navigateBehind(steps[0].route);
    });
    setTimeout(function(){ exitEl.focus(); }, 60);
  }

  function closeGuide(){
    if(!overlay) return;
    open = false;
    overlay.classList.remove("open");
    document.body.classList.remove("modal-open");
    closeTimer = setTimeout(function(){ overlay.hidden = true; }, 200);
    var back = lastFocus && lastFocus !== document.body ? lastFocus : document.querySelector("[data-guide]");
    if(back && back.focus) back.focus();
  }

  function next(){ if(index < steps.length - 1){ index++; render(true); } }
  function prev(){ if(index > 0){ index--; render(true); } }

  function bind(){
    if(bound || !ensure()) return;
    bound = true;
    exitEl.addEventListener("click", closeGuide);
    nextEl.addEventListener("click", next);
    backEl.addEventListener("click", prev);
    overlay.addEventListener("click", function(e){ if(e.target === overlay) closeGuide(); });
    startEl.addEventListener("click", function(){ setTimeout(closeGuide, 10); });
    document.addEventListener("keydown", function(e){
      if(!open) return;
      if(e.key === "Escape"){ e.preventDefault(); closeGuide(); return; }
      if(e.key === "ArrowRight"){ e.preventDefault(); next(); return; }
      if(e.key === "ArrowLeft"){ e.preventDefault(); prev(); return; }
      if(e.key === "Tab"){
        var f = Array.prototype.slice.call(overlay.querySelectorAll("button, a[href]"))
          .filter(function(el){ return !el.disabled && !el.hidden && el.offsetParent !== null; });
        if(!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
        else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
      }
    });
  }

  ISC.guide = {
    init: function(){
      if(!ensure()) return;
      bind();
      countEl.textContent = "1 de " + steps.length;
    },
    open: function(){ bind(); openGuide(); },
    close: closeGuide,
    isOpen: function(){ return open; }
  };
})();
