import React, { useEffect, useState, useRef } from "react";
import { getTransactions, returnBook, deleteTransaction } from "../../services/circulationService.js";
import { Link } from "react-router-dom";
import { Search, PlusCircle, CheckCircle, AlertCircle, Clock, Trash2, Download } from 'lucide-react';
import html2pdf from "html2pdf.js";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function CirculationTracker() {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All"); // All, Overdue, Returned
    const reportRef = useRef(null);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const res = await getTransactions();
            setTransactions(res.data);
        } catch (error) {
            console.error("Failed to load transactions:", error);
        }
    };

    const handleReturn = async (id, isOverdue) => {
        if (window.confirm("Confirm returning this book to inventory?")) {
            // Very simple mock fine calculation, $0.50 per day late
            let fine = 0;
            if (isOverdue) {
                const tx = transactions.find(t => t._id === id);
                if (tx) {
                    const daysLate = Math.floor((new Date() - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24));
                    fine = daysLate > 0 ? daysLate * 0.50 : 0;
                }
            }
            await returnBook(id, fine);
            loadTransactions();
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely VOID this transaction record?")) {
            await deleteTransaction(id);
            loadTransactions();
        }
    };

    const handleExportPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin:       0.3,
            filename:     'circulation_report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const getInitials = (name) => {
        if (!name) return "ST";
        return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    };

    const deriveStatus = (tx) => {
        if (tx.status === "Returned") return "Returned";
        const totalDays = (new Date(tx.dueDate) - new Date()) / (1000 * 60 * 60 * 24);
        if (totalDays < 0) return "Overdue";
        if (totalDays <= 3) return "Due Soon";
        return "On Time";
    };

    // Calculate Metrics
    const activeTx = transactions.filter(t => t.status === "Borrowed");
    const totalCheckedOut = activeTx.length;
    const overdueCount = activeTx.filter(t => deriveStatus(t) === "Overdue").length;
    const pendingReturns = totalCheckedOut - overdueCount;

    // Filter Logic
    const filteredTransactions = transactions.filter((tx) => {
        const matchesSearch = tx.studentName.toLowerCase().includes(search.toLowerCase()) || 
                              tx.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
                              tx.studentId.toLowerCase().includes(search.toLowerCase());
        
        const status = deriveStatus(tx);
        const matchesFilter = filter === "All" ? true :
                              filter === "Overdue" ? status === "Overdue" :
                              filter === "Returns" ? status === "Returned" : true;

        return matchesSearch && matchesFilter;
    });

    const statusCounts = { 'On Time': 0, 'Due Soon': 0, 'Overdue': 0, 'Returned': 0 };
    transactions.forEach(tx => {
        const s = deriveStatus(tx);
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    
    const statusPieData = Object.keys(statusCounts).map((s) => ({
        name: s,
        value: statusCounts[s],
        percent: transactions.length > 0 ? Math.round((statusCounts[s] / transactions.length) * 100) : 0,
        color: s === "Returned" ? "#64748b" : s === "Overdue" ? "#ef4444" : s === "Due Soon" ? "#f59e0b" : "#10b981"
    })).sort((a,b) => b.value - a.value).slice(0, 5);

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const currentYear = new Date().getFullYear();
    const monthlyTransactions = Array(12).fill(0).map((_, i) => ({ name: months[i], Transactions: 0 }));

    transactions.forEach(tx => {
        if (tx.issueDate) {
            const date = new Date(tx.issueDate);
            if (date.getFullYear() === currentYear) {
                monthlyTransactions[date.getMonth()].Transactions += 1;
            }
        }
    });

    const StatusBadge = ({ status }) => {
        switch(status) {
            case "Overdue":
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}><AlertCircle size={12}/> Overdue</span>;
            case "Due Soon":
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#fffbeb', color: '#f59e0b', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}><Clock size={12}/> Due Soon</span>;
            case "Returned":
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#f3f4f6', color: '#6b7280', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}><CheckCircle size={12}/> Returned</span>;
            case "On Time":
            default:
                return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: '#ecfdf5', color: '#10b981', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}><span style={{width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%'}}></span> On Time</span>;
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hidden Report Template */}
            <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -9999, width: '1100px', backgroundColor: '#f8fafc' }}>
                <div ref={reportRef} style={{ padding: '2rem', backgroundColor: '#f8fafc', color: 'black', fontFamily: 'sans-serif' }}>
                    
                    {/* Header Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #3b82f6', paddingBottom: '1rem', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'bold' }}>Library Management System</h1>
                            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '18px', color: '#475569' }}>Circulation & Lending Report</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>GENERATED ON</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* KPI Dashboard Strip */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Checked Out</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{totalCheckedOut}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #10b981', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pending Returns</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{pendingReturns}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #ef4444', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Overdue Books</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{overdueCount}</h3>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', height: '280px' }}>
                        
                        {/* Line Chart Config */}
                        <div style={{ flex: 2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Monthly Transactions ({currentYear})</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyTransactions} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} dy={10} />
                                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Line isAnimationActive={false} type="monotone" dataKey="Transactions" stroke="#3b82f6" strokeWidth={3} dot={{r: 3, fill: '#3b82f6'}} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart Config */}
                        <div style={{ flex: 1.2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#0f172a' }}>Transaction Status</h3>
                            <div style={{ position: 'relative', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie isAnimationActive={false} data={statusPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                                            {statusPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{transactions.length}</p>
                                    <p style={{ margin: 0, fontSize: '9px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Borrows</p>
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {statusPieData.map(cat => (
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
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Recent Activity Logs</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Student Name</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Book Title</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Issue Date</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Due Date</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx, i) => (
                                <tr key={tx._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px' }}>{i + 1}</td>
                                    <td style={{ padding: '8px', fontWeight: 600 }}>{tx.studentName}</td>
                                    <td style={{ padding: '8px' }}>{tx.bookTitle}</td>
                                    <td style={{ padding: '8px' }}>{new Date(tx.issueDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '8px' }}>{new Date(tx.dueDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '8px' }}>{deriveStatus(tx)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Overview</h2>
                    <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Real-time insight into library circulation and lending metrics.</p>
                </div>
                
                <div data-html2canvas-ignore="true" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                        <input
                            type="text"
                            placeholder="Search by ISBN, title, or student..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem 1rem 0.65rem 2.5rem', borderRadius: '99px', border: '1px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.875rem' }}
                        />
                    </div>
                    <button onClick={handleExportPDF} style={{ backgroundColor: '#f8fafc', color: '#475569', padding: '0.65rem 1.5rem', borderRadius: '99px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: '1px solid #e2e8f0' }}>
                        <Download size={18} /> Export
                    </button>
                    <Link to="/circulation/add" style={{ backgroundColor: '#3b82f6', color: 'white', padding: '0.65rem 1.5rem', borderRadius: '99px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)' }}>
                        <PlusCircle size={18} /> Transaction
                    </Link>
                </div>
            </div>

            {/* Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Pending Returns</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{pendingReturns}</h3>
                        <span style={{ color: '#f59e0b', fontSize: '0.875rem', fontWeight: 700 }}>On track</span>
                    </div>
                    {/* Decorative chart line */}
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #fcd34d 30%, #f59e0b 70%, transparent)' }}></div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total Checked Out</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{totalCheckedOut}</h3>
                        <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 700 }}>Active</span>
                    </div>
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #93c5fd 30%, #3b82f6 70%, transparent)' }}></div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Overdue Books</p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <h3 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{overdueCount}</h3>
                        {overdueCount > 0 && <span style={{ color: '#ef4444', fontSize: '0.875rem', fontWeight: 700 }}>High Priority</span>}
                    </div>
                    <div style={{ position: 'absolute', bottom: '1.5rem', left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, transparent, #fca5a5 30%, #ef4444 70%, transparent)' }}></div>
                </div>
            </div>

            {/* Main Table Interface */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '1.5rem' }}>
                
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    {['All', 'Overdue', 'Returns'].map(f => (
                        <button 
                            key={f}
                            onClick={() => setFilter(f)}
                            style={{ 
                                background: 'transparent', border: 'none', cursor: 'pointer', 
                                fontSize: '0.875rem', fontWeight: 600,
                                color: filter === f ? '#3b82f6' : '#64748b',
                                borderBottom: filter === f ? '2px solid #3b82f6' : '2px solid transparent',
                                paddingBottom: '1rem', marginBottom: '-1rem'
                            }}
                        >
                            {f === 'All' ? 'All Transactions' : f === 'Overdue' ? 'Overdue Only' : 'Returns'}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '1rem 0.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student</th>
                                <th style={{ padding: '1rem 0.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Book Info</th>
                                <th style={{ padding: '1rem 0.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issued</th>
                                <th style={{ padding: '1rem 0.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Due Date</th>
                                <th style={{ padding: '1rem 0.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fine</th>
                                <th style={{ padding: '1rem 0.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th data-html2canvas-ignore="true" style={{ padding: '1rem 0.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions.map((tx) => {
                                const statusName = deriveStatus(tx);
                                
                                // Calculate live fine if overdue
                                let currentFine = 0;
                                if (tx.status === "Returned") {
                                    currentFine = tx.fine || 0;
                                } else if (statusName === "Overdue") {
                                    const daysLate = Math.floor((new Date() - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24));
                                    currentFine = daysLate > 0 ? daysLate * 0.50 : 0;
                                }

                                return (
                                <tr key={tx._id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    
                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                {getInitials(tx.studentName)}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{tx.studentName}</p>
                                                <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ID: {tx.studentId}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <p style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.875rem' }}>{tx.bookTitle}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{tx.bookAuthor}</p>
                                    </td>

                                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                                        {new Date(tx.issueDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}
                                    </td>

                                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: '#64748b' }}>
                                        {new Date(tx.dueDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'})}
                                    </td>

                                    <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', fontWeight: 600, color: currentFine > 0 ? '#ef4444' : '#94a3b8' }}>
                                        {currentFine > 0 ? `Rs. ${currentFine.toFixed(2)}` : "-"}
                                    </td>

                                    <td style={{ padding: '1rem 0.5rem' }}>
                                        <StatusBadge status={statusName} />
                                    </td>

                                    <td data-html2canvas-ignore="true" style={{ padding: '1rem 0.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                                        <Link to={`/circulation/edit/${tx._id}`} style={{ padding: '0.4rem 0.75rem', color: '#6b7280', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none' }}>
                                            Edit
                                        </Link>
                                        {statusName !== "Returned" ? (
                                            <button onClick={() => handleReturn(tx._id, statusName === "Overdue")} style={{ padding: '0.4rem 0.75rem', color: '#3b82f6', backgroundColor: '#eff6ff', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                                Return Book
                                            </button>
                                        ) : (
                                            <button onClick={() => handleDelete(tx._id)} style={{ padding: '0.4rem 0.75rem', color: '#94a3b8', backgroundColor: 'transparent', borderRadius: '6px', border: '1px solid #e2e8f0', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}>
                                                Void Record
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )})}
                            {filteredTransactions.length === 0 && (
                                <tr>
                                    <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                        No loan transactions found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                    <p>Showing <strong>1-{Math.min(filteredTransactions.length, 10)}</strong> of <strong>{filteredTransactions.length}</strong></p>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button style={{ padding: '0.25rem 0.75rem', border: '1px solid #e2e8f0', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>&lt;</button>
                        <button style={{ padding: '0.25rem 0.75rem', border: 'none', backgroundColor: '#3b82f6', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>1</button>
                        <button style={{ padding: '0.25rem 0.75rem', border: '1px solid #e2e8f0', backgroundColor: 'white', borderRadius: '4px', cursor: 'pointer' }}>&gt;</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
