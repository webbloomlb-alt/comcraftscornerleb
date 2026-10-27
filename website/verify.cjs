const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Bilal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 fs.mkdirSync('qa',{recursive:true});
 const browser=await chromium.launch({executablePath:'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',headless:true});
 const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.url().startsWith('http://127.0.0.1:4173')&&r.status()>=400)errors.push(`${r.status()} ${r.url()}`)});
 try{
  const response=await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});assert.equal(response.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  assert.equal(await page.locator('.product-card').count(),12);
  await page.locator('.filter[data-filter="crochet"]').click();assert.equal(await page.locator('.product-card').count(),2);
  await page.locator('.filter[data-filter="all"]').click();
  await page.locator('.search-trigger').click();await page.locator('#product-search').fill('floss');assert.equal(await page.locator('.product-card').count(),1);assert.match(await page.locator('.product-title').innerText(),/Floss/);
  await page.locator('#product-search').fill('zzzzzz');assert.equal(await page.locator('#empty-results').isVisible(),true);await page.locator('#reset-products').click();
  await page.locator('#sort').selectOption('low');assert.match(await page.locator('.product-title').first().innerText(),/Silicone/);await page.locator('#sort').selectOption('featured');
  await page.locator('.product-image-button[data-product="6932"]').click();assert.equal(await page.locator('#product-dialog').isVisible(),true);
  assert.equal(await page.locator('#pick-form').evaluate(f=>f.checkValidity()),false);
  await page.locator('#product-variant').selectOption({label:'Flowers'});await page.locator('#pick-form button').click();assert.equal(await page.locator('.picks-count').innerText(),'1');
  await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('.picks-count').innerText(),'1');
  await page.locator('.picks-trigger').click();await page.locator('[data-change="1"]').click();assert.equal(await page.locator('.quantity-control span').innerText(),'2');
  const wa=new URL(await page.locator('#whatsapp-picks').getAttribute('href'));assert.equal(wa.pathname,'/96181254495');assert.match(wa.searchParams.get('text'),/2 × Punch Needle Tote Bag Kit — Flowers/);assert.match(wa.searchParams.get('text'),/confirm availability/);
  await page.locator('[data-remove]').click();assert.equal(await page.locator('.empty-picks').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#picks-dialog').isVisible(),false);
  await page.locator('#search-panel').evaluate(e=>e.hidden=true);
  for(const img of await page.locator('img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.waitForTimeout(300);
  await page.screenshot({path:'qa/desktop.png',fullPage:true});await page.screenshot({path:'qa/desktop-top.png'});
  const broken=await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src));assert.deepEqual(broken,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:'qa/mobile.png',fullPage:true});await page.screenshot({path:'qa/mobile-top.png'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.locator('.menu-toggle').click();assert.equal(await page.locator('#mobile-nav').isVisible(),true);await page.locator('#mobile-nav a[href="#shop"]').click();assert.equal(await page.locator('#mobile-nav').isVisible(),false);
  await page.locator('.product-image-button[data-product="5165"]').click();await page.locator('#product-variant').selectOption({label:'Rosie Ladybird'});await page.screenshot({path:'qa/mobile-product.png'});await page.locator('#pick-form button').click();await page.locator('.picks-trigger').click();await page.screenshot({path:'qa/mobile-picks.png'});
  assert.equal(await page.locator('#picks-dialog').isVisible(),true);await page.locator('[data-remove]').click();await page.keyboard.press('Escape');
  assert.deepEqual(errors,[]);
  const result={passed:true,products:12,checks:['Desktop and mobile layout','Category filters','Search and no-results recovery','Price sorting','Required design selection','Add to picks','Local persistence after reload','Quantity updates','WhatsApp recipient and message','Removal and empty state','Mobile navigation','Dialog close with Escape','All images loaded','No horizontal overflow','No application errors'],externalMessagesSent:0};fs.writeFileSync('qa/results.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
