import React, { useState, useEffect } from "react";
import { issueBook } from "../../services/circulationService.js";
import { getMembers } from "../../services/memberService.js";
import { getBooks } from "../../services/bookService.js";
import { useNavigate } from "react-router-dom";
import { BookUp, Save, Clock } from 'lucide-react';

export default function IssueBook() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    const [members, setMembers] = useState([]);
    const [books, setBooks] = useState([]);

    const today = new Date().toISOString().split('T')[0];
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 14); // 14 days default loan
    const dueStr = defaultDue.toISOString().split('T')[0];

    const [formData, setFormData] = useState({
        studentId: "",
        studentName: "",
        bookId: "", // Just for reference internally if needed later
        bookTitle: "",
        bookAuthor: "",
        issueDate: today,
        dueDate: dueStr,
        status: "Borrowed"
    });

    useEffect(() => {
        // Load real members and books for the dropdowns
        const loadData = async () => {
            try {
                const memRes = await getMembers();
                setMembers(memRes.data);
                const bookRes = await getBooks();
                setBooks(bookRes.data.filter(b => b.quantity > 0)); // Only show available books
            } catch (err) {
                console.error("Error loading dependencies", err);
            }
        };
        loadData();
    }, []);

    const handleStudentChange = (e) => {
        const id = e.target.value;
        const student = members.find(m => m.admissionNumber === id);
        setFormData({ 
            ...formData, 
            studentId: id, 
            studentName: student ? student.name : "" 
        });
    };

    const handleBookChange = (e) => {
        const title = e.target.value;
        const book = books.find(b => b.title === title);
        setFormData({ 
            ...formData, 
            bookTitle: title, 
            bookAuthor: book ? book.author : "",
            bookId: book ? book._id : ""
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await issueBook(formData);
            navigate("/circulation");
        } catch (err) {
            console.error("Error issuing book:", err);
            alert("Failed to create loan record.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Breadcrumb & Header */}
            <div>
                <p style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1rem' }}>
                    Circulation Tracker <span style={{ color: '#9ca3af', margin: '0 0.5rem' }}>&gt;</span> <span style={{ color: '#111827' }}>Issue Book to Student</span>
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Issue a Book</h2>
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Create a new loan transaction. Reduces available stock automatically.</p>
            </div>

            {/* Form Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Student Selection */}
                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>1. Select Member</h3>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Student / Member</label>
                        <select 
                            value={formData.studentId} 
                            onChange={handleStudentChange} 
                            required 
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                        >
                            <option value="" disabled>Search or Select a Student...</option>
                            {members.map(m => (
                                <option key={m._id} value={m.admissionNumber}>{m.name} ({m.admissionNumber})</option>
                            ))}
                        </select>
                    </div>

                    {/* Book Selection */}
                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>2. Select Material</h3>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Book Title</label>
                        <select 
                            value={formData.bookTitle} 
                            onChange={handleBookChange} 
                            required 
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                        >
                            <option value="" disabled>Search or Select Available Book...</option>
                            {books.map(b => (
                                <option key={b._id} value={b.title}>{b.title} (by {b.author}) - {b.quantity} in stock</option>
                            ))}
                        </select>
                    </div>

                    {/* Loan Timeline */}
                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', display: 'flex', gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
                                <Clock size={16} color="#3b82f6" /> Issue Date
                            </label>
                            <input 
                                type="date"
                                name="issueDate" 
                                value={formData.issueDate} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
                                <Clock size={16} color="#ef4444" /> Expected Due Date
                            </label>
                            <input 
                                type="date"
                                name="dueDate" 
                                value={formData.dueDate} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none' }}
                            />
                            <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>Standard loan period is 14 days.</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/circulation')} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#64748b', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                            Cancel Loan
                        </button>
                        <button type="submit" disabled={isLoading} style={{ padding: '0.75rem 2rem', backgroundColor: '#3b82f6', color: 'white', fontWeight: 600, border: 'none', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)' }}>
                            <BookUp size={20} />
                            {isLoading ? "Processing..." : "Confirm & Issue Book"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
