import { useEffect, useRef, useState } from "react";

// Put your photo at src/assets/images/trillions.jpg then use: import heroImage from "../assets/images/trillions.jpg";


/* ═══════════════════════════════════════════════
   STYLES — injected once into <head>
   
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

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

html { scroll-behavior: smooth; }

body {
  background: var(--ink);
  color: var(--white);
  font-family: 'Outfit', sans-serif;
  overflow-x: hidden;
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
.nav-logo { display:flex; flex-direction:column; line-height:1; text-decoration:none; }
.nav-logo-main { font-family:'Cormorant Garamond',serif; font-size:clamp(16px,2.2vw,21px); font-weight:700; color:var(--white); }
.nav-logo-main span { color:var(--teal); }
.nav-logo-sub { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--grey); margin-top:3px; }
.nav-links { display:flex; gap:clamp(20px,3vw,40px); list-style:none; }
.nav-links a { font-size:13px; font-weight:500; color:var(--grey); text-decoration:none; transition:color .2s; position:relative; }
.nav-links a::after { content:''; position:absolute; bottom:-4px; left:0; right:0; height:1px; background:var(--teal); transform:scaleX(0); transform-origin:left; transition:transform .25s ease; }
.nav-links a:hover { color:var(--white); }
.nav-links a:hover::after { transform:scaleX(1); }
.nav-right { display:flex; align-items:center; gap:12px; }
.nav-sebi { font-size:10px; letter-spacing:1px; text-transform:uppercase; color:var(--teal); border:1px solid rgba(0,194,168,.3); padding:5px 12px; border-radius:20px; background:var(--teal-faint); white-space:nowrap; }
.nav-btn { font-size:13px; font-weight:600; color:var(--ink); background:var(--teal); padding:9px 20px; border-radius:6px; text-decoration:none; transition:all .2s; white-space:nowrap; display:inline-block; }
.nav-btn:hover { background:#00D9BB; box-shadow:0 0 22px rgba(0,194,168,.4); transform:translateY(-1px); }

/* Hamburger */
.hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; background:none; border:none; padding:6px; z-index:201; }
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
.eyebrow-dot { width:7px;height:7px;border-radius:50%;background:var(--teal);animation:blink 2s ease-in-out infinite; }
@keyframes blink{0%,100%{opacity:1;}50%{opacity:.3;}}

