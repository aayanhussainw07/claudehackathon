import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function HousingInput() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    budget: 500000,
    beds: 2,
    baths: 1,
    propertyType: 'CONDO',
    propertySqft: 1000,
    yearsFuture: 0,
  })

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Store housing preferences
    localStorage.setItem('housingPreferences', JSON.stringify(formData))
    navigate('/map')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            NYC Housing Preferences
          </h1>
          <p className="text-gray-600 mb-8">
            Set the budget and layout you want to test across the five boroughs.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Budget: ${formData.budget.toLocaleString()}
              </label>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={50000}
                value={formData.budget}
                onChange={(e) => handleChange('budget', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>$100K</span>
                <span>$2M</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bedrooms
                </label>
                <select
                  value={formData.beds}
                  onChange={(e) => handleChange('beds', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num === 0 ? 'Studio' : num}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bathrooms
                </label>
                <select
                  value={formData.baths}
                  onChange={(e) => handleChange('baths', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  {[1, 1.5, 2, 2.5, 3].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleChange('propertyType', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value="CONDO">Condo</option>
                <option value="HOUSE">House</option>
                <option value="TOWNHOUSE">Townhouse</option>
                <option value="APARTMENT">Apartment</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">
                Square Feet: {formData.propertySqft.toLocaleString()} sq ft
              </label>
              <input
                type="range"
                min={500}
                max={3000}
                step={100}
                value={formData.propertySqft}
                onChange={(e) => handleChange('propertySqft', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>500</span>
                <span>3,000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years in the Future (Price Prediction)
              </label>
              <select
                value={formData.yearsFuture}
                onChange={(e) => handleChange('yearsFuture', parseInt(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
              >
                <option value={0}>Current Prices</option>
                <option value={1}>1 Year</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
                <option value={4}>4 Years</option>
                <option value={5}>5 Years</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">
                See predicted prices based on historical appreciation rates
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">NYC Summary</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>Budget: ${formData.budget.toLocaleString()}</li>
                <li>
                  {formData.beds === 0 ? 'Studio' : `${formData.beds} bed`}, {formData.baths} bath
                </li>
                <li>{formData.propertyType}</li>
                <li>{formData.propertySqft.toLocaleString()} sq ft</li>
                {formData.yearsFuture > 0 && (
                  <li>Predicted {formData.yearsFuture} year(s) from now</li>
                )}
              </ul>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition"
            >
              Find My Neighborhoods
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HousingInput
