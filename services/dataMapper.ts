import { API_URL, DEFAULT_CONFIG } from '../constants';
import { AppConfig, HeroSection, Program, Speaker, StyledText } from '../types';
import { Hospital, SpeakerComponent, TextComponent } from './strapiService';

function mapStrapiProgramsToAppPrograms(strapiProgram): Program[] {
  return strapiProgram.session
    ?.map((sessionData: any, sessionIndex: number) => ({
      id: `program_${strapiProgram.id}_session_${sessionData.id}`,
      sessionTag: {
        text: sessionData.tag?.text || `SESSION ${sessionIndex + 1}`,
        color: sessionData.tag?.color || '#d7b9b9',
        fontSize: sessionData.tag?.fontSize || '1rem',
        fontFamily: sessionData.tag?.font || 'Roboto',
        letterSpacing: `${sessionData.tag?.letterSpacing || 0}px`,
      },
      sessionName: {
        text: sessionData.title?.text || '',
        color: sessionData.title?.color || '#edd1d1',
        fontSize: sessionData.title?.fontSize || '1rem',
        fontFamily: sessionData.title?.font || null,
        letterSpacing: `${sessionData.title?.letterSpacing || 0}px`,
      },
      speakers:
        sessionData.speaker?.map((speakerData: any) => ({
          id: `speaker_${strapiProgram.id}_${sessionData.id}_${speakerData.id}`,
          time: {
            text: speakerData.time?.text || '',
            color: speakerData.time?.color || '#95bca1',
            fontSize: speakerData.time?.fontSize || '1rem',
            fontFamily: speakerData.time?.font || 'Roboto',
            letterSpacing: `${sessionData.time?.letterSpacing || 0}px`,
          },
          name: {
            text: speakerData.profile?.text || '',
            color: speakerData.profile?.color || '#c9d7ce',
            fontSize: speakerData.profile?.fontSize || '1rem',
            fontFamily: speakerData.profile?.font || null,
            letterSpacing: `${sessionData.profile?.letterSpacing || 0}px`,
          },
          org: {
            text: speakerData.subject?.text || '',
            color: speakerData.subject?.color || '#c4d6cd',
            fontSize: speakerData.subject?.fontSize || '1rem',
            fontFamily: speakerData.subject?.font || null,
            letterSpacing: `${sessionData.subject?.letterSpacing || 0}px`,
          },
          photoUrl: speakerData.picture?.url
            ? `${API_URL}${speakerData.picture.url}`
            : '',
          detailUrl: speakerData.detailUrl || '',
          showDetail: speakerData.detail || false,
        })) || [],
      defaultOpen: !!sessionData.defaultOpen,
    }))
    .filter(Boolean);
}

export class DataMapper {
  static mapTextComponent(
    textComponent: TextComponent | null | undefined,
  ): StyledText {
    if (!textComponent) {
      return {
        text: '',
        color: '#000000',
        fontSize: '14px',
        fontFamily: 'Arial',
      };
    }

    const mapped = {
      text: textComponent.text || '',
      color: textComponent.color || '#000000',
      fontSize: textComponent.fontSize || '14px',
      fontFamily: textComponent.font || 'Arial',
      textAlign: textComponent.align
        ? (textComponent.align.toLowerCase() as 'left' | 'center' | 'right')
        : undefined,
      letterSpacing: `${textComponent.letterSpacing || 0}px`,
    };
    return mapped;
  }

  static mapHospitalToHeroSection(
    hospital: Hospital | null | undefined,
  ): HeroSection {
    if (!hospital) {
      return DEFAULT_CONFIG.heroSection;
    }

    const heroSection = {
      title: hospital.mainTitle
        ? this.mapTextComponent(hospital.mainTitle)
        : DEFAULT_CONFIG.heroSection.title,
      mainSubtitle: hospital.mainSubtitle
        ? this.mapTextComponent(hospital.mainSubtitle)
        : DEFAULT_CONFIG.heroSection.mainSubtitle,
      subtitle: hospital.subtitle
        ? this.mapTextComponent(hospital.subtitle)
        : DEFAULT_CONFIG.heroSection.subtitle,
      datePlace: hospital.datePlace
        ? this.mapTextComponent(hospital.datePlace)
        : DEFAULT_CONFIG.heroSection.datePlace,
    };
    return heroSection;
  }

