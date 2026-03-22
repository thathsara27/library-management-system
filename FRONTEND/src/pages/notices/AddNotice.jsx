import React, { useState } from "react";
import { addNotice } from "../../services/noticeService.js";
import { useNavigate } from "react-router-dom";
import { Megaphone, Calendar, RefreshCw, Rocket, Bold, Italic, Underline, List, Link as LinkIcon, Image as ImageIcon, X } from 'lucide-react';

export default function AddNotice() {
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        title: "",
        category: "News",
        content: "",
        targetAudience: "All Users",
        publishDate: today,
        publishTime: "09:00",
        isPinned: false,
        status: "Published",
        author: "Administrator"
    });
    const [isLoading, setIsLoading] = useState(false);

    const categories = [
        { id: "News", icon: Megaphone, color: "#14b8a6" },
        { id: "Event", icon: Calendar, color: "#6b7280" },
        { id: "Maintenance", icon: RefreshCw, color: "#6b7280" },
        { id: "New Arrival", icon: Rocket, color: "#6b7280" }
    ];

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const setCategory = (cat) => {
        setFormData({ ...formData, category: cat });
    };

    const handleSubmit = async (e, isDraft = false) => {
        e.preventDefault();
        setIsLoading(true);
        const dataToSave = { ...formData, status: isDraft ? "Draft" : "Published" };
        try {
            await addNotice(dataToSave);
            navigate("/notices/view");
        } catch (err) {
            console.error(err);
            alert("Error saving notice.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1rem' }}>
            {/* Modal-like Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>
                
                {/* Header */}
                <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Create New Notice</h2>
                        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Draft an update for library patrons and staff</p>
                    </div>
                    <button onClick={() => navigate('/notices/view')} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {/* Left Column - Main Content */}
                    <div style={{ flex: '1 1 600px', padding: '2rem', borderRight: '1px solid #f3f4f6' }}>
                        <form id="noticeForm" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            
                            {/* Title */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Notice Title</label>
                                <input 
                                    name="title" 
                                    placeholder="e.g., Library Summer Hours Update"
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                    style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', outline: 'none', fontSize: '1rem', backgroundColor: '#f9fafb' }}
                                />
                            </div>

                            {/* Category Selector */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Category</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                                    {categories.map((cat) => {
                                        const isSelected = formData.category === cat.id;
                                        return (
                                            <button 
                                                type="button" 
                                                key={cat.id} 
                                                onClick={() => setCategory(cat.id)}
                                                style={{ 
                                                    padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                                                    border: isSelected ? `2px solid ${cat.color}` : '1px solid #e5e7eb',
                                                    borderRadius: '0.75rem', backgroundColor: isSelected ? '#f0fdfa' : 'white', cursor: 'pointer',
                                                    color: isSelected ? cat.color : '#6b7280', transition: 'all 0.2s', fontWeight: isSelected ? 600 : 500
                                                }}
                                            >
                                                <cat.icon size={24} color={isSelected ? cat.color : '#9ca3af'} />
                                                <span style={{ fontSize: '0.875rem' }}>{cat.id}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Editor */}
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Content</label>
                                <div style={{ border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
                                    {/* Toolbar (Visual Only for UI mockup) */}
                                    <div style={{ display: 'flex', gap: '1rem', padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', color: '#6b7280' }}>
                                        <Bold size={18} style={{cursor:'pointer'}} />
                                        <Italic size={18} style={{cursor:'pointer'}} />
                                        <Underline size={18} style={{cursor:'pointer'}} />
                                        <List size={18} style={{cursor:'pointer', marginLeft: '1rem'}} />
                                        <LinkIcon size={18} style={{cursor:'pointer'}} />
                                        <ImageIcon size={18} style={{cursor:'pointer'}} />
                                    </div>
                                    <textarea 
                                        name="content" 
                                        placeholder="Type the notice details here..."
                                        value={formData.content} 
                                        onChange={handleChange} 
                                        required 
                                        style={{ width: '100%', minHeight: '250px', padding: '1rem', border: 'none', outline: 'none', fontSize: '1rem', resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Publishing Settings */}
                    <div style={{ flex: '1 1 300px', padding: '2rem', backgroundColor: '#f8fafc' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: '#0f172a' }}>
                            <RefreshCw size={18} color="#14b8a6" /> Publishing Settings
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Target Audience</label>
                                <select 
                                    name="targetAudience" 
                                    value={formData.targetAudience} 
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white' }}
                                >
                                    <option>All Users</option>
                                    <option>Students Only</option>
                                    <option>Staff Only</option>
                                </select>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>Select who can view this notice on their dashboard.</p>
                            </div>

                            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>Schedule Publish</label>
                                    {/* Toggle Visual */}
                                    <div style={{ width: '36px', height: '20px', backgroundColor: '#14b8a6', borderRadius: '99px', position: 'relative' }}>
                                        <div style={{ width: '16px', height: '16px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px' }}></div>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Date</label>
                                        <input type="date" name="publishDate" value={formData.publishDate} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.25rem' }}>Time</label>
                                        <input type="time" name="publishTime" value={formData.publishTime} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#f0fdfa', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #ccfbf1', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <input type="checkbox" name="isPinned" checked={formData.isPinned} onChange={handleChange} style={{ marginTop: '0.25rem' }} />
                                <div>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f766e', marginBottom: '0.25rem' }}>Pin to Dashboard</p>
                                    <p style={{ fontSize: '0.75rem', color: '#0f766e', opacity: 0.8 }}>Pinned items appear at the very top of the news feed.</p>
                                </div>
                            </div>

                            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '0.5rem', padding: '2rem', textAlign: 'center', cursor: 'pointer', backgroundColor: 'white' }}>
                                <ImageIcon size={24} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
                                <p style={{ fontSize: '0.875rem', color: '#64748b' }}>Upload Cover Image</p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
                    <button onClick={() => navigate('/notices/view')} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', color: '#6b7280', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="button" onClick={(e) => handleSubmit(e, true)} disabled={isLoading} style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #e5e7eb', borderRadius: '99px', color: '#374151', fontWeight: 600, cursor: 'pointer' }}>
                            Save as Draft
                        </button>
                        <button type="button" onClick={(e) => handleSubmit(e, false)} disabled={isLoading} style={{ padding: '0.75rem 2rem', background: '#14b8a6', border: 'none', borderRadius: '99px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {isLoading ? "Publishing..." : "Publish Now"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
