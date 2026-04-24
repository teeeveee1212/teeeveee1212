const { useState, useEffect, useRef, useMemo } = React;

// ---------------- Data ----------------
// Plans per real site: trial is 1-connection only.
// 1-connection prices: 1m $6.50, 3m $18, 6m $33, 12m $55
// 2-connection prices: 1m $12, 3m $33, 6m $60, 12m $100
const PLANS_1 = [
  { id: 'trial', name: '24 Hour Trial', duration: '24h', price: 2.5, note: 'Credited on upgrade', best: false,
    perks: ['Full access · 24 hours', '10,000+ live channels', 'HD & 4K quality', '1 connection'] },
  { id: '1m', name: '1 Month', duration: '1 mo', price: 6.5, note: 'Flexible monthly', best: false,
    perks: ['10,000+ live channels', 'HD & 4K quality', 'Anti-freeze tech', '24/7 support'] },
  { id: '3m', name: '3 Months', duration: '3 mo', price: 18, note: '$6.00 / month', best: false,
    perks: ['10,000+ live channels', 'HD & 4K quality', 'Anti-freeze tech', '24/7 support'] },
  { id: '6m', name: '6 Months', duration: '6 mo', price: 33, note: '$5.50 / month', best: true,
    perks: ['10,000+ live channels', 'HD & 4K quality', 'Anti-freeze tech', 'Priority support'] },
  { id: '12m', name: '12 Months', duration: '12 mo', price: 55, note: '$4.58 / month', best: false,
    perks: ['10,000+ live channels', 'HD & 4K quality', 'Anti-freeze tech', 'VIP support'] },
];
const PLANS_2 = [
  { id: 'trial', name: '24 Hour Trial', duration: '24h', price: 2.5, note: '1-connection only', best: false, disabled: true,
    perks: ['Trial is 1-connection', 'Upgrade after trial', 'All channels unlocked'] },
  { id: '1m', name: '1 Month', duration: '1 mo', price: 12, note: '2 simultaneous streams', best: false,
    perks: ['2 simultaneous streams', '40,000+ VOD library', 'HD & 4K quality', 'Anti-freeze tech', '24/7 support'] },
  { id: '3m', name: '3 Months', duration: '3 mo', price: 33, note: '$11.00 / month', best: false,
    perks: ['2 simultaneous streams', '40,000+ VOD library', 'HD & 4K quality', 'Anti-freeze tech', '24/7 support'] },
  { id: '6m', name: '6 Months', duration: '6 mo', price: 60, note: '$10.00 / month', best: true,
    perks: ['2 simultaneous streams', '40,000+ VOD library', 'HD & 4K quality', 'Anti-freeze tech', 'Priority support'] },
  { id: '12m', name: '12 Months', duration: '12 mo', price: 100, note: '$8.33 / month', best: false,
    perks: ['2 simultaneous streams', '40,000+ VOD library', 'HD & 4K quality', 'Anti-freeze tech', 'VIP support'] },
];

const POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const TITLES = [
  { t: 'Sonic 3',        y: '2024', g: 'Family',    a: '#f2663a', b: '#1e1a3a', p: '/d8Ryb8AunYAuycVKDp5HpdWPKgC.jpg' },
  { t: 'Gladiator II',   y: '2024', g: 'Epic',     a: '#c2410c', b: '#2b1608', p: '/f54mzACTFdiAxnQ30BK4GjrKzyn.jpg' },
  { t: 'Andor',          y: '2025', g: 'Sci-Fi',   a: '#334155', b: '#0b1220', p: '/khZqmwHQicTYoS7Flreb9EddFZC.jpg' },
  { t: 'The Penguin',    y: '2024', g: 'Crime',    a: '#3f3552', b: '#0c0a14', p: '/vOWcqC4oDQws1doDWLO7d3dh5qc.jpg' },
  { t: 'Dune: Part Two', y: '2024', g: 'Sci-Fi',   a: '#b45309', b: '#1a0f04', p: '/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg' },
  { t: 'Shōgun',         y: '2024', g: 'Drama',    a: '#7c2d12', b: '#1a0a06', p: '/7O4iVfOMQmdCSxhOg1WnzG1AgYT.jpg' },
  { t: 'The Bear',       y: '2025', g: 'Comedy',   a: '#0f766e', b: '#062621', p: '/eKfVzzEazSIjJMrw9ADa2x8ksLz.jpg' },
  { t: 'Severance',      y: '2025', g: 'Mystery',  a: '#1e40af', b: '#0a1228', p: '/pPHpeI2X1qEd1CS1SeyrdhZ4qnT.jpg' },
  { t: 'Fallout',        y: '2024', g: 'Sci-Fi',   a: '#65a30d', b: '#0f1906', p: '/c15BtJxCXMrISLVmysdsnZUPQft.jpg' },
  { t: 'House of the Dragon', y: '2024', g: 'Fantasy', a: '#7f1d1d', b: '#1a0808', p: '/7QMsOTMUswlwxJP0rTTZfmz2tX2.jpg' },
  { t: 'Silo',           y: '2025', g: 'Thriller', a: '#475569', b: '#0b1116', p: '/fDMTqUcEh6qJwWZP1SHTfoaqsCy.jpg' },
  { t: 'Arcane',         y: '2024', g: 'Animated', a: '#6d28d9', b: '#140a28', p: '/abf8tHznhSvl9BAElD2cQeRr7do.jpg' },
  { t: 'The Last of Us', y: '2025', g: 'Drama',    a: '#166534', b: '#061a0d', p: '/dmo6TYuuJgaYinXBPjrgG9mB5od.jpg' },
  { t: 'Squid Game S2',  y: '2024', g: 'Thriller', a: '#be123c', b: '#1a0610', p: '/1QdXdRYfktUSONkl1oD5gc6Be0s.jpg' },
];

const FAQS = [
  { q: 'What is IPTV and how does it differ from regular cable?',
    a: 'IPTV streams live TV and on-demand content over the internet instead of through satellite dish or cable wires. All you need is a decent internet connection (10 Mbps+) and a compatible device. No installer, no appointments, no hardware.' },
  { q: 'How fast do I get access after ordering?',
    a: 'Credentials are delivered to your email within 5–15 minutes of a successful payment, 24/7. If anything takes longer, our support team responds within an hour on any channel.' },
  { q: 'Which devices can I use?',
    a: 'Anything modern: Smart TVs (Samsung, LG, Sony), Amazon Fire Stick, Android boxes, Apple TV, iPhone & iPad, Android phones & tablets, PCs, Macs, and MAG boxes. We provide a setup guide for each.' },
  { q: 'Can I watch on multiple devices at the same time?',
    a: 'Yes — choose the 2-connection option at checkout. You can watch two different streams simultaneously, perfect for households or the bedroom + living room combo.' },
  { q: 'Is there buffering or lag?',
    a: 'Our servers are built on a load-balanced global network with 99.9% uptime. Provided you have a stable 10+ Mbps connection, streaming is smooth in full HD and 4K where available.' },
  { q: 'What is your refund policy?',
    a: 'We offer a 24-hour trial so you can test everything before committing. If you have an issue within the first 48 hours of a paid plan, reach out and we\'ll make it right.' },
  { q: 'Do I need a VPN?',
    a: 'Most customers don\'t need one — the service works out of the box. A VPN is never required for speed or access.' },
];

const REVIEWS = [
  { q: 'Switched from cable three months ago and honestly can\'t believe I waited this long. Setup took five minutes, the picture quality is crisp, and I pay a fraction of what I used to.',
    n: 'Marcus D.', r: 'Amsterdam · 1 year subscriber', init: 'MD' },
  { q: 'Support actually replied within minutes on a Sunday night. The channel list is enormous — every sport I care about, plus all the shows my partner watches. No contest.',
    n: 'Sofía R.', r: 'Rotterdam · 6 month subscriber', init: 'SR' },
  { q: 'Works flawlessly on my Fire Stick and on the kids\' iPads. The VOD library is massive and kept up to date. For the price, it feels genuinely unreal.',
    n: 'Jasper V.', r: 'Eindhoven · 3 month subscriber', init: 'JV' },
];

