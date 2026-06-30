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
<header className="w-full bg-white border-b border-[#ECECEC] mt-[30px]">
        <div className="max-w-[1280px] mx-auto h-[88px] px-6 lg:px-10 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-8 flex-1">

          <button className="flex items-center gap-2 border border-[#D7D7D7] rounded-md px-4 h-[40px] text-[14px] font-medium hover:bg-gray-50 duration-200">
            <Menu size={15} strokeWidth={2} />
            <span>Shop All</span>
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-[14px] text-[#181818] font-medium">

            <a href="#" className="hover:text-black duration-200">
              Bridal Lehenga
            </a>

            <a href="#" className="hover:text-black duration-200">
              Bridal Gowns
            </a>

            <a href="#" className="hover:text-black duration-200">
              Dress Materials
            </a>

          </nav>

        </div>

        {/* CENTER LOGO */}

        <div className="flex flex-col items-center justify-center flex-shrink-0 px-10">
  <img
    src={botikLogo}
    alt="BOTIK"
    className="w-[150px] h-auto"
  />

  <span
    className="mt-[2px] text-[13px] uppercase tracking-[8px] text-[#181818]"
  >
    FASHION
  </span>
</div>

        {/* RIGHT */}

        <div className="flex items-center justify-end gap-6 flex-1">

          <div className="hidden md:flex items-center w-[275px] h-[42px] border border-[#D7D7D7] rounded-md px-4">

            <input
              type="text"
              placeholder="Search"
              className="flex-1 text-[14px] outline-none bg-transparent"
            />

            <Search
              size={22}
              strokeWidth={2}
              className="cursor-pointer"
            />

          </div>

          <User
            size={24}
            strokeWidth={2}
            className="cursor-pointer hover:scale-110 duration-200"
          />

          <Heart
            size={24}
            strokeWidth={2}
            className="cursor-pointer hover:scale-110 duration-200"
          />

          <ShoppingBag
            size={24}
            strokeWidth={2}
            className="cursor-pointer hover:scale-110 duration-200"
          />

        </div>

      </div>

      {/* MOBILE */}

      <div className="lg:hidden border-t border-[#ECECEC] px-4 py-3 overflow-x-auto">

        <div className="flex gap-6 whitespace-nowrap text-sm">

          <a href="#">Bridal Lehenga</a>

          <a href="#">Bridal Gowns</a>

          <a href="#">Dress Materials</a>

        </div>

      </div>

    </header>
  );
}

export default Header;