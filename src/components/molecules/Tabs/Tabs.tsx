import React, { FunctionComponent, useState } from 'react';

import './Tabs.scss';

export interface TabsNavItem {
  label: string;
  color: string;
  borderColor?: string;
  hoverColor?: string;
}

interface Props {
  className?: string;
  defaultItem?: number;
  navItems: TabsNavItem[];
}

// TODO: Should definitely handle colors differently, this is disgusting
const EnchantsPool: FunctionComponent<Props> = ({
  className,
  navItems,
  defaultItem,
  children,
}) => {
  const [currentTab, setCurrentTab] = useState(defaultItem || 0);

  return (
    <div className={`m-tabs ${className ? className : ''}`}>
      <ul className="m-tabs__navigation">
        {navItems.map((navItem: TabsNavItem, index) => (
          <li
            key={`tab-${navItem.label}-${index}`}
            className={`m-tabs__navigation-tab ${currentTab === index ? 'selected' : ''}`}
            style={{
              '--box-shadow-color': navItem.hoverColor || navItem.color,
              color: navItem.color,
              borderColor: navItem.borderColor || navItem.color,
            } as React.CSSProperties}
            onClick={() => onTabClick(index)}
          >
            {navItem.label}
          </li>
        ))}
      </ul>

      {React.Children.map(children, node => (
        <div key={`tabPanel-${currentTab}`}>
          {node}
        </div>
      ))?.filter((_, i) => i === currentTab)}
    </div>
  );

  function onTabClick(index: number) {
    setCurrentTab(index);
  }

};

export default EnchantsPool;