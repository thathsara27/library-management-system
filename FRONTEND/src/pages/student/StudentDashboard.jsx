import React, { useState, useEffect } from 'react';
import { getBooks } from '../../services/bookService.js';
import { getNotices } from '../../services/noticeService.js';
import { Link } from 'react-router-dom';
import { Search, Book, Pin, Calendar, Megaphone, CheckCircle, XCircle } from 'lucide-react';

export default function StudentDashboard() {
    const [books, setBooks] = useState([]);
    const [notices, setNotices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 12;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksRes = await getBooks();
                // Filter available books only (quantity > 0)
                const availableBooks = booksRes.data.filter(b => b.quantity > 0);
                setBooks(availableBooks);

                const noticesRes = await getNotices();
                // Only active/published notices
                const activeNotices = noticesRes.data.filter(n => n.status !== 'Archived');
                // Sort pinned notices first
                activeNotices.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return 0;
                });
                setNotices(activeNotices);
                
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Search filter for books (title, author, category)
    const filteredBooks = books.filter(b => 
        (b.title && b.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (b.category && b.category.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Reset to page 1 whenever search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#64748b' }}>Loading Library Resources...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Search Hero Section */}
            <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', textAlign: 'center', backgroundImage: 'linear-gradient(to right, rgba(20, 184, 166, 0.05), rgba(6, 182, 212, 0.05))' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>Find Your Next Read</h2>
                <p style={{ color: '#64748b', fontSize: '1.125rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>Search through our collection of currently available books, journals, and literature.</p>
                
                <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
                    <Search style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={24} />
                    <input 
                        type="text" 
                        placeholder="Search books by title, author, or category..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: '100%', padding: '1.25rem 1.5rem 1.25rem 4rem', fontSize: '1.125rem', borderRadius: '99px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', outline: 'none' }}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
                
                {/* Main Content - Available Books */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>Available Books ({filteredBooks.length})</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                        {currentBooks.length === 0 ? (
                            <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '1rem', color: '#64748b' }}>No available books matched your search.</div>
                        ) : (
                            currentBooks.map(book => (
                                <Link to={`/student/book/${book._id}`} key={book._id} style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textDecoration: 'none', color: 'inherit', transition: 'transform 0.2s', cursor: 'pointer', height: '100%' }} className="book-card">
                                    <div style={{ height: '220px', minHeight: '220px', flexShrink: 0, backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <Book size={48} color="#cbd5e1" />
                                        )}
                                    </div>
                                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ marginBottom: '0.75rem' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#14b8a6', backgroundColor: '#ccfbf1', padding: '0.3rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{book.category}</span>
                                        </div>
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.25rem', lineHeight: 1.3 }}>{book.title}</h4>
                                        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>by {book.author}</p>
                                        
                                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <CheckCircle size={16} color="#10b981" />
                                            <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: 600 }}>Available ({book.quantity})</span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                            <button 
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1}
                                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: currentPage === 1 ? '#f8fafc' : 'white', color: currentPage === 1 ? '#94a3b8' : '#0f172a', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                            >
                                Previous
                            </button>
                            
                            <div style={{ display: 'flex', gap: '0.25rem' }}>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => paginate(i + 1)}
                                        style={{ width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '0.5rem', border: currentPage === i + 1 ? 'none' : '1px solid #e2e8f0', backgroundColor: currentPage === i + 1 ? '#14b8a6' : 'white', color: currentPage === i + 1 ? 'white' : '#475569', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button 
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0', backgroundColor: currentPage === totalPages ? '#f8fafc' : 'white', color: currentPage === totalPages ? '#94a3b8' : '#0f172a', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>

                {/* Sidebar - Notices */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>Library Notices</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notices.length === 0 ? (
                            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '1rem', color: '#64748b' }}>No current notices.</div>
                        ) : (
                            notices.map(notice => (
                                <div key={notice._id} style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '1.25rem', borderLeft: notice.isPinned ? '4px solid #f59e0b' : '4px solid #14b8a6', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                                    
                                    {notice.coverImage && (
                                        <div style={{ width: '100%', height: '100px', borderRadius: '0.5rem', overflow: 'hidden', marginBottom: '1rem' }}>
                                            <img src={notice.coverImage} alt="Notice" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#0f172a', lineHeight: 1.3 }}>
                                            {notice.isPinned && <Pin size={14} color="#f59e0b" style={{ marginRight: '0.25rem', display: 'inline' }} />}
                                            {notice.title}
                                        </h4>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.5, marginBottom: '0.75rem' }}>{notice.content}</p>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Calendar size={12}/> {new Date(notice.publishDate).toLocaleDateString()}</span>
                                        <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', color: '#475569', fontWeight: 500 }}>{notice.category}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            <style>{`
                .book-card:hover { transform: translateY(-4px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
            `}</style>
        </div>
    );
}