.tsr-h1 { font-family:'Cormorant Garamond',serif; font-size:clamp(42px,6vw,80px); font-weight:700; line-height:1.04; letter-spacing:-.5px; margin-bottom:24px; animation:heroUp .8s .2s ease both; }
.h1-accent { display:block; background:linear-gradient(90deg,var(--teal),var(--teal-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.h1-italic { font-style:italic; color:rgba(240,244,250,.45); font-weight:400; }

.hero-desc { font-size:clamp(15px,1.6vw,17px); color:var(--grey); line-height:1.8; max-width:500px; margin-bottom:36px; font-weight:300; animation:heroUp .8s .3s ease both; }

.hero-btns { display:flex; gap:12px; flex-wrap:wrap; animation:heroUp .8s .4s ease both; }
.btn-primary { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:600; color:var(--ink); background:linear-gradient(135deg,var(--teal),var(--teal-light)); padding:14px clamp(20px,3vw,32px); border-radius:8px; text-decoration:none; transition:all .25s; box-shadow:0 4px 28px rgba(0,194,168,.35); white-space:nowrap; cursor:pointer; border:none; font-family:'Outfit',sans-serif; }
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 40px rgba(0,194,168,.5); }
.btn-outline { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:500; color:var(--teal); background:transparent; border:1px solid rgba(0,194,168,.35); padding:14px clamp(20px,3vw,32px); border-radius:8px; text-decoration:none; transition:all .25s; white-space:nowrap; cursor:pointer; font-family:'Outfit',sans-serif; }
.btn-outline:hover { background:var(--teal-faint); border-color:var(--teal); }

.trust-row { display:flex; gap:clamp(12px,2vw,24px); flex-wrap:wrap; margin-top:40px; padding-top:28px; border-top:1px solid rgba(255,255,255,.06); animation:heroUp .8s .5s ease both; }
.trust-badge { display:flex; align-items:center; gap:8px; font-size:12px; color:var(--grey); }
.trust-icon { width:28px;height:28px;border-radius:6px;background:var(--teal-faint);border:1px solid rgba(0,194,168,.2);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0; }

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
.numbers-bar { background:var(--ink2); border-bottom:1px solid rgba(0,194,168,.07); display:grid; grid-template-columns:repeat(4,1fr); }
.num-block { padding:clamp(28px,4vw,48px) 0; text-align:center; border-right:1px solid rgba(0,194,168,.07); transition:background .2s; cursor:default; }
.num-block:last-child { border-right:none; }
.num-block:hover { background:var(--teal-faint); }
.num-val { font-family:'Cormorant Garamond',serif; font-size:clamp(36px,5vw,52px); font-weight:700; line-height:1; background:linear-gradient(135deg,var(--teal),var(--teal-light)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
.num-label { font-size:clamp(11px,1.2vw,13px); color:var(--grey); margin-top:6px; }

/* ── SECTION COMMONS ── */
.tsr-section { padding:clamp(60px,8vw,100px) clamp(16px,5vw,60px); }
.section-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; letter-spacing:3px; text-transform:uppercase; color:var(--teal); margin-bottom:14px; }
.section-eyebrow::before { content:''; width:18px; height:1px; background:var(--teal); }
.section-h { font-family:'Cormorant Garamond',serif; font-size:clamp(30px,4vw,52px); font-weight:700; line-height:1.1; margin-bottom:14px; }
.section-sub { font-size:clamp(14px,1.5vw,16px); color:var(--grey); line-height:1.8; font-weight:300; max-width:500px; }

/* ── SERVICES ── */
.services-bg { background:var(--ink); }
.services-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:clamp(36px,5vw,56px); gap:20px; flex-wrap:wrap; }
.services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; background:rgba(0,194,168,.05); border:1px solid rgba(0,194,168,.05); border-radius:16px; overflow:hidden; }
.svc-card { background:var(--ink2); padding:clamp(24px,3vw,36px) clamp(20px,2.5vw,30px); transition:background .3s,transform .3s; position:relative; overflow:hidden; }
.svc-card::before { content:''; position:absolute; top:0;left:0;right:0;height:2px; background:linear-gradient(90deg,transparent,var(--teal),transparent); transform:scaleX(0); transition:transform .4s ease; }
.svc-card::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,var(--teal-faint),transparent); opacity:0; transition:opacity .3s; }
.svc-card:hover { background:var(--ink3); }
.svc-card:hover::before { transform:scaleX(1); }
.svc-card:hover::after { opacity:1; }
.svc-num { font-family:'Cormorant Garamond',serif; font-size:12px; font-weight:600; color:rgba(0,194,168,.35); letter-spacing:2px; margin-bottom:16px; }
.svc-icon { font-size:26px; margin-bottom:16px; display:block; position:relative; z-index:1; }
.svc-title { font-size:clamp(15px,1.6vw,17px); font-weight:600; margin-bottom:10px; color:var(--white); position:relative; z-index:1; }
.svc-desc { font-size:clamp(13px,1.2vw,14px); color:var(--grey); line-height:1.7; font-weight:300; position:relative; z-index:1; }
.svc-tag { display:inline-block; margin-top:16px; font-size:11px; font-weight:500; color:var(--teal); background:var(--teal-faint); border:1px solid rgba(0,194,168,.2); padding:3px 10px; border-radius:20px; position:relative; z-index:1; }

