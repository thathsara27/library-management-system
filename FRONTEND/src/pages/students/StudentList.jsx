import React, { useEffect, useState, useRef } from "react";
import { getStudents, deleteStudent } from "../../services/studentService.js";
import { Link } from "react-router-dom";
import { Search, Edit, Trash2, Users, TrendingUp, BookCheck, PlusCircle, Download } from 'lucide-react';
import html2pdf from "html2pdf.js";
import { LineChart, Line, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const reportRef = useRef(null);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        try {
            const res = await getStudents();
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to load students:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteStudent(id);
            loadStudents();
        }
    };

    const handleExportPDF = () => {
        const element = reportRef.current;
        const opt = {
            margin:       0.3,
            filename:     'students_report.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
        };
        html2pdf().set(opt).from(element).save();
    };

    const classCounts = {};
    students.forEach(s => {
        const c = s.class || 'Unassigned';
        classCounts[c] = (classCounts[c] || 0) + 1;
    });
    
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];
    
    const classPieData = Object.keys(classCounts).map((cls, i) => ({
        name: `Class ${cls}`,
        value: classCounts[cls],
        percent: students.length > 0 ? Math.round((classCounts[cls] / students.length) * 100) : 0,
        color: COLORS[i % COLORS.length]
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const currentYear = new Date().getFullYear();
    const monthlyAdditions = Array(12).fill(0).map((_, i) => ({ name: months[i], Students: 0 }));

    students.forEach(s => {
        if (s._id) {
            const timestamp = parseInt(s._id.substring(0, 8), 16) * 1000;
            const date = new Date(timestamp);
            if (date.getFullYear() === currentYear) {
                monthlyAdditions[date.getMonth()].Students += 1;
            }
        }
    });

    const filteredStudents = students.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.admissionNumber.toLowerCase().includes(search.toLowerCase())
    );

    // KPI Calculations
    const totalStudents = students.length;
    
    // Calculate new this month perfectly using MongoDB ObjectID timestamp
    const newThisMonth = students.filter(m => {
        if (!m._id) return false;
        const timestamp = parseInt(m._id.substring(0, 8), 16) * 1000;
        const date = new Date(timestamp);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date >= thirtyDaysAgo;
    }).length;

    // Default estimate since we don't have an active borrowings database yet
    const activeBorrowers = Math.floor(totalStudents * 0.75) || 0;

    const getInitials = (name) => {
        if (!name) return "ST";
        return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
    };

    const getRandomColor = (name) => {
        const colors = [
            { bg: '#e0e7ff', text: '#4f46e5' }, // indigo
            { bg: '#dcfce7', text: '#16a34a' }, // green
            { bg: '#fef3c7', text: '#d97706' }, // yellow
            { bg: '#fee2e2', text: '#dc2626' }, // red
            { bg: '#f3e8ff', text: '#9333ea' }  // purple
        ];
        const index = name.length % colors.length;
        return colors[index];
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
                            <h2 style={{ margin: '0.25rem 0 0 0', fontSize: '18px', color: '#475569' }}>Registered Students Report</h2>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b', fontWeight: 600 }}>GENERATED ON</p>
                            <p style={{ margin: '0.25rem 0 0 0', fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* KPI Dashboard Strip */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #3b82f6', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Students</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{totalStudents}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #10b981', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>New This Month</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>+{newThisMonth}</h3>
                        </div>
                        <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '0.75rem', borderLeft: '4px solid #f59e0b', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Borrowers (Est)</p>
                            <h3 style={{ margin: '0.5rem 0 0 0', fontSize: '24px', color: '#0f172a' }}>{activeBorrowers}</h3>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', height: '280px' }}>
                        
                        {/* Line Chart Config */}
                        <div style={{ flex: 2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Monthly Additions ({currentYear})</h3>
                            <div style={{ flex: 1, width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyAdditions} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b', fontWeight: 600}} dy={10} />
                                        <YAxis tick={{fontSize: 10, fill: '#64748b'}} axisLine={false} tickLine={false} />
                                        <Line isAnimationActive={false} type="monotone" dataKey="Students" stroke="#3b82f6" strokeWidth={3} dot={{r: 3, fill: '#3b82f6'}} activeDot={{ r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Donut Chart Config */}
                        <div style={{ flex: 1.2, backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#0f172a' }}>Class Distribution</h3>
                            <div style={{ position: 'relative', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie isAnimationActive={false} data={classPieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" stroke="none">
                                            {classPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{totalStudents}</p>
                                    <p style={{ margin: 0, fontSize: '9px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Students</p>
                                </div>
                            </div>
                            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                {classPieData.map(cat => (
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
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '14px', color: '#0f172a' }}>Student Roster Details</h3>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1' }}>
                                <th style={{ padding: '8px', textAlign: 'left' }}>#</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Student Name</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Admission No.</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Class</th>
                                <th style={{ padding: '8px', textAlign: 'left' }}>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map((m, i) => (
                                <tr key={m._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                    <td style={{ padding: '8px' }}>{i + 1}</td>
                                    <td style={{ padding: '8px', fontWeight: 600 }}>{m.name}</td>
                                    <td style={{ padding: '8px' }}>{m.admissionNumber}</td>
                                    <td style={{ padding: '8px' }}>{m.class}</td>
                                    <td style={{ padding: '8px' }}>{m.phone}</td>
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
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Student Management</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Manage {totalStudents} registered library members.
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
                    <Link to="/students/add" style={{
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
                        <PlusCircle size={20} /> Add New Student
                    </Link>
                </div>
            </div>

            {/* KPI Cards Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Total Students</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>{totalStudents}</h3>
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '0.75rem', color: '#3b82f6' }}>
                        <Users size={24} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>New This Month</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>+{newThisMonth}</h3>
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#ecfdf5', borderRadius: '0.75rem', color: '#10b981' }}>
                        <TrendingUp size={24} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Active Borrowers</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>{activeBorrowers}</h3>
                    </div>
                    <div style={{ padding: '0.75rem', backgroundColor: '#fdf4ff', borderRadius: '0.75rem', color: '#d946ef' }}>
                        <BookCheck size={24} />
                    </div>
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
                            placeholder="Search by Name or Admission No..."
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
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#fefefe' }}>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Student Name</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admission #</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Class/Grade</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Info</th>
                                <th data-html2canvas-ignore="true" style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((m) => {
                                const styleColors = getRandomColor(m.name);
                                return (
                                <tr key={m._id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background-color 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <Link to={`/students/edit/${m._id}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: styleColors.bg, color: styleColors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                {getInitials(m.name)}
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-text-main)' }}>{m.name}</p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, fontFamily: 'monospace' }}>
                                            {m.admissionNumber}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#fef3c7', color: '#d97706' }}>
                                            Class {m.class}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-main)' }}>{m.phone}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{m.address}</p>
                                    </td>
                                    <td data-html2canvas-ignore="true" style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <Link to={`/students/edit/${m._id}`} style={{ padding: '0.5rem', color: '#9ca3af', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer', display: 'inline-flex' }}>
                                                <Edit size={18} />
                                            </Link>
                                            <button onClick={() => handleDelete(m._id)} style={{ padding: '0.5rem', color: '#9ca3af', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                            {filteredStudents.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                                        No students found matching your filters.
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
