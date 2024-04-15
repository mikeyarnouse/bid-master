import React from "react";
import "./Item.scss";

const Item = ({ item }) => {
  // console.log(item.image_url);
  return (
    <a className="item" href={`/items/${item.item_id}`}>
      <img src={item.image_url} alt={item.description} className="item__img" />
      <div className="item-info">
        <h3 className="item-info__title">{item.name}</h3>
        {/* <p className="item-info__desc">{item.description}</p> */}
        <p className="item-info__highest-bid">
          {/* {`Lowest Ask: $${item.highest_bid}`} */}
          {`Lowest Ask: $`}
          {`${String(item.highest_bid).length < 4 ? item.highest_bid : ""}`}
          {`${
            String(item.highest_bid).length === 4
              ? `${String(item.highest_bid).slice(0, 1)},${String(
                  item.highest_bid
                ).slice(1, String(item.highest_bid).length)}`
              : ""
          }`}
          {`${
            String(item.highest_bid).length === 5
              ? `${String(item.highest_bid).slice(0, 2)},${String(
                  item.highest_bid
                ).slice(2, String(item.highest_bid).length)}`
              : ""
          }`}
          {`${
            String(item.highest_bid).length === 6
              ? `${String(item.highest_bid).slice(0, 3)},${String(
                  item.highest_bid
                ).slice(3, String(item.highest_bid).length)}`
              : ""
          }`}
          {`${
            String(item.highest_bid).length === 7
              ? `${String(item.highest_bid).slice(0, 1)},${String(
                  item.highest_bid
                ).slice(1, 4)},${String(item.highest_bid).slice(
                  4,
                  String(item.highest_bid).length
                )}`
              : ""
          }`}
        </p>
        <p
          className={`item-info__exp item-info__exp${
            new Date(`${item.expiration_date} ${item.expiration_time}`) -
              new Date() <
            0
              ? "--inactive"
              : "--active"
          }`}
        >{`Expiration: ${item.expiration_date} at ${item.expiration_time}`}</p>
      </div>
    </a>
  );
};

export default Item;
