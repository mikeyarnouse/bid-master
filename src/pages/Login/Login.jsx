import React, { useState } from "react";
import Input from "../../components/Input/Input";
import { Link, useNavigate } from "react-router-dom";
import "./Login.scss";
import axios from "axios";
import Header from "../../components/Header/Header";

const Login = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchIconVisibility, setSearchIconVisibility] = useState(false);

  const [error, setError] = useState();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameClass, setUserNameClass] = useState("field__input");
  const [passwordClass, setPasswordClass] = useState("field__input");

  const handleUserNameChange = (e) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const isUserNameValid = () => {
    return userName.length !== 0;
  };
  const isPasswordValid = () => {
    return password.length !== 0;
  };

  const isFormValid = () => {
    if (!isUserNameValid() || !isPasswordValid()) {
      if (!isUserNameValid) {
        setUserNameClass("field__input field__input--invalid");
      } else {
        setUserNameClass("field__input");
      }
      if (!isPasswordValid) {
        setPasswordClass("field__input field__input--invalid");
      } else {
        setPasswordClass("field__input");
      }
      return false;
    }
    setUserNameClass("field__input");
    setPasswordClass("field__input");

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Make a POST request to "http://localhost:8080/api/users/login"
    // use response.data.token to retrieve token
    // sessionStorage to setItem to our token with the name token
    // use react router dom to navigate to profile page

    if (!isFormValid()) {
      alert("Invalid Fields");
    } else {
      try {
        const response = await axios.post(`${baseURL}/login`, {
          username: userName,
          password: password,
        });
        console.log(response.data);
        // Store token to session storage
        sessionStorage.setItem("token", response.data.token);
        navigate("/profile");
      } catch (error) {
        setError("Invalid username or password");
        setUserNameClass("field__input field__input--invalid");
        setPasswordClass("field__input field__input--invalid");
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
      <main className="login">
        <h1 className="login__title">Log in</h1>

        <div className="login-form__container">
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-form__inputs">
              <Input
                type="text"
                name="username"
                label="Username"
                inputClass={userNameClass}
                value={userName}
                placeholder={"Enter Your Username"}
                onChange={handleUserNameChange}
              />
              <Input
                type="password"
                name="password"
                label="Password"
                inputClass={passwordClass}
                value={password}
                placeholder={"Enter Your Password"}
                onChange={handlePasswordChange}
              />
            </div>
            {error && <div className="login__message">{error}</div>}

            <div className="login-form__buttons">
              <button className="login-form__btn">Log in</button>
              <p className="login-form__signup">
                Need an account?{" "}
                <Link to="/register" className="login-form__signup-link">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default Login;
