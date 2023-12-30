import React, { useState } from "react";
import './Itemdescription.css';
import { Link } from "react-router-dom";
import PharmacyNav from "./PharmacyNav";

const ItemDescription1 = () => {
  const [formData, setFormData] = useState({
    product: "",
    company: "",
    taxCode: "",
    manufacturer: "",
    batchno: "",
    schedule: "",
    ptr: 0,
    rate: 0,
    perStrip: 0,
    hsnCode: "",
    narration: "",
    drugComposition: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/itemdec", {
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
                  className="item-pro-in"
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

              <div className="item-company-name">
                <label className="tax-c-label">GST %:</label>
                <input
                  name="taxCode"
                  value={formData.taxCode}
                  onChange={handleChange}
                >
                  {/* Options for tax code */}
                </input>

                <label className="item-narr-label">
                  Manufacturer:
                  <input
                    className="item-narr-input"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className="item-company-name">
                <label className="label">Batch No:</label>
                <input
                  name="batchno"
                  value={formData.batchno}
                  onChange={handleChange}
                >
                  {/* Options for batchno */}
                </input>

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

              <fieldset className="filed-sets">
                <legend className="item-legends">Packing</legend>
                <div className="lot-merge">
                  <label className="label">
                    PerStrip:
                    <input
                      className="item-pack-mrp"
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
                  name="hsnCode"
                  value={formData.hsnCode}
                  onChange={handleChange}
                >
                  {/* Options for HSN code */}
                </input>
              </div>

              <label className="item-narr-label-narr">Narration:</label>
              <input
                className="item-narr-input-narr"
                type="text"
                name="narration"
                value={formData.narration}
                onChange={handleChange}
              />

              <div className="item-hsn-div">
                <label className="label">Drug Composition:</label>
                <input
                  name="drugComposition"
                  value={formData.drugComposition}
                  onChange={handleChange}
                >
                  {/* Options for drug composition */}
                </input>
              </div>

              <button type="submit" className="item-submit-button">
                Submit
              </button>
            </div>

            <div className="item-form-right">
            <Link to="/itemedit">
              <button>Edit</button>
            </Link>
            <Link to="/itemedit">
              <button>Delete</button>
            </Link>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ItemDescription1;
