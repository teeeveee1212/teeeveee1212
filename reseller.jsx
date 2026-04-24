const { useState } = React;

const RESELLER_SIGNUP_URL = 'https://shop.iduck.xyz/store/boomcash/credits';
const SUPPORT_TICKET_URL  = 'https://shop.iduck.xyz/contact.php';

// Real pricing: flat $2/credit first-time rate, $100 minimum (50 credits), no max.
// We show the minimum pack as the featured tier plus two example bulk amounts.
const TIERS = [
  {
    name: 'Minimum',
    credits: 50,
    price: 100,
    per: 2.00,
    save: null,
    features: [
      '$2 per credit · first-time rate',
      'Use credits to create 1, 3, 6 or 12-month lines',
      'Full reseller panel access',
      'M3U & Xtream Codes for every line',
    ],
  },
  {
    name: 'Popular',
    credits: 100,
    price: 200,
    per: 2.00,
    save: null,
    popular: true,
    features: [
      '$2 per credit · same flat rate',
      'Typical pack resellers start with',
      'Priority support on reseller tickets',
      'Credits never expire',
    ],
  },
  {
    name: 'Scale',
    credits: 250,
    price: 500,
    per: 2.00,
    save: null,
    features: [
      '$2 per credit · no bulk discount needed',
      'Buy as many as you need — no maximum',
      'Example: sell 250 subs @ $12 = $3,000 revenue',
      'Dedicated support channel',
    ],
  },
];

const STEPS = [
  { n: '01', t: 'Buy credits', d: 'Purchase a credit pack on shop.iduck.xyz. $100 minimum (50 credits), no maximum. Credits never expire.' },
  { n: '02', t: 'Get panel access', d: 'Reseller panel access is delivered alongside your credits — no separate approval wait.' },
  { n: '03', t: 'Create lines on demand', d: 'Use the panel to instantly generate M3U or Xtream Codes lines for your customers.' },
  { n: '04', t: 'Keep the margin', d: 'Charge whatever you want. Buy at $2, sell at $12+ — that\'s 80%+ profit per subscription.' },
];

const FAQ = [
  { q: 'How does the credit system work?', a: '1 credit = 1 month of service on a single connection. A 3-month line costs 3 credits, a 12-month line costs 12 credits, etc. Credits never expire, so buy in bulk and use them whenever you need.' },
  { q: 'What\'s the minimum order?', a: 'The minimum is $100, which gets you 50 credits at the first-time rate of $2/credit. There is no maximum — buy as many as you need in one order.' },
  { q: 'Can I brand the service as my own?', a: 'Yes. Pro tier and above includes a branded signup page with your logo and colors. Business and Enterprise tiers add a custom subdomain so customers never see "TeeeVEE" anywhere.' },
  { q: 'How do I create a line for a customer?', a: 'Log into your reseller panel, enter the customer\'s username, choose the duration, and click Create. Credentials are generated instantly and can be emailed directly to the customer.' },
  { q: 'Do you offer a trial before I buy a big pack?', a: 'We recommend starting with the $100 / 50-credit minimum. You can create one 50-month line, fifty 1-month trial accounts, or any mix — whatever works to test the service with your customers.' },
  { q: 'What\'s the payment method?', a: 'Crypto (BTC, USDT, ETH), PayPal, and bank transfer. All large orders get an invoice and receipt for accounting.' },
];

function Check() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flex:'0 0 auto', marginTop: 2}}>
      <path d="M20 6 9 17l-5-5"/>
    </svg>
  );
}

