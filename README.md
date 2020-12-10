# Chronicon DB

Official website: [ChroniconDB](https://chronicondb.com)

## Table of Contents

- [Acknowledgement](#acknowledgement)
- [Starting up](#starting-up)
- [How to get up to date item and skills data](#how-to-get-up-to-date-item-and-skills-data)
- [Developers](#developers)
  * [I want your data for my own projects](#i-want-your-data-for-my-own-projects)
  * [Contributing](#contributing)
  * [Notes](#notes)
- [Roadmap](#roadmap)
  * [Post release](#post-release)
  * [Release](#release)
- [License](#license)

## Acknowledgement

This is a fan project. All data and game assets are **not mine** and the intellectual property of [Subworld Games](https://www.subworldgames.com/chronicon/).

## Starting up

- Clone this project
- Install all dependencies
```
  yarn
```
- Start the webserver
```
  yarn start
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

- You will also need the `locale` folder that can be found in your `Program Files\Steam\steamapps\common\Chronicon` folder (or wherever you installed steam).
- Copy all those inside this project's `src/engine/data/VERSION_NUMBER/sources` folder, where `VERSION_NUMBER` is the current version, e.g: `1.10.2`. You'll have to create this folder.

You can then use the command `yarn parse:all VERSION_NUMBER`

Example:
```
  yarn parse:all 1.10.2
```

This generates JSON files for items, skills and enchants in the `engine/data/VERSION_NUMBER/extracts` folder if you need those for your own projects.

There you go, chronicondb is now up to date.

## Developers

### I want your data for my own projects

[It's all in there](https://chronicondb.com/developers).

### Contributing

If you are unfamiliar with the fork - branch - MR workflow, [read this guide](https://github.com/firstcontributions/first-contributions)

### Notes

- Mobile was not planned at first so the CSS is not mobile first. Not the cleanest but 🤷‍♀️
- There are
  - 493 Enchants
  - 1218 Skills
  - 753 Items

## Roadmap

### Post release

- [ ] Fix multiword search (currently searches words separately)
- [ ] Fix mobile drawer scroll bug
- [ ] Fix enchant pools that are sometimes incorrect for epic enchants
- [ ] Fix title and metas for the SPA Redirect page
- [ ] Create issues for `TODO:` and the post release roadmap
- [ ] Map item category - types automatically in the item parser (reduce uniq should do the trick)
- [ ] Update or change the infinite scroll to support react 17+
- [ ] Add related skills to `skills.json` and clean up the template description
- [ ] Skills that enhance previously selected skills should display a list of previously selected skills
- [ ] Refactor Filters and Sidebars
- [ ] Refactor string templating
- [ ] In all skills templating, "Unknown Skill" should be handled in a one liner and not repeat the whole ReactDomElement
- [ ] Ability to sort everything (skills by points invested, alphabetic order...), enchants alphabetically

### Release

- [x] Parsing
  - [x] Auto add version to versions file
  - [x] Use react router links in templating replacements
- [x] Layout
  - [x] Fix header overflow
  - [x] Responsiveness
  - [x] Max width
- [x] Items page
  - [x] Handle Sets in rarity filter
  - [x] Runes possible enchants
  - [x] Item page
  - [x] Permalink
  - [x] Badge
  - [x] Gems matching
  - [x] Order by REQ LVL
  - [x] Items image generator
  - [x] Skill links react-router
  - [x] Set items links react-router
  - [x] React infinite scroller
- [x] Enchants page
  - [x] Enchants Search Index (item types)
- [x] Skills page
  - [x] Skills Search Index (items types, enchants)
  - [x] Skill page
- [x] Developers page
- [x] SEO
  - [x] Helmet
  - [x] Robot.txt
  - [x] Sitemap
  - [x] GA
- [x] Reddit / Steam post for release

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