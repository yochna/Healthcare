import React, { useState, useEffect } from 'react';
import { Heart, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'patient', label: 'Patient Support' },
    { id: 'volunteer', label: 'Volunteer' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-brand" onClick={() => setActiveTab('home')}>
          <Heart size={22} fill="#0a7c6e" color="#0a7c6e" />
          <span className="brand-name">Health<span>Bridge</span></span>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(item.id); setMenuOpen(false); }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button className="nav-cta" onClick={() => { setActiveTab('patient'); setMenuOpen(false); }}>
              Get Help
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
