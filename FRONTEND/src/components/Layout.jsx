import React from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children }) {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                <TopBar />
                {children}
            </main>
        </div>
    );
}
