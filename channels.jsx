const { useState, useMemo, useEffect } = React;

function qPill(q) {
  const map = { '4K': '#0F1114', 'UHD': '#0F1114', 'FHD': '#FF5C3A', 'HD': '#6B6F76', 'SD': '#9AA0A6' };
  const color = map[q] || '#6B6F76';
  return (
    <span style={{
      fontSize: 10, fontFamily: 'JetBrains Mono, monospace',
      padding: '3px 8px', borderRadius: 999,
      background: color, color: '#fff', fontWeight: 600, letterSpacing: '.06em',
    }}>{q}</span>
  );
}

function detectQuality(name) {
  const u = name.toUpperCase();
  if (u.includes(' 4K') || u.includes(' UHD')) return '4K';
  if (u.includes(' FHD') || u.includes(' 1080')) return 'FHD';
  if (u.includes(' SD') || u.includes(' 480')) return 'SD';
  return 'HD';
}

function Logo({ name }) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hue = hash % 360;
  const initials = name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 3).toUpperCase() || '??';
  return (
    <div style={{
      width: 40, height: 40, borderRadius: 10,
      background: `linear-gradient(135deg, hsl(${hue}, 40%, 92%), hsl(${hue}, 40%, 85%))`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 700, color: `hsl(${hue}, 60%, 25%)`,
      flex: '0 0 auto',
    }}>{initials}</div>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);
  const [cat, setCat] = useState('All');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(300);

  useEffect(() => {
    fetch('js/channels.json')
      .then(r => r.json())
      .then(setData)
      .catch(e => setErr(String(e)));
  }, []);

  const { flat, catCounts, categories, total } = useMemo(() => {
    if (!data) return { flat: [], catCounts: { All: 0 }, categories: ['All'], total: 0 };
    const flat = [];
    for (const [category, names] of Object.entries(data)) {
      for (const n of names) flat.push({ n, c: category, q: detectQuality(n) });
    }
    const catCounts = { All: flat.length };
    for (const ch of flat) catCounts[ch.c] = (catCounts[ch.c] || 0) + 1;
    const categories = ['All', ...Object.keys(data).sort()];
    return { flat, catCounts, categories, total: flat.length };
  }, [data]);

  const filtered = useMemo(() => {
    if (!flat.length) return [];
    const ql = q.toLowerCase().trim();
    return flat.filter(ch => {
      if (cat !== 'All' && ch.c !== cat) return false;
      if (ql && !ch.n.toLowerCase().includes(ql)) return false;
      return true;
    });
  }, [flat, cat, q]);

  // Reset pagination when filters change
  useEffect(() => { setLimit(300); }, [cat, q]);

  const visible = filtered.slice(0, limit);

  return (
    <>
      <Nav current="channels" />

      <div className="page-hero">
        <div className="container">
          <span className="eyebrow">Channel list</span>
          <h1 className="display" style={{marginTop: 16, fontSize: 'clamp(40px, 6vw, 72px)'}}>
            {total ? total.toLocaleString() : '10,000+'} channels. <em>One subscription.</em>
          </h1>
          <p className="lede" style={{marginTop: 14}}>
            Search the full live lineup below. Quality tags are auto-detected from the channel name. The real list updates in your IPTV app automatically.
          </p>
        </div>
      </div>

      <section>
        <div className="container">
          {/* Search + count */}
          <div style={{display:'flex', gap:12, marginBottom: 28, flexWrap:'wrap', alignItems:'center'}}>
            <div style={{position:'relative', flex:'1 1 280px', maxWidth: 460}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                style={{position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', color:'var(--ink-mute)'}}>
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search 10,000+ channels..."
                style={{
                  width:'100%', padding: '14px 16px 14px 44px',
                  border:'1px solid var(--line)', borderRadius: 999,
                  background:'#fff', fontSize:14, fontFamily:'inherit',
                  outline:'none', transition:'border-color .2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                onBlur={e => e.target.style.borderColor = 'var(--line)'}
              />
            </div>
            <div style={{fontSize: 13, color: 'var(--ink-mute)', marginLeft:'auto'}}>
              {data
                ? <>Showing <strong style={{color:'var(--ink)'}}>{visible.length.toLocaleString()}</strong> of <strong style={{color:'var(--ink)'}}>{filtered.length.toLocaleString()}</strong> matches · {total.toLocaleString()} total</>
                : err ? <span style={{color:'#b91c1c'}}>Failed to load channel list</span>
                      : 'Loading channel list…'}
            </div>
          </div>

          {/* Category chips */}
          {data && (
            <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom: 40}}>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  style={{
                    padding: '10px 16px', borderRadius: 999,
                    background: cat === c ? 'var(--ink)' : '#fff',
                    color: cat === c ? '#fff' : 'var(--ink-soft)',
                    border: '1px solid ' + (cat === c ? 'var(--ink)' : 'var(--line)'),
                    fontSize: 13, fontWeight: 500,
                    transition:'all .2s',
                  }}>
                  {c} <span style={{opacity:.6, marginLeft:4, fontSize:11}}>{(catCounts[c] || 0).toLocaleString()}</span>
                </button>
              ))}
            </div>
          )}

          {/* Channel grid */}
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
            gap:10,
          }}>
            {visible.map((ch, i) => (
              <div key={ch.c + '::' + ch.n + '::' + i} style={{
                display:'flex', alignItems:'center', gap:14,
                padding:'14px 16px', background:'#fff',
                border:'1px solid var(--line)', borderRadius: 12,
                transition:'border-color .2s, transform .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--ink)'; e.currentTarget.style.transform='translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--line)'; e.currentTarget.style.transform=''; }}>
                <Logo name={ch.n} />
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontSize:14, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{ch.n}</div>
                  <div style={{fontSize:11, color:'var(--ink-mute)', marginTop:2, fontFamily:'JetBrains Mono, monospace', letterSpacing:'.06em', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{ch.c.toUpperCase()}</div>
                </div>
                {qPill(ch.q)}
              </div>
            ))}
            {data && filtered.length === 0 && (
              <div style={{gridColumn:'1/-1', padding: 60, textAlign:'center', color:'var(--ink-mute)'}}>
                No channels match your search. Try a different term or category.
              </div>
            )}
          </div>

          {filtered.length > limit && (
            <div style={{textAlign:'center', marginTop: 30}}>
              <button
                onClick={() => setLimit(l => l + 300)}
                className="btn btn-ghost">
                Show more ({(filtered.length - limit).toLocaleString()} more)
              </button>
            </div>
          )}

          {/* CTA */}
          <div style={{
            marginTop: 56, padding: 40,
            border: '1px solid var(--line)', borderRadius: 22,
            background:'var(--bg-alt)',
            display:'flex', gap:24, alignItems:'center', justifyContent:'space-between', flexWrap:'wrap',
          }}>
            <div>
              <div className="eyebrow">Full lineup</div>
              <div className="display" style={{fontSize: 32, marginTop: 10}}>See all {total ? total.toLocaleString() : '10,000+'} live channels.</div>
              <p style={{color:'var(--ink-mute)', fontSize: 14, marginTop: 8, maxWidth: '50ch'}}>
                Start your 24-hour trial for $2.50 and browse the complete list in your IPTV app of choice.
              </p>
            </div>
            <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
              <a href="https://shop.iduck.xyz/store/flyers/24-trial" className="btn btn-accent">Start $2.50 trial <Arrow /></a>
              <a href="TeeeVEE%20Landing.html#pricing" className="btn btn-ghost">View pricing</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
