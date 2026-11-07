const http=require('http'),fs=require('fs');
const page=`<!doctype html><meta charset="utf-8"><title>save</title><body>
<form id="f" method="POST" action="/save"><textarea name="payload" id="p"></textarea></form>
<script>document.getElementById('p').value=window.name;document.getElementById('f').submit();</script>`;
const srv=http.createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  if(req.method==='POST'){
    let b='';req.on('data',c=>b+=c);req.on('end',()=>{
      fs.writeFileSync('post.raw',b);
      const m=/payload=([\s\S]*)/.exec(b);
      if(m){fs.writeFileSync('exams.b64',decodeURIComponent(m[1].replace(/\+/g,'%20')));}
      res.setHeader('Content-Type','text/html');
      res.end('<h1>saved '+b.length+'</h1>');
    });
    return;
  }
  res.setHeader('Content-Type','text/html');
  res.end(page);
});
srv.listen(8787,'127.0.0.1',()=>console.log('listening 8787'));
