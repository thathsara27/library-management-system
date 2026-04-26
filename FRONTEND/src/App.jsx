import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import AddStudent from "./pages/students/AddStudent.jsx";
import StudentList from "./pages/students/StudentList.jsx";
import EditStudent from "./pages/students/EditStudent.jsx";

import SupplierList from "./pages/suppliers/SupplierList.jsx";
import AddSupplier from "./pages/suppliers/AddSupplier.jsx";
import EditSupplier from "./pages/suppliers/EditSupplier.jsx";

import NoticeList from "./pages/notices/NoticeList.jsx";
import AddNotice from "./pages/notices/AddNotice.jsx";
import EditNotice from "./pages/notices/EditNotice.jsx";

import BookList from "./pages/books/BookList.jsx";
import AddBook from './pages/books/AddBook.jsx';
import EditBook from './pages/books/EditBook.jsx';
import CirculationTracker from './pages/circulation/CirculationTracker.jsx';
import IssueBook from "./pages/circulation/IssueBook.jsx";
import EditTransaction from "./pages/circulation/EditTransaction.jsx";

import Analytics from "./pages/analytics/Analytics.jsx";
import Settings from "./pages/settings/Settings.jsx";

import Login from "./pages/auth/Login.jsx";
import Signup from "./pages/auth/Signup.jsx";
import RoleRoute from "./components/RoleRoute.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

import Layout from "./components/Layout.jsx";
import StudentLayout from "./components/StudentLayout.jsx";
import StudentDashboard from "./pages/student/StudentDashboard.jsx";
import StudentBookDetail from "./pages/student/StudentBookDetail.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Admin / Staff Area */}
          <Route element={<RoleRoute allowedRoles={['Librarian', 'Admin', 'admin']} />}>
            <Route path="/*" element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />

                  {/* Student Management Routes */}
                  <Route path="/students/add" element={<AddStudent />} />
                  <Route path="/students/view" element={<StudentList />} />
                  <Route path="/students/edit/:id" element={<EditStudent />} />

                  {/* Supplier Management Routes */}
                  <Route path="/suppliers/view" element={<SupplierList />} />
                  <Route path="/suppliers/add" element={<AddSupplier />} />
                  <Route path="/suppliers/edit/:id" element={<EditSupplier />} />

                  {/* Notice Routes */}
                  <Route path="/notices/view" element={<NoticeList />} />
                  <Route path="/notices/add" element={<AddNotice />} />
                  <Route path="/notices/edit/:id" element={<EditNotice />} />

                  {/* Book Routes */}
                  <Route path="/books" element={<BookList />} />
                  <Route path="/books/add" element={<AddBook />} />
                  <Route path="/books/edit/:id" element={<EditBook />} />

                  {/* Circulation Routes */}
                  <Route path="/circulation" element={<CirculationTracker />} />
                  <Route path="/circulation/add" element={<IssueBook />} />
                  <Route path="/circulation/edit/:id" element={<EditTransaction />} />

                  {/* Settings & Analytics Routes */}
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            } />
          </Route>

          {/* Student Area */}
          <Route element={<RoleRoute allowedRoles={['Student', 'student']} />}>
             <Route path="/student/*" element={
                <StudentLayout>
                   <Routes>
                      <Route path="/home" element={<StudentDashboard />} />
                      <Route path="/book/:id" element={<StudentBookDetail />} />
                      
                      {/* Fallback for student routes */}
                      <Route path="*" element={<Navigate to="/student/home" replace />} />
                   </Routes>
                </StudentLayout>
             }/>
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
