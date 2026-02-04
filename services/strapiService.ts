const STRAPI_BASE_URL =
  process.env.NODE_ENV === "development"
    ? ""
    : process.env.STRAPI_API_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export type TextComponent = {
  id: number;
  text: string;
  align: "Left" | "Center" | "Right";
  color: string;
  font: string;
  fontSize: string;
};

export type SpeakerComponent = {
  id: number;
  time: TextComponent;
  profile: TextComponent;
  subject: TextComponent;
  picture?: {
    url: string;
    alternativeText: string;
  };
  detail: boolean;
  detailUrl?: string;
};

export type SessionComponent = {
  id: number;
  tag: TextComponent;
  title: TextComponent;
  speaker: SpeakerComponent[];
};

export type LogosComponent = {
  id: number;
  leftLink?: string;
  rightLink?: string;
  applyFilter: boolean;
  leftLogo?: {
    url: string;
    alternativeText?: string;
    name: string;
    width?: number;
    height?: number;
  };
  rightLogo?: {
    url: string;
    alternativeText?: string;
    name: string;
    width?: number;
    height?: number;
  };
};

export type BackgroundsComponent = {
  id: number;
  heroBrightness: number;
  heroBgContrast: number;
  programBg?: string;
  heroBg?: {
    url: string;
    alternativeText?: string;
    name: string;
    width?: number;
    height?: number;
  };
};

export type GlobalThemeComponent = {
  id: number;
  bgColor: string;
  boxColor: string;
  textColor: string;
  accentColor: string;
  fontUrl: string;
  fontName: string;
};

export type AdsComponent = {
  id: number;
  image?: {
    url: string;
    alternativeText?: string;
    name: string;
  };
  targetUrl: string;
};

export type AdSettingsComponent = {
  id: number;
  adDuration: number;
  displayMode: string;
};

export type Hospital = {
  id: number;
  documentId?: string;
  name: string;
  subtitle?: TextComponent;
  mainTitle?: TextComponent;
  mainSubtitle?: TextComponent;
  datePlace?: TextComponent;
  logos?: LogosComponent;
  backgrounds?: BackgroundsComponent;
  footerText?: TextComponent;
  footerCopyright?: TextComponent;
  programTitle?: TextComponent;
  globalTheme?: GlobalThemeComponent;
  adSettings?: AdSettingsComponent;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
};

export type StrapiProgram = {
  id: number;
  documentId?: string;
  hospital: Hospital;
  session: SessionComponent[];
  createdAt: string;
  updatedAt: string;
};

class StrapiService {
  private baseUrl: string;
  private apiKey?: string;

  constructor(baseUrl: string = STRAPI_BASE_URL, apiKey?: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    return headers;
  }

  private async fetchFromStrapi<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/api${endpoint}`, {
        method: "GET",
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  async getHospitals(options?: {
    page?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<{ data: Hospital[]; meta: any }> {
    const params = new URLSearchParams();
    params.append("populate", "*");

    if (options?.page) {
      params.append("page", options.page.toString());
    }
    if (options?.pageSize) {
      params.append("pageSize", options.pageSize.toString());
    }
    if (options?.sort) {
      params.append("sort", options.sort);
    }

    return this.fetchFromStrapi(`/hospitals?${params.toString()}`);
  }

  async getCompleteHospitalDataByCode(
    code: string,
  ): Promise<{ data: Hospital; meta: any }> {
    try {
      // const response = await this.fetchFromStrapi<{
      //   data: Hospital;
      //   meta: any;
      // }>(`hospitals?filters[name_eng]=${code}&populate=*`);

      const response = await this.fetchFromStrapi<{
        data: Hospital;
        meta: any;
      }>(`/hospitals?populate=*`);

      return response.data[0];
    } catch (error) {
      console.warn(
        "❌ Failed to fetch hospital data with relations, falling back to basic populate=*",
      );
    }
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
}

export const strapiService = new StrapiService(
  STRAPI_BASE_URL,
  STRAPI_API_TOKEN,
);

export async function loadConfigFromHospitalByCode(
  code: string,
): Promise<import("../types").AppConfig> {
  const { createConfigFromHospitalData } = await import("./dataMapper");
  const { DEFAULT_CONFIG } = await import("../constants");

  try {
    const completeData =
      await strapiService.getCompleteHospitalDataByCode(code);

    return createConfigFromHospitalData(completeData);
  } catch (error) {
    console.error("Failed to load config from hospital data:", error);
    console.warn("Falling back to DEFAULT_CONFIG");
    return DEFAULT_CONFIG;
  }
}

export default StrapiService;
