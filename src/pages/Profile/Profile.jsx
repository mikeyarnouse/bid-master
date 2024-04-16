import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import editIcon from "../../assets/icons/edit-24px.svg";
import closeIcon from "../../assets/icons/close-24px.svg";
import "../../components/Marketplace/Marketplace.scss";
import "./Profile.scss";

const Profile = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [totalItems, setTotalItems] = useState([]);
  const [failedAuth, setFailedAuth] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchIconVisibility, setSearchIconVisibility] = useState(true);

  const [avatarModalVisibility, setAvatarModalVisibility] = useState(false);
  const [editModalVisibility, setEditModalVisibility] = useState(false);
  const [uploadModalVisibility, setUploadModalVisibility] = useState(false);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState("");
  const [postItemFlag, setPostItemFlag] = useState(false);
  const [updateUserFlag, setUpdateUserFlag] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [lastPath, setLastPath] = useState(null);

  const [editFormData, setEditFormData] = useState({
    username: "",
    current_password: "",
    new_password: "",
    balance: "",
    email_address: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    street_address: "",
    city: "",
    country: "",
  });

  const [userNameClass, setUserNameClass] = useState(
    "profile__edit-form__input"
  );
  const [currPasswordClass, setCurrPasswordClass] = useState(
    "profile__edit-form__input"
  );
  const [newPasswordClass, setNewPasswordClass] = useState(
    "profile__edit-form__input"
  );
  const [firstNameClass, setFirstNameClass] = useState(
    "profile__edit-form__input"
  );
  const [lastNameClass, setLastNameClass] = useState(
    "profile__edit-form__input"
  );
  const [streetAddressClass, setStreetAddressClass] = useState(
    "profile__edit-form__input"
  );
  const [balanceClass, setBalanceClass] = useState("profile__edit-form__input");
  const [emailClass, setEmailClass] = useState("profile__edit-form__input");
  const [phoneClass, setPhoneClass] = useState("profile__edit-form__input");
  const [cityClass, setCityClass] = useState("profile__edit-form__input");
  const [countryClass, setCountryClass] = useState("profile__edit-form__input");

  const checkToken = () => {
    // getItem from sessionStorage token
    const token = sessionStorage.getItem("token");
    if (!token) {
      setFailedAuth(true);
      return null;
    }
    setIsLoggedIn(true);
    return token;
  };

  const isStringValid = (s) => {
    return s.length !== 0;
  };

  const isNewPasswordValid = () => {
    if (editFormData.new_password.length < 7) {
      return false;
    }

    let specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    let checkForSpecialChar = function (string) {
      for (let i = 0; i < specialChars.length; i++) {
        if (string.indexOf(specialChars[i]) > -1) {
          return true;
        }
      }
      return false;
    };
    if (checkForSpecialChar(editFormData.new_password) === false) {
      return false;
    }

    return true;
  };

  const isEmailValid = () => {
    if (editFormData.email_address.length === 0) {
      return false;
    } else if (
      !editFormData.email_address.includes("@") ||
      !editFormData.email_address.includes(".com")
    ) {
      return false;
    }

    return true;
  };

  const isPhoneValid = () => {
    if (editFormData.phone_number.length === 0) {
      return false;
    }

    let phoneNumber = editFormData.phone_number.replace(/\D/g, "");
    if (phoneNumber.length !== 11) {
      return false;
    }
    return true;
  };

  // Formats Phone Number on input change
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove all non-numeric characters
    let formattedNumber = "+1"; // Automatically assign country code +1
    const pattern = /^(1?)(\d{0,3})(\d{0,3})(\d{0,4})$/; // Define the formatting pattern
    const match = cleaned.match(pattern); // Match the cleaned input against the pattern
    if (!match) {
      // If no match, return the original input
      return value;
    }
    const [, , area, prefix, line] = match; // Destructure the matched groups

    // Format the phone number based on the matched groups
    if (area) {
      formattedNumber += ` (${area}`;
    }
    if (prefix) {
      formattedNumber += `) ${prefix}`;
    }
    if (line) {
      formattedNumber += `-${line}`;
    }
    return formattedNumber.trim() || value;
  };

  const handlePhoneNumChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      setEditFormData({
        ...editFormData,
        phone_number: formatPhoneNumber(value),
      });
    }
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

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

  const handleLogout = () => {
    // Remove token from storage
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    setUser(null);
    setFailedAuth(true);
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();

    if (!avatarFile) {
      alert("Please choose a file to upload");
      return;
    }

    const token = checkToken();

    try {
      // Create a FormData object and append the file
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      // Make the POST request
      await axios.post(`${baseURL}/upload/avatar`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setAvatarModalVisibility(false);
      setPostItemFlag((prev) => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  const isEditFormValid = () => {
    if (editFormData.new_password.length === 0) {
      if (
        !isStringValid(editFormData.username) ||
        !isStringValid(editFormData.current_password) ||
        !isStringValid(editFormData.balance) ||
        !isEmailValid() ||
        !isPhoneValid() ||
        !isStringValid(editFormData.first_name) ||
        !isStringValid(editFormData.last_name) ||
        !isStringValid(editFormData.street_address) ||
        !isStringValid(editFormData.city) ||
        !isStringValid(editFormData.country)
      ) {
        if (!isStringValid(editFormData.username)) {
          setUserNameClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setUserNameClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.current_password)) {
          setCurrPasswordClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setCurrPasswordClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.balance)) {
          setBalanceClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setBalanceClass("profile__edit-form__input");
        }
        if (!isEmailValid()) {
          setEmailClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setEmailClass("profile__edit-form__input");
        }
        if (!isPhoneValid()) {
          setPhoneClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setPhoneClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.first_name)) {
          setFirstNameClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setFirstNameClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.last_name)) {
          setLastNameClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setLastNameClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.street_address)) {
          setStreetAddressClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setStreetAddressClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.city)) {
          setCityClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setCityClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.country)) {
          setCountryClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setCountryClass("profile__edit-form__input");
        }
        return false;
      }

      return true;
    } else {
      if (
        !isStringValid(editFormData.username) ||
        !isStringValid(editFormData.current_password) ||
        !isNewPasswordValid() ||
        !isStringValid(editFormData.balance) ||
        !isEmailValid() ||
        !isPhoneValid() ||
        !isStringValid(editFormData.first_name) ||
        !isStringValid(editFormData.last_name) ||
        !isStringValid(editFormData.street_address) ||
        !isStringValid(editFormData.city) ||
        !isStringValid(editFormData.country)
      ) {
        if (!isStringValid(editFormData.username)) {
          setUserNameClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setUserNameClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.current_password)) {
          setCurrPasswordClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setCurrPasswordClass("profile__edit-form__input");
        }
        if (!isNewPasswordValid()) {
          setNewPasswordClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setNewPasswordClass("profile__edit-form__input");
        }

        if (!isStringValid(editFormData.balance)) {
          setBalanceClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setBalanceClass("profile__edit-form__input");
        }
        if (!isEmailValid()) {
          setEmailClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setEmailClass("profile__edit-form__input");
        }
        if (!isPhoneValid()) {
          setPhoneClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setPhoneClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.first_name)) {
          setFirstNameClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setFirstNameClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.last_name)) {
          setLastNameClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setLastNameClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.street_address)) {
          setStreetAddressClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setStreetAddressClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.city)) {
          setCityClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setCityClass("profile__edit-form__input");
        }
        if (!isStringValid(editFormData.country)) {
          setCountryClass(
            "profile__edit-form__input profile__edit-form__input--invalid"
          );
        } else {
          setCountryClass("profile__edit-form__input");
        }
        return false;
      }

      return true;
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();
    if (isEditFormValid()) {
      const token = checkToken();

      if (isNewPasswordValid()) {
        try {
          const res = await axios.put(
            `${baseURL}/users/current`,
            {
              username: editFormData.username,
              current_password: editFormData.current_password,
              new_password: editFormData.new_password,
              balance: editFormData.balance,
              email_address: editFormData.email_address,
              phone_number: editFormData.phone_number,
              first_name: editFormData.first_name,
              last_name: editFormData.last_name,
              street_address: editFormData.street_address,
              city: editFormData.city,
              country: editFormData.country,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEditModalVisibility(false);
          setUpdateUserFlag((prev) => !prev);
        } catch (e) {
          console.error(e);
        }
      } else {
        try {
          const res = await axios.put(
            `${baseURL}/users/current`,
            {
              username: editFormData.username,
              current_password: editFormData.current_password,
              balance: editFormData.balance,
              email_address: editFormData.email_address,
              phone_number: editFormData.phone_number,
              first_name: editFormData.first_name,
              last_name: editFormData.last_name,
              street_address: editFormData.street_address,
              city: editFormData.city,
              country: editFormData.country,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setEditModalVisibility(false);
          setUpdateUserFlag((prev) => !prev);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  useEffect(() => {
    const token = checkToken();

    const getUserData = async () => {
      try {
        // Make a get request to "http://localhost:8080/api/users/current"
        const res = await axios.get(`${baseURL}/users/current`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setEditFormData({
          ...editFormData,
          username: res.data.username,
          balance: res.data.balance,
          email_address: res.data.email_address,
          phone_number: res.data.phone_number,
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          street_address: res.data.street_address,
          city: res.data.city,
          country: res.data.country,
        });
        // Pass bearer token in the headers
      } catch (error) {
        console.error(error);
        setFailedAuth(true);
      }
    };
    getUserData();
  }, [avatarModalVisibility, updateUserFlag]);

  useEffect(() => {
    const getUserItems = async () => {
      if (user) {
        try {
          const res = await axios.get(`${baseURL}/users/${user.user_id}/items`);
          let items = res.data.filter(
            (i) =>
              new Date(`${i.expiration_date} ${i.expiration_time}`) -
                new Date() >
              0
          );
          setTotalItems(items);

          if (searchInput) {
            items = items.filter((i) =>
              i.name.toLowerCase().includes(searchInput.toLowerCase())
            );
          }

          // setLastPath(location.pathname);

          setUserItems(items.slice(startIndex, endIndex));
          setNumPages(Math.ceil(items.length / ITEMS_PER_PAGE));
        } catch (e) {
          console.error(e);
        }
      }
    };
    getUserItems();
  }, [user, currentPage, searchInput, postItemFlag, location]);

  if (failedAuth) {
    return (
      <>
        <Header
          handleSearch={handleSearch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          searchBarOpen={searchBarOpen}
          setSearchBarOpen={setSearchBarOpen}
          searchIconVisibility={searchIconVisibility}
          setSearchIconVisibility={setSearchIconVisibility}
          isLoggedIn={isLoggedIn}
        />
        <main className="profile">
          <p className="profile__login-text">
            You must be logged in to see this page.
          </p>
          <div className="profile__login-link-container">
            <button className="profile__login-link">
              <Link to="/login">Log in</Link>
            </button>
          </div>
        </main>
      </>
    );
  }

  if (user === null) {
    return (
      <>
        <Header
          handleSearch={handleSearch}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          searchBarOpen={searchBarOpen}
          setSearchBarOpen={setSearchBarOpen}
          searchIconVisibility={searchIconVisibility}
          setSearchIconVisibility={setSearchIconVisibility}
          isLoggedIn={isLoggedIn}
        />
        <main className="profile">
          <p>Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        handleSearch={handleSearch}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        searchBarOpen={searchBarOpen}
        setSearchBarOpen={setSearchBarOpen}
        searchIconVisibility={searchIconVisibility}
        setSearchIconVisibility={setSearchIconVisibility}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
      />
      <main className="profile">
        <h2 className="profile__info-welcome__text">
          Welcome Back, {user.first_name} {user.last_name}!
        </h2>
        <div className="profile__info">
          <div className="profile__info-user">
            <div className="profile__info-user__icon-container">
              <img
                src={user.avatar_url}
                alt=""
                className="profile__info-user__icon"
              />
              <button
                className="profile__info-user__choose"
                onClick={() => setAvatarModalVisibility(true)}
              >
                Change
              </button>
            </div>
            <div className="profile__info-user__details">
              <p className="profile__info-user__details-text">
                <span className="profile__info-user__details-text--bold">
                  Username:{" "}
                </span>
                {user.username}
              </p>
              <p className="profile__info-user__details-text">
                <span className="profile__info-user__details-text--bold">
                  Email:{" "}
                </span>
                <a href={`mailto:${user.email_address}`}>
                  {user.email_address}
                </a>
              </p>
              <p className="profile__info-user__details-text">
                <span className="profile__info-user__details-text--bold">
                  Phone:{" "}
                </span>
                {user.phone_number}
              </p>
              <p className="profile__info-user__details-text">
                <span className="profile__info-user__details-text--bold">
                  Balance:
                </span>{" "}
                {`${String(user.balance).length < 4 ? `$${user.balance}` : ""}`}
                {`${
                  String(user.balance).length === 4
                    ? `$${String(user.balance).slice(0, 1)},${String(
                        user.balance
                      ).slice(1, String(user.balance).length)}`
                    : ""
                }`}
                {`${
                  String(user.balance).length === 5
                    ? `$${String(user.balance).slice(0, 2)},${String(
                        user.balance
                      ).slice(2, String(user.balance).length)}`
                    : ""
                }`}
                {`${
                  String(user.balance).length === 6
                    ? `$${String(user.balance).slice(0, 3)},${String(
                        user.balance
                      ).slice(3, String(user.balance).length)}`
                    : ""
                }`}
                {`${
                  String(user.balance).length === 7
                    ? `$${String(user.balance).slice(0, 1)},${String(
                        user.balance
                      ).slice(1, 4)},${String(user.balance).slice(
                        4,
                        String(user.balance).length
                      )}`
                    : ""
                }`}
                {`${
                  String(user.balance).length === 8
                    ? `$${String(user.balance).slice(0, 2)},${String(
                        user.balance
                      ).slice(2, 5)},${String(user.balance).slice(
                        5,
                        String(user.balance).length
                      )}`
                    : ""
                }`}
                {`${
                  String(user.balance).length === 9
                    ? `$${String(user.balance).slice(0, 3)},${String(
                        user.balance
                      ).slice(3, 6)},${String(user.balance).slice(
                        6,
                        String(user.balance).length
                      )}`
                    : ""
                }`}
              </p>{" "}
            </div>
            <img
              src={editIcon}
              alt="edit"
              className="profile__info-user__details-edit"
              onClick={() => setEditModalVisibility(!editModalVisibility)}
            />
          </div>
        </div>
        {avatarModalVisibility && (
          <div className="profile__change-avatar">
            <img
              src={closeIcon}
              alt=""
              className="profile__change-avatar__close"
              onClick={() => {
                setAvatarModalVisibility(false);
                setAvatarPreview("");
              }}
            />
            <form
              className="profile__change-avatar__form"
              onSubmit={handleAvatarSubmit}
            >
              <div className="profile__change-avatar__form-block">
                <img
                  className="profile__edit-form__avatar-icon"
                  src={avatarPreview || user.avatar_url}
                  alt=""
                />
                <input
                  type="file"
                  className="profile__change-avatar__input "
                  ref={fileInputRef}
                  onChange={(e) => {
                    setAvatarPreview(URL.createObjectURL(e.target.files[0]));
                    setAvatarFile(e.target.files[0]);
                  }}
                />
                {/* <button onClick={handleButtonClick}>Choose File</button> */}
              </div>
              <div className="profile__change-avatar__btn-sect">
                <button className="profile__change-avatar__btn">Submit</button>
              </div>
            </form>
          </div>
        )}

        {editModalVisibility && (
          <div className="profile__edit">
            <img
              src={closeIcon}
              alt=""
              className="profile__edit-close"
              onClick={() => setEditModalVisibility(false)}
            />
            <form
              className="profile__edit-form"
              action=""
              onSubmit={handleUserInfoSubmit}
            >
              <div className="profile__edit-form__head">
                <div className="profile__edit-form__left">
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="username"
                    >
                      Username <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="username"
                      className={userNameClass}
                      value={editFormData.username}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          username: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="currPassword"
                    >
                      Current Password <span className="asterisk">*</span>
                    </label>
                    <input
                      type="password"
                      name="currPassword"
                      className={currPasswordClass}
                      value={editFormData.current_password}
                      onChange={(e) => {
                        console.log(e.target.value);
                        setEditFormData({
                          ...editFormData,
                          current_password: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="newPassword"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      className={newPasswordClass}
                      value={editFormData.new_password}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          new_password: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="balance"
                    >
                      Balance <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="balance"
                      className={balanceClass}
                      value={editFormData.balance}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          balance: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="email"
                    >
                      Email Address <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="email"
                      className={emailClass}
                      value={editFormData.email_address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          email_address: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="phone"
                    >
                      Phone Number <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      className={phoneClass}
                      value={editFormData.phone_number}
                      onChange={handlePhoneNumChange}
                    />
                  </div>
                </div>

                <div className="profile__edit-form__right">
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="firstName"
                    >
                      First Name <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      className={firstNameClass}
                      value={editFormData.first_name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          first_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="lastName"
                    >
                      Last Name <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      className={lastNameClass}
                      value={editFormData.last_name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          last_name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="street_address"
                    >
                      Street Address <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="steet_address"
                      className={streetAddressClass}
                      value={editFormData.street_address}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          street_address: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="profile__edit-form__block">
                    <label className="profile__edit-form__label" htmlFor="city">
                      City <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      className={cityClass}
                      value={editFormData.city}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile__edit-form__block">
                    <label
                      className="profile__edit-form__label"
                      htmlFor="country"
                    >
                      Country <span className="asterisk">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      className={countryClass}
                      value={editFormData.country}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="profile__edit-form__submit-container">
                <button className="profile__edit-form__submit">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}
        <h1 className="items-list__profile__title">Current Posts</h1>
        <div className="profile__upload-button">
          <button
            className="profile__upload-button__btn"
            onClick={() => navigate("/post")}
          >
            Upload
          </button>
        </div>

        <div className="items-list__profile-container">
          <div className="items-list__content items-list__profile">
            {userItems?.map((i) => {
              return (
                <div className="items-list__item-block" key={i.item_id}>
                  <img className="items-list__edit" src={editIcon} alt="edit" />
                  <a className="profile__item" href={`/items/${i.item_id}`}>
                    <img
                      src={i.image_url}
                      alt={i.description}
                      className="item__img item__img--profile"
                    />
                    <div className="item-info">
                      <h3 className="item-info__title">{i.name}</h3>
                      <p className="item-info__highest-bid">{`Lowest Ask: $${i.highest_bid}`}</p>
                      <p
                        className={`item-info__exp item-info__exp${
                          new Date(
                            `${i.expiration_date} ${i.expiration_time}`
                          ) -
                            new Date() <
                          0
                            ? "--inactive"
                            : "--active"
                        }`}
                      >{`Expiration: ${i.expiration_date} at ${i.expiration_time}`}</p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
        {totalItems.length > 12 && (
          <div className="items-list__pagination items-list__profile-pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
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
      </main>
    </>
  );
};

export default Profile;
