import React, { useState, useContext, useEffect } from "react";
import { 
    Clock, DollarSign, Save, Shield, CheckCircle, Search, Bell, 
    Store, Puzzle, ChevronLeft, Lock, Key, ShieldCheck, 
    AlertCircle, FileText, Smartphone
} from 'lucide-react';
import { AuthContext } from "../../context/AuthContext.jsx";
import { changePassword } from "../../services/authService.js";
import { useLocation } from 'react-router-dom';
import { getSettings, updateSettings } from "../../services/settingService.js";
import { getAuditLogs, createAuditLog } from "../../services/auditLogService.js";

export default function Settings() {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    // View state: 'dashboard', 'security', 'general', 'loan', 'fines', 'audit-logs'
    const [activeView, setActiveView] = useState('dashboard');
    const [auditLogs, setAuditLogs] = useState([]);
    const [visibleLogsCount, setVisibleLogsCount] = useState(4);
    const [auditPage, setAuditPage] = useState(1);
    const logsPerPage = 10;

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} mins ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    };
    
    const [settings, setSettings] = useState({
        maxBooks: 5,
        loanPeriod: 14,
        gracePeriod: 2,
        dailyFine: 0.50,
        currency: 'LKR',
        maxFine: 25.00,
        autoBlocking: false,
        libraryName: 'BookFlow Central',
        email: 'admin@bookflow.com',
        phone: '+94 11 234 5678',
        lostFee: 1500.00,
        damageFee: 500.00,
        emailCheckout: true,
        emailReturn: true,
        smsOverdue: false,
        passwordMinLength: 8,
        passwordExpiry: 'Every 90 days',
        ipWhitelist: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getSettings();
                if (res.data) {
                    setSettings(res.data);
                }
                const logRes = await getAuditLogs();
                if (logRes.data) {
                    setAuditLogs(logRes.data);
                }
            } catch (err) {
                console.error("Failed to load data:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Security Form State
    const [pwdData, setPwdData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwdStatus, setPwdStatus] = useState({ loading: false, error: null, success: null });
    
    // UI State for Security form toggles
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [bruteForceEnabled, setBruteForceEnabled] = useState(true);
    const [passwordRequirements, setPasswordRequirements] = useState({
        special: true, uppercase: true, number: true
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [ipInput, setIpInput] = useState('');

    const handleAddIp = () => {
        if (ipInput.trim()) {
            const currentIps = settings.ipWhitelist ? settings.ipWhitelist.split(',').map(s=>s.trim()).filter(Boolean) : [];
            if (!currentIps.includes(ipInput.trim())) {
                setSettings({...settings, ipWhitelist: [...currentIps, ipInput.trim()].join(', ')});
            }
            setIpInput('');
        }
    };

    const handleRemoveIp = (ip) => {
        const currentIps = settings.ipWhitelist.split(',').map(s=>s.trim()).filter(Boolean);
        setSettings({...settings, ipWhitelist: currentIps.filter(i => i !== ip).join(', ')});
    };

    const getCurrencySymbol = (curr) => {
        if (curr === 'LKR') return 'Rs. ';
        if (curr === 'EUR') return '€';
        if (curr === 'GBP') return '£';
        return '$';
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateSettings(settings);
            
            // Add a real database log to prove the connection!
            await createAuditLog({
                user: "Admin",
                role: "System Admin",
                action: "Updated system settings configuration",
                category: "System",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            });
            
            // Refresh the logs table
            const logRes = await getAuditLogs();
            if (logRes.data) {
                setAuditLogs(logRes.data);
            }

            alert("Settings successfully saved and applied!");
            setActiveView('dashboard');
        } catch (err) {
            console.error("Failed to save settings:", err);
            alert("Error saving settings.");
        } finally {
            setIsSaving(false);
        }
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


    if (isLoading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading settings...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '3rem', backgroundColor: '#f8fafc', minHeight: '100vh', margin: '-1.5rem', padding: '2rem' }}>
            
            {activeView === 'dashboard' ? (
                <>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Global Settings Hub</h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage core configuration and system preferences.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
                                <input 
                                    type="text" 
                                    placeholder="Search settings..." 
                                    style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', width: '250px', fontSize: '0.875rem' }}
                                />
                            </div>
                            <button style={{ padding: '0.5rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}>
                                <Bell size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                        
                        {/* General Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
                                    <Store size={20} />
                                </div>
                                <button onClick={() => setActiveView('general')} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7', backgroundColor: '#e0f2fe', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '99px', cursor: 'pointer' }}>Edit</button>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>General</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem 0' }}>Site identity & branding</p>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#f1f5f9', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                                    <FileText size={16} />
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Site Name</p>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>{settings.libraryName}</p>
                                </div>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.65rem', color: '#64748b', margin: 0 }}>Timezone</p>
                                <p style={{ fontSize: '0.875rem', color: '#0f172a', margin: 0 }}>UTC-05:00 (EST)</p>
                            </div>
                        </div>

                        {/* Loan Policies Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', backgroundColor: '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0d9488' }}>
                                    <Clock size={20} />
                                </div>
                                <button onClick={() => setActiveView('loan')} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0d9488', backgroundColor: '#ccfbf1', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '99px', cursor: 'pointer' }}>Configure</button>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Loan Policies</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem 0' }}>Duration & Renewal Rules</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#64748b' }}>Standard Loan</span>
                                    <span style={{ fontWeight: 600, color: '#0f172a', backgroundColor: '#f8fafc', padding: '0.125rem 0.5rem', borderRadius: '0.25rem' }}>{settings.loanPeriod} Days</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#64748b' }}>Student Loan</span>
                                    <span style={{ fontWeight: 600, color: '#0f172a', backgroundColor: '#f8fafc', padding: '0.125rem 0.5rem', borderRadius: '0.25rem' }}>21 Days</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#64748b' }}>Max Renewals</span>
                                    <span style={{ fontWeight: 600, color: '#0d9488' }}>2x</span>
                                </div>
                            </div>
                        </div>

                        {/* Fine Rates Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                                    <DollarSign size={20} />
                                </div>
                                <button onClick={() => setActiveView('fines')} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', backgroundColor: '#dcfce7', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '99px', cursor: 'pointer' }}>Update</button>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Fine Rates</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem 0' }}>Overdue & Lost charges</p>
                            
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.65rem', color: '#64748b', margin: '0 0 0.25rem 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Overdue</p>
                                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>{getCurrencySymbol(settings.currency)}{settings.dailyFine.toFixed(2)} <span style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#64748b' }}>/ day</span></p>
                            </div>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                <span style={{ color: '#64748b' }}>Cap per item</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{getCurrencySymbol(settings.currency)}{settings.maxFine.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Security Card (Replacing Integrations/Custom) */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '0.5rem', backgroundColor: '#f3e8ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9333ea' }}>
                                    <Lock size={20} />
                                </div>
                                <button onClick={() => setActiveView('security')} style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9333ea', backgroundColor: '#f3e8ff', border: 'none', padding: '0.25rem 0.75rem', borderRadius: '99px', cursor: 'pointer' }}>Manage</button>
                            </div>
                            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Security</h3>
                            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0 0 1rem 0' }}>Access & Auth</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#64748b' }}>2FA Auth</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: twoFactorEnabled ? '#16a34a' : '#94a3b8', backgroundColor: twoFactorEnabled ? '#dcfce7' : '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{twoFactorEnabled ? 'Active' : 'Disabled'}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#64748b' }}>Password Policy</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#16a34a', backgroundColor: '#dcfce7', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>Strict</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                    <span style={{ color: '#64748b' }}>Brute-force Prot.</span>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: bruteForceEnabled ? '#16a34a' : '#94a3b8', backgroundColor: bruteForceEnabled ? '#dcfce7' : '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>{bruteForceEnabled ? 'Active' : 'Disabled'}</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Audit Log Table */}
                    <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', marginTop: '2rem', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0' }}>
                            <div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Audit Log</h3>
                                <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>Recent configuration changes and system events.</p>
                            </div>
                            <button onClick={() => { setActiveView('audit-logs'); window.scrollTo(0, 0); }} style={{ color: '#0d9488', fontSize: '0.875rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>View All Logs →</button>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>User</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.slice(0, visibleLogsCount).map(log => (
                                    <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img src={log.avatar} alt={log.user} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{log.user}</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{log.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#334155' }}>
                                            {log.action}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ 
                                                fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '99px',
                                                backgroundColor: log.category === 'Fines' ? '#fee2e2' : log.category === 'Integrations' ? '#e0e7ff' : log.category === 'Policies' ? '#f3e8ff' : '#dcfce7',
                                                color: log.category === 'Fines' ? '#ef4444' : log.category === 'Integrations' ? '#4f46e5' : log.category === 'Policies' ? '#9333ea' : '#16a34a'
                                            }}>
                                                {log.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#64748b', textAlign: 'right' }}>
                                            {formatTimeAgo(log.time)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {visibleLogsCount < auditLogs.length && (
                            <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: '#f8fafc' }}>
                                <button onClick={() => setVisibleLogsCount(prev => prev + 4)} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>Load More Activity</button>
                            </div>
                        )}
                    </div>

                </>
            ) : activeView === 'security' ? (
                <>
                    {/* Security View Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <button onClick={() => setActiveView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}>
                                <ChevronLeft size={16} /> Back to Hub
                            </button>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Security & Access Control</h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage your organization's security protocols and active sessions.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button onClick={() => { setActiveView('dashboard'); setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100); }} style={{ padding: '0.65rem 1rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', color: '#0f172a', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                                View Audit Log
                            </button>
                            <button onClick={handleSave} disabled={isSaving} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#06b6d4', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
                                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', maxWidth: '1200px' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* 2FA Card */}
                            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ width: '40px', height: '40px', backgroundColor: '#ecfeff', color: '#06b6d4', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Smartphone size={20} />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Two-Factor Authentication (2FA)</h3>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Add an extra layer of security to your account by requiring a code from your phone.</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#64748b' }}>{twoFactorEnabled ? 'Enabled' : 'Disabled'}</span>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                            <input type="checkbox" checked={twoFactorEnabled} onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} style={{ opacity: 0, width: 0, height: 0 }} />
                                            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: twoFactorEnabled ? '#06b6d4' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                                <span style={{ position: 'absolute', height: '18px', width: '18px', left: twoFactorEnabled ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>Once enabled, you will need to use an authenticator app like Google Authenticator or Authy.</p>
                                    <button onClick={() => setShowAuthModal(true)} disabled={!twoFactorEnabled} style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', border: 'none', color: twoFactorEnabled ? '#06b6d4' : '#cbd5e1', fontWeight: 600, fontSize: '0.875rem', cursor: twoFactorEnabled ? 'pointer' : 'not-allowed' }}>
                                        Setup Authenticator App
                                    </button>
                                </div>
                            </div>

                            {/* Login Security Card */}
                            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#e0f2fe', color: '#0284c7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ShieldCheck size={16} />
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Login Security</h3>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Brute-force Protection</p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Automatically lock accounts after 5 failed login attempts within 10 minutes.</p>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                        <input type="checkbox" checked={bruteForceEnabled} onChange={() => setBruteForceEnabled(!bruteForceEnabled)} style={{ opacity: 0, width: 0, height: 0 }} />
                                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: bruteForceEnabled ? '#3b82f6' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                            <span style={{ position: 'absolute', height: '18px', width: '18px', left: bruteForceEnabled ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {bruteForceEnabled && <CheckCircle size={12} color="#3b82f6" />}
                                            </span>
                                        </span>
                                    </label>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>IP Whitelist</label>
                                        <button onClick={handleAddIp} style={{ background: 'none', border: 'none', color: '#10b981', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>+ Add IP Range</button>
                                    </div>
                                    <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}>🌐</span>
                                        <input type="text" value={ipInput} onChange={(e) => setIpInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddIp()} placeholder="e.g., 192.168.1.0/24" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                    </div>
                                    {settings.ipWhitelist && settings.ipWhitelist.split(',').filter(Boolean).length > 0 && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                                            {settings.ipWhitelist.split(',').filter(Boolean).map(ip => (
                                                <div key={ip.trim()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0.75rem', backgroundColor: '#f1f5f9', borderRadius: '99px', fontSize: '0.75rem', color: '#0f172a' }}>
                                                    {ip.trim()}
                                                    <button onClick={() => handleRemoveIp(ip.trim())} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0, display: 'flex', alignItems: 'center' }}>&times;</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>Only allow administrative access from these IP addresses. Leave empty to allow all.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Password Policy Card */}
                            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#ecfdf5', color: '#10b981', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Key size={16} />
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Password Policy</h3>
                                </div>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Minimum Length</label>
                                            <input type="number" name="passwordMinLength" value={settings.passwordMinLength} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>Recommended: 12 chars.</p>
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Password Expiry</label>
                                            <select name="passwordExpiry" value={settings.passwordExpiry} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', appearance: 'none' }}>
                                                <option value="Every 90 days">Every 90 days</option>
                                                <option value="Every 180 days">Every 180 days</option>
                                                <option value="Never">Never</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>Complexity Requirements</label>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                                                <div style={{ width: '20px', height: '20px', backgroundColor: passwordRequirements.special ? '#06b6d4' : 'transparent', border: passwordRequirements.special ? 'none' : '1px solid #cbd5e1', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {passwordRequirements.special && <CheckCircle size={14} color="white" />}
                                                </div>
                                                <input type="checkbox" checked={passwordRequirements.special} onChange={(e) => setPasswordRequirements({...passwordRequirements, special: e.target.checked})} style={{ display: 'none' }} />
                                                <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>Require special character (!@#$)</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                                                <div style={{ width: '20px', height: '20px', backgroundColor: passwordRequirements.uppercase ? '#06b6d4' : 'transparent', border: passwordRequirements.uppercase ? 'none' : '1px solid #cbd5e1', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {passwordRequirements.uppercase && <CheckCircle size={14} color="white" />}
                                                </div>
                                                <input type="checkbox" checked={passwordRequirements.uppercase} onChange={(e) => setPasswordRequirements({...passwordRequirements, uppercase: e.target.checked})} style={{ display: 'none' }} />
                                                <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>Require uppercase letter</span>
                                            </label>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '0.5rem' }}>
                                                <div style={{ width: '20px', height: '20px', backgroundColor: passwordRequirements.number ? '#06b6d4' : 'transparent', border: passwordRequirements.number ? 'none' : '1px solid #cbd5e1', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {passwordRequirements.number && <CheckCircle size={14} color="white" />}
                                                </div>
                                                <input type="checkbox" checked={passwordRequirements.number} onChange={(e) => setPasswordRequirements({...passwordRequirements, number: e.target.checked})} style={{ display: 'none' }} />
                                                <span style={{ fontSize: '0.875rem', color: '#0f172a' }}>Require number</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Change Admin Password Card */}
                            <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                    <div style={{ width: '32px', height: '32px', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Lock size={16} />
                                    </div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Change Admin Password</h3>
                                </div>
                                
                                {pwdStatus.error && <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{pwdStatus.error}</div>}
                                {pwdStatus.success && <div style={{ padding: '0.75rem', backgroundColor: '#f0fdf4', color: '#16a34a', borderRadius: '0.5rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{pwdStatus.success}</div>}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Current Password</label>
                                        <input type="password" value={pwdData.currentPassword} onChange={e => setPwdData({...pwdData, currentPassword: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>New Password</label>
                                        <input type="password" value={pwdData.newPassword} onChange={e => setPwdData({...pwdData, newPassword: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Confirm New Password</label>
                                        <input type="password" value={pwdData.confirmPassword} onChange={e => setPwdData({...pwdData, confirmPassword: e.target.value})} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                    </div>
                                    <button onClick={handlePasswordChange} disabled={pwdStatus.loading || !pwdData.currentPassword || !pwdData.newPassword || !pwdData.confirmPassword} style={{ padding: '0.75rem 1rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: (pwdStatus.loading || !pwdData.currentPassword || !pwdData.newPassword || !pwdData.confirmPassword) ? 'not-allowed' : 'pointer', opacity: (pwdStatus.loading || !pwdData.currentPassword || !pwdData.newPassword || !pwdData.confirmPassword) ? 0.7 : 1 }}>
                                        {pwdStatus.loading ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            ) : activeView === 'general' ? (
                <>
                    {/* General View Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <button onClick={() => setActiveView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}>
                                <ChevronLeft size={16} /> Back to Hub
                            </button>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>General Settings</h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Configure your primary library identity and automated alerts.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button disabled={isSaving} onClick={handleSave} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#06b6d4', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
                                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
                        {/* Library Identity Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#e0f2fe', color: '#0284c7', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Store size={16} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Library Identity</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Official Library Name</label>
                                    <input type="text" name="libraryName" value={settings.libraryName} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Support Email Address</label>
                                    <input type="email" name="email" value={settings.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Contact Phone Number</label>
                                    <input type="text" name="phone" value={settings.phone} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                </div>
                            </div>
                        </div>

                        {/* Automated Notifications Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#fef9c3', color: '#ca8a04', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bell size={16} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Automated Notifications</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Email on Checkout</p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Send an instant digital receipt when issuing books.</p>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                        <input type="checkbox" name="emailCheckout" checked={settings.emailCheckout} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.emailCheckout ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                            <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.emailCheckout ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                        </span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Email on Return</p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Send a confirmation when items are securely returned.</p>
                                    </div>
                                    <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                        <input type="checkbox" name="emailReturn" checked={settings.emailReturn} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.emailReturn ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                            <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.emailReturn ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                        </span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>SMS Overdue Alerts</p>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Send aggressive SMS text warnings for overdue items.</p>
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
                    </div>
                </>
            ) : activeView === 'loan' ? (
                <>
                    {/* Loan View Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <button onClick={() => setActiveView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}>
                                <ChevronLeft size={16} /> Back to Hub
                            </button>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Loan Policies</h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Adjust standard duration and renewal rules.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button disabled={isSaving} onClick={handleSave} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#06b6d4', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
                                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
                        {/* Circulation Limits Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#ccfbf1', color: '#0d9488', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Clock size={16} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Circulation Limits</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Maximum Books per Student</label>
                                        <input type="number" name="maxBooks" value={settings.maxBooks} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Standard student limit. Faculty can be configured separately.</p>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Grace Period (Days)</label>
                                        <input type="number" name="gracePeriod" value={settings.gracePeriod} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Days before fine accumulation begins after due date.</p>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Standard Loan Period</label>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#0d9488', backgroundColor: '#f0fdfa', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>{settings.loanPeriod} Days</span>
                                    </div>
                                    <input type="range" name="loanPeriod" min="1" max="90" value={settings.loanPeriod} onChange={handleChange} style={{ width: '100%', accentColor: '#0d9488' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 500 }}>
                                        <span>1 DAY</span>
                                        <span>90 DAYS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : activeView === 'fines' ? (
                <>
                    {/* Fines View Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div>
                            <button onClick={() => setActiveView('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: '#64748b', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', marginBottom: '0.5rem', padding: 0 }}>
                                <ChevronLeft size={16} /> Back to Hub
                            </button>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>Fine Rates</h2>
                            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Manage overdue charges and special penalties.</p>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button disabled={isSaving} onClick={handleSave} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#06b6d4', border: 'none', borderRadius: '0.5rem', color: 'white', fontWeight: 600, fontSize: '0.875rem', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1 }}>
                                <Save size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '900px' }}>
                        {/* Daily Fine Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#dcfce7', color: '#16a34a', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <DollarSign size={16} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Daily Fine Configuration</h3>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Daily Fine Amount</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>{getCurrencySymbol(settings.currency)}</span>
                                            <input type="number" step="0.01" name="dailyFine" value={settings.dailyFine} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Currency Selection</label>
                                        <select name="currency" value={settings.currency} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', appearance: 'none' }}>
                                            <option value="LKR">LKR - Sri Lankan Rupee</option>
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ marginBottom: '1.5rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Maximum Fine Cap</label>
                                        <div style={{ position: 'relative' }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>{getCurrencySymbol(settings.currency)}</span>
                                            <input type="number" step="0.01" name="maxFine" value={settings.maxFine} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                        </div>
                                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Total accumulated fine will not exceed this value per book.</p>
                                    </div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Automatic Fine Blocking</p>
                                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>Prevent borrowing when fines exceed cap.</p>
                                        </div>
                                        <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                                            <input type="checkbox" name="autoBlocking" checked={settings.autoBlocking} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                                            <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.autoBlocking ? '#10b981' : '#cbd5e1', transition: '.4s', borderRadius: '24px' }}>
                                                <span style={{ position: 'absolute', height: '18px', width: '18px', left: settings.autoBlocking ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Special Penalties Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', padding: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AlertCircle size={16} />
                                </div>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Special Penalties</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Lost Item Base Fee</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>{getCurrencySymbol(settings.currency)}</span>
                                        <input type="number" step="0.01" name="lostFee" value={settings.lostFee} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Physical Damage Fee</label>
                                    <div style={{ position: 'relative' }}>
                                        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>{getCurrencySymbol(settings.currency)}</span>
                                        <input type="number" step="0.01" name="damageFee" value={settings.damageFee} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}

            {activeView === 'audit-logs' ? (
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                        <button onClick={() => setActiveView('dashboard')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a' }}>Complete Audit Log</h2>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>Full history of system changes and events</p>
                        </div>
                    </div>
                    
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>User</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Category</th>
                                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.slice((auditPage - 1) * logsPerPage, auditPage * logsPerPage).map(log => (
                                    <tr key={log._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <img src={log.avatar} alt={log.user} style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f1f5f9' }} />
                                                <div>
                                                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{log.user}</p>
                                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>{log.role}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#334155' }}>{log.action}</td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <span style={{ 
                                                fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '99px',
                                                backgroundColor: log.category === 'Fines' ? '#fee2e2' : log.category === 'Integrations' ? '#e0e7ff' : log.category === 'Policies' ? '#f3e8ff' : '#dcfce7',
                                                color: log.category === 'Fines' ? '#ef4444' : log.category === 'Integrations' ? '#4f46e5' : log.category === 'Policies' ? '#9333ea' : '#16a34a'
                                            }}>{log.category}</span>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#64748b', textAlign: 'right' }}>{formatTimeAgo(log.time)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
                            Showing <strong style={{color: '#0f172a'}}>{auditLogs.length > 0 ? (auditPage - 1) * logsPerPage + 1 : 0}</strong> to <strong style={{color: '#0f172a'}}>{Math.min(auditPage * logsPerPage, auditLogs.length)}</strong> of <strong style={{color: '#0f172a'}}>{auditLogs.length}</strong> logs
                        </p>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button onClick={() => setAuditPage(prev => Math.max(prev - 1, 1))} disabled={auditPage === 1} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: auditPage === 1 ? '#d1d5db' : '#64748b', backgroundColor: 'transparent', border: 'none', cursor: auditPage === 1 ? 'not-allowed' : 'pointer' }}>Previous</button>
                            
                            {Array.from({ length: Math.ceil(auditLogs.length / logsPerPage) }, (_, i) => i + 1).map(page => (
                                <button key={page} onClick={() => setAuditPage(page)} style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: auditPage === page ? '#0d9488' : 'transparent', color: auditPage === page ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>{page}</button>
                            ))}

                            <button onClick={() => setAuditPage(prev => Math.min(prev + 1, Math.ceil(auditLogs.length / logsPerPage)))} disabled={auditPage === Math.ceil(auditLogs.length / logsPerPage) || auditLogs.length === 0} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: (auditPage === Math.ceil(auditLogs.length / logsPerPage) || auditLogs.length === 0) ? '#d1d5db' : '#64748b', backgroundColor: 'transparent', border: 'none', cursor: (auditPage === Math.ceil(auditLogs.length / logsPerPage) || auditLogs.length === 0) ? 'not-allowed' : 'pointer' }}>Next</button>
                        </div>
                    </div>
                </div>
            ) : null}

            {/* Authenticator App Setup Modal */}
            {showAuthModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', maxWidth: '400px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>Setup Authenticator</h3>
                            <button onClick={() => setShowAuthModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>&times;</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', textAlign: 'center', margin: 0 }}>Scan this QR code with your authenticator app (like Google Authenticator or Authy).</p>
                            <div style={{ width: '200px', height: '200px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '0.5rem', border: '1px dashed #cbd5e1' }}>
                                <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>[QR Code Placeholder]</span>
                            </div>
                            <div style={{ width: '100%' }}>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Enter 6-digit code</label>
                                <input type="text" placeholder="000000" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', textAlign: 'center', letterSpacing: '0.5rem', fontSize: '1.25rem' }} />
                            </div>
                            <button onClick={() => { alert('2FA Setup Complete!'); setShowAuthModal(false); }} style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#06b6d4', color: 'white', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                                Verify and Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
