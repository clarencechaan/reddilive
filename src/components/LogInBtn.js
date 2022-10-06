import "../styles/LogInBtn.css";
import { useContext } from "react";
import UserContext from "../UserContext";

const { REACT_APP_CLIENT_ID: CLIENT_ID } = process.env;

function LogInBtn({ threadId }) {
  const { user, setUser } = useContext(UserContext);

  function handleLogOutBtnClicked() {
    localStorage.setItem("username", "");
    localStorage.setItem("refresh_token", "");
    setUser("");
  }

  return user ? (
    <div className="LogInBtn">
      <label className="username">{user}</label>
      <a href="#" onClick={handleLogOutBtnClicked}>
        log out
      </a>
    </div>
  ) : (
    <div className="LogInBtn">
      <a
        href={`https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&duration=permanent&state={"threadId":"${
          threadId || ""
        }"}&redirect_uri=${window.location.origin}/auth&scope=identity vote`}
      >
        log in
      </a>
    </div>
  );
}

export default LogInBtn;
