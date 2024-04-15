import React, { useState } from "react";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.scss";
import Header from "../../components/Header/Header";

const Register = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchIconVisibility, setSearchIconVisibility] = useState(false);

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNum, setPhoneNum] = useState("");
  const [email, setEmail] = useState("");

  const [userNameClass, setUserNameClass] = useState("field__input");
  const [passwordClass, setPasswordClass] = useState("field__input");
  const [confPasswordClass, setConfPasswordClass] = useState("field__input");
  const [firstNameClass, setFirstNameClass] = useState("field__input");
  const [lastNameClass, setLastNameClass] = useState("field__input");
  const [addressClass, setAddressClass] = useState("field__input");
  const [cityClass, setCityClass] = useState("field__input");
  const [countryClass, setCountryClass] = useState("field__input");
  const [phoneNumClass, setPhoneNumClass] = useState("field__input");
  const [emailClass, setEmailClass] = useState("field__input");

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfPasswordChange = (e) => {
    setConfPassword(e.target.value);
  };
  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handlePhoneNumChange = (e) => {
    const value = e.target.value;
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      setPhoneNum(formatPhoneNumber(value));
    }
  };
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
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

  const isStringValid = (str) => {
    return str.length !== 0;
  };

  const isPasswordValid = () => {
    // Check if the password is too short
    if (password.length < 7) {
      return false;
    }

    // Check if password doesn't include special character
    let specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
    let checkForSpecialChar = function (string) {
      for (let i = 0; i < specialChars.length; i++) {
        if (string.indexOf(specialChars[i]) > -1) {
          return true;
        }
      }
      return false;
    };
    if (checkForSpecialChar(password) === false) {
      return false;
    }

    return true;
  };

  const isConfirmPasswordValid = () => {
    // TO DO: Add logic to check if the PWs match.
    if (confPassword.length === 0) {
      return false;
    } else if (password !== confPassword) {
      return false;
    }

    return true;
  };

  const isEmailValid = () => {
    if (email.length === 0) {
      return false;
    } else if (!email.includes("@") || !email.includes(".com")) {
      return false;
    }

    return true;
  };

  const isPhoneNumValid = () => {
    if (phoneNum.length === 0) {
      return false;
    }

    let phoneNumber = phoneNum.replace(/\D/g, "");
    if (phoneNumber.length !== 11) {
      return false;
    }
    return true;
  };

  const isFormValid = () => {
    // Check if the fields are valid
    if (
      !isStringValid(userName) ||
      !isPasswordValid() ||
      !isConfirmPasswordValid() ||
      !isStringValid(firstName) ||
      !isStringValid(lastName) ||
      !isStringValid(address) ||
      !isStringValid(city) ||
      !isStringValid(country) ||
      !isPhoneNumValid() ||
      !isEmailValid()
    ) {
      if (!isStringValid(userName)) {
        setUserNameClass("field__input field__input--invalid");
      } else {
        setUserNameClass("field__input");
      }
      if (!isPasswordValid()) {
        alert(
          "Password must have a length greater than 7 and include atleast 1 special character."
        );
        setPasswordClass("field__input field__input--invalid");
      } else {
        setPasswordClass("field__input");
      }
      if (!isConfirmPasswordValid()) {
        alert("Passwords dont match");
        setConfPasswordClass("field__input field__input--invalid");
      } else {
        setConfPasswordClass("field__input");
      }
      if (!isStringValid(firstName)) {
        setFirstNameClass("field__input field__input--invalid");
      } else {
        setFirstNameClass("field__input");
      }
      if (!isStringValid(lastName)) {
        setLastNameClass("field__input field__input--invalid");
      } else {
        setLastNameClass("field__input");
      }
      if (!isStringValid(address)) {
        setAddressClass("field__input field__input--invalid");
      } else {
        setAddressClass("field__input");
      }
      if (!isStringValid(city)) {
        setCityClass("field__input field__input--invalid");
      } else {
        setCityClass("field__input");
      }
      if (!isStringValid(country)) {
        setCountryClass("field__input field__input--invalid");
      } else {
        setCountryClass("field__input");
      }
      if (!isPhoneNumValid()) {
        setPhoneNumClass("field__input field__input--invalid");
      } else {
        setPhoneNumClass("field__input");
      }
      if (!isEmailValid()) {
        setEmailClass("field__input field__input--invalid");
      } else {
        setEmailClass("field__input");
      }

      return false;
    } else {
      setUserNameClass("field__input");
      setPasswordClass("field__input");
      setConfPasswordClass("field__input");
      setFirstNameClass("field__input");
      setLastNameClass("field__input");
      setAddressClass("field__input");
      setCityClass("field__input");
      setCountryClass("field__input");
      setPhoneNumClass("field__input");
      setEmailClass("field__input");

      return true;
    }
  };

  const clearState = () => {
    setUserName("");
    setPassword("");
    setConfPassword("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setCity("");
    setCountry("");
    setPhoneNum("");
    setEmail("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid()) {
      alert("Invalid Fields");
    } else {
      try {
        const response = await axios.post(`${baseURL}/register`, {
          username: userName,
          password: password,
          confirm_password: confPassword,
          first_name: firstName,
          last_name: lastName,
          street_address: address,
          city: city,
          country: country,
          phone_number: phoneNum,
          email_address: email,
        });
        console.log(response);
        clearState();
        navigate("/login");
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <>
      <Header
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setSearchBarOpen={setSearchBarOpen}
        searchIconVisibility={searchIconVisibility}
        setSearchIconVisibility={setSearchIconVisibility}
      />
      <main className="register">
        <h1 className="register__title">Registration</h1>
        <div className="register-form__container">
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="register-form__head">
              <Input
                type={"text"}
                name={"username"}
                label={"Username"}
                onChange={handleUserNameChange}
                inputClass={userNameClass}
                value={userName}
                placeholder={"Enter Your Username"}
              />
              <Input
                type={"password"}
                name={"password"}
                label={"Password"}
                onChange={handlePasswordChange}
                inputClass={passwordClass}
                value={password}
                placeholder={"Enter Your Password"}
              />
              <Input
                type={"password"}
                name={"confirm_password"}
                label={"Confirm Password"}
                onChange={handleConfPasswordChange}
                inputClass={confPasswordClass}
                value={confPassword}
                placeholder={"Enter Your Password Again"}
              />
            </div>

            <div className="register-form__body">
              <Input
                type={"text"}
                name={"first_name"}
                label={"First Name"}
                onChange={handleFirstNameChange}
                inputClass={firstNameClass}
                value={firstName}
                placeholder={"Enter Your First Name"}
              />
              <Input
                type={"text"}
                name={"last_name"}
                label={"Last Name"}
                onChange={handleLastNameChange}
                inputClass={lastNameClass}
                value={lastName}
                placeholder={"Enter Your Last Name"}
              />
              <Input
                type={"text"}
                name={"address"}
                label={"Address"}
                onChange={handleAddressChange}
                inputClass={addressClass}
                value={address}
                placeholder={"Enter Your Address"}
              />
              <Input
                type={"text"}
                name={"city"}
                label={"City"}
                onChange={handleCityChange}
                inputClass={cityClass}
                value={city}
                placeholder={"Enter Your City"}
              />
              <Input
                type={"text"}
                name={"country"}
                label={"Country"}
                onChange={handleCountryChange}
                inputClass={countryClass}
                value={country}
                placeholder={"Enter Your Country"}
              />
              <Input
                type={"text"}
                name={"phone"}
                label={"Phone Number"}
                onChange={handlePhoneNumChange}
                inputClass={phoneNumClass}
                value={phoneNum}
                placeholder={"Enter Your Phone Number"}
              />
              <Input
                type={"text"}
                name={"email"}
                label={"Email Address"}
                onChange={handleEmailChange}
                inputClass={emailClass}
                value={email}
                placeholder={"Enter Your Email Address"}
              />
            </div>

            <div className="register-form__tail">
              <button className="register-form__btn">Sign up</button>
              <p className="register-form__login">
                Have an account?{" "}
                <Link to="/login" className="register-form__login-link">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;
