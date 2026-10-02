import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme/ThemeContext.jsx';
import { AuthProvider } from './auth/AuthProvider.jsx';
import { ToastProvider } from './ui/Toast.jsx';
import Layout from './Layout.jsx';
import Home from './home/Home.jsx';
import Menu from './menu/Menu.jsx';
import Dish from './menu/Dish.jsx';
import Cart from './cart/Cart.jsx';
import Checkout from './checkout/Checkout.jsx';
import SignIn from './auth/SignIn.jsx';
import Favorites from './favorites/Favorites.jsx';
import OrderHistory from './orders/OrderHistory.jsx';
import { RequireAuth } from './auth/RequireAuth.jsx';
import AdminLogin from './admin/AdminLogin.jsx';
import { RequireAdmin } from './admin/RequireAdmin.jsx';
import { AdminAuthProvider } from './admin/useAdminAuth.js';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import DishManager from './admin/DishManager.jsx';
import OrderManager from './admin/OrderManager.jsx';
import NotFound from './home/NotFound.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="menu/:id" element={<Dish />} />
                <Route path="cart" element={<Cart />} />
                <Route
                  path="checkout"
                  element={
                    <RequireAuth>
                      <Checkout />
                    </RequireAuth>
                  }
                />
                <Route path="signin" element={<SignIn />} />
                <Route path="favorites" element={<Favorites />} />
                <Route path="orders" element={<OrderHistory />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route
                path="/admin/login"
                element={
                  <AdminAuthProvider>
                    <AdminLogin />
                  </AdminAuthProvider>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminAuthProvider>
                    <RequireAdmin>
                      <AdminLayout />
                    </RequireAdmin>
                  </AdminAuthProvider>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="menu" element={<DishManager />} />
                <Route path="orders" element={<OrderManager />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
