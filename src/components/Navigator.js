import "../styles/Navigator.css";
import { useNavigate } from "react-router-dom";

function Navigator() {
  const navigate = useNavigate();

  function handleNavigatorSubmitted(e) {
    e.preventDefault();
    const text = e.target[0].value;
    const idx = text.indexOf("/comments/");

    let textId = "";
    if (idx >= 0) {
      textId = text.substring(idx + 10, idx + 16);
    } else {
      textId = text;
    }

    e.target.reset();
    navigate(`/comments/${textId}`);
  }

  return (
    <form className="Navigator" onSubmit={handleNavigatorSubmitted}>
      <input type="text" placeholder="thread ID or URL" />
      <button className="go-btn">GO</button>
    </form>
  );
}

export default Navigator;
