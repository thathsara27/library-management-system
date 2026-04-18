import React, { useEffect, useState, useRef } from "react";
import { getNotices, deleteNotice, updateNotice } from "../../services/noticeService.js";
import { Link } from "react-router-dom";
import { Search, Megaphone, Rocket, RefreshCw, Calendar, Archive, Edit2, Pin, Trash2, PlusCircle, Download } from 'lucide-react';
import html2pdf from "html2pdf.js";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function NoticeList() {
    const [notices, setNotices] = useState([]);
    const [search, setSearch] = useState("");
    const reportRef = useRef(null);

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

    const handleExportPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin:       0.3,
            filename:     'notices_report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const catCounts = {};
    notices.forEach(n => {
        const c = n.category || 'General';
        catCounts[c] = (catCounts[c] || 0) + 1;
    });
    
    const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#6b7280', '#ec4899'];
    
    const catPieData = Object.keys(catCounts).map((cat, i) => ({
        name: cat,
        value: catCounts[cat],
        percent: notices.length > 0 ? Math.round((catCounts[cat] / notices.length) * 100) : 0,
        color: COLORS[i % COLORS.length]
    })).sort((a,b) => b.value - a.value).slice(0, 5);

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const currentYear = new Date().getFullYear();
    const monthlyAdditions = Array(12).fill(0).map((_, i) => ({ name: months[i], Notices: 0 }));

    notices.forEach(n => {
        if (n.publishDate) {
            const date = new Date(n.publishDate);
            if (date.getFullYear() === currentYear) {
                monthlyAdditions[date.getMonth()].Notices += 1;
            }
        }
    });

    const activeNotices = notices.filter(n => n.status !== 'Archived').length;
    const pinnedNotices = notices.filter(n => n.isPinned).length;

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
            
            {/* Hidden Report Template */}
            <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -9999, width: '1100px', backgroundColor: '#f8fafc' }}>
                <div ref={reportRef} style={{ padding: '2rem', backgroundColor: '#f8fafc', color: 'black', fontFamily: 'sans-serif' }}>
                    
                    {/* Header Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #14b8a6', paddingBottom: '1rem', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'bold' }}>Library Management System</h1>
                            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '18px', color: '#475569' }}>Notices & Announcements Report</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>GENERATED ON</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* KPI Dashboard Strip */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #14b8a6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Notices</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{notices.length}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active/Visible</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{activeNotices}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #f59e0b', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pinned (Important)</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{pinnedNotices}</h3>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', height: '280px' }}>
                        
                        {/* Line Chart Config */}
                        <div style={{ flex: 2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Notice Publication Frequency ({currentYear})</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyAdditions} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} dy={10} />
                                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Line isAnimationActive={false} type="monotone" dataKey="Notices" stroke="#14b8a6" strokeWidth={3} dot={{r: 3, fill: '#14b8a6'}} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart Config */}
                        <div style={{ flex: 1.2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#0f172a' }}>Notice Categories</h3>
                            <div style={{ position: 'relative', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie isAnimationActive={false} data={catPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                                            {catPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{notices.length}</p>
                                    <p style={{ margin: 0, fontSize: '9px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Notices</p>
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {catPieData.map(cat => (
                                    <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: 500 }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }}></span>
                                            {cat.name}
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{cat.percent}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Notice History Details</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Title</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map((n, i) => (
                                <tr key={n._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px' }}>{i + 1}</td>
                                    <td style={{ padding: '8px', fontWeight: 600 }}>{n.title}</td>
                                    <td style={{ padding: '8px' }}>{n.category}</td>
                                    <td style={{ padding: '8px' }}>{new Date(n.publishDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '8px' }}>{n.content?.substring(0, 50)}...</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Header & Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Library Notices</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Manage and publish updates for staff and students.
                    </p>
                </div>

                <div data-html2canvas-ignore="true" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
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
                    
                    <button onClick={handleExportPDF} style={{
                        backgroundColor: '#f8fafc',
                        color: '#475569', padding: '0.75rem 1.5rem', borderRadius: '99px',
                        border: '1px solid #e2e8f0',
                        fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
                    }}>
                        <Download size={20} /> Export
                    </button>

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
                                
                                <div data-html2canvas-ignore="true" style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
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
