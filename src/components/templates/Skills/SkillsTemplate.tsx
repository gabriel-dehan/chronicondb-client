import React, { FunctionComponent } from 'react';

import { observer } from 'mobx-react';

import Categories from 'components/organisms/Skills/Categories/Categories';
import Filters from 'components/organisms/Skills/Filters/Filters';
import List from 'components/organisms/Skills/List/List';
import useEngine from 'hooks/useEngine';
import { useStores } from 'hooks/useStores';
import { FiltersStore } from 'stores/FiltersStore';
import { DataStore } from 'types/DataStore.types';

import './SkillsTemplate.scss';

interface Stores {
  [DataStore.Filters]: FiltersStore;
}

const SkillsTemplate: FunctionComponent = () => {
  const { filtersStore } = useStores<Stores>(DataStore.Filters);
  const Engine = useEngine();

  const skills = getFilteredSkills();

  return (
    <>
      <Filters />
      <div className="t-skills__wrapper">
        <Categories />
        <div className="t-skills__list">
          <List skills={skills} />
        </div>
      </div>
    </>
  );

  function getFilteredSkills() {
    return Engine.Skills.all({
      search: filtersStore.skills.search,
      tree: filtersStore.skills.tree,
      types: filtersStore.skills.types,
      characterClass: filtersStore.skills.characterClass,
      family: filtersStore.skills.family,
    });
  }
};

export default observer(SkillsTemplate);