import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';

// lazy load forms
const PatientForm = lazy(() => import('./components/PatientForm'));
const VolunteerForm = lazy(() => import('./components/VolunteerForm'));
const ContactForm = lazy(() => import('./components/ContactForm'));

// lazy load admin pages
const Login = lazy(() => import('./pages/Login'));
const Patients = lazy(() => import('./pages/Patients'));
const Volunteers = lazy(() => import('./pages/Volunteers'));
const Contacts = lazy(() => import('./pages/Contacts'));

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
            Loading...
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
);

// Public app (existing)
function PublicApp() {
    const [activeTab, setActiveTab] = useState('home');

    const renderContent = () => {
        switch(activeTab) {
            case 'patient':
                return (
                    <ErrorBoundary>
                        <Suspense fallback={<FormLoadingFallback />}>
                            <PatientForm />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'volunteer':
                return (
                    <ErrorBoundary>
                        <Suspense fallback={<FormLoadingFallback />}>
                            <VolunteerForm />
                        </Suspense>
                    </ErrorBoundary>
                );
            case 'contact':
                return (
                    <ErrorBoundary>
                        <Suspense fallback={<FormLoadingFallback />}>
                            <ContactForm />
                        </Suspense>
                    </ErrorBoundary>
                );
            default:
                return <Hero setActiveTab={setActiveTab} />;
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

// Main App with Router
function App() {
    return (
        <BrowserRouter>
            {/* Toast notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    success: {
                        style: {
                            background: '#f0fdf4',
                            color: '#166534',
                            border: '1px solid #86efac'
                        }
                    },
                    error: {
                        style: {
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5'
                        }
                    }
                }}
            />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<PublicApp />} />

                {/* Admin login — public */}
                <Route path="/admin/login" element={
                    <Suspense fallback={<FormLoadingFallback />}>
                        <Login />
                    </Suspense>
                } />

                {/* Protected admin routes */}
                <Route path="/admin/patients" element={
                    <ProtectedRoute>
                        <Suspense fallback={<FormLoadingFallback />}>
                            <Patients />
                        </Suspense>
                    </ProtectedRoute>
                } />
                <Route path="/admin/volunteers" element={
                    <ProtectedRoute>
                        <Suspense fallback={<FormLoadingFallback />}>
                            <Volunteers />
                        </Suspense>
                    </ProtectedRoute>
                } />
                <Route path="/admin/contacts" element={
                    <ProtectedRoute>
                        <Suspense fallback={<FormLoadingFallback />}>
                            <Contacts />
                        </Suspense>
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;