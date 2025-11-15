import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet'
import { useNavigate } from 'react-router-dom'
import { housingAPI } from '../utils/api'
import 'leaflet/dist/leaflet.css'

function MapView() {
  const navigate = useNavigate()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterMode, setFilterMode] = useState('all') // all, affordable, compatible
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState(null)
  const [hoverLoadingName, setHoverLoadingName] = useState(null)
  const [neighborhoodDetails, setNeighborhoodDetails] = useState({})
  const hoverClearTimeout = useRef(null)

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const housingPrefs =
        JSON.parse(localStorage.getItem('housingPreferences')) ?? {
          budget: 500000,
          beds: 2,
          baths: 1,
          propertyType: 'CONDO',
          propertySqft: 1000,
          yearsFuture: 0,
        }
      const response = await housingAPI.predict(housingPrefs)
      setPredictions(response.data.predictions)
    } catch (error) {
      console.error('Error fetching predictions:', error)
      alert('Failed to load predictions')
    } finally {
      setLoading(false)
    }
  }

  const getMarkerColor = (prediction) => {
    if (prediction.color === 'green') return '#10B981'
    if (prediction.color === 'yellow') return '#F59E0B'
    return '#EF4444'
  }

  const filteredPredictions = predictions.filter((pred) => {
    if (filterMode === 'affordable') return pred.affordability_score >= 70
    if (filterMode === 'compatible') return pred.lifestyle_score >= 70
    return true
  })

  const handleNeighborhoodHover = async (prediction) => {
    if (hoverClearTimeout.current) {
      clearTimeout(hoverClearTimeout.current)
      hoverClearTimeout.current = null
    }

    setHoveredNeighborhood({
      ...prediction,
      ...neighborhoodDetails[prediction.name],
    })

    if (neighborhoodDetails[prediction.name]) {
      return
    }

    setHoverLoadingName(prediction.name)
    try {
      const response = await housingAPI.getNeighborhood(prediction.name)
      const detailPayload = {
        details: response.data.neighborhood,
        ai_summary: response.data.ai_summary,
      }
      setNeighborhoodDetails((prev) => ({
        ...prev,
        [prediction.name]: detailPayload,
      }))
      setHoveredNeighborhood((prev) => {
        if (!prev || prev.name !== prediction.name) return prev
        return { ...prev, ...detailPayload }
      })
    } catch (error) {
      console.error('Error fetching neighborhood details:', error)
    } finally {
      setHoverLoadingName(null)
    }
  }

  const handleNeighborhoodLeave = () => {
    if (hoverClearTimeout.current) {
      clearTimeout(hoverClearTimeout.current)
    }
    hoverClearTimeout.current = setTimeout(() => {
      setHoveredNeighborhood(null)
      setHoverLoadingName(null)
    }, 200)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing neighborhoods...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-96 bg-white shadow-lg overflow-y-auto">
        <div className="p-6">
          <h1 className="text-2xl mt-20 font-bold text-gray-800 mb-4">
            Map View
          </h1>

          {/* Filters */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter Results
            </label>
            <select
              value={filterMode}
              onChange={(e) => setFilterMode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Neighborhoods</option>
              <option value="affordable">Affordable Only</option>
              <option value="compatible">High Lifestyle Match</option>
            </select>
          </div>

          {/* Legend */}
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Great Match (70-100)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span>Good Match (40-69)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span>Poor Match (0-39)</span>
              </div>
            </div>
          </div>

          {/* Top Matches */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Top Matches ({filteredPredictions.length})
            </h3>
            <div className="space-y-2">
              {filteredPredictions.slice(0, 10).map((pred) => (
                <div
                  key={pred.name}
                  onClick={() => handleNeighborhoodHover(pred)}
                  onMouseEnter={() => handleNeighborhoodHover(pred)}
                  onMouseLeave={handleNeighborhoodLeave}
                  className={`p-3 rounded-lg cursor-pointer transition ${
                    hoveredNeighborhood?.name === pred.name ? 'bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-800">{pred.name}</h4>
                      <p className="text-xs text-gray-600">
                        ${pred.predicted_price.toLocaleString()}
                      </p>
                    </div>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getMarkerColor(pred) }}
                    ></div>
                  </div>
                  <div className="mt-2 flex gap-2 text-xs">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      Score: {pred.combined_score.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredPredictions.map((prediction) => (
            <CircleMarker
              key={prediction.name}
              center={[prediction.lat, prediction.lng]}
              radius={8}
              fillColor={getMarkerColor(prediction)}
              color="#fff"
              weight={2}
              opacity={1}
              fillOpacity={0.8}
              eventHandlers={{
                mouseover: () => handleNeighborhoodHover(prediction),
                mouseout: handleNeighborhoodLeave,
                click: () => handleNeighborhoodHover(prediction),
              }}
            />
          ))}
        </MapContainer>

        {hoveredNeighborhood && (
          <div
            className="absolute top-4 right-4 w-96 border border-white/40 rounded-3xl shadow-2xl p-5 z-[1000] hover-card"
            style={{
              background: 'rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(24px)',
            }}
            onMouseEnter={() => {
              if (hoverClearTimeout.current) {
                clearTimeout(hoverClearTimeout.current)
                hoverClearTimeout.current = null
              }
            }}
            onMouseLeave={handleNeighborhoodLeave}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-primary">
                  {hoveredNeighborhood.details?.admin_area || hoveredNeighborhood.borough || 'NYC'}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {hoveredNeighborhood.name}
                </h3>
              </div>
              <span
                className="w-3 h-3 rounded-full mt-1"
                style={{ backgroundColor: getMarkerColor(hoveredNeighborhood) }}
              ></span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mb-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Predicted price</p>
                <p className="text-lg font-semibold text-slate-900">
                  ${hoveredNeighborhood.predicted_price.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Overall score</p>
                <p className="text-lg font-semibold text-slate-900">
                  {hoveredNeighborhood.combined_score.toFixed(0)}/100
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Affordability</p>
                <p className="font-semibold">{hoveredNeighborhood.affordability_score.toFixed(0)}/100</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Lifestyle</p>
                <p className="font-semibold">{hoveredNeighborhood.lifestyle_score.toFixed(0)}/100</p>
              </div>
            </div>
            {hoverLoadingName === hoveredNeighborhood.name ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span>Pulling local insights…</span>
              </div>
            ) : hoveredNeighborhood.ai_summary ? (
              <div className="text-sm text-slate-600 space-y-2">
                <p className="font-medium text-slate-900">{hoveredNeighborhood.ai_summary.overall}</p>
                <div className="flex gap-4 text-xs">
                  <div className="flex-1">
                    <p className="font-semibold text-green-700 uppercase tracking-wide text-[0.7rem] mb-1">
                      Pros
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      {hoveredNeighborhood.ai_summary.pros.slice(0, 2).map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-red-700 uppercase tracking-wide text-[0.7rem] mb-1">
                      Cons
                    </p>
                    <ul className="space-y-1 list-disc list-inside">
                      {hoveredNeighborhood.ai_summary.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="text-xs text-slate-400">
                  Sentiment: {hoveredNeighborhood.ai_summary.sentiment_score}/10 · Sources:{' '}
                  {hoveredNeighborhood.ai_summary.sources[0]}
                </p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                Hover to preview detailed insights for this neighborhood.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MapView
