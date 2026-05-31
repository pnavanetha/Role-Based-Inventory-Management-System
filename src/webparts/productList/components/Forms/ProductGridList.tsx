import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  DeleteRegular,
  EditRegular
} from '@fluentui/react-icons';

import { IProduct } from '../Models/IProduct';
import ProductService from '../Services/ProductService';

import '../CSS/ProductList.css';

interface IProductGridListProps {
  productService: ProductService;
  userRole: string;
}

const ProductGridList: React.FC<IProductGridListProps> = ({
  productService,
  userRole
}) => {

  const navigate = useNavigate();

  const [products, setProducts] = useState<IProduct[]>([]);

  const getProducts = async (): Promise<void> => {

    try {

      const response =
        await productService.getProducts();

      console.log('GRID DATA:', response);

      setProducts(response);

    }
    catch (error) {

      console.error(error);

    }

  };

  useEffect(() => {

    getProducts();

  }, [productService]);

  const handleEdit = (id: number): void => {

    navigate(`/products/edit/${id}`);

  };

//   const handleDelete = async (id: number): Promise<void> => {

//   const confirmDelete = window.confirm(
//     'Are you sure you want to delete this product?'
//   );

//   if (!confirmDelete) {

//     return;
//   }

//   try {

//     console.log('Delete Id:', id);  
//     await productService.deleteProduct(id);
//     alert('Product Deleted Successfully');
//     await getProducts();

//   }
//   catch (error) {

//     console.error('Delete Error:', error);

//     alert('Delete Failed');

//   }

// };
const handleDelete =
  async (
    id: number
  ): Promise<void> => {

    if (
      userRole !==
      'Inventory Admin'
    ) {

      alert(
        'You are not eligible for deletion'
      );

      return;

    }

    await productService
      .deleteProduct(id);

    await getProducts();

};

  return (

    <div className="product-container">

      <div className="page-header">

        <div>

          <h1 className="page-title">
            Product Management
          </h1>

          <p className="page-subtitle">
            Manage inventory products and stock information
          </p>

        </div>

        <button
          type="button"
          className="add-product-btn"
          onClick={() => navigate('/products/add')}
        >
          + Add Product
        </button>

      </div>

      <table className="product-table">

        <thead>

          <tr>

            <th>Action</th>
            <th>Title</th>
            <th>Code</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Category</th>
            <th>Purchase Date</th>
            <th>Status</th>
            <th>Active</th>

          </tr>

        </thead>

        <tbody>

          {products.length === 0 ? (

            <tr>

              <td
                colSpan={10}
                className="no-data"
              >
                No Products Found
              </td>

            </tr>

          ) : (

            products.map((item) => (

              <tr key={item.Id}>

                <td>

                  <button
                    type="button"
                    className="icon-btn delete-icon"
                    title="Delete"
                    onClick={() => {
                      if (item.Id) {
                        handleDelete(item.Id);
                      }
                    }}
                  >
                    <DeleteRegular />
                  </button>

                  <button
                    type="button"
                    className="icon-btn edit-icon"
                    title="Edit"
                    onClick={() => {
                      if (item.Id) {
                        handleEdit(item.Id);
                      }
                    }}
                  >
                    <EditRegular />
                  </button>

                </td>

                <td>{item.Title}</td>

                <td>{item.ProductCode}</td>

                <td>
                  {item.Description
                    ? item.Description.replace(/<[^>]*>/g, '')
                    : '-'}
                </td>

                <td>{item.Quantity}</td>

                <td>₹ {item.UnitPrice}</td>

                <td>{item.Category}</td>

                <td>
                  {item.PurchaseDate
                    ? new Date(
                      item.PurchaseDate
                    ).toLocaleDateString()
                    : '-'}
                </td>

                <td>{item.StockStatus}</td>

                <td>
                  {item.IsActive
                    ? 'Yes'
                    : 'No'}
                </td>

              </tr>

            ))

          )}

        </tbody>

      </table>

    </div>

  );

};

export default ProductGridList;









