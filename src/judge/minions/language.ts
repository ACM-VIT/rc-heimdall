import { LANGUAGE } from '../enum/languages.enum';
import { LanguageStruct } from '../interface/enums.interface';

export const mapLanguageStringToObject = (str: string): LanguageStruct => {
  const keys = Object.keys(LANGUAGE);

  for (const [, value] of Object.entries(LANGUAGE)) {
    if (value.extension === str) {
      return value;
    }
  }

  return { extension: '.ykv', id: -1 };
};
