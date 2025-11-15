import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { portfolioAPI, housingAPI } from '../utils/api'

const DEFAULT_HOUSING_PREFS = {
  budget: 500000,
  beds: 2,
  baths: 1,
  propertyType: 'CONDO',
  propertySqft: 1000,
  yearsFuture: 0
}

function Portfolio({ onRetakeQuiz }) {
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [predictions, setPredictions] = useState([])
  const [predictionError, setPredictionError] = useState('')
  const [predictionLoading, setPredictionLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPortfolio = async () => {
      setError('')
      try {
        const response = await portfolioAPI.get()
        setPortfolio(response.data)
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load NYC portfolio')
      } finally {
        setLoading(false)
      }
    }

    const fetchPredictions = async () => {
      setPredictionError('')
      setPredictionLoading(true)
      try {
        const storedPrefs = JSON.parse(localStorage.getItem('housingPreferences'))
        const prefs = storedPrefs || DEFAULT_HOUSING_PREFS
        if (!storedPrefs) {
          localStorage.setItem('housingPreferences', JSON.stringify(prefs))
        }
        const response = await housingAPI.predict(prefs)
        setPredictions(response.data.predictions.slice(0, 3))
      } catch (err) {
        setPredictionError('Unable to load budget-aligned recommendations')
      } finally {
        setPredictionLoading(false)
      }
    }

    fetchPortfolio()
    fetchPredictions()
  }, [])

  const handleRetake = () => {
    onRetakeQuiz?.()
    navigate('/quiz')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Consolidating NYC sources with Claude…</p>
        </div>
      </div>
    )
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-900">Portfolio unavailable</h1>
          <p className="text-slate-500">{error || 'Please retake the lifestyle quiz to generate a portfolio.'}</p>
          <button
            onClick={handleRetake}
            className="px-6 py-3 rounded-full bg-primary text-white font-semibold"
          >
            Go to Quiz
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="flex flex-col gap-3">
          <p className="uppercase text-sm tracking-[0.3em] text-primary">NYC Only</p>
          <h1 className="text-4xl font-black text-slate-900">Your NYC housing portfolio</h1>
          <p className="text-slate-600 max-w-2xl">
            Weighted quiz signals are sent to claudehackathon-mlmodel plus Claude AI.
            Every insight below references NYC neighborhoods only.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleRetake}
              className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-100"
            >
              Retake Quiz
            </button>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-green-400 mb-3">Persona</p>
            <h2 className="text-3xl font-bold text-slate-900">{portfolio.persona.title}</h2>
            <p className="text-lg text-slate-500 mb-4">{portfolio.persona.tagline}</p>
            <p className="text-slate-600">{portfolio.persona.description}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-primary font-semibold">
              <span className="px-3 py-1 bg-green-50 rounded-full">
                NYC Focus: {portfolio.persona.nyc_focus}
              </span>
              {portfolio.persona.priorities?.map((priority) => (
                <span key={priority} className="px-3 py-1 bg-green-50 rounded-full">
                  {priority}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Claude summary</h3>
            <p className="text-sm uppercase tracking-[0.4em] text-green-300 mb-2">
              {portfolio.ai_summary.generated_by === 'claude' ? 'Claude API' : 'Offline fallback'}
            </p>
            <p className="text-2xl font-bold mb-4">{portfolio.ai_summary.headline}</p>
            <ul className="space-y-2 text-sm text-green-100">
              {(portfolio.ai_summary.insights || []).map((insight, idx) => (
                <li key={idx}>• {insight}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-slate-200">{portfolio.ai_summary.call_to_action}</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Preference weights</h3>
            <div className="space-y-4">
              {(portfolio.preference_weights || []).map((pref) => (
                <div key={pref.key}>
                  <div className="flex justify-between text-sm font-medium text-slate-700">
                    <span>{pref.label}</span>
                    <span>{Math.round(pref.weight)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${Math.min(100, pref.weight)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{pref.narrative}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-8">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Top neighborhoods</h3>
            <div className="space-y-4">
              {(portfolio.top_neighborhoods || []).map((hood) => (
                <div key={hood.name} className="border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{hood.name}</p>
                      <p className="text-sm text-slate-500">{hood.borough} • Score {hood.score}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      Lifestyle
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{hood.summary || 'NYC neighborhood vibe'}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {(hood.tags || []).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-500">
                    <span>Walkability {hood.highlights?.walkability ?? '—'}</span>
                    <span>Transit {hood.highlights?.transit ?? '—'}</span>
                    <span>Nightlife {hood.highlights?.nightlife ?? '—'}</span>
                    <span>Parks {hood.highlights?.parks ?? '—'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Budget-aligned options (auto)</h3>
              <p className="text-sm text-slate-500">
                We fed your latest housing preferences directly into the claudehackathon-mlmodel.
              </p>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="px-5 py-2 rounded-full bg-primary text-white text-sm font-semibold"
            >
              View full map
            </button>
          </div>
          {predictionLoading ? (
            <div className="flex items-center gap-3 text-slate-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Running affordability + lifestyle model…</span>
            </div>
          ) : predictionError ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 flex items-center justify-between">
              <span>{predictionError}</span>
              <button
                onClick={() => navigate('/housing')}
                className="px-4 py-2 rounded-full border border-red-300 text-red-700"
              >
                Update housing inputs
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {predictions.map((prediction) => (
                <div key={prediction.name} className="border border-slate-100 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold text-slate-900">{prediction.name}</p>
                    <span className="text-xs uppercase tracking-widest text-slate-400">{prediction.color}</span>
                  </div>
                  <p className="text-sm text-slate-500">{prediction.details?.admin_area || prediction.borough}</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>
                      <span className="font-medium">Predicted price:</span>{' '}
                      ${prediction.predicted_price.toLocaleString()}
                    </p>
                    <p>
                      <span className="font-medium">Affordability:</span> {prediction.affordability_score}
                    </p>
                    <p>
                      <span className="font-medium">Lifestyle:</span> {prediction.lifestyle_score}
                    </p>
                    <p>
                      <span className="font-medium">Combined:</span> {prediction.combined_score}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">NYC Source Congestion</h3>
              <p className="text-sm text-slate-500">
                We only ingest feeds tied to New York City. Bring a CLAUDE_API_KEY to upgrade this block instantly.
              </p>
            </div>
            <span className="px-4 py-2 bg-slate-900 text-white rounded-full text-sm font-semibold">
              {portfolio.sources.length} active sources
            </span>
          </div>
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            {(portfolio.sources || []).map((source) => (
              <div key={source.headline} className="border border-slate-100 rounded-2xl p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-primary">{source.borough}</p>
                <h4 className="text-lg font-semibold text-slate-900 mt-2">{source.headline}</h4>
                <p className="text-sm text-slate-600 mt-2">{source.summary}</p>
                <p className="text-xs text-slate-400 mt-3">{source.source}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-wrap gap-4 justify-between items-center">
          <p className="text-slate-500 text-sm">
            Next step: feed your NYC portfolio into the ML predictor to see budget-aligned options.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/housing')}
              className="px-6 py-3 rounded-full bg-primary text-white font-semibold"
            >
              Set Housing Budget
            </button>
            <button
              onClick={() => navigate('/map')}
              className="px-6 py-3 rounded-full border border-slate-300 text-slate-700 font-semibold"
            >
              Jump to NYC Map
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio
