const { useState, useEffect, useMemo } = React;

const Arrow = (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;

function Nav({ current }) {
  useEffect(() => {
    if (!location.hash) return;
    const id = decodeURIComponent(location.hash.slice(1));
    // Try a few times in case the section mounts after Nav does
    let tries = 0;
    const tick = () => {
      const el = document.getElementById(id);
      if (el) { el.scrollIntoView({ behavior: 'instant', block: 'start' }); return; }
      if (tries++ < 20) setTimeout(tick, 50);
    };
    tick();
  }, []);
  return (
    <header className="nav">
      <div className="container nav-inner">
        <a href="TeeeVEE%20Landing.html" className="logo">
          <span className="logo-mark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12v3h-4v13h-4V7H6z"/></svg>
          </span>
          <span>TeeeVEE</span>
        </a>
        <nav className="nav-links">
          <a href="TeeeVEE%20Landing.html#what" className={current === 'home' ? 'active' : ''}>Home</a>
          <a href="channels.html" className={current === 'channels' ? 'active' : ''}>Channels</a>
          <a href="setup.html" className={current === 'players' ? 'active' : ''}>Players</a>
          <a href="Installation.html" className={current === 'install' ? 'active' : ''}>Install</a>
          <a href="Reseller.html" className={current === 'reseller' ? 'active' : ''}>Reseller</a>
          <a href="TeeeVEE%20Landing.html#pricing">Pricing</a>
          <a href="TeeeVEE%20Landing.html#faq">FAQ</a>
        </nav>
        <div className="nav-cta">
          <a href="TeeeVEE%20Landing.html#pricing" className="btn btn-ghost btn-sm">Pricing</a>
          <a href={current === 'reseller' ? 'https://shop.iduck.xyz/store/boomcash/credits' : 'https://shop.iduck.xyz/store/flyers'} className="btn btn-primary btn-sm">Get started <Arrow /></a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container foot-row">
        <div>© 2026 TeeeVEE · <a href="mailto:support@teeeveee.nl" style={{color:'var(--accent)'}}>support@teeeveee.nl</a></div>
        <div style={{display:'flex', gap:18}}>
          <a href="TeeeVEE%20Landing.html">Home</a>
          <a href="channels.html">Channels</a>
          <a href="setup.html">Players</a>
          <a href="Installation.html">Install</a>
          <a href="Reseller.html">Reseller</a>
          <a href="TeeeVEE%20Landing.html#pricing">Pricing</a>
        </div>
      </div>
    </footer>
  );
}

window.Nav = Nav;
window.Footer = Footer;
window.Arrow = Arrow;
