import React, { useState, useEffect } from 'react';
import axios from 'axios';

const YourComponent = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [batch, setBatch] = useState('');
  const [batchExpiry, setBatchExpiry] = useState('');
  const [ptr, setPTR] = useState('');
  const [pricePerStrip, setPricePerStrip] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products when the component mounts
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/itemdec');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductChange = async (e) => {
    const selectedProductValue = e.target.value;

    // Fetch product details based on the selected product value
    try {
      const response = await axios.get(`http://localhost:5000/api/itemdec/details?productName=${selectedProductValue}`);
      const productDetails = response.data;

      // Update state variables with fetched details
      setHsnCode(productDetails.hsnCode);
      setManufacturer(productDetails.manufacturer);
      setBatch(productDetails.batchno);
      setBatchExpiry(productDetails.batchExpiry);
      setPTR(productDetails.ptr);
      setPricePerStrip(productDetails.rate);

    } catch (error) {
      console.error('Error fetching product details:', error);
    }

    // Update the selectedProduct state variable
    setSelectedProduct(selectedProductValue);
  };

  return (
    <div>
      <div className="input-container-1">
        <label htmlFor="Medicine">Product</label>
        <select
          id="productSelect"
          value={selectedProduct}
          onChange={handleProductChange}
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product._id} value={product.product}>
              {product.product}
            </option>
          ))}
        </select>
      </div>

      <div className="input-container-2">
        <label htmlFor="HSNCode">hsnCode</label>
        <input
          name="hsn"
          value={hsnCode}
          // Add any additional attributes or event handlers as needed
        />
      </div>

      <div className="input-container-1">
        <label htmlFor="Manufacturer">manufacturer</label>
        <input
          type="text"
          id="Manufacturer"
          value={manufacturer}
          // Add any additional attributes or event handlers as needed
        />
      </div>

      <div className="input-container-1">
        <label htmlFor="Batch">batchno</label>
        <input
          type="Batch"
          id="Batch"
          value={batch}
          // Add any additional attributes or event handlers as needed
        />
      </div>

      <div className="input-container-1">
        <label htmlFor="BatchExpiry">Batch Expiry</label>
        <input
          id="BatchExpiry"
          value={batchExpiry}
          // Add any additional attributes or event handlers as needed
        />
      </div>

      <div className="input-container-1">
        <label htmlFor="PTR">ptr</label>
        <input
          type="PTR"
          id="PTR"
          value={ptr}
          // Add any additional attributes or event handlers as needed
        />
      </div>

      <div className="input-container-1">
        <label htmlFor="price">Price/perStrip</label>
        <input
          id="salesRateSelect"
          value={pricePerStrip}
          // Add any additional attributes or event handlers as needed
        />
      </div>
    </div>
  );
};

export default YourComponent;
