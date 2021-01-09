import { compact } from 'lodash';

import { EnchantType } from '../../types/Enchant.types';
import { ItemType } from '../../types/Item.types';
import { readSourceFile, writeFile } from '../utils/fileUtils';

type EnchantsPool = Record<ItemType, Record<EnchantType, number[]>>;

export function parseEnchantsPool(version: string, verbose: false): EnchantsPool {
  const rawEnchants = compact(readSourceFile(version, 'enchantlist.txt').split(/\n|\r/));
  const rawEnchantsPool = compact(readSourceFile(version, 'enchantpool.txt').split(/\n|\r/));
  // @ts-ignore
  const enchantsPool: EnchantsPool = {};

  const enchantsIdsByName = rawEnchants.reduce((memo: Record<string, number>, rawEnchant: string): Record<string, number> => {
    const [id, name] = rawEnchant.split(' - ').map(data => data.trim());
    memo[name] = parseInt(id);
    return memo;
  }, {});

  let currentItemCategory: ItemType | null = null;
  let currentEnchantType: EnchantType | null = null;

  // Parses bbcode to json
  rawEnchantsPool.forEach((line) => {
    const [isItemCategory, itemCategory] = line.match(/^\[h1\](\w+)\s*.*\[\/h1\]/) || [];
    const [isEnchantType, enchantType] = line.match(/^\[b\](\w+)\[\/b\]/) || [];

    if (isItemCategory) {
      currentItemCategory = itemCategory as ItemType;
      currentEnchantType = null;
      enchantsPool[currentItemCategory] = {} as Record<EnchantType, number[]>;
    }

    if (isEnchantType && currentItemCategory) {
      currentEnchantType = enchantType as EnchantType;
      enchantsPool[currentItemCategory][currentEnchantType] = [];
    }

    if (currentItemCategory && currentEnchantType) {
      const [isEnchant, currentEnchant] = line.match(/^\[\*\]((?:\w|\s)+)\s-/) || [];
      if (isEnchant) {
        enchantsPool[currentItemCategory][currentEnchantType].push(enchantsIdsByName[currentEnchant]);
      }
    }
  });

  if (verbose) {
    console.log(enchantsPool);
  }

  writeFile(enchantsPool, version, 'enchantsPool');

  return enchantsPool;
}

/* OLD manual enchants parser */
/*
import enchants from '../data/1.10.2/extracts/enchants.json';
import enchantsPoolByName from '../data/enchantsPoolByName.json';

export function parseStaticEnchantsPool(): void {
  const enchantsPool: Record<string, Record<string, string[]>> = {};

  forEach(enchantsPoolByName, (pool, itemType) => {
    enchantsPool[itemType] = {
      Epic: [],
      Major: [],
      Minor: [],
    };

    forEach(pool, (enchantsNames, rarity) => {
      // @ts-ignore
      enchantsPool[itemType][rarity] = enchantsNames.map((enchantName: string) => {
        const enchObj = enchants.find(enchant => enchant.name === enchantName);
        if (enchObj) {
          return enchObj.uuid;
        } else {
          throw (`Couldn't find ${enchantName}`);
        }
      });
    });
  });

  const absolutePath = path.resolve(__dirname, `../data/enchantsPool.json`);
  fs.writeFileSync(absolutePath, JSON.stringify(enchantsPool, null, 2));
}
*/