import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
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

    // States

    const [title, setTitle] = useState('');
    const [productCode, setProductCode] = useState('');
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const [category, setCategory] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [stockStatus, setStockStatus] = useState('');
    const [isActive, setIsActive] = useState(true);

    // Refs

    const titleRef = useRef<HTMLInputElement>(null);
    const productCodeRef = useRef<HTMLInputElement>(null);
    const descriptionRef = useRef<HTMLTextAreaElement>(null);
    const quantityRef = useRef<HTMLInputElement>(null);
    const unitPriceRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLInputElement>(null);
    const purchaseDateRef = useRef<HTMLInputElement>(null);
    const stockStatusRef = useRef<HTMLInputElement>(null);

    // Load Data For Edit

    const loadProduct = async (): Promise<void> => {

        if (!id) return;

        try {

            const product =
                await productService.getProductById(
                    Number(id)
                );

            setTitle(product.Title || '');

            setProductCode(
                product.ProductCode || ''
            );

            setDescription(product.Description || '');
            setQuantity(product.Quantity?.toString() || '');
            setUnitPrice(product.UnitPrice?.toString() || '');
            setCategory(product.Category || '');
            setPurchaseDate(product.PurchaseDate || '');
            setStockStatus(product.StockStatus || '');
            setIsActive(product.IsActive !== undefined ? product.IsActive : true);

        }
        catch (error) {

            console.error(error);

        }

    };

    useEffect(() => {

        if (id) {

            loadProduct();

        }

    }, [id]);

    // Submit

    const handleSubmit = async (): Promise<void> => {

        if (
            userRole === 'Inventory Staff'
        ) {
            toast.error(
                'You are not eligible to Add/Edit products'
            );
            return;

        }

        if (!title.trim()) {
            toast.error(
                'Product Title is required'
            );
            titleRef.current?.focus();
            return;
        }

        if (!productCode.trim()) {
            toast.error(
                'Product Code is required'
            );
            productCodeRef.current?.focus();
            return;
        }

        if (!description.trim()) {
            toast.error(
                'Description is required'
            );
            descriptionRef.current?.focus();
            return;
        }


        if (!quantity || Number(quantity) <= 0) {
            toast.error('Quantity is required');
            quantityRef.current?.focus();
            return;
        }

        if (!unitPrice || Number(unitPrice) <= 0) {
            toast.error('Unit Price is required');
            unitPriceRef.current?.focus();
            return;
        }
        if (!category) {
            toast.error('Category is required');
            categoryRef.current?.focus();
            return;
        }

        if (!purchaseDate) {
            toast.error('Purchase Date is required');
            purchaseDateRef.current?.focus();
            return;
        }

        if (!stockStatus) {
            toast.error('Please select Stock Status');
            stockStatusRef.current?.focus();
            return;
        }


        try {

            const product: IProduct = {

                Title: title,
                ProductCode: productCode,
                Description: description,
                Quantity: Number(quantity),
                UnitPrice: Number(unitPrice),
                Category: category,
                PurchaseDate: purchaseDate,
                StockStatus: stockStatus,
                IsActive: isActive

            };

            if (isEditMode) {

                await productService.updateProduct(
                    Number(id),
                    product
                );

                toast.success(
                    'Product Updated Successfully'
                );

            }
            else {

                await productService.addProduct(
                    product
                );

                toast.success(
                    'Product Added Successfully'
                );

            }

            setTimeout(() => {

                navigate('/products');

            }, 1000);

        }
        catch (error) {

            console.error(error);

            toast.error(
                'Failed To Save Product'
            );

        }

    };

    return (

        <div className="product-form-container">

            <ToastContainer position="top-right" />

            <h2>

                {isEditMode
                    ? 'Edit Product'
                    : 'Add Product'}

            </h2>

            <div className="form-group">

                <label>
                    Product Title
                    <span className="required">*</span>
                </label>

                <input
                    ref={titleRef}
                    type="text"
                    value={title}
                    onChange={(e) =>
                        setTitle(e.target.value)
                    }
                />

            </div>

            <div className="form-group">

                <label>
                    Product Code
                    <span className="required">*</span>
                </label>

                <input
                    ref={productCodeRef}
                    type="text"
                    value={productCode}
                    onChange={(e) =>
                        setProductCode(
                            e.target.value
                        )
                    }
                />

            </div>
            <div className="form-group">
                <label>
                    Description
                    <span className="required">*</span>
                </label>

                <textarea
                    ref={descriptionRef}
                    value={description}
                    onChange={(e) =>
                        setDescription(
                            e.target.value
                        )
                    }
                />
            </div>

            <div className="form-group">
                <label>
                    Quantity
                    <span className="required">*</span>
                </label>
                <input
                    ref={quantityRef}
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(
                            e.target.value
                        )
                    }
                />
            </div>
            <div className="form-group">
                <label>
                    Unit Price
                    <span className="required">*</span>
                </label>
                <input
                    ref={unitPriceRef}
                    type="number"
                    value={unitPrice}
                    onChange={(e) =>
                        setUnitPrice(
                            e.target.value
                        )
                    }
                />
            </div>
            <div className="form-group">
                <label>
                    Category
                    <span className="required">*</span>
                </label>
                <select
                    // ref={categoryRef}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Stationery">Stationery</option>
                </select>
            </div>
            <div className="form-group">
                <label>
                    Purchase Date
                    <span className="required">*</span>
                </label>
                <input
                    ref={purchaseDateRef}
                    type="date"
                    value={purchaseDate}
                    onChange={(e) =>
                        setPurchaseDate(
                            e.target.value
                        )
                    }
                />
            </div>
            <div className="form-group">
                <label>
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) =>
                            setIsActive(e.target.checked)
                        }
                    />
                    Active
                </label>
            </div>

            <div className="button-section">

                <button
                    type="button"
                    disabled={
                        userRole ===
                        'Inventory Staff'
                    }
                    onClick={handleSubmit}
                >
                    {isEditMode
                        ? 'Update'
                        : 'Submit'}
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate('/products')
                    }
                >
                    Cancel
                </button>

            </div>

        </div>

    );

};

export default ProductForm;

