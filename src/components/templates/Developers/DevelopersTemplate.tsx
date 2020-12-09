import React, { FunctionComponent } from 'react';

import Item from 'components/organisms/Items/Item/Item';
import useFilters from 'hooks/useFilters';
import useSeo from 'hooks/useSeo';
import { GeneralFilters, FiltersType } from 'types/Filters.types';

import './DevelopersTemplate.scss';

const DevelopersTemplate: FunctionComponent = () => {
  const [filters, setFilters] = useFilters<GeneralFilters>(FiltersType.General);

  const Seo = useSeo({
    title: 'Developers',
    description: "Want some juicy data to create your own application? It's all here!",
  });

  return (
    <>
      <Seo />
      <div className="t-developers">
        <p className="t-developers__block">
          <h1>So, you have an idea...</h1>
          <p>
            ...for a Chronicon related application, maybe a <em>Character Planner</em> or an <em>Item crafting simulator</em>, but what you're missing dearly are some fat, juicy <strong>pieces of (up to date) data</strong> to supplement your idea?
            <br />
          - "What about those items?", you think? "Where will I ever find properly formatted data for those hundreds of items?"
          </p>
          <p>
            But <strong>don't you worry</strong> lad(y), for we've got you covered here at <strong>ChroniconDB™</strong>.<br />
            All the data you ever wished for is now at your finger tips 👌!
          </p>
        </p>
        <p className="t-developers__block">
          <h1>Stop talking and gieb data please</h1>
          <p className="t-developers__tldr">
            <strong>TL;DR:</strong> Clone everything.<br />
            In the <a href="https://github.com/gabriel-dehan/chronicondb-client/tree/main/src/engine">Engine data folder</a>, <code>{filters.patch}/extracts/</code> contains almost all the data in JSON format for the latest version.<br />
            The <a href="https://github.com/gabriel-dehan/chronicondb-client/tree/main/src/types">Types</a> will help you make sense of those json files: for instance <code>items.json</code> has it's interface <code>Item</code> in the <code>types/Item.types.ts</code> file.<br />
            The rest of the non-versioned data, is in the Engine data folder: <code>dataMappings.ts</code> and <code>enchantsPool.json</code> are the most useful.
          </p>
          <p>
            ChroniconDB is an <strong>open source</strong> React/Typescript application and everything can be found in the <a href="https://github.com/gabriel-dehan/chronicondb-client">Github Repository</a>.<br />
            Rest assured that even if you don't know Typescript you should still be able to use the data provided here.<br /><br />
            The main issue on our hands is that <strong>I did the coding</strong>. It has - therefore and inevitably - become <strong>a mess</strong>. Believe me.<br />
          </p>
          <p>
            So <strong>let me guide you</strong> through this ungodly jungle:<br />
            If you're not interested in the display intricacies (a.k.a the front-end) but want some data and logic,
            everything can be found in the <a href="https://github.com/gabriel-dehan/chronicondb-client/tree/main/src/engine">Engine</a>, or more specifically in the <a href="https://github.com/gabriel-dehan/chronicondb-client/tree/main/src/engine">Engine data folder</a>.
          </p>
          <p>
            In here you'll find the following architecture:

            <pre>
              .<br />
              ├── <strong>1.10.5/</strong><br />
              │   ├── ...<br />
              ├── <strong>1.10.4/</strong><br />
              │   ├── ...<br />
              ├── <strong>1.10.2/</strong><br />
              │   ├── <strong>extracts/</strong><br />
              │   │   ├── enchants.json<br />
              │   │   ├── enchantsSearchIndex.json<br />
              │   │   ├── index.ts<br />
              │   │   ├── items.json<br />
              │   │   ├── itemsSearchIndex.json<br />
              │   │   ├── sets.json<br />
              │   │   ├── skills.json<br />
              │   │   ├── skillsByClass.json<br />
              │   │   └── skillsSearchIndex.json<br />
              │   └── <strong>sources/</strong><br />
              │       ├── enchantlist.txt<br />
              │       ├── itemlist.txt<br />
              │       ├── skilldata_1.10.2.json<br />
              │       └── <strong>locale/</strong><br />
              │           └── ...<br />
              ├── <strong>injected/</strong><br />
              │   └── gemenchantlist.txt<br />
              ├── dataMappings.ts<br />
              ├── enchantsPool.json<br />
              ├── enchantsPoolByName.json<br />
              ├── index.ts<br />
              └── patches.json<br />
            </pre>
            Let's start, shall we?
          </p>
          <p>
            <h2>VERSIONS</h2>
            Those folders, aptly named by their respective versions <code>x.y.z/</code>, contain most of the data you'll need.<br />
            They are automatically created using the command <code>yarn parse:all x.y.z</code> whenever I see that a new version of Chronicon is out.<br />
            If you can't see a folder for the latest version, it probably means that <strong>I've been ran over by a Moose</strong>, an unfortunate accident.<br />
            But don't fret, you can still generate everything you need yourself by following <a href="https://github.com/gabriel-dehan/chronicondb-client#how-to-get-up-to-date-item-and-skills-data">those instructions</a>.<br /><br />

            So we have something that looks like this.
            <pre>
              .<br />
              ├── <strong>1.10.4/</strong><br />
              │   ├── <strong>extracts/</strong><br />
              │   └── <strong>sources/</strong><br />
              ├── <strong>1.10.2/</strong><br />
              │   ├── <strong>extracts/</strong><br />
              │   └── <strong>sources/</strong><br />
              ├── ...<br />
              │
            </pre>
            <p>
              There are two folders per version:
              <ul>
                <li><code><strong>sources/</strong></code>, contains all the data extracted from the game itself, mainly CSV (sort of) and locales (translations) files.</li>
                <li>
                  <code><strong>extracts/</strong></code>, is where it gets spicy, as it contains all the data parsed and formatted, both from versioned data, and manually extracted data (sigh.)<br />
                  Everything inside the folder is pretty self explanatory, just don't pay attention to the <code>*SearchIndex.json</code> files, they are used internally. But if you need indexes for your own search engine, please feel free to use those.<br />
                  To help make sense of those files, do not hesitate to take a peak at the <a href="https://github.com/gabriel-dehan/chronicondb-client/tree/main/src/types">Types</a>: for instance <code>items.json</code> has it's interface <code>Item</code> in the <code>types/Item.types.ts</code> file.
                </li>
              </ul>
            </p>
          </p>
          <p>
            <h2>DATAMAPS</h2>
            A fancy word for everything I had to map-out by hand (pepega) because it could not be extracted from the game directly.
            I am talking about the following files:

            <pre>
              .<br />
              ├── <strong>injected/</strong><br />
              │   └── gemenchantlist.txt<br />
              ├── dataMappings.ts<br />
              ├── enchantsPool.json<br />
              ├── enchantsPoolByName.json<br />
              └── patches.json<br />
            </pre>
            <ul>
              <li>
                <code><strong>injected/</strong></code>, does not contain much apart from my tears and blood, and a manually extracted list of gem enchants. Those are automatically baked in the versioned <code>enchants.json</code> so you can forget about it.
              </li>
              <li>
                <code>dataMappings.ts</code> contains most of the data mappings, mainly which item goes in which set, all the sets ids, what item type is in which category, etc...
              </li>
              <li>
                <code>enchantsPool.ts</code> and <code>enchantsPoolByName.ts</code> are pretty much extracted from <a href="https://steamcommunity.com/sharedfiles/filedetails/?id=835123683" rel="nofollow">this guide</a>, they should help you identify which enchants goes with which type of item.
              </li>
              <li>
                <code>patches.json</code> contains all the patches known to the application. Not very useful to you, I guess.
              </li>
            </ul>
            As said before, to help make sense of this mess, the <a href="https://github.com/gabriel-dehan/chronicondb-client/tree/main/src/types">Types</a> are a breath of fresh air.
          </p>
          <p>
            <h2>ENGINE</h2>
            <a href="https://github.com/gabriel-dehan/chronicondb-client/tree/main/src/engine">This</a> is a bit application specific, but could probably be used elsewhere.<br />
            <pre>
              . <br/>
              ├── Engine.ts<br/>
              ├── EngineEnchants.ts<br/>
              ├── EngineItems.ts<br/>
              ├── EngineSkills.ts<br/>
              ├── context.ts<br/>
              ├── <strong>data/</strong><br/>
              ├── <strong>parsers/</strong><br/>
              └── <strong>utils/</strong><br/>
            </pre>
            <ul>
              <li>
                <code><strong>data/</strong></code>, you know this one. I just can't seem to be able to shut up about it.
              </li>
              <li>
                In the <code><strong>parsers/</strong></code> folder you'll find the code that generates the versioned JSON extracts. The code that is called when you do a <code>yarn parse:all VERSION</code>, yup, the one.
              </li>
              <li>
                <code>Engine.ts</code>, <code>EngineItems.ts</code>, <code>EngineEnchants.ts</code>, <code>EngineSkills.ts</code>, contain a lot of logic code, as well as finders, filters, and helper methods to work with the data.
              </li>
            </ul>
          </p>
          <p>
            <h2>TEMPLATING</h2>
            If you look at the enchants and skills, you'll notice that their descriptions are looking like that:
            <pre>
              Using a |Shield¥ skill increases |Sword¥ skill damage by EFFECT% for DURATION seconds, stacking VALUE times. Using a |Sword¥ skill increases |Shield¥ skill damage by EFFECT% for DURATION seconds, stacking VALUE times.
            </pre>
            This is called a templating string and actual values are usually inserted into it at runtime.
            The templating system in Chronicon is a bit convoluted but if you want to see how it's integrated in ChroniconDB, feel free to look at the <code>renderDescription()</code> functions in the following files: <a href="https://github.com/gabriel-dehan/chronicondb-client/blob/main/src/components/organisms/Skills/Skill/Skill.tsx">Skills</a> and <a href="https://github.com/gabriel-dehan/chronicondb-client/blob/main/src/components/molecules/Items/AppliedEnchant/AppliedEnchant.tsx">Enchants</a>.
          </p>
          <p>
            <h2>ASSETS</h2>
            If you've read up to here, I believe you'll be able to find them yourselves in the repository.<br />
            Think of it as your homework if you will. Hint: it's not in the Engine.
          </p>

          <p>
            Use the data as you like, the same goes for the code. If you want to take out the parsers and use them directly into your own projects, do it.<br />
            <a href="http://www.wtfpl.net/about/">Do whatever the fuck you want</a> with all this.<br /><br />
            That's all I could think of for now, hope it helped.
          </p>
        </p>
      </div>
    </>
  );
};

export default DevelopersTemplate;