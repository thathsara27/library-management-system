import React, { useEffect, useState } from "react";
import { getSuppliers, deleteSupplier } from "../../services/supplierService.js";
import { Link } from "react-router-dom";
import { Search, Edit, Trash2, Filter, Download, Star, StarHalf, PlusCircle } from 'lucide-react';

export default function SupplierList() {
    const [suppliers, setSuppliers] = useState([]);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const categories = ["All", "Academic", "Fiction", "Journals", "Technology"];

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

    const filteredSuppliers = suppliers.filter((s) => {
        const matchesSearch = s.supplierName.toLowerCase().includes(search.toLowerCase()) || 
                              s.contactPerson.toLowerCase().includes(search.toLowerCase()) || 
                              s.email.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === "All" || s.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

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
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Supplier Directory</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Manage and monitor {suppliers.length} active book suppliers globally
                    </p>
                </div>
                <Link to="/suppliers/add" style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '99px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <PlusCircle size={20} /> Add New Supplier
                </Link>
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
                        <button style={{ padding: '0.5rem', color: 'var(--color-text-muted)', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                            <Filter size={18} />
                        </button>
                        <button style={{ padding: '0.5rem', color: 'var(--color-text-muted)', backgroundColor: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
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
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map((s) => (
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
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                            <button style={{ padding: '0.5rem', color: '#9ca3af', backgroundColor: 'transparent', borderRadius: '6px', border: 'none', cursor: 'pointer' }}>
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
                        Showing <strong style={{color: 'var(--color-text-main)'}}>{filteredSuppliers.length > 0 ? 1 : 0}</strong> to <strong style={{color: 'var(--color-text-main)'}}>{filteredSuppliers.length}</strong> of <strong style={{color: 'var(--color-text-main)'}}>{suppliers.length}</strong> results
                    </p>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                        <button style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>Previous</button>
                        <button style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', fontSize: '0.875rem', fontWeight: 600 }}>1</button>
                        <button style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>Next</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
