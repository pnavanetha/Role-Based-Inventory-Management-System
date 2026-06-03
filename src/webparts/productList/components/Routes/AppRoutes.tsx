import * as React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProductGridList from '../Forms/ProductGridList';
import ProductForm from '../Forms/ProductForm';
import ProductService from '../Services/ProductService';

interface IAppRoutesProps {
  productService: ProductService;
  userRole: string;
}

const AppRoutes: React.FC<IAppRoutesProps> = ({
  productService,
  userRole
}) => {

  return (

    <Routes>

      <Route
        path="/"
        element={
          <Navigate
            to="/products"
            replace
          />
        }
      />

  
      <Route
        path="/products"
        element={
          <ProductGridList
            productService={productService}
            userRole={userRole}
          />
        }
      />

      <Route
        path="/products/add"
        element={
          <ProductForm
            productService={productService}
            userRole={userRole}
          />
        }
      />

      <Route
        path="/products/edit/:id"
        element={
          <ProductForm
            productService={productService}
            userRole={userRole}
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/products"
            replace
          />
        }
      />

    </Routes>

  );
};

export default AppRoutes;