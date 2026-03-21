import React, { useState, useEffect } from "react";
import { getMember, updateMember } from "../../services/memberService.js";
import { useNavigate, useParams } from "react-router-dom";
import { UserCog, Save, ArrowLeft } from 'lucide-react';

export default function EditStudent() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        class: "",
        admissionNumber: "",
        address: "",
        phone: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        loadStudent();
    }, []);

    const loadStudent = async () => {
        try {
            const res = await getMember(id);
            if (res.data.member) {
                setFormData(res.data.member);
            } else {
                setFormData(res.data);
            }
        } catch (err) {
            console.error("Error loading student:", err);
            alert("Error loading student data.");
        } finally {
            setIsFetching(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await updateMember(id, formData);
            alert("Student updated successfully!");
            navigate("/students/view");
        } catch (err) {
            console.error(err);
            alert("Error updating student. Check your MongoDB connection.");
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
                        <div style={{ padding: '0.5rem', backgroundColor: '#fef3c7', borderRadius: '0.5rem', color: '#d97706' }}>
                            <UserCog size={24} />
                        </div>
                        Edit Student Record
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Update existing student details in the library system.</p>
                </div>
                <button 
                    onClick={() => navigate('/students/view')}
                    style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem' }}
                >
                    <ArrowLeft size={16} /> Back to List
                </button>
            </div>

            {/* Form Card */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
                {isFetching && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>Loading details...</span>
                    </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: isFetching ? 0.3 : 1 }}>
                    
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
                            {isLoading ? "Updating..." : "Update Student Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
