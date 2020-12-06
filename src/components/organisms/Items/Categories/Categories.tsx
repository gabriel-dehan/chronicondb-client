import React, { FunctionComponent, useState } from 'react';

import { map } from 'lodash';
import Drawer from 'rc-drawer';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import Icon, { IconName } from 'components/atoms/Icon/Icon';
import useEngine from 'hooks/useEngine';
import useFilters from 'hooks/useFilters';
import useResponsive from 'hooks/useResponsive';
import { ItemsFilters, FiltersType } from 'types/Filters.types';
import { ItemCategory, ItemType } from 'types/Item.types';

import './Categories.scss';

// TODO: Refacto in a sidebar component that can be used for skills, enchants and items
const Categories: FunctionComponent = () => {
  const { isUpToTablet } = useResponsive();
  const Engine = useEngine();
  const [filters, setFilters] = useFilters<ItemsFilters>(FiltersType.Items);

  const { Items: { typesByCategories, defaultCategory, defaultType } } = Engine;
  const baseCategory = (filters.category ?? defaultCategory) as ItemCategory;
  const baseType = (filters.type ?? defaultType) as ItemType;

  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>(baseCategory);
  const [selectedType, setSelectedType] = useState<ItemType>(baseType);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isUpToTablet) {
    return (
      <Drawer
        open={isMobileMenuOpen}
        onHandleClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onClose={() => setIsMobileMenuOpen(false)}
        className={`o-itemCategories__menuMobile category-${selectedCategory.toLowerCase()}`}
        width="60vw"
        placement={'left'}
      >
        {renderCategoryMenu()}
      </Drawer>
    );
  } else {
    return renderCategoryMenu();
  }

  function renderItemTypes(category: ItemCategory, itemTypes: ItemType[]) {
    return (
      <ul className="o-itemCategories__itemTypes">
        {itemTypes.map(itemType => (
          <li
            key={`item-type-${itemType}`}
            className={`o-itemCategories__itemType ${selectedType === itemType ? 'selected' : ''}`}
          >
            <span
              className="o-itemCategories__itemTypeName"
              onClick={() => onItemTypeSelect(category, itemType)}
            >
              {itemType === ItemType.Rune ? 'Rune' : itemType}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  function renderCategoryMenu() {
    return (
      <ul className="o-itemCategories">
        {map(typesByCategories, ((itemTypes, category: ItemCategory) => {
          const isSelected = selectedCategory === category;
          return (
            <li
              key={`item-category-${category}`}
              className={`o-itemCategories__category ${isSelected ? 'selected' : ''}`}
            >
              <span
                className="o-itemCategories__categoryName"
                onClick={() => onCategorySelect(category)}
              >
                <Icon
                  className="o-itemCategories__categoryName-arrow"
                  width={isSelected ? 14 : 6}
                  height={isSelected ? 7 : 12}
                  name={isSelected ? IconName.ArrowDownBlue : IconName.ArrowRightBlue}
                />
                {category}
                <GameIcon
                  className="o-itemCategories__categoryName-icon"
                  type={GameIconType.ItemCategory}
                  name={category}
                  width={28}
                />
              </span>
              {renderItemTypes(category, itemTypes)}
            </li>
          );
        }))}
      </ul>
    );
  }

  function onCategorySelect(category: ItemCategory) {
    const defaultItemType = typesByCategories[category][0];

    setSelectedCategory(category);
    setSelectedType(defaultItemType);
    setFilters({ category, type: defaultItemType });
  }

  function onItemTypeSelect(category: ItemCategory, itemType: ItemType) {
    setSelectedType(itemType);
    setFilters({ category, type: itemType });
    setIsMobileMenuOpen(false);
  }
};

export default Categories;