import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Bid from "../../components/Bid/Bid";
import PostBidModal from "../../components/Modals/PostBidModal/PostBidModal";
import leftArrow from "../../assets/icons/arrow-left.svg";
import "./ItemDetails.scss";

const ItemDetails = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({});
  const [itemBids, setItemBids] = useState([]);

  const [postBidModalVisibility, setPostBidModalVisibility] = useState(false);
  const [itemBidFlag, setItemBidFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchIconVisibility, setSearchIconVisibility] = useState(false);

  useEffect(() => {
    const getItemById = async (req, res) => {
      try {
        const res = await axios.get(`${baseURL}/items/${itemId}`);
        setItem(res.data[0]);
        console.log();

        const res3 = await axios.get(`${baseURL}/items/${itemId}/bids`);
        setItemBids(res3.data);
      } catch (error) {
        console.error(error);
      }
    };
    getItemById();
    setIsLoading(false);
  }, [itemBidFlag]);
  return (
    <>
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchBarOpen={searchBarOpen}
        setSearchBarOpen={setSearchBarOpen}
        searchIconVisibility={searchIconVisibility}
        setSearchIconVisibility={setSearchIconVisibility}
      />
      <main className="item-details">
        <div className="item-details__title-container">
          <h1 className="item-details__title">Item Details</h1>
          <img
            onClick={() => navigate(-1)}
            src={leftArrow}
            alt=""
            className="item-details__back-arrow"
          />
        </div>

        <div className="item-details__info">
          <img src={item.image_url} alt="" className="item-details__info-img" />
          <div className="item-details__info-body">
            <p className="item-details__info-name">{item.name}</p>
            <p className="item-details__info-desc">{item.description}</p>
            <p className="item-details__info-desc">
              {`Starting Price: $`}
              {`${String(item.start_bid).length < 4 ? item.start_bid : ""}`}
              {`${
                String(item.start_bid).length === 4
                  ? `${String(item.start_bid).slice(0, 1)},${String(
                      item.start_bid
                    ).slice(1, String(item.start_bid).length)}`
                  : ""
              }`}
              {`${
                String(item.start_bid).length === 5
                  ? `${String(item.start_bid).slice(0, 2)},${String(
                      item.start_bid
                    ).slice(2, String(item.start_bid).length)}`
                  : ""
              }`}
              {`${
                String(item.start_bid).length === 6
                  ? `${String(item.start_bid).slice(0, 3)},${String(
                      item.start_bid
                    ).slice(3, String(item.start_bid).length)}`
                  : ""
              }`}
              {`${
                String(item.start_bid).length === 7
                  ? `${String(item.start_bid).slice(0, 1)},${String(
                      item.start_bid
                    ).slice(1, 4)},${String(item.start_bid).slice(
                      4,
                      String(item.start_bid).length
                    )}`
                  : ""
              }`}
              {`${
                String(item.start_bid).length === 8
                  ? `${String(item.start_bid).slice(0, 2)},${String(
                      item.start_bid
                    ).slice(2, 5)},${String(item.start_bid).slice(
                      5,
                      String(item.start_bid).length
                    )}`
                  : ""
              }`}
              {`${
                String(item.start_bid).length === 9
                  ? `${String(item.start_bid).slice(0, 3)},${String(
                      item.start_bid
                    ).slice(3, 6)},${String(item.start_bid).slice(
                      6,
                      String(item.start_bid).length
                    )}`
                  : ""
              }`}
            </p>
            <p className="item-details__info-user-name">
              Posted by:{" "}
              <span
                className="item-details__info-user-name--blue"
                onClick={() => navigate(`/users/${item.username}`)}
              >
                @{item.username}
              </span>
            </p>
            <p
              className={`item-info__exp item-info__exp${
                new Date(`${item.expiration_date} ${item.expiration_time}`) -
                  new Date() <
                0
                  ? "--inactive"
                  : "--active"
              }`}
            >{`Expires: ${item.expiration_date} at ${item.expiration_time}`}</p>
          </div>
        </div>
        {!postBidModalVisibility && (
          <div className="item-details__post">
            <button
              className="item-details__post-btn"
              onClick={() => {
                setPostBidModalVisibility(!postBidModalVisibility);
                window.scrollTo({
                  top: document.documentElement.scrollHeight,
                  behavior: "smooth", // This enables smooth scrolling
                });
              }}
            >
              Post Bid
            </button>
          </div>
        )}
        {postBidModalVisibility && (
          <div className="item-details__post-container">
            <PostBidModal
              item_id={item.item_id}
              highestBid={item.highest_bid}
              postBidModalVisibility={postBidModalVisibility}
              setPostBidModalVisibility={setPostBidModalVisibility}
              itemBidFlag={itemBidFlag}
              setItemBidFlag={setItemBidFlag}
            />
          </div>
        )}
        <div className="item-details__bids-container">
          <div className="item-details__bids">
            {itemBids.length === 0 && (
              <p className="item-details__bids-none">
                There are no bids for this item yet.
              </p>
            )}
            {!isLoading &&
              itemBids
                ?.sort((a, b) => b.amount - a.amount)
                .map((b) => {
                  return (
                    <Bid key={b.bid_id} bid={b} highestBid={item.highest_bid} />
                  );
                })}
          </div>
        </div>
      </main>
    </>
  );
};

export default ItemDetails;
