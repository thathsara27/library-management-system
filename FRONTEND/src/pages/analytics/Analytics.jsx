import React, { useState, useEffect, useRef } from "react";
import { getBooks } from "../../services/bookService.js";
import { getStudents } from "../../services/studentService.js";
import { getSuppliers } from "../../services/supplierService.js";
import { getNotices } from "../../services/noticeService.js";
import html2pdf from "html2pdf.js";
import { getTransactions } from "../../services/circulationService.js";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, Legend } from 'recharts';
import { Download, Calendar as CalendarIcon, MoreHorizontal, Book, Users, Truck, MessageSquare, Repeat } from 'lucide-react';

export default function Analytics() {
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [authorData, setAuthorData] = useState([]);
    const [topBooks, setTopBooks] = useState([]);
    const [totalBooksCount, setTotalBooksCount] = useState(0);
    const [totalBorrows, setTotalBorrows] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalSuppliers, setTotalSuppliers] = useState(0);
    const [totalNotices, setTotalNotices] = useState(0);
    const reportRef = useRef(null);

    const COLORS = ['#14b8a6', '#94a3b8', '#e2e8f0', '#f59e0b', '#3b82f6'];

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [booksRes, txRes, stuRes, supRes, notRes] = await Promise.all([
                    getBooks(), 
                    getTransactions(),
                    getStudents(),
                    getSuppliers(),
                    getNotices()
                ]);
                const books = booksRes.data;
                const transactions = txRes.data;
                
                setTotalStudents(stuRes.data.length || 0);
                setTotalSuppliers(supRes.data.length || 0);
                setTotalNotices(notRes.data.length || 0);

                // 1. Calculate Monthly Borrowing Trends
                const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
                const monthCounts = Array(12).fill(0).map((_, i) => ({ name: months[i], borrows: 0 }));
                
                transactions.forEach(tx => {
                    if (tx.issueDate) {
                        const date = new Date(tx.issueDate);
                        monthCounts[date.getMonth()].borrows += 1;
                    }
                });
                setMonthlyData(monthCounts);
                setTotalBorrows(transactions.length);

                // 2. Calculate Category Distribution
                const catCounts = {};
                let totalQty = 0;
                books.forEach(b => {
                    const cat = b.category || 'Uncategorized';
                    const qty = b.quantity || 1;
                    catCounts[cat] = (catCounts[cat] || 0) + qty;
                    totalQty += qty;
                });
                
                const catArray = Object.keys(catCounts).map((key, i) => ({
                    name: key,
                    value: catCounts[key],
                    percent: Math.round((catCounts[key] / totalQty) * 100),
                    color: COLORS[i % COLORS.length]
                })).sort((a, b) => b.value - a.value);

                setCategoryData(catArray.slice(0, 4)); // Show top 4 categories
                setTotalBooksCount(totalQty);

                // 3. Calculate Most Popular Authors (from transactions)
                const authorCounts = {};
                let maxAuthorBorrows = 0;
                transactions.forEach(tx => {
                    const author = tx.bookAuthor || 'Unknown';
                    authorCounts[author] = (authorCounts[author] || 0) + 1;
                    if (authorCounts[author] > maxAuthorBorrows) maxAuthorBorrows = authorCounts[author];
                });

                const authArray = Object.keys(authorCounts).map(key => ({
                    name: key,
                    count: authorCounts[key],
                    percent: maxAuthorBorrows > 0 ? (authorCounts[key] / maxAuthorBorrows) * 100 : 0
                })).sort((a, b) => b.count - a.count);
                
                setAuthorData(authArray.slice(0, 4));

                // 4. Calculate Top Borrowed Books (from transactions)
                const bookCounts = {};
                transactions.forEach(tx => {
                    const title = tx.bookTitle;
                    if (!bookCounts[title]) {
                        bookCounts[title] = { title: tx.bookTitle, author: tx.bookAuthor, borrows: 0 };
                    }
                    bookCounts[title].borrows += 1;
                });

                const topBooksArray = Object.values(bookCounts)
                    .sort((a, b) => b.borrows - a.borrows)
                    .slice(0, 3)
                    .map((b, i) => ({ ...b, statusColor: i === 0 ? '#10b981' : i === 1 ? '#3b82f6' : '#f59e0b' }));

                setTopBooks(topBooksArray);

            } catch (error) {
                console.error("Failed to load analytics data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const generateHeatmap = () => {
        // Synthetic peak hours representation
        return Array.from({ length: 4 }).map(() => 
            Array.from({ length: 7 }).map(() => Math.floor(Math.random() * 10))
        );
    };

    const heatmap = generateHeatmap();

    const handleExportPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin:       0.3,
            filename:     'library_analytics_report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        
        html2pdf().set(opt).from(element).save();
    };

    if (isLoading) {
        return <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>Crunching real-time analytical data...</div>;
    }

    const systemData = [
        { name: 'Books', count: totalBooksCount },
        { name: 'Transactions', count: totalBorrows },
        { name: 'Members', count: totalStudents },
        { name: 'Suppliers', count: totalSuppliers },
        { name: 'Notices', count: totalNotices }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem', backgroundColor: '#f8fafc', minHeight: '100vh', borderRadius: '1rem' }}>
            
            {/* Hidden Report Template */}
            <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -9999, width: '1100px', backgroundColor: '#f8fafc' }}>
                <div ref={reportRef} style={{ padding: '2rem', backgroundColor: '#f8fafc', color: 'black', fontFamily: 'sans-serif' }}>
                    
                    {/* Header Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0f172a', paddingBottom: '1rem', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'bold' }}>Library Management System</h1>
                            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '18px', color: '#475569' }}>System Analytics Report</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>GENERATED ON</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* KPI Dashboard Strip */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #14b8a6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Books</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{totalBooksCount}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Transactions</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{totalBorrows}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #f97316', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Members</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{totalStudents}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #d946ef', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Suppliers</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{totalSuppliers}</h3>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', height: '280px' }}>
                        
                        {/* Line Chart Config */}
                        <div style={{ flex: 2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Monthly Borrowing Trends ({new Date().getFullYear()})</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} dy={10} />
                                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Line isAnimationActive={false} type="monotone" dataKey="borrows" stroke="#14b8a6" strokeWidth={3} dot={{r: 3, fill: '#14b8a6'}} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart Config */}
                        <div style={{ flex: 1.2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#0f172a' }}>Distribution by Category</h3>
                            <div style={{ position: 'relative', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie isAnimationActive={false} data={categoryData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{totalBooksCount}</p>
                                    <p style={{ margin: 0, fontSize: '9px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Books</p>
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {categoryData.map(cat => (
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
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Overview Data Totals</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Data Category</th>
                                <th style={{ padding: '8px', textAlign: 'right' }}>Total Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {systemData.map((d, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px', fontWeight: 600 }}>{d.name}</td>
                                    <td style={{ padding: '8px', textAlign: 'right' }}>{d.count.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1.5rem 2rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a' }}>Analytics & Reports</h2>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Real-time insights into library performance and borrowing trends</p>
                </div>
                <div data-html2canvas-ignore="true" style={{ display: 'flex', gap: '1rem' }}>
                    <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>
                        <CalendarIcon size={16} /> All Time <span style={{fontSize:'0.6rem'}}>▼</span>
                    </button>
                    <button onClick={handleExportPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', backgroundColor: '#14b8a6', color: 'white', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(20, 184, 166, 0.3)' }}>
                        <Download size={16} /> Export Report
                    </button>
                </div>
            </div>

            {/* Overall System Summary KPI Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#f0fdfa', padding: '0.75rem', borderRadius: '0.75rem', color: '#14b8a6' }}>
                        <Book size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Books</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>{totalBooksCount.toLocaleString()}</h3>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#eff6ff', padding: '0.75rem', borderRadius: '0.75rem', color: '#3b82f6' }}>
                        <Repeat size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Transactions</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>{totalBorrows.toLocaleString()}</h3>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#fff7ed', padding: '0.75rem', borderRadius: '0.75rem', color: '#f97316' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Members</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>{totalStudents.toLocaleString()}</h3>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#fdf4ff', padding: '0.75rem', borderRadius: '0.75rem', color: '#d946ef' }}>
                        <Truck size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suppliers</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>{totalSuppliers.toLocaleString()}</h3>
                    </div>
                </div>
                <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ backgroundColor: '#fef2f2', padding: '0.75rem', borderRadius: '0.75rem', color: '#ef4444' }}>
                        <MessageSquare size={24} />
                    </div>
                    <div>
                        <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Live Notices</p>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>{totalNotices.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            {/* Top Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                
                {/* Line Chart */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a' }}>Monthly Borrowing Trends</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
                                <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a' }}>{totalBorrows.toLocaleString()}</span>
                                <span style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Total All-Time</span>
                            </div>
                        </div>
                        <select style={{ padding: '0.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#f8fafc', fontSize: '0.75rem', fontWeight: 600, color: '#475569', outline: 'none' }}>
                            <option>This Year</option>
                        </select>
                    </div>
                    
                    <div style={{ width: '100%', height: '250px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} 
                                    dy={10}
                                />
                                <YAxis hide domain={['dataMin', 'dataMax + 2']} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`${value}`, 'Transactions']}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="borrows" 
                                    stroke="#14b8a6" 
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#14b8a6', stroke: 'white', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>Distribution by Category</h3>
                    
                    {categoryData.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>No books in inventory.</div>
                    ) : (
                        <>
                            <div style={{ position: 'relative', width: '100%', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>{totalBooksCount.toLocaleString()}</p>
                                    <p style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '4px' }}>Books</p>
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {categoryData.map(cat => (
                                    <div key={cat.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontWeight: 500 }}>
                                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }}></span>
                                            {cat.name}
                                        </div>
                                        <span style={{ fontWeight: 600, color: '#0f172a' }}>{cat.percent}%</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Bottom Row */}
            <div>
                <h3 style={{ fontSize: '1.25rem', color: '#94a3b8', fontWeight: 300, marginBottom: '1rem' }}>Detailed Performance Metrics</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                    
                    {/* Authors List */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}>Most Popular Authors</h4>
                            <MoreHorizontal size={18} color="#94a3b8" />
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {authorData.length === 0 && <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>No borrowing data available.</p>}
                            {authorData.map(author => (
                                <div key={author.name}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                                        <span>{author.name}</span>
                                        <span style={{ color: '#64748b' }}>{author.count} borrows</span>
                                    </div>
                                    <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                                        <div style={{ width: `${author.percent}%`, height: '100%', backgroundColor: '#14b8a6', borderRadius: '99px' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Book List */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem' }}>Top Borrowed Books</h4>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
                            {topBooks.length === 0 && <p style={{color: '#94a3b8', fontSize: '0.875rem'}}>No borrowing data available.</p>}
                            {topBooks.map(book => (
                                <div key={book.title} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: '36px', height: '48px', backgroundColor: '#f0fdfa', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Book size={16} color="#14b8a6" />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.125rem' }}>{book.title}</p>
                                            <p style={{ fontSize: '0.65rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{book.author}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>{book.borrows}</span>
                                        <div style={{ width: '6px', height: '6px', backgroundColor: book.statusColor, borderRadius: '50%' }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Peak Hours Heatmap Mock */}
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a' }}>Peak Hours Activity</h4>
                            <span style={{ fontSize: '0.65rem', backgroundColor: '#f8fafc', padding: '2px 6px', borderRadius: '4px', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 600 }}>Synthetic</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {heatmap.map((row, i) => (
                                <div key={i} style={{ display: 'flex', gap: '4px' }}>
                                    {row.map((cell, j) => {
                                        // Colors ranging from extremely light teal to dark teal
                                        const opacity = 0.1 + (cell / 10) * 0.9;
                                        return (
                                            <div key={j} style={{ flex: 1, aspectRatio: '1/1', backgroundColor: `rgba(20, 184, 166, ${opacity})`, borderRadius: '2px' }}></div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600, marginTop: '0.5rem', marginBottom: '1.5rem' }}>
                            <span>08:00</span>
                            <span>12:00</span>
                            <span>16:00</span>
                            <span>20:00</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.6rem', color: '#94a3b8', fontWeight: 600 }}>
                            <span>Low</span>
                            <div style={{ width: '60%', height: '4px', background: 'linear-gradient(90deg, rgba(20,184,166,0.1), rgba(20,184,166,1))', borderRadius: '99px' }}></div>
                            <span>High</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
