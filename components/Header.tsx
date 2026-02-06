import React from "react";
import { Logos } from "../types";
import { getDirectImageUrl } from "../utils/urlHelper";

interface HeaderProps {
  logos: Logos;
  accentColor: string;
  bgColor: string;
}

const Header: React.FC<HeaderProps> = ({ logos, accentColor, bgColor }) => {
  const filterClass = logos.applyFilter
    ? "filter brightness-0 saturate-100 invert-[64%] sepia-[11%] saturate-[1637%] hue-rotate-[7deg] brightness-[94%] contrast-[88%]"
    : "";

  return (
    <header
      className="fixed top-0 left-0 right-0 h-24 z-40 flex items-center justify-between px-8 md:px-14 transition-all pointer-events-auto"
      style={{
        background: `linear-gradient(to bottom, ${bgColor}, transparent)`,
      }}
    >
      <div className="flex items-center gap-4 md:gap-6">
        {logos.leftLogo ? (
          <a
            href={logos.leftLink}
            target="_blank"
            rel="noopener noreferrer"
            className="h-7 md:h-8 opacity-90 transition-all hover:opacity-100 block"
          >
            <img
              src={getDirectImageUrl(logos.leftLogo)}
              alt="Left Logo"
              className={`h-full w-auto object-contain ${filterClass}`}
            />
          </a>
        ) : (
          <div className="h-7 md:h-8 opacity-90 transition-all hover:opacity-100"></div>
        )}
      </div>

      <div className="h-5 md:h-6 flex items-center">
        {logos.rightLogo ? (
          <a
            href={logos.rightLink}
            target="_blank"
            rel="noopener noreferrer"
            className="h-full opacity-80 transition-all hover:opacity-100 block"
          >
            <img
              src={getDirectImageUrl(logos.rightLogo)}
              alt="Right Logo"
              className={`h-full w-auto object-contain ${filterClass}`}
            />
          </a>
        ) : (
          <div className="h-full opacity-80 transition-all hover:opacity-100"></div>
        )}
      </div>
    </header>
  );
};

export default Header;
