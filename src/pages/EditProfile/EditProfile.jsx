import React, { useEffect, useState } from "react";
import closeIcon from "../../assets/icons/close-24px.svg";
import axios from "axios";
import "../Profile/Profile.scss";
import "./EditProfile.scss";
import Header from "../../components/Header/Header";
import { Link } from "react-router-dom";

const EditProfile = () => {
  const baseURL = process.env.REACT_APP_API_URL;

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

  const [searchInput, setSearchInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchIconVisibility, setSearchIconVisibility] = useState(true);

  const [failedAuth, setFailedAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
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

  const handleLogout = () => {
    // Remove token from storage
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    // setUser(null);
    setFailedAuth(true);
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
          //   setEditModalVisibility(false);
          //   setUpdateUserFlag((prev) => !prev);
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
          //   setEditModalVisibility(false);
          //   setUpdateUserFlag((prev) => !prev);
        } catch (e) {
          console.error(e);
        }
      }
    }
  };

  const checkToken = () => {
    // getItem from sessionStorage token
    const token = sessionStorage.getItem("token");
    if (!token) {
      setFailedAuth(true);
      setIsLoggedIn(false);
      return null;
    }
    setFailedAuth(false);
    setIsLoggedIn(true);
    return token;
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
        // setUser(res.data);
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
        // setFailedAuth(true);
      }
    };
    getUserData();
  }, []);

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
          handleLogout={handleLogout}
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
      <main className="profile__edit">
        <img
          src={closeIcon}
          alt=""
          className="profile__edit-close"
          // onClick={() => setEditModalVisibility(false)}
        />
        <form
          className="profile__edit-form"
          action=""
          onSubmit={handleUserInfoSubmit}
        >
          <div className="profile__edit-form__head">
            <div className="profile__edit-form__left">
              <div className="profile__edit-form__block">
                <label className="profile__edit-form__label" htmlFor="username">
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
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      current_password: e.target.value,
                    })
                  }
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
                <label className="profile__edit-form__label" htmlFor="balance">
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
                <label className="profile__edit-form__label" htmlFor="email">
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
                <label className="profile__edit-form__label" htmlFor="phone">
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
                <label className="profile__edit-form__label" htmlFor="lastName">
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
                <label className="profile__edit-form__label" htmlFor="country">
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
            <button className="profile__edit-form__submit">Save Changes</button>
          </div>
        </form>
      </main>
    </>
  );
};

export default EditProfile;
