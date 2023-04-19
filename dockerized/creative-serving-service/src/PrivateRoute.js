import React, { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false);
    }
  }, [accessToken, refreshToken]);

  if (isAuthenticated) return <Outlet />;
  return <Navigate replace to={"/"} />;
};

export default PrivateRoute;
