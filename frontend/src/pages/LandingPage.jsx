import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

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

function LandingPage({ quizCompleted, onRetakeQuiz }) {
  const navigate = useNavigate()
  const [showBackToTop, setShowBackToTop] = useState(false)
  const containerRef = useRef(null)

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

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const threshold = window.innerHeight * 2
      setShowBackToTop(scrolled > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handleRetake = () => {
    onRetakeQuiz?.()
    navigate('/quiz')
  }

  return (
    <div ref={containerRef} className="bg-slate-950 text-white min-h-screen">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/60 to-primary/40"></div>
        <motion.div 
          className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col gap-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="uppercase tracking-[0.4em] text-sm text-green-200 mb-4">NYC Housing Website</p>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              Match with NYC neighborhoods based on lifestyle weights powered by Claude.
            </h1>
            <p className="mt-6 text-lg text-green-100 max-w-3xl">
              This is a website built solely for New York City housing decisions. Take a weighted lifestyle quiz,
              build a Claude-backed persona portfolio, and explore affordability predictions on an interactive map.
            </p>
          </motion.div>
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.button
              onClick={handlePrimaryCTA}
              className="px-8 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-green-100 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {quizCompleted ? 'View My NYC Portfolio' : 'Start Quiz'}
            </motion.button>
            <motion.button
              onClick={handleMapCTA}
              className="px-8 py-3 rounded-full border border-white/40 text-white font-semibold hover:bg-white/10 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View NYC Map
            </motion.button>
          </motion.div>
        </motion.div>
      </header>

      <section className="bg-white text-slate-900">
        <motion.div 
          className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6"
          initial="offscreen"
          whileInView="onscreen"
          viewport={{ once: true, amount: 0.3 }}
        >
          {NYC_STATS.map((stat, index) => (
            <motion.div 
              key={stat.label} 
              className="p-6 border border-slate-200 rounded-2xl shadow-sm bg-white/80"
              variants={{
                offscreen: { y: 50, opacity: 0 },
                onscreen: { 
                  y: 0, 
                  opacity: 1,
                  transition: {
                    type: "spring",
                    bounce: 0.3,
                    duration: 0.6,
                    delay: index * 0.1
                  }
                }
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.3)",
                transition: { duration: 0.2 }
              }}
            >
              <p className="text-sm uppercase tracking-widest text-primary">{stat.label}</p>
              <p className="text-4xl font-black mt-3">{stat.value}</p>
              <p className="text-sm mt-2 text-slate-600">{stat.detail}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* "How it Works" Section - Horizontal Layout */}
      <section 
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-16"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-slate-900 to-slate-900"></div>

        {/* Horizontal Steps Container */}
        <div className="w-full max-w-7xl mx-auto px-8 relative z-10">
          <motion.div
            className="grid grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Step 1: Lifestyle Quiz */}
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-5xl mb-4">📝</div>
              <h2 className="text-2xl font-black text-white mb-4">
                Lifestyle Quiz
              </h2>
              <p className="text-sm text-green-200 mb-6 leading-relaxed">
                Rank commute tolerance, nightlife, parks, safety, and more. Each slider becomes a weight that shapes your perfect NYC neighborhood match.
              </p>
              <motion.button
                onClick={() => navigate('/quiz')}
                className="px-6 py-2 bg-primary text-white font-bold text-sm rounded-full hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Quiz
              </motion.button>
            </motion.div>

            {/* Step 2: Claude Portfolio */}
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-5xl mb-4">🤖</div>
              <h2 className="text-2xl font-black text-white mb-4">
                Claude Portfolio
              </h2>
              <p className="text-sm text-green-200 mb-6 leading-relaxed">
                We aggregate NYC-only data sources then feed the signals into Claude with your weights to create personalized neighborhood insights.
              </p>
              <motion.button
                onClick={() => navigate('/portfolio')}
                className="px-6 py-2 bg-primary text-white font-bold text-sm rounded-full hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Portfolio
              </motion.button>
            </motion.div>

            {/* Step 3: Housing Explorer */}
            <motion.div 
              className="text-center p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className="text-5xl mb-4">🏠</div>
              <h2 className="text-2xl font-black text-white mb-4">
                Housing Explorer
              </h2>
              <p className="text-sm text-green-200 mb-6 leading-relaxed">
                Predict values with the claudehackathon-mlmodel, filter for boroughs, and dive into the interactive map to find your perfect home.
              </p>
              <motion.button
                onClick={() => navigate('/map')}
                className="px-6 py-2 bg-primary text-white font-bold text-sm rounded-full hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Map
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-24 h-24 bg-primary/10 rounded-full blur-xl"
          animate={{
            y: [0, 40, 0],
            x: [0, -25, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </section>

      {/* Source Feed Section - Now separate after scroll hijacking */}
      <section className="bg-slate-900 py-16">
        <motion.div 
          className="max-w-6xl mx-auto px-6"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <p className="uppercase text-sm tracking-[0.4em] text-green-300 mb-4">Source Congestion</p>
            <h3 className="text-3xl font-bold mb-6 text-white">Feeds we blend for NYC-only insights</h3>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {SOURCE_FEED.map((item, index) => (
              <motion.div 
                key={item.source} 
                className="bg-slate-800/60 border border-white/10 rounded-xl p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + (index * 0.1),
                  type: "spring",
                  bounce: 0.2
                }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: "rgba(61, 135, 67, 0.3)",
                  transition: { duration: 0.2 }
                }}
              >
                <p className="text-xs uppercase tracking-[0.4em] text-green-400 mb-2">{item.source}</p>
                <p className="text-sm text-green-100">{item.insight}</p>
              </motion.div>
            ))}
          </div>
          <motion.p 
            className="text-xs text-slate-400 mt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
          >
            Bring your own Claude API key via environment variables to generate live insights from these sources.
          </motion.p>
        </motion.div>
      </section>

      <section className="bg-slate-900 relative overflow-hidden">
        <motion.div className="max-w-6xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-green-400">NYC Focus</p>
            <h2 className="text-3xl font-bold mt-4 text-white">Every feature is scoped to NYC</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-10">
            {[
              {
                title: "Neighborhood Inventory",
                description: "42 curated NYC neighborhoods with borough metadata, vibes, and coordinates.",
                icon: "🏙️",
                gradient: "from-green-500/20 to-emerald-600/20"
              },
              {
                title: "Claude Integration", 
                description: "Claude digests Reddit, newsletters, and DOT releases to describe how your persona fits each borough.",
                icon: "🧠",
                gradient: "from-primary/20 to-green-700/20"
              },
              {
                title: "ML Price Model",
                description: "claudehackathon-mlmodel powers the housing predictor so your map stays NYC-specific.",
                icon: "📊",
                gradient: "from-green-600/20 to-green-800/20"
              }
            ].map((feature, index) => (
              <motion.div 
                key={feature.title}
                className={`p-6 bg-gradient-to-br ${feature.gradient} bg-slate-950 border border-white/10 rounded-2xl relative overflow-hidden group`}
                initial={{ opacity: 0, y: 50, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.7,
                  delay: index * 0.2,
                  type: "spring",
                  bounce: 0.3
                }}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className="absolute top-4 right-4 text-4xl opacity-30"
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.3
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-white relative z-10">{feature.title}</h3>
                <p className="text-sm text-slate-300 relative z-10">{feature.description}</p>
                
                {/* Hover effect background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-primary/5 opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Floating background elements */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-green-500/5 rounded-full blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-24 h-24 bg-primary/5 rounded-full blur-xl"
          animate={{
            y: [0, 20, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </section>

      {/* Back to Top Button */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 bg-primary hover:bg-green-600 text-white p-4 rounded-full shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </div>
  )
}

export default LandingPage
