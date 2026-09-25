'use client'

import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  GitBranch,
  Mail,
  Menu,
  Network,
  Send,
  Server,
  Sparkles,
  Terminal,
  X,
  Zap,
} from 'lucide-react'

const projects = [
  { name: 'Movix', category: 'ENTERTAINMENT PLATFORM', description: 'A high-performance movie and TV discovery experience with dynamic API data, smart filters, responsive carousels, and rich media UI.', tech: ['React', 'Redux', 'REST API', 'Tailwind'], href: 'https://movix-site.vercel.app/', accent: 'violet' },
  { name: 'H-Rent', category: 'REAL ESTATE PRODUCT', description: 'A streamlined rental platform with listing management, clean search filters, responsive property cards, and optimized user flows.', tech: ['Next.js', 'Node.js', 'Tailwind', 'Database'], href: 'https://rent-in.vercel.app/', accent: 'cyan' },
  { name: 'Embarkist', category: 'STARTUP ECOSYSTEM', description: 'A flagship product ecosystem built for high-performance onboarding, product showcases, and a modular architecture.', tech: ['Modern Web', 'Cloud', 'Responsive UI'], href: 'https://embarkisttesting.netlify.app/', accent: 'emerald' },
]

const skillGroups = [
  { title: 'Frontend Engineering', icon: Code2, skills: ['React.js', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5 / CSS3'] },
  { title: 'Backend & Core', icon: Server, skills: ['Java', 'Node.js', 'Express', 'REST APIs', 'System Design'] },
  { title: 'Databases & Cloud', icon: Database, skills: ['PostgreSQL', 'MongoDB', 'MySQL', 'AWS', 'Vercel', 'Netlify'] },
  { title: 'Tools & Workflow', icon: Terminal, skills: ['Git', 'GitHub', 'Docker', 'Postman'] },
]

const process = [
  ['01', 'Architecture & Strategy', 'Planning the right stack, roadmaps, and schema before a line of code ships.'],
  ['02', 'UI/UX & Prototyping', 'Crafting intuitive, accessible interfaces that feel as good as they perform.'],
  ['03', 'Development & Integration', 'Writing clean, modular, scalable code with resilient API integrations.'],
  ['04', 'Deployment & Optimization', 'Shipping with CI/CD, Core Web Vitals, and speed monitoring in mind.'],
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sent, setSent] = useState(false)

  return (
    <main className="site-shell">
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="Work with Shivam home"><span>SS</span><i>.</i></a>
          <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
            {['about', 'role', 'projects', 'skills', 'process', 'contact'].map((item) => <a key={item} href={`#${item}`} onClick={() => setMenuOpen(false)}>{item}</a>)}
            <a className="nav-linkedin" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn <ArrowUpRight size={14} /></a>
          </div>
          <a className="nav-cta" href="#contact">Let&apos;s Talk <ArrowUpRight size={15} /></a>
          <button className="menu-btn" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </nav>
      </header>

      <section id="top" className="hero container">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse" /> Available for Projects &amp; Advisory</div>
          <p className="kicker">CHIEF TECHNOLOGY OFFICER · FULL-STACK ARCHITECT</p>
          <h1>Engineering scalable products <em>that matter.</em></h1>
          <p className="hero-sub">Hi, I&apos;m Shivam. CTO at <strong>Embarkist</strong> and full-stack software engineer building reliable tech solutions from 0 to 1.</p>
          <div className="hero-actions"><a className="button button-primary" href="#projects">Explore projects <ChevronRight size={17} /></a><a className="button button-ghost" href="#contact">Get in touch <Mail size={16} /></a></div>
          <div className="socials"><a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><GitBranch /></a><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Network /></a><a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X"><span className="x-icon">𝕏</span></a><a href="mailto:hello@wrkwithshivam.dev" aria-label="Email"><Mail /></a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><div className="orb"><span>W</span></div><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="float-chip chip-one"><Zap size={13} /> Product strategy</div><div className="float-chip chip-two"><Network size={13} /> Scalable systems</div><div className="float-chip chip-three"><Sparkles size={13} /> 0 → 1 builder</div></div>
      </section>

      <div className="marquee" aria-label="Technologies"><div className="marquee-inner">{['React.js', 'Next.js', 'Node.js', 'TypeScript', 'System Design', 'PostgreSQL', 'AWS', 'Tailwind CSS', 'Docker', 'REST APIs'].map((s, i) => <span key={`${s}-${i}`}>{s} <i>✦</i></span>)}</div></div>

      <section id="about" className="section container about-grid"><div className="section-label">01 / ABOUT</div><div><h2>Technical depth.<br /><em>Human perspective.</em></h2><p className="lead">I work at the intersection of engineering, product, and business — turning complex problems into simple, durable experiences.</p><p className="muted">Whether I&apos;m setting the technical direction for a startup or building a product from scratch, my focus stays the same: thoughtful architecture, sharp execution, and software that creates real momentum.</p></div></section>

      <section id="role" className="section container"><div className="section-label">02 / CURRENT ROLE</div><div className="role-card"><div className="role-mark">E<span>.</span></div><div className="role-content"><div className="role-top"><span className="status">CURRENT ROLE / LEADERSHIP</span><span className="role-year">2024 — PRESENT</span></div><h2>Chief Technology Officer <span>at Embarkist</span></h2><p>Leading technology strategy, architecture, and end-to-end development of digital products and scalable infrastructure.</p><a href="https://embarkisttesting.netlify.app/" target="_blank" rel="noopener noreferrer">Visit Embarkist <ExternalLink size={15} /></a></div><ArrowUpRight className="role-arrow" /></div></section>

      <section id="projects" className="section container"><div className="section-heading"><div><div className="section-label">03 / SELECTED WORK</div><h2>Built to <em>ship.</em></h2></div><p>Selected products, platforms, and systems<br />that I&apos;ve helped bring to life.</p></div><div className="project-grid">{projects.map((p, i) => <article className={`project-card ${p.accent}`} key={p.name}><div className="project-visual"><div className="visual-window"><div className="window-dots"><i /><i /><i /></div><div className="visual-code"><span>const</span> <b>{i === 0 ? 'discover' : i === 1 ? 'space' : 'embark'}</b> = <strong>build</strong>()<br /><small>// made for the real world</small></div></div><span className="project-index">0{i + 1}</span></div><div className="project-body"><span className="project-category">{p.category}</span><h3>{p.name}</h3><p>{p.description}</p><div className="tag-row">{p.tech.map(t => <span key={t}>{t}</span>)}</div><a className="project-link" href={p.href} target="_blank" rel="noopener noreferrer">Live site <ArrowUpRight size={16} /></a></div></article>)}</div></section>

      <section id="skills" className="section container"><div className="section-label">04 / CAPABILITIES</div><div className="section-heading"><h2>The stack behind<br /><em>the work.</em></h2><p>Tools are just tools. The value is knowing<br />when and how to use them.</p></div><div className="skills-grid">{skillGroups.map(g => <div className="skill-card" key={g.title}><g.icon /><h3>{g.title}</h3><div className="skill-list">{g.skills.map(s => <span key={s}><Check size={13} />{s}</span>)}</div></div>)}</div></section>

      <section id="process" className="section container process-section"><div className="section-label">05 / HOW I WORK</div><div className="section-heading"><h2>A clear path from<br /><em>idea to impact.</em></h2></div><div className="process-grid">{process.map(([num, title, text]) => <div className="process-step" key={num}><span>{num}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

      <section id="contact" className="contact-section"><div className="container contact-grid"><div><div className="section-label">06 / START A CONVERSATION</div><h2>Ready to scale your<br /><em>next product?</em></h2><p>Have a product idea, a technical challenge, or a team that needs a technology partner? I&apos;d love to hear about it.</p><a className="email-link" href="mailto:hello@wrkwithshivam.dev">hello@wrkwithshivam.dev <ArrowUpRight size={18} /></a></div><form onSubmit={(e) => { e.preventDefault(); setSent(true) }}>{sent ? <div className="sent-state"><Check size={30} /><h3>Message received.</h3><p>Thanks for reaching out. I&apos;ll be in touch soon.</p></div> : <><label>Name<input required name="name" placeholder="Your name" /></label><label>Email<input required type="email" name="email" placeholder="you@company.com" /></label><label>Project description<textarea required name="message" rows={4} placeholder="Tell me a little about what you&apos;re building..." /></label><button className="button button-primary" type="submit">Send message <Send size={15} /></button></>}</form></div></section>

      <footer className="footer container"><a className="brand" href="#top"><span>SS</span><i>.</i></a><p>© {new Date().getFullYear()} Shivam Singh · Built with intention.</p><div><a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a><a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a><a href="#top">Back to top ↑</a></div></footer>
    </main>
  )
}
