import { useEffect } from "react";
import { Link } from "react-router-dom";
import UserCount from "../components/UserCount.jsx";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; min-width:0; }

:root {
  --navy: #0B1F36;
  --gold: #B8924A;
  --gold-2: #C9A55C;
  --gold-faint: rgba(184,146,74,.12);
  --paper: #F4F1EA;
  --paper-2: #EBE6DA;
  --white: #FDFCFA;
  --ink: #122033;
  --muted: #5A6A7A;
  --line: rgba(11,31,54,.10);
  --serif: 'Newsreader', Georgia, serif;
  --sans: 'DM Sans', system-ui, sans-serif;
  --max: 860px;
  --nav-h: 72px;
}

html { overflow-x: clip; max-width:100%; -webkit-text-size-adjust:100%; }
body {
  background: var(--paper) !important;
  color: var(--ink);
  font-family: var(--sans);
  padding-bottom: 0 !important;
  overflow-x: clip;
}

.tn-nav {
  position: sticky; top:0; z-index:50;
  height: var(--nav-h);
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  padding: 0 clamp(16px,4vw,48px);
  background: rgba(253,252,250,.94);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--line);
}
.tn-nav::before {
  content:''; position:absolute; top:0; left:0; right:0; height:2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}
.tn-logo { text-decoration:none; min-width:0; }
.tn-logo-main { font-family:var(--serif); font-size:20px; font-weight:500; color:var(--navy); }
.tn-logo-main span { color:var(--gold); }
.tn-logo-sub { font-size:10px; letter-spacing:1.6px; text-transform:uppercase; color:var(--muted); margin-top:3px; }
.tn-home {
  flex-shrink:0; font-size:13px; font-weight:600; color:var(--navy);
  text-decoration:none; border:1px solid var(--line); padding:10px 14px;
}
.tn-home:hover { border-color:var(--gold); color:var(--gold); }

.tn-hero {
  padding: clamp(36px,6vw,64px) clamp(16px,4vw,48px) 28px;
  border-bottom: 1px solid var(--line);
}
.tn-hero-inner { max-width:var(--max); margin:0 auto; }
.tn-eyebrow {
  font-size:11px; font-weight:600; letter-spacing:1.8px; text-transform:uppercase; color:var(--gold); margin-bottom:10px;
}
.tn-h1 { font-family:var(--serif); font-size:clamp(32px,5vw,52px); font-weight:500; color:var(--navy); line-height:1.15; }
.tn-sub { margin-top:12px; font-size:16px; color:var(--muted); line-height:1.7; max-width:640px; }

.tn-wrap { max-width:var(--max); margin:0 auto; padding: clamp(32px,5vw,56px) clamp(16px,4vw,48px) 80px; }
.tn-intro { font-size:16px; color:var(--ink); line-height:1.8; margin-bottom:32px; }
.tn-block { margin-bottom:28px; padding-bottom:24px; border-bottom:1px solid var(--line); }
.tn-block:last-of-type { border-bottom:none; }
.tn-h3 { font-family:var(--serif); font-size:22px; font-weight:500; color:var(--navy); margin-bottom:10px; }
.tn-p { font-size:15px; color:var(--muted); line-height:1.8; }

.tn-notice {
  background: var(--gold-faint);
  border: 1px solid rgba(184,146,74,.28);
  border-left: 3px solid var(--gold);
  padding: 18px 20px;
  margin: 12px 0 28px;
}
.tn-notice h3 { font-family:var(--serif); font-size:20px; color:var(--navy); margin-bottom:8px; }
.tn-notice p { font-size:14px; color:var(--muted); line-height:1.75; }

.tn-updated { font-size:13px; color:var(--muted); line-height:1.7; margin-bottom:36px; }
.tn-updated strong { color:var(--navy); display:block; margin-bottom:6px; font-size:14px; }

.tn-related { margin-top:8px; }
.tn-related h3 { font-size:11px; letter-spacing:1.6px; text-transform:uppercase; color:var(--gold); margin-bottom:12px; }
.tn-related-links { display:flex; flex-wrap:wrap; gap:8px; }
.tn-related-links a {
  font-size:13px; color:var(--navy); text-decoration:none;
  border:1px solid var(--line); padding:8px 12px; background:var(--white);
}
.tn-related-links a:hover { border-color:var(--gold); color:var(--gold); }

