import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; min-width:0; }

:root {
  --teal:        #00C2A8;
  --teal-light:  #00E5CC;
  --teal-dim:    #009E88;
  --teal-faint:  rgba(0,194,168,0.07);
  --teal-border: rgba(0,194,168,0.15);
  --ink:         #060A10;
  --ink2:        #0C1119;
  --ink3:        #111A25;
  --white:       #F0F4FA;
  --grey:        #6B7A93;
  --grey2:       #3A4560;
  --amber:       #F0A500;
  --red:         #FF4D6D;
  --green:       #22D3A0;
  --nav-h:       68px;
}

html { scroll-behavior: smooth; overflow-x: hidden; max-width:100%; }

body {
  background: var(--ink);
  color: var(--white);
  font-family: 'Outfit', sans-serif;
  overflow-x: hidden;
  max-width: 100%;
  padding-bottom: 80px;
}

::-webkit-scrollbar { width: 3px; }
::-webkit-scrollbar-track { background: var(--ink2); }
::-webkit-scrollbar-thumb { background: var(--teal-dim); border-radius: 4px; }

/* ── SCROLL REVEAL ── */
.reveal, .reveal-left, .reveal-right, .reveal-scale {
  opacity: 0;
  transition: opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1);
}
.reveal       { transform: translateY(36px); }
.reveal-left  { transform: translateX(-40px); }
.reveal-right { transform: translateX(40px); }
.reveal-scale { transform: scale(0.93); }
.reveal.visible, .reveal-left.visible, .reveal-right.visible, .reveal-scale.visible {
  opacity: 1; transform: none;
}
.d1{transition-delay:.05s} .d2{transition-delay:.12s} .d3{transition-delay:.19s}
.d4{transition-delay:.26s} .d5{transition-delay:.33s} .d6{transition-delay:.40s}

/* ── NAV ── */
.tsr-nav {
  position: fixed; top:0; left:0; right:0; z-index:200;
  height: var(--nav-h);
  display: flex; align-items:center; justify-content:space-between;
  padding: 0 clamp(16px,5vw,60px);
  background: rgba(6,10,16,0.88);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid rgba(0,194,168,0.1);
  transition: background .3s;
}
.tsr-nav.scrolled { background: rgba(6,10,16,0.98); }
.nav-logo { display:flex; flex-direction:column; line-height:1; text-decoration:none; flex-shrink:0; }
.nav-logo-main { font-family:'Cormorant Garamond',serif; font-size:clamp(18px,2.6vw,26px); font-weight:700; color:var(--white); }
.nav-logo-main span { color:var(--teal); }
.nav-logo-sub { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--grey); margin-top:3px; }
.nav-links { display:flex; gap:clamp(20px,3vw,40px); list-style:none; }
.nav-links a { font-size:13px; font-weight:500; color:var(--grey); text-decoration:none; transition:color .2s; position:relative; }
.nav-links a::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:var(--teal); transform:scaleX(0); transform-origin:left; transition:transform .25s ease; }
.nav-links a:hover { color:var(--white); }
.nav-links a:hover::after { transform:scaleX(1); }
.nav-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }
.nav-sebi { font-size:11px; font-weight:700; letter-spacing:0.8px; color:var(--teal); border:1.5px solid rgba(0,194,168,.4); padding:6px 14px; border-radius:20px; background:rgba(0,194,168,.08); white-space:nowrap; }
.nav-btn { font-size:13px; font-weight:600; color:var(--ink); background:var(--teal); padding:9px 20px; border-radius:6px; text-decoration:none; transition:all .2s; white-space:nowrap; display:inline-block; }
.nav-btn:hover { background:#00D9BB; box-shadow:0 0 22px rgba(0,194,168,.4); transform:translateY(-1px); }

/* Hamburger */
.hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:6px; z-index:201; flex-shrink:0; }
.hamburger span { display:block; width:24px; height:2px; background:var(--white); border-radius:2px; transition:all .3s; }
.hamburger.open span:nth-child(1) { transform:translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.hamburger.open span:nth-child(3) { transform:translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu { display:none; position:fixed; inset:0; z-index:199; background:rgba(6,10,16,0.98); backdrop-filter:blur(24px); flex-direction:column; align-items:center; justify-content:center; gap:32px; opacity:0; transform:translateY(-20px); transition:opacity .35s ease,transform .35s ease; pointer-events:none; }
.mobile-menu.open { opacity:1; transform:translateY(0); pointer-events:all; }
.mobile-menu a { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,8vw,42px); font-weight:700; color:var(--white); text-decoration:none; transition:color .2s; }
.mobile-menu a:hover { color:var(--teal); }
.mob-cta { font-family:'Outfit',sans-serif !important; font-size:15px !important; font-weight:600 !important; color:var(--ink) !important; background:var(--teal); padding:14px 40px; border-radius:8px; margin-top:8px; }

/* ── HERO ── */
.tsr-hero {
  min-height: 100svh;
  display:flex; align-items:center;
  padding: calc(var(--nav-h) + 48px) clamp(16px,5vw,60px) 72px;
  position:relative; overflow:hidden;
}
.hero-bg-ring { position:absolute; border-radius:50%; border:1px solid rgba(0,194,168,.05); pointer-events:none; }
.ring1 { width:700px;height:700px; top:-30%;right:-10%; animation:spin 70s linear infinite; }
.ring2 { width:1100px;height:1100px; top:-50%;right:-20%; animation:spin 110s linear infinite reverse; }
.ring3 { width:400px;height:400px; bottom:-15%;left:5%; border-color:rgba(240,165,0,.04); animation:spin 90s linear infinite; }
@keyframes spin { to{ transform:rotate(360deg); } }
.hero-glow-a { position:absolute; top:5%;right:8%; width:min(580px,60vw); height:min(580px,60vw); background:radial-gradient(ellipse,rgba(0,194,168,.09) 0%,transparent 70%); pointer-events:none; animation:pulseGlow 8s ease-in-out infinite; }
.hero-glow-b { position:absolute; bottom:0;left:15%; width:min(360px,50vw); height:min(280px,40vw); background:radial-gradient(ellipse,rgba(240,165,0,.06) 0%,transparent 70%); pointer-events:none; }
@keyframes pulseGlow { 0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.12);} }
.hero-grid-bg { position:absolute; inset:0; z-index:0; background-image:linear-gradient(rgba(0,194,168,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(0,194,168,.022) 1px,transparent 1px); background-size:80px 80px; mask-image:radial-gradient(ellipse 75% 75% at 50% 50%,black 25%,transparent 100%); }

.hero-inner {
  position:relative; z-index:1;
  display:grid;
  grid-template-columns: 1fr 420px;
  gap: clamp(20px,3.5vw,52px);
  align-items: flex-end;
  width:100%; max-width:1200px; margin:0 auto;
}
.hero-text-col { grid-column:1; grid-row:1; }
.hero-photo-col { grid-column:2; grid-row:1; }

.hero-eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:11px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:var(--teal); margin-bottom:24px; animation:heroUp .8s .1s ease both; }
.eyebrow-dot { width:7px;height:7px;border-radius:50%;background:var(--teal);animation:blink 2s ease-in-out infinite; flex-shrink:0; }
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}

