import React, { useEffect, useState } from "react";
import Marketplace from "../../components/Marketplace/Marketplace";
import Header from "../../components/Header/Header";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  const [searchIconVisibility, setSearchIconVisibility] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  useEffect(() => {
    const checkToken = () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      setIsLoggedIn(true);
      return;
    };
    checkToken();
  }, []);

  const handleLogout = () => {
    // Remove token from storage
    sessionStorage.removeItem("token");
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
  };

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
      <main>
        <Marketplace searchInput={searchInput} />
      </main>
    </>
  );
};

export default Home;
