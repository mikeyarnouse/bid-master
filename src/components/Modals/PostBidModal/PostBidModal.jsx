import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PostBidModal.scss";
import { Link } from "react-router-dom";
import closeIcon from "../../../assets/icons/close-24px.svg";

const PostBidModal = ({
  item_id,
  highestBid,
  postBidModalVisibility,
  setPostBidModalVisibility,
  itemBidFlag,
  setItemBidFlag,
}) => {
  const baseURL = process.env.REACT_APP_API_URL;
  const [amount, setAmount] = useState("");
  const [amountClass, setAmountClass] = useState("post-bid__input");
  const [failedAuth, setFailedAuth] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [user, setUser] = useState("");

  const checkToken = () => {
    // getItem from sessionStorage token
    const token = sessionStorage.getItem("token");
    if (!token) {
      setFailedAuth(true);
      return null;
    }
    return token;
  };

  useEffect(() => {
    const getUser = async () => {
      try {
        const token = checkToken();

        const res = await axios.get(`${baseURL}/users/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    getUser();
  }, [baseURL]);

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const isAmountValid = () => {
    if (amount < highestBid) {
      setErrMsg("Amount cannot be less than highest bid.");
      return false;
    } else if (user.balance - amount < 0) {
      setErrMsg("Not enough balance");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const postBid = async (amount) => {
      try {
        const res = await axios.post(
          `${baseURL}/items/${item_id}/bids`,
          {
            amount: amount,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setItemBidFlag(!itemBidFlag);
        console.log(res);
        window.location.reload();
      } catch (e) {
        console.error(e);
      }
    };

    const token = sessionStorage.getItem("token");

    if (!token) {
      setFailedAuth(true);
      return null;
    }

    if (isAmountValid()) {
      postBid(amount);
      setPostBidModalVisibility(!postBidModalVisibility);
    } else {
      setAmountClass("post-bid__input post-bid__input--invalid");
    }
  };

  if (failedAuth) {
    return (
      <>
        <div className="post-modal">
          <img
            src={closeIcon}
            alt="close"
            className="post-bid__close--logout"
            onClick={() => setPostBidModalVisibility(!postBidModalVisibility)}
          />
          <p className="post-modal__text">You must be logged to post a bid.</p>
          <div className="post-modal__btn-container">
            <button className="post-bid__btn">
              <Link to="/login">Log in</Link>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="post-modal">
      <form className="post-bid" onSubmit={handleSubmit}>
        <label htmlFor="amount" className="post-bid__label">
          Enter Amount
        </label>
        <img
          src={closeIcon}
          alt="close"
          className="post-bid__close"
          onClick={() => setPostBidModalVisibility(!postBidModalVisibility)}
        />
        <input
          type="text"
          id="amount"
          name="amount"
          placeholder="Enter Bid Amount"
          className={amountClass}
          onChange={handleAmountChange}
          value={amount}
        />
        {errMsg && <p className="post-bid__error">{errMsg}</p>}
        <button
          className="post-bid__btn"
          type="submit"
          onClick={() => window.scrollTo(0, document.body.scrollHeight)}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PostBidModal;
