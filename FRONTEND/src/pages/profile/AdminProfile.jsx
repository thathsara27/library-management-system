import React, { useState, useContext, useRef } from 'react';
import { ShieldCheck, Calendar, AtSign, MapPin, Edit2, User, Briefcase, Mail, Building, PlusCircle, PenTool, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext.jsx';

export default function AdminProfile() {
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('General Info');
    const fileInputRef = useRef(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        fullName: user?.fullName || 'Damyanthi',
        staffId: 'LIB-9921',
        email: user?.email || 'damayanthi@gmail.com',
        department: 'Management'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setAvatarPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0 3rem 0' }}>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Administrator Profile</h2>
            
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                
                {/* Left Sidebar Profile Card */}
                <div style={{ width: '300px', backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden', flexShrink: 0 }}>
                    {/* Top background */}
                    <div style={{ height: '100px', background: 'linear-gradient(180deg, #cffafe 0%, rgba(255,255,255,0) 100%)' }}></div>
                    
                    {/* Avatar */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-50px' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {avatarPreview || user?.avatar ? (
                                <img src={avatarPreview || user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <img src="https://ui-avatars.com/api/?name=Damayanthi&background=random" alt="Damayanthi" style={{ width: '100%', height: '100%' }} />
                            )}
                        </div>
                    </div>

                    <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{user?.fullName || 'Damayanthi'}</h3>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 1rem 0' }}>Head Librarian</p>
                        
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            <ShieldCheck size={14} /> ADMIN
                        </div>
                        
                        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', textAlign: 'left', paddingBottom: '2rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                <Calendar size={18} color="#94a3b8" /> Joined Oct 2021
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                <AtSign size={18} color="#94a3b8" /> {user?.email || 'damayanthi@gmail.com'}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#64748b', fontSize: '0.875rem' }}>
                                <MapPin size={18} color="#94a3b8" /> Main Library HQ
                            </div>
                        </div>
                        
                        <div style={{ marginTop: '1.5rem' }}>
                            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} style={{ display: 'none' }} accept="image/*" />
                            <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#06b6d4', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0891b2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#06b6d4'}>
                                <Edit2 size={16} /> Edit Photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Top Card (Tabs & Form) */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        
                        {/* Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', padding: '0 2rem' }}>
                            {['General Info', 'Security', 'Activity Log'].map(tab => (
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

                        {/* Tab Content */}
                        {activeTab === 'General Info' && (
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Personal Details</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', marginBottom: '2rem' }}>Update your personal information and profile settings.</p>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    
                                    {/* Full Name */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><User size={18} /></span>
                                            <input 
                                                type="text" 
                                                name="fullName"
                                                value={formData.fullName} 
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '0.875rem', color: '#0f172a', outline: 'none' }} 
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Staff ID */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Staff ID</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Briefcase size={18} /></span>
                                            <input 
                                                type="text" 
                                                name="staffId"
                                                value={formData.staffId} 
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '0.875rem', color: '#0f172a', outline: 'none' }} 
                                            />
                                        </div>
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Email Address</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Mail size={18} /></span>
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={formData.email} 
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '0.875rem', color: '#0f172a', outline: 'none' }} 
                                            />
                                        </div>
                                    </div>

                                    {/* Department */}
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Department</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><Building size={18} /></span>
                                            <select 
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '0.5rem', border: '1px solid #f1f5f9', backgroundColor: '#f8fafc', fontSize: '0.875rem', color: '#0f172a', outline: 'none', appearance: 'none' }}
                                            >
                                                <option value="Management">Management</option>
                                                <option value="Circulation">Circulation</option>
                                                <option value="Reference">Reference</option>
                                                <option value="IT Support">IT Support</option>
                                            </select>
                                            <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }}>
                                                <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>

                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
                                    <button onClick={() => setFormData({ fullName: user?.fullName || 'Damyanthi', staffId: 'LIB-9921', email: user?.email || 'damayanthi@gmail.com', department: 'Management' })} style={{ backgroundColor: 'transparent', border: 'none', color: '#64748b', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', padding: '0.75rem 1.5rem' }}>
                                        Cancel
                                    </button>
                                    <button onClick={() => alert('Profile details saved successfully!')} style={{ backgroundColor: '#06b6d4', color: 'white', border: 'none', borderRadius: '9999px', fontWeight: 600, fontSize: '0.875rem', padding: '0.75rem 1.5rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0891b2'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#06b6d4'}>
                                        Save Changes
                                    </button>
                                </div>

                            </div>
                        )}
                        {activeTab !== 'General Info' && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                                This section is currently under development.
                            </div>
                        )}
                    </div>

                    {/* Bottom Card (Recent Actions) */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Recent Administrative Actions</h3>
                            <button onClick={() => alert('Full history is not yet implemented.')} style={{ backgroundColor: 'transparent', border: 'none', color: '#06b6d4', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>View All History</button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                            
                            {/* Action 1 */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ccfbf1', color: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <PlusCircle size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: '#0f172a' }}>Added 5 new books</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Batch update for Science & Technology section</p>
                                </div>
                                <div style={{ flexShrink: 0, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 500 }}>
                                    2 hours ago
                                </div>
                            </div>

                            {/* Action 2 */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <PenTool size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: '#0f172a' }}>Updated fine rates</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Increased late return penalty from $0.50 to $0.75/day</p>
                                </div>
                                <div style={{ flexShrink: 0, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 500 }}>
                                    Yesterday, 4:30 PM
                                </div>
                            </div>

                            {/* Action 3 */}
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1.5rem 0' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#06b6d4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <CheckCircle2 size={20} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', fontWeight: 'bold', color: '#0f172a' }}>Approved 3 library card requests</h4>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>New memberships for local community program</p>
                                </div>
                                <div style={{ flexShrink: 0, backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontWeight: 500 }}>
                                    Oct 24, 2023
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
