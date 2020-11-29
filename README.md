# Chronicon DB

## Acknowledgement

This is a fan project. All data and game assets are the intellectual property of [Subworld Games](https://www.subworldgames.com/chronicon/).

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

## Roadmap

- [ ] Header links not working -> You cannot change <Router history>
- [ ] Responsive minimum
- [ ] Do not display the divider for item content if there is no content at all
- [ ] Order by REQ LVL
- [ ] Skill links react-router
- [ ] Handle Sets in rarity filter
- [ ] Fix header overflow
- [ ] Runes possible enchants
- [x] Auto add version to versions file
- [x] Layout
- [ ] Items
- [~] Items image generator
- [ ] Enchants
- [ ] Skills
- [ ] SEO

## License

**Important**: this license only applies to the logic and application in itself and does not pertain to any data or assets coming from the game **Chronicon** which is the intellectual property of [Subworld Games](https://www.subworldgames.com/chronicon/).


> DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
> Version 2, December 2004
>
> Copyright (C) 2004 Sam Hocevar <sam@hocevar.net>
>
> Everyone is permitted to copy and distribute verbatim or modified
> copies of this license document, and changing it is allowed as long
> as the name is changed.
>
> DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
> TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
>
> 0. You just DO WHAT THE FUCK YOU WANT TO.