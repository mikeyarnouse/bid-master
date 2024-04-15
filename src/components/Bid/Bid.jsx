import { useNavigate } from "react-router-dom";
import "./Bid.scss";

const Bid = ({ bid, highestBid }) => {
  const navigate = useNavigate();
  return (
    <article
      className={`bid ${highestBid === bid.amount ? "bid--highest" : ""}`}
    >
      <p
        onClick={() => navigate(`/users/${bid.user_id}`)}
        className="bid__username"
      >
        {bid.username}
      </p>
      <p className="bid__amount">{bid.amount}</p>
      <p className="bid__time">
        {new Date(`${bid.timestamp}`).toLocaleDateString() +
          " : " +
          new Date(`${bid.timestamp}`).toTimeString().slice(0, 8)}
      </p>
    </article>
  );
};

export default Bid;
