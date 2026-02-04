import { AppConfig } from "./types";

export const API_URL = "http://localhost:1337";

export const DEFAULT_CONFIG: AppConfig = {
  globalTheme: {
    bgColor: "#0A0A0A",
    boxColor: "rgba(255, 255, 255, 0.02)",
    textColor: "#8E8E8E",
    accentColor: "#B0925A",
    fontUrl:
      "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,700;1,300&display=swap",
    fontName: "Pretendard",
  },
  logos: {
    leftLogo: "images/logo_left.png",
    leftLink: "https://www.catholic.ac.kr/",
    rightLogo: "images/logo_right.png",
    rightLink: "",
    applyFilter: true,
  },
  heroSection: {
    title: {
      text: "데이터 로딩 중...",
      color: "#FFFFFF",
      isBold: true,
      isItalic: true,
      isUnderline: false,
      fontSize: "4rem",
      fontFamily: "Merriweather",
      letterSpacing: "0px",
    },
    mainSubtitle: {
      text: "",
      color: "#FFFFFF",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: "1.1rem",
      fontFamily: "Merriweather",
      letterSpacing: "2px",
    },
    subtitle: {
      text: "",
      color: "#B0925A",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: "1.1rem",
      fontFamily: "Merriweather",
      letterSpacing: "2px",
    },
    datePlace: {
      text: "",
      color: "#FFFFFF",
      isBold: false,
      isItalic: false,
      isUnderline: false,
      fontSize: "0.95rem",
      fontFamily: "Pretendard",
      letterSpacing: "3px",
    },
  },
  backgrounds: {
    heroBg: "images/background.png",
    heroBgBrightness: 0.25,
    heroBgContrast: 1.15,
    programBg: "",
  },
  programList: [
    {
      id: "intro",
      sessionTag: {
        text: "INTRODUCTION",
        color: "#B0925A",
        isBold: true,
        fontSize: "0.7rem",
        fontFamily: "Pretendard",
        letterSpacing: "4px",
      },
      sessionName: {
        text: "Opening Remarks",
        color: "#FFFFFF",
        isBold: false,
        fontSize: "1.3rem",
        fontFamily: "Merriweather",
        letterSpacing: "0px",
      },
      speakers: [
        {
          id: "s_intro_1",
          time: {
            text: "08:55 - 09:00",
            color: "#B0925A",
            isBold: true,
            fontSize: "0.75rem",
            fontFamily: "Merriweather",
            letterSpacing: "0px",
          },
          name: {
            text: "오세일 교수 (서울대병원)",
            color: "#8E8E8E",
            isItalic: false,
            fontSize: "0.85rem",
            fontFamily: "Pretendard",
            letterSpacing: "0px",
          },
          org: {
            text: "대한부정맥학회 이사장 인사말",
            color: "#FFFFFF",
            isBold: false,
            fontSize: "1.15rem",
            fontFamily: "Pretendard",
            letterSpacing: "0px",
          },
          photoUrl: "images/Oh_Seil.png",
          detailUrl:
            "https://www.notion.so/synergyai/2ce1efa583fa8006ab5ac8fcb45f355e",
          showDetail: true,
        },
      ],
    },
  ],
  adSettings: {
    ads: [
      {
        id: "ad1",
        imageUrl: "images/ad_1.png",
        targetUrl: "https://velvety-halva-29338a.netlify.app/",
      },
    ],
    adDuration: 5,
    displayMode: "random",
  },
  footer: {
    text: {
      text: "Prediction, Medicines's New Language | Mac'AI",
      color: "#B0925A",
      isItalic: true,
      fontSize: "1rem",
      fontFamily: "Merriweather",
      letterSpacing: "0.5px",
    },
    copyright: {
      text: "DEDICATED TO THE PIONEERS OF CARDIOLOGY.\n© 2026 THE CATHOLIC UNIVERSITY OF KOREA & SYNERGY AI. ALL RIGHTS RESERVED.",
      color: "#444444",
      fontSize: "0.65rem",
      fontFamily: "Pretendard",
      letterSpacing: "3px",
    },
  },
  programTitle: {
    text: "SCIENTIFIC PROGRAM",
    color: "#B0925A",
    isBold: true,
    fontSize: "0.8rem",
    fontFamily: "Merriweather",
    letterSpacing: "8px",
  },
};
