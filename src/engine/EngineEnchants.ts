import { compact } from 'lodash';

import { ENCHANT_SLOTS_BY_RARITY } from 'engine/data/dataMappings';
// import enchantsPool from 'engine/data/enchantsPool.json';
import { allEnumValues } from 'helpers/typeUtils';
import { ItemEnchantSlots, SimpleEnchant, EnchantCategory, EnchantType, Enchant } from 'types/Enchant.types';
// import { EnchantsFilters } from 'types/Filters.types';
import { ItemRarity, Item } from 'types/Item.types';

import Engine, { DataInterface } from './Engine';

export default class EngineEnchants {
  public readonly engine: Engine;
  public categories: EnchantCategory[];
  public types: EnchantType[];

  constructor(engine: Engine) {
    this.engine = engine;
    this.categories = allEnumValues(EnchantCategory);
    this.types = allEnumValues(EnchantType);
  }

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
  }

  private get enchants(): Enchant[] {
    if (this.engine.loaded) {
      return this.data.enchants;
    }

    return [];
  }

  public getItemEnchantsSlots(item: Item): ItemEnchantSlots | null {
    // console.log('item:', item.uuid, item.name);
    if (this.engine.loaded && ![ItemRarity.Mythical].includes(item.rarity)) {
      const enchantSlots = ENCHANT_SLOTS_BY_RARITY[item.rarity];
      const fixedEnchants = this.enchantsToRawEnchants(item.rarity, item.fixedEnchants);
      const baseEnchants = this.enchantsToRawEnchants(item.rarity, item.baseEnchants);

      return {
        enchantSlots,
        fixedEnchants,
        baseEnchants,
      };
    }

    return null;
  }

  /* Private utils */
  private enchantsToRawEnchants(rarity: ItemRarity, enchantsIds: number[]): SimpleEnchant[] {
    const { enchants } = this.data;

    return compact(
      enchantsIds.map(enchantId => enchants.find(e => e.uuid === enchantId))
    ).map((enchant) => {
      const ranges = enchant.ranges[rarity];
      return {
        name: enchant.name,
        min: ranges.minimum,
        max: ranges.cap,
      };
    });
  }
}
