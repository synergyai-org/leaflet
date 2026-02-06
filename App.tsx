import React, { useState, useEffect, useCallback } from "react";
import { AppConfig, Speaker } from "./types";
import { DEFAULT_CONFIG } from "./constants";
import { loadConfigFromHospitalByCode } from "./services/strapiService";
import { getDirectImageUrl } from "./utils/urlHelper";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProgramList from "./components/ProgramList";
import AdModal from "./components/AdModal";
import Toast from "./components/Toast";
import RenderStyled from "./components/common/RenderStyled";

const App: React.FC = () => {
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);
  const [showAd, setShowAd] = useState(false);

  const getHospitalCodeFromUrl = (): string => {
    const hostname = window.location.hostname;

    if (hostname === "localhost") {
      return "leaflet";
    }

    // subdomain 추출 (cmcseoul.synergyai.co -> cmcseoul)
    const subdomain = hostname.split(".")[0];
    return subdomain;
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const root = document.documentElement;
    const accent = config.globalTheme.accentColor;

    root.style.setProperty("--matte-black", config.globalTheme.bgColor);
    root.style.setProperty("--dark-gold", accent);
    root.style.setProperty("--light-gold", accent + "cc");
    root.style.setProperty("--border-color", accent + "40");
    root.style.setProperty("--glow-color", accent + "33");

    if (config.pageTitle) {
      document.title = config.pageTitle;
    }

    if (config.globalTheme.fontUrl) {
      const link = document.createElement("link");
      link.href = config.globalTheme.fontUrl;
      link.rel = "stylesheet";
      document.head.appendChild(link);
      return () => {
        try {
          document.head.removeChild(link);
        } catch (e) {}
      };
    }
  }, [config.globalTheme, config.pageTitle]);

  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const hospitalCode = getHospitalCodeFromUrl();

      const strapiConfig = await loadConfigFromHospitalByCode(hospitalCode);
      setConfig(strapiConfig);

      console.log("✅ Successfully loaded hospital data:", strapiConfig);
    } catch (error) {
      console.error("❌ Failed to load hospital data:", error);
      setConfig(DEFAULT_CONFIG);

      const hospitalCode = getHospitalCodeFromUrl();
      const isDefaultCode = hospitalCode === "leaflet";

      setToast({
        message: isDefaultCode
          ? "데이터 로딩에 실패했습니다. 기본 설정을 사용합니다."
          : `병원 코드 '${hospitalCode}'를 찾을 수 없습니다. 기본 설정을 사용합니다.`,
        type: "error",
      });
    } finally {
      if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    // URL 변경 시 데이터 다시 로드 (브라우저 뒤로가기, 앞으로가기 등)
    const handlePopState = () => {
      console.log("🔄 URL changed, reloading data...");
      loadData();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [loadData]);

  const handleSpeakerClick = (speaker: Speaker) => {
    if (!speaker.showDetail || !speaker.detailUrl) return;
    setSelectedSpeaker(speaker);
    setShowAd(true);
  };

  if (config.heroSection.title.text === "Loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="leading-[1.1] hero-title-gradient drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] text-[24px]">
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        backgroundColor: config.globalTheme.bgColor,
        fontFamily: config.globalTheme.fontName,
        color: config.globalTheme.textColor,
      }}
    >
      <Header
        logos={config.logos}
        accentColor={config.globalTheme.accentColor}
        bgColor={config.globalTheme.bgColor}
      />

      <main>
        <Hero
          section={config.heroSection}
          accentColor={config.globalTheme.accentColor}
          backgrounds={config.backgrounds}
          bgColor={config.globalTheme.bgColor}
        />
        <div className="relative">
          {config.backgrounds.programBg && (
            <div
              className="absolute inset-0 -z-10 bg-cover bg-fixed opacity-10"
              style={{
                backgroundImage: `url('${getDirectImageUrl(config.backgrounds.programBg)}')`,
              }}
            />
          )}
          <ProgramList
            programTitle={config.programTitle}
            programs={config.programList}
            onSpeakerClick={handleSpeakerClick}
            accentColor={config.globalTheme.accentColor}
            boxColor={config.globalTheme.boxColor}
          />
        </div>
      </main>

      <footer
        className="py-24 px-10 flex flex-col items-center gap-6 border-t border-white/5"
        style={{ backgroundColor: config.globalTheme.bgColor }}
      >
        <div className="flex justify-center items-center opacity-90 drop-shadow-sm w-full">
          <RenderStyled
            data={config.footer.text}
            isFluid={true}
            className="text-lg md:text-xl font-serif"
          />
        </div>

        <div
          className="h-[1px] w-full max-w-lg opacity-10"
          style={{
            background: `linear-gradient(to right, transparent, ${config.globalTheme.accentColor}, transparent)`,
          }}
        />

        <div className="whitespace-pre-line max-w-4xl mx-auto opacity-30 leading-relaxed scale-95 md:scale-100">
          <RenderStyled data={config.footer.copyright} isFluid={true} />
        </div>
      </footer>

      {showAd && config.adSettings.ads.length > 0 && (
        <AdModal
          settings={config.adSettings}
          bgColor={config.globalTheme.bgColor}
          onComplete={() => {
            window.open(selectedSpeaker?.detailUrl, "_blank");
            setShowAd(false);
          }}
          onCancel={() => setShowAd(false)}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}
      {loading && (
        <div className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="w-12 h-12 border-t-2 border-[#B0925A] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default App;