.tsr-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(38px,6vw,80px); font-weight:700; line-height:1.04; letter-spacing:-.5px; margin-bottom:24px; animation:heroUp .8s .2s ease both; }
.h1-accent { display:block; background:linear-gradient(90deg,var(--teal),var(--teal-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.h1-italic { font-style:italic; color:rgba(240,244,250,.45); font-weight:400; }

.hero-desc { font-size:clamp(14px,1.6vw,17px); color:var(--grey); line-height:1.8; max-width:500px; margin-bottom:36px; font-weight:300; animation:heroUp .8s .3s ease both; }

.hero-btns { display:flex; gap:12px; flex-wrap:wrap; animation:heroUp .8s .4s ease both; }
.btn-primary { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:600; color:var(--ink); background:linear-gradient(135deg,var(--teal),var(--teal-light)); padding:14px clamp(20px,3vw,32px); border-radius:8px; text-decoration:none; transition:all .25s; box-shadow:0 4px 28px rgba(0,194,168,.35); white-space:nowrap; cursor:pointer; border:none; font-family:'Outfit',sans-serif; }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(0,194,168,.5); }
.btn-outline { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:var(--teal); background:transparent; border:1px solid rgba(0,194,168,.35); padding:14px clamp(20px,3vw,32px); border-radius:8px; text-decoration:none; transition:all .25s; white-space:nowrap; cursor:pointer; font-family:'Outfit',sans-serif; }
.btn-outline:hover { background:var(--teal-faint); border-color:var(--teal); }

.trust-row { display:flex; gap:clamp(10px,2vw,24px); flex-wrap:wrap; margin-top:40px; padding-top:28px; border-top:1px solid rgba(255,255,255,.06); animation:heroUp .8s .5s ease both; }
.trust-badge { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--grey); }
.trust-icon { width:44px;height:28px;border-radius:6px;background:#fff;border:1px solid rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;padding:3px 5px; }
.trust-icon img { height:20px;width:auto;object-fit:contain;display:block; }

@keyframes heroUp { from{opacity:0;transform:translateY(28px);} to{opacity:1;transform:translateY(0);} }

/* ── HERO PHOTO ── */
.hero-photo-wrap { position:relative; height:clamp(500px,75vh,720px); display:flex; align-items:flex-end; justify-content:center; overflow:visible; animation:heroUp .9s .25s ease both; }
.hero-photo-glow { position:absolute; bottom:0px; left:50%; transform:translateX(-50%); width:420px; height:420px; background:radial-gradient(ellipse at 50% 80%,rgba(0,194,168,.28) 0%,rgba(0,194,168,.10) 40%,transparent 70%); filter:blur(35px); z-index:0; animation:pulseGlow 5s ease-in-out infinite; pointer-events:none; }
.hero-photo-ring { position:absolute; bottom:0;left:50%;transform:translateX(-50%); width:100%;height:100%; border-radius:50% 50% 0 0/30% 30% 0 0; background:linear-gradient(to top,rgba(0,194,168,.12) 0%,transparent 60%); z-index:0; }
.hero-photo-img { position:relative; z-index:1; width:100%; height:100%; object-fit:cover; object-position:top center; display:block; border-radius:20px 20px 0 0; filter:brightness(1.0) contrast(1.02) saturate(0.95); -webkit-mask-image:linear-gradient(to bottom,black 0%,black 50%,rgba(0,0,0,0.6) 75%,transparent 100%); mask-image:linear-gradient(to bottom,black 0%,black 50%,rgba(0,0,0,0.6) 75%,transparent 100%); }
.hero-photo-frame { position:absolute; z-index:2; bottom:0;left:50%;transform:translateX(-50%); width:calc(100% - 20px); height:3px; background:linear-gradient(90deg,transparent,var(--teal),transparent); border-radius:4px; }
.photo-badge { position:absolute; z-index:3; bottom:28px; right:-10px; background:rgba(12,17,25,0.9); border:1px solid rgba(0,194,168,.3); border-radius:12px; padding:10px 14px; backdrop-filter:blur(12px); animation:cardFloat 5s ease-in-out infinite; }
@keyframes cardFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
.photo-badge-val { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:var(--teal); line-height:1; }
.photo-badge-label { font-size:10px; color:var(--grey); margin-top:2px; }

/* ── TICKER ── */
.tsr-ticker { overflow:hidden; background:var(--ink2); border-top:1px solid rgba(0,194,168,.1); border-bottom:1px solid rgba(0,194,168,.1); padding:11px 0; }
.ticker-track { display:flex; width:max-content; animation:ticker 28s linear infinite; }
.ticker-track:hover { animation-play-state:paused; }
@keyframes ticker { to{transform:translateX(-50%);} }
.ticker-item { display:flex; align-items:center; gap:6px; padding:0 32px; font-size:12px; font-weight:500; white-space:nowrap; border-right:1px solid rgba(0,194,168,.08); }
.t-name{color:var(--grey);} .t-val{color:var(--white);}
.t-up{color:var(--green);font-size:11px;} .t-dn{color:var(--red);font-size:11px;}

/* ── NUMBERS ── */
.numbers-bar { background:var(--ink2); border-bottom:1px solid rgba(0,194,168,.07); display:grid; grid-template-columns:repeat(4,1fr); width:100%; box-sizing:border-box; overflow:hidden; }
.num-block { padding:clamp(28px,4vw,48px) 0; text-align:center; border-right:1px solid rgba(0,194,168,.07); transition:background .2s; cursor:default; }
.num-block:last-child { border-right:none; }
.num-block:hover { background:var(--teal-faint); }
.num-val { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,5vw,52px); font-weight:700; line-height:1; background:linear-gradient(135deg,var(--teal),var(--teal-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.num-label { font-size:clamp(11px,1.2vw,13px); color:var(--grey); margin-top:6px; padding:0 8px; }

/* ── SECTION COMMONS ── */
.tsr-section { padding:clamp(60px,8vw,100px) clamp(16px,5vw,60px); width:100%; box-sizing:border-box; }
.section-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:var(--teal); margin-bottom:14px; }
.section-eyebrow::before { content:''; width:18px; height:1px; background:var(--teal); flex-shrink:0; }
.section-h { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,52px); font-weight:700; line-height:1.1; margin-bottom:14px; }
.section-sub { font-size:clamp(14px,1.5vw,16px); color:var(--grey); line-height:1.8; font-weight:300; max-width:500px; }

/* ── SERVICES ── */
.services-bg { background:var(--ink); }
.services-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:clamp(36px,5vw,56px); gap:20px; flex-wrap:wrap; }
.services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; background:rgba(0,194,168,.05); border:1px solid rgba(0,194,168,.05); border-radius:16px; overflow:hidden; }
.svc-card { background:var(--ink2); padding:clamp(20px,3vw,36px) clamp(18px,2.5vw,30px); transition:background .3s,transform .3s; position:relative; overflow:hidden; }
.svc-card::before { content:''; position:absolute; top:0;left:0;right:0;height:2px; background:linear-gradient(90deg,transparent,var(--teal),transparent); transform:scaleX(0); transition:transform .4s ease; }
.svc-card::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--teal-faint),transparent); opacity:0; transition:opacity .3s; }
.svc-card:hover { background:var(--ink3); }
.svc-card:hover::before { transform:scaleX(1); }
.svc-card:hover::after { opacity:1; }
.svc-num { font-family:'Cormorant Garamond',serif; font-size:12px; font-weight:600; color:rgba(0,194,168,.35); letter-spacing:2px; margin-bottom:16px; }
.svc-icon { font-size:26px; margin-bottom:16px; display:block; position:relative; z-index:1; }
.svc-title { font-size:clamp(14px,1.6vw,17px); font-weight:600; margin-bottom:10px; color:var(--white); position:relative; z-index:1; }
.svc-desc { font-size:clamp(12px,1.2vw,14px); color:var(--grey); line-height:1.7; font-weight:300; position:relative; z-index:1; }
.svc-tag { display:inline-block; margin-top:16px; font-size:11px; font-weight:500; color:var(--teal); background:var(--teal-faint); border:1px solid rgba(0,194,168,.2); padding:3px 10px; border-radius:20px; position:relative; z-index:1; }

