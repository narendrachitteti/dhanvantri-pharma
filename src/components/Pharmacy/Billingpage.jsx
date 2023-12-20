import React, { useState, useEffect } from 'react';
import "./Billingpage.css";
import logo from "./logo.png"
import QRCode from 'qrcode.react';

const Billingpage = () => {

  
  const tableData1 = [
    { label: 'Invoice NO:', value: 'INV123' },
    { label: 'Invoice Date:', value: '2023-11-30' },
    { label: 'Invoice Time:', value: '12:30 PM' },
    { label: 'P.O NO:', value: 'PO5678' },
    { label: 'Despatch through:', value: 'Courier' },
    { label: 'NO. Of Cases:', value: '10' },
    { label: 'Transport:', value: 'ABC Transport' },
    { label: 'E-way Bill No:', value: 'EWB9876' },
  ];
  const [tableData] = useState([
    {
      MedicineName: '', 
    },   
  ]);

  const [subtotal, setSubtotal] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [accountname1, setAccountName1] = useState('John Doe');
  const [Bankname1, setBankName1] = useState('Sample Bank');
  const [Accountno1, setAccountNo1] = useState('1234567890');
  const [IFSCCode1, setIFSCCode1] = useState('ABC0987654');
  const [Subtotal34, setSubtotal34] = useState(0);
  const [gst1, setGst1] = useState(5);
  const [gst2, setGst2] = useState(12);
  const [gst3, setGst3] = useState(18);
  const [gst4, setGst4] = useState(28);
  const [gst5, setGst5] = useState(35);
  const [sgstTotal, setSgstTotal] = useState(50);
  const [cgstTotal, setCgstTotal] = useState(100);
  const [totalAmount5, setTotalAmount5] = useState(234);
  const [discount1, setdiscount1] = useState(35);
  const [gstpayable, setgstpayable] = useState(35);
  const [crdrnote, setcrdrnote] = useState(35);
  const [nettotal, setnettotal] = useState(35);
  const [roundoff, setroundoff] = useState(35);


  useEffect(() => {
    let sub = 0;
    let items = 0;
    let qty = 0;

    tableData.forEach((item) => {
      sub += item.subtotal || 0;
      items += 1; // Increment for each item in the array
      qty += item.qty || 0;
    });

    setSubtotal(sub);
    setTotalItems(items);
    setTotalQty(qty);
    setSubtotal34(sub);
    setGst1(5);
    setGst2(12);
    setGst3(18);
    setGst4(28);
    setGst5(35);
    setSgstTotal(1000);
    setCgstTotal(1200);
    setTotalAmount5(76543);
    setroundoff(65);
    setnettotal(65);
    setcrdrnote(43);
    setgstpayable(22);
    setdiscount1(12);
  }, [tableData]);

  return (
    <div className='maincont55553'>
 <header className="tax-invoice">TAX INVOICE</header>
<div className='headingcont32'>
  <div className='headingcont331one'>
  <p>
          <img  style={{height:'70px',width:'70px'}}src={logo} alt=''/> <strong>DV ASSOCIATES</strong><br/>
        
            NO-65, shop.1, 1st Floor, 1st E Cross, <br />
         Remco Layout,Hampinagar,Next to Iyenger <br />
            Bakery, Vijayanagar, Banglore-560-040
          </p>
  </div>
  <div className='headingcont332two'>
  <p>
            phone: 080-23309513, 9448079513 <br />
            Email: dvassociatedv@gmail.com <br />
            URL: www.Dvspecialities.com
          </p>
  </div>
  <div className='headingcont333three'>
  <p>
      DL:NO: KA/41/42/21B/226085/226086 <br />
      GSTIN: 29ALUPL3307J1ZM <br />
            <small style={{color:'blue'}}>
            WHO  GDP  <br/>
            ISO  9001:2015 /ISO  10002:2014 
            </small>
          </p>
  </div>
  <div className='headingcont334four'>
  <p>
          <img  style={{height:'70px',width:'70px'}}src={logo} alt=''/> <strong>DV ASSOCIATES</strong><br/>
        
            NO-65, shop.1, 1st Floor, 1st E Cross, <br />
         Remco Layout,Hampinagar,Next to Iyenger <br />
            Bakery, Vijayanagar, Banglore-560-040
          </p>
  </div>

  
      </div>

      <div className='headerbodymain1one'>
     
              <div className='headerbodycont1one'>
              <header className='headermaincont'>To:</header>
              <small>DHANANTRI PHARMA</small> <br/>
        #16,Ground Floor,!st Main Road <br/>
        CLUB ROAD Vijayanagar 2nd Stage<br/>
        Banglore:560104<br/>
        Phone No:9538164311 <br/>
        GSTIN :29EFN516H1LX                  
              </div>
              <div className='headerbodycont2two'>
              <QRCode value="Your QR Code Data Here" />
              </div>
              <div className='headerbodycont3three'>
              <table className='tableheader334'>
              <thead>
                {tableData1.map((item, index) => (
                  <tr key={index} className="table-invoice1">
                    <td>{item.label}</td>
                    <td>{item.value}</td>
                  </tr>
                ))}
              </thead>
            </table>
              </div>
              <div className='headerbodycont4four'>
              <small>DHANANTRI PHARMA</small> <br/>
        #16,Ground Floor,!st Main Road <br/>
        CLUB ROAD Vijayanagar 2nd Stage<br/>
        Banglore:560104<br/>
        Phone No:9538164311 <br/>
        GSTIN :29EFN516H1LX
              </div>
      </div>

    <div className='tablecoo723'>
      <table className='table0087' border="1">
        <thead className='threadtable87'>
          <tr className='trbilling87'>
            <th className='thbilling87'>MFD</th>
            <th className='thbilling87'>Qty</th>
            <th className='thbilling87'>Free</th>
            <th className='thbilling87'>Pack</th>
            <th className='thbilling87'>Description</th>
            <th className='thbilling87'>Batch</th>
            <th className='thbilling87'>Exp</th>
            <th className='thbilling87'>HSN</th>
            <th className='thbilling87'>Rate</th>
            <th className='thbilling87'>Value</th>
            <th className='thbilling87'>Discount</th>
            <th className='thbilling87'>MRP</th>
            <th className='thbilling87' colSpan="2">GST (SGST/CGST)</th>
          </tr>
        </thead>
        <tbody className='tbodybilling87'>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td className='tdbilling877'>{item.mfd}</td>
              <td className='tdbilling877'>{item.qty}</td>
              <td className='tdbilling877'>{item.free}</td>
              <td className='tdbilling877'>{item.pack}</td>
              <td className='tdbilling877'>
                  <input
                    className='inputbilling87'
                    placeholder='Medicine Name'
                    name='MedicineName'
                    value={item.MedicineName}
                  />
                </td>



              <td className='tdbilling877'>{item.batch}</td>
              <td className='tdbilling877'>{item.exp}</td>
              <td className='tdbilling877'>{item.hsn}</td>
              <td className='tdbilling877'>{item.rate}</td>
              <td className='tdbilling877'>{item.value}</td>
              <td className='tdbilling877'>{item.discount}</td>
              <td className='tdbilling877'>{item.mrp}</td>
              <td className='tdbilling877'>{item.sgst}</td>
              <td className='tdbilling877'>{item.cgst}</td>
            </tr>
          ))}
        </tbody>




        <thead>
          <tr className='trbilling87'>
            <th className='thbilling87'>CLASS</th>
            <th className='thbilling87'>SUB TOTAL</th>
            <th className='thbilling87'>SGST</th>
            <th className='thbilling87'>CGST</th>
            <th className='thbilling87'>TOTAL</th>
            <th className='thbilling87'>SUB TOTAL</th>
            <th className='thbilling87' colSpan="2"></th>
            <th className='thbilling87'>
              <tr>Total item: </tr>
              <tr>Total Qty:</tr>
            </th>
            <th className='thbilling87' colSpan="5">
            <tr>{totalItems}</tr>
            <tr> {totalQty}</tr>
            </th>

          </tr>
        </thead>
        <tbody className='tbodybilling87'>
            <tr>
              <td className='tdbilling877'>
              <tr className='trbilling87'>GST 5%</tr>
              <tr className='trbilling87'>GST 12%</tr>
              <tr className='trbilling87'>GST 18%</tr>
              <tr className='trbilling87'>GST 28% </tr>
              <tr className='trbilling87'>Completed</tr>

              </td>


              <td className='tdbilling877'>
              <tr className='trbilling87'>{gst1}</tr>
              <tr className='trbilling87'>{gst2}</tr>
              <tr className='trbilling87'>{gst3}</tr>
              <tr className='trbilling87'>{gst4}</tr>
              <tr className='trbilling87'>{gst5}</tr>
              </td>
              <td className='tdbilling877'>{sgstTotal}</td>
