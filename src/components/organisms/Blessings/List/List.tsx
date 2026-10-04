import React, { FunctionComponent } from 'react';

import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { Blessing as BlessingInterface, BlessingKind, Curse as CurseInterface } from 'types/Blessing.types';

import Blessing from '../Blessing/Blessing';
import Curse from '../Curse/Curse';

import './List.scss';

interface Props {
  kind: BlessingKind;
  blessings?: BlessingInterface[];
  curses?: CurseInterface[];
}

const List: FunctionComponent<Props> = ({ kind, blessings = [], curses = [] }) => {
  const entries: (BlessingInterface | CurseInterface)[] = kind === BlessingKind.Curses ? curses : blessings;
  const { paginatedData, InfiniteScroll } = useInfiniteScroll<BlessingInterface | CurseInterface>(entries, 20);

  return (
    <div className="o-blessingsList">
      {entries.length > 0 ? (
        <InfiniteScroll>
          {paginatedData.map(entry => kind === BlessingKind.Curses ? (
            <Curse key={`curse-${entry.uuid}`} curse={entry as CurseInterface} />
          ) : (
            <Blessing key={`blessing-${entry.uuid}`} blessing={entry as BlessingInterface} />
          ))}
        </InfiniteScroll>
      ) : (
        <div className="o-blessingsList__empty">
          No {kind === BlessingKind.Curses ? 'curse' : 'blessing'} was found matching these criteria.
          <br />
          Blessings and Curses were added in patch 1.60.0 with the Cosmic Curse DLC.
        </div>
      )}
    </div>
  );
};

export default List;
