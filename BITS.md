```
Enchanted:
1 Minor OR 1 Major

Rare:
1 Minor
1 Major
If Ring or Amulet:
1 Epic
if Weapon, Armor, or Boots:
25% chance to replace 1 Major with 1 Epic

Unique:
1 Minor
2 Major
If Ring or Amulet:
1 Epic
if Weapon, Armor, or Boots:
25% chance to replace 1 Major with 1 Epic


Legendary:
2 Minor
2 Major
If Ring or Amulet:
1 Epic
if Weapon, Armor, or Boots:
25% chance to replace 1 Major with 1 Epic


True Legendary:
2 Minor
2 Major
If Ring or Amulet:
1 Epic
if Weapon, Armor, or Boots:
25% chance to replace 1 Major with 1 Epic
```

```ts
// Seems un-needed Remove enchant slots if they are used by a fixed enchant
if (fixedEnchants) {
  enchantSlots = enchantSlots.reduce((slots: ItemRawEnchantCategory[], _slot) => {
    const slot = { ..._slot };
    const matchingFixedEnchants = fixedEnchants.filter(fixed => fixed?.type ? slot.types.includes(fixed.type) : false);

    if (matchingFixedEnchants.length > 0) {
      slot.count -= Math.max(matchingFixedEnchants.length, 0);
      if (slot.count > 0) {
        slots.push(slot);
      }
    } else {
      slots.push(slot);
    }

    return slots;
  }, []);

  console.log(fixedEnchants, ENCHANT_SLOTS_BY_RARITY[item.rarity], enchantSlots);
  console.log('----------------------------------');
}
```

```ts
hydratedPool[itemType] = reduce(poolByEnchantType, (hydratedPoolTypes: HydratedPoolType, enchantIds: number[], enchantType: CraftableEnchantTypes) => {
  hydratedPoolTypes[enchantType] = compact(enchantIds.map(uuid => this.data.enchants.find(e => e.uuid === uuid)));
  return hydratedPoolTypes;
}, {});
```

  "homepage": "https://gabriel-dehan.github.io/chronicondb-client",
