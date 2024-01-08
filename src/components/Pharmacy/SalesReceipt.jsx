import React, { useState, useEffect } from 'react'
import './SalesReceipt.css'
import { MdNoteAlt } from "react-icons/md";
import Select from 'react-select';
import Navbar from './PharmacyNav';
import { BASE_URL } from "../../Services/Helper";

const SalesReceipt = () => {


  const [sortBy, setSortBy] = useState(null);
  const [dosPrint, setDosPrint] = useState(false);
  const [allAccounts, setAllAccounts] = useState(false);
  // const [bOpBills, setBOpBills] = useState('');
  // const [sInvoices, setSInvoices] = useState('');
  // const [percRet, setPercRet] = useState('');

  const [selectedDummyData, setSelectedDummyData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [formInputs, setFormInputs] = useState({
    trNo: '',
    crSl: '',
    recAmt: '',
    disAmt: '',
    chequeNo: '',
    chequeDate: '',
    intAmt: '',
    manualRecNo: '',
    date: '',
    debitAcc: '',
    dbSl: '',
    onAccAmt: '',
    bankComm: '',
    bankName: '',
    bankTown: '',
    nomitation: '',
    sortBy: '',
    dosPrint: false,
    allAccounts: false,
    bOpBills: '',
    sInvoices: '',
    percRet: '',
    slNo: '',

  });




  const printData = (dataToPrint) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write('<html><head><title>Print</title></head><body>');
    printWindow.document.write('<h1>Printed Content</h1>');


    for (const key in dataToPrint) {
      if (dataToPrint.hasOwnProperty(key)) {
        printWindow.document.write(<p>${key}: ${dataToPrint[key]}</p>);
      }
    }

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handlePrint = () => {
    const dataToPrint = {
      'Date': formInputs.date,
      'the sum of rs ': formInputs.intAmt,
      'throught cheque no': formInputs.chequeNo,
      'dated': formInputs.chequeDate,
      'Bank comm': formInputs.bankComm,
      'Manual No': formInputs.manualRecNo,
      'BillNo': formInputs.trNo,
      'BillDate': formInputs.date,

    };
    printData(dataToPrint);
  };

  // Update your handleInputChange function to handle the sortBy field
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the name is sortBy, check if the value is a valid enum value
    if (name === 'sortBy' && !['billNo', 'billDate', 'billAmt'].includes(value)) {
      console.error('Invalid value for sortBy:', value);
      setFormInputs((prevInputs) => ({
        ...prevInputs,
        [name]: 'billNo', // Set a default value ('billNo', for instance)
      }));
    } else {
      setFormInputs((prevInputs) => ({
        ...prevInputs,
        [name]: value,
      }));
    }
  };




  const handleSubmit = async () => {
    try {
      const postData = {
        formData: formInputs,
        shopData: {
          name: selectedShopData ? selectedShopData.label : '',
          tableData: tableData,

        },
      };

      const response = await fetch('${BASE_URL}/api/submitShopDetails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log('Sales receipt data submitted successfully');
        // Optionally, you can reset the form or perform other actions after successful submission
      } else {
        console.error('Failed to submit sales receipt data');
      }
    } catch (error) {
      console.error('Error submitting sales receipt data:', error);
    }
  };





  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
    setFormInputs((prevInputs) => ({
      ...prevInputs,
      sortBy: e.target.value,
    }));
  };





  const handleDosPrintChange = () => {
    setDosPrint(!dosPrint);
  };

  const handleAllAccountsChange = () => {
    setAllAccounts(!allAccounts);
  };

  const handleInputFieldChange = (e, setterFunction) => {
    setterFunction(e.target.value);
  };

  const [shopData, setShopData] = useState({
    shopId: '',
    name: '',
    slNo: '',
    series: '',
    invNo: '',
    date: '',
    amount: '',
    paid: '',
    balance: '',
    recAmt: '',
    narr: '',
    days: '',
    t: '',
    discount: '',
    sMan: '',
    ordRef: '',
    billNarr: '',
    nameOptions: [], // new state property to store name options
  });


  useEffect(() => {
    // Fetch names from the server when the component mounts
    fetch('${BASE_URL}/api/getNames')
      .then(response => response.json())
      .then(data => {
        // Set the fetched names as options
        setShopData(prevData => ({
          ...prevData,
          nameOptions: data.map(name => ({ value: name, label: name })),
        }));
      })
      .catch(error => console.error('Error fetching names:', error));
  }, []);

  const [selectedShopData, setSelectedShopData] = useState(null);

  useEffect(() => {
    // Fetch details from the server when the selected shop data changes
    if (selectedShopData) {
      fetch(`${BASE_URL}/api/getDetails?name=${selectedShopData.label}`)
        .then(response => response.json())
        .then(data => {
          // Update the tableData state with the fetched details
          setTableData(data);
        })
        .catch(error => console.error('Error fetching details:', error));
    }
  }, [selectedShopData]);


  const resetFormInputs = () => {
    setFormInputs({
      trNo: '',
      crSl: '',
      recAmt: '',
      disAmt: '',
      chequeNo: '',
      chequeDate: '',
      intAmt: '',
      manualRecNo: '',
      date: '',
      debitAcc: '',
      dbSl: '',
      onAccAmt: '',
      bankComm: '',
      bankName: '',
      bankTown: '',
      nomitation: '',
      sortBy: '',
      dosPrint: false,
      allAccounts: false,
      bOpBills: '',
      sInvoices: '',
      percRet: '',
      slNo: '',
    });
    setSortBy(null);
    setDosPrint(false);
    setAllAccounts(false);
    // setBOpBills('');
    // setSInvoices('');
    // setPercRet('');
    setSelectedDummyData(null);
  };


  const handleRefresh = () => {
    resetFormInputs();
  };


  return (
    <>
      <Navbar />
      <div className='salesreceipt-page'>


        <div className='sales-title'>
          <MdNoteAlt className='salespage-noteicon' />
          <p>Receipt for sales</p>
        </div>
        <div className='sales-header-sec'>
          <div className='sales-first-col'>
            <div className='sales-first-1-lab-inp'>
              <label>Tr No </label>
              <input type='text' name='trNo' value={formInputs.trNo} onChange={handleInputChange} />
            </div>
            <div className='sales-first-2-lab-inp'>
              <div>
                <label>Rec From </label>
              </div>
              <div>
                <Select
                  options={shopData.nameOptions}
                  value={selectedShopData}
                  onChange={selectedOption => setSelectedShopData(selectedOption)}
                  className='recform-select'
                />
              </div>
            </div>
            <div className='sales-first-3-lab-inp'>
              <label>Cr.Sl </label>
              <input type='text' name='crSl' value={formInputs.crSl} onChange={handleInputChange} />
            </div>
            <div className='sales-first-4-lab-inp'>
              <label>Rec Amt </label>
              <input type='text' name='recAmt' value={formInputs.recAmt} onChange={handleInputChange} />
            </div>
            <div className='sales-first-5-lab-inp'>
              <label>Dis Amt </label>
              <input type='text' name='disAmt' value={formInputs.disAmt} onChange={handleInputChange} />
            </div>
            <div className='sales-first-6-lab-inp'>
              <label>Cheque No </label>
              <input type='text' name='chequeNo' value={formInputs.chequeNo} onChange={handleInputChange} />
            </div>
            <div className='sales-first-7-lab-inp'>
              <label>Cheque date </label>
              <input
                type='date'
                name='chequeDate'
                value={formInputs.chequeDate}
                onChange={handleInputChange}
              />
            </div>

            <div className='sales-first-8-lab-inp'>
              <label>Int Amt </label>
              <input type='text' name='intAmt' value={formInputs.intAmt} onChange={handleInputChange} />
            </div>
            <div className='sales-first-9-lab-inp'>
              <label>Manual rec No </label>
              <input
                type='text'
                name='manualRecNo'
                value={formInputs.manualRecNo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className='sales-second-col'>
            <div className='sales-second-1-lab-inp'>
              <label>Date </label>
              <input type='date' name='date' value={formInputs.date} onChange={handleInputChange} />
            </div>
            <div className='sales-second-2-lab-inp'>
              <label>Debit A/c </label>
              <input type='text' name='debitAcc' value={formInputs.debitAcc} onChange={handleInputChange} />
            </div>
            <div className='sales-second-3-lab-inp'>
              <label>Db SL </label>
              <input type='text' name='dbSl' value={formInputs.dbSl} onChange={handleInputChange} />
            </div>
            <div className='sales-second-4-lab-inp'>
              <label>On Acc Amt </label>
              <input type='text' name='onAccAmt' value={formInputs.onAccAmt} onChange={handleInputChange} />
            </div>
            <div className='sales-second-5-lab-inp'>
              <label>Bank Comm </label>
              <input type='text' name='bankComm' value={formInputs.bankComm} onChange={handleInputChange} />
            </div>
            <div className='sales-second-6-lab-inp'>
              <label>Bank Name </label>
              <input type='text' name='bankName' value={formInputs.bankName} onChange={handleInputChange} />
            </div>
            <div className='sales-second-7-lab-inp'>
              <label>Bank Town </label>
              <input type='text' name='bankTown' value={formInputs.bankTown} onChange={handleInputChange} />
            </div>
            <div className='sales-second-8-lab-inp'>
              <label>Nomination </label>
              <input type='text' name='nomitation' value={formInputs.nomitation} onChange={handleInputChange} />
            </div>
          </div>
          <div className='sales-third-col'>
            <fieldset className='sales-fieldset'>
              <legend>Sort By</legend>
              <div className='sales-third-sec-btn1'>
                <input
                  className='radionodesd'
                  type='radio'
                  value='billNo'
                  checked={sortBy === 'billNo'}
                  onChange={handleSortByChange}
                />
                <label className='sales-third-sec-btn1-lable'>Bill No</label>
              </div>
              <div className='sales-third-sec-btn2'>
                <input
                  type='radio'
                  value='billDate'
                  className='salesradiosandcheck'
                  checked={sortBy === 'billDate'}
                  onChange={handleSortByChange}
                />
                <label className='sales-third-sec-btn1-lable'>Bill Date</label>
              </div>
              <div className='sales-third-sec-btn3'>
                <input
                  className='salesradiosandcheck'
                  type='radio'
                  value='billAmt'
                  checked={sortBy === 'billAmt'}
                  onChange={handleSortByChange}
                />
                <label className='sales-third-sec-btn1-lable'>Bill Amt</label>
              </div>
            </fieldset>
            <div className='sales-third-ck1'>
              <input
                className='checkboxsales'
                type='checkbox'
                checked={dosPrint}
                onChange={handleDosPrintChange}
              />
              <label className='sales-third-sec-btn1-lable'>DOS Print</label>
            </div>
            <div className='sales-third-ck2'>
              <input
                className='salesradiosandcheck'
                type='checkbox'
                checked={allAccounts}
                onChange={handleAllAccountsChange}
              />
              <label className='sales-third-sec-btn1-lable'>All Accounts</label>
            </div>
            {/* <div className='sales-third-inps'>
            <input
              type='text'
              placeholder='>> B Op Bills'
              className='salesx'
              value={bOpBills}
              onChange={(e) => handleInputFieldChange(e, setBOpBills)}
            />
            <input
              type='text'
              placeholder='>> S Invoices'
              value={sInvoices}
              onChange={(e) => handleInputFieldChange(e, setSInvoices)}
            />
            <input
              type='text'
              placeholder='>> Q perc.Ret'
              value={percRet}
              onChange={(e) => handleInputFieldChange(e, setPercRet)}
            />
          </div> */}
          </div>
          <div className='sales-forth-col'>
            <button>Old Bill</button>
            <button>Auto Adjust</button>
            <button>Edit</button>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleRefresh}>Refresh</button>
            <button onClick={handlePrint} >Print</button>
            <button>Delete Ete</button>
            <button>Exit</button>
          </div>
        </div>

        <table className='sales-receipt-table'>
          <thead>
            <tr>
              <th>Sl No</th>
              <th>Series</th>
              <th>Inv No</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Balance</th>
              <th>Rec Amt</th>
              <th>Narr</th>
              <th>Days</th>
              <th>T</th>
              <th>Discount</th>
              <th>S.Man</th>
              <th>Ord.Ref</th>
              <th>Bill Narr</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.slNo}>
                <td>{row.slNo}</td>
                <td>{row.series}</td>
                <td>{row.invNo}</td>
                <td>{row.date}</td>
                <td>{row.amount}</td>
                <td>{row.paid}</td>
                <td>{row.balance}</td>
                <td>{row.recAmt}</td>
                <td>{row.narr}</td>
                <td>{row.days}</td>
                <td>{row.t}</td>
                <td>{row.discount}</td>
                <td>{row.sMan}</td>
                <td>{row.ordRef}</td>
                <td>{row.billNarr}</td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </>
  );
};


export default SalesReceipt