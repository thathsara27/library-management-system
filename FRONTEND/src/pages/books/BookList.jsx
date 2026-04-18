import React, { useEffect, useState, useRef } from "react";
import { getBooks, deleteBook } from "../../services/bookService.js";
import { Link } from "react-router-dom";
import { Search, Edit, Trash2, BookOpen, PlusCircle, Filter, Download } from 'lucide-react';
import html2pdf from "html2pdf.js";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function BookList() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");
    const reportRef = useRef(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const res = await getBooks();
            setBooks(res.data);
        } catch (error) {
            console.error("Failed to load books:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to completely remove this book from the inventory?")) {
            await deleteBook(id);
            loadBooks();
        }
    };

    const handleExportPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin:       0.3,
            filename:     'books_inventory_report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const catCounts = {};
    books.forEach(b => {
        const cat = b.category || 'Uncategorized';
        catCounts[cat] = (catCounts[cat] || 0) + (b.quantity || 1);
    });
    
    const COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#64748b'];
    
    // Move totalBooks up here to avoid ReferenceError
    const totalBooks = books.reduce((acc, book) => acc + (book.quantity || 1), 0);
    
    const catPieData = Object.keys(catCounts).map((cat, i) => ({
        name: cat,
        value: catCounts[cat],
        percent: totalBooks > 0 ? Math.round((catCounts[cat] / totalBooks) * 100) : 0,
        color: COLORS[i % COLORS.length]
    })).sort((a,b) => b.value - a.value).slice(0, 5);

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const currentYear = new Date().getFullYear();
    const monthlyAdditions = Array(12).fill(0).map((_, i) => ({ name: months[i], Books: 0 }));

    books.forEach(b => {
        if (b._id) {
            const timestamp = parseInt(b._id.substring(0, 8), 16) * 1000;
            const date = new Date(timestamp);
            if (date.getFullYear() === currentYear) {
                monthlyAdditions[date.getMonth()].Books += (b.quantity || 1);
            }
        }
    });

    const filteredBooks = books.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.includes(search)
    );

    const uniqueTitles = books.length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hidden Report Template */}
            <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -9999, width: '1100px', backgroundColor: '#f8fafc' }}>
                <div ref={reportRef} style={{ padding: '2rem', backgroundColor: '#f8fafc', color: 'black', fontFamily: 'sans-serif' }}>
                    
                    {/* Header Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #14b8a6', paddingBottom: '1rem', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'bold' }}>Library Management System</h1>
                            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '18px', color: '#475569' }}>Books Inventory Report</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>GENERATED ON</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* KPI Dashboard Strip */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #14b8a6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Volumes</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{totalBooks}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Unique Titles</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{uniqueTitles}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #ef4444', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Out of Stock</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{books.filter(b => b.quantity === 0).length}</h3>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', height: '280px' }}>
                        
                        {/* Line Chart Config */}
                        <div style={{ flex: 2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Monthly Acquisitions ({currentYear})</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyAdditions} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} dy={10} />
                                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Line isAnimationActive={false} type="monotone" dataKey="Books" stroke="#14b8a6" strokeWidth={3} dot={{r: 3, fill: '#14b8a6'}} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart Config */}
                        <div style={{ flex: 1.2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#0f172a' }}>Category Distribution</h3>
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
                                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{totalBooks}</p>
                                    <p style={{ margin: 0, fontSize: '9px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Books</p>
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
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Inventory Details</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Title</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Author</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>ISBN</th>
                                <th style={{ padding: '8px', textAlign: 'center' }}>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((b, i) => (
                                <tr key={b._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px' }}>{i + 1}</td>
                                    <td style={{ padding: '8px', fontWeight: 600 }}>{b.title}</td>
                                    <td style={{ padding: '8px' }}>{b.author}</td>
                                    <td style={{ padding: '8px' }}>{b.category}</td>
                                    <td style={{ padding: '8px' }}>{b.isbn}</td>
                                    <td style={{ padding: '8px', textAlign: 'center' }}>{b.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Books Inventory</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Tracking {totalBooks} total volumes across {uniqueTitles} unique titles.
                    </p>
                </div>
                <div data-html2canvas-ignore="true" style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={handleExportPDF} style={{
                        backgroundColor: '#f8fafc',
                        color: '#475569',
                        border: '1px solid #e2e8f0',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '99px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}>
                        <Download size={20} /> Export Report
                    </button>
                    <Link to="/books/add" style={{
                        backgroundColor: '#14b8a6',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '99px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                    }}>
                        <PlusCircle size={20} /> Add New Book
                    </Link>
                </div>
            </div>

            {/* Main Table Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                
                {/* Filters Strip */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search by Title, Author, or ISBN..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem 1rem 0.75rem 3rem',
                                borderRadius: '99px',
                                border: '1px solid #e5e7eb',
                                outline: 'none',
                                backgroundColor: '#f9fafb',
                                fontSize: '0.875rem'
                            }}
                        />
                    </div>
                    <button style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: 'white', cursor: 'pointer' }}>
                        <Filter size={18} /> Filters
                    </button>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#fefefe' }}>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Book Details</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Category</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ISBN / Shelf</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>Stock</th>
                                <th data-html2canvas-ignore="true" style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((b) => (
                                <tr key={b._id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background-color 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '64px', borderRadius: '4px', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                {b.coverImage ? (
                                                    <img src={b.coverImage} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <BookOpen size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, color: '#111827', fontSize: '1rem', marginBottom: '0.25rem' }}>{b.title}</p>
                                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>by {b.author}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>
                                            {b.category}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: '#374151', fontFamily: 'monospace', marginBottom: '0.25rem' }}>{b.isbn}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>Shelf: <span style={{ fontWeight: 600, color: '#14b8a6' }}>{b.shelfLocation || "Unassigned"}</span></p>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                        <div style={{ display: 'inline-block', padding: '0.25rem 1rem', borderRadius: '0.5rem', backgroundColor: b.quantity > 0 ? '#ecfdf5' : '#fef2f2', color: b.quantity > 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                            {b.quantity}
                                        </div>
                                    </td>
                                    <td data-html2canvas-ignore="true" style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link to={`/books/edit/${b._id}`} style={{ padding: '0.5rem', color: '#9ca3af', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'flex' }}>
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(b._id)} style={{ padding: '0.5rem', color: '#ef4444', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredBooks.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: '#9ca3af' }}>
                                        No books found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
