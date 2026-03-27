import React, { useState } from 'react';
import { Mail, CheckCircle, Zap, Phone, MapPin, Loader, AlertTriangle } from 'lucide-react';
import './Form.css';

const API = process.env.REACT_APP_API_URL || '';

const initialState = { name: '', email: '', subject: '', message: '' };

const ContactForm = () => {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState(null);
  const [autoReply, setAutoReply] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch(`${API}/api/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      setAutoReply(data.autoReply);
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
          <h2>Message Sent!</h2>
          <p>We've received your message. Here's your AI-generated auto-response:</p>
          <div className="ai-summary">
            <div className="ai-label"><Zap size={13} /> Auto-Response from HealthBridge</div>
            <p>{autoReply}</p>
          </div>
          <button className="btn-primary" onClick={() => setStatus(null)}>Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-page">
      <div className="form-container fade-in">
        <div className="form-header">
          <Mail size={36} color="white" strokeWidth={1.5} />
          <h1>Contact Us</h1>
          <p>Reach out with questions, feedback, or partnership inquiries. Our AI auto-responds instantly, and our team follows up within 24–48 hours.</p>
        </div>

        <div className="contact-info-strip">
          <div className="contact-info-item">
            <Phone size={20} color="#0a7c6e" />
            <div><strong>Helpline</strong><p>1800-XXX-XXXX (24/7)</p></div>
          </div>
          <div className="contact-info-item">
            <Mail size={20} color="#0a7c6e" />
            <div><strong>Email</strong><p>support@healthbridge.org</p></div>
          </div>
          <div className="contact-info-item">
            <MapPin size={20} color="#0a7c6e" />
            <div><strong>Office</strong><p>Raipur, Chhattisgarh</p></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="form-body">
          <div className="form-row">
            <div className="form-group">
              <label>Your Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="Full name" required />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required />
            </div>
          </div>

          <div className="form-group">
            <label>Subject *</label>
            <input name="subject" value={form.subject} onChange={handleChange}
              placeholder="e.g., Appointment inquiry, Donation, Volunteer info, Emergency support..." required />
          </div>

          <div className="form-group">
            <label>Message *</label>
            <textarea name="message" value={form.message} onChange={handleChange}
              placeholder="Write your message here. Include as much detail as possible so we can help you faster."
              rows={5} required />
          </div>

          <div className="ai-note">
            <Zap size={15} color="#0a7c6e" />
            <span><strong>Smart Auto-Reply:</strong> Our AI reads your message and generates a relevant instant response. A human team member will follow up for complex queries.</span>
          </div>

          <button type="submit" className="submit-btn" disabled={status === 'loading'}>
            {status === 'loading'
              ? <><Loader size={18} className="spin" /> Sending...</>
              : <><Mail size={18} /> Send Message</>}
          </button>

          {status === 'error' && (
            <div className="error-msg"><AlertTriangle size={15} /> Something went wrong. Please call 1800-XXX-XXXX directly.</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
