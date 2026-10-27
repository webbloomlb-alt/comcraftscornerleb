const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/Bilal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const products=JSON.parse(fs.readFileSync('research/products.json','utf8'));
const ids=[5165,6932,4575,3954,6722,6857,6944,6834,6804,3925,4796,5989];
const clean=s=>s.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replaceAll('&amp;','&').replaceAll('&#038;','&');
const records=ids.map(id=>products.find(p=>p.id===id));
const assets=[{file:'hero.webp',url:'https://www.craftscornerleb.com/wp-content/uploads/2021/10/june-gathercole-64yO1CCQAY8-unsplash-scaled.jpg',width:1500},{file:'brand.png',url:'https://www.craftscornerleb.com/wp-content/uploads/2024/01/Crafts-corner-logo-3.png',width:180},...records.map(p=>({file:`product-${p.id}.webp`,url:p.images[0].src,width:850}))];
async function download(a){const r=await fetch(a.url,{signal:AbortSignal.timeout(45000)});if(!r.ok)throw new Error(a.file+' HTTP '+r.status);const b=Buffer.from(await r.arrayBuffer());let pipeline=sharp(b).rotate().resize({width:a.width,withoutEnlargement:true});await(a.file.endsWith('.png')?pipeline.png():pipeline.webp({quality:86})).toFile(path.join('dist/assets',a.file));console.log(a.file);}
(async()=>{for(let i=0;i<assets.length;i+=3)await Promise.all(assets.slice(i,i+3).map(download));fs.writeFileSync('research/selected-products.json',JSON.stringify(records.map(p=>({...p,name:clean(p.name)})),null,2));console.log('assets ready');})().catch(e=>{console.error(e);process.exitCode=1});
