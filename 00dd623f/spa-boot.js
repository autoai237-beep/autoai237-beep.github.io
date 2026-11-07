/* ============ ISKAIROS · arranque ============ */
(function(){
  "use strict";
  function boot(){
    if(!window.ISC || !window.ISC.init){
      var main = document.getElementById("contenido");
      if(main) main.innerHTML = '<div class="view"><div class="panel"><div class="panel-body"><div class="empty"><strong>No se pudo iniciar la app</strong><p>Vuelve a abrir el archivo en Chrome, Edge o Safari actualizado.</p></div></div></div></div>';
      return;
    }
    window.ISC.init();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