/* ── WHY US ── */
.why-bg { background:var(--ink2); border-top:1px solid rgba(0,194,168,.06); }
.why-grid { display:grid; grid-template-columns:1fr 1fr; gap:clamp(40px,6vw,80px); align-items:center; }
.why-list { margin-top:clamp(24px,3vw,40px); }
.why-item { display:flex; gap:16px; padding:clamp(16px,2vw,24px) 0; border-bottom:1px solid rgba(255,255,255,.04); align-items:flex-start; transition:all .2s; }
.why-item:hover .why-icon { background:var(--teal); border-color:var(--teal); }
.why-item:hover .why-icon-inner { filter:brightness(0) invert(1); }
.why-icon { width:44px;height:44px;border-radius:10px;background:var(--teal-faint);border:1px solid rgba(0,194,168,.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;transition:all .2s; }
.why-text-title { font-size:clamp(14px,1.5vw,15px); font-weight:600; margin-bottom:4px; }
.why-text-desc { font-size:clamp(12px,1.2vw,13px); color:var(--grey); line-height:1.65; font-weight:300; }

.perf-card { background:var(--ink3); border:1px solid rgba(0,194,168,.12); border-radius:18px; padding:clamp(20px,3vw,32px); box-shadow:0 20px 60px rgba(0,0,0,.4); }
.perf-title { font-size:12px; color:var(--grey); letter-spacing:1px; text-transform:uppercase; margin-bottom:20px; }
.bars-wrap { display:flex; align-items:flex-end; gap:10px; height:clamp(120px,15vw,160px); margin-bottom:18px; }
.bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:5px; height:100%; justify-content:flex-end; }
.bar-fill { width:100%; border-radius:6px 6px 0 0; background:linear-gradient(to top,rgba(0,194,168,.5),var(--teal)); cursor:pointer; transition:filter .2s,height .8s cubic-bezier(.22,1,.36,1); }
.bar-fill:hover { filter:brightness(1.3); }
.bar-fill.projected { background:linear-gradient(to top,rgba(0,194,168,.2),rgba(0,194,168,.4)); border:1px dashed rgba(0,194,168,.4); }
.bar-pct { font-size:10px; font-weight:600; color:var(--teal); white-space:nowrap; }
.bar-yr  { font-size:9px; color:var(--grey); }
.perf-footnote { font-size:11px; color:var(--grey2); line-height:1.6; }
.disclaimer-box { margin-top:18px; background:rgba(0,194,168,.05); border:1px solid rgba(0,194,168,.15); border-radius:12px; padding:16px 18px; }
.disclaimer-box p { font-size:12px; color:var(--grey); line-height:1.7; }

/* ── TESTIMONIALS ── */
.testi-bg { background:var(--ink); }
.testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-top:clamp(36px,5vw,56px); }
.testi-card { background:var(--ink2); border:1px solid rgba(255,255,255,.05); border-radius:14px; padding:clamp(20px,3vw,28px); transition:border-color .25s,transform .3s,box-shadow .3s; }
.testi-card:hover { border-color:rgba(0,194,168,.3); transform:translateY(-6px); box-shadow:0 16px 48px rgba(0,0,0,.35); }
.testi-stars { color:var(--amber); font-size:13px; margin-bottom:14px; }
.testi-text { font-size:clamp(15px,1.6vw,17px); color:var(--grey); line-height:1.75; font-style:italic; font-family:'Cormorant Garamond',serif; }
.testi-author { margin-top:20px; display:flex; align-items:center; gap:12px; padding-top:16px; border-top:1px solid rgba(255,255,255,.05); }
.testi-av { width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:var(--ink); }
.testi-name { font-size:13px; font-weight:600; color:var(--white); }
.testi-loc  { font-size:11px; color:var(--grey); margin-top:1px; }

