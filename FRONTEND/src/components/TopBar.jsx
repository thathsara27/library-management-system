import React, { useState, useEffect, useRef } from 'react';
import { Search, Bell, Book, User, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getBooks } from '../services/bookService';
import { getStudents } from '../services/studentService';

export default function TopBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
            if (event.target.closest('#notification-bell-container') === null) {
                setShowNotifications(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Perform search
    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                // Fetch in parallel
                const [booksRes, studentsRes] = await Promise.all([
                    getBooks(),
                    getStudents()
                ]);

                const books = booksRes.data || [];
                const students = studentsRes.data || [];

                const lowerQuery = query.toLowerCase();

                const matchedBooks = books.filter(b => 
                    (b.title && b.title.toLowerCase().includes(lowerQuery)) || 
                    (b.author && b.author.toLowerCase().includes(lowerQuery)) ||
                    (b.isbn && b.isbn.toLowerCase().includes(lowerQuery))
                ).map(b => ({ ...b, type: 'book' }));

                const matchedStudents = students.filter(s => 
                    (s.name && s.name.toLowerCase().includes(lowerQuery)) || 
                    (s.admissionNumber && s.admissionNumber.toLowerCase().includes(lowerQuery))
                ).map(s => ({ ...s, type: 'student' }));

                setResults([...matchedBooks, ...matchedStudents].slice(0, 10)); // Top 10 results
            } catch (err) {
                console.error("Search error", err);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchResults();
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    const handleResultClick = (result) => {
        setIsOpen(false);
        setQuery('');
        if (result.type === 'book') {
            navigate(`/books/edit/${result._id}`);
        } else if (result.type === 'student') {
            navigate(`/students/edit/${result._id}`);
        }
    };

    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem 0',
            position: 'relative',
            zIndex: 50 // Ensures dropdown stays on top
        }}>
            <div ref={dropdownRef} style={{ position: 'relative', width: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', zIndex: 2 }} />
                <input
                    type="text"
                    placeholder="Search resources, students, or staff..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => { if(query.trim().length >= 2) setIsOpen(true); }}
                    style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 3rem',
                        borderRadius: '99px',
                        border: 'none',
                        backgroundColor: 'white',
                        boxShadow: 'var(--shadow-sm)',
                        outline: 'none',
                        color: 'var(--color-text-main)',
                        position: 'relative',
                        zIndex: 1
                    }}
                />
                
                {query && (
                    <button 
                        onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
                        style={{
                            position: 'absolute',
                            right: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'var(--color-text-muted)',
                            zIndex: 2,
                            padding: 0,
                            display: 'flex'
                        }}
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Dropdown */}
                {isOpen && query.trim().length >= 2 && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        marginTop: '0.5rem',
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        zIndex: 50,
                        padding: '0.5rem',
                        border: '1px solid #f3f4f6'
                    }}>
                        {isLoading ? (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>Searching...</div>
                        ) : results.length > 0 ? (
                            results.map(result => (
                                <div 
                                    key={result.type + result._id}
                                    onClick={() => handleResultClick(result)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.75rem 1rem',
                                        cursor: 'pointer',
                                        borderRadius: '0.5rem',
                                        gap: '1rem',
                                        transition: 'background-color 0.2s',
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ 
                                        padding: '0.5rem', 
                                        borderRadius: '0.5rem', 
                                        backgroundColor: result.type === 'book' ? '#e0e7ff' : '#dcfce7',
                                        color: result.type === 'book' ? '#4f46e5' : '#16a34a',
                                        display: 'flex'
                                    }}>
                                        {result.type === 'book' ? <Book size={18} /> : <User size={18} />}
                                    </div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {result.type === 'book' ? result.title : result.name}
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {result.type === 'book' ? `Author: ${result.author || 'Unknown'}` : `Admission: ${result.admissionNumber}`}
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', backgroundColor: '#f1f5f9', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
                                        {result.type}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>No results found for "{query}"</div>
                        )}
                    </div>
                )}
            </div>

            <div id="notification-bell-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => setShowNotifications(!showNotifications)} style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    cursor: 'pointer'
                }}>
                    <Bell size={20} color="var(--color-text-muted)" />
                    <span style={{ position: 'absolute', top: '0', right: '0', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
                </button>
                
                {showNotifications && (
                    <div style={{
                        position: 'absolute',
                        top: '120%',
                        right: 0,
                        width: '320px',
                        backgroundColor: 'white',
                        borderRadius: '1rem',
                        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                        zIndex: 100,
                        overflow: 'hidden',
                        border: '1px solid #f1f5f9'
                    }}>
                        <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#0f172a' }}>Notifications</h4>
                            <span style={{ fontSize: '0.75rem', color: '#06b6d4', cursor: 'pointer', fontWeight: 500 }}>Mark all as read</span>
                        </div>
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {/* Mock Notification 1 */}
                            <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer', backgroundColor: '#f8fafc' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06b6d4', marginTop: '6px', flexShrink: 0 }}></div>
                                <div>
                                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 500 }}>New Books Added</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>5 new books have been added to the Science & Technology section.</p>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>2 hours ago</p>
                                </div>
                            </div>
                            {/* Mock Notification 2 */}
                            <div style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '1rem', alignItems: 'flex-start', cursor: 'pointer' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'transparent', marginTop: '6px', flexShrink: 0 }}></div>
                                <div>
                                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.875rem', color: '#0f172a', fontWeight: 500 }}>System Maintenance</p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Scheduled maintenance will occur tonight at 2:00 AM.</p>
                                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.65rem', color: '#94a3b8' }}>Yesterday</p>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '0.75rem', textAlign: 'center', backgroundColor: '#f8fafc', borderTop: '1px solid #f1f5f9', cursor: 'pointer' }}>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>View All Notifications</p>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
