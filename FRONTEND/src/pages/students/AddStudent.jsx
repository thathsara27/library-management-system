import React, { useState } from "react";
import { addStudent } from "../../services/studentService.js";
import { useNavigate } from "react-router-dom";
import { UserPlus, Save, ArrowLeft } from 'lucide-react';

export default function AddStudent() {
    const [formData, setFormData] = useState({
        name: "",
        class: "",
        admissionNumber: "",
        address: "",
        phone: "",
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
           if (!/^07\d{8}$/.test(formData.phone)) {
        alert("Invalid phone number (must be 10 digits starting with 07)");
        return;
    }
        setIsLoading(true);
        try {
            await addStudent(formData);
            alert("Student added successfully!");
            navigate("/students/view");
        } catch (err) {
            console.error(err);
            alert("Error adding student. Check your MongoDB connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ padding: '0.5rem', backgroundColor: '#e0f2fe', borderRadius: '0.5rem', color: '#0284c7' }}>
                            <UserPlus size={24} />
                        </div>
                        Add New Student
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Register a new student into the library system.</p>
                </div>
                <button 
                    onClick={() => navigate('/students/view')}
                    style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}
                >
                    <ArrowLeft size={16} /> Back to List
                </button>
            </div>

            {/* Form Card */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Full Name</label>
                            <input 
                                className="form-input"
                                name="name" 
                                placeholder="e.g. John Doe"
                                value={formData.name} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="form-label">Admission Number</label>
                            <input 
                                className="form-input"
                                name="admissionNumber" 
                                placeholder="e.g. 24892"
                                value={formData.admissionNumber} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Class</label>
                            <input 
                                className="form-input"
                                name="class" 
                                placeholder="e.g. 10-A"
                                value={formData.class} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="form-label">Phone Number</label>
                            <input 
                                className="form-input"
                                name="phone" 
                                placeholder="e.g. 0712345678"
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="form-label">Residential Address</label>
                        <input 
                            className="form-input"
                            name="address" 
                            placeholder="Full home address"
                            value={formData.address} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                            <Save size={18} />
                            {isLoading ? "Saving..." : "Save Student Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
