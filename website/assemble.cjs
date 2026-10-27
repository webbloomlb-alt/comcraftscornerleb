const fs=require('fs'),path=require('path');
const sharp=require('C:/Users/Bilal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const source=JSON.parse(fs.readFileSync('research/selected-products.json','utf8'));
const descriptions={
  5165:{name:'Hello Adorable Amigurumi Kit',category:'crochet',label:'Crochet & amigurumi',tag:'A little friend to make',description:'Make a crochet companion with cotton yarn, a crochet hook, threads, toy stuffing, a pattern, stitch marker, and tapestry needle.'},
  6932:{name:'Punch Needle Tote Bag Kit',category:'stitch',label:'Punch needle',tag:'Make it. Carry it.',description:'Turn recycled cotton yarn into a tote with personality. Includes yarns, a punch needle, hoop, tote bag, and instructions. Finished bag: 33.5 × 42 cm.'},
  4575:{name:'HELLO Mini Yarn Pack',category:'yarn',label:'Cotton yarn',tag:'A whole palette of possibility',description:'Twelve 25 g balls of mercerized cotton yarn for crochet, knitting, and punch embroidery. Choose a palette that feels like you.'},
  3954:{name:'Premium Diamond Painting Kit',category:'diamond',label:'Diamond painting',description:'Build a picture one sparkling piece at a time. Includes a printed canvas, square diamonds, applicator pen, glue squares, tweezers, and a tray.'},
  6722:{name:'Crochet Flower Bouquet Kit',category:'crochet',label:'Crochet flowers',description:'A bouquet with a little handmade heart. Choose from daisies, lavender, lilies, sunflowers, or tulips for your next crochet project.'},
  6857:{name:'DIY Embroidery Kit',category:'stitch',label:'Embroidery',description:'A new story in every stitch. Includes printed fabric, threads, two needles, a 20 cm hoop, and a guide to help your design take shape.'},
  6944:{name:'Punch Needle Pillow Kit',category:'stitch',label:'Punch needle',description:'Add your own soft touch to a room. Includes recycled cotton yarn, a punch needle, hoop, pillow base, and instructions. Finished size: 40 × 40 cm.'},
  6834:{name:'DIY Latch Hook Kit',category:'stitch',label:'Latch hook',description:'Make something full of colour and texture. Explore playful designs for a 30 × 30 cm latch hook project.'},
  6804:{name:'DIY Cross Stitch Kit',category:'stitch',label:'Cross stitch',description:'Take a little creative escape with a cross stitch scene. Choose the Eiffel Tower, a Japanese garden, or Lake Como.'},
  3925:{name:'Religious Diamond Painting Kit',category:'diamond',label:'Diamond painting',description:'Make a keepsake from a religious design. Includes a printed canvas, square diamonds, applicator, glue squares, tweezers, and tray. Sizes and prices vary by design.'},
  4796:{name:'Silicone Handle Crochet Hook',category:'yarn',label:'Hooks & accessories',description:'A colourful crochet hook with a silicone handle, available in a range of sizes for your next yarn project.'},
  5989:{name:'Embroidery Floss Bundle',category:'yarn',label:'Threads & supplies',description:'A bundle of 50 embroidery floss pieces. A colourful addition to your stitching supplies.'}
};
const decode=s=>s.replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n)).replaceAll('&amp;','&').replaceAll('&nbsp;',' ');
const products=source.map(p=>{
 const a=p.attributes.find(a=>a.has_variations);
 return {id:p.id,...descriptions[p.id],price:Number(p.prices.price)/10**p.prices.currency_minor_unit,variablePrice:!!p.prices.price_range&&p.prices.price_range.min_amount!==p.prices.price_range.max_amount,optionLabel:a?.name==='Color Palette'?'Colour palette':a?.name||'Design',options:(a?.terms||[]).map(t=>decode(t.name)),url:p.permalink};
});
fs.writeFileSync('dist/products.js','window.CRAFTS_PRODUCTS = '+JSON.stringify(products,null,2)+';\n');
(async()=>{
 const base=path.resolve('../craftscornerleb_photos/images');
 const slides=[2,5,6];
 for(let i=0;i<slides.length;i++)await sharp(path.join(base,`2026-07-01_DaQGtd3DTIF_slide-${String(slides[i]).padStart(2,'0')}.png`)).resize({width:700,withoutEnlargement:true}).webp({quality:84}).toFile(`dist/assets/community-${i+1}.webp`);
 fs.writeFileSync('README.txt',`CRAFTS CORNER WEBSITE\n\nLocal preview: run npm run dev, then open http://127.0.0.1:4173\nStatic files: dist/ — no build or installation is required.\n\nBUSINESS DESCRIPTION\nCrafts Corner is an online crafts and DIY store in Lebanon, selling project kits, yarn, and tools for creative hobbies and handmade gifts. The range includes crochet and amigurumi, diamond painting, punch needle, embroidery, cross stitch, latch hook, yarn, hooks, needles, and accessories. Gift boxes and vouchers are also listed on the existing store.\n\nCONTACT\nWhatsApp and phone: +961 81 254 495\nInstagram: https://www.instagram.com/craftscornerleb/\nExisting store: https://www.craftscornerleb.com/\n\nSCOPE\nA responsive showcase and curated 12-product catalogue with category filters, search, sorting, product/design details, and saved inquiry picks. WhatsApp opens a prepared inquiry for the visitor to review and send. No messages are sent automatically, no payments are collected, and no live inventory is connected. Design availability and final prices must be confirmed with the store.\n\nCONTENT SOURCES (checked 27 October 2026)\nProducts, prices and kit details: the official store’s public product catalogue, https://www.craftscornerleb.com/wp-json/wc/store/v1/products\nDelivery and payment: https://www.craftscornerleb.com/faq/\nCustomer project imagery: https://www.instagram.com/p/DaQGtd3DTIF/\nBrand mark, product and yarn photography: official store.\n\nDelivery listed by the store: Lebanon-wide, $3 Beirut / $4 outside Beirut, 2–4 business days, free on orders above $100. Cash on delivery in USD. Current store policy lists no returns/exchanges.\n\nThe original collected Instagram photos and ZIP are preserved in the parent folder.\n`);
 console.log(JSON.stringify({products:products.length,assets:fs.readdirSync('dist/assets').length}));
})().catch(e=>{console.error(e);process.exitCode=1});
