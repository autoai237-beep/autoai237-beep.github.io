(function(){
  "use strict";
  const ISC = window.ISC, C = ISC.content, U = ISC.ui;
  const esc = ISC.esc, icon = ISC.icon, money = ISC.money;

  function waLink(number, text){
    const n = String(number||"").replace(/\D/g,"");
    const full = n.length === 10 ? "57"+n : n;
    return "https://wa.me/"+full+(text?"?text="+encodeURIComponent(text):"");
  }

  /* ================= WALLET / REFERIDOS ================= */
  ISC.registerView("referidos", function(){
    const w = C.wallet;
    const html = '<div class="view">'+
      U.pageHead({kicker:"GANA CON KAIROS", title:"Wallet KAIROS", sub:"Comparte tu código, suma referidos y retira cuando tengas saldo. Todo se calcula en tu navegador.", actions:'<a class="btn ghost" href="#/ayuda">'+icon("help",16)+'Cómo funciona</a>'})+
      '<section class="wallet-hero spot"><span class="beam" aria-hidden="true"></span><div class="kicker" style="font-size:11px;font-weight:800;letter-spacing:.12em;color:var(--gold)">TU WALLET</div>'+
        '<div class="split" style="margin-top:4px"><div><div style="font-family:Sora,sans-serif;font-size:38px;font-weight:800;letter-spacing:-.03em">$0</div><div class="small muted">Saldo disponible</div></div><span class="badge gold">'+w.commission+'% por venta</span></div>'+
        '<div class="code-row"><div class="wallet-code"><span>'+esc(w.code)+'</span><button type="button" data-copy="'+esc(w.code)+'" data-copy-msg="Código copiado" aria-label="Copiar código">'+icon("copy",16)+'</button></div>'+
          '<button class="btn sm ghost" type="button" id="copyWalletLink">'+icon("link",14)+'Copiar mi enlace</button>'+
          '<a class="btn sm wa" href="https://wa.me/?text='+encodeURIComponent("Estoy aprendiendo a vender por internet con ISKAIROS. Si quieres empezar como yo, entra con mi enlace: "+w.link)+'" target="_blank" rel="noopener noreferrer">'+icon("share",14)+'Compartir</a></div>'+
      '</section>'+
      '<div class="stats-grid stagger">'+U.stat("Comisión",w.commission+"%","por cada venta","gold")+U.stat("Desde la venta 11",w.upgrade+"%","primer mes","accent")+U.stat("Retiro mínimo",money(w.minPayout),"disponible")+U.stat("Pago",w.days+" días","hábiles después")+'</div>'+
      '<div class="grid-2 mt-16">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Cómo funciona</h3><p>Simple y transparente.</p></div></div><div class="panel-body"><div class="md"><ol><li>Compartes tu enlace o código.</li><li>La persona compra su mentoría o reto.</li><li>Ganas el <strong>'+w.commission+'%</strong> de esa venta.</li><li>Desde la venta 11 en tu primer mes, subes al <strong>'+w.upgrade+'%</strong>.</li><li>Retiras desde '+money(w.minPayout)+'. Hay una retención de '+w.holdHours+' h y el pago llega en '+w.days+' días hábiles.</li></ol></div></div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Simula tus ganancias</h3><p>Con comisión del '+w.commission+'%. Los valores son ejemplos.</p></div></div><div class="panel-body"><div class="wallet-slider"><div class="row"><span>Ventas referidas</span><strong id="refSales">5</strong></div><input class="range" id="refRange" type="range" min="1" max="20" value="5" aria-label="Ventas referidas"><div class="split" style="margin-top:10px"><span class="small muted">Ganancia estimada</span><strong id="refEarn" style="font-family:Sora,sans-serif;font-size:22px;color:var(--gold)">'+money(120000)+'</strong></div></div>'+
          '<div class="result-line"><span>3 ventas</span><strong>'+money(72000)+'</strong></div><div class="result-line"><span>10 ventas</span><strong>'+money(240000)+'</strong></div><div class="result-line"><span>20 ventas</span><strong>'+money(600000)+'</strong></div></div></div>'+
      '</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Tu enlace</h3><p>Este es el enlace que compartes.</p></div></div><div class="panel-body"><div class="search" style="max-width:none"><span class="muted small" id="walletLink" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(w.link)+'</span><button class="icon-btn" type="button" data-copy="'+esc(w.link)+'" data-copy-msg="Enlace copiado" aria-label="Copiar enlace">'+icon("copy",15)+'</button></div><p class="small muted mt-8">Los retiros y el saldo real se gestionan en la app online. Este archivo es una vista local.</p></div></div>'+
    '</div>';
    return { html:html, title:"Wallet KAIROS", after:function(root){
      const range = root.querySelector("#refRange"), sales = root.querySelector("#refSales"), earn = root.querySelector("#refEarn");
      range.addEventListener("input", function(){
        const n = Number(range.value); sales.textContent = n; earn.textContent = money(n*24000);
      });
      root.querySelector("#copyWalletLink").addEventListener("click", function(){ ISC.copy(w.link, "Enlace copiado"); });
    }};
  });

  /* ================= PROVEEDORES ================= */
  ISC.registerView("proveedores", function(){
    const provs = C.providers || [];
    let platform = "todas", query = "";
    function platforms(p){ return (p.plataformas||[]).map(function(x){ return x.toLowerCase(); }); }
    function card(p){
      const plats = platforms(p);
      const contacts = [];
      if(p.whatsapp) contacts.push('<a class="btn sm wa" href="'+waLink(p.whatsapp,"Hola, vengo de ISKAIROS. Quiero información de sus productos.")+'" target="_blank" rel="noopener noreferrer">'+icon("chat",14)+'WhatsApp</a>');
      if(p.email) contacts.push('<a class="btn sm ghost" href="mailto:'+esc(p.email)+'">'+icon("send",14)+'Correo</a>');
      if(p.web) contacts.push('<a class="btn sm ghost" href="'+esc(p.web)+'" target="_blank" rel="noopener noreferrer">'+icon("external",14)+'Ver sitio</a>');
      if(!contacts.length) contacts.push('<span class="small muted">Contacto dentro de la plataforma</span>');
      return '<article class="provider-card spot" data-provider="'+esc(p.id)+'"><div class="pc-top"><div><h3>'+esc(p.nombre)+'</h3><span class="cat">'+esc(p.nicho||"Multinicho")+'</span></div><span class="badge cyan">'+esc((p.plataformas||[]).join(" · "))+'</span></div>'+
        '<p>'+esc(p.descripcion||"Proveedor verificado en la red ISKAIROS.")+'</p>'+
        '<div class="platforms">'+plats.map(function(x){ return '<span class="badge">'+esc(x)+'</span>'; }).join("")+'</div>'+
        '<div class="form-actions" style="margin-top:10px"><button class="btn sm ghost" type="button" data-provider-toggle>'+icon("info",14)+'Ver detalles</button>'+contacts.join("")+'</div>'+
        '<div class="provider-details" hidden style="margin-top:12px;padding-top:12px;border-top:1px solid var(--line)">'+
          (p.ventajas?'<p class="small"><strong>Ventajas:</strong> '+esc(p.ventajas)+'</p>':"")+
          (p.como_elegir?'<p class="small"><strong>Cómo elegir:</strong> '+esc(p.como_elegir)+'</p>':"")+
          (p.whatsapp?'<p class="small muted">WhatsApp: '+esc(p.whatsapp)+'</p>':"")+
          (p.email?'<p class="small muted">Correo: '+esc(p.email)+'</p>':"")+
        '</div></article>';
    }
    function listHTML(){
      const q = query.toLowerCase();
      const rows = provs.filter(function(p){
        if(platform !== "todas" && platforms(p).indexOf(platform) < 0) return false;
        if(!q) return true;
        return (p.nombre+" "+(p.nicho||"")+" "+(p.descripcion||"")+" "+(p.ventajas||"")).toLowerCase().indexOf(q) > -1;
      });
      return rows.length ? '<div class="provider-grid">'+rows.map(card).join("")+'</div>' : U.empty("providers","Sin proveedores","Prueba con otra plataforma u otra palabra.");
    }
    const counts = { dropi:0, effi:0, mastershop:0 };
    provs.forEach(function(p){ platforms(p).forEach(function(x){ if(counts[x] != null) counts[x]++; }); });
    const html = '<div class="view">'+
      U.pageHead({kicker:"PROVEEDORES VERIFICADOS", title:"Proveedores", sub:"16 proveedores de la red ISKAIROS con su nicho, ventajas y contacto. Filtra por la plataforma que ya usas.", actions:'<a class="btn ghost" href="#/herramientas/producto">'+icon("search",16)+'Validar producto</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Proveedores",provs.length,"en la red","accent")+U.stat("Dropi",counts.dropi,"proveedores")+U.stat("Effi",counts.effi,"proveedores")+U.stat("Mastershop",counts.mastershop,"proveedores")+'</div>'+
      '<div class="toolbar reveal"><label class="search">'+icon("search",17)+'<input type="search" id="provSearch" placeholder="Buscar por nombre, nicho o ventaja…" aria-label="Buscar proveedor"></label>'+
        '<div class="chips" id="provFilters"><button class="chip active" type="button" data-platform="todas">Todas <span class="n">'+provs.length+'</span></button><button class="chip" type="button" data-platform="dropi">Dropi <span class="n">'+counts.dropi+'</span></button><button class="chip" type="button" data-platform="effi">Effi <span class="n">'+counts.effi+'</span></button><button class="chip" type="button" data-platform="mastershop">Mastershop <span class="n">'+counts.mastershop+'</span></button></div></div>'+
      '<div id="provList" class="reveal">'+listHTML()+'</div>'+
      '<div class="panel"><div class="panel-foot">'+icon("info",14)+' Verifica siempre stock, condiciones y tiempos de despacho directamente con el proveedor.</div></div>'+
    '</div>';
    return { html:html, title:"Proveedores", after:function(root){
      const list = root.querySelector("#provList");
      function bind(){
        list.querySelectorAll("[data-provider-toggle]").forEach(function(b){
          b.addEventListener("click", function(){
            const d = b.closest(".provider-card").querySelector(".provider-details");
            d.hidden = !d.hidden;
            b.innerHTML = icon(d.hidden?"info":"close",14)+(d.hidden?"Ver detalles":"Ocultar");
          });
        });
      }
      bind();
      const search = root.querySelector("#provSearch");
      search.addEventListener("input", function(){ query = search.value.trim(); list.innerHTML = listHTML(); bind(); });
      root.querySelectorAll("[data-platform]").forEach(function(b){
        b.addEventListener("click", function(){
          platform = b.getAttribute("data-platform");
          root.querySelectorAll("[data-platform]").forEach(function(x){ x.classList.toggle("active",x===b); });
          list.innerHTML = listHTML(); bind();
        });
      });
    }};
  });

  /* ================= LANDINGS ================= */
  function landingScore(l){
    let s = 0;
    if(l.nombre && l.nombre.trim().length > 2) s += 10;
    if(l.descripcion && l.descripcion.trim().length >= 15) s += 15;
    if(l.publico && l.publico.trim()) s += 10;
    if(l.dolor && l.dolor.trim().length >= 15) s += 15;
    if(l.diferencial && l.diferencial.trim()) s += 10;
    if(ISC.parseNum(l.precio) > 0) s += 10;
    if(String(l.whatsapp||"").replace(/\D/g,"").length >= 10) s += 10;
    if(l.fotos && l.fotos.trim()) s += 10;
    if(l.garantia && l.garantia.trim()) s += 10;
    return Math.min(100,s);
  }
  function landingData(root){
    const f = function(id){ return root.querySelector("#l-"+id); };
    const d = {};
    ["nombre","descripcion","publico","dolor","diferencial","precio","precioAntes","entrega","garantia","tienda","whatsapp","fotos","estructura"].forEach(function(k){
      d[k] = f(k) ? f(k).value.trim() : "";
    });
    d.contraentrega = !!(f("contraentrega") && f("contraentrega").checked);
    d.envioGratis = !!(f("envioGratis") && f("envioGratis").checked);
    d.wompi = !!(f("wompi") && f("wompi").checked);
    return d;
  }
  function landingCard(l){
    const score = landingScore(l);
    return '<article class="landing-card spot"><div class="landing-thumb"><span>'+esc((l.estructura||"landing").toUpperCase())+'</span></div><div class="landing-info"><strong>'+esc(l.nombre)+'</strong><small>Creada el '+esc(ISC.fecha(l.creada))+' · '+((l.orders||[]).length)+' pedidos</small><div class="landing-metrics"><span>Score <b>'+score+'</b></span><span>Precio <b>'+money(ISC.parseNum(l.precio))+'</b></span></div>'+
      '<div class="form-actions" style="margin-top:10px"><a class="btn sm primary" href="#/landings/ver/'+l.id+'">'+icon("eye",14)+'Ver</a><a class="btn sm ghost" href="#/landings/editar/'+l.id+'">'+icon("edit",14)+'Editar</a><button class="icon-btn" type="button" data-del-landing="'+l.id+'" aria-label="Borrar landing">'+icon("trash",15)+'</button></div></div></article>';
  }
  ISC.registerView("landings", function(){
    const landings = ISC.state.landings || [];
    const avg = landings.length ? Math.round(landings.reduce(function(a,l){ return a+landingScore(l); },0)/landings.length) : 0;
    const html = '<div class="view">'+
      U.pageHead({kicker:"MÓDULO 3 · VENDE CON UNA PÁGINA", title:"Mis landings", sub:"Crea tu página de venta, revísala y recibe pedidos contraentrega simulados dentro de este archivo.", actions:'<a class="btn primary" href="#/landings/nueva">'+icon("plus",16)+'Nueva landing</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Landings",landings.length,"creadas en tu navegador","accent")+U.stat("Score promedio",avg||"—",avg?"de 100":"crea la primera")+U.stat("Pedidos",landings.reduce(function(a,l){return a+((l.orders||[]).length);},0),"simulados")+U.stat("Estructuras","5 + ref.","para empezar")+'</div>'+
      (landings.length ? '<div class="landing-grid">'+landings.slice().reverse().map(landingCard).join("")+'</div>' :
        '<div class="panel"><div class="panel-body">'+U.empty("landing","Aún no tienes landings","Crea tu primera página con el Creador IA: elige una estructura, llena tus datos y mira la vista previa al instante.","<a class=\"btn primary mt-12\" href=\"#/landings/nueva\">"+icon("spark",16)+"Crear mi primera landing</a>")+'</div></div>')+
      '<div class="grid-2 mt-16">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Estructuras que ya venden</h3><p>Elige según tu producto y tu tráfico.</p></div></div><div class="panel-body"><div class="md"><ul>'+C.landing.structures.map(function(s){ return '<li><strong>'+esc(s.name)+':</strong> '+esc(s.desc)+'</li>'; }).join("")+'</ul></div></div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Antes de publicar</h3><p>Checklist rápido.</p></div></div><div class="panel-body"><div class="md"><ul><li>Titular con beneficio claro.</li><li>Fotos reales del producto en uso.</li><li>Precio, envío y contraentrega visibles.</li><li>WhatsApp de 10 dígitos.</li><li>Política de garantía y cambios.</li></ul></div><a class="btn sm ghost" href="#/herramientas/producto">'+icon("check",14)+'Validar producto</a></div></div>'+
      '</div>'+
    '</div>';
    return { html:html, title:"Mis landings", after:function(root){
      root.querySelectorAll("[data-del-landing]").forEach(function(b){
        b.addEventListener("click", function(){
          const id = b.getAttribute("data-del-landing");
          ISC.modal({title:"Borrar landing",body:"<p class='muted'>Se elimina del navegador junto con sus pedidos simulados.</p>",
            foot:'<button class="btn ghost" type="button" data-modal-close>Cancelar</button><button class="btn" type="button" id="delLanding" style="background:#3A1A1E;border-color:#5A2A30;color:#FFB4B4">Borrar</button>',
            onOpen:function(ov){ ov.querySelector("#delLanding").addEventListener("click", function(){ ISC.state.landings = ISC.state.landings.filter(function(x){return x.id!==id;}); ISC.saveNow(); ISC.closeModal(); ISC.rerender(); ISC.toast("Landing eliminada"); }); }});
        });
      });
    }};
  });

  ISC.registerView("landing-nueva", function(params){
    const edit = params && params.id ? (ISC.state.landings||[]).filter(function(l){return l.id===params.id;})[0] : null;
    const d = edit || { nombre:"", descripcion:"", publico:"", dolor:"", diferencial:"", precio:"", precioAntes:"", entrega:"2 a 4 días hábiles", garantia:"30 días por defectos de fábrica", tienda:"", whatsapp:"", fotos:"", estructura:"pas", contraentrega:true, envioGratis:true, wompi:false };
    function field(id,label,val,type,ph,hint,tag){
      const t = tag || "input";
      if(t === "textarea") return '<div class="field"><label for="l-'+id+'">'+esc(label)+'</label><textarea class="textarea" id="l-'+id+'" placeholder="'+esc(ph||"")+'">'+esc(val||"")+'</textarea>'+(hint?'<span class="hint">'+esc(hint)+'</span>':"")+'</div>';
      return '<div class="field"><label for="l-'+id+'">'+esc(label)+'</label><input class="input" id="l-'+id+'" type="'+(type||"text")+'" value="'+esc(val||"")+'" placeholder="'+esc(ph||"")+'">'+(hint?'<span class="hint">'+esc(hint)+'</span>':"")+'</div>';
    }
    const html = '<div class="view">'+
      U.crumb([{label:"Mis landings",href:"#/landings"},{label:edit?"Editar":"Nueva landing"}])+
      U.pageHead({kicker:"CREADOR DE LANDINGS IA", title:edit?"Editar landing":"Nueva landing", sub:"Los datos se guardan solo en tu navegador. La vista previa se genera al instante."})+
      '<form id="landingForm"><div class="grid-2">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Tu oferta</h3><p>Lo que ve el cliente primero.</p></div></div><div class="panel-body">'+
          field("nombre","Nombre del producto o marca",d.nombre,"text","Organizador de nevera")+
          '<div class="field mt-12"><label for="l-descripcion">Descripción corta</label><textarea class="textarea" id="l-descripcion" placeholder="Mínimo 15 caracteres">'+esc(d.descripcion)+'</textarea><span class="hint">Mínimo 15 caracteres. Habla del resultado, no del producto.</span></div>'+
          field("publico","Público",d.publico,"text","Mujeres 25-45 que organizan su casa")+
          '<div class="field mt-12"><label for="l-dolor">Dolor principal</label><textarea class="textarea" id="l-dolor" placeholder="Mínimo 15 caracteres">'+esc(d.dolor)+'</textarea><span class="hint">Mínimo 15 caracteres.</span></div>'+
          field("diferencial","Diferencial",d.diferencial,"text","Qué te hace distinto")+
        '</div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Precio y contacto</h3><p>La parte que cierra la venta.</p></div></div><div class="panel-body">'+
          '<div class="grid-2">'+field("precio","Precio",d.precio,"number","89900")+field("precioAntes","Precio antes (opcional)",d.precioAntes,"number","129900")+'</div>'+
          field("entrega","Tiempo de entrega",d.entrega,"text","2 a 4 días hábiles")+
          field("garantia","Garantía",d.garantia,"text","30 días por defectos de fábrica")+
          field("whatsapp","WhatsApp de pedidos",d.whatsapp,"tel","3001234567","Solo números, mínimo 10 dígitos.")+
          field("tienda","Tienda o ciudad",d.tienda,"text","Bogotá")+
          '<div class="field mt-12"><label for="l-fotos">Fotos (una URL por línea)</label><textarea class="textarea" id="l-fotos" placeholder="https://…">'+esc(d.fotos)+'</textarea><span class="hint">Se usarán en la vista previa.</span></div>'+
          '<div class="field mt-12"><label for="l-estructura">Estructura</label><select class="select" id="l-estructura">'+C.landing.structures.map(function(s){ return '<option value="'+s.id+'" '+(d.estructura===s.id?"selected":"")+'>'+esc(s.name)+'</option>'; }).join("")+'</select></div>'+
          '<label class="checkitem mt-12" style="'+(d.contraentrega?"border-color:rgba(75,227,160,.36)":"")+'"><input type="checkbox" id="l-contraentrega" '+(d.contraentrega?"checked":"")+' style="position:absolute;opacity:0"><span class="box">'+icon("check",13)+'</span><span><strong>Pago contraentrega</strong><small>El cliente paga al recibir.</small></span></label>'+
          '<label class="checkitem mt-8" style="'+(d.envioGratis?"border-color:rgba(75,227,160,.36)":"")+'"><input type="checkbox" id="l-envioGratis" '+(d.envioGratis?"checked":"")+' style="position:absolute;opacity:0"><span class="box">'+icon("check",13)+'</span><span><strong>Envío gratis</strong><small>Incluido en el precio.</small></span></label>'+
          '<label class="checkitem mt-8" style="'+(d.wompi?"border-color:rgba(75,227,160,.36)":"")+'"><input type="checkbox" id="l-wompi" '+(d.wompi?"checked":"")+' style="position:absolute;opacity:0"><span class="box">'+icon("check",13)+'</span><span><strong>Pago anticipado con Wompi</strong><small>Opcional para quien quiera pagar antes.</small></span></label>'+
        '</div></div>'+
      '</div>'+
      '<div class="form-actions"><button class="btn primary" type="submit">'+icon("check",16)+(edit?"Guardar cambios":"Crear landing")+'</button><a class="btn ghost" href="#/landings">Cancelar</a><span class="small muted">También puedes copiar el prompt de la landing y pulirlo en KAIROS IA.</span></div></form>'+
      '<div id="landingPreview" class="mt-16"></div>'+
    '</div>';
    return { html:html, title:edit?"Editar landing":"Nueva landing", after:function(root){
      const form = root.querySelector("#landingForm"), preview = root.querySelector("#landingPreview");
      root.querySelectorAll(".checkitem input[type=checkbox]").forEach(function(cb){
        cb.addEventListener("change", function(){ cb.closest(".checkitem").classList.toggle("on", cb.checked); });
      });
      function validate(dd){
        if(!dd.nombre || dd.nombre.length < 3) return "Escribe el nombre del producto.";
        if(!dd.descripcion || dd.descripcion.length < 15) return "La descripción necesita al menos 15 caracteres.";
        if(!dd.dolor || dd.dolor.length < 15) return "El dolor necesita al menos 15 caracteres.";
        if(ISC.parseNum(dd.precio) <= 0) return "Escribe un precio válido.";
        if(String(dd.whatsapp).replace(/\D/g,"").length < 10) return "El WhatsApp necesita mínimo 10 dígitos.";
        return "";
      }
      function renderPreview(){
        const dd = landingData(root);
        preview.innerHTML = '<div class="split"><h2 class="section-h" style="margin:0">Vista previa</h2><span class="badge">'+landingScore(dd)+' / 100</span></div>'+previewHTML(dd, true);
      }
      form.addEventListener("submit", function(e){
        e.preventDefault();
        const dd = landingData(root);
        const err = validate(dd);
        if(err){ ISC.toast(err,"info"); return; }
        const obj = Object.assign({}, dd, { id: edit?edit.id:"l"+Date.now(), creada: edit?edit.creada:Date.now(), orders: edit?edit.orders:[] });
        if(edit){
          ISC.state.landings = ISC.state.landings.map(function(x){ return x.id===obj.id?obj:x; });
        } else {
          ISC.state.landings.push(obj);
        }
        ISC.saveNow(); ISC.toast(edit?"Landing actualizada":"Landing creada");
        location.hash = "#/landings/ver/"+obj.id;
      });
      let t;
      form.addEventListener("input", function(){ clearTimeout(t); t=setTimeout(renderPreview,300); });
      renderPreview();
    }};
  });

  function previewHTML(l, compact){
    const fotos = String(l.fotos||"").split(/\n+/).map(function(x){return x.trim();}).filter(function(x){return /^https?:\/\//.test(x);});
    const discount = l.precioAntes && ISC.parseNum(l.precioAntes) > ISC.parseNum(l.precio);
    return '<div class="landing-preview"><div class="lp-hero">'+
      '<div class="lp-kicker">'+esc(l.estructura? ("ESTRUCTURA "+l.estructura.toUpperCase()) : "OFERTA ESPECIAL")+'</div>'+
      '<h2>'+esc(l.nombre||"Tu producto")+'</h2>'+
      '<p class="lp-sub">'+esc(l.descripcion||"Escribe una descripción con el resultado que recibe tu cliente.")+'</p>'+
      (fotos.length?'<img src="'+esc(fotos[0])+'" alt="" loading="lazy" style="width:100%;max-height:260px;object-fit:cover;border-radius:14px;margin-top:14px" onerror="this.style.display=\'none\'">':"")+
      '<div class="lp-price">'+money(ISC.parseNum(l.precio)||0)+(discount?' <s style="font-size:14px;color:var(--muted);font-weight:500">'+money(ISC.parseNum(l.precioAntes))+'</s>':"")+'</div>'+
      '<button class="lp-cta" type="button" data-scroll="orderBox">Pedir '+(l.contraentrega?"contraentrega":"ahora")+'</button>'+
      '<div class="chips" style="margin-top:12px">'+(l.contraentrega?'<span class="badge green">Pago contraentrega</span>':"")+(l.envioGratis?'<span class="badge cyan">Envío gratis</span>':"")+(l.garantia?'<span class="badge">Garantía</span>':"")+'</div>'+
    '</div><div class="lp-body">'+
      (l.dolor?'<div class="lp-feature">'+esc(l.dolor)+'</div>':"")+
      (l.diferencial?'<div class="lp-feature">'+esc(l.diferencial)+'</div>':"")+
      (l.publico?'<p class="small muted" style="margin:10px 0 0">Hecho para '+esc(l.publico)+'.</p>':"")+
      '<div class="lp-feature">'+(l.entrega?'Entrega en '+esc(l.entrega):"Entrega coordinada con el transportador")+'</div>'+
      (l.garantia?'<div class="lp-feature">'+esc(l.garantia)+'</div>':"")+
      (l.wompi?'<div class="lp-feature">También puedes pagar antes con Wompi.</div>':"")+
    '</div></div>';
  }

  ISC.registerView("landing-ver", function(params){
    const l = (ISC.state.landings||[]).filter(function(x){return x.id===params.id;})[0];
    if(!l) return { html:'<div class="view">'+U.empty("landing","Landing no encontrada",'<a class="btn primary mt-12" href="#/landings">Volver a Mis landings</a>')+'</div>' };
    const score = landingScore(l);
    const orders = l.orders || [];
    const checks = [
      ["Titular y descripción", l.nombre && l.descripcion && l.descripcion.length>=15],
      ["Dolor del cliente", l.dolor && l.dolor.length>=15],
      ["Público definido", !!l.publico],
      ["Precio visible", ISC.parseNum(l.precio)>0],
      ["WhatsApp válido", String(l.whatsapp||"").replace(/\D/g,"").length>=10],
      ["Prueba visual", !!(l.fotos && l.fotos.trim())],
      ["Garantía", !!(l.garantia && l.garantia.trim())]
    ];
    const html = '<div class="view">'+
      U.crumb([{label:"Mis landings",href:"#/landings"},{label:l.nombre}])+
      '<div class="lesson-head"><div><h1>'+esc(l.nombre)+'</h1><div class="meta"><span class="badge cyan">'+esc(l.estructura||"landing")+'</span><span class="badge">'+esc(ISC.fecha(l.creada))+'</span><span class="badge '+(score>=80?"green":score>=50?"gold":"red")+'">'+score+' / 100</span></div></div><div class="head-actions"><a class="btn ghost" href="#/landings/editar/'+l.id+'">'+icon("edit",16)+'Editar</a><button class="btn" type="button" id="copyLandingLink">'+icon("link",16)+'Copiar enlace local</button></div></div>'+
      '<div class="agenda-layout">'+
        '<div>'+previewHTML(l,false)+
          '<div class="panel" id="orderBox"><div class="panel-head"><div class="pt"><h3>Pedido simulado</h3><p>Este pedido se guarda en tu navegador, no se envía a nadie.</p></div><span class="badge gold">Demo</span></div><div class="panel-body"><form id="landingOrder"><div class="grid-2">'+
            '<div class="field"><label for="lo-name">Nombre</label><input class="input" id="lo-name" placeholder="Nombre completo"></div>'+
            '<div class="field"><label for="lo-phone">WhatsApp</label><input class="input" id="lo-phone" placeholder="3001234567"></div>'+
            '<div class="field" style="grid-column:1/-1"><label for="lo-address">Dirección</label><input class="input" id="lo-address" placeholder="Dirección de entrega"></div>'+
            '<div class="field"><label for="lo-city">Ciudad</label><input class="input" id="lo-city" placeholder="Ciudad"></div>'+
            '<div class="field"><label for="lo-qty">Cantidad</label><input class="input" id="lo-qty" type="number" value="1" min="1"></div>'+
          '</div><div class="form-actions"><button class="btn primary" type="submit">'+icon("send",16)+'Simular pedido</button><span class="small muted">Pago: '+(l.contraentrega?"contraentrega":"anticipado")+'</span></div></form></div></div>'+
          (orders.length?'<div class="panel"><div class="panel-head"><div class="pt"><h3>Pedidos simulados</h3><p>'+orders.length+' registrados</p></div></div><div class="panel-body">'+orders.slice().reverse().map(function(o){ return '<div class="result-line"><span>'+esc(o.cliente)+' · '+esc(o.ciudad)+'</span><strong>'+money(ISC.parseNum(l.precio)*o.qty)+'</strong></div>'; }).join("")+'</div></div>':"")+
        '</div>'+
        '<aside><div class="review-score"><div class="num">'+score+'</div><div class="txt"><strong>Revisión de tu landing</strong>'+(score>=80?"Lista para probar con tráfico.":score>=50?"Le falta prueba y claridad.":"Completa los datos clave antes de publicar.")+'</div></div>'+
          '<div class="panel"><div class="panel-head"><div class="pt"><h3>Checklist</h3><p>Lo que revisa el creador.</p></div></div><div class="panel-body">'+checks.map(function(c){ return '<div class="result-line"><span>'+esc(c[0])+'</span><strong style="color:'+(c[1]?"var(--green)":"var(--gold)")+'">'+(c[1]?"Listo":"Falta")+'</strong></div>'; }).join("")+'</div></div>'+
          '<div class="panel"><div class="panel-head"><div class="pt"><h3>Consejo</h3><p>Antes de gastar en pauta</p></div></div><div class="panel-body"><p class="small muted" style="margin:0">Publica el enlace con 3 personas reales. Si no entienden la oferta en 5 segundos, cambia el titular, no el precio.</p><a class="btn sm ghost mt-12" href="#/ia">'+icon("spark",14)+'Pedir ayuda a KAIROS IA</a></div></div>'+
        '</aside>'+
      '</div>'+
    '</div>';
    return { html:html, title:l.nombre, after:function(root){
      root.querySelector("#copyLandingLink").addEventListener("click", function(){
        const url = location.href.split("#")[0]+"#/landings/ver/"+l.id;
        ISC.copy(url,"Enlace local copiado");
      });
      root.querySelector("#landingOrder").addEventListener("submit", function(e){
        e.preventDefault();
        const g = function(id){ return root.querySelector("#"+id).value.trim(); };
        if(!g("lo-name") || !g("lo-phone") || !g("lo-address") || !g("lo-city")){ ISC.toast("Completa nombre, WhatsApp, dirección y ciudad","info"); return; }
        const qty = Math.max(1, ISC.parseNum(g("lo-qty"))||1);
        const o = { cliente:g("lo-name"), telefono:g("lo-phone"), direccion:g("lo-address"), ciudad:g("lo-city"), qty:qty, fecha:Date.now() };
        l.orders = l.orders || []; l.orders.push(o); ISC.saveNow();
        ISC.modal({title:"Pedido simulado",body:'<div class="empty" style="padding:10px"><span class="ico">'+icon("check",22)+'</span><strong>Pedido registrado</strong><p>'+esc(o.cliente)+', '+qty+' unidad(es) de '+esc(l.nombre)+'. Total: '+money(ISC.parseNum(l.precio)*qty)+'.</p><p class="small muted">Este pedido vive solo en este navegador. La entrega y el recaudo reales se hacen con tu proveedor.</p></div>',
          foot:'<button class="btn primary" type="button" data-modal-close>Entendido</button>'});
        root.querySelector("#landingOrder").reset();
        setTimeout(function(){ ISC.rerender(); }, 300);
      });
    }};
  });

  /* ================= TUTORIALES ================= */
  ISC.registerView("tutoriales", function(){
    const html = '<div class="view">'+
      U.pageHead({kicker:"APRENDE HACIENDO", title:"Tutoriales", sub:"Videos cortos para montar lo que la ruta te pide. Se abren dentro de esta app.", actions:'<a class="btn ghost" href="#/recursos">'+icon("book",16)+'Recursos</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Tutoriales",C.tutorials.length,"disponibles","accent")+U.stat("Formato","Video","paso a paso")+U.stat("Nivel","Principiante","sin experiencia")+'</div>'+
      '<div class="mt-16">'+C.tutorials.map(function(t){
        return '<button class="tutorial-card spot" type="button" data-tutorial="'+t.id+'"><span class="tutorial-thumb"><span class="play-sm">'+icon("play",15)+'</span></span><span class="tutorial-info"><span class="k">'+esc(t.kicker)+'</span><strong>'+esc(t.title)+'</strong><p>'+esc(t.desc)+'</p><span class="badge cyan mt-8">Ver tutorial</span></span></button>';
      }).join("")+'</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Más formas de aprender</h3><p>La ruta completa está en Clases.</p></div></div><div class="panel-body"><div class="resource-grid" style="margin-top:0">'+
        '<a class="resource-card" href="#/clases"><span class="rc-ico">'+icon("play",18)+'</span><strong>Clases</strong><small>60 videos y actividades.</small><span class="go">Entrar</span></a>'+
        '<a class="resource-card" href="#/manual"><span class="rc-ico">'+icon("book",18)+'</span><strong>Manual</strong><small>42 lecturas prácticas.</small><span class="go">Leer</span></a>'+
        '<a class="resource-card" href="#/agenda"><span class="rc-ico">'+icon("calendar",18)+'</span><strong>Mentoría</strong><small>Resuelve tus dudas 1 a 1.</small><span class="go">Agendar</span></a>'+
      '</div></div></div>'+
    '</div>';
    return { html:html, title:"Tutoriales", after:function(root){
      root.querySelectorAll("[data-tutorial]").forEach(function(b){
        b.addEventListener("click", function(){
          const t = C.tutorials.filter(function(x){return x.id===b.getAttribute("data-tutorial");})[0];
          ISC.modal({title:t.title, wide:true, body:'<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/'+t.youtube+'?rel=0&modestbranding=1" title="'+esc(t.title)+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div><p class="small muted mt-12">'+esc(t.desc)+'</p>',
            foot:'<button class="btn primary" type="button" data-modal-close>Cerrar</button>'});
        });
      });
    }};
  });

  /* ================= AGENDA ================= */
  function fmtTime(h, m){
    const ap = h >= 12 ? "pm" : "am";
    let hh = h % 12; if(hh === 0) hh = 12;
    return hh+":"+String(m).padStart(2,"0")+" "+ap;
  }
  function parseHM(s){ const a = s.split(":"); return Number(a[0])*60+Number(a[1]); }
  function slotList(day){
    const cfg = C.agenda.schedule[String(day.getDay())];
    const start = parseHM(cfg.start), end = parseHM(cfg.end);
    const out = [];
    for(let t = start; t + 45 <= end; t += 45){ out.push(fmtTime(Math.floor(t/60), t%60)); }
    return out;
  }
  function nextDays(n){
    const out = [];
    const d = new Date(); d.setHours(0,0,0,0);
    for(let i=0;i<n;i++){ const x = new Date(d); x.setDate(d.getDate()+i); out.push(x); }
    return out;
  }
  ISC.registerView("agenda", function(){
    const days = nextDays(7);
    let selectedDay = days[0], selectedSlot = "";
    const bookings = ISC.state.bookings || [];
    function dayStrip(){
      return days.map(function(d,i){
        const active = selectedDay.toDateString() === d.toDateString();
        return '<button class="day-btn '+(active?"active":"")+'" type="button" data-day="'+i+'"><b>'+d.toLocaleDateString("es-CO",{weekday:"short"})+'</b><span>'+d.getDate()+'</span></button>';
      }).join("");
    }
    function slotsHTML(){
      const slots = slotList(selectedDay);
      return slots.map(function(s){ return '<button class="slot '+(s===selectedSlot?"active":"")+'" type="button" data-slot="'+s+'">'+s+'</button>'; }).join("");
    }
    const html = '<div class="view">'+
      U.pageHead({kicker:"MENTORÍA 1 A 1", title:"Agenda", sub:"45 minutos con Santiago Cruz o el equipo ISKAIROS por Google Meet. Elige tu día fijo y el tema que quieres resolver.", actions:'<a class="btn ghost" href="#/ayuda">'+icon("help",16)+'Ayuda</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Duración","45 min","por sesión","accent")+U.stat("Plataforma","Google Meet","te llega el enlace")+U.stat("Frecuencia","1 por semana","incluida en mentoría")+U.stat("Temas",C.agenda.topics.length,"para elegir")+'</div>'+
      '<div class="agenda-layout">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Elige día y hora</h3><p>Disponibilidad de los próximos 7 días.</p></div><span class="badge cyan">Hora Colombia</span></div><div class="panel-body">'+
          '<div class="day-strip" id="dayStrip">'+dayStrip()+'</div>'+
          '<div class="section-h" style="margin:18px 0 4px;font-size:14px">'+selectedDay.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long"})+'</div>'+
          '<div class="slots" id="slotList">'+slotsHTML()+'</div>'+
          '<div class="field mt-16"><label for="agendaTopic">¿Qué quieres resolver?</label><select class="select" id="agendaTopic">'+C.agenda.topics.map(function(t){ return '<option>'+esc(t)+'</option>'; }).join("")+'</select></div>'+
          '<div class="field mt-12"><label for="agendaNote">Cuéntame un poco más</label><textarea class="textarea" id="agendaNote" placeholder="Mínimo 15 caracteres para que la sesión sea útil…"></textarea><span class="hint">Mínimo 15 caracteres.</span></div>'+
          '<div class="form-actions"><button class="btn primary" type="button" id="bookBtn">'+icon("calendar",16)+'Agendar sesión</button><span class="small muted" id="bookHint">Elige un horario.</span></div>'+
        '</div></div>'+
        '<aside><div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Tu mentor</h3><p>Santiago Cruz · Equipo ISKAIROS</p></div><span class="badge green">Activo</span></div><div class="panel-body"><p class="small muted" style="margin:0">Sesión práctica: revisamos tu producto, tus números o tu contenido y sales con una acción concreta. No es una clase magistral: es tu caso.</p>'+
          '<div class="chips mt-12"><span class="badge">Google Meet</span><span class="badge">45 min</span><span class="badge cyan">1 a 1</span></div></div></div>'+
          '<div class="panel"><div class="panel-head"><div class="pt"><h3>Mis reservas</h3><p>'+bookings.length+' agendadas</p></div></div><div class="panel-body">'+
            (bookings.length?bookings.slice().reverse().map(function(b){
              return '<div class="booking"><span class="bd">'+esc(b.day)+'<br>'+esc(b.month)+'</span><div style="flex:1"><strong>'+esc(b.topic)+'</strong><small>'+esc(b.time)+' · '+esc(b.dateLabel)+'</small></div><button class="icon-btn" type="button" data-del-booking="'+b.id+'" aria-label="Cancelar reserva">'+icon("trash",15)+'</button></div>';
            }).join(""):'<p class="small muted" style="margin:0">Aún no tienes reservas. Elige un día y un horario.</p>')+
          '</div></div>'+
          '<div class="panel"><div class="panel-body"><p class="small muted" style="margin:0">¿No puedes asistir? Cancela con 24 horas de anticipación para liberar el cupo.</p></div></div>'+
        '</aside>'+
      '</div></div>';
    function bind(root){
      root.querySelectorAll("[data-day]").forEach(function(b){
        b.addEventListener("click", function(){
          selectedDay = days[Number(b.getAttribute("data-day"))];
          selectedSlot = "";
          root.querySelector("#dayStrip").innerHTML = dayStrip();
          root.querySelector("#slotList").innerHTML = slotsHTML();
          bind(root);
          root.querySelector(".agenda-layout .section-h").textContent = selectedDay.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long"});
          root.querySelector("#bookHint").textContent = "Elige un horario.";
        });
      });
      root.querySelectorAll("[data-slot]").forEach(function(b){
        b.addEventListener("click", function(){
          selectedSlot = b.getAttribute("data-slot");
          root.querySelectorAll("[data-slot]").forEach(function(x){ x.classList.toggle("active", x===b); });
          root.querySelector("#bookHint").textContent = selectedSlot+" · "+selectedDay.toLocaleDateString("es-CO",{day:"numeric",month:"short"});
        });
      });
      root.querySelectorAll("[data-del-booking]").forEach(function(b){
        b.addEventListener("click", function(){
          ISC.state.bookings = ISC.state.bookings.filter(function(x){return x.id!==b.getAttribute("data-del-booking");});
          ISC.saveNow(); ISC.rerender(); ISC.toast("Reserva cancelada");
        });
      });
      const book = root.querySelector("#bookBtn");
      if(book) book.onclick = function(){
        const note = root.querySelector("#agendaNote").value.trim();
        const topic = root.querySelector("#agendaTopic").value;
        if(!selectedSlot){ ISC.toast("Elige un horario primero","info"); return; }
        if(note.length < 15){ ISC.toast("Cuéntame un poco más (mínimo 15 caracteres)","info"); root.querySelector("#agendaNote").focus(); return; }
        const b = { id:"b"+Date.now(), iso:selectedDay.toISOString(), dateLabel:selectedDay.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long"}), day:String(selectedDay.getDate()), month:selectedDay.toLocaleDateString("es-CO",{month:"short"}).toUpperCase(), time:selectedSlot, topic:topic, note:note };
        ISC.state.bookings.push(b); ISC.saveNow();
        ISC.modal({ title:"Sesión agendada", body:
          '<div class="result-line"><span>Fecha</span><strong>'+esc(b.dateLabel)+'</strong></div>'+
          '<div class="result-line"><span>Hora</span><strong>'+esc(b.time)+'</strong></div>'+
          '<div class="result-line"><span>Tema</span><strong>'+esc(b.topic)+'</strong></div>'+
          '<div class="result-big"><div class="k">Google Meet</div><div class="v" style="font-size:18px">Enlace por confirmar</div><small>Te llegará al correo y por WhatsApp antes de la sesión. Esta reserva es local y no se envía a ISKAIROS.</small></div>',
          foot:'<button class="btn primary" type="button" data-modal-close>Listo</button>'
        });
        setTimeout(function(){ ISC.rerender(); }, 350);
      };
    }
    return { html:html, title:"Agenda", after:function(root){ bind(root); }};
  });

  /* ================= AYUDA ================= */
  function helpLink(path,label){
    const map = {"/app":"#/inicio","/app/clases":"#/clases","/app/ia":"#/ia","/app/examenes":"#/examenes","/app/prompts":"#/prompts","/app/manual":"#/manual","/app/herramientas":"#/herramientas","/app/referidos":"#/referidos","/app/proveedores":"#/proveedores","/app/landings":"#/landings","/app/tutoriales":"#/tutoriales","/app/agenda":"#/agenda","/app/ayuda":"#/ayuda","/app/perfil":"#/perfil","/app/recursos":"#/recursos"};
    let href = map[path];
    if(!href && path && path.indexOf("/app/clase/")===0) href = "#/clase/"+path.split("/").pop();
    if(!href && path && path.indexOf("/app/herramientas/")===0) href = "#/herramientas/"+path.split("/").pop();
    if(!href) return "";
    return '<a class="btn sm ghost mt-12" href="'+href+'">'+esc(label||"Ir")+icon("arrow",14)+'</a>';
  }
  ISC.registerView("ayuda", function(){
    const all = (ISC.help||[]).map(function(x){ return { cat:x[0], q:x[1], kw:x[2], text:x[3], link:x[4] }; });
    const cats = [];
    all.forEach(function(x){ if(cats.indexOf(x.cat)<0) cats.push(x.cat); });
    let cat = "todas", query = "";
    function listHTML(){
      const q = query.toLowerCase();
      const rows = all.filter(function(x){
        if(cat!=="todas" && x.cat!==cat) return false;
        if(!q) return true;
        return (x.q+" "+x.kw+" "+x.text).toLowerCase().indexOf(q)>-1;
      });
      if(!rows.length) return U.empty("search","Sin respuestas para esa búsqueda","Prueba con otra palabra o escríbenos por WhatsApp.");
      return rows.map(function(x,i){
        return '<div class="faq" data-faq><button class="faq-q" type="button" aria-expanded="false"><span class="badge cyan">'+esc(C.helpCats[x.cat]?C.helpCats[x.cat].label:x.cat)+'</span><span>'+esc(x.q)+'</span><span class="chev">'+icon("down",15)+'</span></button><div class="faq-a"><div class="faq-a-inner"><div class="md">'+ISC.md(x.text)+'</div>'+(x.link?helpLink(x.link[0],x.link[1]):"")+'</div></div></div>';
      }).join("");
    }
    const html = '<div class="view">'+
      U.pageHead({kicker:"SOPORTE Y RESPUESTAS", title:"Ayuda", sub:"53 respuestas sobre producto, costos, Effi, anuncios, ventas, pagos y la plataforma.", actions:'<a class="btn wa" href="https://wa.me/'+C.profile.whatsappSoporte+'" target="_blank" rel="noopener noreferrer">'+icon("chat",16)+'Soporte</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Respuestas",all.length,"clasificadas","accent")+U.stat("Categorías",cats.length,"para encontrar rápido")+U.stat("Soporte","WhatsApp","respuesta directa")+'</div>'+
      '<div class="toolbar reveal"><label class="search">'+icon("search",17)+'<input type="search" id="faqSearch" placeholder="Busca tu duda…" aria-label="Buscar en ayuda"></label><div class="chips" id="faqCats"><button class="chip active" type="button" data-faqcat="todas">Todas <span class="n">'+all.length+'</span></button>'+
        cats.map(function(c){ return '<button class="chip" type="button" data-faqcat="'+esc(c)+'">'+esc(C.helpCats[c]?C.helpCats[c].label:c)+' <span class="n">'+all.filter(function(x){return x.cat===c;}).length+'</span></button>'; }).join("")+'</div></div>'+
      '<div id="faqList">'+listHTML()+'</div>'+
      '<div class="grid-2 mt-24">'+
        '<a class="wa-card spot" href="'+C.profile.grupoWhatsApp+'" target="_blank" rel="noopener noreferrer" style="min-height:80px"><span class="wa-icon">'+icon("users",18)+'</span><span class="wa-label">Grupo de WhatsApp<br><small class="muted">Comparte con otros estudiantes</small></span></a>'+
        '<a class="wa-card spot" href="https://wa.me/'+C.profile.whatsappSoporte+'?text=Hola%20ISKAIROS%2C%20necesito%20ayuda%20con%E2%80%A6" target="_blank" rel="noopener noreferrer" style="min-height:80px"><span class="wa-icon">'+icon("chat",18)+'</span><span class="wa-label">Soporte por WhatsApp<br><small class="muted">Te responde el equipo</small></span></a>'+
      '</div>'+
    '</div>';
    return { html:html, title:"Ayuda", after:function(root){
      const list = root.querySelector("#faqList");
      function bindFaq(){
        list.querySelectorAll(".faq-q").forEach(function(b){
          b.addEventListener("click", function(){
            const f = b.closest(".faq");
            f.classList.toggle("open");
            b.setAttribute("aria-expanded", f.classList.contains("open")?"true":"false");
          });
        });
      }
      bindFaq();
      const search = root.querySelector("#faqSearch");
      search.addEventListener("input", function(){ query=search.value.trim(); list.innerHTML=listHTML(); bindFaq(); });
      root.querySelectorAll("[data-faqcat]").forEach(function(b){
        b.addEventListener("click", function(){
          cat = b.getAttribute("data-faqcat");
          root.querySelectorAll("[data-faqcat]").forEach(function(x){ x.classList.toggle("active",x===b); });
          list.innerHTML=listHTML(); bindFaq();
        });
      });
    }};
  });

  /* ================= PERFIL ================= */
  ISC.registerView("perfil", function(){
    const st = ISC.state, g = ISC.globalStats();
    const prefs = st.prefs || {};
    const html = '<div class="view">'+
      U.pageHead({kicker:"TU CUENTA", title:"Perfil", sub:"Tus datos reales de la cuenta y tus preferencias locales."})+
      '<div class="profile-hero reveal"><div class="avatar-big">'+esc(C.profile.inicial)+'</div><div style="flex:1;min-width:200px"><h2>'+esc(C.profile.nombre)+'</h2><p>'+esc(C.profile.email)+'</p><div class="chips"><span class="badge cyan">Estudiante</span><span class="badge green">'+g.done+' clases</span><span class="badge gold">'+g.approved+' exámenes</span><span class="badge">'+g.pct+'%</span></div></div><a class="btn ghost" href="#/agenda">'+icon("calendar",16)+'Mi mentoría</a></div>'+
      '<div class="grid-2 mt-16">'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Preferencias</h3><p>Solo en este navegador.</p></div></div><div class="panel-body">'+
          '<div class="setting-row"><div><strong>Reducir animaciones</strong><small>Más calma y menos consumo.</small></div><button class="switch '+(prefs.motion?"on":"")+'" type="button" data-pref="motion" aria-label="Reducir animaciones" aria-pressed="'+(!!prefs.motion)+'"></button></div>'+
          '<div class="setting-row"><div><strong>Efecto de luz</strong><small>El brillo que sigue al cursor.</small></div><button class="switch '+(prefs.spot!==false?"on":"")+'" type="button" data-pref="spot" aria-label="Efecto de luz" aria-pressed="'+(prefs.spot!==false)+'"></button></div>'+
          '<div class="setting-row"><div><strong>Primeros pasos</strong><small>Muéstralos en Inicio.</small></div><button class="switch '+(st.stepsDismissed?"":"on")+'" type="button" data-pref="steps" aria-label="Primeros pasos" aria-pressed="'+(!st.stepsDismissed)+'"></button></div>'+
          '<div class="setting-row"><div><strong>Guía de la app</strong><small>17 pasos para ubicarte.</small></div><button class="btn sm" type="button" data-guide>'+icon("play",14)+'Abrir guía</button></div>'+
          '<div class="setting-row"><div><strong>Datos locales</strong><small>Apuntes, ventas, landings y reservas.</small></div><button class="btn sm ghost" type="button" id="resetLocal">'+icon("trash",14)+'Reiniciar</button></div>'+
        '</div></div>'+
        '<div class="panel" style="margin-top:0"><div class="panel-head"><div class="pt"><h3>Sesión y soporte</h3><p>Tu cuenta real no se modifica.</p></div></div><div class="panel-body">'+
          '<div class="setting-row"><div><strong>Correo</strong><small>'+esc(C.profile.email)+'</small></div><span class="badge green">Verificado</span></div>'+
          '<div class="setting-row"><div><strong>WhatsApp del equipo</strong><small>+57 313 530 2569</small></div><a class="btn sm wa" href="https://wa.me/'+C.profile.whatsappSoporte+'" target="_blank" rel="noopener noreferrer">'+icon("chat",14)+'Escribir</a></div>'+
          '<div class="setting-row"><div><strong>Grupo de estudiantes</strong><small>Comunidad ISKAIROS</small></div><a class="btn sm ghost" href="'+C.profile.grupoWhatsApp+'" target="_blank" rel="noopener noreferrer">'+icon("users",14)+'Entrar</a></div>'+
          '<div class="setting-row"><div><strong>Cerrar sesión</strong><small>Este archivo no tiene contraseña ni servidor.</small></div><button class="btn sm ghost" type="button" id="logoutLocal">'+icon("lock",14)+'Cerrar</button></div>'+
        '</div></div>'+
      '</div>'+
      '<div class="panel"><div class="panel-head"><div class="pt"><h3>Instala la app en tu celular</h3><p>Sin tienda de aplicaciones.</p></div><span class="badge">Opcional</span></div><div class="panel-body"><div class="grid-2">'+
        '<div class="md"><h3>iPhone / iPad</h3><ol><li>Abre este archivo en Safari.</li><li>Toca el botón Compartir.</li><li>Elige “Añadir a pantalla de inicio”.</li></ol></div>'+
        '<div class="md"><h3>Android</h3><ol><li>Abre este archivo en Chrome.</li><li>Toca el menú de tres puntos.</li><li>Elige “Añadir a pantalla principal”.</li></ol></div>'+
      '</div></div></div>'+
    '</div>';
    return { html:html, title:"Perfil", after:function(root){
      root.querySelectorAll("[data-pref]").forEach(function(b){
        b.addEventListener("click", function(){
          const k = b.getAttribute("data-pref");
          if(k === "steps"){
            st.stepsDismissed = !st.stepsDismissed;
            b.classList.toggle("on", !st.stepsDismissed);
            b.setAttribute("aria-pressed", String(!st.stepsDismissed));
            ISC.toast(st.stepsDismissed?"Primeros pasos ocultos":"Primeros pasos activados");
            ISC.save(); return;
          }
          const on = b.classList.toggle("on");
          b.setAttribute("aria-pressed",String(on));
          st.prefs[k] = k==="motion" ? on : on;
          if(k==="motion") document.documentElement.classList.toggle("reduce-motion", on);
          if(k==="spot") document.documentElement.classList.toggle("no-spot", !on);
          ISC.saveNow(); ISC.toast("Preferencia guardada");
        });
      });
      root.querySelector("#resetLocal").addEventListener("click", function(){
        ISC.modal({title:"Reiniciar datos locales",body:"<p class='muted'>Se borran tus apuntes, ventas, landings, reservas, preferencias y el avance que hayas cambiado en este archivo. El avance original de tu cuenta se vuelve a cargar.</p>",
          foot:'<button class="btn ghost" type="button" data-modal-close>Cancelar</button><button class="btn" type="button" id="resetYes" style="background:#3A1A1E;border-color:#5A2A30;color:#FFB4B4">Reiniciar</button>',
          onOpen:function(ov){ ov.querySelector("#resetYes").addEventListener("click", function(){ try{ localStorage.removeItem("iskairos-local-v1"); }catch(e){} location.reload(); }); }
        });
      });
      root.querySelector("#logoutLocal").addEventListener("click", function(){
        ISC.modal({title:"Cerrar sesión",body:"<p class='muted'>Este archivo es una copia local de tu app: no tiene contraseña, servidor ni sesión que cerrar. Tus datos seguirán en este navegador.</p><p class='small muted'>Puedes cerrar la pestaña o recargar la app para empezar de nuevo.</p>",
          foot:'<button class="btn ghost" type="button" data-modal-close>Cancelar</button><button class="btn primary" type="button" id="reloadApp">Recargar app</button>',
          onOpen:function(ov){ ov.querySelector("#reloadApp").addEventListener("click", function(){ location.reload(); }); }
        });
      });
    }};
  });

  /* ================= RECURSOS ================= */
  ISC.registerView("recursos", function(){
    const estudiar = [
      ["#/ia","spark","KAIROS IA","Tu mentor digital en modo local."],
      ["#/manual","book","Manual","42 lecturas prácticas de la ruta."],
      ["#/prompts","star","Prompts","123 prompts listos para copiar."],
      ["#/tutoriales","tutorial","Tutoriales","Videos paso a paso por tema."]
    ];
    const ejecutar = [
      ["#/herramientas","tools","Herramientas","Checklist, costeo, guiones y más."],
      ["#/proveedores","providers","Proveedores","16 opciones verificadas."],
      ["#/landings","landing","Mis landings","Tu página de venta."],
      ["#/agenda","calendar","Agenda","Sesión 1 a 1 con tu mentor."],
      ["#/ayuda","help","Ayuda","53 respuestas y soporte."],
      ["#/referidos","wallet","Wallet KAIROS","Comparte y gana."]
    ];
    function cards(arr){
      return '<div class="resource-grid stagger">'+arr.map(function(x,i){
        return '<div style="--i:'+i+'"><a class="resource-card" href="'+x[0]+'"><span class="rc-ico">'+icon(x[1],18)+'</span><strong>'+esc(x[2])+'</strong><small>'+esc(x[3])+'</small><span class="go">Abrir '+icon("arrow",12)+'</span></a></div>';
      }).join("")+'</div>';
    }
    const html = '<div class="view">'+
      U.pageHead({kicker:"TODO EN UN LUGAR", title:"Recursos", sub:"Todo lo que necesitas además de los videos. Estudia, ejecuta y mide desde la misma app.", actions:'<a class="btn ghost" href="#/clases">'+icon("play",16)+'Ir a clases</a>'})+
      '<div class="stats-grid stagger">'+U.stat("Recursos",10,"secciones internas","accent")+U.stat("Prompts",123,"listos")+U.stat("Manuales",42,"de la ruta")+'</div>'+
      U.section("Para estudiar")+cards(estudiar)+
      U.section("Para ejecutar y medir")+cards(ejecutar)+
      '<div class="panel"><div class="panel-body"><div class="split"><div><strong>¿No sabes por dónde empezar?</strong><p class="small muted" style="margin:3px 0 0">Abre la guía de 17 pasos y ubica cada sección.</p></div><button class="btn primary" type="button" data-guide>'+icon("play",16)+'Ver la guía</button></div></div></div>'+
    '</div>';
    return { html:html, title:"Recursos" };
  });
})();
