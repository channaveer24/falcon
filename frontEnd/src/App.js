import React from "react";
import "./App.css";
// import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Chart from "./components/chart/Chart";
import Table from "./components/table/Table";
// import Login from "./components/login/Login";

const App = () => {
  return (
    <div className="container">
      {/* <Sidebar /> */}
      <div className="main-content">
        {/* <Login /> */}
        <Header />
        <Chart />
        <Table />
      </div>
    </div>
  );
};

export default App;
