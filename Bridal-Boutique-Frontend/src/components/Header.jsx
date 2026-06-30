import {
  Menu,
  Search,
  User,
  Heart,
  ShoppingBag,
} from "lucide-react";

function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 lg:px-8">

        {/* Left */}
        <div className="flex items-center gap-8">

          <button className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100">
            <Menu size={16} />
            Shop All
          </button>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-black">
              Bridal Lehenga
            </a>

            <a href="#" className="hover:text-black">
              Bridal Gowns
            </a>

            <a href="#" className="hover:text-black">
              Dress Materials
            </a>
          </nav>

        </div>

        {/* Logo */}

        <div className="absolute left-1/2 -translate-x-1/2 text-center">

          <h1 className="text-4xl font-black tracking-widest">
            BOTIK
          </h1>

          <p className="text-xs tracking-[8px] text-gray-500">
            FASHION
          </p>

        </div>

        {/* Right */}

        <div className="flex items-center gap-5">

          <div className="hidden md:flex items-center rounded-md border border-gray-300 px-3">

            <input
              type="text"
              placeholder="Search"
              className="h-10 w-52 outline-none"
            />

            <Search size={18} />

          </div>

          <User className="cursor-pointer" size={21} />

          <Heart className="cursor-pointer" size={21} />

          <ShoppingBag className="cursor-pointer" size={21} />

        </div>

      </div>
    </header>
  );
}

export default Header;