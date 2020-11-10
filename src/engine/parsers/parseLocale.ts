import { compact } from 'lodash';

import { readFile } from '../utils/fileUtils';

export function getLocaleSection(version: number, fileName: string, section: string): Record<string, string> {
  const localizationData = compact(readFile(version, fileName).split(/\n|\r/));
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