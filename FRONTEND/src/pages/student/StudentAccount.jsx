import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { Edit2, Book, BookOpen, Wallet, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function StudentAccount() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('Lending History');
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [finesPaid, setFinesPaid] = useState(false);
    const [isPaying, setIsPaying] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || user?.fullName || 'Tharindu Lakshan',
        course: 'Computer Science',
        email: user?.email || 'tharindulakshan@gmail.com',
        phone: user?.phone || '+9476433900'
    });

    const handlePayFines = () => {
        setIsPaying(true);
        setTimeout(() => {
            setFinesPaid(true);
            setIsPaying(false);
        }, 1500);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0 3rem 0', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '1.5rem' }}>
                Students <span style={{ margin: '0 0.5rem' }}>&gt;</span> <span style={{ color: '#0f172a', fontWeight: 'bold' }}>Student Profile</span>
            </h2>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                
                {/* Left Sidebar Profile Card */}
                <div style={{ width: '320px', backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem 2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center', flexShrink: 0 }}>
                    
                    <div style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#fed7aa', margin: '0 auto 1.5rem auto', overflow: 'hidden', border: '4px solid #f8fafc', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Tharindu&backgroundColor=fed7aa&top=shortHair&hairColor=black" alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: '0 0 0.5rem 0' }}>{profileData.name}</h3>
                    
                    <div style={{ display: 'inline-block', backgroundColor: '#ccfbf1', color: '#0d9488', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                        {profileData.course}
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '1.5rem 0', marginBottom: '1.5rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ color: '#94a3b8', marginTop: '0.125rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student ID</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{user?.admissionNumber || 'STU-2024-0892'}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ color: '#94a3b8', marginTop: '0.125rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' }}>{profileData.email}</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                            <div style={{ color: '#94a3b8', marginTop: '0.125rem' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone Number</p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#0f172a', fontWeight: 600 }}>{profileData.phone}</p>
                            </div>
                        </div>
                    </div>

                    <button onClick={() => setShowEditProfile(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#06b6d4', color: 'white', border: 'none', padding: '0.875rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0891b2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#06b6d4'}>
                        <Edit2 size={16} /> Edit Profile
                    </button>
                </div>

                {/* Right Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Metrics Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                        
                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#06b6d4' }}><Book size={24} /></div>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Currently Borrowed</p>
                            <p style={{ margin: '0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>3 Books</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                +1 this month
                            </p>
                        </div>

                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: '#06b6d4' }}><BookOpen size={24} /></div>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Total Books Read</p>
                            <p style={{ margin: '0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>42 Books</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                +5 this semester
                            </p>
                        </div>

                        <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: finesPaid ? '#10b981' : '#ef4444' }}><Wallet size={24} /></div>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#64748b' }}>Outstanding Fines</p>
                            <p style={{ margin: '0.5rem 0', fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>${finesPaid ? '0.00' : '15.00'}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 600, color: finesPaid ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                {finesPaid ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                ) : (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                )}
                                {finesPaid ? 'All paid' : '2 unpaid items'}
                            </p>
                        </div>

                    </div>
                    
                    {/* History Area */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0 2rem' }}>
                            {['Lending History', 'Fines & Payments'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '1.5rem 1rem',
                                        backgroundColor: 'transparent',
                                        border: 'none',
                                        borderBottom: activeTab === tab ? '2px solid #06b6d4' : '2px solid transparent',
                                        color: activeTab === tab ? '#06b6d4' : '#64748b',
                                        fontWeight: 600,
                                        fontSize: '0.875rem',
                                        cursor: 'pointer',
                                        marginBottom: '-1px'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        {activeTab === 'Lending History' && (
                            <div>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Book Title</th>
                                            <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue Date</th>
                                            <th style={{ padding: '1.25rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
                                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Row 1 */}
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>The Clean Coder</p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Robert C. Martin</p>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Oct 12, 2023</td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Oct 26, 2023</td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                <span style={{ display: 'inline-block', backgroundColor: '#dcfce7', color: '#16a34a', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Returned</span>
                                            </td>
                                        </tr>

                                        {/* Row 2 */}
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Algorithms Illuminated</p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Tim Roughgarden</p>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Jan 05, 2024</td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Jan 19, 2024</td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                <span style={{ display: 'inline-block', backgroundColor: '#cffafe', color: '#0891b2', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Borrowed</span>
                                            </td>
                                        </tr>

                                        {/* Row 3 */}
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Pragmatic Programmer</p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Andrew Hunt</p>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Dec 15, 2023</td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Dec 29, 2023</td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                <span style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#dc2626', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Overdue</span>
                                            </td>
                                        </tr>

                                        {/* Row 4 */}
                                        <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>Introduction to AI</p>
                                                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Russell & Norvig</p>
                                            </td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Feb 01, 2024</td>
                                            <td style={{ padding: '1.25rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Feb 15, 2024</td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                                <span style={{ display: 'inline-block', backgroundColor: '#cffafe', color: '#0891b2', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold' }}>Borrowed</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Pagination */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 2rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Showing 1-4 of 42 books</p>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => alert('Pagination is currently disabled in preview mode.')} style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '9999px', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Prev</button>
                                        <button onClick={() => alert('Pagination is currently disabled in preview mode.')} style={{ padding: '0.5rem 1rem', backgroundColor: '#06b6d4', border: 'none', borderRadius: '9999px', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>Next</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab !== 'Lending History' && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                Financial history is currently unavailable.
                            </div>
                        )}
                    </div>

                    {/* Bottom Fine Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem 2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Active Fines</h3>
                            {!finesPaid && (
                                <button disabled={isPaying} onClick={handlePayFines} style={{ backgroundColor: 'transparent', border: 'none', color: '#06b6d4', fontWeight: 600, fontSize: '0.875rem', cursor: isPaying ? 'not-allowed' : 'pointer', opacity: isPaying ? 0.5 : 1 }}>{isPaying ? 'Processing...' : 'Pay All Fines'}</button>
                            )}
                        </div>

                        {finesPaid ? (
                            <div style={{ backgroundColor: '#f0fdf4', borderRadius: '0.5rem', padding: '1.5rem', textAlign: 'center', color: '#16a34a', fontWeight: 500 }}>
                                All fines have been successfully paid. Thank you!
                            </div>
                        ) : (
                            <div style={{ backgroundColor: '#fef2f2', borderRadius: '0.5rem', padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fecaca', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Calendar size={18} />
                                    </div>
                                    <div>
                                        <p style={{ margin: '0 0 0.25rem 0', fontWeight: 'bold', fontSize: '0.875rem', color: '#0f172a' }}>Late Return - The Great Gatsby</p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Overdue by 15 days</p>
                                    </div>
                                </div>
                                <div style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#ef4444' }}>
                                    $10.00
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Edit Profile Modal */}
                    {showEditProfile && (
                        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                            <div style={{ backgroundColor: 'white', borderRadius: '1rem', width: '100%', maxWidth: '400px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                                <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#0f172a' }}>Edit Profile</h2>
                                
                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Full Name</label>
                                    <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Course / Program</label>
                                    <input type="text" value={profileData.course} onChange={(e) => setProfileData({...profileData, course: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>

                                <div style={{ marginBottom: '1rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Email Address</label>
                                    <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>

                                <div style={{ marginBottom: '1.5rem' }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Phone Number</label>
                                    <input type="text" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }} />
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                    <button onClick={() => setShowEditProfile(false)} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                                    <button onClick={() => setShowEditProfile(false)} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#06b6d4', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Save Changes</button>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
