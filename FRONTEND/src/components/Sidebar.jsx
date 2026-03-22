import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { LayoutDashboard, Users, BookOpen, Repeat, Settings, BarChart2, Briefcase, Megaphone, LogOut } from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'Books Inventory', path: '/books', icon: BookOpen },
        { name: 'Students', path: '/students/view', icon: Users },
        { name: 'Suppliers', path: '/suppliers/view', icon: Briefcase },
        { name: 'Notices', path: '/notices/view', icon: Megaphone },
        { name: 'Circulation', path: '/circulation', icon: Repeat },
    ];

    const secondaryItems = [
        { name: 'Analytics', path: '/analytics', icon: BarChart2 },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return "US";
        return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    };

    return (
        <aside style={{ backgroundColor: 'var(--color-bg-sidebar)', width: '250px', color: 'white', display: 'flex', flexDirection: 'column', height: '100vh', padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color="white" />
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>LibManage Pro</h2>
            </div>

            <nav style={{ flex: 1, overflowY: 'auto' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => isActive ? 'active-link' : ''}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-lg)',
                                    transition: 'all 0.2s',
                                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                    textDecoration: 'none',
                                    fontWeight: isActive ? 600 : 400
                                })}
                            >
                                <item.icon size={20} />
                                <span>{item.name}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>

                <div style={{ marginTop: '2rem' }}>
                    <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '1rem', paddingLeft: '1rem' }}>Insights</p>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {secondaryItems.map((item) => (
                            <li key={item.name}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) => isActive ? 'active-link' : ''}
                                    style={({ isActive }) => ({
                                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', textDecoration: 'none',
                                        borderRadius: 'var(--radius-lg)', transition: 'all 0.2s',
                                        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                                        fontWeight: isActive ? 600 : 400
                                    })}
                                >
                                    <item.icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.5rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.75rem', color: 'silver', fontWeight: 'bold' }}>{getInitials(user.fullName)}</span>
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: '600', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.fullName}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user.role}</p>
                        </div>
                    </div>
                )}
                
                <button 
                    onClick={handleLogout}
                    style={{ 
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', 
                        width: '100%', backgroundColor: 'transparent', color: '#ef4444', 
                        border: 'none', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                        fontSize: '0.875rem', fontWeight: 600, transition: 'background-color 0.2s',
                        textAlign: 'left'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
