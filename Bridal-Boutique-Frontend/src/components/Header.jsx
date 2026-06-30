import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";

import botikLogo from "../assets/Botik.png";

function Header() {
  return (
<header className="fixed top-0 left-0 right-0 z-50 bg-white border-0 shadow-none">
<div className="max-w-[1220px] mx-auto px-0 h-[82px] flex items-center justify-between">        {/* LEFT */}
        <div className="flex items-center gap-6 flex-1">

          <button className="flex items-center gap-2 border border-[#D8D8D8] rounded-md px-4 h-[40px] text-[14px] font-medium hover:bg-gray-50 transition">
            <Menu size={15} />
            <span>Shop All</span>
          </button>

          <nav className="hidden lg:flex items-center gap-7 text-[14px] font-medium text-[#181818]">
            <a href="#">Bridal Lehenga</a>
            <a href="#">Bridal Gowns</a>
            <a href="#">Dress Materials</a>
          </nav>

        </div>

        {/* LOGO */}

        <div className="flex flex-col items-center flex-shrink-0 px-8">

          <img
            src={botikLogo}
            alt="BOTIK"
            className="w-[145px]"
          />

          <span className="mt-[2px] text-[12px] tracking-[8px] uppercase">
            FASHION
          </span>

        </div>

        {/* RIGHT */}

        <div className="flex items-center justify-end gap-5 flex-1">

          <div className="hidden md:flex items-center w-[280px] h-[42px] border border-[#D8D8D8] rounded-md px-4">

            <input
              placeholder="Search"
              className="flex-1 outline-none text-sm"
            />

            <Search size={22} />

          </div>

          <User size={23} />

          <Heart size={23} />

          <ShoppingBag size={23} />

        </div>

      </div>
    </header>
  );
}

export default Header;