import { LANGUAGE } from '../enum/languages.enum';
import { LanguageStruct } from '../interface/enums.interface';

/**
 * **Language :: String to Object Mapper**
 *
 * This function maps the given extension to the various languages stored in
 * [[LanguageStruct]] and returns the details.
 *
 * If an unsupported extension in sent, then returns {id:-1}
 *
 * @returns {extension:'ykv', id:-1} when invalid language sent
 *
 * @param {string} str
 */
export const mapLanguageStringToObject = (extension: string): LanguageStruct => {
  for (const [, value] of Object.entries(LANGUAGE)) {
    if (value.extension === extension) {
      return value;
    }
  }

  return { extension: '.ykv', id: -1 };
};

/**
 * **Language :: ID to Object Mapper**
 *
 * This function maps the given extension id to the various languages stored in
 * [[LanguageStruct]] and returns the details.
 *
 * If an unsupported extension in sent, then returns {id:-1}
 *
 * @returns {extension:'ykv', id:-1} when invalid language sent
 *
 * @param {number} id
 */
export const mapLanguageIdToObject = (id: number): LanguageStruct => {
  for (const [, value] of Object.entries(LANGUAGE)) {
    if (value.id === id) {
      return value;
    }
  }

  return { extension: '.ykv', id: -1 };
};
