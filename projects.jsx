/* Projects — list/grid layout + slide-in case-study drawer.
   Drawer manages scroll lock, ESC, and ←/→ keyboard navigation between projects. */

const { useState, useEffect, useCallback } = React;

const PROJECTS = [
  {
    id: "chainsaw",
    index: "01",
    title: "automatic-chainsaw",
    tag: "Personal Life Harness",
    year: "2026",
    deck: "Harness engineering applied to personal life — a shared context layer my wife and I both use, accessible to any MCP-compatible AI client.",
    summary:
      "The same patterns I use to make Claude effective at work, turned on my own life. One Supabase + pgvector database, accessible to any MCP-compatible AI client (Claude Desktop, Claude Code, ChatGPT, Cursor). Every thought is tagged by owner, so we can scope to ‘mine’ or ‘ours’ without crossing wires.",
    stack: ["Supabase", "pgvector", "MCP", "Python", "Claude"],
    stats: [
      { k: "ingest sources", v: "4" },
      { k: "clients", v: "any MCP" },
      { k: "scope", v: "personal · shared" },
    ],
    problem:
      "Every AI client wants its own context — Claude Desktop has Projects, ChatGPT has Memory, Cursor has its own RAG. Switching between them means re-explaining who I am, what I’m working on, and what my wife and I are planning together. That cost compounds. I wanted the same kind of harness I’d build at work, but for personal life.",
    approach: [
      "Treat it as harness engineering, not a chatbot — durable session, explicit tools, scoped memory.",
      "Single source of truth: Supabase Postgres with pgvector for semantic recall.",
      "Owner-scoped chunks — every record tagged mine / hers / ours, queries scope cleanly.",
      "Python ingest workers pull from Gmail, Calendar, Drive, GitHub on a schedule.",
      "MCP server exposes search/append/scope tools — any compliant client plugs in.",
      "Architecturally: clients are the brain, MCP is the hands, database is durable session.",
    ],
    pipe: ["sources", "ingest.py", "embed", "pgvector", "mcp.server", "client"],
    influences: [
      { label: "Nate Jones’ OB1 pattern", url: "https://github.com/NateBJones-Projects/OB1" },
      { label: "Anthropic’s Managed Agents architecture", url: "https://www.anthropic.com/engineering/managed-agents" },
    ],
    repo: "github.com/joseph-ortiz/automatic-chainsaw",
  },
  {
    id: "skills",
    index: "02",
    title: "AI Skill Library for Salesforce",
    tag: "Skill Library",
    year: "2025–26",
    deck: "~30 composable Claude Code skills for the day-to-day reality of running Salesforce in production — and the orchestrations that turn them into entire incident lifecycles.",
    summary:
      "A personal library of focused agents for triaging tickets, auditing flow failures across orgs, drafting change requests, deploying releases, investigating MuleSoft errors, and rolling up timesheets. Each skill has its own tooling, prompts, and verification steps.",
    stack: ["Claude Code", "Skills", "MCP", "Salesforce", "ITSM", "MuleSoft"],
    stats: [
      { k: "skills", v: "~30" },
      { k: "approval gates", v: "every consequential step" },
      { k: "model", v: "human-in-the-loop" },
    ],
    problem:
      "The Salesforce engineer role is mostly a thousand small, structured tasks: triage, repro, change-request, deploy, verify, communicate. Any one of them is well-defined. None of them are interesting. Together, they swallow weeks.",
    approach: [
      "Each skill is a focused agent — narrow scope, explicit tools, verification step.",
      "Composability is the point: triage → itsm-investigate → change-request → cr-deploy.",
      "Human approval at every consequential boundary — agents propose, I confirm.",
      "Skills carry their own prompts and reference docs; no shared mega-prompt.",
      "Real work, not demos — measured on incidents closed and CRs shipped, not pretty traces.",
    ],
    pipe: ["triage", "itsm-investigate", "change-request", "cr-deploy", "verify"],
    influences: [
      { label: "Anthropic Skills — the model of narrow, composable agents with their own prompts, tools, and verification steps; beats one mega-prompt every time", url: "https://www.anthropic.com/news/skills" },
      { label: "Claude Code — the harness that makes it real: hooks, MCP servers, slash commands, durable memory across sessions", url: "https://www.anthropic.com/claude-code" },
      { label: "the ‘small team with good tooling’ thesis — a generalist with leverage outpaces a specialist without; tooling compounds across tasks" },
    ],
  },
  {
    id: "flowaudit",
    index: "03",
    title: "Flow Audit Scoreboard",
    tag: "Salesforce · Observability",
    year: "2025",
    deck: "Most teams find out about broken Salesforce Flows when a user complains. This gets ahead of it: a heat-check across 11 production orgs that turns invisible tech debt into something with an owner and a trend line.",
    summary:
      "Pulls Flow failure counts, ranks the hottest, drills into FlowInterview.Error to surface the actual root cause — not just the failing element. Findings become prioritized JSM tickets with reproduction context; running totals publish to a Confluence scoreboard the team actually reads.",
    stack: ["Multi-org", "Apex", "Tooling API", "JSM", "Confluence"],
    stats: [
      { k: "orgs scanned", v: "11" },
      { k: "cadence", v: "weekly" },
      { k: "output", v: "P3 tickets · scoreboard" },
    ],
    problem:
      "Salesforce Flow failures are quiet by default — the platform records them, but nothing surfaces them. The first signal is usually a user ticket with no error context. Across 11 orgs, that tail is enormous and invisible.",
    approach: [
      "Heat-check phase: count failures per Flow per org, rank by 7-day delta.",
      "Drill phase: pull FlowInterview.Error rows for the hottest Flows; cluster by root cause.",
      "Distill: one prioritized P3 ticket per cause with full repro context, not noise.",
      "Publish: running totals to a Confluence scoreboard with trend lines per org.",
      "Trust loop: tickets attribute back to scoreboard rows, so the team trusts the source.",
    ],
    pipe: ["heat-check", "drill (FlowInterview.Error)", "cluster", "JSM ticket", "Confluence"],
    influences: [
      { label: "Salesforce observability folklore — stuff engineers know from experience but no one formally documents (always check FlowInterview.Error, not just the user-facing error; Setup Audit Trail is the only source of truth for who touched what)" },
      { label: "the ‘invisible debt’ frame from SRE" },
    ],
  },
];

