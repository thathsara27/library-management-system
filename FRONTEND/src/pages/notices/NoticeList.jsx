import React, { useEffect, useState } from "react";
import { getNotices, deleteNotice, updateNotice } from "../../services/noticeService.js";
import { Link } from "react-router-dom";
import { Search, Megaphone, Rocket, RefreshCw, Calendar, Archive, Edit2, Pin, Trash2, PlusCircle } from 'lucide-react';

export default function NoticeList() {
    const [notices, setNotices] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadNotices();
    }, []);

    const loadNotices = async () => {
        try {
            const res = await getNotices();
            setNotices(res.data);
        } catch (error) {
            console.error("Failed to load notices:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to archive/delete this notice?")) {
            await deleteNotice(id);
            loadNotices();
        }
    };

    const handlePinToggle = async (notice) => {
        try {
            await updateNotice(notice._id, { ...notice, isPinned: !notice.isPinned });
            loadNotices();
        } catch (error) {
            console.error("Error updating pin status", error);
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "New Arrival": return <Rocket size={20} color="#6366f1" />;
            case "Maintenance": return <RefreshCw size={20} color="#10b981" />;
            case "Event": return <Calendar size={20} color="#3b82f6" />;
            case "Archived": return <Archive size={20} color="#6b7280" />;
            case "News":
            default: return <Megaphone size={20} color="#f59e0b" />;
        }
    };

    const getCategoryColor = (category) => {
        switch (category) {
            case "New Arrival": return { bg: "#e0e7ff", text: "#4f46e5" };
            case "Maintenance": return { bg: "#d1fae5", text: "#059669" };
            case "Event": return { bg: "#dbeafe", text: "#2563eb" };
            case "Archived": return { bg: "#f3f4f6", text: "#4b5563" };
            case "News":
            default: return { bg: "#fef3c7", text: "#d97706" };
        }
    };

    const filteredNotices = notices.filter(a => 
        a.title.toLowerCase().includes(search.toLowerCase()) || 
        a.content.toLowerCase().includes(search.toLowerCase())
    );

    // Sort pinned to top
    const sortedNotices = [...filteredNotices].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Library Notices</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Manage and publish updates for staff and students.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search notices..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%', padding: '0.75rem 1rem 0.75rem 3rem',
                                borderRadius: '99px', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: '#f9fafb'
                            }}
                        />
                    </div>
                    
                    <Link to="/notices/add" style={{
                        backgroundColor: '#14b8a6', // Teal from the design
                        color: 'white', padding: '0.75rem 1.5rem', borderRadius: '99px',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none'
                    }}>
                        <PlusCircle size={20} /> Add New Notice
                    </Link>
                </div>
            </div>

            {/* Grid Layout */}
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                gap: '1.5rem' 
            }}>
                {sortedNotices.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: '#6b7280', backgroundColor: 'white', borderRadius: '1rem' }}>
                        No notices found. Try adjusting your search.
                    </div>
                )}
                {sortedNotices.map((notice) => {
                    const colors = getCategoryColor(notice.category);
                    const formattedDate = new Date(notice.publishDate).toLocaleDateString(undefined, { month: 'short', day: '2-digit', year: 'numeric' });
                    
                    return (
                        <div key={notice._id} style={{ 
                            backgroundColor: 'white', borderRadius: '1.5rem', padding: '1.5rem',
                            boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '1rem',
                            borderTop: notice.isPinned ? `4px solid ${colors.text}` : '4px solid transparent',
                            transition: 'transform 0.2s', cursor: 'default'
                        }} className="hover-lift">
                            
                            {/* Card Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ 
                                    width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#f9fafb',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    {getCategoryIcon(notice.category)}
                                </div>
                                <span style={{
                                    backgroundColor: colors.bg, color: colors.text, padding: '0.25rem 0.75rem',
                                    borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600
                                }}>
                                    {notice.category}
                                </span>
                            </div>

                            {/* Card Body */}
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827', lineHeight: 1.3 }}>
                                    {notice.isPinned && <Pin size={16} style={{ display: 'inline', marginRight: '6px', color: colors.text }} />}
                                    {notice.title}
                                </h3>
                                <p style={{ color: '#6b7280', fontSize: '0.875rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {notice.content}
                                </p>
                            </div>

                            {/* Card Meta & Footer */}
                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em' }}>Posted</p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{formattedDate}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#9ca3af', fontWeight: 600, letterSpacing: '0.05em' }}>Author</p>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>{notice.author}</p>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                                    <Link to={`/notices/edit/${notice._id}`} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'transparent', border: 'none', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', borderRadius: '8px', textDecoration: 'none' }} className="btn-hover-gray">
                                        <Edit2 size={16} /> Edit
                                    </Link>
                                    <button onClick={() => handlePinToggle(notice)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: notice.isPinned ? '#f3f4f6' : 'transparent', border: 'none', color: notice.isPinned ? '#111827' : '#6b7280', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', borderRadius: '8px' }} className="btn-hover-gray">
                                        <Pin size={16} /> {notice.isPinned ? 'Unpin' : 'Pin'}
                                    </button>
                                    <button onClick={() => handleDelete(notice._id)} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.5rem', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', borderRadius: '8px' }} className="btn-hover-red">
                                        <Archive size={16} /> Archive
                                    </button>
                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>

            <style>{`
                .hover-lift:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }
                .btn-hover-gray:hover { background-color: #f3f4f6 !important; color: #111827 !important; }
                .btn-hover-red:hover { background-color: #fef2f2 !important; color: #dc2626 !important; }
            `}</style>
        </div>
    );
}
