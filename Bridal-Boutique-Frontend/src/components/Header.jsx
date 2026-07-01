import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";


const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

import botikLogo from "../assets/Botik.png";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const dropdownRef = useRef(null);
  const { cartCount, wishlistCount } = useStore();
  const { user, logout } = useAuth();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const activeCategoryId = params.get("category_id") || "";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const companyId = params.get("company_id");
        let url = `${API_BASE}/category/get_active_category.php`;
        if (companyId) {
          url += `?company_id=${companyId}`;
        }
        const response = await axios.get(url);
        if (response.data?.status) {
          setAllCategories(response.data.data || []);
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    fetchCategories();
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1220px] mx-auto h-[82px] px-4 lg:px-0 flex items-center justify-between">

          {/* LEFT */}

          <div className="flex items-center gap-6 flex-1">

            {/* Desktop Shop Button */}

            <div className="relative hidden lg:flex" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 border border-[#D8D8D8] rounded-md px-4 h-[40px] text-[14px] font-medium hover:bg-gray-50 transition"
              >
                <Menu size={15} />
                <span>Shop All</span>
              </button>

              <div
                className={`absolute left-0 top-[calc(100%_+_8px)] z-40 w-[240px] rounded-2xl border border-[#e5e7eb] bg-white shadow-lg transition-opacity duration-200 ${dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
              >
                <div className="max-h-[360px] overflow-y-auto py-2">
                  {allCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/bridal-lehenga?category_id=${category.id}`}
                      className={`block w-full px-4 py-3 text-left text-sm text-[#181818] hover:bg-[#f8f7f2] ${activeCategoryId === String(category.id) ? "font-semibold text-[#a97c50]" : ""}`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Menu */}

            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden"
            >
              <Menu size={25} />
            </button>

            {/* Desktop Navigation */}

            <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#181818]">
              {allCategories.slice(0, 3).map((category) => (
                <Link
                  key={category.id}
                  to={`/bridal-lehenga?category_id=${category.id}`}
                  className={`hover:text-[#a97c50] ${activeCategoryId === String(category.id) ? "text-[#a97c50] font-semibold" : ""}`}
                >
                  {category.name}
                </Link>
              ))}
            </nav>

          </div>

          {/* LOGO */}

          <div className="flex flex-col items-center flex-shrink-0">

            <Link to="/">
              <img
                src={botikLogo}
                alt="BOTIK"
                className="w-[120px] md:w-[185px]"
              />
            </Link>

          </div>

          {/* RIGHT */}

          <div className="flex items-center justify-end gap-3 md:gap-5 flex-1">

            {/* Desktop Search */}

            <div className="hidden md:flex items-center w-[280px] h-[42px] border border-[#D8D8D8] rounded-md px-4">

              <input
                placeholder="Search"
                className="flex-1 outline-none text-sm"
              />

              <Search size={20} />

            </div>

            {/* Mobile Search */}

            <Search
              size={22}
              className="md:hidden cursor-pointer"
            />

            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#181818]">Hi, {user.name}</span>
                <button onClick={logout} className="text-sm font-medium text-[#181818] hover:text-[#a97c50]">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login">
                <User size={22} className="cursor-pointer" />
              </Link>
            )}

            <Link to="/wishlist" className="relative">
              <Heart size={22} className={`${wishlistCount > 0 ? "text-red-600" : "text-black"} cursor-pointer`} />
              <span className="absolute -top-2 -right-2 rounded-full bg-[#a97c50] px-1.5 py-0.5 text-[10px] text-white">{wishlistCount}</span>
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingBag size={22} className="cursor-pointer" />
              <span className="absolute -top-2 -right-2 rounded-full bg-[#a97c50] px-1.5 py-0.5 text-[10px] text-white">{cartCount}</span>
            </Link>

          </div>
        </div>
      </header>

      {/* Overlay */}

      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          menuOpen
            ? "opacity-100 visible"
            : "opacity-0 invisible"
        }`}
      />

      {/* Mobile Drawer */}

      <div
        className={`fixed top-0 left-0 h-full w-[290px] bg-white z-[70] transition-transform duration-300 ${
          menuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Header */}

        <div className="flex items-center justify-between px-5 h-[70px] border-b">

          <img
            src={botikLogo}
            alt=""
            className="w-[110px]"
          />

          <button
            onClick={() => setMenuOpen(false)}
          >
            <X size={24} />
          </button>

        </div>

        {/* Search */}

        <div className="p-5">

          <div className="flex items-center border rounded-md h-11 px-3">

            <input
              placeholder="Search Products"
              className="flex-1 outline-none text-sm"
            />

            <Search size={20} />

          </div>


        </div>

        {/* Menu */}

        <nav className="px-5 flex flex-col">
          {allCategories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              to={`/bridal-lehenga?category_id=${category.id}`}
              className={`py-4 border-b font-medium ${activeCategoryId === String(category.id) ? "text-[#a97c50] font-semibold" : ""}`}
            >
              {category.name}
            </Link>
          ))}

          <Link
            to="/bridal-lehenga"
            className="py-4 border-b font-medium"
            onClick={() => setMenuOpen(false)}
          >
            Shop All
          </Link>
        </nav>

        {/* Bottom Icons */}

        <div className="absolute bottom-0 left-0 right-0 border-t">

          <div className="grid grid-cols-3">

            {user ? (
              <button onClick={logout} className="flex flex-col items-center py-4 gap-2">
                <User size={22} />
                <span className="text-xs">Logout</span>
              </button>
            ) : (
              <Link to="/login" className="flex flex-col items-center py-4 gap-2">
                <User size={22} />
                <span className="text-xs">Login</span>
              </Link>
            )}

            <Link to="/wishlist" className="flex flex-col items-center py-4 gap-2">
              <Heart size={22} className={`${wishlistCount > 0 ? "text-red-600" : "text-black"}`} />
              <span className="text-xs">Wishlist</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center py-4 gap-2">
              <ShoppingBag size={22} />
              <span className="text-xs">Cart</span>
            </Link>

          </div>

        </div>
      </div>
    </>
  );
}

export default Header;