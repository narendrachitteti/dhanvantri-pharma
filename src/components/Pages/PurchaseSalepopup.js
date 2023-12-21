import React,{useState} from 'react'
import './Purchsale.css'
import { Link } from 'react-router-dom';
const PurchaseSalepopup = () => {

    const [isOpen, setIsopen] = useState(false);

    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }
  return (
    <div>

        <nav>
            

<div className="btn btn-primary" onClick={ToggleSidebar} >
                                    <i className="fa fa-bars"></i>
                                </div>


        </nav>




                                <div className={`sidebar-vik ${isOpen === true ? 'active' : ''}`}>
                        <div className="sd-header">
                          
                            <div className="btn btn-primary" onClick={ToggleSidebar}><i className="fa fa-times"></i></div>
                        </div>
                        <div className="sd-body">
                          <div>
                          <Link to='/'>
                           Purchase
                          
                           </Link>
                          </div>
                          <div>
                          <Link to='/'>
                           Sale
                           </Link>
                          </div>
                        </div>
                    </div>
                    <div className={`sidebar-overlay ${isOpen === true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
           </div>






  
  )
}

export default PurchaseSalepopup