import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import BlogList from './components/BlogList/BlogList';
import BlogDetail from './components/BlogDetails/BlogDetails';
import NewPost from './components/NewPost/NewPost';
import MainLayout from './components/MainLayout/MainLayout';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import MyBlogs from './components/MyBlogs/MyBlogs';
import EditPost from './components/EditPost/EditPost';

import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import AuthContext from './contexts/AuthContext'; // Import AuthContext

function ProtectedRoute({ element }) {
  const { token, isLoading } = useContext(AuthContext); // Use useContext hook
  if (isLoading) {
    return <div>Loading...</div>; // Show loading state if needed
  }
  return token ? element : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <MainLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute element={<BlogList />} />} />
            <Route path="/post/:id" element={<ProtectedRoute element={<BlogDetail />} />} />
            <Route path="/create" element={<ProtectedRoute element={<NewPost />} />} />
            <Route path="/my-blogs" element={<ProtectedRoute element={<MyBlogs />} />} />
            <Route path="/edit/:postId" element={<ProtectedRoute element={<EditPost />} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </MainLayout>
      </AuthProvider>
    </Router>
  );
}

export default App;