/* ── CTA BAND ── */
.cta-band { background:linear-gradient(135deg,rgba(0,194,168,.1) 0%,var(--ink2) 60%); border-top:1px solid rgba(0,194,168,.12); border-bottom:1px solid rgba(0,194,168,.12); padding:clamp(60px,8vw,100px) clamp(16px,5vw,60px); display:grid; grid-template-columns:1fr auto; gap:clamp(30px,5vw,60px); align-items:center; }
.cta-h { font-family:'Cormorant Garamond',serif; font-size:clamp(32px,4vw,56px); font-weight:700; line-height:1.1; margin-bottom:14px; }
.cta-h span { color:var(--teal); }
.cta-p { font-size:clamp(14px,1.5vw,16px); color:var(--grey); font-weight:300; }
.cta-right { display:flex; flex-direction:column; gap:12px; align-items:flex-end; }
.cta-note { font-size:11px; color:var(--grey); text-align:right; }

/* ── FOOTER ── */
.tsr-footer { background:var(--ink2); padding:clamp(40px,6vw,70px) clamp(16px,5vw,60px) clamp(20px,3vw,30px); border-top:1px solid rgba(255,255,255,.04); }
.footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:clamp(30px,4vw,60px); margin-bottom:40px; }
.footer-logo-main { font-family:'Cormorant Garamond',serif; font-size:clamp(18px,2vw,22px); font-weight:700; color:var(--white); }
.footer-logo-main span { color:var(--teal); }
.footer-logo-sub { font-size:9px; letter-spacing:3px; text-transform:uppercase; color:var(--grey); margin:3px 0 14px; }
.footer-about { font-size:13px; color:var(--grey); line-height:1.75; font-weight:300; }
.footer-reg { display:inline-flex; align-items:center; gap:6px; margin-top:14px; font-size:11px; color:var(--teal); background:var(--teal-faint); border:1px solid rgba(0,194,168,.25); padding:5px 12px; border-radius:20px; }
.footer-col-title { font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--teal); margin-bottom:18px; }
.footer-col a { display:block; font-size:13px; color:var(--grey); text-decoration:none; margin-bottom:11px; font-weight:300; transition:color .2s; }
.footer-col a:hover { color:var(--white); }
.footer-disclaimer { background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.05); border-radius:10px; padding:16px 20px; margin-bottom:28px; font-size:11px; color:var(--grey2); line-height:1.7; }
.footer-disclaimer strong { color:var(--grey); }
.footer-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:20px; border-top:1px solid rgba(255,255,255,.04); }
.footer-bottom p { font-size:12px; color:var(--grey2); }

