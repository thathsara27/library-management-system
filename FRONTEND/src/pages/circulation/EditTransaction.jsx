import React, { useState, useEffect } from "react";
import { updateTransaction, getTransaction } from "../../services/circulationService.js";
import { useNavigate, useParams } from "react-router-dom";
import { Edit, Save, Clock } from 'lucide-react';

export default function EditTransaction() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        studentId: "",
        studentName: "",
        bookTitle: "",
        bookAuthor: "",
        issueDate: "",
        dueDate: "",
        status: "Borrowed"
    });

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const res = await getTransaction(id);
                const data = res.data;
                
                // Format dates to YYYY-MM-DD for the input fields
                let issue = data.issueDate ? data.issueDate.split('T')[0] : "";
                let due = data.dueDate ? data.dueDate.split('T')[0] : "";

                setFormData({
                    ...data,
                    issueDate: issue,
                    dueDate: due
                });
            } catch (err) {
                console.error("Failed to load transaction", err);
                alert("Failed to fetch transaction record.");
            }
        };
        fetchTransaction();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateTransaction(id, formData);
            alert("Transaction successfully updated.");
            navigate("/circulation");
        } catch (err) {
            console.error("Error updating loan:", err);
            alert("Failed to update loan record.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Breadcrumb & Header */}
            <div>
                <p style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1rem' }}>
                    Circulation Tracker <span style={{ color: '#9ca3af', margin: '0 0.5rem' }}>&gt;</span> <span style={{ color: '#111827' }}>Edit Loan Record</span>
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Update Transaction</h2>
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Direct edit mode for administrative overrides.</p>
            </div>

            {/* Form Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Student Info */}
                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', display: 'flex', gap: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Student Name</label>
                            <input 
                                className="form-input"
                                name="studentName"
                                value={formData.studentName} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Student ID</label>
                            <input 
                                className="form-input"
                                name="studentId"
                                value={formData.studentId} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            />
                        </div>
                    </div>

                    {/* Book Info */}
                    <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '0.75rem', display: 'flex', gap: '1.5rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Book Title</label>
                            <input 
                                className="form-input"
                                name="bookTitle"
                                value={formData.bookTitle} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#475569', marginBottom: '0.5rem' }}>Book Author</label>
                            <input 
                                className="form-input"
                                name="bookAuthor"
                                value={formData.bookAuthor} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            />
                        </div>
                    </div>

                    {/* Loan Timeline & Status */}
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
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.75rem' }}>
                                Status
                            </label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white' }}
                            >
                                <option value="Borrowed">Borrowed</option>
                                <option value="Returned">Returned</option>
                            </select>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #f1f5f9', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/circulation')} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#64748b', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                            Cancel Changes
                        </button>
                        <button type="submit" disabled={isLoading} style={{ padding: '0.75rem 2rem', backgroundColor: '#3b82f6', color: 'white', fontWeight: 600, border: 'none', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)' }}>
                            <Edit size={20} />
                            {isLoading ? "Saving..." : "Save Record"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
