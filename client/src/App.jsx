import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import CreateNews from "./pages/CreateNews";
import UpdateListing from "./pages/UpdateListing";
import UpdateNews from "./pages/UpdateNews";
import Listing from "./pages/Listing";
import News from "./pages/News";
import Search from "./pages/Search";
import Properties from "./pages/Properties";
import Footer from "./components/Footer";
import ContactUs from "./pages/ContactUs";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/news/:id" element={<News />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/update-listing/:listingId" element={<UpdateListing />} />
          <Route path="/update-news/:id" element={<UpdateNews />} />
          <Route path="/create-news" element={<CreateNews />} />
        </Route>
      </Routes>
      <Footer/>
    </BrowserRouter>
  );
}
