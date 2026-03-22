import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../../services/bookService.js";
import { Link } from "react-router-dom";
import { Search, Edit, Trash2, BookOpen, PlusCircle, Filter } from 'lucide-react';

export default function BookList() {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState("");

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

    const filteredBooks = books.filter((b) =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        b.isbn.includes(search)
    );

    const totalBooks = books.reduce((acc, book) => acc + (book.quantity || 1), 0);
    const uniqueTitles = books.length;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header Area */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Books Inventory</h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                        Tracking {totalBooks} total volumes across {uniqueTitles} unique titles.
                    </p>
                </div>
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
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBooks.map((b) => (
                                <tr key={b._id} style={{ borderTop: '1px solid #f3f4f6', transition: 'background-color 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                            <div style={{ width: '48px', height: '64px', borderRadius: '4px', backgroundColor: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <BookOpen size={24} />
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
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
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
