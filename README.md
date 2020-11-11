# Chronicon DB

## Starting up

Install all dependencies
```
  yarn
```

## How to get up to date item and skills data

Follow the Chronicon discord's instructions:
```
  Note: Tinka builds are usually Windows-only
  1) Right-click Chronicon in your Steam library and select Properties
  2) Click the BETAS tab, and enter the following code: tinkaistheking
  3) Click CHECK CODE, select "tinkabuilds" from the drop down list, and click CLOSE
  4) Wait for update to finish
```

```
Tinka commands:
  >    ctrl+i   = drop some random items
  >    shift+i  = dialogue to drop specific item id's
  >    ctrl+u   = drop a ton of scrolls
  >    shift+u  = drop a ton of gems
  >    ctrl+m   = spawn a pack of elites with the affix id specified
  >    shift+m  = dialogue to spawn specific enemies
  >    ctrl+p   = print an item list to file (in appdata location)
  >    ctrl+c   = obtain 10M crystals
  >    shift+k  = kill all enemies on screen
```

- Use `CTRL + P` in the main menu to generate the item and enchants data files for the current version.
- Use `CTRL + S + J` in the main menu to generate skill data file for the current version.

Those files will be located in your `%LOCALAPPDATA%\Chronicon` folder.

- You will also need the `locale` folder that can be found in your `Program Files\Steam\steamapps\common\Chronicon` folder.
- Copy all those inside this project's `src/engine/data/VERSION_NUMBER/sources` folder, where `VERSION_NUMBER` is the current version, e.g: `1.10.2`. You'll have to create this folder.

You can then use the command `yarn parse:all VERSION_NUMBER`

Example:
```
  yarn parse:all 1.10.2
```

This generates JSON files for items, skills and enchants in the `engine/data/VERSION_NUMBER/extracts` folder if you need those for your own projects.

There you go, chronicondb is now up to date.

## TODO:

- Enchants
  - Power & Enchant
  - Gems (Enchants)
  - Runes (Enchants)

- Implement logic

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
