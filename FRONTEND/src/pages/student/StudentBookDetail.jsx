import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getBook } from "../../services/bookService.js";
import { Book, ArrowLeft, CheckCircle, Info } from "lucide-react";

export default function StudentBookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const res = await getBook(id);
                setBook(res.data.book);
            } catch (err) {
                console.error("Error fetching book details", err);
                setError("Book details could not be found.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#64748b' }}>Loading book details...</div>;
    }

    if (error || !book) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
                <Link to="/student/home" style={{ color: '#14b8a6', textDecoration: 'none', fontWeight: 600 }}>← Back to Dashboard</Link>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            
            <Link to="/student/home" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 500, width: 'fit-content', transition: 'color 0.2s' }}>
                <ArrowLeft size={18} /> Back to Search
            </Link>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '3rem', backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                
                {/* Book Cover */}
                <div style={{ flex: '0 0 300px', height: '400px', backgroundColor: '#f1f5f9', borderRadius: '1rem', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    {book.coverImage ? (
                        <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        <Book size={80} color="#cbd5e1" />
                    )}
                </div>

                {/* Details Section */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem 0' }}>
                    
                    <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#14b8a6', backgroundColor: '#ccfbf1', padding: '0.35rem 0.75rem', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {book.category}
                        </span>
                    </div>

                    <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.2 }}>{book.title}</h1>
                    <p style={{ fontSize: '1.25rem', color: '#64748b', marginBottom: '2rem' }}>by <span style={{ color: '#334155', fontWeight: 600 }}>{book.author}</span></p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.75rem', width: 'fit-content' }}>
                        <CheckCircle size={20} color="#10b981" />
                        <span style={{ fontSize: '1rem', color: '#10b981', fontWeight: 600 }}>{book.quantity} copies available</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>About this Book</h3>
                        <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7 }}>
                            {book.description || "No description provided for this book."}
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '1rem' }}>
                        <div>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>ISBN Number</p>
                            <p style={{ fontSize: '1rem', fontWeight: 500, color: '#334155' }}>{book.isbn}</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Shelf Location</p>
                            <p style={{ fontSize: '1rem', fontWeight: 500, color: '#334155' }}>{book.shelfLocation || 'N/A'}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
