import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function TopBar() {
    return (
        <header style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            padding: '1rem 0'
        }}>
            <div style={{ position: 'relative', width: '400px' }}>
                <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input
                    type="text"
                    placeholder="Search resources, students, or staff..."
                    style={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 3rem',
                        borderRadius: '99px',
                        border: 'none',
                        backgroundColor: 'white',
                        boxShadow: 'var(--shadow-sm)',
                        outline: 'none',
                        color: 'var(--color-text-main)'
                    }}
                />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button style={{
                    padding: '0.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Bell size={20} color="var(--color-text-muted)" />
                </button>
            </div>
        </header>
    );
}