function App() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      <Nav current="reseller" />

      {/* HERO */}
      <section style={{padding: '80px 0 60px', background: 'var(--bg-alt)', borderBottom: '1px solid var(--line)', position:'relative', overflow:'hidden'}}>
        <div style={{
          position:'absolute', right: '-10%', top: '-20%',
          width: 500, height: 500, borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,92,58,.12), transparent 70%)',
          pointerEvents: 'none',
        }}/>
        <div className="container" style={{position:'relative'}}>
          <div style={{display:'grid', gridTemplateColumns:'1.2fr .9fr', gap: 60, alignItems:'center'}} className="reseller-hero-grid">
            <div>
              <span className="eyebrow">Reseller program</span>
              <h1 className="display" style={{marginTop: 16, fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: .95}}>
                Run <em>your own</em> IPTV business.<br/>We handle the streams.
              </h1>
              <p className="lede" style={{marginTop: 20, fontSize: 18}}>
                Credits at $2 each — first-time reseller rate. $100 minimum buy, no maximum. Build a brand, keep the margin, and let us handle infrastructure, 10,000 channels, and uptime.
              </p>
              <div style={{display:'flex', gap: 12, marginTop: 32, flexWrap:'wrap'}}>
                <a href={RESELLER_SIGNUP_URL} target="_blank" rel="noopener" className="btn btn-accent">Buy credits now <Arrow /></a>
                <a href="#pricing" className="btn btn-ghost">See credit packages</a>
              </div>
              <div style={{display:'flex', gap: 32, marginTop: 40, flexWrap:'wrap'}}>
                {[
                  { k: '$2', v: 'Per credit (first-time)' },
                  { k: '$100', v: 'Minimum buy' },
                  { k: '80%+', v: 'Profit margins' },
                  { k: '100%', v: 'Uptime SLA' },
                ].map(s => (
                  <div key={s.v}>
                    <div style={{fontFamily:'Instrument Serif, serif', fontSize: 36, lineHeight:1}}>{s.k}</div>
                    <div style={{fontSize: 12, color:'var(--ink-mute)', marginTop: 4, textTransform:'uppercase', letterSpacing:'.08em', fontFamily:'JetBrains Mono, monospace'}}>{s.v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Panel mockup */}
            <div style={{
              background: '#0F1114', borderRadius: 22,
              padding: 24, boxShadow: '0 30px 60px -30px rgba(15,17,20,.4)',
              transform: 'rotate(1deg)',
              border: '1px solid rgba(255,255,255,.08)',
            }}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20, color:'#fff'}}>
                <div style={{fontSize: 12, fontFamily:'JetBrains Mono, monospace', color:'rgba(255,255,255,.5)'}}>RESELLER PANEL</div>
                <div style={{display:'flex', gap: 6}}>
                  {[1,2,3].map(i => <span key={i} style={{width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,.15)'}}/>)}
                </div>
              </div>
              <div style={{background:'rgba(255,255,255,.05)', borderRadius: 12, padding: 18, marginBottom: 10}}>
                <div style={{fontSize: 11, color:'rgba(255,255,255,.5)', fontFamily:'JetBrains Mono, monospace', textTransform:'uppercase', letterSpacing:'.1em'}}>Credits available</div>
                <div style={{fontSize: 40, fontFamily:'Instrument Serif, serif', color:'#fff', marginTop: 4}}>847</div>
                <div style={{fontSize: 12, color:'#4ADE80', marginTop: 4}}>↑ 25 added today</div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 10}}>
                <div style={{background:'rgba(255,255,255,.05)', borderRadius: 12, padding: 14}}>
                  <div style={{fontSize: 10, color:'rgba(255,255,255,.5)', fontFamily:'JetBrains Mono, monospace', textTransform:'uppercase'}}>Active lines</div>
                  <div style={{fontSize: 22, color:'#fff', marginTop: 2, fontWeight: 600}}>312</div>
                </div>
                <div style={{background:'rgba(255,255,255,.05)', borderRadius: 12, padding: 14}}>
                  <div style={{fontSize: 10, color:'rgba(255,255,255,.5)', fontFamily:'JetBrains Mono, monospace', textTransform:'uppercase'}}>This month</div>
                  <div style={{fontSize: 22, color:'#fff', marginTop: 2, fontWeight: 600}}>€2,410</div>
                </div>
              </div>
              <div style={{background:'var(--accent)', borderRadius: 10, padding: '12px 14px', color:'#fff', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <div style={{fontSize: 13, fontWeight: 600}}>+ Create new line</div>
                <span style={{fontSize: 16}}>→</span>
              </div>
              <div style={{marginTop: 14, borderTop:'1px solid rgba(255,255,255,.08)', paddingTop: 14}}>
                {['user_1208 · 12mo · active', 'maria_k · 3mo · active', 'dave99 · 1mo · expiring'].map((r, i) => (
                  <div key={i} style={{
                    display:'flex', justifyContent:'space-between',
                    padding:'8px 0', borderBottom: i<2 ? '1px solid rgba(255,255,255,.05)' : 'none',
                    fontSize: 12, fontFamily:'JetBrains Mono, monospace', color:'rgba(255,255,255,.65)',
                  }}>
                    <span>{r}</span>
                    <span style={{color: i===2 ? 'var(--accent)' : '#4ADE80'}}>●</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY RESELL */}
      <section style={{padding: '96px 0'}}>
        <div className="container">
          <div style={{maxWidth: 720, marginBottom: 56}}>
            <span className="eyebrow">Why resell with TeeeVEE</span>
            <h2 className="display" style={{marginTop: 16}}>Everything you need. <em>Nothing you don't.</em></h2>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap: 20}}>
            {[
              { t: 'High margins', d: 'Credits at $2 each, sell 12-month subs at $12+ each — that\'s 80%+ margin on every subscription.' },
              { t: 'No infrastructure', d: 'We handle servers, channels, EPG, updates, transcoding, and anti-freeze. You handle customers.' },
              { t: 'White-label ready', d: 'Your brand, your colors, your domain. Pro tier and above ships with branded signup pages.' },
              { t: 'Credits never expire', d: 'Buy in bulk when discounts drop. Use them at your own pace — there\'s no clock ticking.' },
              { t: 'Instant line creation', d: 'One click in the panel generates M3U + Xtream Codes credentials. Email them directly to customers.' },
              { t: 'Priority support', d: 'Reseller tickets jump the queue. Private Telegram channels available for Enterprise tier.' },
            ].map(x => (
              <div key={x.t} style={{
                padding: 28, border:'1px solid var(--line)', borderRadius: 18, background: '#fff',
                transition:'transform .2s, border-color .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='var(--ink)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='var(--line)'; }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background:'var(--accent-soft)', color:'var(--accent)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginBottom: 18,
                }}><Check /></div>
                <div style={{fontSize: 17, fontWeight: 600, marginBottom: 8}}>{x.t}</div>
                <div style={{fontSize: 14, color:'var(--ink-soft)', lineHeight: 1.55}}>{x.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding: '96px 0', background: 'var(--bg-alt)'}}>
        <div className="container">
          <div style={{maxWidth: 720, marginBottom: 56}}>
            <span className="eyebrow">How it works</span>
            <h2 className="display" style={{marginTop: 16}}>From application to <em>first sale in 24 hours.</em></h2>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))', gap: 24}}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{position:'relative'}}>
                <div style={{
                  fontFamily:'Instrument Serif, serif', fontSize: 56, color:'var(--accent)',
                  lineHeight: 1, marginBottom: 16,
                }}>{s.n}</div>
                <div style={{fontSize: 18, fontWeight: 600, marginBottom: 8}}>{s.t}</div>
                <div style={{fontSize: 14, color:'var(--ink-soft)', lineHeight: 1.55}}>{s.d}</div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    position:'absolute', top: 28, right: -12, width: 24, height: 1,
                    background:'var(--line)',
                  }} className="step-line" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{padding: '96px 0'}}>
        <div className="container">
          <div style={{maxWidth: 720, marginBottom: 56}}>
            <span className="eyebrow">Credit packages</span>
            <h2 className="display" style={{marginTop: 16}}>Buy more, <em>pay less.</em></h2>
            <p className="lede" style={{marginTop: 14}}>1 credit = 1 month on a single connection. Credits never expire.</p>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(250px, 1fr))', gap: 16}}>
            {TIERS.map(t => (
              <div key={t.name} style={{
                background: t.popular ? 'var(--ink)' : '#fff',
                color: t.popular ? '#fff' : 'var(--ink)',
                border: '1px solid ' + (t.popular ? 'var(--ink)' : 'var(--line)'),
                borderRadius: 22, padding: 32,
                display:'flex', flexDirection:'column',
                position: 'relative',
                transform: t.popular ? 'translateY(-8px)' : '',
                boxShadow: t.popular ? '0 30px 60px -30px rgba(15,17,20,.3)' : '',
                transition: 'transform .2s, box-shadow .2s',
              }}
              onMouseEnter={e => { if(!t.popular) { e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='var(--shadow-md)'; } }}
              onMouseLeave={e => { if(!t.popular) { e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; } }}>
                {t.popular && (
                  <div style={{
                    position:'absolute', top: -12, right: 24,
                    background:'var(--accent)', color:'#fff',
                    fontSize: 11, padding: '4px 12px', borderRadius: 999,
                    fontFamily:'JetBrains Mono, monospace', letterSpacing:'.08em',
                  }}>POPULAR</div>
                )}
                <div style={{fontSize: 13, fontWeight: 600, opacity: t.popular ? .7 : 1, color: t.popular ? 'rgba(255,255,255,.7)' : 'var(--ink-mute)', marginBottom: 6, fontFamily:'JetBrains Mono, monospace', textTransform:'uppercase', letterSpacing:'.08em'}}>{t.name}</div>
                <div style={{display:'flex', alignItems:'baseline', gap: 8, marginBottom: 4}}>
                  <div style={{fontFamily:'Instrument Serif, serif', fontSize: 56, lineHeight: 1}}>{t.credits}</div>
                  <div style={{fontSize: 14, opacity: .7}}>credits</div>
                </div>
                <div style={{fontSize: 14, color: t.popular ? 'rgba(255,255,255,.65)' : 'var(--ink-mute)', marginBottom: 20}}>
                  ${t.price} total · <strong>${t.per}/credit</strong>
                  {t.save && <span style={{marginLeft: 8, color: 'var(--accent)'}}>{t.save}</span>}
                </div>
                <ul style={{listStyle:'none', padding: 0, margin: 0, display:'flex', flexDirection:'column', gap: 10, marginBottom: 24, flex: 1}}>
                  {t.features.map(f => (
                    <li key={f} style={{display:'flex', gap: 10, fontSize: 13, lineHeight: 1.45, color: t.popular ? 'rgba(255,255,255,.85)' : 'var(--ink-soft)'}}>
                      <span style={{color: 'var(--accent)', flex:'0 0 auto', marginTop: 2}}><Check /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={RESELLER_SIGNUP_URL} target="_blank" rel="noopener" className={t.popular ? 'btn btn-accent' : 'btn btn-primary'} style={{width:'100%'}}>
                  Order {t.credits} credits
                </a>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center', marginTop: 32, fontSize: 13, color:'var(--ink-mute)'}}>
            There is no maximum — buy as many credits as you need. Questions? <a href={SUPPORT_TICKET_URL} target="_blank" rel="noopener" style={{color:'var(--accent)', textDecoration:'underline'}}>Submit a ticket</a>.
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding: '96px 0', background: 'var(--bg-alt)', borderTop:'1px solid var(--line)'}}>
        <div className="container" style={{maxWidth: 860}}>
          <div style={{maxWidth: 720, marginBottom: 40}}>
            <span className="eyebrow">Reseller FAQ</span>
            <h2 className="display" style={{marginTop: 16}}>Everything you want to know.</h2>
          </div>
          <div style={{background:'#fff', border:'1px solid var(--line)', borderRadius: 22, overflow:'hidden'}}>
            {FAQ.map((f, i) => (
              <div key={i} style={{borderBottom: i < FAQ.length-1 ? '1px solid var(--line)' : 'none'}}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  style={{
                    width:'100%', padding: '22px 24px',
                    display:'flex', justifyContent:'space-between', alignItems:'center', gap: 16,
                    textAlign:'left', fontSize: 16, fontWeight: 500,
                  }}>
                  <span>{f.q}</span>
                  <span style={{
                    fontSize: 20, transition: 'transform .2s',
                    transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)',
                    color: 'var(--accent)', flex:'0 0 auto',
                  }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{padding:'0 24px 22px', fontSize: 14, color:'var(--ink-soft)', lineHeight: 1.6, maxWidth: '72ch'}}>
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding: '80px 0'}}>
        <div className="container">
          <div style={{
            background:'var(--ink)', color:'#fff',
            borderRadius: 22, padding: '56px 48px',
            display:'flex', gap: 40, alignItems:'center', justifyContent:'space-between', flexWrap:'wrap',
            position:'relative', overflow:'hidden',
          }}>
            <div style={{
              position:'absolute', right: -100, bottom: -100,
              width: 400, height: 400, borderRadius:'50%',
              background:'radial-gradient(circle, var(--accent), transparent 70%)',
              opacity: .5, pointerEvents:'none',
            }}/>
            <div style={{position:'relative', zIndex:1, maxWidth: 560}}>
              <span className="eyebrow" style={{color:'rgba(255,255,255,.6)'}}>Ready to start</span>
              <h2 className="display" style={{marginTop: 14, fontSize: 48, color:'#fff'}}>Apply in under 2 minutes.</h2>
              <p style={{color:'rgba(255,255,255,.7)', fontSize: 16, marginTop: 12, lineHeight: 1.6}}>
                Send us a short email about your business. Most applications are approved within 24 hours and you can be creating lines the same day.
              </p>
            </div>
            <div style={{position:'relative', zIndex:1, display:'flex', gap: 12, flexWrap:'wrap'}}>
              <a href={RESELLER_SIGNUP_URL} target="_blank" rel="noopener" className="btn btn-accent">Buy credits now <Arrow /></a>
              <a href="#pricing" className="btn btn-ghost" style={{borderColor:'rgba(255,255,255,.25)', color:'#fff'}}>See packages again</a>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .reseller-hero-grid { grid-template-columns: 1fr !important; }
          .step-line { display: none; }
        }
      `}</style>

      <Footer />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
