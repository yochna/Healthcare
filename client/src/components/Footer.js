import React from 'react';
import { Heart, Phone, Mail, MapPin, Bot, Zap, MessageCircle } from 'lucide-react';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="footer-brand">
        <span className="footer-logo">
          <Heart size={20} fill="#13a594" color="#13a594" /> Health<span>Bridge</span>
        </span>
        <p>Compassionate healthcare support for all, powered by community volunteers and AI-driven triage technology.</p>
      </div>
      <div className="footer-links">
        <h4>Services</h4>
        <ul>
          <li>Patient Support</li>
          <li>Volunteer Program</li>
          <li>Mental Wellness</li>
          <li>Emergency Aid</li>
        </ul>
      </div>
      <div className="footer-links">
        <h4>Contact</h4>
        <ul>
          <li><Phone size={13} /> 1800-XXX-XXXX</li>
          <li><Mail size={13} /> support@healthbridge.org</li>
          <li><MapPin size={13} /> Raipur, Chhattisgarh</li>
        </ul>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© 2026 HealthBridge NGO. All services free of charge. Built with React + Node.js + MongoDB.</p>
      <p className="tech-stack">
        <Bot size={11} /> AI-Powered Triage &nbsp;|&nbsp;
        <Zap size={11} /> Smart Auto-Response &nbsp;|&nbsp;
        <MessageCircle size={11} /> FAQ Chatbot
      </p>
    </div>
  </footer>
);

export default Footer;
