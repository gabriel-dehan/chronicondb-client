import React, { FunctionComponent, useState } from 'react';

import { map } from 'lodash';
import Drawer from 'rc-drawer';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import Icon, { IconName } from 'components/atoms/Icon/Icon';
import useEngine from 'hooks/useEngine';
import useFilters from 'hooks/useFilters';
import useResponsive from 'hooks/useResponsive';
import { EnchantCategory, EnchantType } from 'types/Enchant.types';
import { EnchantsFilters, FiltersType } from 'types/Filters.types';

import './Categories.scss';

// TODO: Refacto in a sidebar component that can be used for skills, enchants and items
const Categories: FunctionComponent = () => {
  const { isUpToTablet } = useResponsive();
  const Engine = useEngine();
  const [filters, setFilters] = useFilters<EnchantsFilters>(FiltersType.Enchants);

  const { Enchants: { categoriesByTypes, defaultCategory, defaultType } } = Engine;
  const baseCategory = (filters.category ?? defaultCategory) as EnchantCategory;
  const baseType = (filters.type ?? defaultType) as EnchantType;

  const [selectedCategory, setSelectedCategory] = useState<EnchantCategory>(baseCategory);
  const [selectedType, setSelectedType] = useState<EnchantType>(baseType);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isUpToTablet) {
    return (
      <Drawer
        open={isMobileMenuOpen}
        onHandleClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onClose={() => setIsMobileMenuOpen(false)}
        className={`o-enchantTypes__menuMobile type-${selectedType.toLowerCase()}`}
        width="60vw"
        placement={'left'}
      >
        {renderTypeMenu()}
      </Drawer>
    );
  } else {
    return renderTypeMenu();
  }

  function renderCategories(type: EnchantType, enchantCategories: EnchantCategory[]) {
    return (
      <ul className="o-enchantTypes__enchantCategories">
        {enchantCategories.map(enchantCategory => (
          <li
            key={`enchant-type-${enchantCategory}`}
            className={`o-enchantTypes__enchantCategory ${selectedCategory === enchantCategory ? 'selected' : ''}`}
          >
            <span
              className="o-enchantTypes__enchantCategoryName"
              onClick={() => onCategorySelect(enchantCategory, type)}
            >
              {enchantCategory === EnchantCategory.Enchant ? 'Item' : enchantCategory}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  function renderTypeMenu() {
    return (
      <ul className="o-enchantTypes">
        {map(categoriesByTypes, ((enchantTypes, type: EnchantType) => {
          const isSelected = selectedType === type;
          return (
            <li
              key={`enchant-type-${type}`}
              className={`o-enchantTypes__type ${isSelected ? 'selected' : ''}`}
            >
              <span
                className="o-enchantTypes__typeName"
                onClick={() => onTypeSelect(type)}
              >
                <Icon
                  className="o-enchantTypes__typeName-arrow"
                  width={isSelected ? 14 : 6}
                  height={isSelected ? 7 : 12}
                  name={isSelected ? IconName.ArrowDownBlue : IconName.ArrowRightBlue}
                />
                {type}
                <GameIcon
                  className="o-enchantTypes__typeName-icon"
                  type={GameIconType.EnchantType}
                  name={type.includes('/') ? 'gem' : type}
                  width={type.includes('/') ? 20 : 28}
                />
              </span>
              {renderCategories(type, enchantTypes)}
            </li>
          );
        }))}
      </ul>
    );
  }

  function onTypeSelect(type: EnchantType) {
    const defaultEnchantCategory = categoriesByTypes[type][0];

    setSelectedType(type);
    setSelectedCategory(defaultEnchantCategory);
    setFilters({ type, category: defaultEnchantCategory });
  }

  function onCategorySelect(category: EnchantCategory, enchantType: EnchantType) {
    setSelectedCategory(category);
    setFilters({ category, type: enchantType });
    setIsMobileMenuOpen(false);
  }
};

export default Categories;