/* ── WHATSAPP ── */
.wa-float { position:fixed; bottom:28px; right:28px; z-index:300; width:54px; height:54px; border-radius:50%; background:linear-gradient(135deg,#25D366,#128C7E); display:flex; align-items:center; justify-content:center; font-size:26px; text-decoration:none; box-shadow:0 6px 24px rgba(37,211,102,.5); animation:waBounce 2s ease-in-out infinite; transition:transform .2s,box-shadow .2s; }
.wa-float:hover { transform:scale(1.1) !important; box-shadow:0 8px 32px rgba(37,211,102,.7); animation:none; }
@keyframes waBounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
.wa-tooltip { position:absolute; right:64px; top:50%; transform:translateY(-50%); background:rgba(12,17,25,.95); color:var(--white); font-size:12px; white-space:nowrap; padding:6px 12px; border-radius:6px; opacity:0; pointer-events:none; transition:opacity .2s; border:1px solid rgba(0,194,168,.2); }
.wa-float:hover .wa-tooltip { opacity:1; }

/* ── RESPONSIVE ── */
@media (max-width:1100px) {
  .hero-inner { grid-template-columns:1fr 300px; gap:20px; }
  .hero-photo-wrap { height:clamp(380px,55vh,560px); }
  .footer-top { grid-template-columns:1fr 1fr; gap:36px; }
  .cta-band { grid-template-columns:1fr; }
  .cta-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; }
  .cta-note { text-align:left; width:100%; }
}
@media (max-width:900px) {
  .services-grid { grid-template-columns:1fr 1fr; }
  .testi-grid { grid-template-columns:1fr 1fr; }
  .numbers-bar { grid-template-columns:repeat(2,1fr); }
  .num-block:nth-child(2) { border-right:none; }
  .num-block:nth-child(3) { border-right:1px solid rgba(0,194,168,.07); border-top:1px solid rgba(0,194,168,.07); }
  .num-block:nth-child(4) { border-right:none; border-top:1px solid rgba(0,194,168,.07); }
  .nav-links,.nav-sebi { display:none; }
  .hamburger { display:flex; }
  .mobile-menu { display:flex; }
  .why-grid { grid-template-columns:1fr; gap:40px; }
}
@media (max-width:780px) {
  .hero-inner { grid-template-columns:1fr !important; grid-template-rows:auto auto; gap:0 !important; }
  .hero-text-col { grid-column:1; grid-row:1; }
  .hero-photo-col { grid-column:1; grid-row:2; }
  .hero-photo-wrap { display:flex !important; height:clamp(320px,75vw,480px); width:100%; margin-top:32px; justify-content:center; }
  .hero-photo-img { width:auto !important; max-width:100%; height:100%; }
  .photo-badge { right:8px; bottom:16px; }
  .hero-btns .btn-outline { display:none; }
}
@media (max-width:600px) {
  .services-grid { grid-template-columns:1fr; }
  .testi-grid { grid-template-columns:1fr; }
  .footer-top { grid-template-columns:1fr; gap:28px; }
  .wa-float { bottom:20px; right:20px; width:48px; height:48px; font-size:22px; }
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
  { num:"01", icon:"📈", title:"Equity Research & Analysis",   desc:"Fundamental aur technical analysis ke through best stocks identify karna. Long-term wealth creation ke liye data-driven recommendations.", tag:"Stocks · NSE/BSE" },
  { num:"02", icon:"⚡", title:"Intraday & Positional Calls",  desc:"Clear entry, exit aur stop-loss ke saath daily research-backed calls. Intraday traders ke liye precise guidance.", tag:"Daily Calls · Real-time" },
  { num:"03", icon:"💼", title:"Portfolio Advisory",           desc:"Aapke risk profile ke according customized portfolio. Diversification strategy ke through consistent, sustainable returns.", tag:"Personalized · Risk-managed" },
  { num:"04", icon:"🎯", title:"F&O Trading Advisory",         desc:"Futures & Options market mein expert navigation. Calculated risk ke saath options strategies jo profit maximize karein.", tag:"Futures · Options" },
  { num:"05", icon:"🔬", title:"Market Research Reports",      desc:"In-depth sector reports, earnings analysis aur quarterly outlook. Informed decisions ke liye comprehensive market intelligence.", tag:"Sector Reports · Earnings" },
  { num:"06", icon:"🏆", title:"Multibagger Stock Research",   desc:"Hidden value stocks jo long-term mein extraordinary returns de sakein. Deep research ke through early identification.", tag:"Long-term · High Returns" },
];

const WHY_ITEMS = [
  { icon:"🏛", title:"SEBI Registered & Fully Compliant",    desc:"INH000020129 ke saath fully regulated advisory. Aapki investments ke liye complete legal protection aur accountability." },
  { icon:"🧠", title:"Research-First Approach",              desc:"Koi tips nahi — sirf thorough fundamental + technical research pe based recommendations jo returns improve karein." },
  { icon:"🎯", title:"Personalized Investment Strategy",     desc:"Har investor alag hota hai. Aapke goals aur risk tolerance ke according customized plan — not a generic template." },
  { icon:"💬", title:"Dedicated Expert Support",             desc:"Market hours mein hamesha available expert team. Aapke har question ka timely, accurate jawab." },
];

const BARS = [
  { pct:"+18%", h:"35%",  yr:"FY21", proj:false },
  { pct:"+26%", h:"52%",  yr:"FY22", proj:false },
  { pct:"+31%", h:"68%",  yr:"FY23", proj:false },
  { pct:"+38%", h:"100%", yr:"FY24", proj:false },
  { pct:"~40%", h:"82%",  yr:"FY25*",proj:true  },
];

const TESTIMONIALS = [
  { stars:"★★★★★", text:'"Trillion Stock Research ne meri investment journey completely transform kar di. Research quality aur accuracy dono bahut high hain."', name:"Rahul Sharma", loc:"Indore, Madhya Pradesh", av:"R", bg:"linear-gradient(135deg,#00C2A8,#00E5CC)" },
  { stars:"★★★★★", text:'"SEBI registered hone ki wajah se trust kiya — aur unhone bilkul disappoint nahi kiya. Professional team, crystal clear recommendations."', name:"Priya Verma",  loc:"Bhopal, Madhya Pradesh",  av:"P", bg:"linear-gradient(135deg,#F0A500,#F5C842)" },
  { stars:"★★★★★", text:'"2 saal se Trillion Stock Research ke saath hoon. Portfolio consistently grow kar raha hai. Team ka knowledge aur dedication remarkable hai."', name:"Amit Joshi",   loc:"Indore, Madhya Pradesh",  av:"A", bg:"linear-gradient(135deg,#6366F1,#8B5CF6)" },
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

function CounterNum({ target, suffix = "" }) {
  const { val, ref } = useCounter(target);
  return (
    <div className="num-val" ref={ref}>
      {target === 82 ? `${val}%` : target === 10 ? `${val}+` : `${val.toLocaleString()}+`}
      {suffix}
    </div>
  );
}

function NumbersBar() {
  return (
    <div className="numbers-bar">
      {[
        { target: 5000, label: "Satisfied Investors" },
        { target: 10,   label: "Years of Expertise" },
        { target: 82,   label: "Research Accuracy" },
      ].map((n, i) => (
        <div className={`num-block reveal d${i + 1}`} key={i}>
          <CounterNum target={n.target} />
          <div className="num-label">{n.label}</div>
        </div>
      ))}
      <div className="num-block reveal d4">
        <div className="num-val" style={{ fontSize: "clamp(28px,3.5vw,40px)" }}>SEBI</div>
        <div className="num-label">Registered & Regulated</div>
      </div>
    </div>
  );
}

function BarChart() {
  const { ref, animated } = useBarAnimation();
  return (
    <div className="perf-card" ref={ref}>
      <div className="perf-title">Indicative Client Portfolio Growth</div>
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
      <p className="perf-footnote">*FY25 projected. Past performance is not indicative of future returns.</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════ */
export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  useScrollReveal();
  useNavScroll();

  // Inject CSS once
  useEffect(() => {
    const id = "tsr-styles";
    if (!document.getElementById(id)) {
      const tag = document.createElement("style");
      tag.id = id;
      tag.textContent = CSS;
      document.head.appendChild(tag);
    }
    return () => {};
  }, []);

  // Lock scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      {/* ── NAV ── */}
      <nav className="tsr-nav" id="tsrNav">
        <a href="#" className="nav-logo">
          <div className="nav-logo-main">Trillion <span>Stock</span> Research</div>
          <div className="nav-logo-sub">SEBI Registered · INH000020129</div>
        </a>
        <ul className="nav-links">
          {["Services","About","Reviews","Contact"].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <div className="nav-right">
          <span className="nav-sebi">✓ SEBI Verified</span>
          <a href="https://www.trillionstockresearch.com" className="nav-btn" target="_blank" rel="noreferrer">Get Started</a>
        </div>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* ── MOBILE MENU ── */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        {["services","about","testimonials","contact"].map(h => (
          <a href={`#${h}`} key={h} onClick={closeMenu} style={{ textTransform:"capitalize" }}>{h}</a>
        ))}
        <a href="https://www.trillionstockresearch.com" className="mob-cta" target="_blank" rel="noreferrer" onClick={closeMenu}>Get Started ↗</a>
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
              Indore's Premier Financial Advisory
            </div>
            <h1 className="tsr-h1">
              Trillion Stock<br />
              <span className="h1-accent">Research</span>
              <span className="h1-italic"> — Smart Wealth.</span>
            </h1>
            <p className="hero-desc">
              SEBI-registered experts ki team jo aapke har investment decision ko research, data aur strategy se power deti hai. Equity, F&amp;O, Portfolio — sab kuch ek jagah.
            </p>
            <div className="hero-btns">
              <a href="https://www.trillionstockresearch.com" className="btn-primary" target="_blank" rel="noreferrer">Free Consultation Lein ↗</a>
              <a href="#services" className="btn-outline">Services Dekhein</a>
            </div>
            <div className="trust-row">
              {[["🏛","SEBI Registered"],["📊","Research-Backed"],["🛡","Transparent"],["👥","5,000+ Clients"]].map(([icon,label]) => (
                <div className="trust-badge" key={label}>
                  <div className="trust-icon">{icon}</div>
                  <span>{label}</span>
                </div>
              ))}
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
                <div className="photo-badge-val">+38%</div>
                <div className="photo-badge-label">Avg. Returns FY24</div>
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
            <h2 className="section-h">Expert Research.<br />Real Results.</h2>
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
            <h2 className="section-h">Indore ka<br />Most Trusted Name</h2>
            <p className="section-sub">Sirf recommendations nahi — hum research, transparency, aur accountability ke saath aapka financial future secure karte hain.</p>
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
          <h2 className="section-h">5,000+ Investors<br />ki Trusted Choice</h2>
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
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BAND ── */}
      <section id="contact" className="cta-band">
        <div className="reveal-left">
          <div className="cta-h">Apna Financial Future<br /><span>Aaj Hi Secure Karein</span></div>
          <p className="cta-p">Free consultation ke liye abhi connect karein — SEBI registered experts se seedha baat karein aur apni investment journey sahi direction mein shuru karein.</p>
        </div>
        <div className="cta-right reveal-right">
          <a href="https://www.trillionstockresearch.com" className="btn-primary" target="_blank" rel="noreferrer">Free Consultation Book Karein ↗</a>
          <a href="https://www.trillionstockresearch.com" className="btn-outline" target="_blank" rel="noreferrer">Website Visit Karein</a>
          <p className="cta-note">SEBI Reg. No: INH000020129 · Indore, MP</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="tsr-footer">
        <div className="footer-top">
          <div className="reveal">
            <div className="footer-logo-main">Trillion <span>Stock</span> Research</div>
            <div className="footer-logo-sub">SEBI Registered Research Analyst</div>
            <p className="footer-about">Indore ki premier SEBI-registered financial advisory firm. Expert market research, personalized investment strategies aur research-backed solutions for every investor.</p>
            <div className="footer-reg">✓ Reg. No: INH000020129</div>
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
            <div className="footer-col-title">Contact</div>
            <a href="https://www.trillionstockresearch.com" target="_blank" rel="noreferrer">trillionstockresearch.com</a>
            <a href="#">Indore, Madhya Pradesh</a>
            <a href="#">India</a>
          </div>
        </div>
        <div className="footer-disclaimer reveal">
          <strong>Important Disclaimer:</strong> Investment in securities market are subject to market risks. Read all the related documents carefully before investing. Registration granted by SEBI and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors. Trillion Stock Research — SEBI Registered Research Analyst, Registration No: INH000020129.
        </div>
        <div className="footer-bottom">
          <p>© 2025 Trillion Stock Research. All rights reserved.</p>
          <p>trillionstockresearch.com · Indore, India</p>
        </div>
      </footer>

      {/* ── WHATSAPP FLOAT ── */}
      <a
        href="https://wa.me/91XXXXXXXXXX"  /* 👈 Apna WhatsApp number yahan daalo */
        className="wa-float"
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        💬
        <span className="wa-tooltip">Chat on WhatsApp</span>
      </a>
    </>
  );
}