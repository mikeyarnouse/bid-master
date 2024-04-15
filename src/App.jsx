import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ItemDetails from "./pages/ItemDetails/ItemDetails";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import "./App.scss";
import Profile from "./pages/Profile/Profile";
import PostItem from "./pages/PostItem/PostItem";
import EditProfile from "./pages/EditProfile/EditProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/post" element={<PostItem />} />
        <Route path="/items/:itemId" element={<ItemDetails />} />
        {/* <Route path="/users/:userName" element={<UserDetails />}/> */}
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
