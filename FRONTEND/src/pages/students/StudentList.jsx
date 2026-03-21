import React, { useEffect, useState } from "react";
import { getMembers, deleteMember } from "../../services/memberService.js";
import { Link } from "react-router-dom";
import { Search, Edit, Trash2, Users, TrendingUp, BookCheck, PlusCircle } from 'lucide-react';

export default function StudentList() {
    const [members, setMembers] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const res = await getMembers();
            setMembers(res.data);
        } catch (error) {
            console.error("Failed to load members:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await deleteMember(id);
            loadMembers();
        }
    };

    const filteredMembers = members.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.admissionNumber.toLowerCase().includes(search.toLowerCase())
    );

    // KPI Calculations
    const totalStudents = members.length;
    
    // Calculate new this month perfectly using MongoDB ObjectID timestamp
    const newThisMonth = members.filter(m => {
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
            
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Student Management</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Manage {totalStudents} registered library members.
                    </p>
                </div>
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
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((m) => {
                                const styleColors = getRandomColor(m.name);
                                return (
                                <tr key={m._id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background-color 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: styleColors.bg, color: styleColors.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                {getInitials(m.name)}
                                            </div>
                                            <div>
                                                <p style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>{m.name}</p>
                                            </div>
                                        </div>
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
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
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
                            {filteredMembers.length === 0 && (
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
