import React, { useContext } from "react";
import UserContext from "../context/UserContext";
import "../styles/LogInBtn.css";

const { REACT_APP_CLIENT_ID: CLIENT_ID } = process.env;

interface LogInBtnProps {
  threadId?: string;
}

/**
 * Component for a log in button if user is not logged in, or a username and log
 * out button if user is logged in.
 */
const LogInBtn = ({ threadId }: LogInBtnProps) => {
  const { user, setUser } = useContext(UserContext);

  /**
   * Handles the click event for the logout button. Remove the user's login info
   * from local storage and remove the account from the UserContext state.
   */
  const handleLogOutBtnClick = () => {
    localStorage.setItem("username", "");
    localStorage.setItem("refresh_token", "");
    if (setUser) setUser("");
  };

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
        href={
          `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}` +
          `&response_type=code&duration=permanent&state={"threadId":"${
            threadId || ""
          }"}&redirect_uri=${
            window.location.origin
          }/auth&scope=identity vote read submit`
        }
      >
        log in
      </a>
    </div>
  );
};

export default LogInBtn;
