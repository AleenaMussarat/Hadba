import React, { useEffect, useState } from 'react'

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 30)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="loading-screen">
      <div className="loading-container">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo-circle">
            <span className="logo-emoji">🍖</span>
          </div>
          <h1 className="logo-text">
            Hadba <span>Mandi</span>
          </h1>
          <p className="logo-subtitle">Traditional Yemeni Cuisine</p>
        </div>

        {/* Loading Bar */}
        <div className="loading-bar-container">
          <div 
            className="loading-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="loading-percentage">{progress}%</p>

        {/* Decorative elements */}
        <div className="loading-spices">
          <span>✦</span>
          <span>✦</span>
          <span>✦</span>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen