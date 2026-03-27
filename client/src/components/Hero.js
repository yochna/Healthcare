import React from 'react';
import {
  Stethoscope, Users, Brain, Ambulance, Pill, ClipboardList,
  Bot, Zap, HeartHandshake, ArrowRight, Activity
} from 'lucide-react';
import './Hero.css';

const stats = [
  { value: '2,400+', label: 'Patients Supported' },
  { value: '380+', label: 'Active Volunteers' },
  { value: '12', label: 'Districts Covered' },
  { value: '100%', label: 'Free Services' },
];

const services = [
  { icon: Stethoscope, title: 'Patient Support', desc: 'Medical assistance, medication access, and care coordination for underprivileged patients.' },
  { icon: Users, title: 'Volunteer Network', desc: 'Join our trained volunteer force to deliver healthcare directly to communities in need.' },
  { icon: Brain, title: 'Mental Wellness', desc: 'Free counseling and psychological support sessions with certified professionals.' },
  { icon: Ambulance, title: 'Emergency Aid', desc: '24/7 emergency helpline connecting patients to immediate medical resources.' },
  { icon: Pill, title: 'Medicine Access', desc: 'Bridging the gap between patients and subsidized or free medications through partner pharmacies.' },
  { icon: ClipboardList, title: 'Health Camps', desc: 'Regular mobile health camps covering rural and tribal areas across Chhattisgarh.' },
];

const Hero = ({ setActiveTab }) => {
  return (
    <div className="hero-page">
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="shape shape-1" />
          <div className="shape shape-2" />
          <div className="shape shape-3" />
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <Activity size={13} />
            NGO Healthcare Initiative — Raipur, Chhattisgarh
          </div>
          <h1 className="hero-title">
            Compassionate Care,<br />
            <span className="highlight">For Everyone.</span>
          </h1>
          <p className="hero-sub">
            HealthBridge connects vulnerable patients with volunteers, free medical resources,
            and community-driven healthcare — because good health is a right, not a privilege.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setActiveTab('patient')}>
              <Stethoscope size={17} /> Request Patient Support
            </button>
            <button className="btn-secondary" onClick={() => setActiveTab('volunteer')}>
              <HeartHandshake size={17} /> Become a Volunteer
            </button>
          </div>
          <div className="hero-note">
            <span className="dot" /> AI-powered triage & instant chatbot support available
          </div>
        </div>

        <div className="hero-visual">
          <div className="float-card card-1">
            <Bot size={28} color="#0a7c6e" />
            <div><strong>AI Chatbot Active</strong><p>Ask any health question</p></div>
          </div>
          <div className="float-card card-2">
            <Zap size={28} color="#e85d26" />
            <div><strong>Auto-Response</strong><p>Instant support summaries</p></div>
          </div>
          <div className="float-card card-3">
            <HeartHandshake size={28} color="#22c55e" />
            <div><strong>Free Services</strong><p>No charges, ever</p></div>
          </div>
        </div>
      </section>

      <section className="stats-section">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="services-section">
        <div className="section-header">
          <span className="section-tag">What We Do</span>
          <h2>Our Healthcare Services</h2>
          <p>Comprehensive support across medical, mental, and emergency health needs.</p>
        </div>
        <div className="services-grid">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div className="service-card" key={i} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="svc-icon"><Icon size={30} color="#0a7c6e" strokeWidth={1.5} /></div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-inner">
          <div>
            <h2>Need help right now?</h2>
            <p>Our AI chatbot is available 24/7. For urgent medical support, fill our patient form.</p>
          </div>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => setActiveTab('patient')}>
              Get Support Now <ArrowRight size={16} />
            </button>
            <button className="btn-outline" onClick={() => setActiveTab('contact')}>Contact Us</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
