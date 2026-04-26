import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

// RoleRoute checks if the authenticated user has the required role
const RoleRoute = ({ allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#6b7280' }}>Verifying Access...</div>;
    }

    if (!user) {
        // Not logged in -> redirect to login
        return <Navigate to="/login" replace />;
    }

    // Role check logic. Staff defaults to 'Librarian', Student defaults to 'Student'
    // Normalize both to lowercase for easier checking if needed, or check against array.
    const hasRole = allowedRoles.some(role => {
        // Case-insensitive comparison just in case
        return user.role && user.role.toLowerCase() === role.toLowerCase();
    });

    if (!hasRole) {
        // Logged in but insufficient permissions. 
        // Redirect Admin to / (Dashboard), Student to /student/home
        const redirectPath = user.role.toLowerCase() === 'student' ? '/student/home' : '/';
        return <Navigate to={redirectPath} replace />;
    }

    // Authorized -> Render child routes
    return <Outlet />;
};

export default RoleRoute;
