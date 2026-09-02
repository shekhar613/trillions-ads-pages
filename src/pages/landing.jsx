import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; min-width:0; }

:root {
  --navy: #0B1F36;
  --navy-mid: #14304D;
  --navy-soft: #1E4668;
  --gold: #B8924A;
  --gold-2: #C9A55C;
  --gold-faint: rgba(184,146,74,.12);
  --paper: #F4F1EA;
  --paper-2: #EBE6DA;
  --white: #FDFCFA;
  --ink: #122033;
  --muted: #5A6A7A;
  --line: rgba(11,31,54,.10);
  --line-strong: rgba(11,31,54,.16);
  --green: #1B7A5A;
  --red: #C44536;
  --nav-h: 72px;
  --serif: 'Newsreader', Georgia, serif;
  --sans: 'DM Sans', system-ui, sans-serif;
  --max: 1280px;
}

html { scroll-behavior: smooth; overflow-x: clip; max-width:100%; -webkit-text-size-adjust: 100%; text-size-adjust: 100%; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  overflow-x: clip;
  max-width: 100%;
  padding-bottom: calc(96px + env(safe-area-inset-bottom, 0px));
}
img, svg { max-width: 100%; }
button, a, input { -webkit-tap-highlight-color: transparent; touch-action: manipulation; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--paper-2); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }

.wrap { width:100%; max-width:var(--max); margin:0 auto; }

/* ── SCROLL REVEAL ── */
.reveal, .reveal-left, .reveal-right, .reveal-scale {
  opacity: 0;
  transition: opacity .7s cubic-bezier(.22,1,.36,1), transform .7s cubic-bezier(.22,1,.36,1);
}
.reveal { transform: translateY(28px); }
.reveal-left { transform: translateX(-28px); }
.reveal-right { transform: translateX(28px); }
.reveal-scale { transform: scale(.96); }
.reveal.visible, .reveal-left.visible, .reveal-right.visible, .reveal-scale.visible {
  opacity:1; transform:none;
}
.d1{transition-delay:.06s} .d2{transition-delay:.12s} .d3{transition-delay:.18s}
.d4{transition-delay:.24s} .d5{transition-delay:.30s} .d6{transition-delay:.36s}

