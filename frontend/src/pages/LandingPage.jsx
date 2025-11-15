import { useNavigate } from 'react-router-dom'

const NYC_STATS = [
  { label: 'Boroughs Covered', value: '5', detail: 'Manhattan to Staten Island' },
  { label: 'Neighborhood Signals', value: '42', detail: 'Curated from city data + forums' },
  { label: 'Quiz Inputs', value: '9', detail: 'Weighted to build your persona' },
]

const SOURCE_FEED = [
  { source: 'NYC Open Data', insight: 'Tracking walkability and transit access corridor by corridor.' },
  { source: 'Queens Eats', insight: 'Surfacing weekly restaurant buzz to inform foodie matches.' },
  { source: 'Reddit r/nyc', insight: 'Scanning neighborhood Q&A threads for sentiment shifts.' },
]

function LandingPage({ quizCompleted }) {
  const navigate = useNavigate()

  const handlePrimaryCTA = () => {
    if (!quizCompleted) {
      navigate('/quiz')
    } else {
      navigate('/portfolio')
    }
  }

  const handleMapCTA = () => {
    navigate('/map')
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/60 to-blue-500/40"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col gap-10">
          <div>
            <p className="uppercase tracking-[0.4em] text-sm text-blue-200 mb-4">NYC Housing Website</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Match with NYC neighborhoods based on lifestyle weights powered by Claude.
            </h1>
            <p className="mt-6 text-lg text-blue-100 max-w-3xl">
              This is a website built solely for New York City housing decisions. Take a weighted lifestyle quiz,
              build a Claude-backed persona portfolio, and explore affordability predictions on an interactive map.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handlePrimaryCTA}
              className="px-8 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-blue-100 transition"
            >
              {quizCompleted ? 'View My NYC Portfolio' : 'Start Quiz'}
            </button>
            <button
              onClick={handleMapCTA}
              className="px-8 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
            >
              View NYC Map
            </button>
          </div>
        </div>
      </header>

      <section className="bg-white text-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
          {NYC_STATS.map((stat) => (
            <div key={stat.label} className="p-6 border border-slate-200 rounded-2xl shadow-sm bg-white/80">
              <p className="text-sm uppercase tracking-widest text-blue-500">{stat.label}</p>
              <p className="text-4xl font-black mt-3">{stat.value}</p>
              <p className="text-sm mt-2 text-slate-600">{stat.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-blue-400">How it Works</p>
            <h2 className="text-3xl font-bold mt-4 mb-6">Website-only NYC stack</h2>
            <ol className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-semibold">Lifestyle Quiz</h3>
                  <p className="text-blue-100">
                    Rank commute tolerance, nightlife, parks, safety, and more. Each slider becomes a weight.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-semibold">Claude Portfolio</h3>
                  <p className="text-blue-100">
                    We aggregate NYC-only data sources then feed the signals into Claude with your weights.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-semibold">Housing Explorer</h3>
                  <p className="text-blue-100">
                    Predict values with the claudehackathon-mlmodel, filter for boroughs, and dive into the map.
                  </p>
                </div>
              </li>
            </ol>
          </div>
          <div className="bg-slate-900/60 rounded-2xl p-8 border border-white/10 shadow-2xl">
            <p className="uppercase text-sm tracking-[0.4em] text-blue-300 mb-4">Source Congestion</p>
            <h3 className="text-2xl font-bold mb-4">Feeds we blend for NYC-only insights</h3>
            <div className="space-y-4">
              {SOURCE_FEED.map((item) => (
                <div key={item.source} className="bg-slate-900/70 border border-white/5 rounded-xl p-4">
                  <p className="text-xs uppercase tracking-[0.4em] text-blue-400 mb-1">{item.source}</p>
                  <p className="text-sm text-blue-100">{item.insight}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-6">
              Bring your own Claude API key via environment variables to generate live insights from these sources.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <p className="text-sm uppercase tracking-[0.3em] text-blue-400">NYC Focus</p>
          <h2 className="text-3xl font-bold mt-4 text-white">Every feature is scoped to NYC</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            <div className="p-6 bg-slate-950 border border-white/10 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3 text-white">Neighborhood Inventory</h3>
              <p className="text-sm text-slate-300">42 curated NYC neighborhoods with borough metadata, vibes, and coordinates.</p>
            </div>
            <div className="p-6 bg-slate-950 border border-white/10 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3 text-white">Claude Integration</h3>
              <p className="text-sm text-slate-300">
                Claude digests Reddit, newsletters, and DOT releases to describe how your persona fits each borough.
              </p>
            </div>
            <div className="p-6 bg-slate-950 border border-white/10 rounded-2xl">
              <h3 className="text-xl font-semibold mb-3 text-white">ML Price Model</h3>
              <p className="text-sm text-slate-300">
                claudehackathon-mlmodel powers the housing predictor so your map stays NYC-specific.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
