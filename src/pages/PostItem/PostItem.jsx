import React, { useState } from "react";
import Input from "../../components/Input/Input";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import closeIcon from "../../assets/icons/close-24px.svg";
import "./PostItem.scss";
import Header from "../../components/Header/Header";

const PostItemModal = () => {
  const baseURL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchIconVisibility, setSearchIconVisibility] = useState(false);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [startBid, setStartBid] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const [itemNameClass, setItemNameClass] = useState(
    "field__input field__input-item"
  );
  const [descriptionClass, setDescriptionClass] = useState(
    "field__input field__input-item"
  );
  const [categoryClass, setCategoryClass] = useState(
    "field__input field__input-item"
  );
  const [startBidClass, setStartBidClass] = useState(
    "field__input field__input-item"
  );
  const [expirationDateClass, setExpirationDateClass] =
    useState("field__input");
  const [expirationTimeClass, setExpirationTimeClass] =
    useState("field__input");

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);
  };
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };
  const handleStartBidChange = (e) => {
    setStartBid(e.target.value);
  };
  const handleExpirationDateChange = (e) => {
    setExpirationDate(e.target.value);
  };
  const handleExpirationTimeChange = (e) => {
    setExpirationTime(e.target.value);
  };
  const handleImageFileChange = (e) => {
    console.log(e);
    setImageFile(e.target.files[0]);
  };

  const isStringValid = (str) => {
    return str.length !== 0;
  };

  const isStartBidValid = () => {
    if (startBid.length === 0) {
      return false;
    }
    if (isNaN(startBid)) {
      return false;
    }
    return true;
  };
  const isExpirationDateValid = () => {
    if (expirationDate.length === 0) {
      return false;
    }
    return true;
  };
  const isExpirationTimeValid = () => {
    if (expirationTime.length === 0) {
      return false;
    }
    return true;
  };

  const isFormValid = () => {
    // Check if the fields are valid
    if (
      !isStringValid(itemName) ||
      !isStringValid(description) ||
      !isStringValid(category) ||
      !isStartBidValid() ||
      !isExpirationDateValid() ||
      !isExpirationTimeValid()
    ) {
      if (!isStringValid(itemName)) {
        setItemNameClass("field__input field__input--invalid");
      } else {
        setItemNameClass("field__input");
      }
      if (!isStringValid(description)) {
        setDescriptionClass("field__input field__input--invalid");
      } else {
        setDescriptionClass("field__input");
      }
      if (!isStringValid(category)) {
        setCategoryClass("field__input field__input--invalid");
      } else {
        setCategoryClass("field__input");
      }
      if (!isStartBidValid()) {
        setStartBidClass("field__input field__input--invalid");
      } else {
        setStartBidClass("field__input");
      }
      if (!isExpirationDateValid()) {
        setExpirationDateClass("field__input field__input--invalid");
      } else {
        setExpirationDateClass("field__input");
      }
      if (!isExpirationTimeValid()) {
        setExpirationTimeClass("field__input field__input--invalid");
      } else {
        setExpirationTimeClass("field__input");
      }

      return false;
    } else {
      setItemNameClass("field__input");
      setDescriptionClass("field__input");
      setCategoryClass("field__input");
      setStartBidClass("field__input");
      setExpirationDateClass("field__input");
      setExpirationTimeClass("field__input");

      return true;
    }
  };

  const clearState = () => {
    setItemName("");
    setDescription("");
    setCategory("");
    setStartBid("");
    setExpirationDate("");
    setExpirationTime("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const postItem = async (req, res) => {
      try {
        const token = sessionStorage.getItem("token");
        console.log(token);

        const formData = new FormData();
        formData.append("image", imageFile);
        formData.append("name", itemName);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("start_bid", startBid);
        formData.append("expiration_date", expirationDate);
        formData.append("expiration_time", expirationTime);

        await axios.post(`${baseURL}/items`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/");
      } catch (error) {
        console.error(error);
      }
    };

    if (!isFormValid()) {
      alert("Invalid Fields");
    } else {
      postItem();
      clearState();
      navigate("/profile");
    }
  };

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
      <main className="post-item">
        <div className="post-item__title-container">
          <img
            className="post-item__close"
            src={closeIcon}
            alt=""
            onClick={() => navigate("/profile")}
          />
          <h1 className="post-item__title">Upload an Item</h1>
        </div>
        <div className="post-item__form-container">
          <form className="post-item__form" onSubmit={handleSubmit}>
            <Input
              type={"text"}
              name={"itemName"}
              label={"Item Name"}
              onChange={handleItemNameChange}
              inputClass={itemNameClass}
              labelClass={"field__label-item"}
              value={itemName}
              placeholder={"Enter the item's name"}
            />
            <Input
              type={"description"}
              name={"description"}
              label={"Description"}
              onChange={handleDescriptionChange}
              inputClass={descriptionClass}
              labelClass={"field__label-item"}
              value={description}
              placeholder={"Enter a description"}
            />

            <Input
              type={"text"}
              name={"category"}
              label={"Category"}
              onChange={handleCategoryChange}
              inputClass={categoryClass}
              labelClass={"field__label-item"}
              value={category}
              placeholder={"Enter a category"}
            />
            <Input
              type={"text"}
              name={"startBid"}
              label={"Start Bid"}
              onChange={handleStartBidChange}
              inputClass={startBidClass}
              labelClass={"field__label-item"}
              value={startBid}
              placeholder={"Enter a starting bid"}
            />
            <Input
              type={"text"}
              name={"expirationDate"}
              label={"Expiration Date"}
              labelClass={"field__label-item"}
              onChange={handleExpirationDateChange}
              inputClass={expirationDateClass}
              value={expirationDate}
              placeholder={"Enter an expiration date"}
            />
            <Input
              type={"text"}
              name={"expirationTime"}
              label={"Expiration Time"}
              labelClass={"field__label-item"}
              onChange={handleExpirationTimeChange}
              inputClass={expirationTimeClass}
              value={expirationTime}
              placeholder={"Enter an expiration time"}
            />

            <div className="post-item__form-image">
              <label htmlFor="image" className="post-item__form-image__label">
                Image
              </label>
              <img
                src={imagePreview || "https://placehold.co/250"}
                className="post-item__form-image__img"
                alt="preview"
              />
              <input
                type="file"
                name="image"
                className="post-item__form-image__input"
                onChange={(e) => {
                  setImagePreview(URL.createObjectURL(e.target.files[0]));
                  setImageFile(e.target.files[0]);
                }}
              />
            </div>
            <div className="post-item__form-buttons">
              <button className="post-item__form-buttons__btn">Submit</button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
};

export default PostItemModal;
