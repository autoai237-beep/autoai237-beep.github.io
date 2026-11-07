(function(){
  "use strict";
  const ISC = window.ISC = window.ISC || {};
  const KEY = "iskairos-local-v1";
  const $ = (s,r) => (r||document).querySelector(s);
  const $$ = (s,r) => Array.prototype.slice.call((r||document).querySelectorAll(s));

  ISC.views = {};
  ISC.registerView = function(name, fn){ ISC.views[name] = fn; };

  ISC.esc = function(v){
    return String(v == null ? "" : v)
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  };
  ISC.slug = function(v){
    return String(v||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")
      .replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,60) || "seccion";
  };
  ISC.money = function(n){
    n = Number(n)||0;
    return "$" + Math.round(n).toLocaleString("es-CO");
  };
  ISC.num = function(n){ return (Number(n)||0).toLocaleString("es-CO"); };
  ISC.pct = function(n){ return Math.max(0,Math.min(100,Math.round(Number(n)||0))); };
  ISC.parseNum = function(v){
    if(typeof v === "number") return v;
    let s = String(v||"").trim().replace(/[^\d.,-]/g,"");
    if(!s) return 0;
    if(s.indexOf(",") > -1 && s.indexOf(".") > -1){
      s = s.lastIndexOf(",") > s.lastIndexOf(".") ? s.replace(/\./g,"").replace(",",".") : s.replace(/,/g,"");
    } else if(/^-?\d{1,3}(\.\d{3})+$/.test(s)){
      s = s.replace(/\./g,"");
    } else if(/^-?\d{1,3}(,\d{3})+$/.test(s)){
      s = s.replace(/,/g,"");
    } else if(s.indexOf(",") > -1){
      s = s.replace(",",".");
    }
    const n = Number(s);
    return isNaN(n) ? 0 : n;
  };
  ISC.fecha = function(d){
    const x = d instanceof Date ? d : new Date(d);
    if(isNaN(x)) return "";
    return x.toLocaleDateString("es-CO",{day:"numeric",month:"short",year:"numeric"});
  };
  ISC.fechaHora = function(d){
    const x = d instanceof Date ? d : new Date(d);
    if(isNaN(x)) return "";
    return x.toLocaleString("es-CO",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
  };

  const ICONS = {
    inicio:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    play:'<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    spark:'<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    check:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
    exam:'<path d="M9 11l3 3 8-8"/><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9"/>',
    book:'<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5M8 7h7M8 11h5"/>',
    tools:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h2M13 11h2M9 15h2M13 15h2"/>',
    wallet:'<path d="M3 7a2 2 0 0 1 2-2h13v4"/><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M16 13.5h2"/>',
    providers:'<rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20"/>',
    landing:'<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    tutorial:'<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    help:'<path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z"/>',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    chevron:'<path d="M9 6l6 6-6 6"/>',
    down:'<path d="M6 9l6 6 6-6"/>',
    close:'<path d="M6 6l12 12M18 6L6 18"/>',
    copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
    external:'<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    send:'<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>',
    flame:'<path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 2 3-3z"/>',
    calc:'<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M8 6h8M8 10h2M12 10h2M16 10h.1M8 14h2M12 14h2M16 14h.1M8 18h2M12 18h2M16 18h.1"/>',
    video:'<rect x="2" y="5" width="14" height="14" rx="3"/><path d="m16 10 6-4v12l-6-4z"/>',
    chat:'<path d="M21 12a9 9 0 0 1-13.5 7.8L3 21l1.2-4.5A9 9 0 1 1 21 12z"/>',
    users:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M15 15c3 0 6 1.5 6 4.5"/>',
    chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    card:'<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    task:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="m8 9 1.5 1.5L12 8M8 15h8"/>',
    link:'<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    back:'<path d="M19 12H5M11 18l-6-6 6-6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    trash:'<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6"/>',
    edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.1"/>',
    star:'<path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.4l6.1-.9z"/>',
    share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/>',
    lock:'<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    bell:'<path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8"/><path d="M10 21h4"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    download:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/>'
  };
  ISC.icon = function(name, size){
    const p = ICONS[name] || ICONS.info;
    const s = size || 18;
    return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
  };

  function cleanTitle(t){
    return String(t||"").replace(/^[•\u2022\s]+/,"").replace(/\s+/g," ").trim();
  }

  ISC.state = null;
  ISC.data = null;
  let saveTimer = null;

  function defaultState(){
    return {
      v:1, completed:[], notes:{}, activities:{}, exams:{}, chat:[], orders:[],
      routine:{ date:"", tasks:{} }, bookings:[], landings:[],
      checklist:{ checked:[], producto:"", costo:"", precio:"" },
      tools:{ costeo:null, meta:null, guion:null, anuncios:null, campana:null, video:null },
      prefs:{ motion:false, spot:true },
      stepsDismissed:false
    };
  }

  function deriveState(){
    const base = ISC.data.progreso.filter(function(p){ return p.completado; }).map(function(p){ return p.clase_id; });
    const st = defaultState();
    st.completed = base.slice();
    try{
      const raw = localStorage.getItem(KEY);
      if(raw){
        const saved = JSON.parse(raw);
        if(saved && saved.v === 1){
          if(Array.isArray(saved.completed)) st.completed = saved.completed;
          ["notes","activities","exams","checklist","tools","prefs"].forEach(function(k){
            if(saved[k] && typeof saved[k] === "object") st[k] = Object.assign(st[k] || {}, saved[k]);
          });
          st.chat = Array.isArray(saved.chat) ? saved.chat.slice(-40) : [];
          st.orders = Array.isArray(saved.orders) ? saved.orders : [];
          st.bookings = Array.isArray(saved.bookings) ? saved.bookings : [];
          st.landings = Array.isArray(saved.landings) ? saved.landings : [];
          st.routine = saved.routine || st.routine;
          st.stepsDismissed = !!saved.stepsDismissed;
        }
      }
    }catch(e){}
    ISC.state = st;
    ISC.saveNow = function(){
      clearTimeout(saveTimer);
      try{ localStorage.setItem(KEY, JSON.stringify(st)); }catch(e){}
    };
    ISC.save = function(){
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function(){ ISC.saveNow(); }, 260);
    };
  }

  function prepare(){
    const d = ISC.data;
    const flat = [];
    const modules = [];
    d.modules.forEach(function(m, mi){
      const found = /Módulo\s*(\d+)/i.exec(m.titulo || "");
      const numero = found ? Number(found[1]) : null;
      const prefix = (m.titulo || "").split(/[:\s]/)[0] || "·";
      const mod = {
        id:m.id, numero:numero, orden:mi+1, titulo:m.titulo, clases:[],
        etiqueta: numero ? String(numero).padStart(2,"0") : prefix.slice(0,2).toUpperCase()
      };
      (m.clases||[]).slice().sort(function(a,b){ return (a.orden||0)-(b.orden||0); }).forEach(function(c){
        const clase = Object.assign({}, c, {
          _mod: mod, _modIndex: mi, _index: flat.length,
          titulo: cleanTitle(c.titulo)
        });
        mod.clases.push(clase);
        flat.push(clase);
      });
      modules.push(mod);
    });
    const lessons = d.lessons || [];
    const lessonByClass = {}, lessonById = {};
    lessons.forEach(function(l){
      lessonByClass[l.clase_id] = l;
      lessonById[String(l.id)] = l;
    });
    const actByClass = {};
    (d.actividades||[]).forEach(function(a){
      if(!actByClass[a.clase_id]) actByClass[a.clase_id] = [];
      actByClass[a.clase_id].push(a);
    });
    const classById = {};
    flat.forEach(function(c){ classById[c.id] = c; });
    ISC.data.modulesPrepared = modules;
    ISC.classes = flat;
    ISC.classById = classById;
    ISC.modules = modules;
    ISC.lessonByClass = lessonByClass;
    ISC.lessonById = lessonById;
    ISC.actByClass = actByClass;
    ISC.exams = d.exams || {};
    ISC.baseApproved = {};
    Object.keys(d.misExams||{}).forEach(function(k){
      if((d.misExams[k]||{}).estado === "aprobado") ISC.baseApproved[k] = true;
    });
    ISC.session = d;
  }

  ISC.modLabel = function(mod){ return mod.numero ? "M" + mod.etiqueta : mod.etiqueta; };

  ISC.isDone = function(id){ return ISC.state.completed.indexOf(id) > -1; };
  ISC.markDone = function(id, done){
    const arr = ISC.state.completed;
    const i = arr.indexOf(id);
    if(done && i < 0) arr.push(id);
    if(!done && i > -1) arr.splice(i,1);
    ISC.save();
  };
  ISC.currentClass = function(){
    for(let i=0;i<ISC.classes.length;i++){ if(!ISC.isDone(ISC.classes[i].id)) return ISC.classes[i]; }
    return ISC.classes[ISC.classes.length-1];
  };
  ISC.prevClass = function(c){ return c && c._index > 0 ? ISC.classes[c._index-1] : null; };
  ISC.nextClass = function(c){ return c && c._index < ISC.classes.length-1 ? ISC.classes[c._index+1] : null; };
  ISC.examOf = function(id){ return ISC.exams[id] || null; };
  ISC.isApproved = function(id){
    if(ISC.baseApproved[id]) return true;
    const e = ISC.state.exams[id];
    return !!(e && e.approved);
  };
  ISC.bestScore = function(id){
    const e = ISC.state.exams[id];
    return e && typeof e.score === "number" ? e.score : null;
  };
  ISC.moduleStats = function(mod){
    const total = mod.clases.length;
    const done = mod.clases.filter(function(c){ return ISC.isDone(c.id); }).length;
    return { total:total, done:done, pct: total ? Math.round(done/total*100) : 0 };
  };
  ISC.globalStats = function(){
    const total = ISC.classes.length;
    const done = ISC.classes.filter(function(c){ return ISC.isDone(c.id); }).length;
    const approved = ISC.classes.filter(function(c){ return ISC.isApproved(c.id); }).length;
    return { total:total, done:done, pct: total ? Math.round(done/total*100) : 0, approved:approved };
  };

  /* ---------- Markdown ---------- */
  function inline(s){
    s = ISC.esc(s);
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    s = s.replace(/\[([^\]]+)\]\((#[^)\s]+)\)/g, '<a href="$2">$1</a>');
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, function(m,t,u){
      const internal = u.replace(/^https?:\/\/(www\.)?iskairos\.com/,"");
      if(internal !== u && internal.indexOf("/app") === 0){
        const map = {
          "/app":"#/inicio","/app/":"#/inicio","/app/clases":"#/clases","/app/ia":"#/ia",
          "/app/examenes":"#/examenes","/app/prompts":"#/prompts","/app/manual":"#/manual",
          "/app/herramientas":"#/herramientas","/app/referidos":"#/referidos",
          "/app/proveedores":"#/proveedores","/app/landings":"#/landings",
          "/app/tutoriales":"#/tutoriales","/app/agenda":"#/agenda",
          "/app/ayuda":"#/ayuda","/app/perfil":"#/perfil","/app/recursos":"#/recursos"
        };
        let href = map[internal];
        if(!href && internal.indexOf("/app/clase/") === 0) href = "#/clase/" + internal.split("/").pop();
        if(!href && internal.indexOf("/app/herramientas/") === 0) href = "#/herramientas/" + internal.split("/").pop();
        if(!href) href = "#/inicio";
        return '<a href="'+href+'">'+t+'</a>';
      }
      return '<a href="'+u+'" target="_blank" rel="noopener noreferrer">'+t+'</a>';
    });
    return s;
  }
  ISC.inline = inline;

  ISC.md = function(text){
    if(!text) return "";
    const lines = String(text).replace(/\r\n/g,"\n").split("\n");
    let out = [], list = null, para = [], quote = [], code = false, codeBuf = [], table = [];
    function closeList(){ if(list){ out.push("</"+list+">"); list = null; } }
    function closePara(){ if(para.length){ out.push("<p>"+inline(para.join(" "))+"</p>"); para = []; } }
    function closeQuote(){ if(quote.length){ out.push("<blockquote>"+quote.map(function(q){ return "<p>"+inline(q)+"</p>"; }).join("")+"</blockquote>"); quote = []; } }
    function closeTable(){
      if(!table.length) return;
      let rows = table.filter(function(r){ return !/^\s*\|?[\s:|-]+\|?\s*$/.test(r); });
      if(rows.length){
        let html = "<table>";
        rows.forEach(function(r,i){
          const cells = r.replace(/^\s*\|/,"").replace(/\|\s*$/,"").split("|");
          html += "<tr>" + cells.map(function(c){ return (i===0?"<th>":"<td>") + inline(c.trim()) + (i===0?"</th>":"</td>"); }).join("") + "</tr>";
        });
        out.push(html+"</table>");
      }
      table = [];
    }
    let hCount = 0;
    for(let i=0;i<lines.length;i++){
      const line = lines[i];
      const trimmed = line.trim();
      if(/^```/.test(trimmed)){
        if(code){ out.push("<pre><code>"+ISC.esc(codeBuf.join("\n"))+"</code></pre>"); codeBuf = []; code = false; }
        else { closeList(); closePara(); closeQuote(); closeTable(); code = true; }
        continue;
      }
      if(code){ codeBuf.push(line); continue; }
      if(!trimmed){
        closeList(); closePara(); closeQuote(); closeTable(); continue;
      }
      let m;
      if((m = /^(#{1,4})\s+(.+)$/.exec(trimmed))){
        closeList(); closePara(); closeQuote(); closeTable();
        const lvl = Math.min(3,m[1].length);
        const id = "doc-" + ISC.slug(m[2]) + (hCount++ ? "-"+hCount : "");
        out.push("<h"+lvl+' id="'+id+'">'+inline(m[2])+"</h"+lvl+">");
        continue;
      }
      if(/^([-*_]\s*){3,}$/.test(trimmed)){ closeList(); closePara(); closeQuote(); closeTable(); out.push("<hr>"); continue; }
      if(/^>\s?/.test(trimmed)){ closeList(); closePara(); closeTable(); quote.push(trimmed.replace(/^>\s?/,"")); continue; }
      if(/^\|.*\|$/.test(trimmed)){ closeList(); closePara(); quote.length&&closeQuote(); table.push(trimmed); continue; }
      if(/^[-*]\s+/.test(trimmed)){
        closePara(); closeQuote(); closeTable();
        if(list !== "ul"){ closeList(); out.push("<ul>"); list = "ul"; }
        out.push("<li>"+inline(trimmed.replace(/^[-*]\s+/,""))+"</li>");
        continue;
      }
      if(/^\d+[.)]\s+/.test(trimmed)){
        closePara(); closeQuote(); closeTable();
        if(list !== "ol"){ closeList(); out.push("<ol>"); list = "ol"; }
        out.push("<li>"+inline(trimmed.replace(/^\d+[.)]\s+/,""))+"</li>");
        continue;
      }
      closeList(); closeTable();
      para.push(trimmed);
    }
    if(code) out.push("<pre><code>"+ISC.esc(codeBuf.join("\n"))+"</code></pre>");
    closeList(); closePara(); closeQuote(); closeTable();
    return out.join("");
  };

  ISC.toc = function(text){
    const items = [];
    String(text||"").split("\n").forEach(function(l){
      const m = /^##\s+(.+)$/.exec(l.trim());
      if(m) items.push({ label:m[1].replace(/\*\*/g,""), id:"doc-"+ISC.slug(m[1]) });
    });
    return items;
  };

  /* ---------- Video ---------- */
  ISC.video = function(url){
    const str = String(url||"");
    const urls = str.match(/https?:\/\/[^\s"'<>]+/g) || [];
    let yt = null, mp4 = null;
    urls.forEach(function(u){
      const m = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/.exec(u);
      if(m && !yt) yt = m[1];
      if(!mp4 && /\.mp4(\?|$)/i.test(u)) mp4 = u;
    });
    if(yt) return { kind:"yt", id:yt, embed:"https://www.youtube-nocookie.com/embed/"+yt+"?rel=0&modestbranding=1", thumb:"https://i.ytimg.com/vi/"+yt+"/hqdefault.jpg" };
    if(mp4) return { kind:"mp4", src:mp4 };
    return null;
  };

  /* ---------- Toast ---------- */
  ISC.toast = function(msg, kind){
    const wrap = $("#toastWrap");
    if(!wrap) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role","status");
    el.innerHTML = ISC.icon(kind === "info" ? "info" : "check",16) + "<span>"+ISC.esc(msg)+"</span>";
    wrap.appendChild(el);
    setTimeout(function(){ el.classList.add("out"); setTimeout(function(){ el.remove(); },240); }, 2900);
  };

  /* ---------- Copy ---------- */
  ISC.copy = function(text, msg){
    const done = function(){
      ISC.toast(msg || "Copiado al portapapeles");
    };
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else fallback();
    function fallback(){
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly","");
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand("copy"); done(); }catch(e){ ISC.toast("No se pudo copiar","info"); }
      ta.remove();
    }
  };

  /* ---------- Modal ---------- */
  let modalEl = null, lastFocus = null;
  ISC.closeModal = function(){
    if(!modalEl) return;
    const ov = modalEl;
    ov.classList.remove("open");
    document.body.classList.remove("modal-open");
    setTimeout(function(){ ov.remove(); }, 210);
    modalEl = null;
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  };
  ISC.modal = function(opts){
    ISC.closeModal();
    lastFocus = document.activeElement;
    const ov = document.createElement("div");
    ov.className = "modal-overlay";
    ov.setAttribute("data-modal-overlay","");
    ov.innerHTML =
      '<div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" style="'+(opts.wide?"width:min(820px,100%)":"")+'">'+
        '<div class="modal-head"><strong id="modalTitle">'+ISC.esc(opts.title||"")+'</strong><button class="icon-btn" type="button" data-modal-close aria-label="Cerrar">'+ISC.icon("close",16)+'</button></div>'+
        '<div class="modal-body">'+(opts.body||"")+'</div>'+
        (opts.foot?'<div class="modal-foot">'+opts.foot+'</div>':"")+
      '</div>';
    $("#modalRoot").appendChild(ov);
    document.body.classList.add("modal-open");
    requestAnimationFrame(function(){ ov.classList.add("open"); });
    modalEl = ov;
    setTimeout(function(){ const b = ov.querySelector("[data-autofocus],button,input,textarea,a"); if(b) b.focus(); }, 80);
    if(opts.onOpen) opts.onOpen(ov);
    return ov;
  };
  document.addEventListener("click", function(e){
    if(e.target.closest("[data-modal-close]")){ e.preventDefault(); ISC.closeModal(); return; }
    if(e.target.hasAttribute && e.target.hasAttribute("data-modal-overlay")) ISC.closeModal();
  });
  document.addEventListener("keydown", function(e){
    if(e.key === "Escape" && modalEl) ISC.closeModal();
    if(e.key === "Tab" && modalEl){
      const f = $$("button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex='-1'])", modalEl).filter(function(el){ return el.offsetParent !== null; });
      if(!f.length) return;
      const first = f[0], last = f[f.length-1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    }
  });

  /* ---------- Router ---------- */
  function parseHash(){
    let h = location.hash || "#/inicio";
    if(h.charAt(0) === "#") h = h.slice(1);
    if(h.charAt(0) === "/") h = h.slice(1);
    const qIndex = h.indexOf("?");
    const qs = qIndex > -1 ? h.slice(qIndex+1) : "";
    const path = qIndex > -1 ? h.slice(0,qIndex) : h;
    const parts = path.split("/").filter(Boolean).map(function(p){ return decodeURIComponent(p); });
    const query = {};
    qs.split("&").forEach(function(pair){
      if(!pair) return;
      const i = pair.indexOf("=");
      query[decodeURIComponent(i>-1?pair.slice(0,i):pair)] = decodeURIComponent(i>-1?pair.slice(i+1):"");
    });
    return { parts:parts, query:query };
  }

  ISC.routeInfo = function(){
    const p = parseHash().parts, q = parseHash().query;
    const base = p[0] || "inicio";
    if(base === "inicio") return { name:"inicio", nav:"inicio", params:{}, query:q };
    if(base === "clases") return { name:"clases", nav:"clases", params:{}, query:q };
    if(base === "clase" && p[1]) return { name:"clase", nav:"clases", params:{ id:p[1] }, query:q };
    if(base === "ia") return { name:"ia", nav:"ia", params:{}, query:q };
    if(base === "examenes") return { name:"examenes", nav:"examenes", params:{}, query:q };
    if(base === "examen" && p[1]) return { name:"examen", nav:"examenes", params:{ id:p[1] }, query:q };
    if(base === "prompts") return { name:"prompts", nav:"prompts", params:{}, query:q };
    if(base === "manual" && p[1]) return { name:"manual-leccion", nav:"manual", params:{ id:p[1] }, query:q };
    if(base === "manual") return { name:"manual", nav:"manual", params:{}, query:q };
    if(base === "herramientas" && p[1]) return { name:"herramienta", nav:"herramientas", params:{ tool:p[1] }, query:q };
    if(base === "herramientas") return { name:"herramientas", nav:"herramientas", params:{}, query:q };
    if(base === "referidos") return { name:"referidos", nav:"referidos", params:{}, query:q };
    if(base === "proveedores") return { name:"proveedores", nav:"proveedores", params:{}, query:q };
    if(base === "landings" && p[1] === "nueva") return { name:"landing-nueva", nav:"landings", params:{}, query:q };
    if(base === "landings" && p[1] === "ver" && p[2]) return { name:"landing-ver", nav:"landings", params:{ id:p[2] }, query:q };
    if(base === "landings" && p[1] === "editar" && p[2]) return { name:"landing-nueva", nav:"landings", params:{ id:p[2] }, query:q };
    if(base === "landings") return { name:"landings", nav:"landings", params:{}, query:q };
    if(base === "tutoriales") return { name:"tutoriales", nav:"tutoriales", params:{}, query:q };
    if(base === "agenda") return { name:"agenda", nav:"agenda", params:{}, query:q };
    if(base === "ayuda") return { name:"ayuda", nav:"ayuda", params:{}, query:q };
    if(base === "perfil") return { name:"perfil", nav:"perfil", params:{}, query:q };
    if(base === "recursos") return { name:"recursos", nav:"recursos", params:{}, query:q };
    return { name:"notfound", nav:"", params:{}, query:q };
  };

  function setNav(nav){
    $$("[data-nav]").forEach(function(a){
      if(a.getAttribute("data-nav") === nav) a.setAttribute("aria-current","page");
      else a.removeAttribute("aria-current");
    });
    positionPill();
  }
  function positionPill(){
    const nav = $(".nav"), pill = $(".nav-pill");
    if(!nav || !pill) return;
    const active = nav.querySelector('a[aria-current="page"]');
    if(!active){ pill.style.opacity = "0"; return; }
    const nr = nav.getBoundingClientRect(), ar = active.getBoundingClientRect();
    pill.style.opacity = "1";
    pill.style.height = ar.height + "px";
    pill.style.transform = "translateY(" + (ar.top - nr.top + nav.scrollTop) + "px)";
  }
  window.addEventListener("resize", positionPill);

  ISC.enhance = function(root){
    root = root || document;
    if(!root) return;
    const reveals = $$(".reveal", root);
    if(reveals.length){
      if("IntersectionObserver" in window){
        const io = new IntersectionObserver(function(entries){
          entries.forEach(function(en){
            if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
          });
        },{ rootMargin:"0px 0px -8% 0px", threshold:.08 });
        reveals.forEach(function(el){ io.observe(el); });
      } else reveals.forEach(function(el){ el.classList.add("in"); });
    }
    $$("[data-count]", root).forEach(function(el){
      if(el.dataset.counted) return;
      el.dataset.counted = "1";
      const target = Number(el.getAttribute("data-count")) || 0;
      const suffix = el.getAttribute("data-suffix") || "";
      const finalText = target + suffix;
      if(document.hidden || !window.requestAnimationFrame){ el.textContent = finalText; return; }
      let done = false;
      const fallback = setTimeout(function(){ if(!done) el.textContent = finalText; }, 1300);
      const dur = 900;
      const t0 = performance.now();
      function tick(t){
        const k = Math.min(1,(t-t0)/dur);
        const eased = 1 - Math.pow(1-k,3);
        el.textContent = Math.round(target*eased) + suffix;
        if(k < 1) requestAnimationFrame(tick);
        else { done = true; clearTimeout(fallback); }
      }
      requestAnimationFrame(tick);
    });
    $$(".ring[data-pct]", root).forEach(function(ring){
      const m = ring.querySelector(".meter");
      if(m){
        const pct = Math.max(0,Math.min(100,Number(ring.getAttribute("data-pct"))||0));
        const off = 263.89 * (1 - pct/100);
        m.style.strokeDashoffset = "263.89";
        setTimeout(function(){ m.style.strokeDashoffset = String(off); }, 80);
      }
    });
    $$(".steps-fill[data-pct]", root).forEach(function(el){
      const pct = Math.max(0,Math.min(100,Number(el.getAttribute("data-pct"))||0));
      el.style.width = pct + "%";
    });
  };

  function enhanceChrome(){
    document.documentElement.classList.toggle("reduce-motion", !!(ISC.state.prefs && ISC.state.prefs.motion));
    document.documentElement.classList.toggle("no-spot", !(ISC.state.prefs && ISC.state.prefs.spot !== false));
  }

  ISC.render = function(){
    const r = ISC.routeInfo();
    const view = ISC.views[r.name] || ISC.views.notfound;
    const main = $("#contenido");
    if(!main) return;
    let out = { html:"" };
    try{
      out = view(r.params, r.query) || { html:"" };
    }catch(err){
      console.error(err);
      out = { html:'<div class="view"><div class="panel"><div class="panel-body"><div class="empty"><span class="ico">'+ISC.icon("info",22)+'</span><strong>No pudimos abrir esta sección</strong><p>'+ISC.esc(err.message)+'</p></div></div></div></div>' };
    }
    if(ISC.cleanup){ try{ ISC.cleanup(); }catch(e){} ISC.cleanup = null; }
    main.innerHTML = out.html;
    document.title = (out.title ? out.title + " · " : "") + "ISKAIROS";
    setNav(r.nav);
    ISC.enhance(main);
    if(out.after){ try{ ISC.cleanup = out.after(main) || null; }catch(err){ console.error(err); } }
    try{ window.scrollTo({ top:0, left:0, behavior:"instant" }); }catch(e){ window.scrollTo(0,0); }
    if(!(ISC.guide && ISC.guide.isOpen && ISC.guide.isOpen())) main.focus({ preventScroll:true });
  };

  ISC.rerender = function(){ ISC.render(); };
  ISC.go = function(hash){ if(location.hash === hash) ISC.render(); else location.hash = hash; };
  window.addEventListener("hashchange", ISC.render);

  /* ---------- Delegated UI ---------- */
  let spotRaf = null;
  document.addEventListener("pointermove", function(e){
    if(!ISC.state || !ISC.state.prefs || ISC.state.prefs.spot === false) return;
    const card = e.target.closest && e.target.closest(".spot");
    if(!card || spotRaf) return;
    spotRaf = requestAnimationFrame(function(){
      spotRaf = null;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", (e.clientX-r.left)+"px");
      card.style.setProperty("--my", (e.clientY-r.top)+"px");
    });
  }, { passive:true });

  document.addEventListener("click", function(e){
    const cp = e.target.closest("[data-copy]");
    if(cp){
      e.preventDefault();
      ISC.copy(cp.getAttribute("data-copy"), cp.getAttribute("data-copy-msg") || "Copiado");
      return;
    }
    const scroll = e.target.closest("[data-scroll]");
    if(scroll){
      e.preventDefault();
      const el = document.getElementById(scroll.getAttribute("data-scroll"));
      if(el) el.scrollIntoView({ behavior:"smooth", block:"start" });
      return;
    }
    const guide = e.target.closest("[data-guide]");
    if(guide){
      e.preventDefault();
      if(ISC.guide && ISC.guide.open) ISC.guide.open();
    }
  });

  /* ---------- UI helpers compartidos ---------- */
  ISC.ui = {
    pageHead: function(o){
      return '<div class="page-head reveal"><div><div class="eyebrow">'+ISC.esc(o.kicker||"")+'</div>'+
        '<h1 class="page-title">'+ISC.esc(o.title||"")+'</h1>'+
        (o.sub?'<p class="page-sub">'+o.sub+'</p>':"")+'</div>'+
        (o.actions?'<div class="head-actions">'+o.actions+'</div>':"")+'</div>';
    },
    crumb: function(items){
      return '<div class="crumb">'+items.map(function(it,i){
        return (i?'<span aria-hidden="true">/</span>':"") + (it.href?'<a href="'+it.href+'">'+ISC.esc(it.label)+'</a>':'<span>'+ISC.esc(it.label)+'</span>');
      }).join("")+'</div>';
    },
    stat: function(k,v,s,cls){
      return '<div class="stat-card '+(cls||"")+'"><div class="k">'+ISC.esc(k)+'</div><div class="v">'+v+'</div>'+(s?'<div class="s">'+s+'</div>':"")+'</div>';
    },
    section: function(t,badge){
      return '<h2 class="section-h">'+ISC.esc(t)+(badge?' <span class="badge">'+ISC.esc(badge)+'</span>':"")+'</h2>';
    },
    empty: function(ico,title,text,action){
      return '<div class="empty"><span class="ico">'+ISC.icon(ico,22)+'</span><strong>'+ISC.esc(title)+'</strong><p>'+text+'</p>'+(action||"")+'</div>';
    },
    hero: function(kicker,title,desc,extra){
      return '<section class="tool-hero spot"><span class="beam" aria-hidden="true"></span><div class="kicker">'+ISC.esc(kicker)+'</div><h1>'+ISC.esc(title)+'</h1><p>'+desc+'</p>'+(extra||"")+'</section>';
    }
  };

  /* ---------- Init ---------- */
  ISC.init = async function(){
    try{
      const raw = ($("#appData").textContent || "").replace(/\s+/g,"");
      if(!raw) throw new Error("No se encontró la data local.");
      const bin = atob(raw);
      const bytes = new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++) bytes[i] = bin.charCodeAt(i);
      let text;
      if("DecompressionStream" in window){
        try{
          const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
          text = await new Response(stream).text();
        }catch(err){
          text = await decompressFallback(bytes);
        }
      } else {
        text = await decompressFallback(bytes);
      }
      ISC.data = JSON.parse(text);
      prepare();
      deriveState();
      enhanceChrome();
      ISC.help = (function(){
        try{ return JSON.parse($("#helpData").textContent || "[]"); }catch(e){ return []; }
      })();
      if(ISC.guide && ISC.guide.init) ISC.guide.init();
      ISC.render();
      positionPill();
      setTimeout(positionPill, 400);
    }catch(err){
      console.error(err);
      const main = $("#contenido");
      if(main) main.innerHTML =
        '<div class="view"><div class="panel"><div class="panel-body">'+
        '<div class="empty"><span class="ico">'+ISC.icon("info",22)+'</span>'+
        '<strong>No se pudo cargar la app offline</strong>'+
        '<p>'+ISC.esc(err.message)+'</p>'+
        '<p class="small muted">Abre este archivo en un navegador actualizado (Chrome, Edge o Safari). Si el problema sigue, vuelve a generar el archivo.</p>'+
        '</div></div></div></div>';
    }
  };

  async function decompressFallback(bytes){
    if(typeof DecompressionStream === "function"){
      const ds = new DecompressionStream("gzip");
      const writer = ds.writable.getWriter();
      writer.write(bytes); writer.close();
      return await new Response(ds.readable).text();
    }
    throw new Error("Tu navegador no soporta la descompresión integrada.");
  }

  /* Delegated open/close for module + faq + prompt + tabs etc. handled in views */
})();
