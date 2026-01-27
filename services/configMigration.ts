
import { AppConfig, StyledText } from '../types';
import { DEFAULT_CONFIG } from '../constants';

export const migrateToStyledText = (val: any, fallback: StyledText): StyledText => {
  if (typeof val === 'string') return { ...fallback, text: val };
  if (val && typeof val === 'object' && val.text !== undefined) {
    return {
      ...fallback,
      ...val,
      fontSize: val.fontSize || fallback.fontSize,
      letterSpacing: val.letterSpacing || fallback.letterSpacing,
      fontFamily: val.fontFamily || fallback.fontFamily,
      textAlign: val.textAlign || fallback.textAlign
    };
  }
  return fallback;
};

export const mergeConfig = (data: any): AppConfig => {
  const merged: any = { ...DEFAULT_CONFIG, ...data };

  merged.heroSection.title = migrateToStyledText(data.heroSection?.title, DEFAULT_CONFIG.heroSection.title);
  merged.heroSection.mainSubtitle = migrateToStyledText(data.heroSection?.mainSubtitle, DEFAULT_CONFIG.heroSection.mainSubtitle);
  merged.heroSection.subtitle = migrateToStyledText(data.heroSection?.subtitle, DEFAULT_CONFIG.heroSection.subtitle);
  merged.heroSection.datePlace = migrateToStyledText(data.heroSection?.datePlace, DEFAULT_CONFIG.heroSection.datePlace);
  merged.programTitle = migrateToStyledText(data.programTitle, DEFAULT_CONFIG.programTitle);
  merged.footer.text = migrateToStyledText(data.footer?.text, DEFAULT_CONFIG.footer.text);
  merged.footer.copyright = migrateToStyledText(data.footer?.copyright, DEFAULT_CONFIG.footer.copyright);

  merged.logos.rightLink = data.logos?.rightLink || DEFAULT_CONFIG.logos.rightLink;
  merged.adSettings = { ...DEFAULT_CONFIG.adSettings, ...(data.adSettings || {}) };

  if (data.programList) {
    merged.programList = data.programList.map((p: any, idx: number) => {
      const fallbackProgram = DEFAULT_CONFIG.programList[idx] || DEFAULT_CONFIG.programList[0];
      const legacyTime = p.time;

      return {
        ...p,
        defaultOpen: p.defaultOpen !== undefined ? p.defaultOpen : (idx === 0),
        sessionTag: migrateToStyledText(p.sessionTag, fallbackProgram.sessionTag || { text: idx === 0 ? "INTRODUCTION" : `SESSION ${idx}` }),
        sessionName: migrateToStyledText(p.sessionName, fallbackProgram.sessionName),
        speakers: p.speakers.map((s: any, sIdx: number) => {
          const fallbackSpeaker = fallbackProgram.speakers[sIdx] || fallbackProgram.speakers[0];
          let speakerTimeFallback = fallbackSpeaker.time;
          if (sIdx === 0 && legacyTime) {
            speakerTimeFallback = migrateToStyledText(legacyTime, fallbackSpeaker.time);
          }

          return {
            ...s,
            time: migrateToStyledText(s.time, speakerTimeFallback),
            name: migrateToStyledText(s.name, fallbackSpeaker.name),
            org: migrateToStyledText(s.org, fallbackSpeaker.org)
          };
        })
      };
    });
  }
  return merged as AppConfig;
};
