import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogOut, Bell, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function StudentLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        function handleClickOutside(event) {
            if (event.target.closest('#student-notification-container') === null) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ height: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Top Navigation Bar */}
            <header style={{ backgroundColor: 'white', padding: '1rem 2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#14b8a6' }}>
                        <BookOpen size={28} />
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>BookFlow <span style={{ fontWeight: 400, color: '#64748b' }}>Student</span></h1>
                    </div>
                    
                    <nav style={{ display: 'flex', gap: '1.5rem', marginLeft: '2rem' }}>
                        <Link to="/student/home" style={{ textDecoration: 'none', color: '#475569', fontWeight: 600, fontSize: '0.9rem' }}>Dashboard</Link>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div id="student-notification-container" style={{ position: 'relative' }}>
                        <button onClick={() => setShowNotifications(!showNotifications)} style={{ backgroundColor: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '50%', color: '#64748b', cursor: 'pointer', display: 'flex', position: 'relative' }}>
                            <Bell size={20} />
                            <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid #f1f5f9' }}></span>
                        </button>
                        
                        {showNotifications && (
                            <div style={{
                                position: 'absolute',
                                top: '120%',
                                right: 0,
                                width: '320px',
                                backgroundColor: 'white',
                                borderRadius: '1rem',
                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                                zIndex: 100,
                                overflow: 'hidden',
                                border: '1px solid #f1f5f9'
                            }}>
                                <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Notifications</h4>
                                    <span style={{ fontSize: '0.75rem', color: '#06b6d4', cursor: 'pointer', fontWeight: 500 }}>Mark all as read</span>
                                </div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4', marginTop: '6px', flexShrink: 0 }}></div>
                                        <div>
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 500 }}>Book Due Tomorrow</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>"The Clean Coder" is due tomorrow. Please return it to avoid fines.</p>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>1 hour ago</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'transparent', marginTop: '6px', flexShrink: 0 }}></div>
                                        <div>
                                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 500 }}>Reservation Available</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>"Design Patterns" is now available for pickup at the front desk.</p>
                                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>Yesterday</p>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ padding: '0.75rem', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>View All Notifications</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={handleLogout} style={{ backgroundColor: '#fee2e2', border: 'none', padding: '0.5rem', borderRadius: '50%', color: '#ef4444', cursor: 'pointer', display: 'flex' }} title="Logout">
                        <LogOut size={20} />
                    </button>

                    <button 
                        onClick={() => navigate('/student/account')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.5rem', transition: 'background-color 0.2s' }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: '#0f172a' }}>{user?.name || 'Student'}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{user?.admissionNumber || 'Online'}</p>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#14b8a6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={20} />
                        </div>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', width: '100%' }}>
                <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
