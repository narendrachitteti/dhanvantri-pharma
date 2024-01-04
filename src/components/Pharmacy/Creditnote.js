import React, { useEffect, useState } from "react";
import Select from "react-select";
import "./creditcard.css";
import PharmacyNav from "./PharmacyNav";
import axios from "axios";

const Note = () => {
  const [formDatas, setFormDatas] = useState({
    CrNo: "",
    CrDate: "",
    Amount: "",
    Narration: "",
  });

  const [formData, setFormData] = useState({
    DrNo: "",
    DrDate: "",
    Amount: "",
    Narration: "",
  });

  useEffect(() => {
    const fetchNewCrNo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/credit-notes/new-id");
        const nextCrNo = response.data.CrNo;

        setFormDatas((prevData) => ({ ...prevData, CrNo: nextCrNo }));
      } catch (error) {
        console.error("Error fetching new CrNo:", error);
      }
    };
    fetchNewCrNo();
  }, []);
  useEffect(() => {
    const fetchNewDrNo = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/Debit-notes/new-id");
        const nextDrNo = response.data.DrNo;

        setFormData((prevData) => ({ ...prevData, DrNo: nextDrNo }));
      } catch (error) {
        console.error("Error fetching new CrNo:", error);
      }
    };

    fetchNewDrNo();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };
  const handleChanges = (e) => {
    const { name, value } = e.target;
    setFormDatas((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/submitDebitNote",
        formData
      );

      console.log("Server response:", response.data);
      console.log("Debit Note data submitted successfully");

      // Fetch the next DR number and update the form fields
      const nextDrResponse = await axios.get("http://localhost:5000/api/Debit-notes/new-id");
      const nextDrNo = nextDrResponse.data.DrNo;

      setFormData({
        DrNo: nextDrNo,
        DrDate: "",
        Amount: "",
        Narration: "",
      });
    } catch (error) {
      console.error("Error submitting debit note data:", error);
    }
  };


  const handleSubmits = async () => {
    try {
      const submitResponse = await axios.post(
        "http://localhost:5000/api/submitCreditNote",
        formDatas
      );

      console.log("Server response:", submitResponse.data);
      console.log("Credit Note data submitted successfully");

      // Fetch the next CR number and update the form fields
      const response = await axios.get("http://localhost:5000/api/credit-notes/new-id");
      const nextCrNo = response.data.CrNo;

      setFormDatas({
        CrNo: nextCrNo,
        CrDate: "",
        Amount: "",
        Narration: "",
      });
    } catch (error) {
      console.error("Error submitting credit note data:", error);
    }
  };


  const [selectedOption, setSelectedOption] = useState("option1");
  const [selectedHeading, setSelectedHeading] = useState("Credit Note");

  const handleRadioButtonChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    setSelectedHeading(value === "option1" ? "Credit Note" : "Debit Note");
  };

  return (
    <>
      <PharmacyNav />
      <div>
        <h2 className="see">{selectedHeading}</h2>
        <fieldset className="field">
          <legend className="selected">{selectedHeading}</legend>
          <div className="shyam">
            <label>
              <input
                type="radio"
                value="option1"
                checked={selectedOption === "option1"}
                onChange={handleRadioButtonChange}
              />
              Credit Note
            </label>

            <label>
              <input
                type="radio"
                value="option2"
                checked={selectedOption === "option2"}
                onChange={handleRadioButtonChange}
              />
              Debit Note
            </label>
          </div>

          {selectedOption && (
            <div>
              {selectedOption === "option1" && (
                <p>
                  <form className="hello">
                    <div className="rows1">
                      <div className="CrNo">
                        <label className="Head">CrNo:</label>
                        <input
                          type="text"
                          name="CrNo"
                          value={formDatas.CrNo}
                          onChange={handleChanges}
                          className="numbers1"
                          disabled
                        />

                      </div>

                      <div className="CrDate">
                        <label className="Head">CrDate:</label>

                        <input
                          type="date"
                          name="CrDate"
                          value={formDatas.CrDate}
                          onChange={handleChanges}
                          className="numberss0"
                        />
                      </div>


                      <div className="Amount">
                        <label className="Head">Amount:</label>

                        <input
                          type="text"
                          name="Amount"
                          value={formDatas.Amount}
                          onChange={handleChanges}
                          className="manual1"
                        />
                      </div>


                      <div className="Narration">
                        <label className="Head">Narration:</label>

                        <textarea
                          type="text"
                          name="Narration"
                          value={formDatas.Narration}
                          onChange={handleChanges}
                          className="textareas1"
                        />
                      </div>

                      <div className="hhhh">
                        <hr className="hr"></hr>
                      </div>
                      <div>
                        <div className="columm1">
                          <button
                            type="button"
                            className="P"
                            onClick={handleSubmits}
                          >
                            Submit
                          </button>
                          {/* <button className="Prints" type="button">
                            Register
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </form>
                </p>
              )}

              {selectedOption === "option2" && (
                <p>
                  <form className="prabha">
                    <div className="rows">
                      <div className="DrNo">
                        <label className="Head">DrNo:</label>
                        <input
                          type="text"
                          name="DrNo"
                          value={formData.DrNo}
                          onChange={handleChange}
                          className="numberss"
                          disabled
                        />
                      </div>

                      <div className="DrDate">
                        <label className="Head">DrDate:</label>

                        <input
                          type="date"
                          name="DrDate"
                          value={formData.DrDate}
                          onChange={handleChange}
                          className="numberss2"
                        />
                      </div>

                      <div className="Amount">
                        <label className="Head">Amount:</label>

                        <input
                          type="text"
                          name="Amount"
                          value={formData.Amount}
                          onChange={handleChange}
                          className="numberss3"
                        />
                      </div>

                      <div className="Narration">
                        <label className="Head">Narration:</label>

                        <textarea
                          type="text"
                          name="Narration"
                          value={formData.Narration}
                          onChange={handleChange}
                          className="numberss6"
                        />
                      </div>

                      <div className="heee">
                        <hr className="hr"></hr>
                      </div>
                      <div>
                        <div className="columm">
                          <button
                            type="button"
                            className="P"
                            onClick={handleSubmit}
                          >
                            Submit
                          </button>
                          {/* 
                          <button className="Prints1" type="button">
                            Register
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </form>
                </p>
              )}
            </div>
          )}
        </fieldset>
      </div>
    </>
  );
};

export default Note;