const ORDER_URL         = 'https://shop.iduck.xyz/store/flyers';
const ORDER_URL_TRIAL   = 'https://shop.iduck.xyz/store/flyers/24-trial';
const ORDER_URL_1CONN   = 'https://shop.iduck.xyz/store/flyers/teeeeveeeee-tv-1-connection';
const ORDER_URL_2CONN   = 'https://shop.iduck.xyz/store/flyers/2-pee';
const orderUrlFor = (plan, conns) => plan.id === 'trial' ? ORDER_URL_TRIAL : (conns === 1 ? ORDER_URL_1CONN : ORDER_URL_2CONN);

// ---------------- Icons ----------------
const Icon = {
  Arrow: (p) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>,
  Play: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M8 5v14l11-7z"/></svg>,
  Check: (p) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  Plus: (p) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 5v14M5 12h14"/></svg>,
  Star: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2l2.99 6.72 7.31.64-5.54 4.86 1.67 7.18L12 17.77 5.57 21.4l1.67-7.18L1.7 9.36l7.31-.64z"/></svg>,
  Signal: (p) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" {...p}><path d="M2 12a10 10 0 0 1 20 0"/><path d="M6 12a6 6 0 0 1 12 0"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/></svg>,
  Cloud: (p) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M17.5 19a4.5 4.5 0 0 0 .8-8.9 6 6 0 0 0-11.7 1.2A4 4 0 0 0 6.5 19z"/></svg>,
  Tv: (p) => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8M12 18v4"/></svg>,
  // Devices
  SmartTv: (p) => <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="26" height="17" rx="2"/><path d="M11 27h10M16 22v5"/></svg>,
  FireStick: (p) => <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="5" y="12" width="18" height="8" rx="2"/><path d="M23 16h4"/><circle cx="10" cy="16" r="1.2" fill="currentColor"/></svg>,
  Android: (p) => <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M6 18c0-5.5 4.5-10 10-10s10 4.5 10 10"/><path d="M6 18h20v5a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M10 14l-2-3M22 14l2-3"/><circle cx="12" cy="14" r=".8" fill="currentColor"/><circle cx="20" cy="14" r=".8" fill="currentColor"/></svg>,
  Apple: (p) => <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor" {...p}><path d="M22.3 17.3c0-3.2 2.6-4.7 2.7-4.8-1.5-2.1-3.7-2.4-4.5-2.5-1.9-.2-3.8 1.1-4.8 1.1s-2.5-1.1-4.2-1.1c-2.1 0-4.1 1.3-5.2 3.2-2.2 3.9-.6 9.6 1.6 12.7 1.1 1.5 2.3 3.2 4 3.1 1.6-.1 2.2-1 4.1-1s2.5 1 4.2 1c1.7 0 2.8-1.5 3.9-3 1.2-1.7 1.7-3.4 1.7-3.5-.1 0-3.5-1.3-3.5-5.2zM19.3 8.1c.9-1.1 1.5-2.6 1.3-4.1-1.3.1-2.8.9-3.7 1.9-.8 1-1.6 2.5-1.4 3.9 1.4.1 2.9-.7 3.8-1.7z"/></svg>,
  Pc: (p) => <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="6" width="26" height="16" rx="2"/><path d="M10 28h12M16 22v6"/></svg>,
  MagBox: (p) => <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="4" y="10" width="24" height="12" rx="1.5"/><circle cx="9" cy="16" r="1.2" fill="currentColor"/><path d="M14 16h10M14 19h6"/></svg>,
};

// ---------------- Nav ----------------
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <header className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="logo">
          <span className="logo-mark">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12v3h-4v13h-4V7H6z"/></svg>
          </span>
          <span>TeeeVEE</span>
        </a>
        <nav className="nav-links">
          <a href="#what">What is IPTV</a>
          <a href="#content">Content</a>
          <a href="#pricing">Pricing</a>
          <a href="#devices">Devices</a>
          <a href="Installation.html">Install</a>
          <a href="Reseller.html">Reseller</a>
          <a href="#faq">FAQ</a>
        </nav>
        <div className="nav-cta">
          <a href="#pricing" className="btn btn-ghost btn-sm">View plans</a>
          <a href={ORDER_URL} className="btn btn-primary btn-sm">Get started <Icon.Arrow /></a>
        </div>
      </div>
    </header>
  );
}

