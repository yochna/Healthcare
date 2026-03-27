import React, { useState } from 'react';
import { Stethoscope, CheckCircle, Bot, AlertTriangle, Loader } from 'lucide-react';
import './Form.css';

const API = process.env.REACT_APP_API_URL || '';

const initialState = {
  name: '', age: '', email: '', phone: '',
  condition: '', urgency: 'medium', supportNeeded: '', address: ''
};

const urgencyConfig = {
  low:      { color: '#22c55e', bg: '#f0fdf4', border: '#bbf7d0', label: 'Low' },
  medium:   { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'Medium' },
  high:     { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'High' },
  critical: { color: '#7c2d12', bg: '#fff7ed', border: '#fed7aa', label: 'Critical' },
};

const PatientForm = () => {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API}/api/patients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setResult(data);
      setStatus('success');
      setForm(initialState);
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="form-page">
        <div className="success-card fade-in">
          <div className="success-icon"><CheckCircle size={56} color="#0a7c6e" strokeWidth={1.5} /></div>
          <h2>Support Request Submitted!</h2>
          <p>Our team will reach out within 24 hours. Here's your AI-generated case summary:</p>
          <div className="ai-summary">
            <div className="ai-label"><Bot size={13} /> AI Case Summary</div>
            <p>{result?.aiSummary}</p>
          </div>
          <button className="btn-primary" onClick={() => setStatus(null)}>Submit Another Request</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container fade-in">
        <div className="form-header">
          <Stethoscope size={36} color="white" strokeWidth={1.5} />
          <h1>Patient Support Request</h1>
          <p>Fill in the details below. Our AI system will triage your case and connect you with the right support.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label>Age *</label>
              <input name="age" type="number" value={form.age} onChange={handleChange} placeholder="Your age" min="0" max="120" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
            </div>
          </div>

          <div className="form-group">
            <label>Medical Condition / Diagnosis *</label>
            <input name="condition" value={form.condition} onChange={handleChange} placeholder="e.g., Diabetes, Cancer, TB, General checkup needed..." required />
          </div>

          <div className="form-group">
            <label>Urgency Level *</label>
            <div className="urgency-grid">
              {Object.entries(urgencyConfig).map(([key, cfg]) => (
                <label key={key} className={`urgency-option ${form.urgency === key ? 'selected' : ''}`}
                  style={form.urgency === key ? { background: cfg.bg, borderColor: cfg.color } : {}}>
                  <input type="radio" name="urgency" value={key} checked={form.urgency === key} onChange={handleChange} />
                  <span className="urgency-dot" style={{ background: cfg.color }} />
                  {cfg.label}
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Type of Support Needed *</label>
            <textarea name="supportNeeded" value={form.supportNeeded} onChange={handleChange}
              placeholder="Describe what kind of help you need — medical supplies, counseling, home visits, medication assistance, etc."
              rows={3} required />
          </div>

          <div className="form-group">
            <label>Address / Location</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Your area / district (helps us assign nearest volunteer)" />
          </div>

          <div className="ai-note">
            <Bot size={15} color="#0a7c6e" />
            <span><strong>AI Triage:</strong> Upon submission, our system auto-generates a priority summary and assigns your case to the relevant support team.</span>
          </div>

          <button type="submit" className="submit-btn" disabled={status === 'loading'}>
            {status === 'loading'
              ? <><Loader size={18} className="spin" /> Submitting...</>
              : <><Stethoscope size={18} /> Submit Support Request</>}
          </button>

          {status === 'error' && (
            <div className="error-msg">
              <AlertTriangle size={15} /> Something went wrong. Please try again or call 1800-XXX-XXXX.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PatientForm;
