import React, { useState } from "react";
import searchIcon from "../../assets/icons/search-24px.svg";
import closeIcon from "../../assets/icons/close-24px.svg";
import closeIconWhite from "../../assets/icons/close-white.svg";
import "./Header.scss";
import { NavLink, useNavigate } from "react-router-dom";

const Header = ({
  handleSearch,
  mobileMenuOpen,
  setMobileMenuOpen,
  searchBarOpen,
  setSearchBarOpen,
  searchIconVisibility,
  setSearchIconVisibility,
  isLoggedIn,
  handleLogout,
}) => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <nav
        className={`header__nav ${
          !searchIconVisibility ? "header__nav--centered" : ""
        }`}
      >
        <svg
          className={`h-8 w-8 text-black-500 header__nav-burger ${
            !searchIconVisibility ? "header__nav-burger--absolute" : ""
          } `}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          onClick={() => {
            setMobileMenuOpen(true);
            setSearchBarOpen(false);
          }}
        >
          {" "}
          <line x1="3" y1="12" x2="21" y2="12" />{" "}
          <line x1="3" y1="6" x2="21" y2="6" />{" "}
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
        {!searchBarOpen && (
          <>
            <h2
              className={`header__nav-logo`}
              onClick={() => {
                navigate("/");
                setSearchIconVisibility(true);
              }}
            >
              BidMaster
            </h2>

            <div className="header__nav-logo-block--desktop">
              <h2
                className={`header__nav-logo--desktop`}
                onClick={() => {
                  navigate("/");
                  setSearchIconVisibility(true);
                }}
              >
                BidMaster
              </h2>

              <ul className="header__nav-menu__list-desktop">
                <NavLink
                  className={`header__nav-menu__list-item-desktop`}
                  to={"/"}
                  id="market"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                  }}
                >
                  MarketPlace
                </NavLink>
                <NavLink
                  className={`header__nav-menu__list-item-desktop`}
                  to={"/profile"}
                  id="profile"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                  }}
                >
                  Your Account
                </NavLink>
              </ul>
            </div>

            <div className="header__nav-search-block--desktop">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search for an item"
                className="header__nav-search header__nav-search--desktop"
                onChange={handleSearch}
              />
              <img
                src={searchIcon}
                alt=""
                className={`header__nav-search-icon--desktop`}
                onClick={() => setSearchBarOpen(true)}
              />
            </div>

            {!isLoggedIn && (
              <div className="header__nav-menu__buttons--desktop">
                <button
                  className="header__nav-menu__btn--desktop"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </button>
                <button
                  className="header__nav-menu__btn--desktop"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
            {isLoggedIn && (
              <div className="header__nav-menu__buttons--desktop">
                <button
                  className="header__nav-menu__btn--desktop"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}

            <img
              src={searchIcon}
              alt=""
              className={`header__nav-search-icon ${
                !searchIconVisibility ? "header__nav-search-icon--hidden" : ""
              }`}
              onClick={() => setSearchBarOpen(true)}
            />
          </>
        )}
        {searchBarOpen && (
          <>
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search for an item"
              className="header__nav-search"
              onChange={handleSearch}
            />
            <img
              src={closeIcon}
              alt="close"
              onClick={() => setSearchBarOpen(false)}
            />
          </>
        )}
        {mobileMenuOpen && (
          <div className="header__nav-menu">
            <img
              className="header__nav-menu__close"
              src={closeIconWhite}
              alt=""
              onClick={() => setMobileMenuOpen(false)}
            />
            <ul className="header__nav-menu__list">
              <NavLink
                className="header__nav-menu__list-item"
                to={"/"}
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                MarketPlace
              </NavLink>
              <NavLink
                className="header__nav-menu__list-item"
                to={"/profile"}
                onClick={() => {
                  setMobileMenuOpen(false);
                }}
              >
                Your Account
              </NavLink>
            </ul>
            {!isLoggedIn && (
              <div className="header__nav-menu__buttons">
                <button
                  className="header__nav-menu__btn"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Login
                </button>
                <button
                  className="header__nav-menu__btn"
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Sign Up
                </button>
              </div>
            )}
            {isLoggedIn && (
              <div className="header__nav-menu__buttons">
                <button
                  className="header__nav-menu__btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
