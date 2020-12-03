import React, { FunctionComponent, useState } from 'react';

import { map } from 'lodash';

import GameIcon, { GameIconType } from 'components/atoms/GameIcon/GameIcon';
import Icon, { IconName } from 'components/atoms/Icon/Icon';
import useEngine from 'hooks/useEngine';
import useFilters from 'hooks/useFilters';
import { ItemsFilters, FiltersType } from 'types/Filters.types';
import { ItemCategory, ItemType } from 'types/Item.types';

import './Categories.scss';

const Categories: FunctionComponent = () => {
  const Engine = useEngine();
  const [filters, setFilters] = useFilters<ItemsFilters>(FiltersType.Items);

  const { Items: { typesByCategories, defaultCategory, defaultType } } = Engine;
  const baseCategory = (filters.category ?? defaultCategory) as ItemCategory;
  const baseType = (filters.type ?? defaultType) as ItemType;

  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>(baseCategory);
  const [selectedType, setSelectedType] = useState<ItemType>(baseType);

  return (
    <ul className="o-categories">
      {map(typesByCategories, ((itemTypes, category: ItemCategory) => {
        const isSelected = selectedCategory === category;
        return (
          <li
            key={`item-category-${category}`}
            className={`o-categories__category ${isSelected ? 'selected' : ''}`}
          >
            <span
              className="o-categories__categoryName"
              onClick={() => onCategorySelect(category)}
            >
              <Icon
                className="o-categories__categoryName-arrow"
                width={isSelected ? 14 : 6}
                height={isSelected ? 7 : 12}
                name={isSelected ? IconName.ArrowDownBlue : IconName.ArrowRightBlue}
              />
              {category}
              <GameIcon
                className="o-categories__categoryName-icon"
                type={GameIconType.Category}
                name={category}
                // height={28}
                width={28}
              />
            </span>
            {renderItemTypes(category, itemTypes)}
          </li>
        );
      }))}
    </ul>
  );

  function renderItemTypes(category: ItemCategory, itemTypes: ItemType[]) {
    return (
      <ul className="o-categories__itemTypes">
        {itemTypes.map(itemType => (
          <li
            key={`item-type-${itemType}`}
            className={`o-categories__itemType ${selectedType === itemType ? 'selected' : ''}`}
          >
            <span
              className="o-categories__itemTypeName"
              onClick={() => onItemTypeSelect(category, itemType)}
            >
              {itemType === ItemType.Rune ? 'Rune' : itemType}
            </span>
          </li>
        ))}
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
  }
};

export default Categories;