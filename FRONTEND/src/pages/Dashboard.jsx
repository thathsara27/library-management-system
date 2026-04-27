import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummary } from "../services/dashboardService.js";
import { Book, BookOpen, Users, AlertCircle, Calendar, Megaphone, Rocket, RefreshCw, Archive } from 'lucide-react';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        totalBooks: 0,
        issuedBooks: 0,
        newStudents: 0,
        overdueBooks: 0
    });
    const [recentTx, setRecentTx] = useState([]);
    const [recentNotices, setRecentNotices] = useState([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const res = await getDashboardSummary();
                const data = res.data;

                setMetrics(data.metrics);
                setRecentTx(data.recentTx);
                setRecentNotices(data.recentNotices);

            } catch (error) {
                console.error("Error loading dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const deriveTxStatus = (tx) => {
        if (tx.status === "Returned") return "Returned";
        if (new Date(tx.dueDate) < new Date()) return "Overdue";
        return "Issued";
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "New Arrival": return <Rocket size={18} color="#3b82f6" />;
            case "Maintenance": return <RefreshCw size={18} color="#f59e0b" />;
            case "Event": return <Calendar size={18} color="#10b981" />;
            case "Archived": return <Archive size={18} color="#6b7280" />;
            case "News":
            default: return <Megaphone size={18} color="#f59e0b" />;
        }
    };

    if (isLoading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Loading real-time dashboard data...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* KPI Cards Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Book size={20} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>Active</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Total Books</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{metrics.totalBooks.toLocaleString()}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpen size={20} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', backgroundColor: '#eff6ff', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>Active</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Issued Books</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{metrics.issuedBooks.toLocaleString()}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={20} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10b981', backgroundColor: '#ecfdf5', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>Active</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>New Students</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{metrics.newStudents.toLocaleString()}</h3>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#fef2f2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertCircle size={20} />
                        </div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', backgroundColor: '#fef2f2', padding: '0.25rem 0.5rem', borderRadius: '99px' }}>Action Needed</span>
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>Overdue Books</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{metrics.overdueBooks.toString().padStart(2, '0')}</h3>
                    </div>
                </div>

            </div>

            {/* Split Content Area */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                
                {/* Left: Recent Transactions */}
                <div style={{ flex: '1 1 60%', backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>Recent Transactions</h3>
                            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Real-time circulation activity</p>
                        </div>
                        <Link to="/circulation" style={{ color: '#14b8a6', backgroundColor: '#f0fdfa', padding: '0.5rem 1rem', borderRadius: '99px', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                            View Report
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {recentTx.length === 0 && <p style={{ color: '#94a3b8', padding: '2rem', textAlign: 'center' }}>No recent transactions.</p>}
                        
                        {recentTx.map(tx => {
                            const status = deriveTxStatus(tx);
                            const isReturned = status === 'Returned';
                            const isOverdue = status === 'Overdue';
                            
                            return (
                                <div key={tx._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 0', borderBottom: '1px solid #f8fafc' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                        <div style={{ width: '40px', height: '56px', backgroundColor: '#f1f5f9', borderRadius: '4px' }}></div>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{tx.bookTitle}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{tx.bookAuthor || 'Unknown Author'}</p>
                                        </div>
                                        <div style={{ flex: 1, minWidth: '150px' }}>
                                            <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{tx.studentName}</p>
                                            <p style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {tx.studentId}</p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#0f172a', fontWeight: 500, minWidth: '100px' }}>
                                            {new Date(isReturned ? tx.returnDate : tx.issueDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}
                                        </p>
                                        
                                        <span style={{ 
                                            padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, minWidth: '80px', textAlign: 'center',
                                            backgroundColor: isReturned ? '#ecfdf5' : isOverdue ? '#fef2f2' : '#eff6ff',
                                            color: isReturned ? '#10b981' : isOverdue ? '#ef4444' : '#3b82f6'
                                        }}>
                                            {status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Notices / Announcements */}
                <div style={{ flex: '1 1 30%', backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>Internal Notices</h3>
                        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>Important library updates</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {recentNotices.length === 0 && <p style={{ color: '#94a3b8', padding: '1rem', textAlign: 'center' }}>No active notices.</p>}
                        
                        {recentNotices.map(notice => (
                            <div key={notice._id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    {getCategoryIcon(notice.category)}
                                </div>
                                <div>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{notice.title}</h4>
                                    <p style={{ fontSize: '0.8125rem', color: '#64748b', lineHeight: 1.4, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {notice.content}
                                    </p>
                                    <p style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                                        {new Date(notice.publishDate).toLocaleDateString(undefined, {month:'short', day:'2-digit'})} • {notice.author}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