<td className='tdbilling877'>{cgstTotal}</td>
<td className='tdbilling877'>{totalAmount5}</td>



              <td className='tdbilling877'>
              <tr className='trbilling87'>DISCOUNT </tr>
              <tr className='trbilling87'>GST PAYABLE</tr>
              <tr className='trbilling87'>CR/DR NOTE</tr>
              <tr className='trbilling87'>NET TOTAL</tr>
              <tr className='trbilling87'>ROUND OFF</tr>

              </td>
              <td className='tdbilling877' colSpan="2">
              <tr className='trbilling87'>{discount1}</tr>
              <tr className='trbilling87'>{gstpayable}</tr>
              <tr className='trbilling87'>{crdrnote}</tr>
              <tr className='trbilling87'>{nettotal}</tr>
              <tr className='trbilling87'>{roundoff}</tr>

              </td>
              <td className='tdbilling877' colSpan="6">
              <tr className='trbilling87'>Account Name: {accountname1}</tr>
              <tr className='trbilling87'>Bank: {Bankname1}</tr>
              <tr className='trbilling87'>Account No: {Accountno1}</tr>
              <tr className='trbilling87'>IFSC Code: {IFSCCode1}</tr>
            </td>
            </tr>
        </tbody>
        <tbody>
        <td className='tdbilling877' colSpan="5">  </td>

        <td className='tdbilling877'>SUB TOTAL</td>
        <td className='tdbilling877' colSpan="2"> {Subtotal34}</td>



        </tbody>
      </table>
    </div>


    <div className='footermaincont'>
      <div className='footer1cont'>

                   <p><strong>Terms & Conditions:</strong></p>
                   <p>"Payment is due upon receipt of the invoice. Refunds or exchanges are only applicable for damaged or defective goods within 7 days of receipt. For further inquiries, please contact our customer service."</p>
      </div>
      <div className='footer2cont'>
                               {/* <p style={{textAlign: 'center'}}>  */}
                               <p>
                               <strong style={{height:'20px',width:'80px', color: 'white', textAlign: 'center'}}>
                               Hospital Name: ABC Medical Center
                               Phone Number: +123-456-7890
                               Email: info@abcmedicalcenter.com
                               Website: www.abcmedicalcenter.com

                                </strong><br/>

                               </p>
      </div>
      <div className='footer3cont'>
                <p><strong>For:</strong></p>
                &nbsp;
                <p><strong>Authorised Signature:</strong></p>
      </div>
    </div>
    </div>
  );
};

export default Billingpage;