  static mapCompleteHospitalDataToConfig(hospitalData: any): AppConfig {
    const config = { ...DEFAULT_CONFIG };

    if (hospitalData) {
      config.heroSection = this.mapHospitalToHeroSection(hospitalData);

      const footerMappings = [
        { src: hospitalData.footerText, target: 'text' },
        { src: hospitalData.footerCopyright, target: 'copyright' },
      ] as const;

      footerMappings.forEach(({ src, target }) => {
        if (src) config.footer[target] = this.mapTextComponent(src);
      });

      if (hospitalData.programTitle) {
        config.programTitle = this.mapTextComponent(hospitalData.programTitle);
      }

      if (hospitalData.pageTitle) {
        config.pageTitle = hospitalData.pageTitle;
      }
      if (hospitalData.domain) {
        config.domain = hospitalData.domain;
      }
    }

    if (hospitalData.theme) {
      this.mapThemeData(hospitalData.theme, config);
    }

    if (hospitalData.advertisement) {
      this.mapAdData(hospitalData.advertisement, config);
    }

    if (hospitalData.program) {
      config.programList = mapStrapiProgramsToAppPrograms(hospitalData.program);
    }

    return config;
  }

  private static mapThemeData(themeData: any, config: AppConfig): void {
    const { globalTheme: theme = {}, logos = {}, backgrounds = {} } = themeData;

    if (Object.keys(theme).length > 0) {
      config.globalTheme = {
        ...config.globalTheme,
        ...Object.fromEntries(
          Object.entries(theme).filter(([_, value]) => value !== undefined),
        ),
      };
    }

    if (Object.keys(logos).length > 0) {
      config.logos = {
        leftLogo: logos.leftLogo?.url ? `${API_URL}${logos.leftLogo.url}` : '',
        leftLink: logos.leftLink || '',
        rightLogo: logos.rightLogo?.url
          ? `${API_URL}${logos.rightLogo.url}`
          : '',
        rightLink: logos.rightLink || '',
        applyFilter: logos.applyFilter !== undefined ? logos.applyFilter : true,
      };
    }

    if (backgrounds && typeof backgrounds === 'string') {
      try {
        const parsedBackgrounds = JSON.parse(backgrounds);
        const getImageUrl = (imageSrc: string) => {
          if (!imageSrc) return '';
          if (
            imageSrc.startsWith('http://') ||
            imageSrc.startsWith('https://')
          ) {
            return imageSrc;
          }
          return `${API_URL}${imageSrc}`;
        };

        config.backgrounds = {
          heroBg: getImageUrl(parsedBackgrounds.imageSrc),
          heroBgBrightness: parsedBackgrounds.brightness ?? 0.25,
          heroBgContrast: parsedBackgrounds.contrast ?? 1.15,
          programBg: getImageUrl(parsedBackgrounds.imageSrc),
        };
      } catch (error) {
        console.error('Error parsing backgrounds JSON:', error);
      }
    } else if (backgrounds && Object.keys(backgrounds).length > 0) {
      config.backgrounds = {
        heroBg: backgrounds.heroBg?.url
          ? `${API_URL}${backgrounds.heroBg.url}`
          : '',
        heroBgBrightness: backgrounds.heroBgBrightness ?? 0.25,
        heroBgContrast: backgrounds.heroBgContrast ?? 1.15,
        programBg: backgrounds.programBg?.url
          ? `${API_URL}${backgrounds.programBg.url}`
          : '',
      };
    }
  }

  private static mapAdData(adData: any, config: AppConfig): void {
    const { ads = [], adDuration = 5, displayMode = 'random' } = adData;

    config.adSettings = {
      ads: ads.map((ad: any) => ({
        id: ad.id?.toString() || '',
        imageUrl: ad.image?.url ? `${API_URL}${ad.image.url}` : '',
        targetUrl: ad.targetUrl || '',
      })),
      adDuration,
      displayMode,
    };
  }
}
export function createConfigFromHospitalData(hospitalData: any): AppConfig {
  return DataMapper.mapCompleteHospitalDataToConfig(hospitalData);
}

export default DataMapper;