// ---------------- Hero ----------------
function Hero({ headlineVariant }) {
  const headlines = {
    default: <>Stream <em>everything.</em><br/>Anywhere. <span className="mark">Instantly.</span></>,
    short:   <>Your <em>entire</em> TV.<br/>One subscription.</>,
    bold:    <>Cable is <em>over.</em><br/>Stream what you want.</>,
  };

  return (
    <section className="hero" id="top" data-screen-label="01 Hero">
      <div className="container">
        <div className="hero-grid">
          <div className="reveal in">
            <span className="eyebrow">IPTV · Since 2021 · 24/7 support</span>
            <h1 className="hero-title">{headlines[headlineVariant] || headlines.default}</h1>
            <p className="hero-sub">One subscription unlocks 10,000+ live channels and a 40,000+ title on-demand library — streamable to every device you already own. No dish, no installer, no cable bill.</p>
            <div className="hero-ctas">
              <a href={ORDER_URL} className="btn btn-accent">Get started <Icon.Arrow /></a>
              <a href="channels.html" className="btn btn-ghost">View channel list</a>
            </div>
            <div className="hero-meta">
              <div className="av-stack">
                <span style={{background:'linear-gradient(135deg,#ffb199,#ff5c3a)'}}></span>
                <span style={{background:'linear-gradient(135deg,#ffe29a,#e9b949)'}}></span>
                <span style={{background:'linear-gradient(135deg,#a7c7f4,#4b6cb7)'}}></span>
                <span style={{background:'linear-gradient(135deg,#c7b5f4,#7e5ed1)'}}></span>
              </div>
              <span>Trusted by <strong style={{color:'var(--ink)'}}>50,000+</strong> households</span>
              <span className="dot"></span>
              <div className="stars" style={{color:'var(--gold)'}}>
                <Icon.Star /><Icon.Star /><Icon.Star /><Icon.Star /><Icon.Star />
              </div>
              <span>4.9 average</span>
            </div>
          </div>

          <div className="reveal in" style={{position:'relative'}}>
            <div className="float-chip chip-tl">
              <div>
                <div className="num">4K</div>
                <div className="lbl">Ultra HD</div>
              </div>
            </div>
            <div className="float-chip chip-br">
              <div>
                <div className="num">99.9%</div>
                <div className="lbl">Uptime</div>
              </div>
            </div>
            <div className="preview">
              <span className="preview-badge"><span className="live"></span>LIVE · CH 042</span>
              <div className="preview-screen">
                <div className="preview-topbar">
                  <div className="tl"><span></span><span></span><span></span></div>
                  <span style={{marginLeft:'auto', opacity:.6}}>teeeveee · living room</span>
                </div>
                <div className="preview-main" style={{
                  backgroundImage:
                    'linear-gradient(160deg, rgba(28,20,16,.55) 0%, rgba(10,9,8,.85) 100%), url(https://image.tmdb.org/t/p/w1280/8mjYwWT50GkRrrRdyHzJorfEfcl.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}>
                  <div className="preview-play"><div><Icon.Play /></div></div>
                  <div className="preview-title">
                    <span className="eyebrow">Now streaming</span>
                    <h4>Gladiator II</h4>
                    <p>2024 · Epic · 2h 28m · 4K HDR</p>
                  </div>
                </div>
                <div className="preview-controls">
                  <span>00:42</span>
                  <div className="preview-bar"></div>
                  <span>2:28</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="stats" aria-label="Key stats">
          {[
            { n: '10,000+', l: 'Live channels' },
            { n: '40,000+', l: 'Movies & series (VOD)' },
            { n: '99.9%',  l: 'Uptime guarantee' },
            { n: '24/7',   l: 'Human support' },
          ].map((s, i) => (
            <div className="stat" key={i}>
              <div className="n">{s.n}</div>
              <div className="l">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- What is IPTV ----------------
function WhatIs() {
  return (
    <section id="what" data-screen-label="02 What is IPTV">
      <div className="container">
        <div className="whatis-grid">
          <div className="reveal">
            <span className="eyebrow">What is IPTV?</span>
            <h2 className="display" style={{marginTop: 16}}>Television, delivered <em>through the internet</em> — not a cable or a dish.</h2>
            <p className="lede" style={{marginTop: 18}}>Think of IPTV as Netflix and live TV fused into one app. Every channel and every on-demand title streams over your existing Wi-Fi, to whatever device you already use. No installer appointment. No two-year contract. No hardware to rent.</p>
            <ul className="bullets">
              <li><span className="check"><Icon.Check /></span><span><strong>Works on what you own.</strong> Any Smart TV, phone, tablet, Fire Stick, or laptop — log in and go.</span></li>
              <li><span className="check"><Icon.Check /></span><span><strong>One bill, everything unlocked.</strong> Live sports, movies, kids' shows, and 40k+ on-demand titles under a single subscription.</span></li>
              <li><span className="check"><Icon.Check /></span><span><strong>Cancel anytime.</strong> Month-to-month options. Start with a 24-hour trial for $2.50.</span></li>
            </ul>
          </div>

          <div className="reveal">
            <div className="iptv-diagram">
              <h4>How the signal travels</h4>
              <div className="iptv-flow">
                <div className="iptv-node">
                  <Icon.Signal />
                  <div className="t">Broadcast</div>
                  <div className="d">Source</div>
                </div>
                <div className="iptv-arrow"><Icon.Arrow /></div>
                <div className="iptv-node" style={{borderColor:'var(--accent)', background:'var(--accent-soft)'}}>
                  <Icon.Cloud />
                  <div className="t">TeeeVEE</div>
                  <div className="d">Internet</div>
                </div>
                <div className="iptv-arrow"><Icon.Arrow /></div>
                <div className="iptv-node">
                  <Icon.Tv />
                  <div className="t">Your screen</div>
                  <div className="d">Any device</div>
                </div>
              </div>
              <div className="iptv-compare">
                <div className="cmp old">
                  <h5><span className="dot-r"></span>Traditional cable</h5>
                  Installer · 2-yr contract · rented box · one TV
                </div>
                <div className="cmp new">
                  <h5><span className="dot-g"></span>IPTV with TeeeVEE</h5>
                  Instant setup · month-to-month · use your own device
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------- Content strip ----------------
function Poster({ item }) {
  const fallback = `linear-gradient(160deg, ${item.a} 0%, ${item.b} 100%)`;
  const img = item.p ? `url(${POSTER_BASE}${item.p})` : null;
  return (
    <div className="poster" style={{
      background: img ? `${img} center/cover no-repeat, ${fallback}` : fallback,
    }}>
      <div className="p-shade" />
      <div className="p-inner">
        <div className="p-top">
          <span>●&nbsp;&nbsp;{item.y}</span>
          <span>{item.g.toUpperCase()}</span>
        </div>
        <div>
          <div className="p-title">{item.t}</div>
          <div className="p-meta">4K · HDR · DOLBY</div>
        </div>
      </div>
    </div>
  );
}

function ContentStrip() {
  const doubled = [...TITLES, ...TITLES];
  return (
    <section className="strip" id="content" data-screen-label="03 Content library" style={{background: 'var(--bg-alt)'}}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Content library</span>
          <h2 className="display">Every show and film you actually <em>watch.</em></h2>
          <p className="lede">New releases, prestige series, classics and the deepest sports library in the region — all indexed, searchable, and available in up to 4K HDR.</p>
        </div>
      </div>
      <div style={{position: 'relative'}}>
        <div className="strip-track">
          {doubled.map((t, i) => <Poster key={i} item={t} />)}
        </div>
        <div style={{position:'absolute', inset:'0 0 0 auto', width:'120px', background:'linear-gradient(to left, var(--bg-alt), transparent)', pointerEvents:'none'}}></div>
        <div style={{position:'absolute', inset:'0 auto 0 0', width:'120px', background:'linear-gradient(to right, var(--bg-alt), transparent)', pointerEvents:'none'}}></div>
      </div>
      <div className="container" style={{marginTop: 40, display:'flex', gap:12, flexWrap:'wrap'}}>
        <a href="channels.html" className="btn btn-primary">Browse the full library <Icon.Arrow /></a>
        <a href="#pricing" className="btn btn-ghost">See pricing</a>
      </div>
    </section>
  );
}

// ---------------- Pricing ----------------
function Pricing({ layout }) {
  const [conns, setConns] = useState(1);
  const pillRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!toggleRef.current || !pillRef.current) return;
    const btns = toggleRef.current.querySelectorAll('button.tog-btn');
    const active = btns[conns - 1];
    if (active) {
      pillRef.current.style.width = active.offsetWidth + 'px';
      pillRef.current.style.transform = `translateX(${active.offsetLeft - 4}px)`;
    }
  }, [conns]);

  const PLANS = conns === 1 ? PLANS_1 : PLANS_2;
  const priceFor = (p) => p.price;

  return (
    <section id="pricing" data-screen-label="04 Pricing">
      <div className="container">
        <div className="pricing-head">
          <div className="reveal" style={{maxWidth: 620}}>
            <span className="eyebrow">Pricing</span>
            <h2 className="display" style={{marginTop: 16}}>One flat rate. <em>Everything</em> unlocked.</h2>
            <p className="lede" style={{marginTop: 14}}>No add-on tiers, no "sports package", no surprise fees. Pick a length, pick your connections, done.</p>
          </div>
          <div className="reveal" style={{display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end'}}>
            <span className="eyebrow">Simultaneous connections</span>
            <div className="toggle" ref={toggleRef}>
              <span className="pill" ref={pillRef}></span>
              <button className={`tog-btn ${conns === 1 ? 'active' : ''}`} onClick={() => setConns(1)}>1 Connection</button>
              <button className={`tog-btn ${conns === 2 ? 'active' : ''}`} onClick={() => setConns(2)}>2 Connections</button>
            </div>
          </div>
        </div>

        <div className="pricing-grid reveal">
          {PLANS.map(p => {
            const price = priceFor(p);
            const [dollars, cents] = price.toFixed(2).split('.');
            return (
              <div key={p.id} className={`pcard ${p.best ? 'feat' : ''}`}>
                {p.best && <span className="ribbon">Best value</span>}
                <div className="p-name">{p.name}</div>
                <div className="p-price">
                  <span className="c">$</span>
                  <span>{dollars}</span>
                  <span className="c">.{cents}</span>
                  <span className="d">&nbsp;/ {p.duration}</span>
                </div>
                <div className="p-save">{p.note}</div>
                <ul>
                  {p.perks.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
                <a href={orderUrlFor(p, conns)} className="btn btn-primary">Order now <Icon.Arrow /></a>
              </div>
            );
          })}
        </div>

        <div className="pnotes">
          <span><Icon.Check /> Instant delivery to your inbox</span>
          <span><Icon.Check /> No auto-renewal, cancel anytime</span>
          <span><Icon.Check /> Secure payment · Visa, Mastercard, Crypto</span>
          <span><Icon.Check /> 24/7 human support</span>
        </div>
      </div>
    </section>
  );
}

// ---------------- Devices ----------------
function Devices() {
  const list = [
    { n: 'Smart TV',  s: 'Samsung · LG · Sony', I: Icon.SmartTv },
    { n: 'Fire Stick',s: 'Amazon · 4K · Lite',   I: Icon.FireStick },
    { n: 'Android',   s: 'Phones · Boxes · TV', I: Icon.Android },
    { n: 'iOS',       s: 'iPhone · iPad · TV',  I: Icon.Apple },
    { n: 'PC / Mac',  s: 'Browser · App',       I: Icon.Pc },
    { n: 'MAG Box',   s: 'MAG 254 · 322 · 524', I: Icon.MagBox },
  ];
  return (
    <section id="devices" data-screen-label="05 Devices" style={{background: 'var(--bg-alt)'}}>
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Compatible devices</span>
          <h2 className="display">Works on <em>every screen</em> you already own.</h2>
          <p className="lede">No proprietary hardware, no rented box. Install the free app on anything modern and sign in with your credentials.</p>
        </div>
        <div className="devices-grid reveal">
          {list.map((d, i) => {
            const I = d.I;
            return (
              <div key={i} className="device">
                <I />
                <div className="n">{d.n}</div>
                <div className="s">{d.s}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------- How it works ----------------
function HowItWorks() {
  const steps = [
    { t: 'Choose a plan',       p: 'Pick the length and number of connections that fits your household.' },
    { t: 'Create an account',   p: 'Just an email — no lengthy forms, no spam, no salesperson.' },
    { t: 'Secure payment',      p: 'Pay by card or crypto through our encrypted checkout on shop.iduck.xyz.' },
    { t: 'Get credentials',     p: 'Delivered to your inbox within minutes, 24/7, including setup links.' },
    { t: 'Start watching',      p: 'Open the app on your TV, phone, or laptop — sign in, hit play.' },
  ];
  return (
    <section id="how" data-screen-label="06 How it works">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">How it works</span>
          <h2 className="display">Five minutes from <em>click to couch.</em></h2>
        </div>
        <div className="steps reveal">
          {steps.map((s, i) => (
            <div key={i} className="step">
              <div className="n">0{i + 1}</div>
              <h4>{s.t}</h4>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------- Reviews ----------------
function Reviews() {
  return (
    <section data-screen-label="07 Reviews">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow">Customer reviews</span>
          <h2 className="display">Loved by <em>50,000+</em> households.</h2>
        </div>
        <div className="reviews-grid reveal">
          {REVIEWS.map((r, i) => (
            <div key={i} className="review">
              <div className="stars">
                <Icon.Star /><Icon.Star /><Icon.Star /><Icon.Star /><Icon.Star />
              </div>
              <blockquote>"{r.q}"</blockquote>
              <div className="who">
                <div className="av">{r.init}</div>
                <div>
                  <div className="nm">{r.n}</div>
                  <div className="ro">{r.r}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="reviews-aggregate reveal">
          <div className="stars"><Icon.Star /><Icon.Star /><Icon.Star /><Icon.Star /><Icon.Star /></div>
          <div className="big">4.9/5</div>
          <div style={{fontSize: 13, color: 'var(--ink-mute)'}}>average from 2,840+ verified reviews</div>
        </div>
      </div>
    </section>
  );
}

// ---------------- FAQ ----------------
function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" data-screen-label="08 FAQ" style={{background: 'var(--bg-alt)'}}>
      <div className="container">
        <div style={{display:'grid', gridTemplateColumns: '1fr 1.6fr', gap: 56, alignItems:'start'}} className="faq-layout">
          <div className="reveal">
            <span className="eyebrow">FAQ</span>
            <h2 className="display" style={{marginTop: 16}}>Questions, <em>answered</em>.</h2>
            <p className="lede" style={{marginTop: 14}}>Can't find what you're looking for? Email <a href="mailto:support@teeeveee.nl" style={{color:'var(--accent)', fontWeight:500}}>support@teeeveee.nl</a> — we reply in under an hour, any time of day.</p>
          </div>
          <div className="faq-list reveal">
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item ${open === i ? 'open' : ''}`}>
                <button className="faq-q" onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span className="ic"><Icon.Plus /></span>
                </button>
                <div className="faq-a">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .faq-layout { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </section>
  );
}

// ---------------- Final CTA ----------------
function FinalCTA() {
  return (
    <div className="cta-wrap">
      <div className="container">
        <div className="cta reveal">
          <div style={{position:'relative', zIndex:1}}>
            <span className="eyebrow" style={{color: 'rgba(255,255,255,.6)'}}>Ready when you are</span>
            <h2 style={{marginTop: 16}}>Try everything for 24 hours. <em style={{color:'var(--accent)', fontStyle:'italic'}}>$2.50.</em></h2>
            <p>No commitment. Full library. Full channel list. If it's not for you, walk away.</p>
            <div className="btns">
              <a href={ORDER_URL} className="btn btn-accent">Start 24h trial <Icon.Arrow /></a>
              <a href="#pricing" className="btn btn-ghost">Compare plans</a>
            </div>
          </div>
          <div className="cta-side">
            <div className="bento">
              <div className="big">
                <div className="n">&lt; 5 min</div>
                <div className="l">Average setup time</div>
              </div>
              <div><div className="n">10k+</div><div className="l">Channels</div></div>
              <div><div className="n">40k+</div><div className="l">VOD Titles</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Footer ----------------
function Footer() {
  return (
    <footer data-screen-label="09 Footer">
      <div className="container">
        <div className="foot-grid">
          <div>
            <a href="#top" className="logo">
              <span className="logo-mark">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12v3h-4v13h-4V7H6z"/></svg>
              </span>
              <span>TeeeVEE</span>
            </a>
            <p className="foot-tag">Premium IPTV for households who'd rather pay for content than cables.</p>
            <a className="foot-contact" href="mailto:support@teeeveee.nl">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
              support@teeeveee.nl
            </a>
          </div>
          <div className="foot-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="channels.html">Channel list</a></li>
              <li><a href="#devices">Compatible devices</a></li>
              <li><a href="#how">How it works</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Support</h5>
            <ul>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="mailto:support@teeeveee.nl">Contact support</a></li>
              <li><a href="#">Setup guides</a></li>
              <li><a href="#">System status</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Terms of service</a></li>
              <li><a href="#">Privacy policy</a></li>
              <li><a href="#">Refund policy</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bottom">
          <div>© 2026 TeeeVEE · Streaming service · All rights reserved.</div>
          <div className="foot-badges">
            <span>SSL · SECURE</span>
            <span>VISA</span>
            <span>MASTERCARD</span>
            <span>CRYPTO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ---------------- Tweaks ----------------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#FF5C3A",
  "headline": "default",
  "density": "comfortable"
}/*EDITMODE-END*/;

function TweaksWrapper({ onHeadline }) {
  const [values, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', values.accent);
    const softMap = {
      '#FF5C3A': '#FFE9E2',
      '#2563EB': '#DEE9FE',
      '#059669': '#D5F0E3',
      '#9333EA': '#EBDEFE',
      '#E11D48': '#FEE0E6',
      '#EA580C': '#FEE6D5',
    };
    document.documentElement.style.setProperty('--accent-soft', softMap[(values.accent || '').toUpperCase()] || values.accent + '22');
    document.body.classList.toggle('density-compact', values.density === 'compact');
    onHeadline(values.headline);
  }, [values]);

  return (
    <TweaksPanel>
      <TweakSection label="Accent color" />
      <TweakRadio
        label="Hue"
        value={values.accent}
        onChange={v => setTweak('accent', v)}
        options={['#FF5C3A', '#2563EB', '#059669', '#9333EA', '#E11D48', '#EA580C']}
      />
      <TweakSection label="Hero headline" />
      <TweakRadio
        label="Variant"
        value={values.headline}
        onChange={v => setTweak('headline', v)}
        options={['default', 'short', 'bold']}
      />
      <TweakSection label="Layout" />
      <TweakRadio
        label="Density"
        value={values.density}
        onChange={v => setTweak('density', v)}
        options={['comfortable', 'compact']}
      />
    </TweaksPanel>
  );
}

// ---------------- App ----------------
function App() {
  const [headline, setHeadline] = useState('default');

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));

    // React renders after the browser has already tried to resolve location.hash,
    // so the initial auto-scroll misses. Re-run it once the section exists.
    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1));
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }

    return () => io.disconnect();
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero headlineVariant={headline} />
        <WhatIs />
        <ContentStrip />
        <Pricing />
        <Devices />
        <HowItWorks />
        <Reviews />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <TweaksWrapper onHeadline={setHeadline} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