/* ── WHY US ── */
.why-bg { background:var(--ink2); border-top:1px solid rgba(0,194,168,.06); }
.why-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(40px,6vw,80px); align-items:center; }
.why-list { margin-top:clamp(24px,3vw,40px); }
.why-item { display:flex; gap:16px; padding:clamp(16px,2vw,24px) 0; border-bottom:1px solid rgba(255,255,255,.04); align-items:flex-start; transition:all .2s; }
.why-item:hover .why-icon { background:var(--teal); border-color:var(--teal); }
.why-item:hover .why-icon-inner { filter:brightness(0) invert(1); }
.why-icon { width:44px;height:44px;border-radius:10px;background:var(--teal-faint);border:1px solid rgba(0,194,168,.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;transition:all .2s; }
.why-text-title { font-size:clamp(13px,1.5vw,15px); font-weight:600; margin-bottom:4px; }
.why-text-desc { font-size:clamp(12px,1.2vw,13px); color:var(--grey); line-height:1.65; font-weight:300; }

.perf-card { background:var(--ink3); border:1px solid rgba(0,194,168,.12); border-radius:18px; padding:clamp(18px,3vw,32px); box-shadow:0 20px 60px rgba(0,0,0,.4); }
.perf-title { font-size:12px; color:var(--grey); letter-spacing:1px; text-transform:uppercase; margin-bottom:20px; }
.bars-wrap { display:flex; align-items:flex-end; gap:10px; height:clamp(120px,15vw,160px); margin-bottom:18px; }
.bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; height:100%; justify-content:flex-end; }
.bar-fill { width:100%; border-radius:6px 6px 0 0; background:linear-gradient(to top,rgba(0,194,168,.5),var(--teal)); cursor:pointer; transition:filter .2s,height .8s cubic-bezier(.22,1,.36,1); }
.bar-fill:hover { filter:brightness(1.3); }
.bar-fill.projected { background:linear-gradient(to top,rgba(0,194,168,.2),rgba(0,194,168,.4)); border:1px dashed rgba(0,194,168,.4); }
.bar-pct { font-size:10px; font-weight:600; color:var(--teal); white-space:nowrap; }
.bar-yr  { font-size:9px; color:var(--grey); }
.perf-footnote { font-size:11px; color:var(--grey2); line-height:1.6; }
.disclaimer-box { margin-top:18px; background:rgba(255,193,7,.05); border:1px solid rgba(255,193,7,.2); border-left:4px solid #F0A500; border-radius:12px; padding:16px 18px; }
.disclaimer-box p { font-size:12px; color:var(--grey); line-height:1.7; }
.disclaimer-box strong { color:#F0A500; }

/* ── TESTIMONIALS ── */
.testi-bg { background:var(--ink); }
.testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:clamp(36px,5vw,56px); }
.testi-card { background:var(--ink2); border:1px solid rgba(255,255,255,.05); border-radius:14px; padding:clamp(18px,3vw,28px); transition:border-color .25s,transform .3s,box-shadow .3s; }
.testi-card:hover { border-color:rgba(0,194,168,.3); transform:translateY(-6px); box-shadow:0 16px 48px rgba(0,0,0,.35); }
.testi-stars { color:var(--amber); font-size:13px; margin-bottom:14px; }
.testi-text { font-size:clamp(14px,1.6vw,17px); color:var(--grey); line-height:1.75; font-style:italic; font-family:'Cormorant Garamond',serif; }
.testi-author { margin-top:20px; display:flex; align-items:center; gap:12px; padding-top:16px; border-top:1px solid rgba(255,255,255,.05); }
.testi-av { width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:var(--ink);flex-shrink:0; }
.testi-name { font-size:13px; font-weight:600; color:var(--white); }
.testi-loc  { font-size:11px; color:var(--grey); margin-top:1px; }
.testi-disclaimer { font-size:10px; color:var(--grey2); margin-top:12px; padding-top:10px; border-top:1px solid rgba(255,255,255,.04); line-height:1.5; font-style:italic; }

/* ── CTA BAND ── */
.cta-band { background:linear-gradient(135deg,rgba(0,194,168,.1) 0%,var(--ink2) 60%); border-top:1px solid rgba(0,194,168,.12); border-bottom:1px solid rgba(0,194,168,.12); padding:clamp(60px,8vw,100px) clamp(16px,5vw,60px); display:grid; grid-template-columns:1fr auto; gap:clamp(30px,5vw,60px); align-items:center; width:100%; box-sizing:border-box; }
.cta-h { font-family:'Cormorant Garamond',serif; font-size:clamp(28px,4vw,56px); font-weight:700; line-height:1.1; margin-bottom:14px; }
.cta-h span { color:var(--teal); }
.cta-p { font-size:clamp(14px,1.5vw,16px); color:var(--grey); font-weight:300; }
.cta-right { display:flex; flex-direction:column; gap:12px; align-items:flex-end; }
.cta-note { font-size:11px; color:var(--grey); text-align:right; }

/* ── FOOTER ── */
.tsr-footer { background:var(--ink2); padding:clamp(40px,6vw,70px) clamp(16px,5vw,60px) clamp(20px,3vw,30px); border-top:1px solid rgba(255,255,255,.04); width:100%; box-sizing:border-box; }
.footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:clamp(24px,4vw,60px); margin-bottom:40px; }
.footer-logo-main { font-family:'Cormorant Garamond',serif; font-size:clamp(18px,2vw,22px); font-weight:700; color:var(--white); }
.footer-logo-main span { color:var(--teal); }
.footer-logo-sub { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--grey); margin:3px 0 14px; }
.footer-about { font-size:13px; color:var(--grey); line-height:1.75; font-weight:300; }
.footer-reg { display:inline-flex; align-items:center; gap:6px; margin-top:14px; font-size:11px; color:var(--teal); background:var(--teal-faint); border:1px solid rgba(0,194,168,.25); padding:5px 12px; border-radius:20px; }
.footer-col-title { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--teal); margin-bottom:18px; }
.footer-col a { display:block; font-size:13px; color:var(--grey); text-decoration:none; margin-bottom:11px; font-weight:300; transition:color .2s; }
.footer-col a:hover { color:var(--white); }
.footer-disclaimer { background:rgba(255,193,7,.04); border:1px solid rgba(255,193,7,.2); border-left:4px solid #F0A500; border-radius:10px; padding:18px 20px; margin-bottom:28px; font-size:11px; color:var(--grey2); line-height:1.8; }
.footer-disclaimer strong { color:#F0A500; }
.footer-disclaimer .disc-title { font-size:13px; font-weight:700; color:#F0A500; display:inline-flex; align-items:center; gap:6px; margin-bottom:6px; }
.footer-cert-row { display:flex; gap:12px; flex-wrap:wrap; margin-top:18px; padding-top:16px; border-top:1px solid rgba(255,255,255,.05); }
.footer-cert-badge { display:inline-flex; align-items:center; gap:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:8px 16px; font-size:11px; color:var(--grey); font-weight:500; }
.footer-cert-badge .cert-icon { flex-shrink:0; display:flex; align-items:center; justify-content:center; background:#fff; border-radius:6px; padding:4px 7px; }
.footer-cert-badge .cert-icon img { height:26px; width:auto; object-fit:contain; display:block; }
.footer-cert-badge strong { color:var(--white); font-weight:600; display:block; margin-bottom:1px; }
.footer-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:20px; border-top:1px solid rgba(255,255,255,.04); }
.footer-bottom p { font-size:12px; color:var(--grey2); }
.footer-social { display:flex; gap:10px; align-items:center; }
.footer-social-link { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:500; color:var(--grey); text-decoration:none; padding:6px 14px; border-radius:999px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.03); transition:all .2s; }
.footer-social-link:hover { color:#fff; border-color:rgba(255,255,255,.2); background:rgba(255,255,255,.07); }
.footer-social-link.insta:hover { border-color:#E1306C; color:#E1306C; background:rgba(225,48,108,.06); }
.footer-social-link.fb:hover { border-color:#1877F2; color:#1877F2; background:rgba(24,119,242,.06); }
.social-icon { display:inline-flex; align-items:center; flex-shrink:0; }
.social-icon svg { width:16px; height:16px; display:block; }

/* ── REGISTER MODAL ── */
.reg-overlay { position:fixed; inset:0; z-index:1000; background:rgba(6,10,16,0.75); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; padding:16px; opacity:0; pointer-events:none; transition:opacity .25s ease; }
.reg-overlay.open { opacity:1; pointer-events:all; }
.reg-modal { position:relative; width:100%; max-width:480px; max-height:90vh; overflow-y:auto; background:linear-gradient(145deg,#0f1a2e,#0C1119); border:1px solid rgba(37,99,235,.25); border-radius:20px; padding:clamp(24px,5vw,44px); box-shadow:0 32px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04); transform:scale(0.88) translateY(24px); transition:transform .32s cubic-bezier(.34,1.56,.64,1), opacity .25s ease; opacity:0; }
.reg-overlay.open .reg-modal { transform:scale(1) translateY(0); opacity:1; }
.reg-modal-close { position:absolute; top:16px; right:16px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.6); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; line-height:1; transition:all .2s; }
.reg-modal-close:hover { background:rgba(255,255,255,.12); color:#fff; }
.reg-modal-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:1.5px; text-transform:uppercase; color:#60A5FA; background:rgba(37,99,235,.12); border:1px solid rgba(37,99,235,.3); padding:4px 12px; border-radius:999px; margin-bottom:14px; }
.reg-modal-h { font-family:'Cormorant Garamond',serif; font-size:clamp(20px,3.5vw,30px); font-weight:700; color:#fff; line-height:1.2; margin-bottom:6px; }
.reg-modal-h span { color:#60A5FA; }
.reg-modal-sub { font-size:13px; color:var(--grey); margin-bottom:26px; line-height:1.6; font-weight:300; }
.reg-field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; }
.reg-field label { font-size:12px; font-weight:600; color:rgba(255,255,255,.65); letter-spacing:0.5px; text-transform:uppercase; }
.reg-field input { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); border-radius:10px; padding:13px 16px; color:#fff; font-family:'Outfit',sans-serif; font-size:14px; font-weight:400; outline:none; transition:border-color .2s, box-shadow .2s; width:100%; }
.reg-field input::placeholder { color:rgba(255,255,255,.25); }
.reg-field input:focus { border-color:rgba(37,99,235,.6); box-shadow:0 0 0 3px rgba(37,99,235,.15); }
.reg-field input.error { border-color:rgba(255,77,109,.6); }
.reg-field .field-err { font-size:11px; color:#FF4D6D; margin-top:2px; }
.reg-api-error { background:rgba(255,77,109,.1); border:1px solid rgba(255,77,109,.3); border-radius:8px; padding:10px 14px; font-size:13px; color:#FF4D6D; margin-bottom:12px; line-height:1.5; }
.reg-submit { width:100%; margin-top:8px; padding:15px; border-radius:999px; background:linear-gradient(135deg,#2563EB,#3B82F6); color:#fff; font-family:'Outfit',sans-serif; font-size:15px; font-weight:700; border:none; cursor:pointer; letter-spacing:0.3px; transition:all .2s; box-shadow:0 6px 24px rgba(37,99,235,.4); }
.reg-submit:hover:not(:disabled) { background:linear-gradient(135deg,#1D4ED8,#2563EB); transform:translateY(-1px); box-shadow:0 10px 32px rgba(37,99,235,.55); }
.reg-submit:disabled { opacity:.6; cursor:not-allowed; }
.reg-modal-perks { display:flex; gap:12px; flex-wrap:wrap; margin-top:18px; padding-top:16px; border-top:1px solid rgba(255,255,255,.05); }
.reg-modal-perk { display:flex; align-items:center; gap:5px; font-size:11px; color:rgba(255,255,255,.5); }
.reg-modal-perk span { color:#34D399; font-size:12px; }
.reg-success { display:flex; flex-direction:column; align-items:center; text-align:center; gap:0; animation:successIn .45s cubic-bezier(.34,1.56,.64,1) both; }
@keyframes successIn { from { opacity:0; transform:scale(0.85) translateY(16px); } to { opacity:1; transform:none; } }
.reg-success-confetti { font-size:48px; line-height:1; animation:confettiBounce 0.6s cubic-bezier(.34,1.8,.64,1) both; margin-bottom:6px; }
@keyframes confettiBounce { from { transform:scale(0) rotate(-20deg); } to { transform:scale(1) rotate(0deg); } }
.reg-success-congrats { font-size:11px; font-weight:700; letter-spacing:2.5px; text-transform:uppercase; color:#34D399; background:rgba(52,211,153,.1); border:1px solid rgba(52,211,153,.25); padding:4px 14px; border-radius:999px; margin-bottom:14px; animation:fadeUp .4s .15s both ease-out; }
.reg-success-h { font-family:'Cormorant Garamond',serif; font-size:clamp(22px,4vw,32px); font-weight:700; color:#fff; line-height:1.2; margin-bottom:8px; animation:fadeUp .4s .2s both ease-out; }
.reg-success-h span { color:#60A5FA; }
.reg-success-sub { font-size:13px; color:var(--grey); line-height:1.7; font-weight:300; max-width:340px; margin-bottom:22px; animation:fadeUp .4s .25s both ease-out; }
.reg-success-sub strong { color:#fff; }
.reg-success-divider { width:100%; height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,.08),transparent); margin-bottom:22px; animation:fadeUp .4s .28s both ease-out; }
.reg-wa-label { font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:rgba(255,255,255,.45); margin-bottom:12px; animation:fadeUp .4s .3s both ease-out; }
.reg-wa-btn { display:inline-flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:15px 24px; border-radius:14px; background:linear-gradient(135deg,#25D366,#128C7E); color:#fff; font-family:'Outfit',sans-serif; font-size:16px; font-weight:700; text-decoration:none; letter-spacing:0.3px; transition:all .2s; box-shadow:0 8px 28px rgba(37,211,102,.35); animation:fadeUp .45s .35s both ease-out; margin-bottom:12px; }
.reg-wa-btn:hover { transform:translateY(-2px); box-shadow:0 12px 36px rgba(37,211,102,.5); }
.reg-wa-icon { font-size:22px; flex-shrink:0; }
.reg-wa-text { display:flex; flex-direction:column; align-items:flex-start; }
.reg-wa-text-main { font-size:15px; font-weight:700; line-height:1; }
.reg-wa-text-sub { font-size:11px; font-weight:400; opacity:0.8; margin-top:2px; }
.reg-wa-note { font-size:11px; color:rgba(255,255,255,.35); animation:fadeUp .4s .4s both ease-out; margin-bottom:16px; }
.reg-success-close { font-size:12px; color:rgba(255,255,255,.3); background:none; border:none; cursor:pointer; font-family:'Outfit',sans-serif; padding:4px; transition:color .2s; animation:fadeUp .4s .45s both ease-out; }
.reg-success-close:hover { color:rgba(255,255,255,.6); }
@keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }

/* ── REGISTER BUTTON VARIANTS ── */
.nav-btn-register { background:linear-gradient(135deg,#2563EB,#3B82F6) !important; color:#fff !important; border-radius:999px !important; font-weight:700 !important; font-size:14px !important; padding:10px 22px !important; box-shadow:0 4px 18px rgba(37,99,235,.5) !important; animation:navBtnPulse 2.8s ease-in-out infinite !important; }
.nav-btn-register:hover { background:linear-gradient(135deg,#1D4ED8,#2563EB) !important; box-shadow:0 6px 28px rgba(37,99,235,.7) !important; animation:none !important; transform:translateY(-1px) !important; }
@keyframes navBtnPulse { 0%,100%{box-shadow:0 4px 18px rgba(37,99,235,.5);} 50%{box-shadow:0 4px 32px rgba(37,99,235,.85), 0 0 0 6px rgba(37,99,235,.12);} }

.btn-register { display:inline-flex; align-items:center; gap:10px; font-size:16px; font-weight:800; color:#fff; background:linear-gradient(135deg,#2563EB,#3B82F6); padding:17px clamp(28px,4vw,44px); border-radius:999px; text-decoration:none; transition:all .25s; box-shadow:0 8px 32px rgba(37,99,235,.55); white-space:nowrap; letter-spacing:0.3px; border:none; cursor:pointer; font-family:'Outfit',sans-serif; animation:registerPulse 2.8s ease-in-out infinite; position:relative; overflow:hidden; }
.btn-register::after { content:""; position:absolute; inset:0; border-radius:999px; background:linear-gradient(135deg,rgba(255,255,255,.15),transparent); pointer-events:none; }
.btn-register:hover { transform:translateY(-3px) scale(1.02); box-shadow:0 14px 48px rgba(37,99,235,.7); background:linear-gradient(135deg,#1D4ED8,#2563EB); animation:none; }
@keyframes registerPulse { 0%,100%{box-shadow:0 8px 32px rgba(37,99,235,.55);} 50%{box-shadow:0 8px 48px rgba(37,99,235,.85), 0 0 0 10px rgba(37,99,235,.1);} }

.sebi-chip { display:inline-flex; align-items:center; gap:8px; background:rgba(0,194,168,.1); border:1.5px solid rgba(0,194,168,.4); border-radius:999px; padding:7px 16px; margin-top:16px; }
.sebi-chip-dot { width:8px; height:8px; border-radius:50%; background:var(--teal); box-shadow:0 0 8px var(--teal); animation:sebiDotBlink 1.6s ease-in-out infinite; flex-shrink:0; }
@keyframes sebiDotBlink { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.5;transform:scale(.75);} }
.sebi-chip-text { font-size:12px; font-weight:700; color:var(--teal); letter-spacing:0.8px; text-transform:uppercase; }
.sebi-chip-num { font-size:13px; font-weight:800; color:#fff; letter-spacing:1px; }

.hero-register-note { font-size:11px; color:var(--grey2); margin-top:8px; font-weight:400; letter-spacing:0.2px; }

/* ── REGISTER STRIP (after testimonials) ── */
.reg-strip { background:linear-gradient(135deg,rgba(37,99,235,.15) 0%,rgba(37,99,235,.05) 100%); border-top:1px solid rgba(37,99,235,.2); border-bottom:1px solid rgba(37,99,235,.2); padding:clamp(40px,6vw,70px) clamp(16px,5vw,60px); display:flex; flex-direction:column; align-items:center; text-align:center; gap:20px; width:100%; box-sizing:border-box; }
.reg-strip-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:#60A5FA; background:rgba(37,99,235,.12); border:1px solid rgba(37,99,235,.25); padding:5px 14px; border-radius:999px; }
.reg-strip-h { font-family:'Cormorant Garamond',serif; font-size:clamp(24px,4vw,46px); font-weight:700; line-height:1.15; color:var(--white); max-width:640px; }
.reg-strip-h span { color:#60A5FA; }
.reg-strip-sub { font-size:clamp(13px,1.4vw,15px); color:var(--grey); max-width:480px; line-height:1.7; font-weight:300; }
.reg-strip-perks { display:flex; gap:clamp(12px,3vw,32px); flex-wrap:wrap; justify-content:center; margin-top:4px; }
.reg-strip-perk { display:flex; align-items:center; gap:7px; font-size:13px; color:rgba(255,255,255,.75); font-weight:400; }
.reg-strip-perk span { color:#34D399; font-size:15px; }

/* ── OFFER STICKY BAR ── */
.offer-bar-wrap { position:fixed; bottom:0; left:0; right:0; z-index:400; width:100%; box-sizing:border-box; padding:8px 16px 10px; background:linear-gradient(0deg,rgba(6,10,16,.97) 0%,rgba(6,10,16,.7) 100%); border-top:1px solid rgba(37,99,235,.2); overflow:hidden; }
.offer-bar { width:100%; max-width:1060px; margin:0 auto; box-sizing:border-box; background:linear-gradient(135deg,rgba(30,50,120,.95) 0%,rgba(15,25,60,.98) 100%); border:1.5px solid rgba(37,99,235,.5); border-radius:14px; display:flex; align-items:center; justify-content:space-between; padding:11px 20px; box-shadow:0 0 32px rgba(37,99,235,.2), 0 0 0 1px rgba(37,99,235,.08) inset; gap:12px; }
.offer-bar-left { display:flex; flex-direction:column; gap:4px; flex-shrink:0; min-width:0; }
.offer-price { font-family:'Outfit',sans-serif; font-size:clamp(14px,1.8vw,18px); font-weight:800; color:#fff; line-height:1; letter-spacing:0.2px; white-space:nowrap; }
.offer-price span { color:rgba(255,255,255,0.5); text-decoration:line-through; text-decoration-color:rgba(255,80,80,0.85); text-decoration-thickness:2px; font-weight:700; }
.offer-timer { display:flex; align-items:center; gap:4px; font-family:'Outfit',sans-serif; font-size:clamp(10px,1.2vw,12px); color:rgba(255,255,255,0.7); font-weight:500; flex-wrap:nowrap; white-space:nowrap; }
.timer-block { background:rgba(37,99,235,.35); border:1px solid rgba(37,99,235,.6); color:#fff; font-weight:700; font-size:clamp(11px,1.3vw,13px); padding:2px 7px; border-radius:5px; min-width:26px; text-align:center; letter-spacing:0.5px; }
.timer-label { color:rgba(255,255,255,0.5); font-size:clamp(9px,1vw,11px); font-weight:400; }
.offer-bar-mid { flex:1; text-align:center; font-family:'Outfit',sans-serif; font-size:clamp(11px,1.3vw,14px); font-weight:600; color:rgba(255,255,255,.75); overflow:hidden; text-overflow:ellipsis; padding:0 clamp(8px,1.5vw,20px); white-space:nowrap; }
.offer-btn { flex-shrink:0; display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:0 clamp(18px,3vw,32px); height:clamp(38px,5vw,44px); border-radius:999px; background:linear-gradient(135deg,#2563EB,#3B82F6); color:#fff; font-family:'Outfit',sans-serif; font-size:clamp(13px,1.4vw,15px); font-weight:700; letter-spacing:0.3px; transition:all .2s; white-space:nowrap; box-shadow:0 4px 20px rgba(37,99,235,.6); border:none; cursor:pointer; animation:offerBtnPulse 2.8s ease-in-out infinite; text-decoration:none; }
.offer-btn:hover { background:linear-gradient(135deg,#1D4ED8,#2563EB); transform:translateY(-2px); box-shadow:0 8px 32px rgba(37,99,235,.8); animation:none; }
@keyframes offerBtnPulse { 0%,100%{box-shadow:0 4px 20px rgba(37,99,235,.6);} 50%{box-shadow:0 4px 32px rgba(37,99,235,.9), 0 0 0 6px rgba(37,99,235,.15);} }

/* ════════════════════════════════════════════
   RESPONSIVE BREAKPOINTS
   ════════════════════════════════════════════ */

/* ── Large desktop (≤ 1200px) ── */
@media (max-width:1200px) {
  .hero-inner { grid-template-columns: 1fr 360px; }
}

/* ── Medium-large (≤ 1100px) ── */
@media (max-width:1100px) {
  .hero-inner { grid-template-columns:1fr 300px; gap:20px; }
  .hero-photo-wrap { height:clamp(380px,55vh,560px); }
  .footer-top { grid-template-columns:1fr 1fr; gap:36px; }
  .cta-band { grid-template-columns:1fr; }
  .cta-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; }
  .cta-note { text-align:left; width:100%; }
}

/* ── Tablet landscape (≤ 960px) ── */
@media (max-width:960px) {
  .services-grid { grid-template-columns:1fr 1fr; }
  .testi-grid { grid-template-columns:1fr 1fr; }
  .numbers-bar { grid-template-columns:repeat(2,1fr); }
  .num-block:nth-child(2) { border-right:none; }
  .num-block:nth-child(3) { border-right:1px solid rgba(0,194,168,.07); border-top:1px solid rgba(0,194,168,.07); }
  .num-block:nth-child(4) { border-right:none; border-top:1px solid rgba(0,194,168,.07); }
  .nav-links, .nav-sebi { display:none; }
  .hamburger { display:flex; }
  .mobile-menu { display:flex; }
  .why-grid { grid-template-columns:1fr; gap:40px; }
}

/* ── Tablet portrait (≤ 780px) ── */
@media (max-width:780px) {
  /* Hero stack */
  .hero-inner {
    grid-template-columns: 1fr !important;
    grid-template-rows: auto auto;
    gap: 0 !important;
    align-items: flex-start;
  }
  .hero-text-col { grid-column:1; grid-row:1; }
  .hero-photo-col { grid-column:1; grid-row:2; }
  .hero-photo-wrap {
    display: flex !important;
    height: clamp(280px,70vw,460px);
    width: 100%;
    margin-top: 32px;
    justify-content: center;
  }
  .hero-photo-img { width:auto !important; max-width:100%; height:100%; }
  .photo-badge { right:8px; bottom:16px; }
  .hero-btns { gap:10px; }

  /* Services full width on small tablet */
  .services-grid { grid-template-columns:1fr; }

  /* CTA stack */
  .cta-band { grid-template-columns:1fr; }
  .cta-right { flex-direction:column; align-items:flex-start; }

  /* Footer 2-col */
  .footer-top { grid-template-columns:1fr 1fr; }
}

/* ── Large mobile (≤ 640px) ── */
@media (max-width:640px) {
  body { padding-bottom: 80px; }

  /* Hero */
  .tsr-hero { padding-top: calc(var(--nav-h) + 32px); padding-bottom: 56px; }
  .hero-btns .btn-outline { display:none; }
  .trust-row { gap:10px; margin-top:28px; padding-top:20px; }
  .trust-badge { font-size:11px; }

  /* Numbers */
  .numbers-bar { grid-template-columns:1fr 1fr; }
  .num-block { padding:24px 8px; }

  /* Section heading */
  .section-h { font-size:clamp(26px,7vw,38px); }

  /* Testimonials */
  .testi-grid { grid-template-columns:1fr; gap:14px; }

  /* Register strip perks */
  .reg-strip-perks { gap:10px; }
  .reg-strip-perk { font-size:12px; }

  /* Footer */
  .footer-top { grid-template-columns:1fr; gap:28px; }
  .footer-bottom { flex-direction:column; align-items:flex-start; gap:6px; }

  /* Offer bar */
  .offer-bar-mid { display:none; }
  .offer-bar { gap:10px; padding:10px 14px; border-radius:10px; }
  .offer-bar-wrap { padding:6px 10px 8px; }

  /* CTA band */
  .cta-right { width:100%; }
  .cta-right .btn-register, .cta-right .btn-outline { width:100%; justify-content:center; }
}

/* ── Small mobile (≤ 480px) ── */
@media (max-width:480px) {
  :root { --nav-h: 60px; }

  /* Nav */
  .nav-logo-main { font-size:17px; }
  .nav-logo-sub { display:none; }
  .nav-btn { display:none; }

  /* Hero */
  .hero-eyebrow { font-size:10px; letter-spacing:2px; gap:7px; }
  .hero-photo-wrap { height:clamp(240px,65vw,380px); margin-top:24px; }
  .photo-badge { right:4px; bottom:10px; padding:8px 10px; }
  .photo-badge-val { font-size:18px; }
  .photo-badge-label { font-size:9px; }

  /* Ticker smaller */
  .ticker-item { padding:0 18px; font-size:11px; }

  /* Services */
  .svc-card { padding:18px 16px; }

  /* Why grid */
  .why-icon { width:38px; height:38px; font-size:16px; }

  /* Perf chart */
  .bar-pct { font-size:9px; }

  /* Modal */
  .reg-modal { padding:24px 18px; border-radius:16px; }
  .reg-wa-btn { font-size:14px; padding:13px 18px; }

  /* Offer bar compact */
  .offer-price { font-size:13px; }
  .offer-timer { gap:3px; }
  .offer-btn { font-size:12px; padding:0 14px; height:36px; }

  /* Register strip */
  .reg-strip { padding:36px 16px; gap:16px; }
  .reg-strip-h { font-size:clamp(22px,6vw,32px); }

  /* Numbers */
  .num-val { font-size:clamp(28px,8vw,40px); }
  .num-label { font-size:10px; }
}

/* ── Extra small (≤ 380px) ── */
@media (max-width:380px) {
  .tsr-h1 { font-size:clamp(32px,9vw,44px); }
  .hero-btns .btn-register { font-size:13px; padding:13px 20px; width:100%; justify-content:center; }
  .trust-row { gap:8px; }
  .trust-badge span { display:none; }
  .trust-badge { gap:5px; }
  .offer-timer .timer-label { display:none; }
  .numbers-bar { grid-template-columns:1fr 1fr; }
}

@media (prefers-reduced-motion:reduce) {
  *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; }
}
`;

/* ═══════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════ */
const TICKER_ITEMS = [
  { name: "NIFTY 50",   val: "22,508.75", chg: "+1.23%", up: true },
  { name: "SENSEX",     val: "74,119.39", chg: "+0.87%", up: true },
  { name: "BANKNIFTY",  val: "48,290.10", chg: "-0.41%", up: false },
  { name: "RELIANCE",   val: "2,891.50",  chg: "+2.10%", up: true },
  { name: "TCS",        val: "4,022.30",  chg: "-0.55%", up: false },
  { name: "HDFC BANK",  val: "1,649.80",  chg: "+1.67%", up: true },
  { name: "INFOSYS",    val: "1,782.45",  chg: "+0.92%", up: true },
  { name: "WIPRO",      val: "448.90",    chg: "-1.02%", up: false },
  { name: "TATASTEEL",  val: "162.35",    chg: "+3.20%", up: true },
  { name: "MARUTI",     val: "12,140.00", chg: "+0.43%", up: true },
  { name: "BAJFINANCE", val: "6,842.55",  chg: "+1.88%", up: true },
  { name: "ITC",        val: "437.20",    chg: "-0.33%", up: false },
];

const SERVICES = [
  { num:"01", icon:"📈", title:"Equity Research & Analysis",    desc:"Fundamental and technical analysis of NSE/BSE listed stocks. Data-driven research reports to help you make informed decisions. Investments are subject to market risk.", tag:"Stocks · NSE/BSE" },
  { num:"02", icon:"⚡", title:"Intraday & Positional Research", desc:"Daily research-based analysis with entry, exit and stop-loss levels. These are research recommendations only — no profit is guaranteed.", tag:"Research Only · No Guarantee" },
  { num:"03", icon:"💼", title:"Portfolio Review & Advisory",   desc:"Portfolio analysis based on your stated risk profile. Research-based allocation guidance — all investment decisions remain with the investor.", tag:"Advisory · Risk-Managed" },
  { num:"04", icon:"🎯", title:"F&O Research Advisory",         desc:"Research-based analysis for Futures & Options segments. F&O carries very high risk and is suitable only for experienced investors.", tag:"High Risk · Research Only" },
  { num:"05", icon:"🔬", title:"Market Research Reports",       desc:"Sector reports, earnings analysis and quarterly outlooks. Objective market research to support well-informed investment decisions.", tag:"Sector Reports · Earnings" },
  { num:"06", icon:"🔭", title:"Long-term Stock Research",      desc:"Deep fundamental research on value stocks. Past research activity does not guarantee future performance. Investments are subject to market risk.", tag:"Long-term · Fundamental" },
];

const WHY_ITEMS = [
  { icon:"🏛", title:"SEBI Registered Research Analyst",   desc:"Registration No. INH000020129. We operate under SEBI guidelines. SEBI registration does not guarantee performance or returns." },
  { icon:"🧠", title:"Research-Based Analysis",            desc:"Written research reports based on fundamental and technical analysis. These are recommendations only — the final investment decision is always yours." },
  { icon:"🎯", title:"Risk-Profile Based Guidance",        desc:"Research guidance aligned to your stated risk tolerance. Investments in securities are subject to market risks." },
  { icon:"📄", title:"Transparent & Documented",           desc:"All recommendations are provided in written format, compliant with SEBI disclosure norms. No verbal-only advice." },
];

const BARS = [
  { pct:"FY21", h:"35%",  yr:"FY21", proj:false },
  { pct:"FY22", h:"52%",  yr:"FY22", proj:false },
  { pct:"FY23", h:"68%",  yr:"FY23", proj:false },
  { pct:"FY24", h:"100%", yr:"FY24", proj:false },
  { pct:"FY25*",h:"82%",  yr:"FY25*",proj:true  },
];

const TESTIMONIALS = [
  { stars:"★★★★★", text:'"The research reports are detailed and well-structured. The analysis is easy to understand and helpful when evaluating investment options."', name:"Rahul Sharma", loc:"Madhya Pradesh", av:"R", bg:"linear-gradient(135deg,#00C2A8,#00E5CC)", note:"Individual experience. Investment results vary. Investments are subject to market risk." },
  { stars:"★★★★★", text:'"Being SEBI registered, their approach is professional and transparent. All recommendations are provided in written, documented format."', name:"Priya Verma",  loc:"Bhopal, Madhya Pradesh",  av:"P", bg:"linear-gradient(135deg,#F0A500,#F5C842)", note:"Individual experience. Past research quality does not guarantee future accuracy." },
  { stars:"★★★★★", text:'"The research methodology is clear — both fundamental and technical aspects are covered. Risk warnings are explicitly mentioned in the F&O section."', name:"Amit Joshi",   loc:"Madhya Pradesh",  av:"A", bg:"linear-gradient(135deg,#6366F1,#8B5CF6)", note:"Individual experience. Investments are subject to market risks." },
];

/* ═══════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal,.reveal-left,.reveal-right,.reveal-scale");
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useNavScroll() {
  useEffect(() => {
    const nav = document.getElementById("tsrNav");
    const handler = () => nav?.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
}

function useBarAnimation() {
  const ref = useRef(null);
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimated(true); obs.disconnect(); } }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, animated };
}

function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        let start = null;
        const step = (ts) => {
          if (!start) start = ts;
          const prog = Math.min((ts - start) / duration, 1);
          const ease = 1 - Math.pow(1 - prog, 3);
          setVal(Math.floor(ease * target));
          if (prog < 1) requestAnimationFrame(step);
          else setVal(target);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);
  return { val, ref };
}

/* ═══════════════════════════════════════════════
   SUB-COMPONENTS
═══════════════════════════════════════════════ */
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="tsr-ticker">
      <div className="ticker-track">
        {items.map((t, i) => (
          <span className="ticker-item" key={i}>
            <span className="t-name">{t.name}</span>&nbsp;
            <span className="t-val">{t.val}</span>&nbsp;
            <span className={t.up ? "t-up" : "t-dn"}>{t.up ? "▲" : "▼"} {t.chg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function CounterNum({ target }) {
  const { val, ref } = useCounter(target);
  return (
    <div className="num-val" ref={ref}>
      {target === 82 ? `${val}%` : target === 10 ? `${val}+` : `${val.toLocaleString()}+`}
    </div>
  );
}

function NumbersBar() {
  return (
    <div className="numbers-bar">
      {[
        { target: 5000, label: "Registered Users" },
        { target: 10,   label: "Years in Market" },
        { target: 500,  label: "Research Reports" },
      ].map((n, i) => (
        <div className={`num-block reveal d${i + 1}`} key={i}>
          <CounterNum target={n.target} />
          <div className="num-label">{n.label}</div>
        </div>
      ))}
      <div className="num-block reveal d4">
        <div className="num-val" style={{ fontSize: "clamp(24px,3.5vw,40px)" }}>SEBI</div>
        <div className="num-label">Registered & Regulated</div>
      </div>
    </div>
  );
}

function BarChart() {
  const { ref, animated } = useBarAnimation();
  return (
    <div className="perf-card" ref={ref}>
      <div className="perf-title">Research Coverage — Year-wise Activity</div>
      <div className="bars-wrap">
        {BARS.map((b, i) => (
          <div className="bar-col" key={i}>
            <div className="bar-pct" style={b.proj ? { color: "rgba(0,194,168,0.6)" } : {}}>{b.pct}</div>
            <div
              className={`bar-fill${b.proj ? " projected" : ""}`}
              style={{ height: animated ? b.h : "0%", transitionDelay: `${i * 0.1}s` }}
            />
            <div className="bar-yr" style={b.proj ? { opacity: 0.5 } : {}}>{b.yr}</div>
          </div>
        ))}
      </div>
      <p className="perf-footnote">*FY25 ongoing. Past research activity is not indicative of future performance. Investments are subject to market risks.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REGISTER MODAL COMPONENT
═══════════════════════════════════════════════ */
function RegisterModal({ open, onClose }) {
  const [form, setForm] = useState({ name:"", mobile:"", email:"" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  useEffect(() => {
    if (open) { setForm({ name:"", mobile:"", email:"" }); setErrors({}); setSuccess(false); setApiError(""); }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^[6-9]\d{9}$/.test(form.mobile.trim())) e.mobile = "Enter a valid 10-digit mobile number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Enter a valid email address";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    setApiError("");
    try {
      const res = await fetch("https://tsresearch.in/ads-registration/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), mobileNumber: form.mobile.trim(), email: form.email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || `Server error (${res.status})`);
      }
      setSuccess(true);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`reg-overlay${open ? " open" : ""}`} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="reg-modal" role="dialog" aria-modal="true" aria-label="Register Form">
        <button className="reg-modal-close" onClick={onClose} aria-label="Close">✕</button>
        {!success ? (
          <>
            <div className="reg-modal-badge">📋 Free Registration</div>
            <h2 className="reg-modal-h">Register with<br /><span>Trillion Stock Research</span></h2>
            <p className="reg-modal-sub">SEBI Reg. No: INH000020129. Access research reports and market analysis. Investments are subject to market risks — please read all documents carefully before investing.</p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="reg-field">
                <label htmlFor="reg-name">Full Name</label>
                <input id="reg-name" type="text" placeholder="e.g. Rahul Sharma" value={form.name} onChange={e => setForm(f => ({...f, name:e.target.value}))} className={errors.name ? "error" : ""} />
                {errors.name && <span className="field-err">{errors.name}</span>}
              </div>
              <div className="reg-field">
                <label htmlFor="reg-mobile">Mobile Number</label>
                <input id="reg-mobile" type="tel" placeholder="e.g. 9876543210" maxLength={10} value={form.mobile} onChange={e => setForm(f => ({...f, mobile:e.target.value.replace(/\D/,"")}))} className={errors.mobile ? "error" : ""} />
                {errors.mobile && <span className="field-err">{errors.mobile}</span>}
              </div>
              <div className="reg-field">
                <label htmlFor="reg-email">Email Address</label>
                <input id="reg-email" type="email" placeholder="e.g. rahul@gmail.com" value={form.email} onChange={e => setForm(f => ({...f, email:e.target.value}))} className={errors.email ? "error" : ""} />
                {errors.email && <span className="field-err">{errors.email}</span>}
              </div>
              {apiError && (
                <div className="reg-api-error">⚠ {apiError}</div>
              )}
              <button type="submit" className="reg-submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Register Now — It's FREE →"}
              </button>
            </form>
            <div className="reg-modal-perks">
              {[["",""],["✓","SEBI Reg. INH000020129"],["✓","Written Research Reports"],["⚠","Market Risk Applies"]].map(([icon,text]) => (
                <div className="reg-modal-perk" key={text}><span>{icon}</span>{text}</div>
              ))}
            </div>
            <p style={{fontSize:"10px",color:"var(--grey2)",marginTop:"12px",lineHeight:"1.6"}}>By registering, you acknowledge that investments are subject to market risks. Research reports are for informational purposes only and do not constitute investment advice.</p>
          </>
        ) : (
          <div className="reg-success">
            <div className="reg-success-confetti">🎉</div>
            <div className="reg-success-congrats">🏆 Congratulations!</div>
            <h2 className="reg-success-h">Welcome, <span>{form.name.split(" ")[0]}</span>!<br />You're All Set.</h2>
            <p className="reg-success-sub">
              Registration confirmed. Join our WhatsApp group for <strong>research updates &amp; market analysis</strong> from our SEBI-registered analysts (Reg. No: INH000020129). Investments are subject to market risks.
            </p>
            <div className="reg-success-divider" />
            <div className="reg-wa-label">Next Step — Join the Community</div>
            <a
              href="https://wa.me/919669892312?text=Hi%2C%20I%20have%20registered%20on%20Trillion%20Stock%20Research%20(SEBI%20Reg.%20INH000020129).%20Please%20share%20research%20updates."
              className="reg-wa-btn"
              target="_blank"
              rel="noreferrer"
            >
              <span className="reg-wa-icon">💬</span>
              <div className="reg-wa-text">
                <span className="reg-wa-text-main">Join WhatsApp Group Now</span>
                <span className="reg-wa-text-sub">Research Reports · Market Analysis · SEBI Compliant</span>
              </div>
            </a>
            <p className="reg-wa-note">📲 Tap above to open WhatsApp · +91 96698 92312</p>
            <button className="reg-success-close" onClick={onClose}>Skip for now</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60);

  const openModal = (e) => { e?.preventDefault(); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  useScrollReveal();
  useNavScroll();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const id = "tsr-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = (menuOpen || modalOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, modalOpen]);

  const closeMenu = () => setMenuOpen(false);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  return (
    <>
      {/* ── NAV ── */}
      <nav className="tsr-nav" id="tsrNav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-main">Trillion <span>Stock</span> Research</div>
          <div className="nav-logo-sub">SEBI Reg. INH000020129 · BSE Enlistment: 6528</div>
        </a>
        <ul className="nav-links">
          {["Services","About","Reviews","Contact"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <span className="nav-sebi">✓ SEBI Reg. INH000020129</span>
          <a href="#" className="nav-btn nav-btn-register" onClick={openModal}>Register Now →</a>
        </div>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        {["services","about","reviews","contact"].map(h => (
          <a href={`#${h}`} key={h} onClick={closeMenu} style={{ textTransform:"capitalize" }}>{h}</a>
        ))}
        <a
          href="#"
          className="mob-cta"
          onClick={(e) => { closeMenu(); openModal(e); }}
          style={{ background:"#2563EB", borderRadius:"999px" }}
        >
          Register Now — FREE →
        </a>
      </div>

      {/* ── HERO ── */}
      <section className="tsr-hero">
        <div className="hero-bg-ring ring1" />
        <div className="hero-bg-ring ring2" />
        <div className="hero-bg-ring ring3" />
        <div className="hero-glow-a" />
        <div className="hero-glow-b" />
        <div className="hero-grid-bg" />

        <div className="hero-inner">
          {/* LEFT — Text */}
          <div className="hero-text-col">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              SEBI Registered Financial Advisory
            </div>
            <h1 className="tsr-h1">
              Trillion Stock<br />
              <span className="h1-accent">Research</span>
              <span className="h1-italic"> — Research. Invest.</span>
            </h1>
            <p className="hero-desc">
              A SEBI-registered research analyst firm providing research-based analysis for equity, F&amp;O and portfolio segments. Investments are subject to market risks.
            </p>
            <div className="hero-btns">
              <button className="btn-register" onClick={openModal}>🔓 Register Now — It's FREE →</button>
              <a href="#services" className="btn-outline">View Services</a>
            </div>
            <div className="sebi-chip">
              <span className="sebi-chip-dot" />
              <span className="sebi-chip-text">SEBI Registered</span>
              <span className="sebi-chip-num">INH000020129</span>
            </div>
            <p className="hero-register-note">⚠ Investments are subject to market risks. Read all documents carefully.</p>
            <div className="trust-row">
              <div className="trust-badge">
                <div className="trust-icon"><img src="/sebi-small.png" alt="SEBI" /></div>
                <span>SEBI Registered</span>
              </div>
              <div className="trust-badge">
                <div className="trust-icon"><img src="/bselogo.png" alt="BSE" /></div>
                <span>BSE Enlisted</span>
              </div>
              <div className="trust-badge">
                <div className="trust-icon" style={{width:"28px"}}><img src="/iso.png" alt="ISO" /></div>
                <span>ISO Certified</span>
              </div>
              <div className="trust-badge">
                <div className="trust-icon" style={{background:"var(--teal-faint)",border:"1px solid rgba(0,194,168,.2)",fontSize:"16px",width:"28px"}}>🛡</div>
                <span>Transparent</span>
              </div>
            </div>
          </div>

          {/* RIGHT — Photo */}
          <div className="hero-photo-col">
            <div className="hero-photo-wrap">
              <div className="hero-photo-glow" />
              <div className="hero-photo-ring" />
              <img
                className="hero-photo-img"
                src={"/trillions.png"}
                alt="Trillion Stock Research Expert"
              />
              <div className="hero-photo-frame" />
              <div className="photo-badge">
                <img src="/sebi-small.png" alt="SEBI" style={{height:"28px",width:"auto",objectFit:"contain",display:"block",marginBottom:"4px",background:"#fff",borderRadius:"4px",padding:"2px 4px"}} />
                <div className="photo-badge-label">Reg. No: INH000020129</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <Ticker />

      {/* ── NUMBERS ── */}
      <NumbersBar />

      {/* ── SERVICES ── */}
      <section id="services" className="tsr-section services-bg">
        <div className="services-header">
          <div className="reveal">
            <div className="section-eyebrow">What We Offer</div>
            <h2 className="section-h">Our Research.<br />Our Services.</h2>
          </div>
          <a href="https://www.trillionstockresearch.com" className="btn-outline reveal" target="_blank" rel="noreferrer">All Services ↗</a>
        </div>
        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <div className={`svc-card reveal d${i + 1}`} key={s.num}>
              <div className="svc-num">{s.num}</div>
              <span className="svc-icon">{s.icon}</span>
              <div className="svc-title">{s.title}</div>
              <p className="svc-desc">{s.desc}</p>
              <span className="svc-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY US ── */}
      <section id="about" className="tsr-section why-bg">
        <div className="why-grid">
          <div className="reveal-left">
            <div className="section-eyebrow">Why Trillion Stock Research</div>
            <h2 className="section-h">Why Choose<br />Trillion Stock Research</h2>
            <p className="section-sub">We provide research, transparency and accountability — not just recommendations. SEBI registered and fully compliant with all applicable regulations.</p>
            <div className="why-list">
              {WHY_ITEMS.map((w, i) => (
                <div className={`why-item reveal d${i + 1}`} key={w.title}>
                  <div className="why-icon">{w.icon}</div>
                  <div>
                    <div className="why-text-title">{w.title}</div>
                    <div className="why-text-desc">{w.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="reveal-right">
            <BarChart />
            <div className="disclaimer-box" style={{ marginTop: 18 }}>
              <p><strong style={{ color: "var(--teal)" }}>⚠ Important:</strong> Investment in securities market is subject to market risks. Read all related documents carefully. SEBI Reg. No: <strong style={{ color: "var(--teal)" }}>INH000020129</strong></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="reviews" className="tsr-section testi-bg">
        <div className="reveal">
          <div className="section-eyebrow">Client Voices</div>
          <h2 className="section-h">What Our<br />Clients Say</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className={`testi-card reveal d${i + 1}`} key={t.name}>
              <div className="testi-stars">{t.stars}</div>
              <p className="testi-text">{t.text}</p>
              <div className="testi-author">
                <div className="testi-av" style={{ background: t.bg }}>{t.av}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-loc">{t.loc}</div>
                </div>
              </div>
              <p className="testi-disclaimer">{t.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── REGISTER STRIP ── */}
      <section className="reg-strip">
        <div className="reg-strip-badge">📋 Free Registration Open</div>
        <h2 className="reg-strip-h reveal">Register Today.<br /><span>Access Research Reports.</span></h2>
        <p className="reg-strip-sub reveal">Access research reports from a SEBI-registered research analyst platform. Research-based stock analysis, portfolio review guidance and market reports. Investments are subject to market risks.</p>
        <div className="reg-strip-perks reveal">
          {[["✓",""],["✓","SEBI Reg. INH000020129"],["✓","Written Research Reports"],["✓","Risk Disclosures Included"]].map(([icon,text]) => (
            <div className="reg-strip-perk" key={text}><span>{icon}</span>{text}</div>
          ))}
        </div>
        <button className="btn-register reveal" onClick={openModal}>Register Now — Free →</button>
        <p className="hero-register-note">⚠ Investments are subject to market risks. Read all documents carefully before investing.</p>
      </section>

      {/* ── CTA BAND ── */}
      <section id="contact" className="cta-band">
        <div className="reveal-left">
          <div className="cta-h">Register Today<br /><span>& Access Research</span></div>
          <p className="cta-p">Sign up for free and access research-backed reports and market analysis directly from our SEBI-registered research analysts.</p>
        </div>
        <div className="cta-right reveal-right">
          <button className="btn-register" onClick={openModal}>Register Now — It's FREE →</button>
          <a href="https://www.trillionstockresearch.com" className="btn-outline" target="_blank" rel="noreferrer">Visit Website</a>
          <p className="cta-note">SEBI Reg. No: INH000020129</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tsr-footer">
        <div className="footer-top">
          <div className="reveal">
            <div className="footer-logo-main">Trillion <span>Stock</span> Research</div>
            <div className="footer-logo-sub">SEBI Registered Research Analyst</div>
            <p className="footer-about">SEBI-registered research analyst firm providing market research, investment analysis and research-backed advisory services for investors.</p>
            <div className="footer-reg"><span style={{background:"#fff",borderRadius:"4px",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/sebi-small.png" alt="SEBI" style={{height:"13px",width:"auto",objectFit:"contain",display:"block"}} /></span>&nbsp; SEBI Reg. No: INH000020129</div>
            <div className="footer-reg" style={{marginTop:"6px"}}><span style={{background:"#fff",borderRadius:"4px",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/bselogo.png" alt="BSE" style={{height:"13px",width:"auto",objectFit:"contain",display:"block"}} /></span>&nbsp; BSE Enlistment No: 6528</div>
            <div className="footer-reg" style={{marginTop:"6px",fontSize:"10px",letterSpacing:"0.3px"}}><span style={{background:"#fff",borderRadius:"4px",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/bselogo.png" alt="BSE" style={{height:"12px",width:"auto",objectFit:"contain",display:"block"}} /></span>&nbsp; Ad Approval: BSE/RA/ADVT/05012026-6528/03</div>
            <div className="footer-reg" style={{marginTop:"6px",background:"rgba(255,193,7,.08)",borderColor:"rgba(255,193,7,.3)",color:"#F0A500"}}><span style={{background:"#fff",borderRadius:"4px",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/iso.png" alt="ISO" style={{height:"14px",width:"auto",objectFit:"contain",display:"block"}} /></span>&nbsp; ISO 9001:2015 Certified</div>
          </div>
          <div className="footer-col reveal d1">
            <div className="footer-col-title">Services</div>
            {["Equity Research","Intraday Calls","Portfolio Advisory","F&O Advisory","Multibagger Research"].map(s => (
              <a key={s} href="https://www.trillionstockresearch.com" target="_blank" rel="noreferrer">{s}</a>
            ))}
          </div>
          <div className="footer-col reveal d2">
            <div className="footer-col-title">Company</div>
            {["About Us","Research Reports","Blog","Careers"].map(s => (
              <a key={s} href="https://www.trillionstockresearch.com" target="_blank" rel="noreferrer">{s}</a>
            ))}
          </div>
          <div className="footer-col reveal d3">
            <div className="footer-col-title">Contact & Social</div>
            <a href="https://www.trillionstockresearch.com" target="_blank" rel="noreferrer">trillionstockresearch.com</a>
            <a href="mailto:info@trillionstockresearch.com">info@trillionstockresearch.com</a>
            <a href="#">Madhya Pradesh, India</a>
            <a href="https://www.instagram.com/trillions_stock_research_?igsh=Y3NmandlNGdwdTM%3D&utm_source=qr" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:"7px",color:"#E1306C"}}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#E1306C"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/share/15hBBmFbGTV/?mibextid=wwXIfr" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:"7px",color:"#1877F2"}}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
          </div>
        </div>
        <div className="footer-disclaimer reveal">
          <div className="disc-title">⚠ Important Disclaimer</div>
          Investments in securities market are subject to market risks. Read all related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. The information and research reports provided by Trillion Stock Research are for educational and informational purposes only and do not constitute investment advice. Past research or analysis does not guarantee future performance. Investors should make their own informed decisions and consult a qualified financial advisor before investing.
          <br /><br />
          <strong>Trillion Stock Research — SEBI Registered Research Analyst | Reg. No: INH000020129 | BSE Enlistment No: 6528 | Advertisement Approval No: BSE/RA/ADVT/05012026-6528/03.</strong>
          <div className="footer-cert-row">
            <div className="footer-cert-badge">
              <span className="cert-icon"><img src="/sebi-small.png" alt="SEBI" /></span>
              <div><strong>SEBI Registered</strong>Reg. No: INH000020129</div>
            </div>
            <div className="footer-cert-badge">
              <span className="cert-icon"><img src="/bselogo.png" alt="BSE" /></span>
              <div><strong>BSE Enlisted</strong>Enlistment No: 6528</div>
            </div>
            <div className="footer-cert-badge">
              <span className="cert-icon"><img src="/bselogo.png" alt="BSE" /></span>
              <div><strong>Ad Approved</strong>BSE/RA/ADVT/05012026-6528/03</div>
            </div>
            <div className="footer-cert-badge">
              <span className="cert-icon"><img src="/iso.png" alt="ISO 9001:2015" /></span>
              <div><strong>ISO Certified</strong>ISO 9001:2015</div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 Trillion Stock Research. All rights reserved.</p>
          <div className="footer-social">
            <a href="https://www.instagram.com/trillions_stock_research_?igsh=Y3NmandlNGdwdTM%3D&utm_source=qr" className="footer-social-link insta" target="_blank" rel="noreferrer">
              <span className="social-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></span>
              Instagram
            </a>
            <a href="https://www.facebook.com/share/15hBBmFbGTV/?mibextid=wwXIfr" className="footer-social-link fb" target="_blank" rel="noreferrer">
              <span className="social-icon"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></span>
              Facebook
            </a>
          </div>
        </div>
      </footer>

      {/* ── OFFER STICKY BAR ── */}
      <div className="offer-bar-wrap">
        <div className="offer-bar">
          <div className="offer-bar-left">
            <div className="offer-price">🔓 Free Registration</div>
            <div className="offer-timer">
              <span className="timer-label">✓ SEBI Reg. INH000020129 · BSE: 6528</span>
            </div>
          </div>
          <div className="offer-bar-mid">
            ⚠ Investments are subject to market risks. Read all documents carefully.
          </div>
          <button className="offer-btn" onClick={openModal}>
            Register Now →
          </button>
        </div>
      </div>

      <RegisterModal open={modalOpen} onClose={closeModal} />
    </>
  );
}