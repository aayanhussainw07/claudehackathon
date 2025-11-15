import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { quizAPI } from '../utils/api'

function Quiz({ setQuizCompleted }) {
  const navigate = useNavigate()
  const [currentSection, setCurrentSection] = useState(0)
  const [loading, setLoading] = useState(false)

  const [answers, setAnswers] = useState({
    // Geography
    max_commute_miles: 5,

    // Lifestyle
    walkability: 5,
    nightlife: 5,
    parks: 5,
    public_transit: 5,

    // Food & Culture
    food_importance: 5,
    diversity: 5,

    // Demographics
    safety: 5,
    age_group_preference: 'no_preference',
  })

  const sections = [
    {
      title: 'Geography Preferences',
      questions: [
        {
          key: 'max_commute_miles',
          label: 'Maximum commute distance (miles)',
          type: 'range',
          min: 1,
          max: 20,
          step: 1,
        },
      ],
    },
    {
      title: 'Lifestyle & Environment',
      questions: [
        {
          key: 'walkability',
          label: 'How important is walkability?',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          leftLabel: 'Not Important',
          rightLabel: 'Very Important',
        },
        {
          key: 'nightlife',
          label: 'Nightlife preference',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          leftLabel: 'Quiet',
          rightLabel: 'Vibrant',
        },
        {
          key: 'parks',
          label: 'Access to parks and green spaces',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          leftLabel: 'Not Important',
          rightLabel: 'Very Important',
        },
        {
          key: 'public_transit',
          label: 'Public transportation importance',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          leftLabel: 'Not Important',
          rightLabel: 'Very Important',
        },
      ],
    },
    {
      title: 'Food & Culture',
      questions: [
        {
          key: 'food_importance',
          label: 'Restaurant and food scene importance',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          leftLabel: 'Not Important',
          rightLabel: 'Very Important',
        },
        {
          key: 'diversity',
          label: 'Cultural diversity preference',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          leftLabel: 'Not Important',
          rightLabel: 'Very Important',
        },
      ],
    },
    {
      title: 'Neighborhood Fit',
      questions: [
        {
          key: 'safety',
          label: 'Safety and family-friendliness',
          type: 'range',
          min: 0,
          max: 10,
          step: 1,
          leftLabel: 'Not Important',
          rightLabel: 'Very Important',
        },
        {
          key: 'age_group_preference',
          label: 'Preferred demographic',
          type: 'select',
          options: [
            { value: 'no_preference', label: 'No Preference' },
            { value: 'students', label: 'Students' },
            { value: 'young professionals', label: 'Young Professionals' },
            { value: 'professionals', label: 'Professionals' },
            { value: 'families', label: 'Families' },
            { value: 'mixed', label: 'Mixed' },
          ],
        },
      ],
    },
  ]

  const handleChange = (key, value) => {
    setAnswers({ ...answers, [key]: value })
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await quizAPI.submit(answers)
      localStorage.setItem('quizCompleted', 'true')
      setQuizCompleted(true)
      navigate('/portfolio')
    } catch (error) {
      console.error('Error submitting quiz:', error)
      alert('Failed to save quiz results')
    } finally {
      setLoading(false)
    }
  }

  const currentSectionData = sections[currentSection]
  const progress = ((currentSection + 1) / sections.length) * 100

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Lifestyle Quiz
            </h1>
            <p className="text-gray-600">
              Section {currentSection + 1} of {sections.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {currentSectionData.title}
          </h2>

          <div className="space-y-8">
            {currentSectionData.questions.map((question) => (
              <div key={question.key}>
                <label className="block text-lg font-medium text-gray-700 mb-3">
                  {question.label}
                </label>

                {question.type === 'range' && (
                  <div>
                    <input
                      type="range"
                      min={question.min}
                      max={question.max}
                      step={question.step}
                      value={answers[question.key]}
                      onChange={(e) =>
                        handleChange(question.key, parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-sm text-gray-600">
                        {question.leftLabel || question.min}
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {answers[question.key]}
                      </span>
                      <span className="text-sm text-gray-600">
                        {question.rightLabel || question.max}
                      </span>
                    </div>
                  </div>
                )}

                {question.type === 'select' && (
                  <select
                    value={answers[question.key]}
                    onChange={(e) => handleChange(question.key, e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    {question.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={currentSection === 0}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {loading
                ? 'Saving...'
                : currentSection === sections.length - 1
                  ? 'Complete'
                  : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Quiz
