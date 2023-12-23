import React from "react";
import { Outlet,Navigate } from "react-router-dom";

const PrivateRoute = () => {

  const staffId =  localStorage.getItem("staffid")
    return staffId ? <Outlet /> : <Navigate to="/" />;

};

export default PrivateRoute;
