import './App.css';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './components/custom/Header';
import { Toaster } from './components/ui/sonner';
import { AuthContext } from './context/AuthContext';
import { useContext } from 'react';
// import Footer from './components/custom/Footer';

function App() {
  const { isLoaded, isSignedIn } = useContext(AuthContext);

  if (!isLoaded) {
    // Optionally show a splash/loading screen here
    return <div>Loading...</div>;
  }

  if (isLoaded && !isSignedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return (
    <>
      <Header />
      <Outlet />
      <Toaster />
    </>
  );
}

export default App;
