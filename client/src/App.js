import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PatientForm from './components/PatientForm';
import VolunteerForm from './components/VolunteerForm';
import ContactForm from './components/ContactForm';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'patient': return <PatientForm />;
      case 'volunteer': return <VolunteerForm />;
      case 'contact': return <ContactForm />;
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
