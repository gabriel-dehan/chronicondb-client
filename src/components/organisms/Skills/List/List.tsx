import React, { FunctionComponent } from 'react';

import Header from 'components/molecules/Items/Header/Header';
import Skill from 'components/organisms/Skills/Skill/Skill';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import { Skill as SkillInterface } from 'types/Skill.types';

import './List.scss';

interface Props {
  skills: SkillInterface[];
}

const List: FunctionComponent<Props> = ({ skills }) => {
  const { paginatedData, InfiniteScroll } =  useInfiniteScroll<SkillInterface>(skills, 10);

  return (
    <div className="o-skillsList">
      {skills.length > 0 ? (
        <>
          <Header />
          <div className="o-skillsList__container">
            <div className="o-skillsList__skills">
              {/* <InfiniteScroll> */}
              {skills.map(skill => (
                <Skill key={`skill-${skill.uuid}-${skill.class}`} skill={skill} />
              ))}
              {/* </InfiniteScroll> */}
            </div>
          </div>
        </>
      ) : (
        <div className="o-skillsList__noSkill">
          No skill was found matching these criteria.
        </div>
      )}
    </div>
  );
};

export default List;