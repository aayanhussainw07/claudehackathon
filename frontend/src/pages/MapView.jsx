import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { housingAPI } from '../utils/api'
import 'leaflet/dist/leaflet.css'

function MapView() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(null)
  const [filterMode, setFilterMode] = useState('all') // all, affordable, compatible

  useEffect(() => {
    fetchPredictions()
  }, [])

  const fetchPredictions = async () => {
    try {
      const housingPrefs = JSON.parse(localStorage.getItem('housingPreferences'))
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

  const handleMarkerClick = async (prediction) => {
    setSelectedNeighborhood(prediction)
    try {
      const response = await housingAPI.getNeighborhood(prediction.name)
      setSelectedNeighborhood({
        ...prediction,
        details: response.data.neighborhood,
        ai_summary: response.data.ai_summary,
      })
    } catch (error) {
      console.error('Error fetching neighborhood details:', error)
    }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            NYC Housing Map
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Powered by claudehackathon-mlmodel and NYC-only data sources.
          </p>

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

          {/* Selected Neighborhood Details */}
          {selectedNeighborhood && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {selectedNeighborhood.name}
              </h3>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="font-medium">Predicted Price:</span>
                  <span className="font-bold text-primary">
                    ${selectedNeighborhood.predicted_price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Affordability:</span>
                  <span>{selectedNeighborhood.affordability_score.toFixed(0)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Lifestyle Match:</span>
                  <span>{selectedNeighborhood.lifestyle_score.toFixed(0)}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Overall Score:</span>
                  <span className="font-bold">
                    {selectedNeighborhood.combined_score.toFixed(0)}/100
                  </span>
                </div>
              </div>

              {selectedNeighborhood.ai_summary && (
                <div className="mt-4 pt-4 border-t border-green-200">
                  <h4 className="font-semibold mb-2">AI Summary</h4>
                  <p className="text-sm text-gray-700 mb-3">
                    {selectedNeighborhood.ai_summary.overall}
                  </p>

                  <div className="mb-2">
                    <h5 className="font-medium text-sm mb-1 text-green-700">Pros:</h5>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedNeighborhood.ai_summary.pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-sm mb-1 text-red-700">Cons:</h5>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {selectedNeighborhood.ai_summary.cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    <p>Sentiment Score: {selectedNeighborhood.ai_summary.sentiment_score}/10</p>
                    <p>Sources: {selectedNeighborhood.ai_summary.sources.join(', ')}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Top Matches */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-800 mb-3">
              Top Matches ({filteredPredictions.length})
            </h3>
            <div className="space-y-2">
              {filteredPredictions.slice(0, 10).map((pred) => (
                <div
                  key={pred.name}
                  onClick={() => handleMarkerClick(pred)}
                  className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition"
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
      <div className="flex-1">
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
                click: () => handleMarkerClick(prediction),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-gray-800">{prediction.name}</h3>
                  <p className="text-sm">
                    ${prediction.predicted_price.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600">
                    Score: {prediction.combined_score.toFixed(0)}/100
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default MapView