/* ── NAV ── */
.tsr-nav {
  position:fixed; top:0; left:0; right:0; z-index:200;
  height: var(--nav-h);
  display:flex; align-items:center; justify-content:space-between;
  padding: 0 clamp(16px,4vw,48px);
  background: rgba(253,252,250,.86);
  backdrop-filter: blur(18px) saturate(160%);
  border-bottom: 1px solid var(--line);
}
.tsr-nav::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.tsr-nav.scrolled { background: rgba(253,252,250,.97); box-shadow: 0 8px 30px rgba(11,31,54,.06); }
.nav-logo { display:flex; flex-direction:column; line-height:1; text-decoration:none; flex-shrink:1; min-width:0; }
.nav-logo-main { font-family:var(--serif); font-size:clamp(18px,2.2vw,24px); font-weight:600; color:var(--navy); letter-spacing:-.2px; }
.nav-logo-main span { color:var(--gold); }
.nav-logo-sub { font-size:9px; letter-spacing:2.4px; text-transform:uppercase; color:var(--muted); margin-top:5px; font-weight:500; }
.nav-links { display:flex; gap:clamp(22px,3vw,36px); list-style:none; }
.nav-links a { font-size:13px; font-weight:500; color:var(--muted); text-decoration:none; letter-spacing:.2px; transition:color .2s; position:relative; }
.nav-links a::after { content:''; position:absolute; left:0; right:0; bottom:-6px; height:1px; background:var(--gold); transform:scaleX(0); transform-origin:left; transition:transform .22s ease; }
.nav-links a:hover { color:var(--navy); }
.nav-links a:hover::after { transform:scaleX(1); }
.nav-right { display:flex; align-items:center; gap:12px; flex-shrink:0; }
.nav-sebi { font-size:11px; font-weight:600; letter-spacing:.6px; color:var(--navy); border:1px solid var(--gold); padding:6px 12px; border-radius:2px; background:var(--gold-faint); white-space:nowrap; }
.nav-btn { font-size:13px; font-weight:600; color:#fff; background:var(--navy); padding:10px 18px; border-radius:2px; text-decoration:none; transition:all .2s; white-space:nowrap; display:inline-block; letter-spacing:.2px; }
.nav-btn:hover { background:var(--navy-mid); }

.hamburger { display:none; flex-direction:column; justify-content:center; gap:5px; cursor:pointer; background:none; border:none; padding:10px; z-index:201; flex-shrink:0; min-width:44px; min-height:44px; }
.hamburger span { display:block; width:22px; height:1.5px; background:var(--navy); border-radius:2px; transition:all .3s; }
.hamburger.open span:nth-child(1) { transform:translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
.hamburger.open span:nth-child(3) { transform:translateY(-6.5px) rotate(-45deg); }

.mobile-menu { display:none; position:fixed; inset:0; z-index:199; background:var(--paper); flex-direction:column; align-items:center; justify-content:center; gap:22px; opacity:0; transform:translateY(-12px); transition:opacity .3s ease,transform .3s ease; pointer-events:none; padding: calc(var(--nav-h) + 24px) 24px calc(24px + env(safe-area-inset-bottom, 0px)); overflow-y:auto; }
.mobile-menu.open { display:flex; opacity:1; transform:none; pointer-events:all; }
.mobile-menu a { font-family:var(--serif); font-size:clamp(26px,8vw,42px); font-weight:500; color:var(--navy); text-decoration:none; padding:6px 8px; }
.mobile-menu a:hover { color:var(--gold); }
.mob-cta { font-family:var(--sans) !important; font-size:15px !important; font-weight:600 !important; color:#fff !important; background:var(--navy); padding:14px 24px; border-radius:2px; margin-top:8px; letter-spacing:.3px; width: min(100%, 320px); text-align:center; }

/* ── HERO ── */
.tsr-hero {
  min-height: 100svh;
  display:flex; align-items:center;
  padding: calc(var(--nav-h) + 36px) clamp(16px,4vw,48px) 56px;
  position:relative; overflow:hidden;
  background:
    radial-gradient(ellipse 80% 60% at 100% 0%, rgba(184,146,74,.10), transparent 55%),
    linear-gradient(180deg, var(--paper) 0%, var(--white) 100%);
}
.hero-rule { position:absolute; inset:auto 0 0 0; height:1px; background:var(--line); }
.hero-inner {
  position:relative; z-index:1;
  display:grid;
  grid-template-columns: 1fr 1.05fr;
  gap: clamp(24px,4vw,56px);
  align-items: center;
  width:100%; max-width:var(--max); margin:0 auto;
}

.hero-eyebrow {
  display:inline-flex; align-items:center; gap:12px;
  font-size:11px; font-weight:600; letter-spacing:2.6px; text-transform:uppercase;
  color:var(--gold); margin-bottom:22px;
  animation:heroUp .8s .1s ease both;
}
.eyebrow-dot { width:18px; height:1px; background:var(--gold); flex-shrink:0; }

.tsr-h1 {
  font-family:var(--serif); font-size:clamp(32px,7.2vw,72px); font-weight:500;
  line-height:1.08; letter-spacing:-.8px; margin-bottom:22px; color:var(--navy);
  animation:heroUp .8s .18s ease both;
}
.h1-accent { display:block; color:var(--gold); font-style:italic; font-weight:500; }
.h1-italic { display:block; font-style:italic; color:var(--muted); font-weight:400; font-size:.42em; letter-spacing:0; margin-top:10px; line-height:1.35; }

.hero-desc {
  font-size:clamp(15px,1.5vw,17px); color:var(--muted); line-height:1.75;
  max-width:520px; margin-bottom:32px; font-weight:400;
  animation:heroUp .8s .26s ease both;
}

.hero-btns { display:flex; gap:12px; flex-wrap:wrap; animation:heroUp .8s .34s ease both; }
.btn-primary, .btn-register {
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  font-size:14px; font-weight:600; color:#fff; background:var(--navy);
  padding:14px 26px; border-radius:2px; text-decoration:none; transition:all .22s;
  white-space:nowrap; cursor:pointer; border:none; font-family:var(--sans); letter-spacing:.2px;
  max-width:100%; min-height:46px; box-sizing:border-box;
}
.btn-register { font-size:15px; padding:15px 22px; }
.btn-primary:hover, .btn-register:hover { background:var(--navy-mid); transform:translateY(-1px); }
.btn-outline {
  display:inline-flex; align-items:center; gap:8px;
  font-size:14px; font-weight:500; color:var(--navy); background:transparent;
  border:1px solid var(--line-strong); padding:13px 24px; border-radius:2px;
  text-decoration:none; transition:all .22s; white-space:nowrap; cursor:pointer; font-family:var(--sans);
}
.btn-outline:hover { border-color:var(--navy); background:rgba(11,31,54,.03); }

.sebi-chip {
  display:inline-flex; align-items:center; gap:10px;
  background:var(--white); border:1px solid var(--line);
  padding:8px 14px; margin-top:20px; border-radius:2px;
  animation:heroUp .8s .4s ease both;
}
.sebi-chip-dot { width:7px; height:7px; border-radius:50%; background:var(--gold); box-shadow:0 0 0 3px var(--gold-faint); flex-shrink:0; }
.sebi-chip-text { font-size:11px; font-weight:600; color:var(--muted); letter-spacing:.8px; text-transform:uppercase; }
.sebi-chip-num { font-size:13px; font-weight:700; color:var(--navy); letter-spacing:.4px; }
.hero-register-note { font-size:12px; color:var(--muted); margin-top:12px; line-height:1.5; animation:heroUp .8s .46s ease both; }

.trust-row {
  display:flex; gap:10px; flex-wrap:wrap; margin-top:28px; padding-top:24px;
  border-top:1px solid var(--line); animation:heroUp .8s .5s ease both;
}
.trust-badge {
  display:flex; align-items:center; gap:8px; font-size:12px; color:var(--muted); font-weight:500;
  background:var(--white); border:1px solid var(--line); padding:7px 10px; border-radius:2px;
}
.trust-icon { width:40px;height:26px;border-radius:2px;background:#fff;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;padding:2px 5px; }
.trust-icon img { height:18px;width:auto;object-fit:contain;display:block; }

@keyframes heroUp { from{opacity:0;transform:translateY(22px);} to{opacity:1;transform:none;} }

/* ── HERO PHOTO ── */
.hero-photo-col { min-width:0; width:100%; }
.hero-photo-wrap { position:relative; width:100%; max-width:100%; }
.hero-photo-frame {
  position:relative; background:var(--white); border:1px solid var(--line);
  padding:12px 12px 0; box-shadow: 0 24px 60px rgba(11,31,54,.10);
  width:100%; max-width:100%;
}
.hero-photo-img {
  width:100%; height:clamp(520px,78vh,760px); object-fit:cover; object-position:top center;
  display:block; filter:saturate(.92) contrast(1.04);
}
.hero-photo-mat { position:absolute; inset:12px 12px 72px; border:1px solid rgba(184,146,74,.35); pointer-events:none; }
.hero-photo-name {
  display:flex; justify-content:space-between; align-items:flex-end; gap:8px; flex-wrap:wrap;
  padding:16px 8px 14px; font-family:var(--serif); font-size:clamp(16px,2vw,22px);
  font-weight:500; color:var(--navy);
}
.hero-photo-name span { font-family:var(--sans); font-size:11px; font-weight:600; letter-spacing:1.4px; text-transform:uppercase; color:var(--gold); font-style:normal; }
.photo-badge {
  position:absolute; z-index:3; top:28px; left:max(-10px, -2vw);
  background:var(--white); border:1px solid var(--line);
  padding:10px 12px; box-shadow: 0 10px 30px rgba(11,31,54,.08);
  max-width:calc(100% - 16px);
}

/* ── TICKER ── */
.tsr-ticker { overflow:hidden; background:var(--navy); padding:12px 0; border-top:1px solid rgba(184,146,74,.25); border-bottom:1px solid rgba(184,146,74,.25); }
.ticker-track { display:flex; width:max-content; animation:ticker 60s linear infinite; }
.ticker-track:hover { animation-play-state:paused; }
@keyframes ticker { to{transform:translateX(-50%);} }
.ticker-item { display:flex; align-items:center; gap:8px; padding:0 28px; font-size:12px; font-weight:500; white-space:nowrap; border-right:1px solid rgba(255,255,255,.08); }
.t-name{color:rgba(255,255,255,.45); letter-spacing:.6px;} .t-val{color:#fff;}
.t-up{color:#7DCEA0;font-size:11px;} .t-dn{color:#E8A0A0;font-size:11px;}

/* ── NUMBERS ── */
.numbers-bar {
  background:var(--white); border-bottom:1px solid var(--line);
  display:grid; grid-template-columns:repeat(4,1fr); width:100%;
}
.num-block { padding:clamp(28px,4vw,44px) 16px; text-align:center; border-right:1px solid var(--line); }
.num-block:last-child { border-right:none; }
.num-val { font-family:var(--serif); font-size:clamp(32px,4.4vw,48px); font-weight:500; line-height:1; color:var(--navy); }
.num-label { font-size:12px; color:var(--muted); margin-top:8px; letter-spacing:.4px; font-weight:500; }

/* ── SECTION COMMONS ── */
.tsr-section, .cta-band, .reg-strip { scroll-margin-top: calc(var(--nav-h) + 12px); }
.tsr-section { padding:clamp(64px,8vw,104px) clamp(16px,4vw,48px); width:100%; box-sizing:border-box; }
.section-eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:11px; font-weight:600; letter-spacing:2.4px; text-transform:uppercase; color:var(--gold); margin-bottom:14px; }
.section-eyebrow::before { content:''; width:22px; height:1px; background:var(--gold); }
.section-h { font-family:var(--serif); font-size:clamp(30px,4vw,52px); font-weight:500; line-height:1.12; margin-bottom:14px; color:var(--navy); letter-spacing:-.4px; }
.section-sub { font-size:clamp(15px,1.4vw,16px); color:var(--muted); line-height:1.75; max-width:520px; }

/* ── SERVICES ── */
.services-bg { background:var(--paper); }
.services-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:clamp(32px,5vw,52px); gap:20px; flex-wrap:wrap; max-width:var(--max); margin-left:auto; margin-right:auto; }
.services-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; max-width:var(--max); margin:0 auto; }
.svc-card {
  background:var(--white); padding:28px 24px; border:1px solid var(--line);
  position:relative; transition: transform .25s, box-shadow .25s, border-color .25s;
}
.svc-card::before { content:''; position:absolute; top:0; left:0; bottom:0; width:2px; background:transparent; transition:background .25s; }
.svc-card:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(11,31,54,.07); border-color:rgba(184,146,74,.35); }
.svc-card:hover::before { background:var(--gold); }
.svc-top { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:18px; }
.svc-num { font-family:var(--serif); font-size:13px; font-weight:600; color:var(--gold); letter-spacing:1.5px; }
.svc-icon { width:40px; height:40px; border:1px solid var(--line); display:flex; align-items:center; justify-content:center; color:var(--navy); background:var(--paper); }
.svc-title { font-size:17px; font-weight:600; margin-bottom:10px; color:var(--navy); letter-spacing:-.2px; }
.svc-desc { font-size:14px; color:var(--muted); line-height:1.7; }
.svc-tag { display:inline-block; margin-top:16px; font-size:11px; font-weight:600; color:var(--navy); background:var(--gold-faint); border:1px solid rgba(184,146,74,.25); padding:4px 10px; letter-spacing:.3px; }

/* ── WHY US ── */
.why-bg { background:var(--white); border-top:1px solid var(--line); border-bottom:1px solid var(--line); }
.why-grid { display:grid; grid-template-columns:1.05fr .95fr; gap:clamp(36px,6vw,72px); align-items:center; max-width:var(--max); margin:0 auto; }
.why-list { margin-top:28px; }
.why-item { display:flex; gap:16px; padding:18px 0; border-bottom:1px solid var(--line); align-items:flex-start; }
.why-item:last-child { border-bottom:none; }
.why-icon { width:42px;height:42px;border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:var(--navy);flex-shrink:0; background:var(--paper); }
.why-text-title { font-size:15px; font-weight:600; margin-bottom:4px; color:var(--navy); }
.why-text-desc { font-size:13px; color:var(--muted); line-height:1.65; }

.perf-card { background:var(--paper); border:1px solid var(--line); padding:28px 24px; }
.perf-title { font-size:11px; color:var(--muted); letter-spacing:1.6px; text-transform:uppercase; margin-bottom:22px; font-weight:600; }
.bars-wrap { display:flex; align-items:flex-end; gap:12px; height:160px; margin-bottom:18px; }
.bar-col { flex:1; display:flex; flex-direction:column; align-items:center; gap:6px; height:100%; justify-content:flex-end; }
.bar-fill { width:100%; background:linear-gradient(to top, var(--navy), var(--navy-soft)); }
.bar-fill.projected { background:repeating-linear-gradient(135deg, rgba(184,146,74,.55) 0 6px, rgba(184,146,74,.18) 6px 12px); }
.bar-pct { font-size:11px; font-weight:600; color:var(--navy); }
.bar-yr { font-size:10px; color:var(--muted); }
.perf-footnote { font-size:11px; color:var(--muted); line-height:1.6; }
.disclaimer-box { margin-top:16px; background:var(--gold-faint); border:1px solid rgba(184,146,74,.28); border-left:3px solid var(--gold); padding:16px 18px; }
.disclaimer-box p { font-size:13px; color:var(--muted); line-height:1.7; }
.disclaimer-box strong { color:var(--navy); }

/* ── TESTIMONIALS ── */
.testi-bg { background:var(--paper); }
.testi-head { max-width:var(--max); margin:0 auto 40px; }
.testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; max-width:var(--max); margin:0 auto; }
.testi-card { background:var(--white); border:1px solid var(--line); padding:28px 24px; transition:transform .25s, box-shadow .25s; }
.testi-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(11,31,54,.07); }
.testi-quote { font-family:var(--serif); font-size:42px; line-height:.6; color:var(--gold); margin-bottom:12px; }
.testi-stars { color:var(--gold); font-size:12px; letter-spacing:2px; margin-bottom:12px; }
.testi-text { font-size:16px; color:var(--ink); line-height:1.7; font-style:italic; font-family:var(--serif); }
.testi-author { margin-top:22px; display:flex; align-items:center; gap:12px; padding-top:16px; border-top:1px solid var(--line); }
.testi-av { width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-weight:600;font-size:14px;color:#fff;flex-shrink:0; font-family:var(--serif); }
.testi-name { font-size:13px; font-weight:600; color:var(--navy); }
.testi-loc { font-size:11px; color:var(--muted); margin-top:2px; }
.testi-disclaimer { font-size:11px; color:var(--muted); margin-top:12px; line-height:1.55; font-style:italic; }

/* ── REGISTER STRIP ── */
.reg-strip {
  background:var(--navy); color:#fff;
  padding:clamp(56px,7vw,88px) clamp(16px,4vw,48px);
  display:flex; flex-direction:column; align-items:center; text-align:center; gap:18px;
  position:relative; overflow:hidden;
}
.reg-strip::before {
  content:''; position:absolute; inset:0;
  background: radial-gradient(ellipse at 50% 0%, rgba(184,146,74,.18), transparent 60%);
  pointer-events:none;
}
.reg-strip-badge { display:inline-flex; align-items:center; gap:8px; font-size:11px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:var(--gold-2); border:1px solid rgba(184,146,74,.35); padding:6px 14px; position:relative; }
.reg-strip-h { font-family:var(--serif); font-size:clamp(28px,4vw,48px); font-weight:500; line-height:1.15; color:#fff; max-width:640px; position:relative; }
.reg-strip-h span { color:var(--gold-2); font-style:italic; }
.reg-strip-sub { font-size:15px; color:rgba(255,255,255,.62); max-width:520px; line-height:1.7; position:relative; }
.reg-strip-perks { display:flex; gap:22px; flex-wrap:wrap; justify-content:center; position:relative; }
.reg-strip-perk { display:flex; align-items:center; gap:7px; font-size:13px; color:rgba(255,255,255,.78); }
.reg-strip-perk span { color:var(--gold-2); }
.reg-strip .btn-register { background:var(--gold); color:var(--navy); position:relative; }
.reg-strip .btn-register:hover { background:var(--gold-2); }
.reg-strip .hero-register-note { color:rgba(255,255,255,.45); }

/* ── CTA BAND ── */
.cta-band {
  background:var(--paper-2); padding:clamp(56px,7vw,88px) clamp(16px,4vw,48px);
  display:block; border-top:1px solid var(--line);
}
.cta-inner { max-width:var(--max); margin:0 auto; width:100%; display:grid; grid-template-columns:1fr auto; gap:clamp(28px,5vw,60px); align-items:center; }
.cta-h { font-family:var(--serif); font-size:clamp(28px,4vw,48px); font-weight:500; line-height:1.12; margin-bottom:12px; color:var(--navy); }
.cta-h span { color:var(--gold); font-style:italic; }
.cta-p { font-size:16px; color:var(--muted); max-width:520px; line-height:1.7; }
.cta-right { display:flex; flex-direction:column; gap:12px; align-items:flex-end; }
.cta-note { font-size:12px; color:var(--muted); text-align:right; letter-spacing:.3px; }

/* ── FOOTER ── */
.tsr-footer { background:var(--navy); color:#fff; padding:clamp(48px,6vw,76px) clamp(16px,4vw,48px) clamp(24px,3vw,36px); }
.footer-top { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:clamp(24px,4vw,56px); margin-bottom:40px; max-width:var(--max); margin-left:auto; margin-right:auto; }
.footer-logo-main { font-family:var(--serif); font-size:22px; font-weight:500; color:#fff; }
.footer-logo-main span { color:var(--gold-2); }
.footer-logo-sub { font-size:10px; letter-spacing:2.2px; text-transform:uppercase; color:rgba(255,255,255,.4); margin:6px 0 14px; }
.footer-about { font-size:13px; color:rgba(255,255,255,.55); line-height:1.75; }
.footer-reg { display:inline-flex; align-items:center; gap:8px; margin-top:12px; font-size:11px; color:var(--gold-2); background:rgba(184,146,74,.08); border:1px solid rgba(184,146,74,.22); padding:6px 10px; max-width:100%; flex-wrap:wrap; word-break:break-word; }
.footer-col-title { font-size:11px; font-weight:600; letter-spacing:1.8px; text-transform:uppercase; color:var(--gold-2); margin-bottom:16px; }
.footer-col a { display:block; font-size:13px; color:rgba(255,255,255,.55); text-decoration:none; margin-bottom:11px; transition:color .2s; }
.footer-col a:hover { color:#fff; }
.footer-disclaimer { background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); border-left:3px solid var(--gold); padding:18px 20px; margin:0 auto 28px; font-size:12px; color:rgba(255,255,255,.5); line-height:1.8; max-width:var(--max); }
.footer-disclaimer strong { color:rgba(255,255,255,.82); }
.footer-disclaimer .disc-title { font-size:13px; font-weight:700; color:var(--gold-2); margin-bottom:8px; letter-spacing:.3px; }
.footer-cert-row { display:flex; gap:10px; flex-wrap:wrap; margin-top:16px; padding-top:16px; border-top:1px solid rgba(255,255,255,.08); }
.footer-cert-badge { display:inline-flex; align-items:center; gap:10px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); padding:8px 14px; font-size:11px; color:rgba(255,255,255,.55); }
.footer-cert-badge .cert-icon { flex-shrink:0; display:flex; align-items:center; justify-content:center; background:#fff; padding:4px 7px; }
.footer-cert-badge .cert-icon img { height:24px; width:auto; object-fit:contain; display:block; }
.footer-cert-badge strong { color:#fff; font-weight:600; display:block; margin-bottom:1px; }
.footer-bottom { display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:20px; border-top:1px solid rgba(255,255,255,.08); max-width:var(--max); margin:0 auto; }
.footer-bottom p { font-size:12px; color:rgba(255,255,255,.38); }
.footer-social { display:flex; gap:10px; align-items:center; }
.footer-social-link { display:inline-flex; align-items:center; gap:7px; font-size:12px; font-weight:500; color:rgba(255,255,255,.55); text-decoration:none; padding:6px 12px; border:1px solid rgba(255,255,255,.1); transition:all .2s; }
.footer-social-link:hover { color:#fff; border-color:rgba(255,255,255,.25); }
.footer-social-link.insta:hover { border-color:#E1306C; color:#E1306C; }
.footer-social-link.fb:hover { border-color:#1877F2; color:#1877F2; }
.social-icon { display:inline-flex; align-items:center; flex-shrink:0; }
.social-icon svg { width:15px; height:15px; display:block; }

/* ── REGISTER MODAL ── */
.reg-overlay { position:fixed; inset:0; z-index:1000; background:rgba(11,31,54,.62); backdrop-filter:blur(8px); display:flex; align-items:flex-start; justify-content:center; padding:max(16px, env(safe-area-inset-top, 0px)) 16px max(16px, env(safe-area-inset-bottom, 0px)); opacity:0; pointer-events:none; transition:opacity .25s ease; overflow-y:auto; }
.reg-overlay.open { opacity:1; pointer-events:all; }
.reg-modal { position:relative; width:100%; max-width:480px; max-height:none; margin:auto 0; overflow-y:visible; background:var(--white); border:1px solid var(--line); padding:clamp(24px,5vw,44px) clamp(18px,4vw,44px); box-shadow:0 32px 80px rgba(11,31,54,.28); transform:scale(.96) translateY(16px); transition:transform .28s ease, opacity .25s ease; opacity:0; }
.reg-overlay.open .reg-modal { transform:none; opacity:1; }
.reg-modal-close { position:absolute; top:16px; right:16px; background:transparent; border:1px solid var(--line); color:var(--muted); width:32px; height:32px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px; transition:all .2s; }
.reg-modal-close:hover { background:var(--paper); color:var(--navy); }
.reg-modal-badge { display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:600; letter-spacing:1.6px; text-transform:uppercase; color:var(--gold); border:1px solid rgba(184,146,74,.3); padding:4px 10px; margin-bottom:14px; }
.reg-modal-h { font-family:var(--serif); font-size:clamp(22px,3.5vw,32px); font-weight:500; color:var(--navy); line-height:1.2; margin-bottom:8px; }
.reg-modal-h span { color:var(--gold); font-style:italic; }
.reg-modal-sub { font-size:13px; color:var(--muted); margin-bottom:24px; line-height:1.65; }
.reg-field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.reg-field label { font-size:11px; font-weight:600; color:var(--muted); letter-spacing:.8px; text-transform:uppercase; }
.reg-field input { background:var(--paper); border:1px solid var(--line-strong); padding:13px 14px; color:var(--navy); font-family:var(--sans); font-size:16px; outline:none; transition:border-color .2s, box-shadow .2s; width:100%; max-width:100%; }
.reg-field input::placeholder { color:rgba(18,32,51,.35); }
.reg-field input:focus { border-color:var(--gold); box-shadow:0 0 0 3px var(--gold-faint); background:#fff; }
.reg-field input.error { border-color:var(--red); }
.reg-field .field-err { font-size:11px; color:var(--red); }
.reg-api-error { background:rgba(196,69,54,.08); border:1px solid rgba(196,69,54,.25); padding:10px 14px; font-size:13px; color:var(--red); margin-bottom:12px; }
.reg-submit { width:100%; margin-top:6px; padding:14px; background:var(--navy); color:#fff; font-family:var(--sans); font-size:15px; font-weight:600; border:none; cursor:pointer; letter-spacing:.2px; transition:all .2s; }
.reg-submit:hover:not(:disabled) { background:var(--navy-mid); }
.reg-submit:disabled { opacity:.6; cursor:not-allowed; }
.reg-modal-perks { display:flex; gap:12px; flex-wrap:wrap; margin-top:16px; padding-top:16px; border-top:1px solid var(--line); }
.reg-modal-perk { display:flex; align-items:center; gap:5px; font-size:11px; color:var(--muted); }
.reg-modal-perk span { color:var(--gold); }
.reg-success { display:flex; flex-direction:column; align-items:center; text-align:center; animation:successIn .4s ease both; }
@keyframes successIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
.reg-success-confetti { font-size:28px; margin-bottom:8px; }
.reg-success-congrats { font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:var(--gold); border:1px solid rgba(184,146,74,.3); padding:4px 12px; margin-bottom:14px; }
.reg-success-h { font-family:var(--serif); font-size:clamp(24px,4vw,32px); font-weight:500; color:var(--navy); line-height:1.2; margin-bottom:8px; }
.reg-success-h span { color:var(--gold); font-style:italic; }
.reg-success-sub { font-size:14px; color:var(--muted); line-height:1.7; max-width:340px; margin-bottom:20px; }
.reg-success-sub strong { color:var(--navy); }
.reg-success-divider { width:100%; height:1px; background:var(--line); margin-bottom:20px; }
.reg-wa-label { font-size:11px; font-weight:600; letter-spacing:1px; text-transform:uppercase; color:var(--muted); margin-bottom:12px; }
.reg-wa-btn { display:inline-flex; align-items:center; justify-content:center; gap:10px; width:100%; padding:14px 20px; background:#128C7E; color:#fff; font-family:var(--sans); font-size:15px; font-weight:600; text-decoration:none; transition:all .2s; margin-bottom:12px; }
.reg-wa-btn:hover { background:#0E7266; }
.reg-wa-icon { font-size:18px; }
.reg-wa-text { display:flex; flex-direction:column; align-items:flex-start; }
.reg-wa-text-main { font-size:14px; font-weight:700; }
.reg-wa-text-sub { font-size:11px; font-weight:400; opacity:.85; margin-top:2px; }
.reg-wa-note { font-size:12px; color:var(--muted); margin-bottom:14px; }
.reg-success-close { font-size:12px; color:var(--muted); background:none; border:none; cursor:pointer; font-family:var(--sans); padding:4px; }
.reg-success-close:hover { color:var(--navy); }

.nav-btn-register { background:var(--navy) !important; color:#fff !important; border-radius:2px !important; font-weight:600 !important; font-size:13px !important; padding:10px 18px !important; box-shadow:none !important; animation:none !important; }

/* ── OFFER STICKY BAR ── */
.offer-bar-wrap { position:fixed; bottom:0; left:0; right:0; z-index:400; width:100%; padding:8px 12px calc(8px + env(safe-area-inset-bottom, 0px)); background:linear-gradient(180deg, transparent, rgba(244,241,234,.92) 40%); box-sizing:border-box; }
.offer-bar { width:100%; max-width:1060px; margin:0 auto; background:var(--navy); border-top:2px solid var(--gold); display:flex; align-items:center; justify-content:space-between; padding:10px 14px; gap:10px; min-width:0; box-sizing:border-box; }
.offer-bar-left { display:flex; flex-direction:column; gap:3px; flex:1 1 auto; min-width:0; }
.offer-price { font-size:clamp(12px,1.6vw,16px); font-weight:600; color:#fff; letter-spacing:.2px; }
.offer-timer { font-size:11px; color:rgba(255,255,255,.5); font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.offer-bar-mid { flex:1 1 180px; min-width:0; text-align:center; font-size:13px; font-weight:500; color:rgba(255,255,255,.55); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.offer-btn { flex:0 0 auto; display:inline-flex; align-items:center; justify-content:center; padding:0 16px; min-height:44px; height:auto; background:var(--gold); color:var(--navy); font-family:var(--sans); font-size:12px; font-weight:700; letter-spacing:.2px; border:none; cursor:pointer; text-decoration:none; white-space:nowrap; max-width:100%; }
.offer-btn:hover { background:var(--gold-2); }

/* ── RESPONSIVE ── */
@media (max-width:1200px) {
  .nav-sebi { display:none; }
  .hero-inner { grid-template-columns: 1fr 1.05fr; gap:24px; }
  .footer-top { grid-template-columns:1fr 1fr; gap:36px; }
  .cta-inner { grid-template-columns:1fr; }
  .cta-right { align-items:flex-start; flex-direction:row; flex-wrap:wrap; }
  .cta-note { text-align:left; width:100%; }
}
@media (max-width:960px) {
  .nav-links, .nav-sebi, .nav-btn { display:none !important; }
  .hamburger { display:flex; }
  .services-grid, .testi-grid { grid-template-columns:1fr 1fr; }
  .numbers-bar { grid-template-columns:repeat(2,1fr); }
  .num-block:nth-child(2) { border-right:none; }
  .num-block:nth-child(3), .num-block:nth-child(4) { border-top:1px solid var(--line); }
  .num-block:nth-child(4) { border-right:none; }
  .why-grid { grid-template-columns:1fr; gap:36px; }
  .hero-photo-img { height:clamp(440px,64vw,640px); }
}
@media (max-width:900px) {
  .tsr-hero { min-height: auto; padding-top: calc(var(--nav-h) + 24px); padding-bottom: 40px; }
  .hero-inner { grid-template-columns:1fr; gap:28px; }
  .hero-text-col { text-align:center; display:flex; flex-direction:column; align-items:center; }
  .hero-desc { margin-left:auto; margin-right:auto; }
  .trust-row { justify-content:center; }
  .hero-btns { justify-content:center; width:100%; }
  .photo-badge { left:8px; top:16px; }
}
@media (max-width:640px) {
  .hero-eyebrow { letter-spacing:1.6px; font-size:10px; }
  .hero-btns { flex-direction:column; align-items:stretch; }
  .hero-btns .btn-register, .hero-btns .btn-outline { width:100%; justify-content:center; }
  .hero-photo-img { height:clamp(360px,96vw,560px); }
  .services-grid, .testi-grid { grid-template-columns:1fr; }
  .services-header { align-items:flex-start; }
  .svc-card, .testi-card { padding:22px 18px; }
  .footer-top { grid-template-columns:1fr; gap:28px; }
  .footer-bottom { flex-direction:column; align-items:flex-start; }
  .footer-cert-badge { width:100%; }
  .cta-right { width:100%; flex-direction:column; }
  .cta-right .btn-register, .cta-right .btn-outline { width:100%; justify-content:center; }
  .reg-strip .btn-register { width:100%; max-width:360px; }
  .reg-strip-perks { flex-direction:column; align-items:center; gap:10px; }
  .offer-bar-mid { display:none; }
  .offer-bar { flex-wrap:wrap; }
  .offer-bar-left { flex:1 1 100%; }
  .offer-btn { flex:1 1 100%; width:100%; }
  .num-block { padding:22px 10px; }
  .why-item { gap:12px; }
}
@media (max-width:480px) {
  :root { --nav-h: 62px; }
  .nav-logo-sub { display:none; }
  .nav-logo-main { font-size:17px; }
  .tsr-section { padding:48px 16px; }
  .section-h { font-size:clamp(26px,8vw,36px); }
  .reg-modal { padding:28px 16px 20px; }
  .reg-modal-close { top:10px; right:10px; width:40px; height:40px; }
  .sebi-chip { flex-wrap:wrap; justify-content:center; }
  .trust-row { gap:8px; }
  .trust-badge { flex:1 1 calc(50% - 8px); justify-content:center; }
}
@media (max-width:360px) {
  .hero-btns .btn-register { white-space:normal; line-height:1.3; }
  .offer-price { white-space:normal; }
  .offer-timer { white-space:normal; }
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
  { num:"01", icon:"chart", title:"Equity Research & Analysis",    desc:"Fundamental and technical analysis of NSE/BSE listed stocks. Data-driven research reports to help you make informed decisions. Investments are subject to market risk.", tag:"Stocks · NSE/BSE" },
  { num:"02", icon:"bolt", title:"Intraday & Positional Research", desc:"Daily research-based analysis with entry, exit and stop-loss levels. These are research recommendations only — no profit is guaranteed.", tag:"Research Only · No Guarantee" },
  { num:"03", icon:"case", title:"Portfolio Review & Research Analyst",   desc:"Portfolio analysis based on your stated risk profile. Research-based allocation guidance — all investment decisions remain with the investor.", tag:"Research Analyst · Risk-Managed" },
  { num:"04", icon:"target", title:"F&O Research",         desc:"Research-based analysis for Futures & Options segments. F&O carries very high risk and is suitable only for experienced investors.", tag:"High Risk · Research Only" },
  { num:"05", icon:"file", title:"Market Research Reports",       desc:"Sector reports, earnings analysis and quarterly outlooks. Objective market research to support well-informed investment decisions.", tag:"Sector Reports · Earnings" },
  { num:"06", icon:"scope", title:"Long-term Stock Research",      desc:"Deep fundamental research on value stocks. Past research activity does not guarantee future performance. Investments are subject to market risk.", tag:"Long-term · Fundamental" },
];

const WHY_ITEMS = [
  { icon:"bank", title:"SEBI Registered Research Analyst",   desc:"Registration No. INH000020129. We operate under SEBI guidelines. SEBI registration does not guarantee performance or returns." },
  { icon:"mind", title:"Research-Based Analysis",            desc:"Written research reports based on fundamental and technical analysis. These are recommendations only — the final investment decision is always yours." },
  { icon:"target", title:"Risk-Profile Based Guidance",        desc:"Research guidance aligned to your stated risk tolerance. Investments in securities are subject to market risks." },
  { icon:"file", title:"Transparent & Documented",           desc:"All recommendations are provided in written format, compliant with SEBI disclosure norms. No verbal-only advice." },
];

const BARS = [
  { pct:"FY21", h:"35%",  yr:"FY21", proj:false },
  { pct:"FY22", h:"52%",  yr:"FY22", proj:false },
  { pct:"FY23", h:"68%",  yr:"FY23", proj:false },
  { pct:"FY24", h:"100%", yr:"FY24", proj:false },
  { pct:"FY25*",h:"82%",  yr:"FY25*",proj:true  },
];

const TESTIMONIALS = [
  { stars:"★★★★★", text:'"The research reports are detailed and well-structured. The analysis is easy to understand and helpful when evaluating investment options."', name:"Rahul Sharma", loc:"Madhya Pradesh", av:"R", bg:"#0B1F36", note:"Individual experience. Investment results vary. Investments are subject to market risk." },
  { stars:"★★★★★", text:'"Being SEBI registered, their approach is professional and transparent. All recommendations are provided in written, documented format."', name:"Priya Verma",  loc:"Bhopal, Madhya Pradesh",  av:"P", bg:"#B8924A", note:"Individual experience. Past research quality does not guarantee future accuracy." },
  { stars:"★★★★★", text:'"The research methodology is clear — both fundamental and technical aspects are covered. Risk warnings are explicitly mentioned in the F&O section."', name:"Amit Joshi",   loc:"Madhya Pradesh",  av:"A", bg:"#1E4668", note:"Individual experience. Investments are subject to market risks." },
];

const ICONS = {
  chart: <polyline points="3 17 9 11 13 15 21 7" />,
  bolt: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></>,
  case: <><rect x="3" y="7" width="18" height="13" rx="1" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3" /></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" /></>,
  scope: <><circle cx="12" cy="12" r="3" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
  bank: <><path d="M3 10h18L12 3 3 10z" /><path d="M5 10v8M9 10v8M15 10v8M19 10v8M4 18h16" /></>,
  mind: <><circle cx="12" cy="9" r="4" /><path d="M8 14c-2 1.5-3 3.5-3 6h14c0-2.5-1-4.5-3-6" /></>,
};

function Glyph({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

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
            <span className="t-name">{t.name}</span>
            <span className="t-val">{t.val}</span>
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
        <div className="num-val" style={{ fontSize: "clamp(24px,3.2vw,38px)" }}>SEBI</div>
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
            <div className="bar-pct" style={b.proj ? { color: "var(--gold)" } : {}}>{b.pct}</div>
            <div
              className={`bar-fill${b.proj ? " projected" : ""}`}
              style={{ height: animated ? b.h : "0%", transition: "height .8s cubic-bezier(.22,1,.36,1)", transitionDelay: `${i * 0.1}s` }}
            />
            <div className="bar-yr" style={b.proj ? { opacity: 0.55 } : {}}>{b.yr}</div>
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
      const res = await fetch("https://tstock.trillionstechsolutions.com/ads-registration/register", {
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
            <div className="reg-modal-badge">Free Registration</div>
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
                {submitting ? "Submitting..." : "Join Free Master Class"}
              </button>
            </form>
            <div className="reg-modal-perks">
              {[["✓","SEBI Reg. INH000020129"],["✓","Written Research Reports"],["⚠","Market Risk Applies"]].map(([icon,text]) => (
                <div className="reg-modal-perk" key={text}><span>{icon}</span>{text}</div>
              ))}
            </div>
            <p style={{fontSize:"11px",color:"var(--muted)",marginTop:"12px",lineHeight:"1.6"}}>By registering, you acknowledge that investments are subject to market risks. Research reports are for informational purposes only and do not constitute investment advice.</p>
          </>
        ) : (
          <div className="reg-success">
            <div className="reg-success-congrats">Congratulations</div>
            <h2 className="reg-success-h">Welcome, <span>{form.name.split(" ")[0]}</span>!<br />You're All Set.</h2>
            <p className="reg-success-sub">
              Registration confirmed. Join our WhatsApp group for <strong>research updates &amp; market analysis</strong> from our SEBI-registered analysts (Reg. No: INH000020129). Investments are subject to market risks.
            </p>
            <div className="reg-success-divider" />
            <div className="reg-wa-label">Next Step — Join the Community</div>
            <a
              href="https://wa.me/919926909617?text=Hi%2C%20I%20have%20registered%20on%20Trillion%20Stock%20Research%20(SEBI%20Reg.%20INH000020129).%20Please%20share%20research%20updates."
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
            <p className="reg-wa-note">Tap above to open WhatsApp · +91 99269 09617</p>
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

  const openModal = (e) => { e?.preventDefault(); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  useScrollReveal();
  useNavScroll();

  useEffect(() => {
    const id = "tsr-styles";
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = CSS;
  });

  useEffect(() => {
    document.body.style.overflow = (menuOpen || modalOpen) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen, modalOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
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
          <span className="nav-sebi">SEBI Reg. INH000020129</span>
          <a href="#" className="nav-btn nav-btn-register" onClick={openModal}>Join Free Master Class</a>
        </div>
        <button className={`hamburger${menuOpen ? " open" : ""}`} onClick={() => setMenuOpen(o => !o)} aria-label="Toggle Menu">
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`} aria-hidden={!menuOpen}>
        {["services","about","reviews","contact"].map(h => (
          <a href={`#${h}`} key={h} onClick={closeMenu} style={{ textTransform:"capitalize" }}>{h}</a>
        ))}
        <a href="#" className="mob-cta" onClick={(e) => { closeMenu(); openModal(e); }}>
          Join Free Master Class
        </a>
      </div>

      <section className="tsr-hero">
        <div className="hero-inner">
          <div className="hero-text-col">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              SEBI Registered Research Analyst
            </div>
            <h1 className="tsr-h1">
              Trillion Stock
              <span className="h1-accent">Research</span>
              <span className="h1-italic">SEBI Registered Research Analyst</span>
            </h1>
            <p className="hero-desc">
              A SEBI-registered research analyst firm providing research-based analysis for equity, F&amp;O and portfolio segments. Investments are subject to market risks.
            </p>
            <div className="hero-btns">
              <button className="btn-register" onClick={openModal}>Join Free Master Class</button>
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
                <div className="trust-icon" style={{background:"var(--gold-faint)",border:"1px solid rgba(184,146,74,.25)",width:"28px",color:"var(--navy)"}}><Glyph name="bank" size={14} /></div>
                <span>Transparent</span>
              </div>
            </div>
          </div>

          <div className="hero-photo-col">
            <div className="hero-photo-wrap">
              <div className="hero-photo-frame">
                <img className="hero-photo-img" src="/trillions.png" alt="Trillion Stock Research Expert" />
                <div className="hero-photo-mat" />
                <div className="hero-photo-name">
                  Prachi Sharma
                  <span>Research Analyst</span>
                </div>
              </div>
              <div className="photo-badge">
                <img src="/sebi-small.png" alt="SEBI" style={{height:"26px",width:"auto",objectFit:"contain",display:"block",marginBottom:"4px",background:"#fff"}} />
                <div style={{fontSize:"10px",color:"var(--muted)",letterSpacing:".2px"}}>Reg. No: INH000020129</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-rule" />
      </section>

      <Ticker />
      <NumbersBar />

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
              <div className="svc-top">
                <div className="svc-num">{s.num}</div>
                <span className="svc-icon"><Glyph name={s.icon} /></span>
              </div>
              <div className="svc-title">{s.title}</div>
              <p className="svc-desc">{s.desc}</p>
              <span className="svc-tag">{s.tag}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="about" className="tsr-section why-bg">
        <div className="why-grid">
          <div className="reveal-left">
            <div className="section-eyebrow">Why Trillion Stock Research</div>
            <h2 className="section-h">Why Choose<br />Trillion Stock Research</h2>
            <p className="section-sub">We provide research, transparency and accountability — not just recommendations. SEBI registered and fully compliant with all applicable regulations.</p>
            <div className="why-list">
              {WHY_ITEMS.map((w, i) => (
                <div className={`why-item reveal d${i + 1}`} key={w.title}>
                  <div className="why-icon"><Glyph name={w.icon} /></div>
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
            <div className="disclaimer-box">
              <p><strong>Important:</strong> Investment in securities market is subject to market risks. Read all related documents carefully. SEBI Reg. No: <strong>INH000020129</strong></p>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="tsr-section testi-bg">
        <div className="testi-head reveal">
          <div className="section-eyebrow">Client Voices</div>
          <h2 className="section-h">What Our<br />Clients Say</h2>
        </div>
        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <div className={`testi-card reveal d${i + 1}`} key={t.name}>
              <div className="testi-quote">“</div>
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

      <section className="reg-strip">
        <div className="reg-strip-badge">Free Registration Open</div>
        <h2 className="reg-strip-h reveal">Register Today.<br /><span>Access Research Reports.</span></h2>
        <p className="reg-strip-sub reveal">Access research reports from a SEBI-registered research analyst platform. Research-based stock analysis, portfolio review guidance and market reports. Investments are subject to market risks.</p>
        <div className="reg-strip-perks reveal">
          {[["✓","SEBI Reg. INH000020129"],["✓","Written Research Reports"],["✓","Risk Disclosures Included"]].map(([icon,text]) => (
            <div className="reg-strip-perk" key={text}><span>{icon}</span>{text}</div>
          ))}
        </div>
        <button className="btn-register reveal" onClick={openModal}>Join Free Master Class</button>
        <p className="hero-register-note">⚠ Investments are subject to market risks. Read all documents carefully before investing.</p>
      </section>

      <section id="contact" className="cta-band">
        <div className="cta-inner">
          <div className="reveal-left">
            <div className="cta-h">Register Today<br /><span>& Access Research</span></div>
            <p className="cta-p">Sign up for free and access research-backed reports and market analysis directly from our SEBI-registered research analysts.</p>
          </div>
          <div className="cta-right reveal-right">
            <button className="btn-register" onClick={openModal}>Join Free Master Class</button>
            <a href="https://www.trillionstockresearch.com" className="btn-outline" target="_blank" rel="noreferrer">Visit Website</a>
            <p className="cta-note">SEBI Reg. No: INH000020129</p>
          </div>
        </div>
      </section>

      <footer className="tsr-footer">
        <div className="footer-top">
          <div className="reveal">
            <div className="footer-logo-main">Trillion <span>Stock</span> Research</div>
            <div className="footer-logo-sub">SEBI Registered Research Analyst</div>
            <p className="footer-about">SEBI-registered research analyst firm providing market research, investment analysis and research-backed Research Analyst services for investors.</p>
            <div className="footer-reg"><span style={{background:"#fff",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/sebi-small.png" alt="SEBI" style={{height:"13px",width:"auto",objectFit:"contain",display:"block"}} /></span> SEBI Reg. No: INH000020129</div>
            <div className="footer-reg" style={{marginTop:"6px"}}><span style={{background:"#fff",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/bselogo.png" alt="BSE" style={{height:"13px",width:"auto",objectFit:"contain",display:"block"}} /></span> BSE Enlistment No: 6528</div>
            <div className="footer-reg" style={{marginTop:"6px",fontSize:"10px"}}><span style={{background:"#fff",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/bselogo.png" alt="BSE" style={{height:"12px",width:"auto",objectFit:"contain",display:"block"}} /></span> Ad Approval: BSE/RA/ADVT/05012026-6528/03</div>
            <div className="footer-reg" style={{marginTop:"6px"}}><span style={{background:"#fff",padding:"1px 4px",display:"inline-flex",alignItems:"center"}}><img src="/iso.png" alt="ISO" style={{height:"14px",width:"auto",objectFit:"contain",display:"block"}} /></span> ISO 9001:2015 Certified</div>
          </div>
          <div className="footer-col reveal d1">
            <div className="footer-col-title">Services</div>
            {["Equity Research","Intraday research","Portfolio Research Analyst","F&O Research Analyst","Multibagger Research"].map(s => (
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
            <a href="https://www.instagram.com/trillions_stock_research_?igsh=Y3NmandlNGdwdTM%3D&utm_source=qr" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:"7px"}}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
            <a href="https://www.facebook.com/share/15hBBmFbGTV/?mibextid=wwXIfr" target="_blank" rel="noreferrer" style={{display:"flex",alignItems:"center",gap:"7px"}}>
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
          </div>
        </div>
        <div className="footer-disclaimer reveal">
          <div className="disc-title">Important Disclaimer</div>
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

      <div className="offer-bar-wrap">
        <div className="offer-bar">
          <div className="offer-bar-left">
            <div className="offer-price">Free Registration</div>
            <div className="offer-timer">SEBI Reg. INH000020129 · BSE: 6528</div>
          </div>
          <div className="offer-bar-mid">
            Investments are subject to market risks. Read all documents carefully.
          </div>
          <button className="offer-btn" onClick={openModal}>
            Join Free Master Class
          </button>
        </div>
      </div>

      <RegisterModal open={modalOpen} onClose={closeModal} />
    </>
  );
}
