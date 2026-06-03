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
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getProducts = async (): Promise<void> => {
    try {
      const response = await productService.getProducts();
      console.log('GRID DATA:', response);
      setProducts(response);
    }
    catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getProducts();
  }, [productService,]);

  useEffect(() => {

    const filtered = products.filter(item =>
      item.Title?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ProductCode?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.Category?.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredProducts(filtered);

  }, [searchText, products]);

  // useEffect(() => {

  //   let filteredData = products;

  //   if (searchText) {

  //     const allKeys =
  //       Object.keys(products[0] || {});

  //     filteredData = filteredData.filter((item: any) =>allKeys.some((field) =>item[field] && item[field].toString().toLowerCase().includes(searchText.toLowerCase()))
  //       );
  //   }
  //   setFilteredProducts(
  //     filteredData
  //   );
  // }, [products, searchText]);

  const handleEdit = (id: number): void => {

    navigate(`/products/edit/${id}`);
  };
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

  const handleSort = (column: string): void => {

    const direction =
      sortColumn === column && sortDirection === 'asc'
        ? 'desc'
        : 'asc';

    setSortColumn(column);
    setSortDirection(direction);

    const sorted = [...filteredProducts].sort((a: any, b: any) => {

      if (a[column] < b[column]) {
        return direction === 'asc' ? -1 : 1;
      }

      if (a[column] > b[column]) {
        return direction === 'asc' ? 1 : -1;
      }

      return 0;
    });

    setFilteredProducts(sorted);
  };
  return (

    <div className="product-container">


      <div className="page-header">

        <div>
          <h1 className="page-title">Product Management</h1>
        </div>
        <button type="button" className="add-product-btn" onClick={() => navigate('/products/add')}> + Add Product</button>
      </div>

      <div className="search-section">
        <label className="search-label">Search:</label>
        <input type="text" placeholder="Search Products..." value={searchText} onChange={(e) => setSearchText(e.target.value)} />

      </div>

      <div className="table-container">

        <table className="product-table">



          <thead>

            <tr>

              <th>Action</th>
              <th onClick={() => handleSort('Title')}>
                Title
                <span className="sort-icon">
                  {sortColumn === 'Title'
                    ? sortDirection === 'asc'
                      ? ' ↑'
                      : ' ↓'
                    : ' ↕'}
                </span>
              </th>

              <th onClick={() => handleSort('ProductCode')}>
                Code
                <span className="sort-icon">
                  {sortColumn === 'ProductCode'
                    ? sortDirection === 'asc'
                      ? ' ↑'
                      : ' ↓'
                    : ' ↕'}
                </span>
              </th>
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

            {filteredProducts.length === 0 ? (

              <tr>

                <td
                  colSpan={10}
                  className="no-data"
                >
                  No Products Found

                </td>

              </tr>

            ) : (

              filteredProducts.map((item) => (

                <tr key={item.Id}>

                  <td>
                    <button type="button" className="icon-btn delete-icon" title="Delete" onClick={() => {
                      if (item.Id) {
                        handleDelete(item.Id);
                      }
                    }}
                    >
                      <DeleteRegular />
                    </button>

                    <button type="button" className="icon-btn edit-icon" title="Edit"
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

    </div>

  );

};

export default ProductGridList;









