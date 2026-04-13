import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import { lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';

const PatientForm = lazy(() => import('./components/PatientForm'));
const VolunteerForm = lazy(() => import('./components/VolunteerForm'));
const ContactForm = lazy(() => import('./components/ContactForm'));

const FormLoadingFallback = () => (
  <div style={{
    padding: '40px',
    textAlign: 'center',
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    color: '#0a7c6e'
  }}>
    <div>
      <div style={{
        width: '40px',
        height: '40px',
        border: '4px solid #e0e7ff',
        borderTop: '4px solid #0a7c6e',
        borderRadius: '50%',
        margin: '0 auto 16px',
        animation: 'spin 1s linear infinite'
      }}></div>
      Loading form...
    </div>
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)
function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'patient':
        return (<ErrorBoundary>
          <Suspense fallback={<FormLoadingFallback />}>
            <PatientForm />;
          </Suspense>
        </ErrorBoundary>)
      case 'volunteer':
        return (<ErrorBoundary>
          <Suspense fallback={<FormLoadingFallback />}>
            <VolunteerForm />;
          </Suspense>
        </ErrorBoundary>)
      case 'contact':
        return (<ErrorBoundary>
          <Suspense fallback={<FormLoadingFallback />}>
            <ContactForm />;
          </Suspense>
        </ErrorBoundary>)
      default: return <Hero setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {renderContent()}
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}

export default App;
