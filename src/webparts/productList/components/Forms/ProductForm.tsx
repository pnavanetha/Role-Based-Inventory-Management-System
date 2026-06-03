import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import '../CSS/ProductForm.css';

import ProductService from '../Services/ProductService';
import { IProduct } from '../Models/IProduct';

interface IProductFormProps {
    productService: ProductService;
    userRole: string;
}

const ProductForm: React.FC<IProductFormProps> = ({
    productService,
    userRole
}) => {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        Title: '',
        ProductCode: '',
        Description: '',
        Quantity: '',
        UnitPrice: '',
        Category: '',
        PurchaseDate: '',
        StockStatus: '',
        IsActive: true
    });

    useEffect(() => {
        
        const loadProduct = async (): Promise<void> => {
            if (!id) return;            
            try {

                const product =
                    await productService.getProductById(
                        Number(id)
                    );

                setFormData({
                    Title: product.Title || '',
                    ProductCode: product.ProductCode || '',
                    Description: product.Description || '',
                    Quantity: product.Quantity?.toString() || '',
                    UnitPrice: product.UnitPrice?.toString() || '',
                    Category: product.Category || '',
                    PurchaseDate: product.PurchaseDate || '',
                    StockStatus: product.StockStatus || '',
                    IsActive: product.IsActive ?? true
                });

            } catch (error) {

                console.error(error);
                toast.error('Failed to load product');

            }
        };

        loadProduct();

    }, [id]);

    const titleRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const unitPriceRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLSelectElement>(null);
    const purchaseDateRef = useRef<HTMLInputElement>(null);
    const stockStatusRef = useRef<HTMLSelectElement>(null);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ): void => {

        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]:
                type === 'checkbox'
                    ? (e.target as HTMLInputElement).checked
                    : value
        }));
    };

    const validateForm = (): boolean => {

        if (!formData.Title.trim()) {
            toast.error('Product Title is required');
            titleRef.current?.focus();
            return false;
        }

        if (!formData.ProductCode.trim()) {
            toast.error('Product Code is required');
            productCodeRef.current?.focus();
            return false;
        }
        
        if (
            !formData.Quantity ||
            Number(formData.Quantity) <= 0
        ) {
            toast.error('Quantity must be greater than 0');
            quantityRef.current?.focus();
            return false;
        }

        if (
            !formData.UnitPrice ||
            Number(formData.UnitPrice) <= 0
        ) {
            toast.error('Unit Price must be greater than 0');
            unitPriceRef.current?.focus();
            return false;
        }

        if (!formData.Category) {
            toast.error('Category is required');
            categoryRef.current?.focus();
            return false;
        }

        if (!formData.PurchaseDate) {
            toast.error('Purchase Date is required');
            purchaseDateRef.current?.focus();
            return false;
        }

        if (!formData.StockStatus) {
            toast.error('Stock Status is required');
            stockStatusRef.current?.focus();
            return false;
        }
        if (!formData.Description.trim()) {
            toast.error('Description is required');
            descriptionRef.current?.focus();
            return false;
        }


        return true;
    };

    const handleSubmit = async (): Promise<void> => {

        if (userRole === 'Inventory Staff') {

            toast.error(
                'You are not eligible to Add/Edit products'
            );

            return;
        }

        if (!validateForm()) return;

        try {

            const product: IProduct = {

                Title: formData.Title,
                ProductCode: formData.ProductCode,
                Description: formData.Description,
                Quantity: Number(formData.Quantity),
                UnitPrice: Number(formData.UnitPrice),
                Category: formData.Category, 
                PurchaseDate: formData.PurchaseDate,
                StockStatus: formData.StockStatus,
                IsActive: formData.IsActive

            };

            if (isEditMode) {

                await productService.updateProduct(
                    Number(id),
                    product
                );

            } else {

                await productService.addProduct(
                    product
                );

            }

            toast.success(
                isEditMode
                    ? 'Product Updated Successfully'
                    : 'Product Added Successfully'
            );

            setTimeout(() => {

                navigate('/products');

            }, 1000);

        } catch (error) {

            console.error(error);

            toast.error(
                'Failed To Save Product'
            );

        }
    };

   

    return (
        <div className="product-form-container">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />
            <div className="form-header">
                <div className="header-title">Product Management</div>

                {/* <div className="header-required">
                    <span>*</span> indicates a required field
                </div> */}
            </div>
            <div className="product-grid">
                <div className="form-group">
                    <label>Product Title<span className="required">*</span></label>
                    <input type="text" name="Title" ref={titleRef} value={formData.Title} onChange={handleChange}/> </div>
                <div className="form-group">
                    <label>Product Code<span className="required">*</span></label>  
                    <input type="text" name="ProductCode" ref={productCodeRef} value={formData.ProductCode} onChange={handleChange}/></div>
                <div className="form-group">
                    <label>Category<span className="required">*</span></label>    
                    <select name="Category" ref={categoryRef} value={formData.Category} onChange={handleChange} >                        
                        <option value="">Select Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Stationery">Stationery</option>
                    </select>

                </div>
                <div className="form-group">
                    <label>Stock Status<span className="required">*</span></label>
                    <select name="StockStatus" ref={stockStatusRef}  value={formData.StockStatus} onChange={handleChange} >                  
                        <option value="">Select Status</option>
                        <option value="Available">Available</option>
                        <option value="LowStock">Low Stock</option>
                        <option value="Out Of Stock">Out Of Stock</option>
                        <option value="Damaged">Damaged</option>
                    </select>
                </div>  
                <div className="form-group">
                    <label>Quantity<span className="required">*</span></label>
                    <input type="number" name="Quantity" ref={quantityRef} value={formData.Quantity} onChange={handleChange}/> 
                </div>

                <div className="form-group">
                    <label>Unit Price <span className="required">*</span></label>
                    <input type="number" name="UnitPrice" ref={unitPriceRef} value={formData.UnitPrice} onChange={handleChange}/>              
                </div>  
                <div className="form-group">
                    <label> Purchase Date<span className="required">*</span></label>
                    <input type="date" name="PurchaseDate" value={formData.PurchaseDate} ref={purchaseDateRef} onChange={handleChange}/>
                </div>
                <div className="form-group active-group">
                    <label>Active </label>
                    <input type="checkbox" name="IsActive" checked={formData.IsActive} onChange={handleChange} />
                </div>

            </div>
            <div className="description-section">
                <label>Description <span className="required">*</span></label>
                <textarea name="Description" value={formData.Description} ref={descriptionRef} onChange={handleChange}/>
            </div>      
            <div className="button-section">
                <button type="button" className="btn-submit" disabled={userRole === 'Inventory Staff'} onClick={handleSubmit}>
                    {isEditMode ? 'Update': 'Submit'}</button>
                <button type="button" className="btn-cancel" onClick={() =>navigate('/products')}>Cancel</button>
            </div>
        </div>
    );
};
export default ProductForm;

