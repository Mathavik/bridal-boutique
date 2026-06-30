import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import ProductList from "../pages/products/ProductList";
import ProductForm from "../pages/products/ProductForm";
import Billing from "../pages/billing/Billing";
import Reports from "../pages/reports/SalesReport";
import Settings from "../pages/settings/Settings";
import MainLayout from "../layouts/MainLayout";
import CompanyList from "../pages/company/CompanyList";
import CompanyForm from "../pages/company/CompanyForm";
import EditCompany from "../pages/company/EditCompany";
import TaxList from "../pages/tax/TaxList";
import TaxForm from "../pages/tax/TaxForm";
import Invoice from "../pages/billing/Invoice";
import EditProduct from "../pages/products/EditProduct";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import CashierForm from "../pages/cashier/CashierForm";
import CashierList from "../pages/cashier/CashierList";
import EditCashier from "../pages/cashier/EditCashier";
import CategoryForm from "../pages/category/CategoryForm";
import CategoryList from "../pages/category/categoryList";
import EditCategory from "../pages/category/EditCategory";
import Profile from "../pages/profile/profile";
import ForgotPassword from "../pages/auth/ForgotPassword";
import RegisterCompany from "../pages/auth/registercompany";
import PaymentPending from "../pages/reports/PaymentPending";
import CustomerForm from "../pages/customer/CustomerForm";
import CustomerList from "../pages/customer/CustomerList";
import EditCustomer from "../pages/customer/EditCustomer";

import CreditSettings from "../pages/billing/CreditSettings";
import PaymentPendingHistory from "../pages/reports/PaymentPendingHistory";
import PendingCashierRequests from "../pages/CashierRequests/PendingCashierRequests";
import AdminForm from "../pages/Admin/AdminForm";
import AdminList from "../pages/Admin/AdminList";
import EditAdmin from "../pages/Admin/EditAdmin";
import CompanyRequest from "../pages/CompanyRequests/CompanyRequest";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

          {/* 🔓 Public */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route path="/register" element={<Register />} />
                <Route path="/registercompany" element={<RegisterCompany />} />

<Route path="/forgot-password" element={<ForgotPassword />} />
        {/* 🔐 Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>
        {/* <Route path="/" element={<Login />} /> */}
        {/* <Route path="/Register" element={<Register />} /> */}
        

        <Route element={<MainLayout />}>
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/add" element={<ProductForm />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/invoice/:invoiceNo" element={<Invoice/>} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/company" element={<CompanyList />} />
          <Route path="/company/add" element={<CompanyForm />} />
          <Route path="/company/edit/:id" element={<EditCompany />} />
          <Route path="/customer" element={<CustomerList />} />
          <Route path="/customer/add" element={<CustomerForm />} />
          <Route path="/customer/edit/:id" element={<EditCustomer />} />


          <Route path="/invoice" element={<Invoice />} />
          <Route path="/reports" element={<Reports />} />
          
          <Route path="/cashier/add" element={<CashierForm />} />
          <Route path="/cashier" element={<CashierList />} />
         <Route path="/profile" element={<Profile />} />
<Route path="/payment-pending" element={<PaymentPending />} />
<Route path="/paymentpending-history" element={<PaymentPendingHistory />} />
<Route path="/credit-settings" element={<CreditSettings />} />

          <Route path="/cashier/edit/:id" element={<EditCashier/>} />
            <Route path="/category/add" element={<CategoryForm />} />
          <Route path="/category" element={<CategoryList/>} />
          <Route path="/category/edit/:id" element={<EditCategory/>} />


<Route path="/tax" element={<TaxList />} />
<Route path="/tax/add" element={<TaxForm />} />

<Route path="/cashier-requests" element={<PendingCashierRequests />}
/>
      <Route path="/admin/add" element={<AdminForm />} />
      <Route path="/admin" element={<AdminList />} />
      <Route path="/admin/edit/:id" element={<EditAdmin />} />
      <Route path="/company-requests" element={<CompanyRequest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}