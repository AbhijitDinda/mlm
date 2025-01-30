import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import APP_PATH from "../routes/paths";

const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(APP_PATH.login);
  }, []);
  return <div>Home</div>;
};

export default Home;
