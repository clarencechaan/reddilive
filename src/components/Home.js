import React from "react";
import github from "../images/github.png";
import logo from "../images/logo.png";
import "../styles/Home.css";
import LogInBtn from "./LogInBtn";
import Sidebar from "./Sidebar";
import ThemeSwitch from "./ThemeSwitch";

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