.tn-footer {
  background: var(--navy); color:#fff;
  padding: 32px clamp(16px,4vw,48px);
}
.tn-footer-inner { max-width:var(--max); margin:0 auto; }
.tn-footer p, .tn-footer a { font-size:13px; color:rgba(255,255,255,.6); line-height:1.7; }
.tn-footer a { color:var(--gold-2); text-decoration:none; }
.tn-footer a:hover { color:#fff; }
.tn-footer-meta { margin-top:14px; font-size:12px; color:rgba(255,255,255,.4); }
.footer-user-count { display:block; margin-top:10px; font-size:12px; color:rgba(255,255,255,.38); font-variant-numeric:tabular-nums; }
`;

const SECTIONS = [
  {
    title: "Website Access Agreement",
    body: "By accessing and using this website, you agree to be bound by the following terms and conditions.",
  },
  {
    title: "Free Trial Recommendations",
    body: "The free trial recommendations provided by Trillion Stock Research are intended solely for demonstration purposes. The decision to act upon or disregard these recommendations rests entirely with you.",
  },
  {
    title: "Research Recommendations",
    body: "Our research recommendations are based on the package you select. Our research analysts conduct comprehensive analysis to generate these recommendations. However, the final decision to follow or avoid these recommendations is yours. Trillion Stock Research will not be held liable for any gains or losses resulting from your decisions based on our recommendations.",
  },
  {
    title: "Limitation of Liability",
    body: "Trillion Stock Research does not accept responsibility for any losses arising from market fluctuations, delays in receiving recommendations, technical issues, or any inaccuracies in the information provided. Please be aware that investing and trading in the stock market involves inherent risks, and we are not liable for any losses or damages resulting from these activities.",
  },
  {
    title: "Confidentiality & Payments",
    body: "All employees, associates, and clients of Trillion Stock Research are strictly prohibited from sharing our research reports or any confidential information. Legal action will be pursued in cases of non-compliance with this policy. No employee or associate of Trillion Stock Research is permitted to accept gifts or personal benefits from clients. All payments should be made exclusively to the official account listed on our website, and not to any individual account.",
  },
  {
    title: "Account Security",
    body: "We do not manage Demat or trading accounts. Therefore, you should never share your account credentials, including user ID, password, security question answers, or OTPs, with any of our staff members. We will not be held responsible for any issues arising from the sharing of such details.",
  },
  {
    title: "Terms Modification",
    body: "Trillion Stock Research reserves the right to modify these terms and conditions at any time, without prior notice. Any changes will become effective immediately upon being posted on the website.",
  },
  {
    title: "User Acknowledgment",
    body: "By using this website, you acknowledge that you have read, understood, and agreed to the terms of this disclaimer. Trading in the stock market is inherently risky, and you accept full responsibility for the outcomes of your trading decisions, including any potential loss of capital. The information and recommendations provided on this website are intended for informational purposes only and should not be considered as financial advice or a solicitation to buy or sell any securities.",
  },
  {
    title: "Content Usage",
    body: "All content, research, and recommendations provided on this website are for personal use only. Reproduction or distribution of any content from this site without prior written consent from Trillion Stock Research is strictly prohibited.",
  },
  {
    title: "Final Agreement",
    body: "By continuing to use this website, you confirm your acceptance of these terms and conditions.",
  },
];

export default function Terms() {
  useEffect(() => {
    const id = "tsr-terms-styles";
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      document.head.appendChild(tag);
    }
    tag.textContent = CSS;
    const prevTitle = document.title;
    document.title = "Terms & Conditions - Trillion Stock Research | Legal Terms & User Agreement";
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
    };
  }, []);

  return (
    <>
      <nav className="tn-nav">
        <Link to="/" className="tn-logo">
          <div className="tn-logo-main">Trillion <span>Stock</span> Research</div>
          <div className="tn-logo-sub">SEBI Reg. INH000020129 · BSE Enlistment: 6528</div>
        </Link>
        <Link to="/" className="tn-home">Back to Home</Link>
      </nav>

      <header className="tn-hero">
        <div className="tn-hero-inner">
          <div className="tn-eyebrow">Legal</div>
          <h1 className="tn-h1">Terms &amp; Conditions</h1>
          <p className="tn-sub">Important legal terms and conditions for using our services</p>
        </div>
      </header>

      <main className="tn-wrap">
        <h2 className="tn-h3" style={{ marginBottom: 12 }}>Terms &amp; Conditions Overview</h2>
        <p className="tn-intro">
          Please read these terms and conditions carefully before using our services. By accessing and using this website, you acknowledge that you have read, understood, and agreed to be bound by these terms.
        </p>

        {SECTIONS.map((s) => (
          <section className="tn-block" key={s.title}>
            <h3 className="tn-h3">{s.title}</h3>
            <p className="tn-p">{s.body}</p>
          </section>
        ))}

        <div className="tn-notice">
          <h3>Important Notice</h3>
          <p>
            These terms and conditions constitute a legally binding agreement between you and Trillion Stock Research. Please ensure you have read and understood all terms before using our services.
          </p>
        </div>

        <p className="tn-updated">
          <strong>Last Updated</strong>
          These terms and conditions are regularly reviewed and updated to ensure compliance with the latest regulations and legal requirements. The last update was made on March 15, 2024.
        </p>

        <div className="tn-related">
          <h3>Related Legal Pages</h3>
          <div className="tn-related-links">
            <Link to="/policy">Policy</Link>
            <a href="https://www.trillionstockresearch.com/disclaimer" target="_blank" rel="noreferrer">Disclaimer</a>
            <a href="https://www.trillionstockresearch.com/refund" target="_blank" rel="noreferrer">Refund Policy</a>
            <a href="https://www.trillionstockresearch.com/disclosure" target="_blank" rel="noreferrer">SEBI Disclosure</a>
            <a href="https://www.trillionstockresearch.com/contact" target="_blank" rel="noreferrer">Contact Us</a>
          </div>
        </div>
      </main>

      <footer className="tn-footer">
        <div className="tn-footer-inner">
          <p>
            Contact Legal Support: <a href="tel:+919977555378">+91 99775 55378</a>
            <br />
            200 Sector A Suryadev Nagar, Indore, Madhya Pradesh, 452012
          </p>
          <p className="tn-footer-meta">© 2026 Trillion Stock Research. All rights reserved.</p>
          <UserCount />
        </div>
      </footer>
    </>
  );
}
