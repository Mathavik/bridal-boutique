import { Phone, Mail } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

import botikLogo from "../assets/Botik.png";

function Footer() {
  return (
    <footer className="w-full bg-white mt-24">

      <div className="max-w-[1280px] mx-auto px-2">

        {/* Top Border */}

        <div className="border-t border-[#E5E5E5]"></div>

        {/* Main Footer */}

        <div className="grid grid-cols-1 md:grid-cols-[250px_150px_150px_170px_210px] justify-between gap-10 py-[60px]">

          {/* Logo */}

          <div>

            <img
              src={botikLogo}
              alt="BOTIK"
              className="w-[135px]"
            />

            <p className="mt-[2px] text-[12px] tracking-[8px] uppercase text-black">
              FASHION
            </p>

            <p className="mt-8 w-[215px] text-[12px] leading-[18px] text-[#111111]">
              A Social Impact Enterprise run by ex-servicemen.
              100 acres of organic farmland in Hyderabad,
              working towards dignified livelihoods through
              natural precision farming.
            </p>

          </div>

          {/* Customer Care */}

          <div>

            <h3 className="text-[13px] font-semibold uppercase mb-5 tracking-wide">
              CUSTOMER CARE
            </h3>

            <ul className="space-y-[10px] text-[12px] text-[#111111]">

              <li>
                <a href="#">Orders & Shipment</a>
              </li>

              <li>
                <a href="#">Returns & Exchange</a>
              </li>

              <li>
                <a href="#">Contact Us</a>
              </li>

              <li>
                <a href="#">FAQs</a>
              </li>

            </ul>

          </div>

          {/* Experience */}

          <div>

            <h3 className="text-[13px] font-semibold uppercase mb-5 tracking-wide">
              EXPERIENCE
            </h3>

            <ul className="space-y-[10px] text-[12px] text-[#111111]">

              <li>
                <a href="#">About Us</a>
              </li>

              <li>
                <a href="#">Contact Us</a>
              </li>

              <li>
                <a href="#">Bulk Orders</a>
              </li>

              <li>
                <a href="#">Sitemap</a>
              </li>

            </ul>

          </div>

          {/* Explore */}

          <div>

            <h3 className="text-[13px] font-semibold uppercase mb-5 tracking-wide">
              EXPLORE
            </h3>

            <ul className="space-y-[10px] text-[12px] text-[#111111]">

              <li>
                <a href="#">Lehenga</a>
              </li>

              <li>
                <a href="#">Gowns</a>
              </li>

              <li>
                <a href="#">Bridal Collections</a>
              </li>

              <li>
                <a href="#">Dress Materials</a>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-[13px] font-semibold uppercase mb-5 tracking-wide">
              CONTACT US
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3 text-[12px]">

                <Phone size={15} strokeWidth={2} />

                <span>+91 93899 03752</span>

              </div>

              <div className="flex items-center gap-3 text-[12px]">

                <Mail size={15} strokeWidth={2} />

                <span>info@botikfashion.in</span>

              </div>

            </div>

            <h3 className="text-[13px] font-semibold uppercase mt-10 mb-4 tracking-wide">
              FOLLOW US
            </h3>

            <div className="flex items-center gap-4 text-[16px]">

              <a href="#">
                <FaFacebookF />
              </a>

              <a href="#">
                <FaInstagram />
              </a>

              <a href="#">
                <FaYoutube />
              </a>

            </div>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-[#E5E5E5] h-[66px] flex flex-col md:flex-row items-center justify-between">

          <p className="text-[12px] text-[#222222]">
            © 2026 Botik Fashion. All rights reserved.
          </p>

          <div className="flex items-center gap-6 text-[12px] text-[#222222] mt-3 md:mt-0">

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Refund Policy
            </a>

            <a href="#">
              Terms of Use
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;