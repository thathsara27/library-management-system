import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginStaff } from '../../services/authService.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Mail, Lock, Eye, ArrowRight } from 'lucide-react';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await loginStaff(formData.email, formData.password);
            login(data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to login. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Left Graphic Panel */}
            <div style={{ flex: '0 0 45%', background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', lineHeight: 1.2 }}>Manage your library with precision.</h1>
                    <p style={{ fontSize: '1.125rem', color: '#94a3b8', maxWidth: '400px', lineHeight: 1.6 }}>LibManage Pro provides powerful tools for modern librarians to streamline operations, engage members, and organize vast collections.</p>
                </div>
                {/* Decorative blob */}
                <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(20,184,166,0.15) 0%, rgba(15,23,42,0) 70%)', borderRadius: '50%' }}></div>
            </div>

            {/* Right Login Panel */}
            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '420px', backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)' }}>
                    
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>Welcome Back</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Enter your credentials to access the admin dashboard.</p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="email"
                                    name="email"
                                    placeholder="admin@libromanage.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.875rem', color: '#0f172a' }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#334155' }}>Password</label>
                                <a href="#" style={{ fontSize: '0.75rem', color: '#06b6d4', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    style={{ width: '100%', padding: '0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '1rem', color: '#0f172a', letterSpacing: '2px' }}
                                />
                                <Eye size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input type="checkbox" id="remember" style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                            <label htmlFor="remember" style={{ fontSize: '0.75rem', color: '#64748b' }}>Remember this device for 30 days</label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{ width: '100%', padding: '0.875rem', backgroundColor: '#14b8a6', color: 'white', border: 'none', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginTop: '0.5rem', transition: 'background-color 0.2s' }}
                        >
                            {isLoading ? "Signing In..." : "Sign In"} <ArrowRight size={18} />
                        </button>

                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            Don't have an account? <Link to="/signup" style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '3rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                        <span>Support</span>
                        <span>English (US)</span>
                    </div>

                </div>
            </div>
        </div>
    );
}
