import { compact, reduce, isEmpty } from 'lodash';

import { readSourceFile } from '../utils/fileUtils';


export interface LocaleData {
  [key: number]: Record<string, string>;
}

export function parseLocaleData(data: Record<string, string>, parser: RegExp): LocaleData {

  return reduce(data, (itemData: LocaleData, value, key) => {
    const matches = key.match(parser);

    if (matches) {
      const itemId = parseInt(matches[1]);
      const keyName = matches[2];

      if (!itemData[itemId]) {
        itemData[itemId] = {};
      }

      if (!isEmpty(value)) {
        itemData[itemId][keyName] = value;
      }
    }

    return itemData;
  }, {});
}

export function getLocaleSection(version: string, fileName: string, section: string): Record<string, string> {
  const localizationData = compact(readSourceFile(version, fileName).split(/\n|\r/));
  const rawSectionData = [];
  const genericSeparator = /\[[A-Z]+\]/;
  const sectionSeparator = new RegExp(`\\[${section.toUpperCase()}\\]`);
  let sectionFound = false;

  // For is way more optimized than anything I could find
  for (let i = 0; i < localizationData.length; i++) {
    const line = localizationData[i];
    const isDesiredSectionStart = line.match(sectionSeparator);
    const isSeparator = line.match(genericSeparator);

    if (sectionFound && isSeparator) {
      break; // :o HE USED A BREAK, BURN THIS WITCH
    } else if (sectionFound && !isSeparator) {
      rawSectionData.push(line);
    }

    if (isDesiredSectionStart) {
      sectionFound = true;
    }
  }

  const sectionData = rawSectionData.map((line) => {
    const [key, value] = line.split('=');
    return {
      [key]: value.replace(/"/g, ''),
    };
  });

  return Object.assign({}, ...sectionData);

}