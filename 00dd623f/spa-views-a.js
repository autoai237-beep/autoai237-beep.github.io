(function(){
  "use strict";
  const ISC = window.ISC, C = ISC.content;
  const esc = ISC.esc, icon = ISC.icon, money = ISC.money;

  function pageHead(o){
    return '<div class="page-head reveal">'+
      '<div><div class="eyebrow">'+esc(o.kicker||"")+'</div>'+
      '<h1 class="page-title">'+esc(o.title||"")+'</h1>'+
      (o.sub?'<p class="page-sub">'+o.sub+'</p>':"")+'</div>'+
      (o.actions?'<div class="head-actions">'+o.actions+'</div>':"")+
      '</div>';
  }
  function crumb(items){
    return '<div class="crumb">'+items.map(function(it,i){
      return (i?'<span aria-hidden="true">/</span>':"") + (it.href?'<a href="'+it.href+'">'+esc(it.label)+'</a>':'<span>'+esc(it.label)+'</span>');
    }).join("")+'</div>';
  }
  function stat(k,v,s,cls){
    return '<div class="stat-card '+(cls||"")+'"><div class="k">'+esc(k)+'</div><div class="v">'+v+'</div>'+(s?'<div class="s">'+s+'</div>':"")+'</div>';
  }
  function sectionTitle(t, badge){ return '<h2 class="section-title reveal">'+esc(t)+(badge?' <span class="badge cyan">'+esc(badge)+'</span>':"")+'</h2>'; }

  /* ================= INICIO ================= */
  ISC.registerView("inicio", function(){
    const st = ISC.state, g = ISC.globalStats(), cur = ISC.currentClass();
    const mod = cur._mod, ms = ISC.moduleStats(mod);
    const firstTwo = ISC.classes.slice(0,2);
    const stepsDone = 2 + (st.completed.length > 2 ? 0 : 0);
    const stepsTotal = 5;
    const video = cur ? ISC.video(cur.video_url) : null;
    const isDone = cur ? ISC.isDone(cur.id) : false;
    const guideOr = st.stepsDismissed ? "" :
      '<section class="steps reveal spot" aria-labelledby="stepsTitle">'+
        '<div class="steps-head"><div class="steps-title"><div class="kicker">PRIMEROS PASOS</div><strong id="stepsTitle">'+stepsDone+' de '+stepsTotal+' listos</strong></div>'+
        '<button class="btn-guide" type="button" data-guide>Ver guía</button>'+
        '<button class="btn-close" type="button" data-hide-steps aria-label="Ocultar primeros pasos">'+icon("close",16)+'</button></div>'+
        '<div class="steps-bar" role="progressbar" aria-label="Primeros pasos completados" aria-valuemin="0" aria-valuemax="5" aria-valuenow="'+stepsDone+'"><div class="steps-fill" data-pct="'+(stepsDone/stepsTotal*100)+'"></div></div>'+
        '<div class="steps-list">'+
          '<div class="step-row done"><span class="check done" aria-hidden="true">✓</span><span class="step-text"><strong>Conecta tu IA</strong></span></div>'+
          '<div class="step-row done"><span class="check done" aria-hidden="true">✓</span><span class="step-text"><strong>Ve tu primera clase</strong></span></div>'+
          '<button class="step-row" type="button" data-effi-open style="border-left:0;border-right:0;border-bottom:0;background:none;width:100%;text-align:left;cursor:pointer;color:inherit">'+
            '<span class="check" aria-hidden="true"></span><span class="step-text"><strong>Regístrate en Effi</strong><small>Con el enlace de ISKAIROS, desde el acceso de Effi aquí en Inicio.</small></span></button>'+
          '<a class="step-row" href="#/herramientas/costeo"><span class="check" aria-hidden="true"></span><span class="step-text"><strong>Costea tu producto</strong><small>Calculadora + Investigar con mi IA. Guárdalo en tu vitrina.</small></span>'+icon("chevron",16)+'</a>'+
          '<a class="step-row" href="#/landings"><span class="check" aria-hidden="true"></span><span class="step-text"><strong>Crea tu landing</strong><small>Tu página de venta con pedidos contra entrega.</small></span>'+icon("chevron",16)+'</a>'+
        '</div></section>';

    const quick = [
      ["#/ia","spark","KAIROS IA"],["#/landings","landing","Mis landings"],
      ["#/herramientas/anuncios","flame","Anuncios IA"],["#/agenda","calendar","Agenda 1 a 1"],
      ["#/examenes","exam","Exámenes"],["#/referidos","wallet","Wallet"]
    ];

    const modulesAch = ISC.modules.map(function(m){
      const s = ISC.moduleStats(m);
      return '<a class="achievement spot '+(s.pct===100?"active":"")+'" href="#/clases" style="text-decoration:none">'+esc(m.titulo)+'</a>';
    }).join("");

    const html = '<div class="view">'+
      '<div class="head-row"><div class="greeting"><div class="hello">Hola,</div><h1>'+esc(C.profile.corto)+'</h1></div>'+
        '<div class="streak" aria-label="'+g.done+' clases"><span class="flame" aria-hidden="true">'+icon("flame",16)+'</span>'+g.done+' clases</div></div>'+
      '<div class="top-grid">'+
        '<section class="progress-card lift spot" aria-label="Tu avance"><span class="beam" aria-hidden="true"></span>'+
          '<div class="ring" data-pct="'+g.pct+'"><svg viewBox="0 0 100 100" aria-hidden="true"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7FE8FA"/><stop offset="1" stop-color="#22CBEA"/></linearGradient></defs><circle class="track" cx="50" cy="50" r="42"/><circle class="meter" cx="50" cy="50" r="42"/></svg>'+
          '<span class="ring-num" data-count="'+g.pct+'" data-suffix="%">0%</span></div>'+
          '<div class="progress-info"><div class="label">Tu avance</div><strong>'+g.done+' de '+g.total+' clases</strong><div class="module">'+esc(mod.titulo)+'</div></div>'+
        '</section>'+
        (cur?'<a class="continue-card lift d1 spot" href="#/clase/'+cur.id+'" aria-label="Continuar donde ibas: '+esc(cur.titulo)+'"><span class="beam" aria-hidden="true"></span>'+
          '<div class="continue-media" aria-hidden="true">'+(video&&video.thumb?'<img src="'+video.thumb+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">':"")+'<div class="play">'+icon("play",22)+'</div></div>'+
          '<div class="continue-body"><div class="kicker">CONTINÚA DONDE IBAS</div><strong>'+esc(cur.titulo)+'</strong></div></a>':"")+
      '</div>'+
      guideOr+
      sectionTitle("Accesos rápidos")+
      '<div class="quick-grid reveal" style="--d:60ms">'+quick.map(function(q){
        return '<a class="quick-card spot" href="'+q[0]+'"><span class="quick-icon">'+icon(q[1],20)+'</span><span class="quick-label">'+q[2]+'</span></a>';
      }).join("")+'</div>'+
      '<div class="utility reveal" style="--d:90ms">'+
        '<div class="effi spot" id="effiCard"><button class="effi-toggle" type="button" id="effiToggle" aria-expanded="false" aria-controls="effiPanel"><span class="effi-logo" aria-hidden="true">Effi</span><span class="effi-info"><strong>Effi</strong><small>Productos, pedidos y guías</small></span><span class="effi-chevron">'+icon("down",18)+'</span></button>'+
          '<div class="effi-panel" id="effiPanel" aria-hidden="true"><div class="effi-inner"><div class="effi-grid">'+
            '<a class="effi-link primary" href="https://effi.com.co/ingreso" target="_blank" rel="noopener noreferrer">'+icon("external",16)+'Abrir Effi</a>'+
            '<a class="effi-link ghost" href="https://effi.com.co/registro?ref=NDczNjDHhDE=" target="_blank" rel="noopener noreferrer">'+icon("user",16)+'Registrarme</a>'+
            '<div class="effi-note">¿Aún no tienes cuenta? Regístrate con el enlace de ISKAIROS.</div>'+
          '</div></div></div></div>'+
        '<div class="utility-right">'+
          '<a class="wa-card group spot" href="'+C.profile.grupoWhatsApp+'" target="_blank" rel="noopener noreferrer"><span class="wa-icon">'+icon("users",18)+'</span><span class="wa-label">Grupo de WhatsApp</span></a>'+
          '<a class="wa-card spot" href="https://wa.me/'+C.profile.whatsappSoporte+'?text=Hola%20ISKAIROS%2C%20soy%20estudiante%20y%20necesito%20ayuda%20con%E2%80%A6" target="_blank" rel="noopener noreferrer"><span class="wa-icon">'+icon("chat",18)+'</span><span class="wa-label">Soporte por WhatsApp</span></a>'+
        '</div>'+
      '</div>'+
      sectionTitle("Tus logros", g.approved+" exámenes")+
      '<div class="achievements reveal" style="--d:60ms">'+modulesAch+'</div>'+
    '</div>';

    return { html:html, title:"Inicio", after:function(root){
      const toggle = root.querySelector("#effiToggle"), panel = root.querySelector("#effiPanel"), effiCard = root.querySelector("#effiCard");
      function openEffi(open){
        if(!toggle || !panel) return;
        toggle.setAttribute("aria-expanded", open?"true":"false");
        panel.setAttribute("aria-hidden", open?"false":"true");
        if(effiCard) effiCard.classList.toggle("open", !!open);
      }
      if(toggle) toggle.addEventListener("click", function(){ openEffi(toggle.getAttribute("aria-expanded")!=="true"); });
      const effiStep = root.querySelector("[data-effi-open]");
      if(effiStep) effiStep.addEventListener("click", function(){
        const card = root.querySelector("#effiCard");
        if(card) card.scrollIntoView({behavior:"smooth", block:"center"});
        openEffi(true);
      });
      const hide = root.querySelector("[data-hide-steps]");
      if(hide) hide.addEventListener("click", function(){
        ISC.state.stepsDismissed = true; ISC.save(); ISC.toast("Ocultaste los primeros pasos. Puedes activarlos en Perfil."); ISC.rerender();
      });
      const revealed = root.querySelectorAll(".continue-media img");
      revealed.forEach(function(img){ img.addEventListener("error", function(){ img.style.display="none"; }); });
    }};
  });

  /* ================= CLASES ================= */
  ISC.registerView("clases", function(){
    const g = ISC.globalStats();
    const current = ISC.currentClass();
    const open = {};
    if(current) open[current._mod.id] = true;
    let filter = "todas", query = "";

    function statusOf(c){
      if(ISC.isDone(c.id)) return { cls:"done", label:"Vista", badge:"green" };
      if(current && current.id === c.id) return { cls:"current", label:"Te toca esta", badge:"gold" };
      return { cls:"", label:"Sin empezar", badge:"" };
    }
    function moduleHTML(m){
      const s = ISC.moduleStats(m);
      const rows = m.clases.filter(function(c){
        if(!query) return true;
        return (c.titulo+" "+m.titulo).toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
      if(!rows.length) return "";
      const isOpen = open[m.id] || !!query;
      return '<section class="module-block '+(isOpen?"open":"")+'" data-module="'+esc(m.id)+'">'+
        '<button class="module-toggle" type="button" data-mod-toggle="'+esc(m.id)+'" aria-expanded="'+(isOpen?"true":"false")+'">'+
          '<span class="module-num">'+esc(m.etiqueta)+'</span>'+
          '<span class="module-info"><strong>'+esc(m.titulo)+'</strong><small>'+s.done+' de '+s.total+' clases'+(m.id===current._mod.id?" · estás aquí":"")+'</small></span>'+
          '<span class="module-pct">'+s.pct+'%</span><span class="module-chevron">'+icon("down",16)+'</span>'+
        '</button>'+
        '<div class="module-bar"><i style="width:'+s.pct+'%"></i></div>'+
        '<div class="module-list"><div class="module-list-inner">'+rows.map(function(c){
          const st = statusOf(c);
          const ex = ISC.examOf(c.id);
          const les = ISC.lessonByClass[c.id];
          return '<a class="class-row '+st.cls+'" href="#/clase/'+c.id+'">'+
            '<span class="class-check" aria-hidden="true">'+(st.cls==="done"?"✓":String(c.orden).padStart(2,"0"))+'</span>'+
            '<span class="class-info"><strong>'+esc(c.titulo)+'</strong><span class="class-meta">'+
              '<span class="mini">'+st.label+'</span>'+
              (les?'<span>· Manual</span>':"")+
              (ex?'<span>· Examen</span>':"")+
              (c.tipo?'<span>· '+esc(c.tipo)+'</span>':"")+
            '</span></span>'+icon("chevron",16)+'</a>';
        }).join("")+'</div></div></section>';
    }
    function listHTML(){
      return ISC.modules.map(function(m){
        if(filter==="todas") return moduleHTML(m);
        const filtered = { id:m.id, numero:m.numero, etiqueta:m.etiqueta, titulo:m.titulo, clases:m.clases.filter(function(c){
          if(query && (c.titulo+" "+m.titulo).toLowerCase().indexOf(query.toLowerCase())<0) return false;
          if(filter==="vistas") return ISC.isDone(c.id);
          if(filter==="pendientes") return !ISC.isDone(c.id);
          if(filter==="actual") return current.id === c.id;
          return true;
        })};
        if(!filtered.clases.length) return "";
        return moduleHTML(filtered);
      }).join("") || '<div class="empty"><span class="ico">'+icon("search",22)+'</span><strong>Sin resultados</strong><p>Prueba con otra palabra o cambia el filtro.</p></div>';
    }

    const html = '<div class="view">'+
      pageHead({kicker:"TU RUTA COMPLETA", title:"Clases", sub:"60 clases organizadas en 8 módulos. Tu avance se guarda en este navegador.", actions:'<a class="btn ghost" href="#/manual">'+icon("book",16)+'Manual</a><a class="btn primary" href="#/clase/'+current.id+'">'+icon("play",16)+'Continuar</a>'})+
      '<div class="stats-grid stagger">'+
        stat("Avance", g.pct+'%', g.done+' de '+g.total+' clases',"accent")+
        stat("Completadas", g.done, "clases vistas")+
        stat("Exámenes", g.approved, "aprobados")+
        stat("Módulo actual", ISC.modLabel(current._mod), esc(current._mod.titulo.replace(/^Módulo \d+ · /,""))) +
      '</div>'+
      '<div class="toolbar reveal"><label class="search">'+icon("search",17)+'<input type="search" id="classSearch" placeholder="Buscar una clase…" aria-label="Buscar clase"></label>'+
        '<div class="chips" id="classFilters">'+
          '<button class="chip active" type="button" data-filter="todas">Todas <span class="n">60</span></button>'+
          '<button class="chip" type="button" data-filter="actual">Te toca esta</button>'+
          '<button class="chip" type="button" data-filter="pendientes">Pendientes <span class="n">'+(g.total-g.done)+'</span></button>'+
          '<button class="chip" type="button" data-filter="vistas">Vistas <span class="n">'+g.done+'</span></button>'+
        '</div></div>'+
      '<div id="moduleList" class="reveal">'+listHTML()+'</div>'+
      '<div class="panel"><div class="panel-foot">'+icon("info",14)+' Tu progreso se guarda en este archivo local. No se envía a ningún servidor.</div></div>'+
    '</div>';

    return { html:html, title:"Clases", after:function(root){
      const list = root.querySelector("#moduleList");
      function refresh(){ list.innerHTML = listHTML(); bindModules(); }
      function bindModules(){
        list.querySelectorAll("[data-mod-toggle]").forEach(function(btn){
          btn.addEventListener("click", function(){
            const id = btn.getAttribute("data-mod-toggle");
            const block = btn.closest(".module-block");
            open[id] = !block.classList.contains("open");
            block.classList.toggle("open", open[id]);
            btn.setAttribute("aria-expanded", open[id]?"true":"false");
          });
        });
      }
      bindModules();
      const search = root.querySelector("#classSearch");
      search.addEventListener("input", function(){ query = search.value.trim(); refresh(); });
      root.querySelectorAll("[data-filter]").forEach(function(chip){
        chip.addEventListener("click", function(){
          filter = chip.getAttribute("data-filter");
          root.querySelectorAll("[data-filter]").forEach(function(c){ c.classList.toggle("active", c===chip); });
          refresh();
        });
      });
    }};
  });

  /* ================= CLASE ================= */
  ISC.registerView("clase", function(params){
    const c = ISC.classById[params.id];
    if(!c) return { html:'<div class="view"><div class="empty"><strong>Clase no encontrada</strong><p>Vuelve a <a href="#/clases">Clases</a>.</p></div></div>' };
    const m = c._mod, les = ISC.lessonByClass[c.id], video = ISC.video(c.video_url);
    const acts = ISC.actByClass[c.id] || [], exam = ISC.examOf(c.id);
    const done = ISC.isDone(c.id), note = ISC.state.notes[c.id] || "";
    const prompts = (les && les.prompts) || [];
    const prev = ISC.prevClass(c), next = ISC.nextClass(c);
    const manual = les && les.manual;

    const poster = video ? (video.kind==="yt"
      ? '<button class="video-poster" type="button" data-play="'+c.id+'" aria-label="Reproducir clase">'+
          '<img src="'+video.thumb+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">'+
          '<span class="vp-play">'+icon("play",24)+'</span>'+
          '<span class="vp-tag badge cyan">CLASE '+String(c._index+1).padStart(2,"0")+'</span>'+
          '<span class="vp-note">'+esc(c.titulo)+' · toca para reproducir</span></button>'
      : '<div class="video-fallback"><div class="play">'+icon("play",22)+'</div><strong>Video de la clase</strong><span>'+esc(c.titulo)+'</span><button class="btn sm primary" type="button" data-play="'+c.id+'">Reproducir</button></div>')
      : '<div class="video-fallback">'+icon("video",28)+'<strong>Video no disponible</strong><span>Esta clase no tiene un video cargado.</span></div>';

    const ytLink = video && video.kind === "yt" ? '<a class="btn sm mt-12" href="https://youtu.be/'+video.id+'" target="_blank" rel="noopener noreferrer">'+icon("external",14)+'Ver en YouTube</a>' : "";
    const material = manual ? '<div class="md">'+ISC.md(manual)+'</div>' :
      '<div class="empty"><span class="ico">'+icon("book",22)+'</span><strong>Material en video</strong><p>'+esc(c.descripcion||"Esta clase se aprende viendo el video y aplicando la actividad. No tiene manual escrito.")+'</p>'+ytLink+'</div>';

    const activity = acts.length ? acts.map(function(a){
      return '<div class="panel tight" style="margin-top:10px"><div class="panel-head"><div class="pt"><h3>'+esc(a.titulo)+'</h3><p>Evidencia: '+esc(a.entrega||"respuesta")+'</p></div></div>'+
        '<div class="panel-body"><div class="md">'+ISC.md(a.instrucciones)+'</div>'+
        '<div class="field mt-12"><label for="act-'+esc(c.id)+'">Mi respuesta / evidencia</label><textarea class="textarea" id="act-'+esc(c.id)+'" data-activity="'+esc(c.id)+'" placeholder="Escribe aquí tu respuesta o lo que hiciste en la actividad…">'+esc(ISC.state.activities[c.id]||"")+'</textarea><span class="hint">Se guarda en este navegador.</span></div></div></div>';
    }).join("") : '<div class="empty"><span class="ico">'+icon("task",22)+'</span><strong>Sin actividad cargada</strong><p>Aplica la clase: escribe una acción concreta que puedas hacer hoy y guárdala en tus apuntes.</p></div>';

    const promptHTML = prompts.length ? '<div class="split"><p class="muted small" style="margin:0 0 10px">'+prompts.length+' prompts de esta clase. Cópialos o ábrelos en KAIROS IA.</p><a class="btn sm ghost" href="#/prompts">Ver biblioteca</a></div>'+
      prompts.map(function(p,i){
        return '<article class="prompt-card"><div class="prompt-top"><span class="prompt-num">'+String(i+1).padStart(2,"0")+'</span><div class="prompt-main"><strong>'+esc(p.titulo)+'</strong><small>'+esc(p.para||"")+'</small></div>'+
          '<div class="prompt-actions"><button class="icon-btn" type="button" data-copy="'+esc(p.texto)+'" data-copy-msg="Prompt copiado" aria-label="Copiar prompt">'+icon("copy",15)+'</button>'+
          '<button class="icon-btn" type="button" data-prompt-toggle aria-label="Ver prompt">'+icon("down",15)+'</button></div></div>'+
          '<div class="prompt-body"><div class="prompt-body-inner"><pre class="prompt-text">'+esc(p.texto)+'</pre>'+
          '<div class="prompt-foot"><span>Úsalo en tu IA favorita</span><a class="btn sm" href="#/ia?clase='+c.id+'&pi='+i+'">'+icon("spark",14)+'Abrir en KAIROS IA</a></div></div></div></article>';
      }).join("") : '<div class="empty"><span class="ico">'+icon("spark",22)+'</span><strong>Esta clase no tiene prompts</strong><p>Mira la biblioteca completa para encontrar uno que te sirva.</p></div>';

    const html = '<div class="view">'+
      crumb([{label:"Clases",href:"#/clases"},{label:m.titulo.replace(/^Módulo \d+ · /,""),href:"#/clases"},{label:"Clase "+c.orden}])+
      '<div class="lesson-head"><div><h1>'+esc(c.titulo)+'</h1><div class="meta">'+
        '<span class="badge cyan">'+esc(m.titulo)+'</span>'+
        '<span class="badge">Clase '+c.orden+' de '+m.clases.length+'</span>'+
        (done?'<span class="badge green">✓ Vista</span>':'<span class="badge gold">Te toca esta</span>')+
        (c.tipo?'<span class="badge">'+esc(c.tipo)+'</span>':"")+
      '</div></div><div class="head-actions">'+
        (exam?'<a class="btn ghost" href="#/examen/'+c.id+'">'+icon("exam",16)+'Examen</a>':"")+
        '<button class="btn '+(done?"ghost":"primary")+'" type="button" data-done-toggle="'+c.id+'">'+icon("check",16)+'<span>'+(done?"Marcar como no vista":"Marcar clase como completada")+'</span></button>'+
      '</div></div>'+
      '<div class="video-frame" id="videoFrame">'+poster+'</div>'+
      (c.descripcion?'<p class="page-sub" style="margin-top:12px">'+esc(c.descripcion)+'</p>':"")+
      '<div class="lesson-tabs" role="tablist" aria-label="Contenido de la clase">'+
        '<button class="lesson-tab active" type="button" data-tab="material" role="tab" aria-selected="true">Material</button>'+
        '<button class="lesson-tab" type="button" data-tab="actividad" role="tab" aria-selected="false">Actividad</button>'+
        '<button class="lesson-tab" type="button" data-tab="apuntes" role="tab" aria-selected="false">Mis apuntes</button>'+
        '<button class="lesson-tab" type="button" data-tab="prompts" role="tab" aria-selected="false">Prompts <span class="badge cyan">'+prompts.length+'</span></button>'+
      '</div>'+
      '<div class="lesson-pane" data-pane="material" role="tabpanel">'+
        (manual?'<div class="panel"><div class="panel-head"><div class="pt"><h3>Manual de la clase</h3><p>Resumen práctico para aplicar hoy.</p></div><a class="btn sm ghost" href="#/manual/'+les.id+'">'+icon("book",14)+'Leer completo</a></div><div class="panel-body"><div class="md">'+ISC.md(manual)+'</div></div></div>':material)+
      '</div>'+
      '<div class="lesson-pane" data-pane="actividad" role="tabpanel" hidden>'+activity+'</div>'+
      '<div class="lesson-pane" data-pane="apuntes" role="tabpanel" hidden>'+
        '<div class="panel"><div class="panel-head"><div class="pt"><h3>Mis apuntes</h3><p>Lo que aprendiste y lo que vas a aplicar.</p></div><span class="badge green" id="noteStatus">Guardado</span></div>'+
        '<div class="panel-body"><div class="field"><label for="notes">Apuntes de esta clase</label><textarea class="textarea" id="notes" data-notes="'+c.id+'" style="min-height:220px" placeholder="Escribe tus apuntes de mentalidad y lo que aprendiste…">'+esc(note)+'</textarea><span class="hint">Se guardan automáticamente en este navegador.</span></div></div></div>'+
      '</div>'+
      '<div class="lesson-pane" data-pane="prompts" role="tabpanel" hidden>'+promptHTML+'</div>'+
      '<div class="split mt-24" style="padding-top:16px;border-top:1px solid var(--line)">'+
        (prev?'<a class="btn ghost" href="#/clase/'+prev.id+'">'+icon("back",16)+'Anterior</a>':'<span></span>')+
        (next?'<a class="btn primary" href="#/clase/'+next.id+'">Siguiente clase'+icon("arrow",16)+'</a>':'<a class="btn gold" href="#/clases">Terminaste la ruta</a>')+
      '</div>'+
      '<div class="panel mt-16"><div class="panel-head"><div class="pt"><h3>Más de '+esc(m.titulo)+'</h3><p>'+m.clases.length+' clases en este módulo</p></div></div><div>'+
        m.clases.map(function(x){
          return '<a class="class-row '+(ISC.isDone(x.id)?"done":"")+' '+(x.id===c.id?"current":"")+'" href="#/clase/'+x.id+'"><span class="class-check">'+(ISC.isDone(x.id)?"✓":x.orden)+'</span><span class="class-info"><strong>'+esc(x.titulo)+'</strong></span>'+icon("chevron",15)+'</a>';
        }).join("")+'</div></div>'+
    '</div>';

    return { html:html, title:c.titulo, after:function(root){
      root.querySelectorAll("[data-tab]").forEach(function(tab){
        tab.addEventListener("click", function(){
          root.querySelectorAll("[data-tab]").forEach(function(t){ t.classList.toggle("active",t===tab); t.setAttribute("aria-selected",t===tab?"true":"false"); });
          root.querySelectorAll("[data-pane]").forEach(function(p){ p.hidden = p.getAttribute("data-pane") !== tab.getAttribute("data-tab"); });
        });
      });
      const play = root.querySelector("[data-play]");
      if(play && video){
        play.addEventListener("click", function(){
          const frame = root.querySelector("#videoFrame");
          if(video.kind === "yt"){
            frame.innerHTML = '<iframe src="'+video.embed+'&autoplay=1" title="'+esc(c.titulo)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>';
          } else {
            frame.innerHTML = '<video src="'+video.src+'" controls autoplay playsinline preload="metadata"></video>';
          }
        });
      }
      const noteEl = root.querySelector("[data-notes]");
      if(noteEl){
        const status = root.querySelector("#noteStatus");
        let t;
        noteEl.addEventListener("input", function(){
          status.textContent = "Guardando…"; status.className = "badge gold";
          ISC.state.notes[noteEl.getAttribute("data-notes")] = noteEl.value;
          clearTimeout(t);
          t = setTimeout(function(){ ISC.saveNow(); status.textContent="Guardado"; status.className="badge green"; }, 450);
        });
      }
      const actEl = root.querySelector("[data-activity]");
      if(actEl){
        actEl.addEventListener("input", function(){
          ISC.state.activities[actEl.getAttribute("data-activity")] = actEl.value;
          ISC.save();
        });
      }
      const doneBtn = root.querySelector("[data-done-toggle]");
      if(doneBtn){
        doneBtn.addEventListener("click", function(){
          const isDone = ISC.isDone(c.id);
          ISC.markDone(c.id, !isDone);
          const nowDone = !isDone;
          doneBtn.className = "btn " + (nowDone?"ghost":"primary");
          doneBtn.innerHTML = icon("check",16)+"<span>"+(nowDone?"Marcar como no vista":"Marcar clase como completada")+"</span>";
          const badge = root.querySelector(".lesson-head .meta .badge.green, .lesson-head .meta .badge.gold");
          if(badge){ badge.className = "badge " + (nowDone?"green":"gold"); badge.textContent = nowDone?"✓ Vista":"Te toca esta"; }
          ISC.toast(nowDone?"Clase marcada como vista":"Clase marcada como pendiente");
        });
      }
      root.querySelectorAll("[data-prompt-toggle]").forEach(function(b){
        b.addEventListener("click", function(){ b.closest(".prompt-card").classList.toggle("open"); });
      });
    }};
  });

  /* ================= KAIROS IA ================= */
  function iaRespond(q){
    const s = q.toLowerCase();
    const g = ISC.globalStats(), cur = ISC.currentClass(), m = cur._mod;
    const cost = ISC.state.tools.costeo || {pvp:90000,costo:30000,envio:15000,cpa:20000};
    if(/avance|hoy|qué debo|que debo|ruta/.test(s)){
      return "Hoy te toca **"+cur.titulo+"**, en "+m.titulo+" ("+cur.orden+" de "+m.clases.length+" de este módulo).\n\n"+
        "- Llevas **"+g.done+" de "+g.total+" clases** ("+g.pct+"%).\n"+
        "- Módulo actual: **"+esc(m.titulo)+"**.\n"+
        "- Exámenes aprobados: **"+g.approved+"/60**.\n\n"+
        "Plan de 60 minutos:\n1. Mira la clase y toma 3 apuntes.\n2. Responde la actividad con una acción concreta.\n3. Si ya dominas el tema, presenta el examen de la clase.";
    }
    if(/3x|regla/.test(s)){
      return "La **Regla 3X** dice que el precio de venta debe ser al menos **3 veces** lo que pagas al proveedor.\n\n"+
        "Ese precio se reparte en tres partes:\n- **1/3 producto:** lo que cuesta en Effi.\n- **1/3 marketing y logística:** CPA, flete y recaudo.\n- **1/3 margen:** tu ganancia libre.\n\n"+
        "Ejemplo: si el proveedor te lo vende en $20.000, mínimo vendes en **$60.000**. Con tu calculadora actual: PVP "+money(cost.pvp)+", costo "+money(cost.costo)+", envío "+money(cost.envio)+" y CPA "+money(cost.cpa)+", te quedan **"+money(cost.pvp-cost.costo-cost.envio-cost.cpa)+" por venta**.";
    }
    if(/precio|costeo|cuánto vendo|cuanto vendo|margen|cpa/.test(s)){
      const nums = (q.match(/\d[\d.,]*/g)||[]).map(function(x){ return ISC.parseNum(x); }).filter(Boolean);
      if(nums.length >= 2){
        const costo = nums[0], pvp = nums[1], envio = nums[2]||0, cpa = nums[3]||0;
        const gan = pvp-costo-envio-cpa;
        return "Con **costo "+money(costo)+"** y **PVP "+money(pvp)+"**"+(envio?" + envío "+money(envio):"")+(cpa?" + CPA "+money(cpa):"")+":\n\n"+
          "- Ganancia por venta: **"+money(gan)+"**\n- Margen: **"+(pvp?Math.round(gan/pvp*100):0)+"%**\n- Regla 3X: "+(pvp>=costo*3?"**cumple** ✅":"**no cumple** ❌ (necesitas al menos "+money(costo*3)+")")+"\n\nSi el margen queda por debajo del 40%, sube el valor percibido, baja el CPA o busca un proveedor con mejor costo.";
      }
      return "Para calcularlo necesito 4 datos: **PVP, costo del producto, envío y CPA**. Ábreme la **Calculadora de costeo** y los llenas en 20 segundos. Si me escribes los números en un mensaje, también te lo calculo aquí.";
    }
    if(/guion|video de 30|30 segundos/.test(s)){
      return "**Guion de 30 segundos (producto):**\n\n"+
        "| Tiempo | Cámara / edición | Locución |\n| 0–3s | Primer plano, texto grande | \"¿Tu nevera parece un caos?\" |\n| 3–8s | Muestras el problema | \"Cada semana compras de más porque no encuentras nada.\" |\n| 8–18s | Producto en uso | \"Con este organizador armas todo en 2 minutos y ves lo que tienes.\" |\n| 18–25s | Antes / después | \"Más espacio, menos desorden, cero esfuerzo.\" |\n| 25–30s | Precio y CTA | \"Hoy con envío gratis y pago contraentrega. Escríbeme 'QUIERO'.\" |\n\nGana el gancho: prueba 3 primeras frases distintas y mira cuál retiene más.";
    }
    if(/caro|precio alto|descuento/.test(s)){
      return "No bajes el precio de inmediato. Responde con valor y riesgo cero:\n\n> \"Te entiendo. No es solo el precio: con el producto resuelves [beneficio] todos los días. Además pagas **contraentrega**, lo revisas cuando llega y tienes garantía. ¿Te lo reservo hoy con envío gratis?\"\n\nSi insiste, ofrece un **combo** o una cuota más pequeña, nunca un descuento sin contraprestación. Tienes la plantilla completa en **Mensajes de WhatsApp → Objeción → Está caro**.";
    }
    if(/7 días|siete días|primera venta|plan/.test(s)){
      return "**Plan de 7 días para tu primera venta:**\n\n1. **Día 1:** elige un producto con Regla 3X y costéalo.\n2. **Día 2:** define cliente ideal y los 3 dolores más fuertes.\n3. **Día 3:** escribe el guion y graba 2 videos.\n4. **Día 4:** publica y responde todos los mensajes.\n5. **Día 5:** arma la landing o el catálogo con contraentrega.\n6. **Día 6:** publica 2 videos más y prueba un anuncio pequeño.\n7. **Día 7:** revisa números, cierra ventas y registra todo.\n\nLa meta no es vender el día 1: es completar 7 días de ejecución sin romper la cadena.";
    }
    if(/prompt|biblioteca/.test(s)){
      return "Tienes **123 prompts** listos, organizados por módulo y clase. Los más usados ahora:\n\n- Convierte tus excusas en ventajas.\n- Tu cliente ideal y su deseo raíz.\n- Guion de 30 segundos que vende.\n- Responde objeciones de precio.\n\nAbre **Prompts**, busca por tema y copia el que necesites. También puedes usar el botón **Abrir en KAIROS IA** dentro de cada clase.";
    }
    const match = ISC.classes.filter(function(c){
      return (c.titulo+" "+(c.descripcion||"")).toLowerCase().indexOf(s.split(/\s+/).filter(function(w){return w.length>4;})[0]||"") > -1;
    })[0];
    if(match){
      const l = ISC.lessonByClass[match.id];
      return "Encontré una clase relacionada: **"+esc(match.titulo)+"** ("+esc(match._mod.titulo)+").\n\n"+
        (l&&l.manual?ISC.md(l.manual.split("\n\n").slice(1,3).join("\n\n")):"Mira el video y completa la actividad para aplicar el tema.")+
        "\n\n[Abrir la clase](#/clase/"+match.id+")";
    }
    return "Estoy en **modo local guiado**: puedo ayudarte con tu avance, la Regla 3X, precios, guiones, objeciones, planes y prompts.\n\nPrueba con:\n- \"¿Qué debo hacer hoy?\"\n- \"Explícame la Regla 3X\"\n- \"Tengo costo 30.000 y precio 90.000\"\n- \"Hazme un plan de 7 días\"\n\nPara respuestas abiertas con tu propia llave, conecta tu IA en **Herramientas → Conectar mi IA**.";
  }

  ISC.registerView("ia", function(params, query){
    const st = ISC.state;
    const msgs = st.chat.length ? st.chat : [{role:"bot",text:"Hola, Lucas. Soy **KAIROS IA** en modo local. Te ayudo a decidir qué hacer hoy, calcular precios, escribir guiones y responder objeciones. ¿Por dónde empezamos?"}];
    let prefill = "";
    if(query.clase && query.pi != null){
      const l = ISC.lessonByClass[query.clase];
      if(l && l.prompts && l.prompts[Number(query.pi)]) prefill = l.prompts[Number(query.pi)].texto;
    }
    const html = '<div class="view">'+
      pageHead({kicker:"TU MENTOR DIGITAL", title:"KAIROS IA", sub:"Modo local guiado: usa tu avance, tus números y la biblioteca de prompts. Tus conversaciones se guardan solo en este navegador.", actions:'<button class="btn ghost" type="button" data-clear-chat>'+icon("trash",16)+'Limpiar</button><a class="btn" href="#/prompts">'+icon("spark",16)+'Prompts</a>'})+
      '<div class="chat-shell">'+
        '<div class="chat-stream" id="chatStream" aria-live="polite" aria-label="Conversación con KAIROS IA">'+
          msgs.map(function(m){
            return '<div class="msg '+m.role+'"><span class="av">'+(m.role==="user"?"L":"K")+'</span><div class="bubble">'+ISC.md(m.text)+'</div></div>';
          }).join("")+
        '</div>'+
        '<div><div class="chat-suggest">'+C.chat.suggestions.map(function(s){
          return '<button class="chip" type="button" data-suggest="'+esc(s)+'">'+esc(s)+'</button>';
        }).join("")+'</div>'+
        '<form class="chat-form" id="chatForm"><input class="input" id="chatInput" autocomplete="off" placeholder="Escribe tu pregunta…" aria-label="Mensaje para KAIROS IA" value="'+esc(prefill)+'"><button class="btn primary" type="submit" aria-label="Enviar">'+icon("send",17)+'</button></form>'+
        '<div class="chat-note">Modo local · no envía tus datos a internet · conecta tu IA en <a href="#/herramientas/ia">Herramientas</a></div></div>'+
      '</div>'+
      '<div class="stats-grid">'+
        stat("Tu clase actual", "Clase "+(ISC.currentClass()._index+1), esc(ISC.currentClass()._mod.titulo.replace(/^Módulo \d+ · /,""))) +
        stat("Prompt del día", "3X", "Regla de rentabilidad")+
        stat("Biblioteca", "123", "prompts listos","accent")+
      '</div>'+
    '</div>';

    return { html:html, title:"KAIROS IA", after:function(root){
      const stream = root.querySelector("#chatStream"), form = root.querySelector("#chatForm"), input = root.querySelector("#chatInput");
      function add(role,text){
        const el = document.createElement("div");
        el.className = "msg "+role;
        el.innerHTML = '<span class="av">'+(role==="user"?"L":"K")+'</span><div class="bubble">'+ISC.md(text)+'</div>';
        stream.appendChild(el); stream.scrollTop = stream.scrollHeight;
        return el;
      }
      function send(text){
        text = String(text||"").trim(); if(!text) return;
        st.chat.push({role:"user",text:text}); add("user",text); input.value = ""; ISC.save();
        const typing = document.createElement("div");
        typing.className = "msg bot";
        typing.innerHTML = '<span class="av">K</span><div class="bubble"><span class="typing"><i></i><i></i><i></i></span></div>';
        stream.appendChild(typing); stream.scrollTop = stream.scrollHeight;
        setTimeout(function(){
          typing.remove();
          const answer = iaRespond(text);
          st.chat.push({role:"bot",text:answer}); add("bot",answer); ISC.save();
        }, 620);
      }
      form.addEventListener("submit", function(e){ e.preventDefault(); send(input.value); });
      root.querySelectorAll("[data-suggest]").forEach(function(b){
        b.addEventListener("click", function(){ send(b.getAttribute("data-suggest")); });
      });
      root.querySelector("[data-clear-chat]").addEventListener("click", function(){
        ISC.modal({title:"Limpiar conversación",body:"<p class='muted'>Se borrarán los mensajes guardados en este navegador. No afecta tu avance.</p>",
          foot:'<button class="btn ghost" type="button" data-modal-close>Cancelar</button><button class="btn primary" type="button" id="confirmClear">Limpiar</button>',
          onOpen:function(ov){ ov.querySelector("#confirmClear").addEventListener("click", function(){ st.chat = []; ISC.saveNow(); ISC.closeModal(); ISC.rerender(); ISC.toast("Conversación limpia"); }); }});
      });
      stream.scrollTop = stream.scrollHeight;
      if(prefill) setTimeout(function(){ input.focus(); }, 120);
    }};
  });

  /* ================= EXÁMENES ================= */
  ISC.registerView("examenes", function(){
    const g = ISC.globalStats();
    const all = ISC.classes.map(function(c){ return { c:c, ex:ISC.examOf(c.id) }; }).filter(function(x){ return x.ex; });
    let filter = "todos";
    function cardOf(x){
      const c = x.c, ex = x.ex, keyed = !!(ex.respuestas && ex.respuestas.length);
      const ok = ISC.isApproved(c.id), best = ISC.bestScore(c.id);
      return '<a class="exam-card spot" href="#/examen/'+c.id+'">'+
        '<div class="top"><span class="ord">'+esc(c._mod.titulo.replace(/^Módulo \d+ · /,"").toUpperCase())+'</span>'+
          (keyed?'<span class="badge '+(ok?"green":"cyan")+'">'+(ok?"Aprobado":(best!=null?best+"%":"Pendiente"))+'</span>':'<span class="badge gold">Práctica</span>')+'</div>'+
        '<strong>'+esc(ex.titulo||c.titulo)+'</strong>'+
        '<small>'+ex.preguntas.length+' preguntas · nota mínima '+ex.nota_minima+'%</small>'+
        '<div class="foot"><span>Clase '+c.orden+' · '+esc(c._mod.titulo.replace(/^Módulo \d+ · /,""))+'</span><span class="'+(ok?"ok":"pending")+'">'+(keyed?"Con clave":"Autoevaluación")+'</span></div></a>';
    }
    function listHTML(){
      let rows = all;
      if(filter==="pendientes") rows = rows.filter(function(x){ return !ISC.isApproved(x.c.id) && x.ex.respuestas && x.ex.respuestas.length; });
      if(filter==="aprobados") rows = rows.filter(function(x){ return ISC.isApproved(x.c.id); });
      if(filter==="practica") rows = rows.filter(function(x){ return !(x.ex.respuestas && x.ex.respuestas.length); });
      return ISC.modules.map(function(m){
        const ms = rows.filter(function(x){ return x.c._mod.id === m.id; });
        if(!ms.length) return "";
        return '<h2 class="section-h">'+esc(m.titulo)+' <span class="badge">'+ms.length+'</span></h2><div class="grid-3 stagger">'+ms.map(function(x,i){
          return '<div style="--i:'+i+'">'+cardOf(x)+'</div>';
        }).join("")+'</div>';
      }).join("") || '<div class="empty"><span class="ico">'+icon("exam",22)+'</span><strong>Nada por aquí</strong><p>Cambia el filtro para ver tus exámenes.</p></div>';
    }
    const keyedCount = all.filter(function(x){ return x.ex.respuestas && x.ex.respuestas.length; }).length;
    const html = '<div class="view">'+
      pageHead({kicker:"DEMUESTRA LO APRENDIDO", title:"Exámenes", sub:"25 exámenes tienen clave y se califican al instante. Los demás son práctica guiada, sin notas inventadas.", actions:'<a class="btn ghost" href="#/clases">'+icon("play",16)+'Ir a clases</a>'})+
      '<div class="stats-grid stagger">'+
        stat("Aprobados", g.approved+" / 60", "nota mínima 80%","green")+
        stat("Con clave", keyedCount, "se califican solo","accent")+
        stat("Práctica", 60-keyedCount, "autoevaluación")+
        stat("Módulo actual", ISC.modLabel(ISC.currentClass()._mod), esc(ISC.currentClass()._mod.titulo.replace(/^Módulo \d+ · /,""))) +
      '</div>'+
      '<div class="toolbar reveal"><div class="chips" id="examFilters">'+
        '<button class="chip active" data-ef="todos" type="button">Todos <span class="n">60</span></button>'+
        '<button class="chip" data-ef="pendientes" type="button">Pendientes</button>'+
        '<button class="chip" data-ef="aprobados" type="button">Aprobados <span class="n">'+g.approved+'</span></button>'+
        '<button class="chip" data-ef="practica" type="button">Práctica</button>'+
      '</div></div>'+
      '<div id="examList" class="reveal">'+listHTML()+'</div>'+
      '<div class="panel"><div class="panel-foot">'+icon("info",14)+' Los exámenes de práctica no tienen clave de respuestas en tu cuenta. Los marcamos así para no darte una nota falsa.</div></div>'+
    '</div>';
    return { html:html, title:"Exámenes", after:function(root){
      const list = root.querySelector("#examList");
      root.querySelectorAll("[data-ef]").forEach(function(b){
        b.addEventListener("click", function(){
          filter = b.getAttribute("data-ef");
          root.querySelectorAll("[data-ef]").forEach(function(x){ x.classList.toggle("active",x===b); });
          list.innerHTML = listHTML();
        });
      });
    }};
  });

  ISC.registerView("examen", function(params){
    const c = ISC.classById[params.id], ex = c && ISC.examOf(c.id);
    if(!c || !ex) return { html:'<div class="view"><div class="empty"><strong>Examen no encontrado</strong><p><a href="#/examenes">Volver a exámenes</a></p></div></div>' };
    const keyed = !!(ex.respuestas && ex.respuestas.length);
    const prev = ISC.state.exams[c.id];
    const ok = ISC.isApproved(c.id);
    const nextExam = ISC.classes.filter(function(x){ return x._index > c._index && ISC.examOf(x.id); })[0];
    const qs = ex.preguntas;

    const body = qs.map(function(q,i){
      return '<div class="q-block" style="--i:'+i+'"><div class="q-head"><span class="q-num">'+(i+1)+'</span><div class="q-text">'+esc(q.q)+'</div></div><div class="opts">'+
        q.opciones.map(function(o,j){
          return '<label class="opt" data-opt="'+i+'-'+j+'"><input type="radio" name="q'+i+'" value="'+j+'"><span class="mark"></span><span>'+esc(o)+'</span></label>';
        }).join("")+'</div></div>';
    }).join("");

    const abiertas = (ex.abiertas||[]).length ? '<div class="panel"><div class="panel-head"><div class="pt"><h3>Preguntas abiertas</h3><p>No suman nota automática; te ayudan a aplicar.</p></div></div><div class="panel-body">'+
      ex.abiertas.map(function(a,i){ return '<div class="field mt-12"><label>'+esc(a)+'</label><textarea class="textarea" data-open-q="'+i+'"></textarea></div>'; }).join("")+'</div></div>' : "";

    const practiceNote = keyed ? "" :
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Examen de práctica</h3><p>Sin clave de respuestas</p></div><span class="badge gold">Autoevaluación</span></div><div class="panel-body"><p class="muted small" style="margin:0">Este examen no tiene respuestas correctas guardadas en tu cuenta. Puedes responderlo y autoevaluarte, pero no mostramos una nota inventada. Al terminar, revisa el manual de la clase y marca tu nivel de seguridad.</p></div></div>';

    const html = '<div class="view">'+
      crumb([{label:"Exámenes",href:"#/examenes"},{label:c._mod.titulo.replace(/^Módulo \d+ · /,""),href:"#/examenes"},{label:"Examen"}])+
      '<div class="lesson-head"><div><h1>'+esc(ex.titulo || c.titulo)+'</h1><div class="meta">'+
        '<span class="badge cyan">'+esc(c._mod.titulo)+'</span><span class="badge">'+qs.length+' preguntas</span><span class="badge">Nota mínima '+ex.nota_minima+'%</span>'+
        (keyed?'<span class="badge green">Con clave</span>':'<span class="badge gold">Práctica</span>')+
        (ok?'<span class="badge green">Aprobado</span>':'')+
      '</div></div><div class="head-actions"><a class="btn ghost" href="#/clase/'+c.id+'">'+icon("play",16)+'Ver clase</a>'+(prev && prev.score != null?'<span class="badge">Mejor: '+prev.score+'%</span>':"")+'</div></div>'+
      practiceNote+
      (keyed?'<div class="exam-block"><div class="exam-progress"><i id="examBar" style="width:0%"></i></div>'+body+
        '<div class="exam-actions"><span class="muted small" id="answered">0 de '+qs.length+' respondidas</span><div class="split"><button class="btn ghost" type="button" data-reset-exam>Limpiar</button><button class="btn primary" type="button" id="gradeBtn">'+icon("check",16)+'Calificar examen</button></div></div></div>'
        : '<div class="exam-block"><div class="exam-progress"><i id="examBar" style="width:0%"></i></div>'+body+
          '<div class="exam-actions"><span class="muted small" id="answered">0 de '+qs.length+' respondidas</span><button class="btn gold" type="button" id="gradeBtn">'+icon("star",16)+'Cerrar práctica</button></div></div>')+
      abiertas+
      '<div id="examResult"></div>'+
      '<div class="split mt-24"><a class="btn ghost" href="#/examenes">'+icon("back",16)+'Todos los exámenes</a>'+
        (nextExam?'<a class="btn primary" href="#/examen/'+nextExam.id+'">Siguiente examen'+icon("arrow",16)+'</a>':"")+'</div>'+
    '</div>';

    return { html:html, title:"Examen · "+c.titulo, after:function(root){
      const bar = root.querySelector("#examBar"), answered = root.querySelector("#answered");
      const chosen = {};
      function refreshCount(){
        const n = Object.keys(chosen).length;
        if(answered) answered.textContent = n+" de "+qs.length+" respondidas";
        if(bar) bar.style.width = (n/qs.length*100)+"%";
      }
      root.querySelectorAll(".opt input").forEach(function(inp){
        inp.addEventListener("change", function(){
          const qi = Number(inp.name.replace("q","")), val = Number(inp.value);
          chosen[qi] = val;
          root.querySelectorAll('[data-opt^="'+qi+'-"]').forEach(function(l){ l.classList.toggle("sel", l.getAttribute("data-opt")===qi+"-"+val); });
          refreshCount();
        });
      });
      root.querySelector("[data-reset-exam]") && root.querySelector("[data-reset-exam]").addEventListener("click", function(){
        root.querySelectorAll(".opt").forEach(function(l){ l.classList.remove("sel","correct","wrong"); l.querySelector("input").checked = false; });
        Object.keys(chosen).forEach(function(k){ delete chosen[k]; });
        refreshCount(); root.querySelector("#examResult").innerHTML = "";
      });
      root.querySelector("#gradeBtn").addEventListener("click", function(){
        const answeredCount = Object.keys(chosen).length;
        if(answeredCount < qs.length){
          ISC.toast("Responde las "+qs.length+" preguntas antes de calificar","info");
          const first = qs.findIndex(function(_,i){ return chosen[i] == null; });
          const el = root.querySelectorAll(".q-block")[first]; if(el) el.scrollIntoView({behavior:"smooth",block:"center"});
          return;
        }
        if(!keyed){
          const self = 3;
          ISC.state.exams[c.id] = { practice:true, score:null, self:self, date:Date.now() };
          ISC.saveNow();
          root.querySelector("#examResult").innerHTML = '<div class="panel"><div class="panel-body"><div class="empty"><span class="ico">'+icon("check",22)+'</span><strong>Práctica completada</strong><p>No hay nota automática porque este examen no tiene clave. Revisa el manual, vuelve a ver la clase y presenta el examen de otra clase con clave.</p><div class="form-actions" style="justify-content:center"><a class="btn sm" href="#/clase/'+c.id+'">Ver clase</a>'+(ISC.lessonByClass[c.id]?'<a class="btn sm primary" href="#/manual/'+ISC.lessonByClass[c.id].id+'">Leer manual</a>':"")+'</div></div></div></div>';
          ISC.toast("Práctica completada");
          return;
        }
        let correct = 0;
        qs.forEach(function(q,i){
          const right = ex.respuestas[i];
          if(chosen[i] === right) correct++;
          root.querySelectorAll('[data-opt^="'+i+'-"]').forEach(function(l){
            const j = Number(l.getAttribute("data-opt").split("-")[1]);
            l.classList.remove("sel");
            if(j === right) l.classList.add("correct");
            else if(chosen[i] === j) l.classList.add("wrong");
            const inp = l.querySelector("input"); if(inp) inp.disabled = true;
          });
        });
        const score = Math.round(correct/qs.length*100);
        const approved = score >= ex.nota_minima;
        ISC.state.exams[c.id] = { score:score, approved:approved, date:Date.now(), answers:Object.assign({},chosen) };
        ISC.saveNow();
        const offset = 263.89 * (1 - score/100);
        root.querySelector("#examResult").innerHTML = '<div class="panel" style="border-color:'+(approved?"rgba(75,227,160,.35)":"rgba(245,184,61,.3)")+'"><div class="panel-body"><div class="split"><div style="display:flex;align-items:center;gap:16px"><div class="score-ring"><svg viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="42"/><circle class="meter" cx="50" cy="50" r="42" style="stroke:'+(approved?"var(--green)":"var(--gold)")+';stroke-dasharray:263.89;stroke-dashoffset:'+offset+'"/></svg><span>'+score+'%</span></div><div><h3 style="margin:0;font-family:Sora,sans-serif">'+(approved?"Aprobado":"Casi lo tienes")+'</h3><p class="muted small" style="margin:4px 0 0">'+correct+' de '+qs.length+' correctas · necesitas '+ex.nota_minima+'%</p></div></div><div class="head-actions"><a class="btn sm" href="#/clase/'+c.id+'">Repasar clase</a><button class="btn sm ghost" type="button" data-retry>Intentar otra vez</button></div></div></div></div>';
        root.querySelector("[data-retry]").addEventListener("click", function(){ ISC.rerender(); });
        ISC.toast(approved?"¡Examen aprobado!":"Examen calificado");
        const card = root.querySelector("#examResult"); if(card) card.scrollIntoView({behavior:"smooth",block:"center"});
      });
    }};
  });

  ISC.registerView("notfound", function(){
    return { html:'<div class="view"><div class="empty" style="min-height:50vh"><span class="ico">'+icon("search",22)+'</span><strong>Esta sección no existe</strong><p>Vuelve al inicio para seguir tu ruta.</p><a class="btn primary mt-12" href="#/inicio">Volver a Inicio</a></div></div>', title:"No encontrado" };
  });
})();
