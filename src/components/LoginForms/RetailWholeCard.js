import React from "react";
import { Link } from "react-router-dom";

const RetailWholecard = () => {
  return (
    <div>
      <div className="Card1-con-vik">
        <Link to="/RetailLogin" class="card-vik">
          <h2> Retail</h2>
        </Link>
        <Link to="/WholesaleLogin" class="card-vik">
          <h2> Wholesale </h2>
        </Link>
      </div>
    </div>
  );
};

export default RetailWholecard;
