import React, { useEffect, useState, useRef } from "react";
import { getSuppliers, deleteSupplier } from "../../services/supplierService.js";
import { Link } from "react-router-dom";
import { Search, Edit, Trash2, Filter, Download, Star, StarHalf, PlusCircle } from 'lucide-react';
import html2pdf from "html2pdf.js";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function SupplierList() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [minRatingFilter, setMinRatingFilter] = useState(0);
    const itemsPerPage = 7;
    const reportRef = useRef(null);

    const categories = ["All", "Academic", "Fiction", "Journals", "Technology"];

    useEffect(() => {
        setCurrentPage(1);
    }, [search, activeCategory]);

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        try {
            const res = await getSuppliers();
            setSuppliers(res.data);
        } catch (error) {
            console.error("Failed to load suppliers:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            await deleteSupplier(id);
            loadSuppliers();
        }
    };

    const handleExportPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin:       0.3,
            filename:     'suppliers_report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const handleDownloadCSV = () => {
        const headers = ['Supplier Name', 'Category', 'Contact Person', 'Email', 'Phone', 'Supplied Count', 'Rating'];
        const csvRows = filteredSuppliers.map(s => 
            `"${s.supplierName}","${s.category}","${s.contactPerson}","${s.email}","${s.phone}","${s.suppliedCount}","${s.rating || 5}"`
        );
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'suppliers.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const catCounts = {};
    suppliers.forEach(s => {
        const c = s.category || 'Uncategorized';
        catCounts[c] = (catCounts[c] || 0) + 1;
    });
    
    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#64748b'];
    
    const catPieData = Object.keys(catCounts).map((cat, i) => ({
        name: cat,
        value: catCounts[cat],
        percent: suppliers.length > 0 ? Math.round((catCounts[cat] / suppliers.length) * 100) : 0,
        color: COLORS[i % COLORS.length]
    })).sort((a,b) => b.value - a.value).slice(0, 5);

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const currentYear = new Date().getFullYear();
    const monthlyAdditions = Array(12).fill(0).map((_, i) => ({ name: months[i], Suppliers: 0 }));

    suppliers.forEach(s => {
        if (s._id) {
            const timestamp = parseInt(s._id.substring(0, 8), 16) * 1000;
            const date = new Date(timestamp);
            if (date.getFullYear() === currentYear) {
                monthlyAdditions[date.getMonth()].Suppliers += 1;
            }
        }
    });

    const filteredSuppliers = suppliers.filter((s) => {
        const matchesSearch = s.supplierName.toLowerCase().includes(search.toLowerCase()) || 
                              s.contactPerson.toLowerCase().includes(search.toLowerCase()) || 
                              s.email.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || s.category === activeCategory;
        const matchesRating = (s.rating || 5) >= minRatingFilter;
        return matchesSearch && matchesCategory && matchesRating;
    });

    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    const currentSuppliers = filteredSuppliers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star 
                    key={i} 
                    size={16} 
                    fill={i <= rating ? "#facc15" : "none"} 
                    color={i <= rating ? "#facc15" : "#e5e7eb"} 
                />
            );
        }
        return <div style={{ display: 'flex', gap: '2px' }}>{stars}</div>;
    };

    const getInitials = (name) => {
        if (!name) return "SP";
        return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hidden Report Template */}
            <div style={{ position: 'absolute', top: 0, left: 0, opacity: 0, pointerEvents: 'none', zIndex: -9999, width: '1100px', backgroundColor: '#f8fafc' }}>
                <div ref={reportRef} style={{ padding: '2rem', backgroundColor: '#f8fafc', color: 'black', fontFamily: 'sans-serif' }}>
                    
                    {/* Header Strip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #8b5cf6', paddingBottom: '1rem', marginBottom: '1.5rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '24px', color: '#0f172a', fontWeight: 'bold' }}>Library Management System</h1>
                            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '18px', color: '#475569' }}>Supplier Directory Report</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>GENERATED ON</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* KPI Dashboard Strip */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #8b5cf6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Suppliers</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{suppliers.length}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Categories</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{Object.keys(catCounts).length}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #10b981', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>High Rated (5★)</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{suppliers.filter(s => s.rating === 5).length}</h3>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', height: '280px' }}>
                        
                        {/* Line Chart Config */}
                        <div style={{ flex: 2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Supplier Onboarding Trends ({currentYear})</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyAdditions} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} dy={10} />
                                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Line isAnimationActive={false} type="monotone" dataKey="Suppliers" stroke="#8b5cf6" strokeWidth={3} dot={{r: 3, fill: '#8b5cf6'}} activeDot={{ r: 5 }} />
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
                                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{suppliers.length}</p>
                                    <p style={{ margin: 0, fontSize: '9px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Suppliers</p>
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
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Supplier Directory Details</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Supplier Name</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Contact Person</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Email/Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((s, i) => (
                                <tr key={s._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px' }}>{i + 1}</td>
                                    <td style={{ padding: '8px', fontWeight: 600 }}>{s.supplierName}</td>
                                    <td style={{ padding: '8px' }}>{s.category}</td>
                                    <td style={{ padding: '8px' }}>{s.contactPerson}</td>
                                    <td style={{ padding: '8px' }}>{s.email}<br/>{s.phone}</td>
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
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Supplier Directory</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Manage and monitor {suppliers.length} active book suppliers globally
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
                    <Link to="/suppliers/add" style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '99px',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        textDecoration: 'none'
                    }}>
                        <PlusCircle size={20} /> Add New Supplier
                    </Link>
                </div>
            </div>

            {/* Main Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
                
                {/* Filters Strip */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    
                    {/* Search */}
                    <div style={{ position: 'relative', width: '350px' }}>
                        <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search suppliers by name, email, or contact..."
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

                    {/* Category Pills & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginRight: '0.5rem' }}>Category:</span>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '99px',
                                        fontSize: '0.875rem',
                                        fontWeight: activeCategory === cat ? 600 : 500,
                                        backgroundColor: activeCategory === cat ? 'var(--color-primary)' : 'transparent',
                                        color: activeCategory === cat ? 'white' : 'var(--color-text-main)',
                                        border: 'none',
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        <div style={{ width: '1px', height: '24px', backgroundColor: '#e5e7eb', margin: '0 0.5rem' }}></div>
                        <button onClick={() => setShowFilterModal(true)} style={{ padding: '0.5rem', color: 'var(--color-text-muted)', backgroundColor: minRatingFilter > 0 ? '#e0e7ff' : '#f9fafb', borderRadius: '8px', border: minRatingFilter > 0 ? '1px solid #c7d2fe' : '1px solid #e5e7eb', cursor: 'pointer' }}>
                            <Filter size={18} color={minRatingFilter > 0 ? '#4f46e5' : 'var(--color-text-muted)'} />
                        </button>
                        <button onClick={handleDownloadCSV} style={{ padding: '0.5rem', color: 'var(--color-text-muted)', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb', cursor: 'pointer' }}>
                            <Download size={18} />
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#fefefe' }}>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supplier Name</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Person</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email & Phone</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Supplied Count</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rating</th>
                                <th data-html2canvas-ignore="true" style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentSuppliers.map((s) => (
                                <tr key={s._id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background-color 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                {getInitials(s.supplierName)}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{s.supplierName}</p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <p style={{ fontWeight: 500 }}>{s.contactPerson.split(' ')[0]}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{s.contactPerson.split(' ')[1] || ""}</p>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{s.email}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{s.phone}</p>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{s.suppliedCount ? s.suppliedCount.toLocaleString() : 0}</span>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginLeft: '0.25rem' }}>Books</span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        {renderStars(s.rating || 5)}
                                    </td>
                                    <td data-html2canvas-ignore="true" style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button onClick={() => { setActiveCategory(s.category); setSearch(''); }} style={{ padding: '0.5rem', color: '#9ca3af', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer' }} title="Filter by this category">
                                                <Filter size={18} />
                                            </button>
                                            <Link to={`/suppliers/edit/${s._id}`} style={{ padding: '0.5rem', color: '#9ca3af', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(s._id)} style={{ padding: '0.5rem', color: '#9ca3af', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredSuppliers.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No suppliers found matching your filters.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Pagination */}
                <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                        Showing <strong style={{color: 'var(--color-text-main)'}}>{filteredSuppliers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to <strong style={{color: 'var(--color-text-main)'}}>{Math.min(currentPage * itemsPerPage, filteredSuppliers.length)}</strong> of <strong style={{color: 'var(--color-text-main)'}}>{filteredSuppliers.length}</strong> results
                    </p>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || totalPages === 0} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: (currentPage === 1 || totalPages === 0) ? '#d1d5db' : 'var(--color-text-muted)', backgroundColor: 'transparent', border: 'none', cursor: (currentPage === 1 || totalPages === 0) ? 'not-allowed' : 'pointer' }}>Previous</button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => setCurrentPage(page)} style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: currentPage === page ? 'var(--color-primary)' : 'transparent', color: currentPage === page ? 'white' : 'var(--color-text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}>{page}</button>
                        ))}

                        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: (currentPage === totalPages || totalPages === 0) ? '#d1d5db' : 'var(--color-text-muted)', backgroundColor: 'transparent', border: 'none', cursor: (currentPage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}>Next</button>
                    </div>
                </div>

            </div>
            {/* Filter Modal */}
            {showFilterModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', borderRadius: '1rem', width: '100%', maxWidth: '400px', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.25rem', color: '#0f172a' }}>Advanced Filters</h2>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Minimum Rating</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                {[1, 2, 3, 4, 5].map(rating => (
                                    <button
                                        key={rating}
                                        onClick={() => setMinRatingFilter(rating === minRatingFilter ? 0 : rating)}
                                        style={{
                                            padding: '0.5rem 1rem',
                                            borderRadius: '0.5rem',
                                            border: minRatingFilter === rating ? '1px solid #06b6d4' : '1px solid #e2e8f0',
                                            backgroundColor: minRatingFilter === rating ? '#ecfeff' : 'white',
                                            color: minRatingFilter === rating ? '#06b6d4' : '#64748b',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                            flex: 1
                                        }}
                                    >
                                        {rating}+
                                    </button>
                                ))}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>Click a rating again to clear.</p>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button onClick={() => { setMinRatingFilter(0); setShowFilterModal(false); }} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: 'white', color: '#64748b', fontWeight: 600, cursor: 'pointer' }}>Clear</button>
                            <button onClick={() => setShowFilterModal(false)} style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', border: 'none', backgroundColor: '#06b6d4', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Apply Filters</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
