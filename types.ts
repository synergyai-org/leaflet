
export interface StyledText {
  text: string;
  color?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
  fontSize?: string;
  fontFamily?: string;
  letterSpacing?: string;
  textAlign?: 'left' | 'center' | 'right';
  isFluid?: boolean;
}

export interface GlobalTheme {
  bgColor: string;
  boxColor: string;
  textColor: string;
  accentColor: string;
  fontUrl: string;
  fontName: string;
}

export interface Logos {
  leftLogo: string;
  leftLink: string;
  rightLogo: string;
  rightLink: string;
  applyFilter: boolean;
}

export interface HeroSection {
  title: StyledText;
  mainSubtitle: StyledText;
  subtitle: StyledText;
  datePlace: StyledText;
}

export interface Backgrounds {
  heroBg: string;
  heroBgBrightness?: number;
  heroBgContrast?: number;
  programBg: string;
}

export interface Speaker {
  id: string;
  time: StyledText;
  name: StyledText;
  org: StyledText;
  photoUrl: string;
  detailUrl: string;
  showDetail: boolean;
}

export interface Program {
  id: string;
  sessionTag: StyledText;
  sessionName: StyledText;
  speakers: Speaker[];
  defaultOpen?: boolean;
}

export interface AdItem {
  id: string;
  imageUrl: string;
  targetUrl: string;
}

export interface AdSettings {
  ads: AdItem[];
  adDuration: number;
  displayMode: 'random' | 'sequential';
}

export interface Footer {
  text: StyledText;
  copyright: StyledText;
}

export interface AppConfig {
  globalTheme: GlobalTheme;
  logos: Logos;
  heroSection: HeroSection;
  backgrounds: Backgrounds;
  programList: Program[];
  adSettings: AdSettings;
  footer: Footer;
  programTitle: StyledText;
}

// 멀티 리플렛 관리를 위한 타입
export interface LeafletMetadata {
  id: string;
  title: string;
  updatedAt: string | Date;
}
