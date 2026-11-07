const fs=require('fs');
const meta=require('./app-meta.json');
const bank=require('./examenes-data.json');
const exams=require('./examenes-completos.json');
const reto=require('./reto-data.json');
const modules=meta.modulos.slice().sort((a,b)=>a.orden-b.orden);
const byMod={};
meta.clases.forEach(c=>{(byMod[c.modulo_id]=byMod[c.modulo_id]||[]).push(c)});
Object.values(byMod).forEach(a=>a.sort((x,y)=>x.orden-y.orden));
// map bank keys: [module order, bank object]
const bankMap={};
const effi=byMod[modules.find(m=>m.numero===2).id]||[];
const ref=byMod[modules.find(m=>m.numero===7).id]||[];
const ext=byMod[modules.find(m=>m.numero===8).id]||[];
const m1=byMod[modules.find(m=>m.numero===1).id]||[];
for(let i=0;i<7;i++) bankMap[m1[i].id]=bank['1-'+(i+1)];
for(let i=0;i<5;i++) bankMap[ref[i].id]=bank['2-'+(i+1)];
for(let i=0;i<11;i++) bankMap[effi[i].id]=bank['3-'+(i+1)];
for(let i=0;i<3;i++) bankMap[ext[i].id]=bank['4-'+(i+1)];
let withKeys=0,totalQ=0,keyedQ=0;
for(const ex of Object.values(exams.exams)){
  const b=bankMap[ex.clase_id];
  const answers=[];
  let ok=true;
  for(const q of ex.preguntas||[]){
    totalQ++;
    const hit=b&&b.p.find(p=>p[0]===q.q);
    if(hit){answers.push(hit[2]);keyedQ++;} else {answers.push(null);ok=false;}
  }
  if(ok&&answers.length){ex.respuestas=answers;withKeys++;}
}
const out={modules:modules.map(m=>({id:m.id,numero:m.numero,titulo:m.titulo,clases:(byMod[m.id]||[]).map(c=>({...c,reto:reto.find(r=>r.clase_id===c.id)||null}))})),lessons:reto,actividades:meta.actividades,progreso:meta.progreso,exams:exams.exams,misExams:exams.mis};
fs.writeFileSync('app-data.json',JSON.stringify(out));
console.log('modules',out.modules.map(m=>m.numero+':'+m.clases.length).join(' '));
console.log('exams',Object.keys(out.exams).length,'withKeys',withKeys,'questions',totalQ,'keyed',keyedQ);
console.log('size',fs.statSync('app-data.json').size);
