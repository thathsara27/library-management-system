import React, { useState, useContext } from "react";
import { Clock, DollarSign, Save, RotateCcw, Shield, CheckCircle } from 'lucide-react';
import { AuthContext } from "../../context/AuthContext.jsx";
import { changePassword } from "../../services/authService.js";

export default function Settings() {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('Loan Rules');
    const [settings, setSettings] = useState({
        maxBooks: 5,
        loanPeriod: 14,
        gracePeriod: 2,
        dailyFine: 0.50,
        currency: 'LKR',
        maxFine: 25.00,
        autoBlocking: false,
        libraryName: 'LibManage Pro Central',
        email: 'admin@libmanage.com',
        phone: '+94 11 234 5678',
        lostFee: 1500.00,
        damageFee: 500.00,
        emailCheckout: true,
        emailReturn: true,
        smsOverdue: false
    });

    const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwdStatus, setPwdStatus] = useState({ loading: false, error: null, success: null });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        if (activeTab === 'Account') {
            handlePasswordChange();
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            alert("Settings successfully saved and applied to globally active loans!");
        }, 800);
    };

    const handlePasswordChange = async () => {
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setPwdStatus({ error: "New passwords do not match.", success: null });
            return;
        }
        setPwdStatus({ loading: true, error: null, success: null });
        try {
            await changePassword(user.email, pwdData.currentPassword, pwdData.newPassword);
            setPwdStatus({ loading: false, error: null, success: "Password successfully updated!" });
            setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwdStatus({ loading: false, error: err.response?.data?.error || "Failed to update password", success: null });
        }
    };

    const tabs = ['General', 'Fine Rates', 'Notifications', 'Loan Rules', 'Account'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '5rem' }}>
            
            {/* Top Navigation / Header */}
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
                    {tabs.map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{ 
                                background: 'transparent', border: 'none', cursor: 'pointer', 
                                fontSize: '0.875rem', fontWeight: 600,
                                color: activeTab === tab ? '#14b8a6' : '#64748b',
                                borderBottom: activeTab === tab ? '2px solid #14b8a6' : '2px solid transparent',
                                paddingBottom: '0.5rem', marginBottom: '-1.5rem',
                                outline: 'none'
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div style={{ marginTop: '2.5rem' }}>
                    <p style={{ fontSize: '0.8125rem', color: '#14b8a6', fontWeight: 600, marginBottom: '0.75rem' }}>
                        Circulation <span style={{ color: '#9ca3af', margin: '0 0.25rem' }}>&gt;</span> <span style={{ color: '#0f172a' }}>Loan Rules & Fines</span>
                    </p>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>Loan Rules and Fines</h2>
                    <p style={{ color: '#64748b', marginTop: '0.5rem', maxWidth: '600px', lineHeight: 1.5 }}>Adjust the standard circulation policies for your library members. These settings apply globally unless overridden by specific item categories.</p>
                </div>
            </div>

            {/* Split Settings Layout */}
            {activeTab === 'Loan Rules' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* Left Card: Circulation Limits */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={20} color="#14b8a6" /> Circulation Limits
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Maximum Books per Student</label>
                            <input 
                                type="number" name="maxBooks" value={settings.maxBooks} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Standard student limit. Faculty can be configured separately.</p>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Standard Loan Period</label>
                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#14b8a6', backgroundColor: '#f0fdfa', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>{settings.loanPeriod} Days</span>
                            </div>
                            <input 
                                type="range" name="loanPeriod" min="1" max="90" value={settings.loanPeriod} onChange={handleChange}
                                style={{ width: '100%', accentColor: '#14b8a6' }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 500 }}>
                                <span>1 DAY</span>
                                <span>90 DAYS</span>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Grace Period (Days)</label>
                            <input 
                                type="number" name="gracePeriod" value={settings.gracePeriod} onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Days before fine accumulation begins after due date.</p>
                        </div>

                    </div>
                </div>

                {/* Right Card */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Fine Configuration Card */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <DollarSign size={20} color="#14b8a6" /> Fine Configuration
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            
                            <div style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Daily Fine Amount</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>Rs.</span>
                                        <input 
                                            type="number" step="0.01" name="dailyFine" value={settings.dailyFine} onChange={handleChange}
                                            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Currency Selection</label>
                                    <select 
                                        name="currency" value={settings.currency} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.875rem', outline: 'none', appearance: 'none' }}
                                    >
                                        <option value="LKR">LKR - Sri Lankan Rupee</option>
                                        <option value="USD">USD - US Dollar</option>
                                        <option value="EUR">EUR - Euro</option>
                                        <option value="GBP">GBP - British Pound</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Maximum Fine Cap</label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>Rs.</span>
                                    <input 
                                        type="number" step="0.01" name="maxFine" value={settings.maxFine} onChange={handleChange}
                                        style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                                    />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>The total accumulated fine will not exceed this value per book.</p>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Automatic Fine Blocking</p>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Prevent borrowing when fines exceed Rs.25.00</p>
                                </div>
                                <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                    <input type="checkbox" name="autoBlocking" checked={settings.autoBlocking} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                    <span style={{ 
                                        position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                                        backgroundColor: settings.autoBlocking ? '#14b8a6' : '#e2e8f0', 
                                        transition: '.4s', borderRadius: '34px' 
                                    }}>
                                        <span style={{ 
                                            position: 'absolute', height: '18px', width: '18px', left: settings.autoBlocking ? '22px' : '3px', bottom: '3px', 
                                            backgroundColor: 'white', transition: '.4s', borderRadius: '50%' 
                                        }}></span>
                                    </span>
                                </label>
                            </div>

                        </div>
                    </div>

                    {/* Pro Tip Card */}
                    <div style={{ backgroundColor: '#0f172a', borderRadius: '1rem', padding: '1.5rem', color: 'white', position: 'relative', overflow: 'hidden' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#14b8a6', marginBottom: '0.75rem' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid #14b8a6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{width: '6px', height: '6px', backgroundColor: '#14b8a6', borderRadius: '50%'}}></span></div>
                            Pro-Tip
                        </h4>
                        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#cbd5e1', zIndex: 10, position: 'relative' }}>
                            Consider setting a longer grace period during holiday seasons to improve member satisfaction ratings.
                        </p>
                        {/* Decorative circle */}
                        <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', width: '100px', height: '100px', borderRadius: '50%', border: '15px solid rgba(255,255,255,0.05)', zIndex: 1 }}></div>
                    </div>
                </div>

            </div>
            ) : activeTab === 'Account' ? (
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Shield size={20} color="#14b8a6" /> Change Admin Password
                    </h3>

                    {pwdStatus.error && <p style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{pwdStatus.error}</p>}
                    {pwdStatus.success && <p style={{ color: '#10b981', backgroundColor: '#f0fdf4', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={16}/> {pwdStatus.success}</p>}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Current Password</label>
                            <input 
                                type="password" 
                                value={pwdData.currentPassword} 
                                onChange={(e) => setPwdData({...pwdData, currentPassword: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                                placeholder="Enter current password"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>New Password</label>
                            <input 
                                type="password" 
                                value={pwdData.newPassword} 
                                onChange={(e) => setPwdData({...pwdData, newPassword: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                                placeholder="Enter new password"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Confirm New Password</label>
                            <input 
                                type="password" 
                                value={pwdData.confirmPassword} 
                                onChange={(e) => setPwdData({...pwdData, confirmPassword: e.target.value})}
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                                placeholder="Confirm new password"
                            />
                        </div>
                    </div>
                </div>
            ) : activeTab === 'General' ? (
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Library Identity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Official Library Name</label>
                            <input type="text" name="libraryName" value={settings.libraryName} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Support Email Address</label>
                            <input type="email" name="email" value={settings.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Contact Phone Number</label>
                            <input type="text" name="phone" value={settings.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
                        </div>
                    </div>
                </div>
            ) : activeTab === 'Fine Rates' ? (
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Special Penalty Rates
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Lost Item Base Fee</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>Rs.</span>
                                <input type="number" name="lostFee" value={settings.lostFee} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Physical Damage Processing Fee</label>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>Rs.</span>
                                <input type="number" name="damageFee" value={settings.damageFee} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '1rem', outline: 'none' }} />
                            </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#64748b' }}>Note: The standard daily overdue fine is managed directly within the "Loan Rules" tab.</p>
                    </div>
                </div>
            ) : activeTab === 'Notifications' ? (
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        Automated Alerts
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Email on Checkout</p>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Send an instant digital receipt when issuing books.</p>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                <input type="checkbox" name="emailCheckout" checked={settings.emailCheckout} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.emailCheckout ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                    <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.emailCheckout ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                </span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Email on Return</p>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Send a confirmation when items are securely returned.</p>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                <input type="checkbox" name="emailReturn" checked={settings.emailReturn} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.emailReturn ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                    <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.emailReturn ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                </span>
                            </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>SMS Overdue Alerts</p>
                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Send aggressive SMS text warnings for overdue items.</p>
                            </div>
                            <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                <input type="checkbox" name="smsOverdue" checked={settings.smsOverdue} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.smsOverdue ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                    <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.smsOverdue ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                </span>
                            </label>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '4rem', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', color: '#64748b' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>{activeTab} Settings</h3>
                    <p>This configuration module is under construction.</p>
                </div>
            )}

            {/* Bottom Fixed Action Bar */}
            <div style={{ position: 'fixed', bottom: 0, left: '250px', right: 0, backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '1.25rem 2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 100 }}>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Last saved today at 10:42 AM</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                        <RotateCcw size={18} /> Reset to Default
                    </button>
                    <button onClick={handleSave} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.75rem', backgroundColor: '#14b8a6', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 'bold', fontSize: '0.875rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.3)' }}>
                        <Save size={18} /> {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>

        </div>
    );
}
