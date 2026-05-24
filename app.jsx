/* App shell — state, drawer routing, scroll spy, reveal observer.
   No Cmd-K palette per user request. */

const { useState, useEffect, useCallback, useRef } = React;

const SECTIONS = [
  { id: "top", num: "01", label: "Index" },
  { id: "about", num: "02", label: "About" },
  { id: "now", num: "03", label: "Now" },
  { id: "projects", num: "04", label: "Work" },
  { id: "certs", num: "05", label: "Certs" },
  { id: "contact", num: "06", label: "Contact" },
];

function Topbar({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={"topbar" + (scrolled ? " scrolled" : "")}>
      <div className="topbar-inner">
        <a href="#top" className="logo">
          <span className="dot"></span>
          <span>Joseph Ortiz</span>
        </a>
        <div className="topnav">
          {SECTIONS.slice(1).map(s => (
            <a key={s.id} href={"#" + s.id}
               style={active === s.id ? { color: "var(--text)", background: "var(--bg-elev)" } : null}>
              <span className="num">{s.num}</span>{s.label}
            </a>
          ))}
        </div>
        <a className="cmdk-trigger" href="https://www.linkedin.com/in/joeortiz1/" target="_blank" rel="noopener noreferrer">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
          <span>linkedin.com/in/joeortiz1</span>
        </a>
      </div>
    </nav>
  );
}

function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="label">02 · About</div>
            <h2>Engineering at the seam between <em>operators and agents.</em></h2>
          </div>
          <div className="meta">
            <span>est. 2014</span>
            <span>atlanta · ga</span>
          </div>
        </div>
        <div className="about-body">
          <p className="about-lead reveal">
            Salesforce engineer working toward architect-level scope, increasingly focused on the seam
            between human operators and AI agents.
          </p>
          <div className="reveal">
            <p style={{marginBottom: 18}}>
              Most of what I build now is about proving that a small team with good tooling can outrun
              a large team without it — whether that's running incident response through composed agents,
              surfacing tech debt across orgs before it bites, or wiring a personal context layer into
              every AI client I use.
            </p>
            <p>
              I care about the boring parts: approval gates, repro context, trend lines, the trust loop
              between automation and the people relying on it. The interesting work shows up after those
              are in place.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Now() {
  return (
    <section id="now" className="section now">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="label">03 · Now</div>
            <h2>What I'm <em>currently</em> on.</h2>
          </div>
          <div className="meta">
            <span>updated may 2026</span>
            <span>refresh · weekly</span>
          </div>
        </div>
        <div className="now-grid">
          <div className="now-cell reveal">
            <div className="tag studying"><span className="pip"></span> studying</div>
            <h4>Data Cloud Consultant</h4>
            <p>Next cert on the architect track — pairing real Data Cloud work with the cert as forcing function.</p>
          </div>
          <div className="now-cell reveal">
            <div className="tag building"><span className="pip"></span> building</div>
            <h4>automatic-chainsaw</h4>
            <p>Open Brain context layer — Supabase + pgvector + MCP, shared across every AI client we use.</p>
          </div>
          <div className="now-cell reveal">
            <div className="tag open"><span className="pip"></span> open to</div>
            <h4>Architect-track conversations</h4>
            <p>Especially teams figuring out where AI agents belong in their Salesforce delivery model.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ layout, onOpen }) {
  return (
    <section id="projects" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="label">04 · Work</div>
            <h2>Three things I'm <em>shipping</em> right now.</h2>
          </div>
          <div className="meta">
            <span>{PROJECTS.length} projects</span>
            <span>click to expand</span>
          </div>
        </div>
        <Projects layout={layout} onOpen={onOpen}/>
      </div>
    </section>
  );
}

const CERTS = [
  { id: "pd1", cloud: "Salesforce", name: "Platform Developer I", year: "" },
  { id: "adm", cloud: "Salesforce", name: "Administrator", year: "" },
  { id: "app", cloud: "Salesforce", name: "App Builder", year: "" },
];

function Certs() {
  return (
    <section id="certs" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <div className="label">05 · Credentials</div>
            <h2>Salesforce certifications, <em>and counting.</em></h2>
          </div>
          <div className="meta">
            <span>{CERTS.length} active · 1 in progress</span>
          </div>
        </div>
        <div className="cert-grid">
          {CERTS.map(c => (
            <div key={c.id} className="cert reveal">
              <div className="seal">SF</div>
              <div className="cloud">{c.cloud}</div>
              <div className="name">{c.name}</div>
              <div className="verify"><span className="ok-pip"></span> verified · trailhead</div>
            </div>
          ))}
          <div className="cert reveal" style={{borderStyle:"dashed", background:"transparent"}}>
            <div className="seal" style={{background:"transparent"}}>SF</div>
            <div className="cloud">In progress</div>
            <div className="name">Data Cloud Consultant</div>
            <div className="verify"><span className="ok-pip" style={{background:"var(--warn)"}}></span> studying · q2 2026</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="contact" className="section cta">
      <div className="container">
        <div className="label reveal">06 · Contact</div>
        <h2 className="reveal">Let's build the <em>small team with good tooling.</em></h2>
        <p className="sub reveal">
          If you're working on Salesforce engineering, AI-augmented operations, or the architect track —
          I'd like to hear about it. LinkedIn is the fastest way to reach me.
        </p>
        <div className="cta-actions reveal">
          <a className="btn btn-primary" href="https://www.linkedin.com/in/joeortiz1/" target="_blank" rel="noopener noreferrer">
            Reach out on LinkedIn <span className="arrow">→</span>
          </a>
          <a className="btn btn-ghost" href="https://github.com/joseph-ortiz" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className="btn btn-ghost" href="https://twitter.com/okjoeo" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© 2026 Joseph Ortiz · built with care in Atlanta</span>
        <span className="status"><span className="pip"></span> atlanta · ga</span>
      </div>
    </footer>
  );
}

const TWEAK_DEFAULTS = {
  "theme": "light",
  "density": "default",
  "heroVariant": "terminal",
  "projectLayout": "list"
};

function App() {
  const tweaks = TWEAK_DEFAULTS;
  const [openId, setOpenId] = useState(null);
  const [active, setActive] = useState("top");

  // Apply theme + density to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.theme);
    document.documentElement.setAttribute("data-density", tweaks.density);
  }, [tweaks.theme, tweaks.density]);

  // Scroll spy
  useEffect(() => {
    const ids = SECTIONS.map(s => s.id);
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Reveal observer (run after each render so newly mounted .reveal nodes get observed)
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [tweaks.projectLayout, tweaks.heroVariant]);

  const onNav = useCallback((dir) => {
    if (!openId) return;
    const i = PROJECTS.findIndex(p => p.id === openId);
    const next = (i + dir + PROJECTS.length) % PROJECTS.length;
    setOpenId(PROJECTS[next].id);
  }, [openId]);

  return (
    <>
      <Topbar active={active}/>
      <main id="top">
        <Hero variant={tweaks.heroVariant}/>
        <About/>
        <Now/>
        <ProjectsSection layout={tweaks.projectLayout} onOpen={setOpenId}/>
        <Certs/>
        <CTA/>
      </main>
      <Footer/>
      <Drawer projectId={openId} onClose={() => setOpenId(null)} onNav={onNav}/>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
