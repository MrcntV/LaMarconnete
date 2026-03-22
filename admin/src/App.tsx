import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Products from './screens/Products';
import ProductForm from './screens/ProductForm';
import Orders from './screens/Orders';
import OrderDetail from './screens/OrderDetail';
import Customers from './screens/Customers';
import CustomerDetail from './screens/CustomerDetail';
import Newsletter from './screens/Newsletter';
import Stock from './screens/Stock';
import Locations from './screens/Locations';
import ContentEditor from './screens/ContentEditor';
import Invoices from './screens/Invoices';
import Settings from './screens/Settings';
import PromoCodes from './screens/PromoCodes';

interface ProtectedProps {
  children: React.ReactNode;
}

const Protected: React.FC<ProtectedProps> = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page">Chargement...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="/products" element={<Protected><Products /></Protected>} />
      <Route path="/products/:id" element={<Protected><ProductForm /></Protected>} />
      <Route path="/orders" element={<Protected><Orders /></Protected>} />
      <Route path="/orders/:id" element={<Protected><OrderDetail /></Protected>} />
      <Route path="/customers" element={<Protected><Customers /></Protected>} />
      <Route path="/customers/:id" element={<Protected><CustomerDetail /></Protected>} />
      <Route path="/newsletter" element={<Protected><Newsletter /></Protected>} />
      <Route path="/stock" element={<Protected><Stock /></Protected>} />
      <Route path="/locations" element={<Protected><Locations /></Protected>} />
      <Route path="/content" element={<Protected><ContentEditor /></Protected>} />
      <Route path="/invoices" element={<Protected><Invoices /></Protected>} />
      <Route path="/settings" element={<Protected><Settings /></Protected>} />
      <Route path="/promo" element={<Protected><PromoCodes /></Protected>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
