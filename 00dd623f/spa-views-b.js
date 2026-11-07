(function(){
  "use strict";
  const ISC = window.ISC, C = ISC.content, U = ISC.ui;
  const esc = ISC.esc, icon = ISC.icon, money = ISC.money;

  function toolLink(id){
    if(id === "landings") return "#/landings";
    return "#/herramientas/" + id;
  }
  function toolMeta(id){ return C.tools.filter(function(t){ return t.id === id; })[0]; }
  function fileField(id,label,value,type,placeholder,hint){
    return '<div class="field"><label for="f-'+id+'">'+esc(label)+'</label><input class="input" id="f-'+id+'" type="'+(type||"text")+'" data-tool-field="'+id+'" value="'+esc(value||"")+'" placeholder="'+esc(placeholder||"")+'">'+(hint?'<span class="hint">'+esc(hint)+'</span>':"")+'</div>';
  }
  function toolHead(id){
    const t = toolMeta(id);
    return U.crumb([{label:"Herramientas",href:"#/herramientas"},{label:t?t.title:"Herramienta"}])+
      U.hero(t?t.step:"HERRAMIENTAS KAIROS", t?t.title:"Herramienta", esc(t?t.desc:"") , '<div class="chips mt-16"><span class="badge cyan">Se guarda en tu navegador</span><span class="badge">Sin internet obligatorio</span></div>');
  }

  /* ================= PROMPTS ================= */
  ISC.registerView("prompts", function(){
    const rows = [];
    ISC.lessonsSorted = (ISC.session.lessons||[]).slice().sort(function(a,b){ return (a.orden||0)-(b.orden||0); });
    ISC.lessonsSorted.forEach(function(l){
      const c = ISC.classById[l.clase_id];
      (l.prompts||[]).forEach(function(p,i){
        rows.push({ p:p, i:i, lesson:l, clase:c, mod:c?c._mod.titulo:(l.modulo||"") });
      });
    });
    const mods = [];
    rows.forEach(function(r){ if(mods.indexOf(r.mod) < 0) mods.push(r.mod); });
    let filter = "todos", query = "";

    function card(r){
      const href = r.clase ? "#/ia?clase="+r.clase.id+"&pi="+r.i : "#/ia";
      return '<article class="prompt-card spot" data-prompt><div class="prompt-top"><span class="prompt-num">'+String(r.i+1).padStart(2,"0")+'</span>'+
        '<div class="prompt-main"><strong>'+esc(r.p.titulo)+'</strong><small>'+esc(r.p.para||r.clase&&r.clase.titulo||"")+'</small></div>'+
        '<div class="prompt-actions"><button class="icon-btn" type="button" data-copy="'+esc(r.p.texto)+'" data-copy-msg="Prompt copiado" aria-label="Copiar prompt">'+icon("copy",15)+'</button>'+
        '<button class="icon-btn" type="button" data-prompt-toggle aria-label="Ver prompt">'+icon("down",15)+'</button></div></div>'+
        '<div class="prompt-body"><div class="prompt-body-inner"><pre class="prompt-text">'+esc(r.p.texto)+'</pre>'+
        '<div class="prompt-foot"><span>'+esc(r.mod.replace(/^Módulo \d+ · /,""))+'</span><a class="btn sm" href="'+href+'">'+icon("spark",14)+'Abrir en KAIROS IA</a></div></div></div></article>';
    }
    function listHTML(){
      const q = query.toLowerCase();
      const visible = rows.filter(function(r){
        if(filter !== "todos" && r.mod !== filter) return false;
        if(!q) return true;
        return (r.p.titulo+" "+(r.p.para||"")+" "+r.p.texto).toLowerCase().indexOf(q) > -1;
      });
      const groups = [];
      visible.forEach(function(r){
        let g = groups.filter(function(x){ return x.mod === r.mod; })[0];
        if(!g){ g = { mod:r.mod, items:[] }; groups.push(g); }
        g.items.push(r);
      });
      return groups.map(function(g){
        return U.section(g.mod, g.items.length + " prompts") + '<div class="stagger">'+g.items.map(function(r,i){ return '<div style="--i:'+i+'">'+card(r)+'</div>'; }).join("")+'</div>';
      }).join("") || U.empty("search","Sin resultados","Prueba con otra palabra o cambia el módulo.");
    }
    const counts = {};
    rows.forEach(function(r){ counts[r.mod] = (counts[r.mod]||0)+1; });
    const html = '<div class="view">'+
      U.pageHead({kicker:"BIBLIOTECA KAIROS", title:"Prompts", sub:"123 prompts listos para copiar, ordenados por módulo. Todos se abren también dentro de KAIROS IA.", actions:'<a class="btn ghost" href="#/manual">'+icon("book",16)+'Manual</a><a class="btn" href="#/ia">'+icon("spark",16)+'Abrir IA</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Prompts", rows.length, "listos para usar","accent")+U.stat("Módulos", mods.length, "agrupados")+U.stat("Clases", new Set(rows.map(function(r){return r.lesson.id;})).size, "con prompts")+U.stat("Gratis", "100%", "sin costo extra")+'</div>'+
      '<div class="toolbar reveal"><label class="search">'+icon("search",17)+'<input type="search" id="promptSearch" placeholder="Buscar por título, uso o texto…" aria-label="Buscar prompt"></label>'+
        '<div class="chips" id="promptFilters"><button class="chip active" type="button" data-pf="todos">Todos <span class="n">'+rows.length+'</span></button>'+
        mods.map(function(m){ return '<button class="chip" type="button" data-pf="'+esc(m)+'">'+esc(m.replace(/^Módulo \d+ · /,""))+' <span class="n">'+counts[m]+'</span></button>'; }).join("")+'</div></div>'+
      '<div id="promptList" class="reveal">'+listHTML()+'</div>'+
      '<div class="panel"><div class="panel-foot">'+icon("info",14)+' Reemplaza los campos entre corchetes con tus datos antes de enviar el prompt.</div></div>'+
    '</div>';
    return { html:html, title:"Prompts", after:function(root){
      const list = root.querySelector("#promptList");
      function bind(){
        list.querySelectorAll("[data-prompt-toggle]").forEach(function(b){
          b.addEventListener("click", function(){ b.closest("[data-prompt]").classList.toggle("open"); });
        });
      }
      bind();
      const search = root.querySelector("#promptSearch");
      search.addEventListener("input", function(){ query = search.value.trim(); list.innerHTML = listHTML(); bind(); });
      root.querySelectorAll("[data-pf]").forEach(function(b){
        b.addEventListener("click", function(){
          filter = b.getAttribute("data-pf");
          root.querySelectorAll("[data-pf]").forEach(function(x){ x.classList.toggle("active", x===b); });
          list.innerHTML = listHTML(); bind();
        });
      });
    }};
  });

  /* ================= MANUAL ================= */
  ISC.registerView("manual", function(){
    const lessons = ISC.lessonsSorted || (ISC.session.lessons||[]).slice().sort(function(a,b){ return (a.orden||0)-(b.orden||0); });
    const withManual = lessons.filter(function(l){ return l.manual; });
    const groups = [];
    withManual.forEach(function(l){
      const c = ISC.classById[l.clase_id];
      const mod = c ? c._mod.titulo : (l.modulo||"");
      let g = groups.filter(function(x){ return x.mod === mod; })[0];
      if(!g){ g = { mod:mod, items:[] }; groups.push(g); }
      g.items.push(l);
    });
    const html = '<div class="view">'+
      U.pageHead({kicker:"LECTURA DE LA RUTA", title:"Manual", sub:"42 manuales escritos para leer rápido y aplicar. Cada uno conecta con su clase y sus prompts.", actions:'<a class="btn ghost" href="#/clases">'+icon("play",16)+'Clases</a><a class="btn" href="#/prompts">'+icon("spark",16)+'Prompts</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Manuales", withManual.length, "con lectura","accent")+U.stat("Clases", ISC.classes.length, "en la ruta")+U.stat("Prompts", 123, "vinculados")+'</div>'+
      groups.map(function(g){
        return U.section(g.mod, g.items.length+" lecturas")+'<div class="grid-2 stagger">'+g.items.map(function(l,i){
          const c = ISC.classById[l.clase_id];
          return '<div style="--i:'+i+'"><a class="resource-card" href="#/manual/'+l.id+'"><span class="rc-ico">'+icon("book",20)+'</span><strong>'+esc(l.titulo)+'</strong><small>'+esc(l.resumen||(c&&c.descripcion)||"Lectura de la clase.")+'</small><span class="go">Leer manual '+icon("arrow",12)+'</span></a></div>';
        }).join("")+'</div>';
      }).join("")+
    '</div>';
    return { html:html, title:"Manual" };
  });

  ISC.registerView("manual-leccion", function(params){
    const l = ISC.lessonById[params.id];
    if(!l) return { html:'<div class="view">'+U.empty("book","Manual no encontrado",'<a href="#/manual">Volver al índice</a>')+'</div>' };
    const c = ISC.classById[l.clase_id];
    const all = ISC.lessonsSorted || [];
    const idx = all.findIndex(function(x){ return String(x.id) === String(l.id); });
    const prev = idx > 0 ? all[idx-1] : null, next = idx > -1 && idx < all.length-1 ? all[idx+1] : null;
    const toc = ISC.toc(l.manual||"");
    const done = c ? ISC.isDone(c.id) : false;
    const html = '<div class="view">'+
      U.crumb([{label:"Manual",href:"#/manual"},{label:l.titulo}])+
      '<div class="lesson-head"><div><h1>'+esc(l.titulo)+'</h1><div class="meta">'+
        '<span class="badge cyan">'+esc(l.modulo||"")+'</span><span class="badge">'+esc(l.sesion||"")+'</span>'+
        (c?'<span class="badge">Clase '+c.orden+'</span>':"")+
      '</div></div><div class="head-actions">'+
        (c?'<a class="btn ghost" href="#/clase/'+c.id+'">'+icon("play",16)+'Ver clase</a>':"")+
        (c?'<button class="btn '+(done?"ghost":"primary")+'" type="button" data-done-toggle="'+c.id+'">'+icon("check",16)+'<span>'+(done?"Vista":"Marcar completada")+'</span></button>':"")+
      '</div></div>'+
      (toc.length?'<div class="toc">'+toc.map(function(t){ return '<button class="chip" type="button" data-scroll="'+t.id+'">'+esc(t.label)+'</button>'; }).join("")+'</div>':"")+
      '<div class="panel"><div class="panel-body"><div class="md" id="manualBody">'+ISC.md(l.manual||l.resumen)+'</div></div>'+
      '<div class="panel-foot"><div class="split"><span>'+esc(l.resumen||"")+'</span><span class="badge">'+Math.max(2,Math.round((l.manual||"").split(/\s+/).length/180))+' min de lectura</span></div></div></div>'+
      (l.prompts&&l.prompts.length?'<div class="panel"><div class="panel-head"><div class="pt"><h3>Prompts de esta lectura</h3><p>'+l.prompts.length+' listos para copiar</p></div><a class="btn sm ghost" href="#/prompts">Ver todos</a></div><div class="panel-body">'+
        l.prompts.map(function(p,i){
          return '<article class="prompt-card"><div class="prompt-top"><span class="prompt-num">'+String(i+1).padStart(2,"0")+'</span><div class="prompt-main"><strong>'+esc(p.titulo)+'</strong><small>'+esc(p.para||"")+'</small></div><div class="prompt-actions"><button class="icon-btn" type="button" data-copy="'+esc(p.texto)+'" data-copy-msg="Prompt copiado" aria-label="Copiar">'+icon("copy",15)+'</button><button class="icon-btn" type="button" data-prompt-toggle aria-label="Ver">'+icon("down",15)+'</button></div></div><div class="prompt-body"><div class="prompt-body-inner"><pre class="prompt-text">'+esc(p.texto)+'</pre><div class="prompt-foot"><span>Biblioteca ISKAIROS</span><a class="btn sm" href="#/ia?clase='+l.clase_id+'&pi='+i+'">'+icon("spark",14)+'Usar en IA</a></div></div></div></article>';
        }).join("")+'</div></div>':"")+
      '<div class="split mt-24">'+(prev?'<a class="btn ghost" href="#/manual/'+prev.id+'">'+icon("back",16)+'Anterior</a>':'<span></span>')+(next?'<a class="btn primary" href="#/manual/'+next.id+'">Siguiente'+icon("arrow",16)+'</a>':'<span></span>')+'</div>'+
    '</div>';
    return { html:html, title:l.titulo, after:function(root){
      root.querySelectorAll("[data-prompt-toggle]").forEach(function(b){ b.addEventListener("click", function(){ b.closest(".prompt-card").classList.toggle("open"); }); });
      const b = root.querySelector("[data-done-toggle]");
      if(b) b.addEventListener("click", function(){
        const now = !ISC.isDone(c.id); ISC.markDone(c.id, now);
        b.className = "btn " + (now?"ghost":"primary");
        b.innerHTML = icon("check",16)+"<span>"+(now?"Vista":"Marcar completada")+"</span>";
        ISC.toast(now?"Clase marcada como vista":"Marcada como pendiente");
      });
    }};
  });

  /* ================= HERRAMIENTAS ================= */
  ISC.registerView("herramientas", function(){
    const html = '<div class="view">'+
      U.pageHead({kicker:"HERRAMIENTAS KAIROS", title:"Tu caja de herramientas", sub:"Organizadas según la ruta: elegir, crear, vender online y medir. Todas funcionan dentro de este archivo.", actions:'<a class="btn ghost" href="#/ia">'+icon("spark",16)+'KAIROS IA</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Herramientas", C.tools.length, "activas","accent")+U.stat("Grupos", C.toolGroups.length, "según la ruta")+U.stat("Costeo", "Regla 3X", "incluida")+U.stat("Datos", "Locales", "privados")+'</div>'+
      C.toolGroups.map(function(g,gi){
        return '<section class="tool-group reveal">'+U.section(g.title, g.tools.length+" herramientas")+
          '<div class="tool-grid stagger">'+g.tools.map(function(id,i){
            const t = toolMeta(id); if(!t) return "";
            return '<div style="--i:'+i+'"><a class="tool-card" href="'+toolLink(id)+'"><span class="tool-ico">'+icon(t.icon,20)+'</span><span><strong>'+esc(t.title)+'</strong><small>'+esc(t.desc)+'</small><span class="badge cyan">'+esc(t.step)+'</span></span></a></div>';
          }).join("")+'</div></section>';
      }).join("")+
    '</div>';
    return { html:html, title:"Herramientas" };
  });

  /* ================= CHECKLIST PRODUCTO ================= */
  ISC.registerView("herramienta", function(params){
    const id = params.tool;
    if(id === "landings") return { html:'<div class="view">'+U.pageHead({kicker:"MÓDULO 3",title:"Creador de landings IA",sub:"Tu página de venta con pedidos contra entrega."})+'<div class="panel"><div class="panel-body"><a class="btn primary" href="#/landings">'+icon("spark",16)+'Abrir Mis landings</a></div></div></div>', title:"Landings" };
    if(id === "ia") return IAView();
    if(id === "producto") return productoView();
    if(id === "costeo") return costeoView();
    if(id === "meta") return metaView();
    if(id === "video") return videoView();
    if(id === "guion") return guionView();
    if(id === "mensajes") return mensajesView();
    if(id === "simulador") return simuladorView();
    if(id === "anuncios") return anunciosView();
    if(id === "campana") return campanaView();
    if(id === "ventas") return ventasView();
    if(id === "rutina") return rutinaView();
    return { html:'<div class="view">'+U.empty("tools","Herramienta no encontrada",'<a class="btn primary mt-12" href="#/herramientas">Volver a Herramientas</a>')+'</div>' };
  });

  const FILTERS = [
    ["regla","Regla 3X","Tu PVP es al menos 3 veces el costo del proveedor."],
    ["margen","Margen mayor al 40%","Después de producto, envío y CPA te queda al menos 40% del precio."],
    ["ticket","Ticket de $40.000 o más","Un ticket bajo no aguanta el costo de conseguir un cliente."],
    ["valor","Valor percibido alto","El cliente siente que recibe más de lo que paga."],
    ["stock","Stock confirmado","Tienes proveedor con inventario y despacho estable."],
    ["deseo","Resuelve un problema o deseo","No es un capricho: hay una necesidad clara."],
    ["video","Se explica en un video de 30s","Puedes mostrar el beneficio sin texto largo."],
    ["envio","Fácil de enviar","No es frágil, pesado ni complicado de despachar."]
  ];

  function productoView(){
    const s = ISC.state.checklist;
    function score(){ return Math.round(s.checked.length/FILTERS.length*100); }
    function rows(){
      return FILTERS.map(function(f){
        const on = s.checked.indexOf(f[0]) > -1;
        return '<label class="checkitem '+(on?"on":"")+'" data-check="'+f[0]+'"><span class="box">'+icon("check",13)+'</span><span><strong>'+esc(f[1])+'</strong><small>'+esc(f[2])+'</small></span></label>';
      }).join("");
    }
    const html = '<div class="view">'+toolHead("producto")+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Tu producto en números</h3><p>Opcional, pero ayuda a calcular los filtros.</p></div></div><div class="panel-body"><div class="grid-3">'+
        fileField("producto","Producto",s.producto,"text","Ej: Organizador de nevera")+
        fileField("costo","Costo en el proveedor",s.costo,"number","30000")+
        fileField("precio","Precio de venta (PVP)",s.precio,"number","90000")+
      '</div><div class="form-actions"><button class="btn" type="button" id="autoFilters">'+icon("calc",16)+'Calcular filtros con estos números</button></div></div></div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Checklist de producto ganador</h3><p>Marca solo lo que puedas demostrar, no lo que te gustaría.</p></div><span class="badge" id="checkCount">'+s.checked.length+' de 8</span></div>'+
        '<div class="panel-body"><div class="checklist" id="checkList">'+rows()+'</div>'+
        '<div class="check-score"><div class="bar"><i id="checkBar" style="width:'+score()+'%"></i></div><strong id="checkPct">'+score()+'%</strong></div>'+
        '<div class="form-actions"><button class="btn primary" type="button" id="evalProduct">'+icon("spark",16)+'Evaluar con IA</button><a class="btn ghost" href="#/proveedores">'+icon("providers",16)+'Ver proveedores</a><a class="btn ghost" href="#/herramientas/costeo">'+icon("calc",16)+'Costear</a></div></div></div>'+
    '</div>';
    return { html:html, title:"Producto ganador", after:function(root){
      function refresh(){
        root.querySelector("#checkCount").textContent = s.checked.length+" de 8";
        root.querySelector("#checkPct").textContent = score()+"%";
        root.querySelector("#checkBar").style.width = score()+"%";
      }
      root.querySelectorAll("[data-check]").forEach(function(el){
        el.addEventListener("click", function(e){
          e.preventDefault();
          const id = el.getAttribute("data-check"), i = s.checked.indexOf(id);
          if(i > -1) s.checked.splice(i,1); else s.checked.push(id);
          el.classList.toggle("on", i < 0); ISC.save(); refresh();
        });
      });
      root.querySelectorAll("[data-tool-field]").forEach(function(inp){
        inp.addEventListener("input", function(){ s[inp.getAttribute("data-tool-field")] = inp.value; ISC.save(); });
      });
      root.querySelector("#autoFilters").addEventListener("click", function(){
        const costo = ISC.parseNum(s.costo), pvp = ISC.parseNum(s.precio);
        if(!costo || !pvp){ ISC.toast("Escribe costo y precio para calcular","info"); return; }
        const margin = (pvp-costo)/pvp*100;
        [["regla",pvp>=costo*3],["margen",margin>=40],["ticket",pvp>=40000]].forEach(function(x){
          const i = s.checked.indexOf(x[0]);
          if(x[1] && i<0) s.checked.push(x[0]);
          if(!x[1] && i>-1) s.checked.splice(i,1);
        });
        ISC.save(); root.querySelector("#checkList").innerHTML = rows(); 
        root.querySelectorAll("[data-check]").forEach(function(el){
          el.addEventListener("click", function(e){
            e.preventDefault(); const id = el.getAttribute("data-check"), i = s.checked.indexOf(id);
            if(i>-1) s.checked.splice(i,1); else s.checked.push(id);
            el.classList.toggle("on", i<0); ISC.save(); refresh();
          });
        });
        refresh(); ISC.toast("Filtros calculados con tus números");
      });
      root.querySelector("#evalProduct").addEventListener("click", function(){
        const missing = FILTERS.filter(function(f){ return s.checked.indexOf(f[0])<0; });
        ISC.modal({ title:"Evaluación del producto", body:
          '<div class="result-line"><span>Filtros cumplidos</span><strong>'+s.checked.length+' de 8</strong></div>'+
          '<div class="result-line"><span>Regla 3X</span><strong>'+(s.costo&&s.precio? (ISC.parseNum(s.precio)>=ISC.parseNum(s.costo)*3?"Cumple":"No cumple") : "Faltan datos")+'</strong></div>'+
          '<div class="result-line"><span>Margen bruto</span><strong>'+(s.costo&&s.precio? Math.round((ISC.parseNum(s.precio)-ISC.parseNum(s.costo))/ISC.parseNum(s.precio)*100)+"%" : "—")+'</strong></div>'+
          (missing.length?'<p class="small muted mt-12">Te falta demostrar: <strong>'+missing.map(function(f){return esc(f[1]);}).join(", ")+'</strong>.</p>':'<p class="small mt-12" style="color:var(--green)">Cumple los 8 filtros. Pasa a costear y validar con una campaña pequeña.</p>')+
          '<div class="result-big"><div class="k">Recomendación</div><div class="v" style="font-size:18px">'+(s.checked.length>=6?"Sigue adelante":"Busca otra opción")+'</div><small>La decisión final la validan los números y el mercado.</small></div>',
          foot:'<button class="btn ghost" type="button" data-copy="Analiza mi producto como mentor de dropshipping. Producto: '+esc(s.producto||"[producto]")+'. Costo: '+esc(s.costo||"[costo]")+'. Precio: '+esc(s.precio||"[precio]")+'. Filtros cumplidos: '+s.checked.join(", ")+'. Dime qué riesgos ves y qué debería validar antes de vender." data-copy-msg="Prompt copiado">'+icon("copy",15)+'Copiar prompt</button><a class="btn primary" href="#/ia">Abrir KAIROS IA</a>'
        });
      });
    }};
  }

  /* ================= COSTEO ================= */
  function costeoData(){
    const d = ISC.state.tools.costeo || {};
    return { pvp: d.pvp || 90000, costo: d.costo || 30000, envio: d.envio || 15000, cpa: d.cpa || 20000, volumen: d.volumen || 10 };
  }
  function costeoCalc(d){
    const gan = d.pvp - d.costo - d.envio - d.cpa;
    return { gan:gan, cpaMax:d.pvp-d.costo-d.envio, margen:d.pvp?gan/d.pvp*100:0, diario:gan*d.volumen, mensual:gan*d.volumen*30 };
  }
  function costeoView(){
    const d = costeoData(), r = costeoCalc(d);
    const html = '<div class="view">'+toolHead("costeo")+
      '<div class="grid-2" style="align-items:start;margin-top:16px">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Datos de tu producto</h3><p>Todo en pesos colombianos.</p></div></div><div class="panel-body"><div class="grid-2">'+
          fileField("pvp","Precio de venta (PVP)",d.pvp,"number","90000")+
          fileField("costo","Costo del producto",d.costo,"number","30000")+
          fileField("envio","Envío + recaudo",d.envio,"number","15000")+
          fileField("cpa","CPA (costo por venta en pauta)",d.cpa,"number","20000")+
        '</div><div class="field mt-12"><label for="f-volumen">Ventas por día: <span id="volLabel">'+d.volumen+'</span></label><input class="range" id="f-volumen" type="range" min="1" max="30" value="'+d.volumen+'" data-tool-field="volumen"></div></div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Resultado</h3><p>Fórmula Maestra KAIROS: PVP − producto − envío − CPA</p></div></div><div class="panel-body" id="costeoResult">'+costeoResultHTML(d,r)+'</div>'+
        '<div class="panel-foot"><div class="split"><span class="small muted">Envío y recaudo: consulta la tabla oficial de Effi.</span><a class="btn sm ghost" href="#/proveedores">Proveedores</a></div></div></div>'+
      '</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Guarda y comparte</h3><p>Tu vitrina y tus números quedan en este navegador.</p></div></div><div class="panel-body"><div class="form-actions" style="margin-top:0">'+
        '<button class="btn primary" type="button" id="saveCosteo">'+icon("check",16)+'Guardar en vitrina</button>'+
        '<button class="btn ghost" type="button" id="copyCosteo">'+icon("copy",16)+'Copiar resumen</button>'+
        '<a class="btn ghost" href="#/herramientas/meta">'+icon("flame",16)+'Meta de facturación</a>'+
        '<a class="btn ghost" href="#/ia?q=costeo">'+icon("spark",16)+'Investigar con mi IA</a>'+
      '</div></div></div>'+
    '</div>';
    return { html:html, title:"Calculadora de costeo", after:function(root){
      function update(){
        const data = costeoData(), res = costeoCalc(data);
        root.querySelector("#costeoResult").innerHTML = costeoResultHTML(data,res);
        const vol = root.querySelector("#volLabel"); if(vol) vol.textContent = data.volumen;
        bindSave(root, data, res);
      }
      root.querySelectorAll("[data-tool-field]").forEach(function(inp){
        inp.addEventListener("input", function(){
          const k = inp.getAttribute("data-tool-field");
          const cur = costeoData();
          cur[k] = k === "volumen" ? Number(inp.value) : ISC.parseNum(inp.value);
          ISC.state.tools.costeo = cur; ISC.save(); update();
        });
      });
      function bindSave(root2, data, res){
        const btn = root2.querySelector("#saveCosteo");
        if(btn) btn.onclick = function(){ ISC.state.tools.costeo = data; ISC.saveNow(); ISC.toast("Costeo guardado en tu vitrina"); };
        const cp = root2.querySelector("#copyCosteo");
        if(cp) cp.onclick = function(){ ISC.copy("Costeo KAIROS\nPVP: "+money(data.pvp)+"\nCosto: "+money(data.costo)+"\nEnvío: "+money(data.envio)+"\nCPA: "+money(data.cpa)+"\nGanancia por venta: "+money(res.gan)+"\nMargen: "+Math.round(res.margen)+"%\nCPA máximo: "+money(res.cpaMax)+"\nCon "+data.volumen+" ventas/día: "+money(res.diario)+" diarios", "Resumen copiado"); };
      }
      bindSave(root, d, r);
    }};
  }
  function costeoResultHTML(d,r){
    return '<div class="result-line"><span>Ganancia por venta</span><strong>'+money(r.gan)+'</strong></div>'+
      '<div class="result-line"><span>CPA máximo que aguantas</span><strong>'+money(r.cpaMax)+'</strong></div>'+
      '<div class="result-line"><span>Margen neto</span><strong>'+r.margen.toFixed(1).replace(".",",")+'%</strong></div>'+
      '<div class="result-line"><span>Ventas por día</span><strong>'+d.volumen+'</strong></div>'+
      '<div class="result-big"><div class="k">Ganancia diaria estimada</div><div class="v">'+money(r.diario)+'</div><small>'+money(r.mensual)+' al mes con '+d.volumen+' ventas diarias.</small></div>'+
      '<p class="small '+(r.gan>0?"":"")+'" style="color:'+(r.gan>=0?"var(--muted)":"#FF8B8B")+';margin:10px 0 0">'+(r.gan>=0?"Si el CPA real supera "+money(r.cpaMax)+", la venta deja de ser rentable.":"Estás perdiendo dinero por venta. Sube el precio, negocia el costo o baja el CPA.")+'</p>';
  }

  /* ================= META ================= */
  function metaData(){
    const d = ISC.state.tools.meta || {};
    return { pvp:d.pvp||90000, costo:d.costo||30000, envio:d.envio||15000, cpa:d.cpa||20000, meta:d.meta||1000000, dias:d.dias||30, cierre:d.cierre||20, entrega:d.entrega||80 };
  }
  function metaCalc(d){
    const gan = d.pvp-d.costo-d.envio-d.cpa;
    const entregadas = gan>0 ? Math.ceil(d.meta/gan) : 0;
    const pedidos = d.entrega>0 ? Math.ceil(entregadas/(d.entrega/100)) : 0;
    const conversaciones = d.cierre>0 ? Math.ceil(pedidos/(d.cierre/100)) : 0;
    const pauta = pedidos*d.cpa;
    return { gan:gan, entregadas:entregadas, pedidos:pedidos, conversaciones:conversaciones, pauta:pauta,
      chatsDia:Math.ceil(conversaciones/d.dias), pedidosDia:Math.ceil(pedidos/d.dias), pautaDia:Math.ceil(pauta/d.dias) };
  }
  function metaView(){
    const d = metaData(), r = metaCalc(d);
    const html = '<div class="view">'+toolHead("meta")+
      '<div class="grid-2" style="align-items:start;margin-top:16px">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Tu meta</h3><p>Del sueño a los números por día.</p></div></div><div class="panel-body"><div class="grid-2">'+
          fileField("meta","Meta de facturación",d.meta,"number","1000000")+
          fileField("dias","Días para lograrla",d.dias,"number","30")+
          fileField("pvp","PVP",d.pvp,"number","90000")+
          fileField("costo","Costo",d.costo,"number","30000")+
          fileField("envio","Envío",d.envio,"number","15000")+
          fileField("cpa","CPA",d.cpa,"number","20000")+
          fileField("cierre","% de cierre",d.cierre,"number","20")+
          fileField("entrega","% de entregas",d.entrega,"number","80")+
        '</div></div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Lo que necesitas cada día</h3><p>Con tu margen y tus porcentajes actuales.</p></div></div><div class="panel-body" id="metaResult">'+metaResultHTML(d,r)+'</div></div>'+
      '</div></div>';
    return { html:html, title:"Meta de facturación", after:function(root){
      function update(){
        const data = metaData(), res = metaCalc(data);
        root.querySelector("#metaResult").innerHTML = metaResultHTML(data,res);
      }
      root.querySelectorAll("[data-tool-field]").forEach(function(inp){
        inp.addEventListener("input", function(){
          const cur = metaData(); cur[inp.getAttribute("data-tool-field")] = ISC.parseNum(inp.value);
          ISC.state.tools.meta = cur; ISC.save(); update();
        });
      });
    }};
  }
  function metaResultHTML(d,r){
    return '<div class="result-line"><span>Ganancia por venta</span><strong>'+money(r.gan)+'</strong></div>'+
      '<div class="result-line"><span>Ventas entregadas</span><strong>'+r.entregadas+'</strong></div>'+
      '<div class="result-line"><span>Pedidos totales</span><strong>'+r.pedidos+'</strong></div>'+
      '<div class="result-line"><span>Conversaciones</span><strong>'+r.conversaciones+'</strong></div>'+
      '<div class="result-line"><span>Pauta estimada</span><strong>'+money(r.pauta)+'</strong></div>'+
      '<div class="result-big"><div class="k">Cada día</div><div class="v">'+r.chatsDia+' chats</div><small>'+r.pedidosDia+' pedidos · '+money(r.pautaDia)+' de pauta · publica al menos 1 video.</small></div>'+
      '<p class="small muted" style="margin:10px 0 0">Si no llegas a los chats, tu cuello de botella es contenido. Si llegas y no cierras, es la conversación.</p>';
  }

  /* ================= VIDEO IA ================= */
  function videoView(){
    const types = ["Anuncio","Tip","Educativo","Testimonio","Historia","Tutorial"];
    const d = ISC.state.tools.video || { tipo:"Anuncio", idea:"", publico:"", dolor:"", beneficio:"", cta:"", duracion:30 };
    const html = '<div class="view">'+toolHead("video")+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Tu idea en 4 zonas</h3><p>Gancho, persona, subtítulos y elementos. Nada de videos hablados a cámara sin estructura.</p></div></div><div class="panel-body">'+
        '<div class="chips" id="videoTypes">'+types.map(function(t){ return '<button class="chip '+(d.tipo===t?"active":"")+'" type="button" data-vtype="'+t+'">'+t+'</button>'; }).join("")+'</div>'+
        '<div class="grid-2 mt-16">'+
          fileField("idea","Idea o producto",d.idea,"text","Organizador de nevera")+
          fileField("publico","A quién le hablas",d.publico,"text","Mujeres que organizan su casa")+
          fileField("dolor","Dolor principal",d.dolor,"text","La nevera siempre desordenada")+
          fileField("beneficio","Beneficio",d.beneficio,"text","Todo visible y ordenado en 2 minutos")+
          fileField("cta","Llamado a la acción",d.cta,"text","Escríbeme QUIERO")+
          fileField("duracion","Duración en segundos",d.duracion,"number","30")+
        '</div>'+
        '<div class="form-actions"><button class="btn primary" type="button" id="genVideo">'+icon("spark",16)+'Generar plan de video</button><button class="btn ghost" type="button" id="copyVideoPrompt">'+icon("copy",16)+'Copiar prompt maestro</button></div>'+
      '</div></div>'+
      '<div id="videoOut">'+videoOutHTML(d)+'</div>'+
    '</div>';
    return { html:html, title:"Creador de videos", after:function(root){
      function collect(){
        const cur = {}; cur.tipo = d.tipo;
        root.querySelectorAll("[data-tool-field]").forEach(function(i){ cur[i.getAttribute("data-tool-field")] = i.value; });
        return cur;
      }
      root.querySelectorAll("[data-vtype]").forEach(function(b){
        b.addEventListener("click", function(){
          d.tipo = b.getAttribute("data-vtype");
          root.querySelectorAll("[data-vtype]").forEach(function(x){ x.classList.toggle("active",x===b); });
          ISC.state.tools.video = collect(); ISC.save();
        });
      });
      root.querySelectorAll("[data-tool-field]").forEach(function(i){
        i.addEventListener("input", function(){ ISC.state.tools.video = collect(); ISC.save(); });
      });
      root.querySelector("#genVideo").addEventListener("click", function(){
        const cur = collect(); ISC.state.tools.video = cur; ISC.saveNow();
        root.querySelector("#videoOut").innerHTML = videoOutHTML(cur);
        ISC.toast("Plan de video generado");
        root.querySelector("#videoOut").scrollIntoView({behavior:"smooth",block:"start"});
      });
      root.querySelector("#copyVideoPrompt").addEventListener("click", function(){
        const cur = collect();
        ISC.copy(videoPrompt(cur), "Prompt maestro copiado");
      });
    }};
  }
  function videoOutHTML(d){
    const dur = Math.max(15, Math.min(90, ISC.parseNum(d.duracion)||30));
    const z = [
      ["Aquí nada","0–15%",Math.round(dur*.15),"Gancho: \""+(d.dolor?"¿"+d.dolor+"?":"Detén el scroll.")+"\" con el producto en primer plano."],
      ["Persona","15–55%",Math.round(dur*.40),"Tú en cámara: problema, quién eres y por qué esto lo resuelve."],
      ["Subs","55–68%",Math.round(dur*.13),"Texto grande: \""+(d.beneficio||"resultado en segundos")+"\"."],
      ["Elementos","68–100%",Math.round(dur*.32),"Producto en uso, prueba, precio y CTA: \""+(d.cta||"Escríbeme")+"\"."]
    ];
    return '<div class="panel"><div class="panel-head"><div class="pt"><h3>Plan de '+dur+' segundos · '+esc(d.tipo||"Anuncio")+'</h3><p>'+esc(d.idea||"Tu producto")+'</p></div><span class="badge cyan">4 zonas</span></div><div class="panel-body"><div class="zones">'+
      z.map(function(x,i){
        const a = [0,15,55,68][i], b = [15,55,68,100][i];
        return '<div class="zone"><span class="zbar"><i style="--a:'+a+'%;--b:'+b+'%"></i></span><span><strong>'+x[0]+' · '+x[2]+'s</strong><small>'+esc(x[3])+'</small></span><span class="pct">'+x[1]+'</span></div>';
      }).join("")+'</div>'+
      '<div class="form-actions"><button class="btn sm" type="button" data-copy="'+esc(videoPrompt(d))+'" data-copy-msg="Prompt copiado">'+icon("copy",14)+'Copiar prompt para Gemini</button></div></div></div>';
  }
  function videoPrompt(d){
    return "Actúa como director de videos cortos para vender en Colombia. Crea un video vertical de "+(d.duracion||30)+" segundos para "+((d.idea)||"[producto]")+", dirigido a "+((d.publico)||"[público]")+". Dolor: "+((d.dolor)||"[dolor]")+". Beneficio: "+((d.beneficio)||"[beneficio]")+". CTA: "+((d.cta)||"[CTA]")+". Formato en 4 zonas: 1) Aquí nada 0-15% con gancho visual, 2) Persona 15-55% hablando a cámara, 3) Subtítulos 55-68% con la prueba, 4) Elementos 68-100% con producto en uso, precio y CTA. Entregables: guion segundo a segundo, tomas, edición, caption y 3 ganchos alternativos. Español sencillo, sin palabras rebuscadas.";
  }

  /* ================= GUION ================= */
  function guionView(){
    const d = ISC.state.tools.guion || { tipo:"producto", estructura:"pas", producto:"", publico:"", dolor:"", beneficio:"", duracion:30 };
    const html = '<div class="view">'+toolHead("guion")+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Llena 4 datos y obtén el prompt maestro</h3><p>El guion se genera con estructura de venta, no con frases sueltas.</p></div></div><div class="panel-body">'+
        '<div class="grid-2">'+
          '<div class="field"><label for="g-tipo">Tipo de guion</label><select class="select" id="g-tipo" data-gfield="tipo">'+C.guion.types.map(function(t){ return '<option value="'+t+'" '+(d.tipo===t?"selected":"")+'>'+t.charAt(0).toUpperCase()+t.slice(1)+'</option>'; }).join("")+'</select></div>'+
          '<div class="field"><label for="g-est">Estructura</label><select class="select" id="g-est" data-gfield="estructura">'+C.guion.structures.map(function(s){ return '<option value="'+s.id+'" '+(d.estructura===s.id?"selected":"")+'>'+esc(s.name)+'</option>'; }).join("")+'</select></div>'+
          fileField("producto","Producto",d.producto,"text","Organizador de nevera")+
          fileField("publico","Público",d.publico,"text","Mujeres que odian el desorden")+
          fileField("dolor","Dolor",d.dolor,"text","No encuentra nada en la nevera")+
          fileField("beneficio","Beneficio",d.beneficio,"text","Todo ordenado en 2 minutos")+
          fileField("duracion","Duración",d.duracion,"number","30")+
        '</div>'+
        '<div class="form-actions"><button class="btn primary" type="button" id="genGuion">'+icon("spark",16)+'Generar guion</button><button class="btn ghost" type="button" id="copyGuionPrompt">'+icon("copy",16)+'Copiar prompt Halbert</button></div>'+
      '</div></div>'+
      '<div id="guionOut">'+guionOutHTML(d)+'</div>'+
    '</div>';
    return { html:html, title:"Creador de guiones", after:function(root){
      function collect(){
        const cur = {};
        root.querySelectorAll("[data-gfield]").forEach(function(i){ cur[i.getAttribute("data-gfield")] = i.value; });
        root.querySelectorAll("[data-tool-field]").forEach(function(i){ cur[i.getAttribute("data-tool-field")] = i.value; });
        return cur;
      }
      root.querySelectorAll("[data-gfield],[data-tool-field]").forEach(function(i){
        i.addEventListener("input", function(){ ISC.state.tools.guion = collect(); ISC.save(); });
        i.addEventListener("change", function(){ ISC.state.tools.guion = collect(); ISC.save(); });
      });
      root.querySelector("#genGuion").addEventListener("click", function(){
        const cur = collect(); ISC.state.tools.guion = cur; ISC.saveNow();
        root.querySelector("#guionOut").innerHTML = guionOutHTML(cur);
        ISC.toast("Guion generado"); root.querySelector("#guionOut").scrollIntoView({behavior:"smooth",block:"start"});
      });
      root.querySelector("#copyGuionPrompt").addEventListener("click", function(){
        ISC.copy(guionPrompt(collect()), "Prompt maestro copiado");
      });
    }};
  }
  function guionOutHTML(d){
    const dur = Math.max(20, Math.min(90, ISC.parseNum(d.duracion)||30));
    const cuts = [0,3,8,18,25,dur];
    const rows = [
      ["0–3s","Primer plano / texto grande","\""+(d.dolor?"¿"+d.dolor+"?":"¿Te pasa esto?")+"\""],
      ["3–8s","Muestras el problema","\"Así se ve tu día cuando no tienes "+(d.producto||"esto")+"\""],
      ["8–18s","Producto en uso","\"Con "+(d.producto||"esto")+" logras "+(d.beneficio||"el resultado")+"\""],
      ["18–25s","Antes / después","\"La diferencia se nota desde el primer día.\""],
      ["25–"+dur+"s","Precio + CTA","\"Pago contraentrega y envío gratis. Escríbeme QUIERO.\""]
    ];
    return '<div class="panel"><div class="panel-head"><div class="pt"><h3>Guion · '+esc(d.tipo||"producto")+'</h3><p>'+esc(d.estructura||"pas")+' · '+dur+' segundos</p></div><span class="badge cyan">Tabla de rodaje</span></div><div class="panel-body">'+
      '<div class="md"><table><tr><th>Tiempo</th><th>Cámara / edición</th><th>Locución</th></tr>'+rows.map(function(r){ return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td><td>'+esc(r[2])+'</td></tr>'; }).join("")+'</table></div>'+
      '<h3 style="font-family:Sora,sans-serif;font-size:15px;margin:18px 0 8px">3 ganchos alternativos</h3>'+
      '<ol class="md" style="margin:0"><li>Nadie te dijo que '+esc(d.producto||"esto")+' podía '+esc(d.beneficio||"cambiarte el día")+'.</li><li>Si odias '+esc(d.dolor||"el problema")+', mira esto antes de comprar otra cosa.</li><li>Probé '+esc(d.producto||"esto")+' durante 7 días. Esto fue lo que pasó.</li></ol>'+
      '<div class="result-big"><div class="k">Caption sugerido</div><p style="margin:6px 0 0;font-size:13px">'+esc(d.beneficio||"La solución que estabas buscando")+'. Pago contraentrega y envío gratis. Escríbeme <strong>QUIERO</strong> por WhatsApp.</p></div>'+
      '<div class="form-actions"><button class="btn sm" type="button" data-copy="'+esc(guionPrompt(d))+'" data-copy-msg="Prompt copiado">'+icon("copy",14)+'Copiar prompt completo</button><a class="btn sm ghost" href="#/ia">'+icon("spark",14)+'Refinar con IA</a></div>'+
    '</div></div>';
  }
  function guionPrompt(d){
    return "Actúa como copywriter de respuesta directa estilo Gary Halbert. Escribe un guion de "+(d.duracion||30)+" segundos para vender "+(d.producto||"[producto]")+" a "+(d.publico||"[público]")+". Dolor: "+(d.dolor||"[dolor]")+". Beneficio: "+(d.beneficio||"[beneficio]")+". Estructura: "+(d.estructura||"PAS")+". Entrega: 1) tabla de 3 columnas Tiempo | Cámara/Edición | Locución, 2) 3 ganchos alternativos, 3) caption con CTA a WhatsApp. Español colombiano sencillo, frases cortas, sin promesas imposibles.";
  }

  /* ================= MENSAJES ================= */
  function mensajesView(){
    const defaults = {}; C.messages.fields.forEach(function(f){ defaults[f.id] = f.value; });
    const vals = Object.assign(defaults, ISC.state.tools.mensajes || {});
    let cat = "Venta";
    const cats = ["Venta","Objeción","Pedido","Seguimiento","Postventa"];
    function fill(t){ return t.replace(/\{(\w+)\}/g, function(m,k){ return vals[k] != null ? vals[k] : m; }); }
    function list(){
      return C.messages.templates.filter(function(t){ return t.cat === cat; }).map(function(t){
        const text = fill(t.text);
        return '<div class="msg-template"><div class="mt-head"><strong>'+esc(t.title)+'</strong><button class="icon-btn" type="button" data-copy="'+esc(text)+'" data-copy-msg="Mensaje copiado" aria-label="Copiar mensaje">'+icon("copy",15)+'</button></div><p>'+esc(text)+'</p></div>';
      }).join("");
    }
    const html = '<div class="view">'+toolHead("mensajes")+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Personaliza tus datos</h3><p>Los mensajes se actualizan con estos valores.</p></div></div><div class="panel-body"><div class="grid-3">'+
        C.messages.fields.map(function(f){ return fileField(f.id,f.label,vals[f.id],"text",f.value); }).join("")+
      '</div></div></div>'+
      '<div class="chips mt-16" id="msgTabs">'+cats.map(function(c){ return '<button class="chip '+(c===cat?"active":"")+'" type="button" data-cat="'+c+'">'+c+' <span class="n">'+C.messages.templates.filter(function(t){ return t.cat===c; }).length+'</span></button>'; }).join("")+'</div>'+
      '<div id="msgList" class="mt-12">'+list()+'</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>La regla de oro</h3><p>El cliente habla 80%, tú escuchas y cierras con opciones.</p></div></div><div class="panel-body"><div class="form-actions" style="margin-top:0"><button class="btn" type="button" id="copyReplyPrompt">'+icon("copy",16)+'Copiar prompt para responder</button><a class="btn ghost" href="#/ia">'+icon("spark",16)+'Abrir KAIROS IA</a><a class="btn ghost" href="#/herramientas/simulador">'+icon("users",16)+'Practicar</a></div></div></div>'+
    '</div>';
    return { html:html, title:"Mensajes de WhatsApp", after:function(root){
      root.querySelectorAll("[data-tool-field]").forEach(function(inp){
        inp.addEventListener("input", function(){
          vals[inp.getAttribute("data-tool-field")] = inp.value;
          ISC.state.tools.mensajes = vals; ISC.save(); root.querySelector("#msgList").innerHTML = list();
        });
      });
      root.querySelectorAll("[data-cat]").forEach(function(b){
        b.addEventListener("click", function(){
          cat = b.getAttribute("data-cat");
          root.querySelectorAll("[data-cat]").forEach(function(x){ x.classList.toggle("active",x===b); });
          root.querySelector("#msgList").innerHTML = list();
        });
      });
      root.querySelector("#copyReplyPrompt").addEventListener("click", function(){
        ISC.copy("Actúa como experto en ventas por WhatsApp para dropshipping en Colombia. El cliente dice: [pega aquí el mensaje del cliente]. Mi producto es "+vals.producto+", vale "+vals.precio+" y su beneficio es "+vals.beneficio+". Escribe 3 respuestas distintas: una que aclare, una que aporte valor y una que cierre con opciones. Tono humano, mensajes cortos, sin sonar desesperado ni agresivo.", "Prompt copiado");
      });
    }};
  }

  /* ================= SIMULADOR ================= */
  function simuladorView(){
    const html = '<div class="view">'+toolHead("simulador")+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Elige un cliente difícil</h3><p>Responde con tus palabras. Al final recibes un puntaje orientativo.</p></div><div class="field" style="min-width:150px"><label for="simDiff">Dificultad</label><select class="select" id="simDiff"><option value="facil">Fácil</option><option value="media" selected>Media</option><option value="dificil">Difícil</option></select></div></div>'+
        '<div class="panel-body"><div class="grid-3" id="personaGrid">'+C.simulator.personas.map(function(p){
          return '<button class="tool-card" type="button" data-persona="'+p.id+'" style="text-align:left"><span class="tool-ico">'+icon("users",20)+'</span><span><strong>'+esc(p.name)+'</strong><small>'+esc(p.tag)+' · 3 respuestas</small><span class="badge cyan">Empezar</span></span></button>';
        }).join("")+'</div></div></div>'+
      '<div id="simArea"></div>'+
    '</div>';
    return { html:html, title:"Simulador de ventas", after:function(root){
      const area = root.querySelector("#simArea");
      root.querySelectorAll("[data-persona]").forEach(function(b){
        b.addEventListener("click", function(){ start(b.getAttribute("data-persona")); });
      });
      function start(id){
        const p = C.simulator.personas.filter(function(x){ return x.id===id; })[0];
        const diff = root.querySelector("#simDiff").value;
        const msgs = [{role:"bot",text:p.opening}];
        let turn = 0, total = 0;
        area.innerHTML = '<div class="panel"><div class="panel-head"><div class="pt"><h3>'+esc(p.name)+'</h3><p>'+esc(p.tag)+' · dificultad '+diff+'</p></div><button class="btn sm ghost" type="button" data-sim-reset>Cambiar cliente</button></div><div class="panel-body"><div class="chat-shell" style="height:420px"><div class="chat-stream" id="simStream"></div><div><form class="chat-form" id="simForm"><input class="input" id="simInput" placeholder="Responde como si fuera un cliente real…" aria-label="Tu respuesta"><button class="btn primary" type="submit">'+icon("send",16)+'</button></form></div></div></div></div>';
        const stream = area.querySelector("#simStream");
        function paint(){
          stream.innerHTML = msgs.map(function(m){ return '<div class="msg '+m.role+'"><span class="av">'+(m.role==="user"?"L":"C")+'</span><div class="bubble">'+ISC.md(m.text)+'</div></div>'; }).join("");
          stream.scrollTop = stream.scrollHeight;
        }
        paint();
        area.querySelector("[data-sim-reset]").addEventListener("click", function(){ area.innerHTML = ""; });
        area.querySelector("#simForm").addEventListener("submit", function(e){
          e.preventDefault();
          const inp = area.querySelector("#simInput"); const text = inp.value.trim(); if(!text) return;
          msgs.push({role:"user",text:text}); inp.value=""; paint();
          const low = text.toLowerCase();
          let score = 20;
          p.keywords.forEach(function(k){ if(low.indexOf(k) > -1) score += 15; });
          if(text.length > 30) score += 10;
          p.bad.forEach(function(k){ if(low.indexOf(k) > -1) score -= 20; });
          if(text.indexOf("?") > -1) score += 8;
          score = Math.max(0, Math.min(100, score));
          total += score; turn++;
          setTimeout(function(){
            if(turn < 3){
              msgs.push({role:"bot",text:p.follow[turn-1]||p.opening}); paint();
            } else {
              const avg = Math.round(total/3) - (diff==="dificil"?8:diff==="facil"?0:3);
              const final = Math.max(0,Math.min(100,avg));
              const verdict = final>=75?"Vas muy bien: valor, claridad y cierre.":final>=50?"Vas por buen camino, pero te falta cerrar con una pregunta.":"Estás regalando la venta: no diste valor ni propusiste el siguiente paso.";
              msgs.push({role:"bot",text:"**Resultado: "+final+"/100**\n\n"+verdict+"\n\nClaves que debías usar: "+p.keywords.slice(0,4).join(", ")+"."}); paint();
              area.querySelector("#simForm").innerHTML = '<div class="panel-body" style="width:100%"><div class="split"><span class="badge '+(final>=75?"green":final>=50?"gold":"red")+'">'+final+'/100</span><button class="btn sm primary" type="button" id="simAgain">Practicar otra vez</button></div></div>';
              area.querySelector("#simAgain").addEventListener("click", function(){ start(id); });
            }
          }, 650);
        });
        setTimeout(function(){ area.querySelector("#simInput").focus(); },100);
      }
    }};
  }

  /* ================= ANUNCIOS ================= */
  function anunciosView(){
    const d = ISC.state.tools.anuncios || { producto:"", publico:"", dolor:"", beneficio:"", precio:"", objetivo:"Ventas" };
    const html = '<div class="view">'+toolHead("anuncios")+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Tu anuncio en 30 segundos</h3><p>Estrategia, ganchos y 3 anuncios para probar.</p></div></div><div class="panel-body"><div class="grid-2">'+
        fileField("producto","Producto",d.producto,"text","Organizador de nevera")+
        fileField("publico","Público",d.publico,"text","Mujeres 25-45 que organizan su casa")+
        fileField("dolor","Dolor",d.dolor,"text","Nevera desordenada")+
        fileField("beneficio","Beneficio",d.beneficio,"text","Todo visible y ordenado")+
        fileField("precio","Precio",d.precio,"text","$89.900")+
        '<div class="field"><label for="f-objetivo">Objetivo</label><select class="select" id="f-objetivo" data-tool-field="objetivo"><option>Ventas</option><option>Mensajes</option><option>Reconocimiento</option></select></div>'+
      '</div><div class="form-actions"><button class="btn primary" type="button" id="genAds">'+icon("flame",16)+'Generar anuncios</button><button class="btn ghost" type="button" id="copyAdsPrompt">'+icon("copy",16)+'Copiar prompt</button></div></div></div>'+
      '<div id="adsOut">'+adsOutHTML(d)+'</div>'+
    '</div>';
    return { html:html, title:"Creador de anuncios", after:function(root){
      if(d.objetivo) root.querySelector("#f-objetivo").value = d.objetivo;
      function collect(){ const cur={}; root.querySelectorAll("[data-tool-field]").forEach(function(i){ cur[i.getAttribute("data-tool-field")]=i.value; }); return cur; }
      root.querySelectorAll("[data-tool-field]").forEach(function(i){ i.addEventListener("input",function(){ ISC.state.tools.anuncios=collect(); ISC.save(); }); });
      root.querySelector("#genAds").addEventListener("click", function(){
        const cur=collect(); ISC.state.tools.anuncios=cur; ISC.saveNow(); root.querySelector("#adsOut").innerHTML=adsOutHTML(cur); ISC.toast("Anuncios generados"); root.querySelector("#adsOut").scrollIntoView({behavior:"smooth",block:"start"});
      });
      root.querySelector("#copyAdsPrompt").addEventListener("click", function(){ ISC.copy(adsPrompt(collect()),"Prompt copiado"); });
    }};
  }
  function adsOutHTML(d){
    const p = d.producto||"tu producto", b = d.beneficio||"el resultado que buscas", pain = d.dolor||"el problema", pub = d.publico||"tu cliente ideal", price = d.precio||"el precio";
    const hooks = [
      "Nadie te dijo que "+p+" podía "+b+".",
      "Si odias "+pain+", deja de buscar: esto lo resuelve en minutos.",
      "Probé "+p+" 7 días. Esto fue lo que cambió.",
      "¿Cuánto te cuesta seguir viviendo con "+pain+"?",
      "Esto no es magia, es "+p+" bien usado.",
      "La razón por la que todos están comprando "+p+"."
    ];
    return '<div class="panel"><div class="panel-head"><div class="pt"><h3>Estrategia para '+esc(pub)+'</h3><p>Objetivo: '+esc(d.objetivo||"Ventas")+' · oferta: '+esc(price)+'</p></div><span class="badge cyan">Listo para probar</span></div><div class="panel-body">'+
      '<p class="small muted" style="margin:0">Vende el resultado, no el producto. Prueba 3 anuncios con el mismo público y deja correr 3 días antes de decidir. La métrica que manda es tu CPA contra el CPA máximo.</p>'+
      '<h3 style="font-family:Sora,sans-serif;font-size:15px;margin:16px 0 8px">6 ganchos</h3><ol class="md" style="margin:0">'+hooks.map(function(h){ return '<li>'+esc(h)+'</li>'; }).join("")+'</ol>'+
      '<h3 style="font-family:Sora,sans-serif;font-size:15px;margin:18px 0 8px">3 anuncios para probar</h3>'+
      '<div class="grid-3">'+
        adCard("Anuncio 1 · Dolor", "\""+pain+"\" no tiene que ser tu día a día. "+p+" te ayuda a "+b+". Pago contraentrega y envío gratis.", "Pide el tuyo hoy")+
        adCard("Anuncio 2 · Demostración", "Mira cómo "+p+" resuelve "+pain+" en menos de 2 minutos. Sin instalaciones raras.", "Ver cómo funciona")+
        adCard("Anuncio 3 · Oferta", p+" por "+price+". Lo revisas cuando llega y pagas contraentrega. Stock limitado.", "Escríbeme QUIERO")+
      '</div>'+
      '<h3 style="font-family:Sora,sans-serif;font-size:15px;margin:18px 0 8px">Creativo, público y medición</h3>'+
      '<div class="grid-2"><div class="md"><ul><li><strong>Creativo:</strong> video vertical de 20–30s con gancho en los primeros 3s y subtítulos.</li><li><strong>Público:</strong> '+esc(pub)+', intereses amplios, 18–45, Colombia.</li><li><strong>Medición:</strong> CPA, CTR y ventas. Apaga si el CPA supera tu máximo por 2 días.</li></ul></div><div class="md"><ul><li><strong>Presupuesto:</strong> empieza con el equivalente a 1–2 CPA por día.</li><li><strong>Prueba:</strong> un anuncio por conjunto, mismos creativos.</li><li><strong>Iteración:</strong> cambia solo el gancho, no todo a la vez.</li></ul></div></div>'+
      '<div class="form-actions"><button class="btn sm" type="button" data-copy="'+esc(adsPrompt(d))+'" data-copy-msg="Prompt copiado">'+icon("copy",14)+'Copiar prompt completo</button><a class="btn sm ghost" href="#/herramientas/campana">'+icon("chart",14)+'Analizar campaña</a></div>'+
    '</div></div>';
  }
  function adCard(title,text,cta){
    return '<div class="panel tight" style="margin-top:0"><div class="panel-body tight"><div class="badge cyan">'+esc(title)+'</div><p class="small" style="margin:8px 0 10px;color:var(--soft);line-height:1.55">'+esc(text)+'</p><span class="badge">'+esc(cta)+'</span></div></div>';
  }
  function adsPrompt(d){
    return "Actúa como estratega de Meta Ads para dropshipping en Colombia. Producto: "+(d.producto||"[producto]")+". Público: "+(d.publico||"[público]")+". Dolor: "+(d.dolor||"[dolor]")+". Beneficio: "+(d.beneficio||"[beneficio]")+". Precio: "+(d.precio||"[precio]")+". Objetivo: "+(d.objetivo||"Ventas")+". Entrega: estrategia, 6 ganchos, 3 anuncios completos para probar, dirección creativa, público y cómo medir con CPA. Sin promesas médicas ni resultados garantizados.";
  }

  /* ================= CAMPAÑA ================= */
  function campanaView(){
    const d = ISC.state.tools.campana || { spend:100000, compras:4, clicks:800, impresiones:40000, horas:24, pvp:90000, costo:30000, envio:15000, cpaMax:45000 };
    const r = campanaCalc(d);
    const html = '<div class="view">'+toolHead("campana")+
      '<div class="grid-2" style="align-items:start;margin-top:16px">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Datos de la campaña</h3><p>Pega los números tal como te los da Meta.</p></div></div><div class="panel-body"><div class="grid-2">'+
          fileField("spend","Gasto",d.spend,"number","100000")+
          fileField("compras","Compras",d.compras,"number","4")+
          fileField("clicks","Clics",d.clicks,"number","800")+
          fileField("impresiones","Impresiones",d.impresiones,"number","40000")+
          fileField("horas","Horas activa",d.horas,"number","24")+
          fileField("pvp","PVP",d.pvp,"number","90000")+
          fileField("costo","Costo producto",d.costo,"number","30000")+
          fileField("envio","Envío",d.envio,"number","15000")+
          fileField("cpaMax","CPA máximo",d.cpaMax,"number","45000")+
        '</div></div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Decisión</h3><p>Escalar, mantener o apagar.</p></div></div><div class="panel-body" id="campResult">'+campResultHTML(d,r)+'</div></div>'+
      '</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Reporte opcional</h3><p>Pega el texto del reporte si quieres una lectura extra.</p></div></div><div class="panel-body"><textarea class="textarea" id="campReport" placeholder="Pega aquí el reporte de Meta…"></textarea><div class="form-actions"><button class="btn" type="button" id="analizaReporte">'+icon("spark",16)+'Analizar reporte</button><span class="small muted">El análisis es orientativo, no reemplaza tu criterio.</span></div><div id="reportOut"></div></div></div>'+
    '</div>';
    return { html:html, title:"Analizador de campaña", after:function(root){
      function update(){ const data=campanaData(root), res=campanaCalc(data); root.querySelector("#campResult").innerHTML=campResultHTML(data,res); }
      root.querySelectorAll("[data-tool-field]").forEach(function(i){
        i.addEventListener("input", function(){ const data=campanaData(root); ISC.state.tools.campana=data; ISC.save(); update(); });
      });
      root.querySelector("#analizaReporte").addEventListener("click", function(){
        const txt = root.querySelector("#campReport").value.trim();
        if(!txt){ ISC.toast("Pega primero el reporte","info"); return; }
        const res = campanaCalc(campanaData(root));
        root.querySelector("#reportOut").innerHTML = '<div class="result-big"><div class="k">Lectura del reporte</div><p class="small" style="margin:6px 0 0">Con tus números, tu CPA es '+money(res.cpa)+' y tu CPA máximo es '+money(res.cpaMax)+'. '+(res.cpa<=res.cpaMax?"La campaña está dentro del rango: busca el gancho y el público que más venden antes de escalar.":"La campaña está por encima de tu CPA máximo: apaga el conjunto que más gasta y revisa oferta y creativo antes de volver a subir presupuesto.")+'</p></div>';
      });
    }};
  }
  function campanaData(root){
    const d = {};
    root.querySelectorAll("[data-tool-field]").forEach(function(i){ d[i.getAttribute("data-tool-field")]=ISC.parseNum(i.value); });
    return d;
  }
  function campanaCalc(d){
    const cpa = d.compras ? d.spend/d.compras : 0;
    const ctr = d.impresiones ? d.clicks/d.impresiones*100 : 0;
    const cpm = d.impresiones ? d.spend/d.impresiones*1000 : 0;
    const ingresos = d.pvp*d.compras;
    const contribucion = (d.pvp-d.costo-d.envio)*d.compras;
    const ganancia = contribucion-d.spend;
    return { cpa:cpa, ctr:ctr, cpm:cpm, ingresos:ingresos, ganancia:ganancia, cpaMax:d.cpaMax };
  }
  function campResultHTML(d,r){
    const decision = d.compras===0 ? "Apagar" : r.cpa <= d.cpaMax*.8 ? "Escalar" : r.cpa <= d.cpaMax ? "Mantener" : "Apagar";
    const color = decision==="Escalar"?"green":decision==="Mantener"?"gold":"red";
    return '<div class="result-line"><span>CPA real</span><strong>'+money(r.cpa)+'</strong></div>'+
      '<div class="result-line"><span>CPA máximo</span><strong>'+money(r.cpaMax)+'</strong></div>'+
      '<div class="result-line"><span>CTR</span><strong>'+r.ctr.toFixed(2)+'%</strong></div>'+
      '<div class="result-line"><span>CPM</span><strong>'+money(r.cpm)+'</strong></div>'+
      '<div class="result-line"><span>Ingresos</span><strong>'+money(r.ingresos)+'</strong></div>'+
      '<div class="result-big" style="'+(r.ganancia>=0?"":"border-color:rgba(255,107,107,.4);background:rgba(255,107,107,.06)")+'"><div class="k">Resultado</div><div class="v">'+money(r.ganancia)+'</div><small>Ganancia después de producto, envío y pauta.</small></div>'+
      '<div class="split mt-12"><span class="badge '+color+'">'+decision+'</span><span class="small muted">'+(decision==="Escalar"?"Sube 20–30% y vigila el CPA.":decision==="Mantener"?"No toques nada 2 días más.":"Revisa oferta y creativo antes de volver a gastar.")+'</span></div>';
  }

  /* ================= VENTAS ================= */
  function ventasView(){
    const orders = ISC.state.orders || [];
    const total = orders.reduce(function(a,o){ return a + (o.precio-o.costo-o.envio-o.cpa); },0);
    const income = orders.reduce(function(a,o){ return a + o.precio; },0);
    const delivered = orders.filter(function(o){ return o.estado==="Entregado"||o.estado==="Dinero recibido"; }).length;
    function list(){
      if(!orders.length) return U.empty("card","Todavía no hay ventas","Registra tu primer pedido para ver tu ganancia real.","");
      return orders.slice().reverse().map(function(o){
        const gan = o.precio-o.costo-o.envio-o.cpa;
        return '<div class="panel tight" style="margin-top:8px"><div class="panel-body tight"><div class="split"><div><strong>'+esc(o.producto||"Pedido")+'</strong><div class="small muted">'+esc(o.cliente||"Cliente")+' · '+esc(o.fecha)+'</div></div><div style="text-align:right"><strong style="color:'+(gan>=0?"var(--green)":"#FF8B8B")+'">'+money(gan)+'</strong><div class="small muted">'+esc(o.estado)+'</div></div></div>'+
          '<div class="small muted mt-8">Precio '+money(o.precio)+' · costo '+money(o.costo)+' · envío '+money(o.envio)+' · CPA '+money(o.cpa)+(o.guia?' · guía '+esc(o.guia):"")+'</div>'+
          '<div class="split mt-8"><span class="badge '+(o.estado==="Entregado"||o.estado==="Dinero recibido"?"green":o.estado==="Devuelto"?"red":"cyan")+'">'+esc(o.estado)+'</span><button class="btn sm ghost" type="button" data-del-order="'+o.id+'">'+icon("trash",14)+'Borrar</button></div></div></div>';
      }).join("");
    }
    const html = '<div class="view">'+toolHead("ventas")+
      '<div class="stats-grid stagger">'+U.stat("Pedidos",orders.length,"registrados","accent")+U.stat("Ingresos",money(income),"facturado")+U.stat("Ganancia",money(total),"después de todo","green")+U.stat("Entregados",delivered,"pedidos")+'</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Registrar pedido</h3><p>Así sabes cuánto ganas de verdad, no cuánto facturas.</p></div></div><div class="panel-body"><form id="orderForm"><div class="grid-3">'+
        '<div class="field"><label for="o-fecha">Fecha</label><input class="input" id="o-fecha" type="date" value="'+new Date().toISOString().slice(0,10)+'"></div>'+
        '<div class="field"><label for="o-cliente">Cliente</label><input class="input" id="o-cliente" placeholder="Nombre"></div>'+
        '<div class="field"><label for="o-producto">Producto</label><input class="input" id="o-producto" placeholder="Producto"></div>'+
        '<div class="field"><label for="o-precio">Precio</label><input class="input" id="o-precio" type="number" placeholder="90000"></div>'+
        '<div class="field"><label for="o-costo">Costo</label><input class="input" id="o-costo" type="number" placeholder="30000"></div>'+
        '<div class="field"><label for="o-envio">Envío</label><input class="input" id="o-envio" type="number" placeholder="15000"></div>'+
        '<div class="field"><label for="o-cpa">CPA</label><input class="input" id="o-cpa" type="number" placeholder="20000"></div>'+
        '<div class="field"><label for="o-guia">Guía</label><input class="input" id="o-guia" placeholder="EFFI-123"></div>'+
        '<div class="field"><label for="o-estado">Estado</label><select class="select" id="o-estado"><option>Por despachar</option><option>Enviado</option><option>Entregado</option><option>Dinero recibido</option><option>Devuelto</option></select></div>'+
      '</div><div class="form-actions"><button class="btn primary" type="submit">'+icon("plus",16)+'Guardar pedido</button></div></form></div></div>'+
      '<h2 class="section-h">Tus pedidos</h2><div id="ordersList">'+list()+'</div>'+
    '</div>';
    return { html:html, title:"Mis ventas", after:function(root){
      root.querySelector("#orderForm").addEventListener("submit", function(e){
        e.preventDefault();
        const g = function(id){ return root.querySelector("#"+id); };
        const o = { id:"o"+Date.now(), fecha:g("o-fecha").value, cliente:g("o-cliente").value.trim(), producto:g("o-producto").value.trim(),
          precio:ISC.parseNum(g("o-precio").value), costo:ISC.parseNum(g("o-costo").value), envio:ISC.parseNum(g("o-envio").value), cpa:ISC.parseNum(g("o-cpa").value),
          guia:g("o-guia").value.trim(), estado:g("o-estado").value };
        if(!o.producto || !o.precio){ ISC.toast("Escribe producto y precio","info"); return; }
        ISC.state.orders.push(o); ISC.saveNow(); ISC.toast("Pedido guardado"); ISC.rerender();
      });
      root.querySelectorAll("[data-del-order]").forEach(function(b){
        b.addEventListener("click", function(){
          const id = b.getAttribute("data-del-order");
          ISC.modal({title:"Borrar pedido",body:"<p class='muted'>Esta acción no se puede deshacer. El pedido se elimina de este navegador.</p>",
            foot:'<button class="btn ghost" type="button" data-modal-close>Cancelar</button><button class="btn" type="button" id="delYes" style="background:#3A1A1E;border-color:#5A2A30;color:#FFB4B4">Borrar</button>',
            onOpen:function(ov){ ov.querySelector("#delYes").addEventListener("click", function(){ ISC.state.orders = ISC.state.orders.filter(function(x){ return x.id!==id; }); ISC.saveNow(); ISC.closeModal(); ISC.rerender(); ISC.toast("Pedido eliminado"); }); }});
        });
      });
    }};
  }

  /* ================= RUTINA ================= */
  function rutinaView(){
    const today = new Date().toISOString().slice(0,10);
    if(ISC.state.routine.date !== today){ ISC.state.routine = { date:today, tasks:{} }; }
    const tasks = ISC.state.routine.tasks;
    const done = C.routine.tasks.filter(function(t){ return tasks[t.id]; }).length;
    const totalMin = C.routine.tasks.reduce(function(a,t){ return a + t.min; },0);
    const doneMin = C.routine.tasks.filter(function(t){ return tasks[t.id]; }).reduce(function(a,t){ return a + t.min; },0);
    const html = '<div class="view">'+toolHead("rutina")+
      '<div class="stats-grid stagger">'+U.stat("Completadas",done+" / 8","tareas de hoy","accent")+U.stat("Tiempo",doneMin+" min","de "+totalMin+" min")+U.stat("Fecha",ISC.fecha(new Date()),"hoy")+U.stat("Racha",done===8?"Día completo":"En progreso",done===8?"Excelente":"Sin romper la cadena")+'</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Rutina diaria</h3><p>De 1 a 2 horas para facturar todos los días. Marca lo que hiciste.</p></div><span class="badge '+(done===8?"green":"cyan")+'" id="routineCount">'+done+' de 8</span></div>'+
        '<div class="panel-body"><div class="check-score" style="margin:0 0 12px"><div class="bar"><i id="routineBar" style="width:'+(done/8*100)+'%"></i></div><strong id="routinePct">'+Math.round(done/8*100)+'%</strong></div><div class="checklist" id="routineList">'+
          C.routine.tasks.map(function(t){
            const on = !!tasks[t.id];
            return '<label class="checkitem '+(on?"on":"")+'" data-rtask="'+t.id+'"><span class="box">'+icon("check",13)+'</span><span style="flex:1"><strong>'+esc(t.title)+'</strong><small>'+esc(t.desc)+'</small></span><span class="badge">'+t.min+' min</span></label>';
          }).join("")+'</div>'+
          '<div class="form-actions"><button class="btn ghost" type="button" id="resetRoutine">'+icon("trash",16)+'Reiniciar día</button><a class="btn ghost" href="#/herramientas/ventas">'+icon("card",16)+'Registrar ventas</a><a class="btn primary" href="#/clases">'+icon("play",16)+'Ir a mi clase</a></div>'+
        '</div></div>'+
    '</div>';
    return { html:html, title:"Rutina diaria", after:function(root){
      function refresh(){
        const d = C.routine.tasks.filter(function(t){ return tasks[t.id]; }).length;
        const pct = Math.round(d/8*100);
        root.querySelector("#routineCount").textContent = d+" de 8";
        root.querySelector("#routinePct").textContent = pct+"%";
        root.querySelector("#routineBar").style.width = pct+"%";
        root.querySelector("#routineCount").className = "badge " + (d===8?"green":"cyan");
      }
      root.querySelectorAll("[data-rtask]").forEach(function(el){
        el.addEventListener("click", function(e){
          e.preventDefault(); const id = el.getAttribute("data-rtask");
          tasks[id] = !tasks[id]; el.classList.toggle("on", !!tasks[id]); ISC.save(); refresh();
          if(tasks[id]) ISC.toast("Tarea completada");
        });
      });
      root.querySelector("#resetRoutine").addEventListener("click", function(){
        ISC.state.routine.tasks = {}; ISC.saveNow(); ISC.rerender(); ISC.toast("Rutina reiniciada");
      });
    }};
  }

  /* ================= CONECTAR IA ================= */
  function IAView(){
    const html = '<div class="view">'+U.crumb([{label:"Herramientas",href:"#/herramientas"},{label:"Conectar mi IA"}])+
      U.hero("MÓDULO 3 · INTELIGENCIA ARTIFICIAL","Conectar mi IA","En la app online pegas tu llave de Gemini, OpenAI o Claude y todas las herramientas usan IA real. Este archivo funciona en modo local guiado, sin enviar tus datos.", '<div class="chips mt-16"><span class="badge green">Modo local activo</span><span class="badge">Sin llaves guardadas</span></div>')+
      '<div class="grid-3 mt-16">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Gemini</h3><p>Gratis para empezar</p></div><span class="badge cyan">Recomendado</span></div><div class="panel-body"><p class="small muted">Crea tu llave en Google AI Studio y pégala en la app online. Sirve para KAIROS IA, guiones, anuncios y landings.</p><button class="btn sm" type="button" data-ai-help="Gemini">'+icon("info",14)+'Cómo activarla</button></div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>OpenAI</h3><p>Modelos GPT</p></div></div><div class="panel-body"><p class="small muted">Usa una llave de OpenAI para respuestas más creativas. Tiene costo por uso según el modelo.</p><button class="btn sm ghost" type="button" data-ai-help="OpenAI">'+icon("info",14)+'Cómo activarla</button></div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Claude</h3><p>Textos largos</p></div></div><div class="panel-body"><p class="small muted">Ideal para manuales, guiones y análisis. También funciona con llave propia en la app online.</p><button class="btn sm ghost" type="button" data-ai-help="Claude">'+icon("info",14)+'Cómo activarla</button></div></div>'+
      '</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Cómo funciona en este archivo</h3><p>Sin configurar nada para probar</p></div></div><div class="panel-body"><div class="md"><ol><li><strong>KAIROS IA local:</strong> responde con tu avance, la Regla 3X, precios, guiones, objeciones y planes.</li><li><strong>Herramientas:</strong> calculan y generan prompts reales con tus datos.</li><li><strong>Prompts:</strong> copias el prompt y lo pegas en tu IA favorita.</li><li><strong>Privacidad:</strong> este archivo no pide ni guarda llaves. Todo queda en tu navegador.</li></ol></div>'+
        '<div class="form-actions"><a class="btn primary" href="#/ia">'+icon("spark",16)+'Abrir KAIROS IA</a><a class="btn" href="#/prompts">'+icon("book",16)+'Ver prompts</a><a class="btn ghost" href="#/herramientas">'+icon("tools",16)+'Herramientas</a></div></div></div>'+
    '</div>';
    return { html:html, title:"Conectar mi IA", after:function(root){
      root.querySelectorAll("[data-ai-help]").forEach(function(b){
        b.addEventListener("click", function(){
          const name = b.getAttribute("data-ai-help");
          ISC.modal({ title:"Activar "+name+" en la app online", body:
            '<div class="md"><p>La conexión real con IA vive en la app online de ISKAIROS. Allí pegas tu llave en <strong>Herramientas → Conectar mi IA</strong> y las funciones de IA se activan.</p><ol><li>Entra a tu cuenta en la app online.</li><li>Abre Herramientas → Conectar mi IA.</li><li>Elige '+esc(name)+', pega tu llave y guarda.</li><li>Vuelve a KAIROS IA o a cualquier herramienta con IA.</li></ol><p>Este archivo local no pide llaves: funciona en modo guiado y guarda todo en tu navegador.</p></div>',
            foot:'<button class="btn primary" type="button" data-modal-close>Entendido</button>'
          });
        });
      });
    }};
  }
})();
