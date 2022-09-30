import Navigator from "./Navigator";
import "../styles/Home.css";
import logo from "../images/logo_small.png";
import fullUrl from "../images/full_url.png";
import replacedUrl from "../images/replaced_url.png";
import arrow from "../images/arrow.png";

function Home() {
  return (
    <div className="Home">
      <div className="sidebar">
        <div className="top-bar">
          <img className="logo" src={logo} alt="" />
          <Navigator />
        </div>
        <div className="how-to-1">
          <div className="msg">Copy the reddit thread URL to the box above</div>
          <img src={arrow} className="arrow" alt="" />
        </div>
        <img src={fullUrl} className="url" alt="" />

        <div className="how-to-2">
          <div className="msg">
            <div className="big">OR</div>
            Replace "reddit" from the URL with "reddilive"
          </div>
        </div>
        <img src={replacedUrl} className="url" alt="" />
        <div className="about"></div>
      </div>
      <div className="main"></div>
    </div>
  );
}

export default Home;
