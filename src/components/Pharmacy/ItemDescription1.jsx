import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import './Itemdescription.css';
import { Link } from "react-router-dom";
import PharmacyNav from "./PharmacyNav";

import { Form, Button } from "react-bootstrap";
import { BASE_URL } from "../../Services/Helper";

const ItemDescription1 = () => {
  const [formData, setFormData] = useState({
    product: "",
    company: "",
    Gst: "",
    manufacturer: "",
    batchno: "",
    schedule: "",
    ptr: 0,
    rate: 0,
    perStrip: 0,
    hsnCode: "",
    narration: "",
    drugComposition: "",
    expiryDate: new Date(),
  });

  const handleDateChange = (date) => {
    setFormData({ ...formData, expiryDate: date });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/itemdec`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        // Optional: Add logic for successful submission
        console.log("Item saved successfully");
      } else {
        // Optional: Add logic for unsuccessful submission
        console.error("Error saving item:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <PharmacyNav />
      <div className="item-description-total">
        <form className="item-form-container" onSubmit={handleSubmit}>
          <div className="item-content">
            <div className="item-form-left">
              <label className="label-product">
                Product:
                <input
                  className="tax-input001"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                />
              </label>

              {/* <div className="item-company-name">
                <label className="label">Company:</label>
                <input
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                >
                 
                </input>
              </div> */}


              <div className="item-expiry-date">
                <Form.Group controlId="expiryDate">
                  <Form.Label>Expiry Date:</Form.Label>
                  <Form.Control
                    type="date"
                    className="from-control"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              <div className="item-company-name">
                <label className="tax-c-label">GST %:</label>
                <input
                  className="tax-input001"
                  name="Gst"
                  value={formData.Gst}
                  onChange={handleChange}
                >
                  {/* Options for tax code */}
                </input>

                <label className="item-narr-label">
                  Manufacturer:
                  <input
                    className="tax-input001"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="item-company-name">
                {/* <label className="label">Batch No:</label>
                <input
                  className="batch-input09"
                  name="batchno"
                  value={formData.batchno}
                  onChange={handleChange}
                >
                </input> */}

                <label className="item-schedu-label1">Schedule:</label>
                <select
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleChange}
                  className="item-shedu-sele1"
                >
                  <option value="">Select Schedule</option>
                  <option value="C">C</option>
                  <option value="C1">C1</option>
                  <option value="X">X</option>
                  <option value="X1">X1</option>

                  {/* Add more options as needed */}
                </select>

              </div>

              <div className="merge-product-sale">
                <fieldset className="filed-sets">
                  <legend className="item-legends">Purchase</legend>
                  <label className="label">
                    PTR:
                    <input
                      className="item-sales-mrp"
                      type="number"
                      name="ptr"
                      value={formData.ptr}
                      onChange={handleChange}
                    />
                  </label>
                </fieldset>
                <fieldset className="filed-sets">
                  <legend className="item-legends">Sales</legend>
                  <label className="label">
                    Rate:
                    <input
                      className="item-sales-mrp"
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                    />
                  </label>
                </fieldset>
              </div>

              <fieldset className="filed-sets009">
                <legend className="item-legends">Packing</legend>
                <div className="lot-merge">
                  <label className="label">
                    PerStrip:
                    <input
                      className="item-pack-mrp001"
                      type="number"
                      name="perStrip"
                      value={formData.perStrip}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </fieldset>

              <div className="item-hsn-div">
                <label className="label">HSN Code:</label>
                <input
                  className="hsn-ode"
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleChange}
                >
                  {/* Options for HSN code */}
                </input>
              </div>

              <label className="item-narr-label-narr">Narration:</label>
              <input
                className="tax-input001"
                type="text"
                name="narration"
                value={formData.narration}
                onChange={handleChange}
              />

              <div className="item-hsn-div">
                <label className="label">Drug Composition:</label>
                <input
                  className="drug-comp"
                  name="drugComposition"
                  value={formData.drugComposition}
                  onChange={handleChange}
                >
                  {/* Options for drug composition */}
                </input>
              </div>
              <div className="item-submit-button009">
                <button type="submit" className="item-submit-button">
                  Submit
                </button>

                <div className="item-form-right">
                  <Link to="/itemedit">
                    <button className="edit-btn">Edit</button>
                  </Link>
                </div>
                <div className="del-bts0090">
                  <Link to="/itemedit">
                    <button className="del-bts009">Delete</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ItemDescription1;
