import React, { useEffect, useRef } from "react";
import { HeroSection, Backgrounds } from "../types";
import { getDirectImageUrl } from "../utils/urlHelper";
import RenderStyled from "./common/RenderStyled";

declare const gsap: any;
declare const ScrollTrigger: any;

interface HeroProps {
  section: HeroSection;
  accentColor: string;
  backgrounds: Backgrounds;
  bgColor: string;
}

const Hero: React.FC<HeroProps> = ({
  section,
  accentColor,
  backgrounds,
  bgColor,
}) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const brightness = backgrounds.heroBgBrightness ?? 0.5;
  const contrast = backgrounds.heroBgContrast ?? 1.1;

  useEffect(() => {
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      const timer = setTimeout(() => {
        const heroElement = document.querySelector(".hero-main");

        if (
          heroElement &&
          heroRef.current &&
          bgRef.current &&
          contentRef.current
        ) {
          const ctx = gsap.context(() => {
            gsap.fromTo(
              bgRef.current,
              { opacity: 0, scale: 1.1 },
              { opacity: 1, scale: 1, duration: 2.5, ease: "power2.out" },
            );

            gsap.to(bgRef.current, {
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
              y: "25%",
              opacity: 0,
              scale: 1.1,
              "--hero-blur": "40px",
              "--hero-brightness-mod": 0,
              immediateRender: false,
              overwrite: "auto",
            });

            gsap.to(contentRef.current, {
              scrollTrigger: {
                trigger: heroRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
              y: -80,
              opacity: 0,
              immediateRender: false,
            });
          }, heroRef);

          return () => ctx.revert();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  const dividerStyle: React.CSSProperties = {
    background: `linear-gradient(to right, transparent, ${accentColor}44, ${accentColor}, ${accentColor}44, transparent)`,
    height: "1px",
    width: "100%",
    maxWidth: "600px",
    opacity: 0.5,
  };

  return (
    <section
      ref={heroRef}
      className="hero-main relative h-[95vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 z-0 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: backgrounds.heroBg
            ? `url('${getDirectImageUrl(backgrounds.heroBg)}')`
            : "none",
          filter: `brightness(calc(${brightness} * var(--hero-brightness-mod, 1))) contrast(${contrast}) blur(var(--hero-blur, 0px))`,
          ["--hero-brightness-mod" as any]: 1,
          ["--hero-blur" as any]: "0px",
        }}
      ></div>
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${bgColor}CC 60%, ${bgColor} 100%)`,
        }}
      ></div>
      <div
        ref={contentRef}
        className="relative z-20 space-y-12 w-full max-w-[95vw] mx-auto flex flex-col items-center"
      >
        <div className="space-y-4 w-full px-4">
          <RenderStyled
            data={section.subtitle}
            isFluid={true}
            className="opacity-90 block tracking-[3px] uppercase"
          />
          <h1 className="leading-[1.1] hero-title-gradient drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] mb-4 w-full">
            <RenderStyled
              data={section.title}
              isFluid={true}
              className="block"
            />
          </h1>
          <div className="opacity-80 block tracking-[1px] w-full">
            <RenderStyled
              data={section.mainSubtitle}
              isFluid={true}
              className="block italic font-light"
            />
          </div>
        </div>
        <div className="w-full flex flex-col items-center gap-6">
          <div style={dividerStyle}></div>
          <div className="py-1 text-white font-extralight tracking-[4px] uppercase drop-shadow-md opacity-80 w-full">
            <RenderStyled data={section.datePlace} isFluid={true} />
          </div>
          <div style={dividerStyle}></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
