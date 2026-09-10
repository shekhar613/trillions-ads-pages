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
.tn-quote {
  margin-top:18px; font-size:14px; color:var(--muted); font-style:italic; line-height:1.7;
  border-left:3px solid var(--gold); padding-left:14px;
}

.tn-wrap { max-width:var(--max); margin:0 auto; padding: clamp(32px,5vw,56px) clamp(16px,4vw,48px) 80px; }
.tn-intro { font-size:16px; color:var(--ink); line-height:1.8; margin-bottom:32px; }
.tn-block { margin-bottom:28px; padding-bottom:24px; border-bottom:1px solid var(--line); }
.tn-h3 { font-family:var(--serif); font-size:22px; font-weight:500; color:var(--navy); margin-bottom:10px; }
.tn-p { font-size:15px; color:var(--muted); line-height:1.8; margin-bottom:12px; }
.tn-list { margin:0; padding-left:18px; }
.tn-list li { font-size:15px; color:var(--muted); line-height:1.8; margin-bottom:10px; }
.tn-list a { color:var(--navy); }

.tn-notice {
  background: var(--gold-faint);
  border: 1px solid rgba(184,146,74,.28);
  border-left: 3px solid var(--gold);
  padding: 18px 20px;
  margin: 0 0 32px;
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

const PRIVACY = [
  "Welcome to Trillion Stock Research. We understand and respect your privacy, and we are committed to protecting it. In order to provide transparency and clarity on how we collect and use your information, we have created this notice which outlines our online information practices and your options for providing and managing that information.",
  "Protecting your privacy and data is extremely important to us. We take measures to ensure the security and confidentiality of any information shared with us. We will only use personally identifiable information for the purposes to which you have consented. However, we cannot guarantee the security of your information 100%, despite our efforts to protect it. Any information you transmit to us through our online services is done at your own risk.",
  "Please note that you may receive calls related to service promotions, contests, and pools organized by us. Your information, whether public or private, will be held with us only. However, it may be transferred or given to our regulatory authorities and their related organizations, as well as any organizations or individuals with whom we have an interest for any reason, without your consent.",
  "In addition of the services we provide to you, we may also use your personal information such as your mobile number and email address to send you newsletters, surveys, contest information, or updates on any new services that we believe may be beneficial to you. By subscribing to our services, you agree to allow Trillion Stock Research to use your personal information for these purposes.",
  "By submitting the 'Inquiry form' on this website or through any other means, including social media, you are providing your consent to allow us to contact you via phone call, SMS, or WhatsApp on the number provided by you. Even if your mobile number is registered on the National 'Do Not Disturb' registry, you agree to receive communication from us. We appreciate your trust in us and assure you that we will always respect your privacy.",
];

const LIST_SECTIONS = [
  {
    title: "Terms of Service",
    items: [
      "By using our services, you agree to these terms and conditions.",
      "We reserve the right to modify or terminate services at any time.",
      "Users must be at least 18 years old to use our services.",
      "You are responsible for maintaining the confidentiality of your account.",
      "We are not liable for any investment losses incurred.",
    ],
  },
  {
    title: "Security Policy",
    items: [
      "We use industry-standard encryption to protect your data.",
      "Regular security audits are conducted to ensure system safety.",
      "Two-factor authentication is available for enhanced security.",
      "We maintain secure backup systems for your data.",
      "Access to your information is strictly controlled and monitored.",
    ],
  },
  {
    title: "Investment Policy",
    items: [
      "All investment advice is based on thorough research and analysis.",
      "We maintain transparency in our investment strategies.",
      "Regular portfolio reviews and updates are provided.",
      "Risk management is a key component of our investment approach.",
      "We comply with all SEBI regulations and guidelines.",
    ],
  },
  {
    title: "Disclosure Policy",
    items: [
      "We maintain full transparency in our operations.",
      "All fees and charges are clearly disclosed upfront.",
      "Regular updates are provided on portfolio performance.",
      "Any conflicts of interest are disclosed immediately.",
      "We maintain accurate records of all transactions.",
    ],
  },
  {
    title: "Refund Policy",
    items: [
      "All sales are final, and we do not offer refunds for the paid period of services already availed by the client.",
      "As per SEBI guidelines, refunds shall only be issued for the unused portion of the subscription period on a pro-rata basis.",
      "Refunds will not be provided for the period of services already availed, irrespective of client satisfaction.",
      "Trading/Investment in Securities Markets are always subjected to Market Risk.",
      "Trillion Stock Research shall not be liable for any trade losses incurred based on the research provided.",
    ],
  },
];

export default function Policy() {
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
    document.title = "Our Policies - Trillion Stock Research";
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
          <h1 className="tn-h1">Our Policies</h1>
          <p className="tn-sub">Transparency and trust are the cornerstones of our service</p>
          <p className="tn-quote">
            “Investment in securities market are subject to market risks. Read all the related documents carefully before investing.”
          </p>
        </div>
      </header>

      <main className="tn-wrap">
        <div className="tn-notice">
          <h3>Refund Policy</h3>
          <p>
            All sales are final, and we do not offer refunds for the paid period of services already availed by the client. As per SEBI guidelines, refunds shall only be issued for the unused portion of the subscription period on a pro-rata basis.
          </p>
        </div>

        <h2 className="tn-h3" style={{ marginBottom: 12 }}>Comprehensive Policy Framework</h2>
        <p className="tn-intro">
          At Trillion Stock Research, we maintain strict policies to ensure the highest standards of service, security, and compliance. Our policies are designed to protect your interests and maintain transparency in all our operations.
        </p>

        <section className="tn-block">
          <h3 className="tn-h3">Privacy Policy</h3>
          {PRIVACY.map((p) => (
            <p className="tn-p" key={p.slice(0, 40)}>{p}</p>
          ))}
        </section>

        {LIST_SECTIONS.map((s) => (
          <section className="tn-block" key={s.title}>
            <h3 className="tn-h3">{s.title}</h3>
            <ul className="tn-list">
              {s.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {s.title === "Refund Policy" && (
              <p className="tn-p" style={{ marginTop: 12 }}>
                <a href="https://www.trillionstockresearch.com/refund" target="_blank" rel="noreferrer">Click to view full policy →</a>
              </p>
            )}
          </section>
        ))}

        <p className="tn-updated">
          <strong>Last Updated</strong>
          Our policies are regularly reviewed and updated to ensure compliance with the latest regulations and best practices. The last update was made on March 15, 2024.
        </p>

        <div className="tn-related">
          <h3>Related Legal Pages</h3>
          <div className="tn-related-links">
            <Link to="/terms">Terms &amp; Conditions</Link>
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
            Contact Support: <a href="tel:+919977555378">+91 99775 55378</a>
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
