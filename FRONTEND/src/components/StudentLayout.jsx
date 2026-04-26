import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, LogOut, Bell, User } from 'lucide-react';
import { AuthContext } from '../context/AuthContext.jsx';

export default function StudentLayout({ children }) {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
                    <button style={{ backgroundColor: '#f1f5f9', border: 'none', padding: '0.5rem', borderRadius: '50%', color: '#64748b', cursor: 'pointer', display: 'flex' }}>
                        <Bell size={20} />
                    </button>
                    
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 'bold', color: '#0f172a' }}>{user?.name || 'Student'}</p>
                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{user?.admissionNumber || 'Online'}</p>
                            </div>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#14b8a6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={20} />
                            </div>
                        </button>

                        {dropdownOpen && (
                            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 0.5rem)', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', minWidth: '150px', overflow: 'hidden' }}>
                                <button onClick={handleLogout} style={{ width: '100%', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left' }}>
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
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
