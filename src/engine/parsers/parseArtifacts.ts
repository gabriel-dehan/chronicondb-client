import { compact } from 'lodash';

import { ArtifactInterface } from '../../types/Artifact.types';
import { readSourceFile, writeFile } from '../utils/fileUtils';
import { getLocaleSection, LocaleData, parseLocaleData } from './parseLocale';

export function parseArtifacts(version: string, verbose: false) {
  const rawArtifacts = compact(readSourceFile(version, `artifactdata_${version}.json`).split(/\n|\r/)).slice(1).join('\n');
  const artifactData = JSON.parse(rawArtifacts);

  const locales = parseLocale(version);
  let artifacts = Object.entries(artifactData).map(([, artifact]: [string, any]): ArtifactInterface => {
    const { name, shape, class: classRestriction, id: uuid, description, val } = artifact;
    const localeName = locales?.[uuid]?.nm ?? name;
    const localeDesc = locales?.[uuid]?.txt ?? description;
    return {
      uuid,
      name: localeName,
      class: classRestriction,
      type: shape?.split(' ')?.[0],
      description: localeDesc,
      value: val,
    };
  });

  artifacts = artifacts.filter(({ name }) => name !== 'MISSING TEXT');

  writeFile(artifacts, version, 'artifacts');

  return artifacts;
}

function parseLocale(version: string) {
  const parser = /^art_(\d+)_(\w+)$/;
  const localeData = getLocaleSection(version, 'locale/EN/dlc', 'artifacts');
  return parseLocaleData(localeData, parser);
}