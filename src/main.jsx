import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { ConstructionBanner, ContactSection, Footer, Header, HeroSection, ProcessSection, StackSection, WorkSection } from './components/PortfolioSections.jsx'

function App() {
  const [light, setLight] = useState(() => localStorage.getItem('shivam-theme') === 'light')
  useEffect(() => { localStorage.setItem('shivam-theme', light ? 'light' : 'dark') }, [light])

  return <div className={light ? 'site light' : 'site'}>
    <Header light={light} onToggle={() => setLight(value => !value)} />
    <ConstructionBanner />
    <main id="top">
      <HeroSection />
      <WorkSection />
      <ProcessSection />
      <StackSection />
      <ContactSection />
    </main>
    <Footer />
  </div>
}

createRoot(document.getElementById('root')).render(<App />)
