import React, { useState, useRef } from "react";
import { addBook } from "../../services/bookService.js";
import { useNavigate } from "react-router-dom";
import { BookOpen, UploadCloud, Save } from 'lucide-react';

export default function AddBook() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        quantity: 1,
        shelfLocation: "",
        supplier: "",
        description: "",
        coverImage: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, coverImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await addBook(formData);
            alert("Book added successfully!");
            navigate("/books");
        } catch (err) {
            console.error("Error adding book:", err);
            alert("Failed to add book.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Breadcrumb & Header */}
            <div>
                <p style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: 600, marginBottom: '1rem' }}>
                    Book Inventory <span style={{ color: '#9ca3af', margin: '0 0.5rem' }}>&gt;</span> <span style={{ color: '#111827' }}>Add New Book</span>
                </p>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Add New Book</h2>
                <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Fill out the information below to register a new volume in the system.</p>
            </div>

            {/* Form Card */}
            <div style={{ backgroundColor: 'white', borderRadius: '1rem', padding: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    {/* Title */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Book Title</label>
                        <input 
                            name="title" 
                            placeholder="e.g. The Great Gatsby"
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none' }}
                        />
                    </div>

                    {/* Author & ISBN */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Author Name</label>
                            <input 
                                name="author" 
                                placeholder="F. Scott Fitzgerald"
                                value={formData.author} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>ISBN-13</label>
                            <input 
                                name="isbn" 
                                placeholder="978-3-16-148410-0"
                                value={formData.isbn} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Category, Quantity, Shelf */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Category</label>
                            <select 
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white' }}
                            >
                                <option value="" disabled>Select Category</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Non-Fiction">Non-Fiction</option>
                                <option value="Science">Science</option>
                                <option value="History">History</option>
                                <option value="Academic">Academic</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Quantity</label>
                            <input 
                                type="number"
                                name="quantity" 
                                min="1"
                                placeholder="1"
                                value={formData.quantity} 
                                onChange={handleChange} 
                                required 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Shelf Location</label>
                            <input 
                                name="shelfLocation" 
                                placeholder="A1-04"
                                value={formData.shelfLocation} 
                                onChange={handleChange} 
                                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Supplier */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Supplier</label>
                        <select 
                            name="supplier" 
                            value={formData.supplier} 
                            onChange={handleChange} 
                            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', backgroundColor: 'white' }}
                        >
                            <option value="" disabled>Select Supplier</option>
                            <option value="Oxford Press">Oxford Press</option>
                            <option value="Penguin Random House">Penguin Random House</option>
                            <option value="Donation">Donation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Book Description (Optional)</label>
                        <textarea 
                            name="description" 
                            placeholder="Brief summary or condition notes..."
                            value={formData.description} 
                            onChange={handleChange} 
                            style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>

                    {/* Cover Image Upload Area */}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#374151', marginBottom: '0.5rem' }}>Book Cover Image</label>
                        <div 
                            onClick={() => fileInputRef.current.click()}
                            style={{ border: '2px dashed #cbd5e1', borderRadius: '0.75rem', padding: formData.coverImage ? '1rem' : '3rem 2rem', textAlign: 'center', backgroundColor: '#f8fafc', cursor: 'pointer' }}
                        >
                            {formData.coverImage ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <img src={formData.coverImage} alt="Cover Preview" style={{ maxHeight: '200px', objectFit: 'contain', marginBottom: '1rem', borderRadius: '0.5rem' }} />
                                    <p style={{ color: '#3b82f6', fontSize: '0.875rem', fontWeight: 600 }}>Click to change image</p>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={32} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                                    <p style={{ color: '#475569', fontWeight: 600, marginBottom: '0.25rem' }}>Click to upload</p>
                                    <p style={{ color: '#94a3b8', fontSize: '0.75rem' }}>PNG, JPG or JPEG (max. 5MB)</p>
                                </>
                            )}
                            <input 
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6', gap: '1rem' }}>
                        <button type="button" onClick={() => navigate('/books')} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#6b7280', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading} style={{ padding: '0.75rem 2rem', backgroundColor: '#14b8a6', color: 'white', fontWeight: 600, border: 'none', borderRadius: '99px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <Save size={20} />
                            {isLoading ? "Saving..." : "Save Book Record"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
