import React, { useState, useEffect } from "react";
import Select from "react-select";
import './Itemdescription.css'
import PharmacyNav from "./PharmacyNav";
import { Refresh } from "@mui/icons-material";

const ItemDescription = () => {
  const [companyData, setCompanyData] = useState([]);
  const [taxCodeData, setTaxCodeData] = useState([]);
  const [categoriesData,setCategoriesData] = useState([]);
  const [groupsData, setGroupsData] = useState([]);
  const [schedulesData, setSchedulesData] = useState([]);
  const [drugCompositionData, setDrugCompositionData] = useState([]);
  const [hsnData, setHsnData] = useState([]);

  const [formData, setFormData] = useState({
    product: "",
    company: "",
    taxCode: "",
    category: "",
    group: "",
    schedule: "",
    drugComposition: "",
    purchaseRate: "",
    salesRate: "",   
    unit: "",
    box: "",
    unitPerBox: "",
    lotQty: "",
    lotrate: "",
    hsn: "",
    mrp: "",
    reltr: "",
    salesman: "0",
    narration: "",
    distrrate: "",
  });
  
  
const handlePrint = () => {
    const printWindow = window.open("", "_blank");
  
    printWindow.document.write("<html><head><title>Print</title>");
    printWindow.document.write(
      `<style>
        table {
          border-collapse: collapse;
          width: 60%;
          margin: 0 auto;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        .footer {
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 10px;
        }
      </style></head><body>`
    );
  
    printWindow.document.write("<table>");
    printWindow.document.write("<tr><th>Field</th><th>Value</th></tr>");
    for (const [field, value] of Object.entries(formData)) {
      printWindow.document.write(<tr><th>${field}</th><td>${value}</td></tr>);
    }
    printWindow.document.write("</table>");
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
    printWindow.document.write(<div class="footer">Printed on: ${formattedDate}</div>);
  
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData({ ...formData, [name]: selectedOption.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("Form data submitted:", formData);

    try {
      const response = await fetch("http://localhost:5000/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Form data submitted successfully");
        setFormData({ });
      } else {
        console.error("Failed to submit form data. Server returned:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/distinctCompanies");
        const data = await response.json();
  
        if (data && typeof data === "object") {
          if (
            // data.hasOwnProperty("taxCodes") &&
            // Array.isArray(data.taxCodes) &&
            data.hasOwnProperty("category") &&
            Array.isArray(data.category) 
            // data.hasOwnProperty("group") &&
            // Array.isArray(data.group) &&
            // data.hasOwnProperty("schedule") &&
            // Array.isArray(data.schedule) &&
            // data.hasOwnProperty("drugComposition") &&
            // Array.isArray(data.drugComposition)
          ) {
            // setTaxCodeData(data.taxCodes);
            setCategoriesData(data.category);
            // setGroupsData(data.group);
            // setSchedulesData(data.schedule);
            // setDrugCompositionData(data.drugComposition);
  
            setFormData({
              ...formData,
              // company: data.companies[0],
              // taxCode: data.taxCodes[0],
              category: data.category[0],
              // group: data.group[0],
              // schedule: data.schedule[0],
              // drugComposition: data.drugComposition[0],
              // hsn: data.hsn[0],
            });
          } else {
            console.error("Data received from the API is not in the expected format:", data);
          }
        } else {
          console.error("Invalid data received from the API:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/companiesAndHsncodes");
        const data = await response.json();

        if (data && typeof data === "object") {
          if (
            data.hasOwnProperty("companies") &&
            Array.isArray(data.companies) &&
            data.hasOwnProperty("hsn") &&
            Array.isArray(data.hsn)
          ) {
            setCompanyData(data.companies);
            setHsnData(data.hsn);

            setFormData({
              ...formData,
              company: data.companies[0] || '',
              hsn: data.hsn[0] || '',
            });
          } else {
            console.error("Data received from the API is not in the expected format:", data);
          }
        } else {
          console.error("Invalid data received from the API:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/distincttaxcodes");
        const data = await response.json();
  
        if (data && typeof data === "object") {
          if (
            data.hasOwnProperty("taxCodes") &&
            Array.isArray(data.taxCodes) &&
            data.hasOwnProperty("group") &&
            Array.isArray(data.group) &&
            data.hasOwnProperty("schedule") &&
            Array.isArray(data.schedule)
          ) {
            setTaxCodeData(data.taxCodes);
            setGroupsData(data.group);
            setSchedulesData(data.schedule);
  
            setFormData({
              ...formData,
              taxCode: data.taxCodes[0],
              group: data.group[0],
              schedule: data.schedule[0],
            });
          } else {
            console.error("Data received from the API is not in the expected format:", data);
          }
        } else {
          console.error("Invalid data received from the API:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/distinctdrug");
        const data = await response.json();
  
        if (data && typeof data === "object") {
          if (
            data.hasOwnProperty("drugComposition") &&
            Array.isArray(data.drugComposition)
          ) {
            setDrugCompositionData(data.drugComposition);
  
            setFormData({
              ...formData,
              drugComposition: data.drugComposition[0],
            });
          } else {
            
            console.error("Data received from the API is not in the expected format:", data);
          }
        } else {
          console.error("Invalid data received from the API:", data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);
  
  

 
  return (
    <>
    <PharmacyNav />
    <div  className="item-description-total">
    <form className="item-form-container" onSubmit={handleSubmit}>
    <div className="item-content">
    <div className="item-form-left">
    
      <label className="label-product">
        Product:
        <input
        className="item-pro-in"
          type="text"
          name="product"    
          value={formData.product}
          onChange={handleInputChange}
        />
      </label>
      <div  className="item-company-name">
         <label className="label">Company:</label>
        <Select className="item-company-1"
          name="company"
          value={{ label: formData.company, value: formData.companyData }}
          options={companyData.map((company) => ({
            label: company,
            value: company,
          }))}
          onChange={(selectedOption) =>
            handleSelectChange("company", selectedOption)
          }
        />
        
         
      <label className="item-label-sec">
        Selected Company: 
        <input
        className="input-selec-c"
          type="text"
          name="selectedCompany"
          value={formData.selectedCompany}
          onChange={handleInputChange}
          
        />
     </label>
      </div>
      <div  className="item-company-name">
      <label className="tax-c-label">Tax Code:</label>
        <Select
          className="tax-code-selec"
          name="taxCode"
          value={{ label: formData.taxCode, value: formData.taxCodeData }}
          options={taxCodeData.map((taxCode) => ({
            label: taxCode,
            value: taxCode,
          }))}
          onChange={(selectedOption) =>
            handleSelectChange("taxCode", selectedOption)
          }
        />
     

      {/* <label className="item-cat-label">Category:</label>
        <Select
        className="item-cat-sele"
          name="category"
          value={{ label: formData.category, value: formData.category }}
          options={categoriesData.map((category) => ({
            label: category,
            value: category,
          }))}
          onChange={(selectedOption) =>
            handleSelectChange("category", selectedOption)
          }
        /> */}
    
    </div>

    <div  className="item-company-name">
      <label className="label">Group:</label>
        <Select
        className="item-group-selc-group"
          name="group"
          value={{ label: formData.group, value: formData.group }}
          options={groupsData.map((group) => ({ label: group, value: group }))}
          onChange={(selectedOption) =>
            handleSelectChange("group", selectedOption)
          }
        />
   
     
      <label className="item-schedu-label1">Schedule:</label>
        <Select
        className="item-shedu-sele1"
          name="schedule"
          value={{ label: formData.schedule, value: formData.schedule }}
          options={schedulesData.map((schedule) => ({
            label: schedule,
            value: schedule,
          }))}
          onChange={(selectedOption) =>
            handleSelectChange("schedule", selectedOption)
          }
        />
   
</div>
    <div className="merge-product-sale">
      <fieldset  className="filed-sets">
        <legend className="item-legends" >Purchase</legend>
        <label className="label"> PTR:
          <input
           className="item-sales-mrp"
            type="number"
            name="purchaseRate"
            value={formData.purchaseRate}
            onChange={handleInputChange}
          />
        </label>
      </fieldset>
      <fieldset  className="filed-sets">
        <legend className="item-legends">Sales</legend>
        <label className="label">
          Rate:
          <input
            className="item-sales-mrp"
            type="number"
            name="salesRate"
            value={formData.salesRate}
            onChange={handleInputChange}
          />
        </label>
      </fieldset>
      </div>
      <fieldset className="filed-sets">
        <legend  className="item-legends">Packing</legend>
        <div className="lot-merge">
        <label className="label">
          PerStrip:
          <input
           className="item-pack-mrp"
            type="number"
            name="unit"
            value={formData.unit}
            onChange={handleInputChange}
          />
        </label>
        {/* <label className="item-pack-trel-label">
          Box:
          <input
           className="item-pack-mrp"
            type="number"
            name="box"
            value={formData.box}
            onChange={handleInputChange}
          />
        </label>
        <label className="item-pack-trel-label">
          Unit/Box:
          <input
           className="item-pack-mrp"
            type="number"
            name="unitPerBox"
            value={formData.unitPerBox}
            onChange={handleInputChange}
          />
        </label> */}
        </div>
      </fieldset>

      <fieldset  className="filed-sets">
        <legend  className="item-legends">Lot</legend>
        <div className="lot-merge">
        <label className="label">
          Lot Qty:
          <input
          className="item-lot-mrp"
            type="number"
            name="lotQty"
            value={formData.lotQty}
            onChange={handleInputChange}
          />
        </label>
        <label className="item-lot-trel-label">
          Lot Rate:
          <input
          className="item-lot-mrp"
            type="number"
            name="lotrate"
            value={formData.lotrate}
            onChange={handleInputChange}
          />
        </label>
        </div>
      </fieldset>

      {/* <fieldset  className="filed-sets">
        <legend className="item-legends">Other Rates</legend>
        <label className="item-mrp-label ">
          M.R.P.:
          <input
          className="item-or-mrp"
            type="number"
            name="mrp"
            value={formData.mrp}
            onChange={handleInputChange}
          />
        </label>
        <label className="item-or-trel-label">
          To Reltr (Occ):
          <input
          className="item-or-mrp"
            type="number"
            name="reltr"
            value={formData.reltr}
            onChange={handleInputChange}
          />
        </label>
        <label className="item-or-trel-label">
            Salesman:
          <input
          className="item-or-mrp"
            type="number"
            name="salesman"
            value={formData.salesman}
            onChange={handleInputChange}
          />
        </label>
      </fieldset> */}
       <div  className="item-hsn-div">
      <label className="label"> HSN Code:    </label>
        <Select
        className="item-hsn-selec"
          name="hsn"
          value={{ label: formData.hsn, value: formData.hsn }}
          options={hsnData.map((hsn) => ({ label: hsn, value: hsn }))}
          onChange={(selectedOption) =>
            handleSelectChange("hsn", selectedOption)
          }
        />
 

              {/* <button  className="item-hsn-button">Hsn</button> */}
     
      </div>

      <label className="item-narr-label-narr">
        Narration :  </label>
        <input
          className="item-narr-input-narr"
          type="text"
          name="narration"
          value={formData.narration}
          onChange={handleInputChange}
        />

      <div  className="item-hsn-div">
      <label className="label">
        Drug Composition:     </label>
        <Select
         className="item-drug-selec"
          name="drugComposition"
          value={{
            label: formData.drugComposition,
            value: formData.drugComposition,
          }}
          options={drugCompositionData.map((drugComposition) => ({
            label: drugComposition,
            value: drugComposition,
          }))}
          onChange={(selectedOption) =>
            handleSelectChange("drugComposition", selectedOption)
          }
        />
  

      <label className="item-narr-label">
        Distr. Rate:
        <input
         className="item-narr-input"   
          type="number"
          name="distrrate"
          value={formData.distrrate}
          onChange={handleInputChange}
        />
      </label>
</div>
      <button type="submit" className="item-submit-button">
        Submit
      </button>
      {/* <button  onClick={handlePrint} className="item-submit-button">Print</button> */}
      </div>
      <div  className="item-form-right">
             <button>Add</button>
             <button>Edit</button>
             <button>Cancel</button>
             <button>Search</button>
             <button>Delete</button>
             <button>Save</button>
             
             
             {/* <button>Exit</button> */}
      </div>
      </div>
    </form>
    </div>
    </>
  );
};

export default ItemDescription;