"use client";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrain, faHouse } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <header>
      <div className="bg-teal-800 py-2">
        <div
          className={twMerge(
            "mx-4 max-w-2xl md:mx-auto",
            "flex items-center justify-between",
            "text-lg font-bold text-white"
          )}
        >
          <div>
            <FontAwesomeIcon icon={faTrain} className="mr-1" />
            CoordRouteMapMaker
          </div>
          <div>
            <Link href="/">
              <FontAwesomeIcon icon={faHouse} className="mr-1" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
