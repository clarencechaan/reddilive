import "../styles/Home.css";
import Sidebar from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";
import logo from "../images/logo.png";
import github from "../images/github.png";
import LogInBtn from "./LogInBtn";
import React from "react";

function Home() {
  return (
    <div className="Home">
      <Sidebar />
      <div className="main">
        <img src={logo} className="logo" alt="" />
        <div className="tag-line">live threads for reddit</div>
        <a href="https://github.com/clarencechaan" className="me">
          by Clarence Chan <img src={github} className="github" alt="" />
        </a>
      </div>
      <ThemeSwitch />
      <LogInBtn />
    </div>
  );
}

export default Home;
