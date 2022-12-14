import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import "../styles/LogInBtn.css";

const { REACT_APP_CLIENT_ID: CLIENT_ID } = process.env;

function LogInBtn({ threadId }) {
  const { user, setUser } = useContext(UserContext);

  // clear user login info from local storage and remove account from state
  function handleLogOutBtnClick() {
    localStorage.setItem("username", "");
    localStorage.setItem("refresh_token", "");
    setUser("");
  }

  // show username and log out button if user is logged in
  // otherwise show log in button
  return user ? (
    <div className="LogInBtn">
      <label className="username">{user}</label>|
      <a href="#" onClick={handleLogOutBtnClick}>
        log out
      </a>
    </div>
  ) : (
    <div className="LogInBtn">
      <a
        href={`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&duration=permanent&state={"threadId":"${
          threadId || ""
        }"}&redirect_uri=${
          window.location.origin
        }/auth&scope=identity vote read submit`}
      >
        log in
      </a>
    </div>
  );
}

export default LogInBtn;
