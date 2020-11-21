import React, { FunctionComponent, useState } from 'react';

import { map } from 'lodash';

import useEngine from 'hooks/useEngine';
import { ItemCategory, ItemType } from 'types/Item.types';

import './Categories.scss';

const Categories: FunctionComponent = () => {
  const Engine = useEngine();
  const { items: { categories, typesByCategories } } = Engine;
  const defaultCategory = categories[0];
  const defaultType = typesByCategories[defaultCategory][0];
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>(defaultCategory);
  const [selectedType, setSelectedType] = useState<ItemType>(defaultType);

  return (
    <ul className="o-categories">
      {map(typesByCategories, ((itemTypes, category: ItemCategory) => (
        <li
          key={`item-category-${category}`}
          className={`o-categories__category ${selectedCategory === category ? 'selected' : ''}`}
          onClick={() => onCategorySelect(category)}
        >
          <span className="o-categories__categoryName">{category}</span>
          {renderItemTypes(itemTypes)}
        </li>
      )))}
    </ul>
  );

  function renderItemTypes(itemTypes: ItemType[]) {
    return (
      <ul className="o-categories__itemTypes">
        {itemTypes.map(itemType => (
          <li
            key={`item-type-${itemType}`}
            className={`o-categories__itemType ${selectedType === itemType ? 'selected' : ''}`}
            onClick={() => setSelectedType(itemType)}
          >
            <span className="o-categories__itemTypeName">{itemType}</span>
          </li>
        ))}
      </ul>
    );
  }

  function onCategorySelect(category: ItemCategory) {
    setSelectedCategory(category);
    setSelectedType(typesByCategories[category][0]);
  }
};

export default Categories;