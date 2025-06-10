import './App.css';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { LoaderCircle } from 'lucide-react';
import { useAuthStore } from './stores/authStore';
import SignupPage from './pages/SignupPage';
import DocumentPage from './pages/DocumentPage';
function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoaderCircle className="size-15 animate-spin" />
      </div>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <LoginPage />}
        />
        <Route
          path="/document/:id"
          element={authUser ? <DocumentPage /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
