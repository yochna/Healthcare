import React, { useState } from 'react';
import { HeartHandshake, CheckCircle, ClipboardList, Loader, AlertTriangle } from 'lucide-react';
import './Form.css';

const API = process.env.REACT_APP_API_URL || '';

const skillOptions = [
  'Medical/Nursing', 'Counseling', 'Logistics & Transport',
  'Pharmacy/Medication', 'Administrative', 'IT & Tech Support',
  'Community Outreach', 'Language Translation', 'Fundraising'
];

const initialState = {
  name: '', email: '', phone: '', availability: 'flexible',
  experience: '', location: '', motivation: '', skills: []
};

const VolunteerForm = () => {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState(null);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleSkill = skill => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill)
        ? f.skills.filter(s => s !== skill)
        : [...f.skills, skill]
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      await fetch(`${API}/api/volunteers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
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
          <h2>Thank You for Volunteering!</h2>
          <p>Your registration has been received. Our volunteer coordinator will contact you within 48 hours with orientation details and your first assignment.</p>
          <div className="ai-summary">
            <div className="ai-label"><ClipboardList size={13} /> What happens next?</div>
            <p>1. Background verification (2–3 days){'\n'}2. Orientation session (online/offline){'\n'}3. Skill-matched assignment to a team{'\n'}4. You start making a difference!</p>
          </div>
          <button className="btn-primary" onClick={() => setStatus(null)}>Register Another Volunteer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container fade-in">
        <div className="form-header">
          <HeartHandshake size={36} color="white" strokeWidth={1.5} />
          <h1>Volunteer Registration</h1>
          <p>Join our network of 380+ volunteers. Your time and skills can save lives.</p>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
            </div>
            <div className="form-group">
              <label>Location / City *</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="e.g., Raipur, Bilaspur..." required />
            </div>
          </div>

          <div className="form-group">
            <label>Skills / Areas of Expertise</label>
            <div className="skills-grid">
              {skillOptions.map(skill => (
                <button type="button" key={skill}
                  className={`skill-chip ${form.skills.includes(skill) ? 'selected' : ''}`}
                  onClick={() => toggleSkill(skill)}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Availability *</label>
            <select name="availability" value={form.availability} onChange={handleChange}>
              <option value="weekdays">Weekdays only</option>
              <option value="weekends">Weekends only</option>
              <option value="both">Both weekdays & weekends</option>
              <option value="flexible">Flexible / On-call</option>
            </select>
          </div>

          <div className="form-group">
            <label>Relevant Experience</label>
            <textarea name="experience" value={form.experience} onChange={handleChange}
              placeholder="Brief description of any healthcare, social work, or volunteer experience..."
              rows={3} />
          </div>

          <div className="form-group">
            <label>Why do you want to volunteer? *</label>
            <textarea name="motivation" value={form.motivation} onChange={handleChange}
              placeholder="Tell us what motivates you to volunteer with HealthBridge NGO..."
              rows={3} required />
          </div>

          <div className="ai-note">
            <ClipboardList size={15} color="#0a7c6e" />
            <span><strong>Smart Matching:</strong> Our system matches your skills and availability with patient needs and active campaigns in your area.</span>
          </div>

          <button type="submit" className="submit-btn" disabled={status === 'loading'}>
            {status === 'loading'
              ? <><Loader size={18} className="spin" /> Submitting...</>
              : <><HeartHandshake size={18} /> Register as Volunteer</>}
          </button>

          {status === 'error' && (
            <div className="error-msg"><AlertTriangle size={15} /> Something went wrong. Please try again.</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VolunteerForm;
