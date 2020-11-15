import * as fs from 'fs';
import { forEach } from 'lodash';
import * as path from 'path';

import enchants from '../data/1.10.2/extracts/enchants.json';
import enchantsPoolByName from '../data/enchantsPoolByName.json';

export function parseEnchantsPool(): void {
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