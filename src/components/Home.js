import Navigator from "./Navigator";
import "../styles/Home.css";
import logo from "../images/logo_small.png";

function Home() {
  return (
    <div className="Home">
      <div className="sidebar">
        <div className="top-bar">
          <img className="logo" src={logo} alt="" />
          <Navigator />
        </div>
        <div className="about"></div>
      </div>
      <div className="main"></div>
    </div>
  );
}

export default Home;
