import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStaff } from '../../services/authService.js';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Mail, Lock, Eye, User, Briefcase, Building } from 'lucide-react';

export default function Signup() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        fullName: '',
        staffId: '',
        department: '',
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
            const data = await registerStaff(formData);
            login(data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Staff ID or Email might be taken.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Left Graphic Panel */}
            <div style={{ flex: '0 0 45%', background: 'linear-gradient(135deg, #0f172a 0%, #064e3b 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ width: '400px', height: '250px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '1rem', backdropFilter: 'blur(10px)', marginBottom: '2rem', display: 'flex', alignItems: 'center', padding: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Empower your library.</h3>
                            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', marginTop: '0.5rem', lineHeight: 1.6 }}>Join the team digitally to track books, assist students, and manage physical assets easily from your customized dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Signup Panel */}
            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '460px', backgroundColor: 'white', padding: '2.5rem 3rem', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}>
                    
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>Create Staff Account</h2>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Please enter your details to register as a staff member.</p>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid #fca5a5' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="text" name="fullName" placeholder="Johnathan Doe" value={formData.fullName} onChange={handleChange} required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Staff ID</label>
                                <div style={{ position: 'relative' }}>
                                    <Briefcase size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input 
                                        type="text" name="staffId" placeholder="LM-2024-001" value={formData.staffId} onChange={handleChange} required
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.875rem' }}
                                    />
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Department</label>
                                <div style={{ position: 'relative' }}>
                                    <Building size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <select 
                                        name="department" value={formData.department} onChange={handleChange} required
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.875rem', appearance: 'none' }}
                                    >
                                        <option value="" disabled>Select Dept.</option>
                                        <option value="Circulation">Circulation</option>
                                        <option value="Cataloging">Cataloging</option>
                                        <option value="Administration">Administration</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="email" name="email" placeholder="staff@bookflow.com" value={formData.email} onChange={handleChange} required
                                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.875rem' }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input 
                                    type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength="6"
                                    style={{ width: '100%', padding: '0.75rem 2.75rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '1rem', letterSpacing: '2px' }}
                                />
                                <Eye size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer' }} />
                            </div>
                            {/* Strength indicator visual */}
                            <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.75rem', gap: '0.5rem' }}>
                                <div style={{ height: '4px', backgroundColor: '#14b8a6', flex: 1, borderRadius: '2px' }}></div>
                                <div style={{ height: '4px', backgroundColor: '#e2e8f0', flex: 1, borderRadius: '2px' }}></div>
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', marginLeft: '0.5rem' }}>Strong password</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <input type="checkbox" id="terms" required style={{ width: '16px', height: '16px', borderRadius: '4px', border: '1px solid #cbd5e1', marginTop: '0.125rem' }} />
                            <label htmlFor="terms" style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
                                I agree to the <span style={{ color: '#06b6d4' }}>Terms of Service</span> and <span style={{ color: '#06b6d4' }}>Privacy Policy</span> of BookFlow.
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            style={{ width: '100%', padding: '0.875rem', backgroundColor: '#06b6d4', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', marginTop: '0.5rem', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(6, 182, 212, 0.3)' }}
                        >
                            {isLoading ? "Creating..." : "Create Account"}
                        </button>

                    </form>

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            Already have an account? <Link to="/login" style={{ color: '#06b6d4', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
                        </p>
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <p style={{ fontSize: '0.65rem', color: '#cbd5e1' }}>Having trouble signing up? <span style={{textDecoration: 'underline'}}>Contact IT Administration</span></p>
                    </div>

                </div>
            </div>
        </div>
    );
}
