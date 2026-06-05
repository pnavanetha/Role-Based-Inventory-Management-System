import {  SPFI } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';


import { IProduct } from '../Models/IProduct';

export default class ProductService {

  private _sp: SPFI;

  constructor(sp: SPFI) {
    this._sp = sp;
  }

  // Get All Products
  public async getProducts(): Promise<IProduct[]> {

    try {
      return await this._sp.web.lists
        .getByTitle('ProductList')
        .items
        .select('Id','Title','ProductCode','Description','Quantity','UnitPrice','Category','PurchaseDate','StockStatus','IsActive')
        .orderBy('Id', false)();
    } catch (error) {
      console.error('Get Products Error', error);
      throw error;
    }
  }

  public async getProductById(
    id: number
  ): Promise<IProduct> {

    try {

      return await this._sp.web.lists
        .getByTitle('ProductList')
        .items
        .getById(id)
        .select('*')();

    } catch (error) {

      console.error('Get Product Error', error);

      throw error;
    }
  }

  public async addProduct(
    product: IProduct
  ): Promise<number> {

    try {

      const result = await this._sp.web.lists
        .getByTitle('ProductList')
        .items.add({

          Title: product.Title,
          ProductCode: product.ProductCode,
          Description: product.Description,
          Quantity: product.Quantity,
          UnitPrice: product.UnitPrice,
          Category: product.Category,
          PurchaseDate: product.PurchaseDate,
          StockStatus: product.StockStatus,
          IsActive: product.IsActive
        });

      return result?.data?.Id ?? 0;

    } catch (error) {

      console.error('Add Product Error', error);

      throw error;
    }
  }

  public async updateProduct(
    id: number,
    product: IProduct
  ): Promise<void> {

    try {

      await this._sp.web.lists
        .getByTitle('ProductList')
        .items
        .getById(id)
        .update({

          Title: product.Title,
          ProductCode: product.ProductCode,
          Description: product.Description,
          Quantity: product.Quantity,
          UnitPrice: product.UnitPrice,
          Category: product.Category,
          PurchaseDate: product.PurchaseDate,
          StockStatus: product.StockStatus,
          IsActive: product.IsActive
        });

    } catch (error) {

      console.error('Update Product Error', error);

      throw error;
    }
  }

  public async deleteProduct(
    id: number
  ): Promise<void> {

    try {

      await this._sp.web.lists
        .getByTitle('ProductList')
        .items
        .getById(id)
        .delete();

    } catch (error) {

      console.error('Delete Product Error', error);

      throw error;
    }
  }
}