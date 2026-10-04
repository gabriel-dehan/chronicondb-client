import { Blessing, BlessingSlot, Curse } from '../../types/Blessing.types';
import { CharacterClass } from '../../types/Character.types';
import { readSourceFile, writeFile } from '../utils/fileUtils';
import { getLocaleSection } from './parseLocale';

// Blessings and curses are not part of the game data export, the source file is
// extracted from the game executable (see tools/chronicon-re, not versioned)
export function parseBlessings(version: string, verbose = false) {
  const sourceData = JSON.parse(readSourceFile(version, `blessings_curses_${version}.json`));
  const blessingsLocale = getLocaleSection(version, 'locale/EN/dlc', 'blessings');
  const cursesLocale = getLocaleSection(version, 'locale/EN/dlc', 'curses');

  // Some blessings exist in the game data but are in no roll pool (e.g. Greater Trickery)
  const rollableBlessings = sourceData.blessings.filter((blessing: Record<string, any>) => blessing.rollable);
  const blessings: Blessing[] = rollableBlessings.map((blessing: Record<string, any>): Blessing => {
    const parsedBlessing = {
      uuid: blessing.id,
      name: blessingsLocale[`blessing_name_${blessing.id}`] ?? blessing.name,
      description: blessingsLocale[`blessing_desc_${blessing.id}`] ?? blessing.description,
      value: blessing.amount,
      slot: blessing.slot ?? undefined,
      classes: blessing.classes === 'Any' ? allClasses() : blessing.classes,
    };

    if (verbose) {
      console.log(parsedBlessing);
    }

    return parsedBlessing;
  });

  const curses: Curse[] = sourceData.curses.map((curse: Record<string, any>): Curse => {
    const slots: string[] = curse.slots;
    const action = sourceData.purifyActions[curse.purifyActionId];
    const parsedCurse = {
      uuid: curse.id,
      name: cursesLocale[`curse_name_${curse.id}`] ?? curse.name,
      description: cursesLocale[`curse_desc_${curse.id}`] ?? curse.description,
      value: curse.num ?? undefined,
      slots: slots.map(slot => slot.split(' ')[0] as BlessingSlot),
      shieldOnly: slots.some(slot => slot.includes('Shield only')),
      // In-game text shows progress as CUR/MAX, we only display the required amount
      purifyAction: action.text.replace('CUR/MAX', 'MAX'),
      purifyRequired: curse.purifyRequired,
    };

    if (verbose) {
      console.log(parsedCurse);
    }

    return parsedCurse;
  });

  writeFile(blessings, version, 'blessings');
  writeFile(curses, version, 'curses');

  return {
    blessings,
    curses,
  };
}

function allClasses(): CharacterClass[] {
  return [CharacterClass.Templar, CharacterClass.Berserker, CharacterClass.Warden, CharacterClass.Warlock, CharacterClass.Mechanist];
}
