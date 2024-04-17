import axios from "axios";
import React, { useEffect, useState } from "react";
import Item from "../Item/Item";
import "./Marketplace.scss";

const Marketplace = ({ searchInput }) => {
  const baseURL = process.env.REACT_APP_API_URL;
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState([]);
  const [numPages, setNumPages] = useState(0);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  useEffect(() => {
    const getItems = async (req, res) => {
      try {
        const res = await axios.get(`${baseURL}/items`);
        let items = res.data.filter(
          (i) =>
            new Date(`${i.expiration_date} ${i.expiration_time}`) - new Date() >
            0
        );
        setTotalItems(items);

        if (searchInput) {
          items = items.filter((i) =>
            i.name.toLowerCase().includes(searchInput.toLowerCase())
          );
        }
        setItems(items.slice(startIndex, endIndex));
        setNumPages(Math.ceil(items.length / ITEMS_PER_PAGE));
      } catch (e) {
        console.error(e);
      }
    };
    getItems();
  }, [currentPage, searchInput, baseURL, startIndex, endIndex]);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= numPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => {
            goToPage(i);
            window.scrollTo(0, 0);
          }}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="items-list">
      <h1 className="items-list__title">Marketplace</h1>
      <div className="items-list__content">
        {items
          ?.sort(
            (a, b) =>
              new Date(`${a.expiration_date} ${a.expiration_time}`) -
              new Date(`${b.expiration_date} ${b.expiration_time}`)
          )
          .map((i) => {
            return <Item key={i.item_id} item={i} />;
          })}
      </div>
      {totalItems >= 12 && (
        <div className="items-list__pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              goToPage(currentPage - 1);
              window.scrollTo(0, 0);
            }}
          >
            Previous
          </button>
          {renderPagination()}
          <button
            disabled={currentPage === numPages}
            onClick={() => {
              goToPage(currentPage + 1);
              window.scrollTo(0, 0);
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
