import { LANGUAGE } from '../enum/languages.enum';
import { LanguageStruct } from '../interface/enums.interface';

export const mapLanguageStringToObject = (str: string): LanguageStruct => {
  const keys = Object.keys(LANGUAGE);
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === str) {
      return LANGUAGE[str];
    }
  }
  return { extension: '.ykv', id: -1 };
};
