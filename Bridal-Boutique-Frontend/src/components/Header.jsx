import { useEffect, useRef, useState } from "react";
import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost/bridal-boutique/Bridal-Boutique-backend/api";

import botikLogo from "../assets/Botik.png";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";
import UserDropdown from "./UserDropdown";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { cartCount, wishlistCount } = useStore();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

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
    const handler = setTimeout(() => {
      const query = searchQuery.trim();
      if (!query) {
        setSuggestions([]);
        setSuggestionsOpen(false);
        setActiveSuggestionIndex(-1);
        setSearchLoading(false);
        return;
      }

      const fetchSuggestions = async () => {
        setSearchLoading(true);
        try {
          const response = await axios.get(`${API_BASE}/product/search.php`, {
            params: { q: query, limit: 6 },
          });
          if (response.data?.status) {
            setSuggestions(response.data.data || []);
            setSuggestionsOpen(true);
            setActiveSuggestionIndex(-1);
          }
        } catch (error) {
          console.error("Search suggestions failed:", error);
        } finally {
          setSearchLoading(false);
        }
      };

      fetchSuggestions();
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSuggestionsOpen(false);
        setActiveSuggestionIndex(-1);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setShowMobileSearch(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchNavigate = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSuggestionsOpen(false);
  };

  const handleKeyDown = (event) => {
    if (!suggestionsOpen || suggestions.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveSuggestionIndex((prev) => Math.max(prev - 1, 0));
    } else if (event.key === "Enter") {
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        const selection = suggestions[activeSuggestionIndex];
        navigate(`/product/${selection.id}`);
      } else {
        handleSearchNavigate(searchQuery);
      }
      setSuggestionsOpen(false);
    } else if (event.key === "Escape") {
      setSuggestionsOpen(false);
      setActiveSuggestionIndex(-1);
    }
  };

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
                className={`absolute left-0 top-[calc(100%_+_8px)] z-40 w-[240px] rounded-2xl border border-[#e5e7eb] bg-white shadow-lg transition-opacity duration-200 ${
                  dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <div className="max-h-[360px] overflow-y-auto py-2">
                  {allCategories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/bridal-lehenga?category_id=${category.id}`}
                      className={`block w-full px-4 py-3 text-left text-sm text-[#181818] hover:bg-[#f8f7f2] ${
                        activeCategoryId === String(category.id)
                          ? "font-semibold text-[#a97c50]"
                          : ""
                      }`}
                      onClick={() => setDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Menu */}
            <button onClick={() => setMenuOpen(true)} className="lg:hidden">
              <Menu size={25} />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#181818]">
              {allCategories.slice(0, 3).map((category) => (
                <Link
                  key={category.id}
                  to={`/bridal-lehenga?category_id=${category.id}`}
                  className={`hover:text-[#a97c50] ${
                    activeCategoryId === String(category.id)
                      ? "text-[#a97c50] font-semibold"
                      : ""
                  }`}
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
            <div ref={searchRef} className="relative hidden md:flex items-center w-[320px] h-[42px] border border-[#D8D8D8] rounded-md px-4 bg-white">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search"
                className="flex-1 outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => handleSearchNavigate(searchQuery)}
                className="text-gray-500"
              >
                {searchLoading ? (
                  <span className="text-[12px]">Loading...</span>
                ) : (
                  <Search size={20} />
                )}
              </button>

              {suggestionsOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl border border-[#E5E7EB] bg-white shadow-lg">
                  {suggestions.map((product, index) => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => navigate(`/product/${product.id}`)}
                      className={`w-full text-left flex items-center gap-3 px-3 py-3 transition hover:bg-[#f8f7f2] ${
                        activeSuggestionIndex === index ? "bg-[#f0efd8]" : ""
                      }`}
                    >
                      <img
                        src={product.image ? `${API_BASE}/${product.image}` : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f"}
                        alt={product.product_name}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold line-clamp-1">{product.product_name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{product.category_name || "Category"}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search */}
            <button
              type="button"
              onClick={() => setShowMobileSearch((prev) => !prev)}
              className="md:hidden"
            >
              <Search size={22} />
            </button>
            {showMobileSearch && (
              <div ref={mobileSearchRef} className="fixed inset-x-0 top-[82px] z-50 px-4 py-3 bg-white shadow-lg md:hidden">
                <div className="flex items-center gap-2 rounded-2xl border border-gray-300 bg-white px-3 py-2">
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent text-sm outline-none"
                    placeholder="Search products"
                  />
                  <button type="button" onClick={() => handleSearchNavigate(searchQuery)} className="text-gray-500">
                    {searchLoading ? <span className="text-[12px]">Loading...</span> : <Search size={20} />}
                  </button>
                </div>
              </div>
            )}

            {/* User Dropdown - Updated */}
            <UserDropdown />

            {/* Wishlist */}
            <Link to="/wishlist" className="relative">
              <Heart
                size={22}
                className={`${
                  wishlistCount > 0 ? "text-red-600" : "text-black"
                } cursor-pointer`}
              />
              <span className="absolute -top-2 -right-2 rounded-full bg-[#a97c50] px-1.5 py-0.5 text-[10px] text-white">
                {wishlistCount}
              </span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <ShoppingBag size={22} className="cursor-pointer" />
              <span className="absolute -top-2 -right-2 rounded-full bg-[#a97c50] px-1.5 py-0.5 text-[10px] text-white">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-[290px] bg-white z-[70] transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-[70px] border-b">
          <img src={botikLogo} alt="" className="w-[110px]" />
          <button onClick={() => setMenuOpen(false)}>
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
              className={`py-4 border-b font-medium ${
                activeCategoryId === String(category.id)
                  ? "text-[#a97c50] font-semibold"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
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
              <Link
                to="/profile"
                className="flex flex-col items-center py-4 gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <User size={22} />
                <span className="text-xs">Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center py-4 gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <User size={22} />
                <span className="text-xs">Login</span>
              </Link>
            )}

            <Link
              to="/wishlist"
              className="flex flex-col items-center py-4 gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <Heart
                size={22}
                className={`${
                  wishlistCount > 0 ? "text-red-600" : "text-black"
                }`}
              />
              <span className="text-xs">Wishlist</span>
            </Link>

            <Link
              to="/cart"
              className="flex flex-col items-center py-4 gap-2"
              onClick={() => setMenuOpen(false)}
            >
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