function Stack({ items }) {
  return (
    <div className="proj-stack">
      {items.map(s => <span key={s}>{s}</span>)}
    </div>
  );
}

function ProjectList({ projects, onOpen }) {
  return (
    <div className="proj-list">
      {projects.map(p => (
        <div key={p.id} className="proj-row reveal" onClick={() => onOpen(p.id)}
             role="button" tabIndex={0}
             onKeyDown={e => { if (e.key === "Enter") onOpen(p.id); }}>
          <div className="proj-index">{p.index} / {String(projects.length).padStart(2,"0")}</div>
          <div className="proj-body">
            <div className="proj-kicker">
              <span className="pill">{p.tag}</span>
              <span className="year">{p.year}</span>
            </div>
            <h3 className="proj-title">{p.title}</h3>
            <p className="proj-sub">{p.summary}</p>
            <Stack items={p.stack}/>
          </div>
          <div className="proj-open">
            {p.stats[0] && (
              <span className="stat"><b>{p.stats[0].v}</b><span>{p.stats[0].k}</span></span>
            )}
            <span className="open-link">
              read case study <span className="arrow">↗</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectGrid({ projects, onOpen }) {
  return (
    <div className="proj-grid">
      {projects.map(p => (
        <div key={p.id} className="proj-card reveal" onClick={() => onOpen(p.id)}>
          <div className="proj-kicker">
            <span className="pill">{p.tag}</span>
            <span className="year">{p.year}</span>
          </div>
          <h3 className="proj-title">{p.title}</h3>
          <p className="proj-sub">{p.deck}</p>
          <Stack items={p.stack.slice(0, 4)}/>
          <div className="proj-open">
            <span className="open-link">read case study <span className="arrow">↗</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}

function Pipeline({ steps }) {
  return (
    <div className="drawer-pipe">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <span className="step"><code>{s}</code></span>
          {i < steps.length - 1 && <span className="pipe">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function Drawer({ projectId, onClose, onNav }) {
  const p = PROJECTS.find(x => x.id === projectId);
  const isOpen = !!p;

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("scroll-lock");
    const onKey = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") onNav(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("scroll-lock");
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose, onNav]);

  // Always render so the close animation runs; just toggle .open
  return (
    <>
      <div className={"drawer-backdrop" + (isOpen ? " open" : "")} onClick={onClose}></div>
      <aside className={"drawer" + (isOpen ? " open" : "")} aria-hidden={!isOpen}>
        {p && (
          <>
            <div className="drawer-head">
              <div className="path">
                <span>portfolio</span>
                <span className="slash">/</span>
                <span>projects</span>
                <span className="slash">/</span>
                <span className="last">{p.id}</span>
              </div>
              <button className="drawer-close" onClick={onClose}>
                close <kbd>esc</kbd>
              </button>
            </div>
            <div className="drawer-body">
              <div className="drawer-eyebrow">
                <span className="pill">{p.tag}</span>
                <span>{p.year}</span>
                <span style={{color:"var(--text-4)"}}>· {p.index} of {String(PROJECTS.length).padStart(2,"0")}</span>
              </div>
              <h2 className="drawer-title">{p.title}</h2>
              <p className="drawer-deck">{p.deck}</p>

              <div className="drawer-meta">
                {p.stats.map(s => (
                  <div key={s.k}>
                    <div className="k">{s.k}</div>
                    <div className="v">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="drawer-section">
                <h4>The problem</h4>
                <p>{p.problem}</p>
              </div>

              <div className="drawer-section">
                <h4>Approach</h4>
                <ul>
                  {p.approach.map((a, i) => (
                    <li key={i} dangerouslySetInnerHTML={{ __html: a.replace(/`([^`]+)`/g, "<code>$1</code>") }}/>
                  ))}
                </ul>
              </div>

              <div className="drawer-section">
                <h4>Pipeline</h4>
                <Pipeline steps={p.pipe}/>
              </div>

              <div className="drawer-section">
                <h4>Stack</h4>
                <Stack items={p.stack}/>
              </div>

              <div className="drawer-section">
                <h4>Influences</h4>
                <p>
                  {p.influences.map((inf, i) => (
                    <span key={i}>
                      {i > 0 && " · "}
                      {inf.url
                        ? <a href={inf.url} target="_blank" rel="noopener noreferrer" style={{color:"var(--text)", textDecoration:"underline", textUnderlineOffset:"3px"}}>{inf.label}</a>
                        : inf.label}
                    </span>
                  ))}
                </p>
              </div>

              {p.repo && (
                <div className="drawer-section">
                  <h4>Source</h4>
                  <p style={{fontFamily:"var(--font-mono)", fontSize:14, color:"var(--text)"}}>
                    {p.repo}
                  </p>
                </div>
              )}

              <div style={{display:"flex", justifyContent:"space-between", marginTop:48, paddingTop:24, borderTop:"1px solid var(--line-soft)"}}>
                <button className="btn btn-ghost" onClick={() => onNav(-1)}>
                  ← previous
                </button>
                <button className="btn btn-ghost" onClick={() => onNav(1)}>
                  next →
                </button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function Projects({ layout, onOpen }) {
  if (layout === "grid") return <ProjectGrid projects={PROJECTS} onOpen={onOpen}/>;
  return <ProjectList projects={PROJECTS} onOpen={onOpen}/>;
}

Object.assign(window, { Projects, Drawer, PROJECTS });
