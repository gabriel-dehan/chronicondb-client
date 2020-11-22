import React, { FunctionComponent, useState } from 'react';

import { map } from 'lodash';

import Icon, { IconName } from 'components/atoms/Icon/Icon';
import useEngine from 'hooks/useEngine';
import useQueryParams from 'hooks/useQueryParams';
import { ItemCategory, ItemType } from 'types/Item.types';

import './Categories.scss';

type QueryParams = {
  items: {
    category?: string;
    type?: string;
  };
};

const Categories: FunctionComponent = () => {
  const Engine = useEngine();
  const { items: { categories, typesByCategories } } = Engine;

  const [params, setQueryParams] = useQueryParams<QueryParams>();
  const defaultCategory = (params.items?.category ?? categories[0]) as ItemCategory;
  const defaultType = (params.items?.type ?? typesByCategories[defaultCategory][0]) as ItemType;

  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>(defaultCategory);
  const [selectedType, setSelectedType] = useState<ItemType>(defaultType);

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
                className="o-categories__categoryName-icon"
                width={isSelected ? 14 : 6}
                height={isSelected ? 7 : 12}
                name={isSelected ? IconName.ArrowDownBlue : IconName.ArrowRightBlue}
              />
              {category}
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
              {itemType}
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
    setQueryParams({ items: { category, type: defaultItemType } });
  }

  function onItemTypeSelect(category: ItemCategory, itemType: ItemType) {
    setSelectedType(itemType);
    setQueryParams({ items: { category, type: itemType } });
  }
};

export default Categories;