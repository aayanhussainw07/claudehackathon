import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    // Store demo credentials locally so downstream requests work
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('email', email || 'guest@nyc.local')

    // Give the UI a moment to show the loading state
    setTimeout(() => {
      setLoading(false)
      navigate('/quiz')
    }, 300)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            NYC Housing Compatibility
          </h1>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-blue-500 hover:underline"
          >
            Back to website
          </button>
        </div>
        <p className="text-center text-gray-600 mb-6">
          Find your perfect neighborhood
        </p>

        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-l-lg transition`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${!isLogin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded-r-lg transition`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
