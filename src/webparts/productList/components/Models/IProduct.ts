export interface IProduct {

  Id?: number;
  Title: string;
  ProductCode: string;
  Description: string;
  Quantity: number;
  UnitPrice: number;
  Category: string;
  PurchaseDate: string;
  // AssignedToId?: number;
  // AssignedTo?: {
  //   Id: number;
  //   Title: string;
  // };
  // ProductWebsite: string;
  // ProductImageURL: string;
  // WarrantyExpiryDate: string;
  StockStatus: string;
  IsActive: boolean;

}