import React, { useState, useEffect } from "react";
import { updateSupplier, getSupplier } from "../../services/supplierService.js";
import { useNavigate, useParams } from "react-router-dom";
import { Briefcase, Save, ArrowLeft } from 'lucide-react';

export default function EditSupplier() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        supplierName: "",
        contactPerson: "",
        email: "",
        phone: "",
        category: "Academic",
        suppliedCount: 0,
        rating: 5
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const res = await getSupplier(id);
                // Depending on backend returning res.data or res.data.supplier
                setFormData(res.data.supplier || res.data);
            } catch (err) {
                console.error("Failed to load supplier:", err);
                alert("Failed to load supplier data.");
            }
        };
        fetchSupplier();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(formData.phone)) {
            alert("Invalid phone number format");
            return;
        }

        setIsLoading(true);
        try {
            await updateSupplier(id, formData);
            alert("Supplier updated successfully!");
            navigate("/suppliers/view");
        } catch (err) {
            console.error(err);
            alert("Error updating supplier. Check console details.");
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
                            <Briefcase size={24} />
                        </div>
                        Edit Supplier Profile
                    </h2>
                    <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Update contact or integration details for {formData.supplierName || 'this supplier'}.</p>
                </div>
                <button 
                    type="button"
                    onClick={() => navigate('/suppliers/view')}
                    style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 500, padding: '0.5rem 1rem', backgroundColor: '#f3f4f6', borderRadius: '0.5rem', cursor: 'pointer', border: 'none' }}
                >
                    <ArrowLeft size={16} /> Back to Directory
                </button>
            </div>

            {/* Form Card */}
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '1rem', boxShadow: 'var(--shadow-sm)' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Supplier/Organization Name</label>
                            <input 
                                className="form-input"
                                name="supplierName" 
                                placeholder="e.g. Oxford Press"
                                value={formData.supplierName} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="form-label">Contact Person</label>
                            <input 
                                className="form-input"
                                name="contactPerson" 
                                placeholder="e.g. Jonathan Myers"
                                value={formData.contactPerson} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email"
                                className="form-input"
                                name="email" 
                                placeholder="e.g. j.myers@oxford.com"
                                value={formData.email} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                        <div>
                            <label className="form-label">Phone Number</label>
                            <input 
                                className="form-input"
                                name="phone" 
                                placeholder="e.g. +44 20 7946 0958"
                                value={formData.phone} 
                                onChange={handleChange} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                        <div>
                            <label className="form-label">Category</label>
                            <select 
                                className="form-input"
                                name="category" 
                                value={formData.category} 
                                onChange={handleChange} 
                                required 
                                style={{ backgroundColor: '#f9fafb' }}
                            >
                                <option value="Academic">Academic</option>
                                <option value="Fiction">Fiction</option>
                                <option value="Journals">Journals</option>
                                <option value="Technology">Technology</option>
                                <option value="Donation">Donation</option>
                            </select>
                        </div>
                        <div>
                            <label className="form-label">Initial Books Supplied</label>
                            <input 
                                type="number"
                                className="form-input"
                                name="suppliedCount" 
                                value={formData.suppliedCount} 
                                onChange={handleChange} 
                            />
                        </div>
                        <div>
                            <label className="form-label">Supplier Rating (1-5)</label>
                            <input 
                                type="number"
                                min="1" max="5"
                                className="form-input"
                                name="rating" 
                                value={formData.rating} 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                        <button type="submit" className="btn-primary" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1 }}>
                            <Save size={18} />
                            {isLoading ? "Saving..." : "Update Supplier Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
