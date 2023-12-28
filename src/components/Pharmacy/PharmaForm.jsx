//this is for the Drug Composition
import React, { useState, useEffect } from 'react';
import './PharmaForm.css';

const PharmaForm = ({ selectedService, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        DrugCompoId:'',
        testName: '',
     
    });

    useEffect(() => {
        if (selectedService) {
          setFormData({
            DrugCompoId: selectedService.DrugCompoId,
            testName: selectedService.testName,
          });
        } else {
          setFormData({
            DrugCompoId: '',
            testName: '',
          });
        }
      }, [selectedService]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // This will send the updated form data to update or add to MongoDB
      };

    return (
        <div className="popup-overlay_5">
            <div className="popup-content_5">
                <h2>{selectedService ? 'Edit Composition' : 'Add Composition '}</h2>
                <form onSubmit={handleSubmit} className="popup-form_5">
                <div className="popup-input_5">
                        <label> Product Composition:</label>
                        <input
                            type="text"
                            name="DrugCompoId"
                            value={formData.DrugCompoId}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="popup-input_5">
                        <label>product Name:</label>
                        <input
                            type="text"
                            name="testName"
                            value={formData.testName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="button-group_5">
                        <button className="popup-button_5" type="submit">{selectedService ? 'Update' : 'Add'}</button>
                        <button className="popup-button_5" type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PharmaForm;