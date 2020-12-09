import React, { FunctionComponent, useState } from 'react';

import { map } from 'lodash';
import Drawer from 'rc-drawer';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import Icon, { IconName } from 'components/atoms/Icon/Icon';
import useEngine from 'hooks/useEngine';
import useFilters from 'hooks/useFilters';
import useResponsive from 'hooks/useResponsive';
import { CharacterClass } from 'types/Character.types';
import { SkillsFilters, FiltersType } from 'types/Filters.types';
import { SkillTree } from 'types/Skill.types';

import './Categories.scss';

// TODO: Refacto in a sidebar component that can be used for skills, enchants and items
const Categories: FunctionComponent = () => {
  const { isUpToTablet } = useResponsive();
  const Engine = useEngine();
  const [filters, setFilters] = useFilters<SkillsFilters>(FiltersType.Skills);

  const { Skills: { treesByClasses, defaultClass, defaultTree } } = Engine;
  const baseClass = (filters.characterClass ?? defaultClass) as CharacterClass;
  const baseTree = (filters.tree ?? defaultTree) as SkillTree;

  const [selectedClass, setSelectedClass] = useState<CharacterClass>(baseClass);
  const [selectedTree, setSelectedTree] = useState<SkillTree>(baseTree);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isUpToTablet) {
    return (
      <Drawer
        open={isMobileMenuOpen}
        onHandleClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onClose={() => setIsMobileMenuOpen(false)}
        className={`o-skillClasses__menuMobile class-${selectedClass.toLowerCase()}`}
        width="60vw"
        placement={'left'}
      >
        {renderCategoryMenu()}
      </Drawer>
    );
  } else {
    return renderCategoryMenu();
  }

  function renderSkillTrees(characterClass: CharacterClass, skillTrees: SkillTree[]) {
    return (
      <ul className="o-skillClasses__skillTrees">
        {skillTrees.map(skillTree => (
          <li
            key={`skill-tree-${skillTree}`}
            className={`o-skillClasses__skillTree ${selectedTree === skillTree ? 'selected' : ''}`}
          >
            <span
              className="o-skillClasses__skillTreeName"
              onClick={() => onSkillTreeSelect(characterClass, skillTree)}
            >
              {skillTree}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  function renderCategoryMenu() {
    return (
      <ul className="o-skillClasses">
        {map(treesByClasses, ((skillTrees, characterClass: CharacterClass) => {
          const isSelected = selectedClass === characterClass;

          if (!skillTrees) { return null; }

          return (
            <li
              key={`skill-class-${characterClass}`}
              className={`o-skillClasses__class ${isSelected ? 'selected' : ''}`}
            >
              <span
                className="o-skillClasses__className"
                onClick={() => onClassSelect(characterClass)}
              >
                <Icon
                  className="o-skillClasses__className-arrow"
                  width={isSelected ? 14 : 6}
                  height={isSelected ? 7 : 12}
                  name={isSelected ? IconName.ArrowDownBlue : IconName.ArrowRightBlue}
                />
                {characterClass}
                <GameIcon
                  className="o-skillClasses__className-icon"
                  type={GameIconType.ClassHeader}
                  name={characterClass.toLowerCase()}
                  width={32}
                />
              </span>
              {renderSkillTrees(characterClass, skillTrees)}
            </li>
          );
        }))}
      </ul>
    );
  }

  function onClassSelect(characterClass: CharacterClass) {
    const defaultSkillTree = Engine.Skills.defaultTreeForClass(characterClass);

    setSelectedClass(characterClass);
    setSelectedTree(defaultSkillTree);
    setFilters({ characterClass, tree: defaultSkillTree });
  }

  function onSkillTreeSelect(characterClass: CharacterClass, skillTree: SkillTree) {
    setSelectedTree(skillTree);
    setFilters({ characterClass, tree: skillTree });
    setIsMobileMenuOpen(false);
  }
};

export default Categories;