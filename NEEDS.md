First of all, a word on the taxonomy I use so it's not too confusing (I don't know how you call them personnaly :p)
If we take this item: https://chronicondb.com/item/75, we have:

- **Base enchants**: damage / life / mana and critical chance / attack speed, that are on all items
- **Fixed enchants**: enchants an item will always have (% Physical Damage on the Heartpiercer)
- **Slotted enchants**: random enchants that will be taken from the pool of available enchants for an item type.

What extracted data is needed:

## Most important

**1**. Enchants pools, I manually extracted the data from your guide (actually just noticed you were the author, I was like "how did this guy got all this info" xD): https://steamcommunity.com/sharedfiles/filedetails/?id=835123683 and made it into a JSON (https://github.com/gabriel-dehan/chronicondb-client/blob/main/src/engine/data/enchantsPool.json) but this took me almost half a day of work and I am not looking forward to having to do it again anytime soon :p. If there was a way for the data to be extracted, it would be plain amazing. The format doesn't matter, could be a JSON using my format or another or a CSV or anything, I'll just parse it if it doesn't fit. But this is probably the most important.

Also I am not sure how to format the "25% chance to replace 1 Major with 1 Epic" in a proper way (that's why it's not in my `enchantsPool.json`). I currently have an array like so:

```ts
const ITEM_TYPES_WITH_EPIC_REPLACEMENT_CHANCE = [
  ItemType.Armor,
  ItemType.Boots,
  ItemType.Bow,
  ItemType.Sword,
  ItemType.Fists,
  ItemType.Staff,
  ItemType.Accessory,
]
```

But it'd be obviously better if it could be extracted from the game (or at least if you could ping me if it ever changes :p).

## Important

**2**. Gem enchants data in a "CSV" format like the rest, ideally separated (so it's easily separated from the rest.)
Currently I extracted the data manually from the game and made it look like this so it works with the enchants parser: https://github.com/gabriel-dehan/chronicondb-client/blob/main/src/engine/data/injected/gemenchantlist.txt, but once more it a few took hours so I'd like not to have to do it again :D.

Example
```
562 - Gem Block Chance - 3/5/10, 3/5/10, 3/5/10, 0 - (gem)
```

**3**. Base enchants data. From what I've understood from the community feedback (and I suspected it), the enchants data in the `enchantlist.txt` file doesn't provide the correct values for the base enchants but only for slotted enchants. It'd be nice to have another `baseenchantlist.txt` with the values only for the bases maybe?

**4**. Rahlence on Chronicon's discord told me that "all the items in the same rarity have the same stats in the db and they shouldn't. rings have different ranges from armor, etc etc."
I am not sure if he was talking about base enchants or any enchants for that matter, but whatever the case, it'd be very welcome to have a way getting this information out of the game. But this is probably **very** hard to represent in a CSV.
If this concerns all enchants and not just the base ones, a good way I just thought of, that might be able to kill two birds with one (big-ass) stone, would be to create one CSV per item type with the same structure as `enchantlist.txt`. This would give the both the enchants pool for a given item type as well as the correct ranges for every rarity. I might be missing something but it should cover both needs. I don't know your internal structure though so I am not sure if that would simplify the task for you.

**5**. Rune enchants are missing some information, whether or not a legendary enchant comes from a rune, and whether a legendary enchantment is lesser or greater and what types of items they can be applied to. Pretty much what's on Rahlence guide: https://steamcommunity.com/sharedfiles/filedetails/?id=1911997938. I could have mapped it by hand but I just couldn't muster the motivation of spending a few days on that alone :D.

**6**. Skills don't have their tags in the extract.

## Would love to have

**7**. I've started working with the guy that created http://iconmaster.info/Chronomancer/ using the jsons I provided, and he helped me put together this whole list, as well as noted a few things missing on the skill side of things:

For instance now: https://chronicondb.com/skill/100275?skillCharacterClass=Templar

This skill, has a `PROC%` in its templating string with a corresponding value of `3000` I guess it should be divided by 100 as it is stored as an integer instead of a float, but values are sometimes floats, sometimes integer and I am not sure if there is a rule to determine when it should or should not be divided? Or is it an error in the extract?

**8**. Apparently, some skills are missing their cooldown information.

**9**. For some items, the icon is "TAKEN" instead of the picture. The ones that we noticed:

- Moore's Helmet
- Refugee's Tattered Vest
- Amulet of the Apprentice
- Thundercharged Blade
- Ayeela's Will
- Lich's Wand

They usually use the `spr_itemicons_ID` nomenclature, but some items seem not to, do you have any idea as to why (this way I could make an exception in the parser or something).

**10**. Mastery skills "tallies" (the icons / categories preceding each line) are missing from the extracts, not sure where to find those or if it could be added?

**11**. Enchant slots per item type and rarity, this actually goes hand in hand with the enchants pool as it's also in your guide https://steamcommunity.com/sharedfiles/filedetails/?id=835123683, but I had to map it by hand in a dictionnary / object like so:

```json
{
  "enchanted": [
    {
      "count": 1,
      "types": ["minor", "major"], // OR
      "categoriesRestriction": ["ring", "amulet", "accessory", "armor", "boots", "helmet", "offhand", "weapon"],
    },
  ],
  "rare": [
      {
        "count": 1,
        "types": ["minor"],
        "categoriesRestriction": ["ring", "amulet", "accessory", "armor", "boots", "helmet", "offhand", "weapon"],
      },
      {
        "count": 1,
        "types": ["major"],
        "categoriesRestriction": ["ring", "amulet", "accessory", "armor", "boots", "helmet", "offhand", "weapon"],
      },
      {
        "count": 1,
        "types": ["epic"],
        "categoriesRestriction": ["ring", "amulet"],
      },
    ],
  "unique": [ /* ... */ ],
}
// etc for each rarity...
```

This is not very future proof either, so if we can find a way to extract it, it'd be better. If not possible, at least knowing when this changes would help. I guess it's not supposed to change very frequently and it's a rather easy object to adjust so I could just manually do it, it's not as important as the enchants pool and the rest.
Actually most of the constants here: https://github.com/gabriel-dehan/chronicondb-client/blob/main/src/engine/data/dataMappings.ts are things that would be more future proof if extracted from the game but clearly not as important as the rest.
