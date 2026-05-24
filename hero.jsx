/* Hero — left: name, eyebrow, subtitle chips, description, CTAs.
   Right: animated terminal "now running" widget. */

const { useState, useEffect, useRef } = React;

const HERO_LINES = [
  { type: "cmd", text: "joe@atlanta ~ $ skills run incident.lifecycle" },
  { type: "out", text: "› loading 30 skills from ~/.claude/skills" },
  { type: "ok",  text: "✓ triage              [1.2s]" },
  { type: "ok",  text: "✓ itsm-investigate    [3.8s]" },
  { type: "ok",  text: "✓ change-request      [0.9s]" },
  { type: "ok",  text: "✓ cr-deploy           [12.4s]" },
  { type: "out", text: "› human approval gate ⏎ … approved" },
  { type: "ok",  text: "✓ incident #INC-4081 closed in 4m 23s" },
  { type: "spacer" },
  { type: "cmd", text: "joe@atlanta ~ $ chainsaw ingest --since 24h" },
  { type: "out", text: "› gmail …… 142 threads → 38 chunks" },
  { type: "out", text: "› calendar … 7 events → 7 chunks" },
  { type: "out", text: "› drive ……… 4 docs → 22 chunks" },
  { type: "out", text: "› github …… 11 PRs → 11 chunks" },
  { type: "ok",  text: "✓ 78 embeddings → pgvector (open_brain)" },
  { type: "spacer" },
  { type: "cmd", text: "joe@atlanta ~ $ flowaudit --orgs all" },
  { type: "out", text: "› scanning 11 production orgs" },
  { type: "warn", text: "! 6 hot flows · 1,243 failures (7d)" },
  { type: "ok",  text: "✓ 6 JSM tickets opened · scoreboard published" },
];

function renderLine(line, i) {
  if (line.type === "spacer") return <span key={i} className="term-line">&nbsp;</span>;
  if (line.type === "cmd") {
    const [, prompt, rest] = line.text.match(/^(joe@atlanta ~ \$)(.*)$/) || [null, "", line.text];
    return (
      <span key={i} className="term-line">
        <span className="prompt">{prompt}</span>
        <span className="key">{rest}</span>
      </span>
    );
  }
  if (line.type === "ok") return <span key={i} className="term-line"><span className="ok">{line.text}</span></span>;
  if (line.type === "warn") return <span key={i} className="term-line"><span className="warn">{line.text}</span></span>;
  if (line.type === "err") return <span key={i} className="term-line"><span className="err">{line.text}</span></span>;
  return <span key={i} className="term-line"><span className="dim">{line.text}</span></span>;
}

function Terminal() {
  const [shown, setShown] = useState(0);
  const [tick, setTick] = useState(0);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (shown >= HERO_LINES.length) {
      // pause, then loop
      const t = setTimeout(() => setShown(0), 3600);
      return () => clearTimeout(t);
    }
    const line = HERO_LINES[shown];
    const delay = line.type === "spacer" ? 120 : line.type === "cmd" ? 540 : 360;
    const t = setTimeout(() => setShown(s => s + 1), delay);
    return () => clearTimeout(t);
  }, [shown]);

  // gentle scroll to bottom
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [shown]);

  // clock
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  const visible = HERO_LINES.slice(0, shown);
  const last = HERO_LINES[shown - 1];
  const showCursor = !last || last.type === "cmd";

  return (
    <div className="term" aria-hidden="true">
      <div className="term-head">
        <span className="dots"><span></span><span></span><span></span></span>
        <span className="title">~/skills · live</span>
        <span className="badge">● running</span>
      </div>
      <div className="term-body" ref={bodyRef}>
        {visible.map(renderLine)}
        {showCursor && <span className="term-cursor"></span>}
      </div>
      <div className="term-foot">
        <span className="seg">
          <span><b>skills</b> 30</span>
          <span><b>mcp</b> 6</span>
          <span><b>orgs</b> 11</span>
        </span>
        <span className="seg">
          <span>atl · {hh}:{mm}:<span style={{ color: "var(--accent)" }}>{ss}</span></span>
        </span>
      </div>
    </div>
  );
}

function HeroSideQuiet() {
  return (
    <aside className="hero-side-quiet">
      <div className="row"><span className="k">role</span><span className="v">Salesforce Engineer<span className="v dim"> · architect-track</span></span></div>
      <div className="row"><span className="k">focus</span><span className="v">AI-augmented operations</span></div>
      <div className="row"><span className="k">stack</span><span className="v dim">Apex · Flow · MCP · Claude · pgvector · Python</span></div>
      <div className="row"><span className="k">orgs</span><span className="v">11 production</span></div>
      <div className="row"><span className="k">skills</span><span className="v">~30 composable</span></div>
      <div className="row"><span className="k">based</span><span className="v">Atlanta, GA</span></div>
      <div className="row"><span className="k">status</span><span className="v" style={{color:"var(--ok)"}}>● open to architect-track conversations</span></div>
    </aside>
  );
}

function Hero({ variant }) {
  return (
    <header className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <div className="hero-eyebrow reveal in">
              <span className="marker"></span>
              <span>JO · 026 — portfolio · v2026.05</span>
            </div>
            <h1 className="hero-title reveal in">
              Salesforce<br/>engineer, <span className="it">with agents</span>.
            </h1>
            <div className="hero-sub reveal in">
              <span className="chip"><span className="sq"></span> Atlanta, GA</span>
              <span className="chip"><span className="sq"></span> 11 production orgs</span>
              <span className="chip"><span className="sq"></span> ~30 Claude Code skills</span>
            </div>
            <p className="hero-desc reveal in">
              I build AI-augmented operations — agent harnesses, automated ITSM pipelines, and tooling
              that compresses hours of admin work into minutes. Proving a small team with good tooling
              can outrun a large team without it.
            </p>
            <div className="hero-cta-row reveal in">
              <a className="btn btn-primary" href="https://www.linkedin.com/in/joeortiz1/" target="_blank" rel="noopener noreferrer">
                Get in touch
                <span className="arrow">→</span>
              </a>
              <a className="btn btn-ghost" href="#projects">
                See the work
              </a>
              <span className="social-row">
                <a href="https://github.com/joseph-ortiz" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                </a>
                <a href="https://www.linkedin.com/in/joeortiz1/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="https://twitter.com/okjoeo" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                </a>
              </span>
            </div>
          </div>

          {variant === "quiet" ? <HeroSideQuiet/> : <Terminal/>}
        </div>
      </div>
    </header>
  );
}

Object.assign(window, { Hero });
