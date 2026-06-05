export interface IProduct {

  Id?: number;
  Title: string;
  ProductCode: string;
  Category: string;
  StockStatus: string;  
  Quantity: number;
  UnitPrice: number;  
  PurchaseDate: string;
  Description: string;
  // AssignedToId?: number;
  // AssignedTo?: {
  //   Id: number;
  //   Title: string;
  // };
  // ProductWebsite: string;
  // ProductImageURL: string;
  // WarrantyExpiryDate: string;
  
  IsActive: boolean;

}