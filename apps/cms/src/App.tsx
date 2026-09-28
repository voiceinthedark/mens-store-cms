import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard";
import { ProductsPage } from "./pages/ProductsPage";
import { ProductCreatePage } from "./pages/ProductCreatePage";
import { ProductPage } from "./pages/ProductPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { OrdersPage } from "./pages/OrdersPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductCreatePage />} />
        <Route path="/products/:id/edit" element={<ProductPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
