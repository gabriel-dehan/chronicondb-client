import React, { FunctionComponent } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { isEmpty } from 'lodash';
import qs from 'query-string';

import Icon, { IconName } from 'components/atoms/Icon/Icon';
import Skill from 'components/organisms/Skills/Skill/Skill';
import useEngine from 'hooks/useEngine';
import useSeo from 'hooks/useSeo';
import { RoutePath } from 'routes';
import { CharacterClass } from 'types/Character.types';

import './SkillTemplate.scss';

const SkillTemplate: FunctionComponent = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();
  const queryParams = qs.parse(location.search);
  const findParams = !isEmpty(queryParams) ? { class: queryParams.skillCharacterClass as CharacterClass } : undefined;

  const Engine = useEngine();
  const skill = Engine.Skills.find(parseInt(uuid), findParams);
  const Seo = useSeo({
    title: skill ? skill.name : 'Skill not found',
    description: skill ? `Find all the information about ${skill.name}` : 'Skill not found',
  });

  return (
    <>
      <Seo />
      <div className="t-skill">
        {skill ? (
          <>
            <div className="t-skill__header">
              <Link to={RoutePath.Skills}>
                <Icon
                  className="t-skill__header-icon"
                  width={7}
                  height={14}
                  name={IconName.ArrowRightWhite}
                /> Back to skills
              </Link>
            </div>
            <div className="t-skill__container">
              <Skill skill={skill} />
            </div>
          </>
        ) : (
          <div className="t-skill__notFound">
            Skill Not Found
          </div>
        )}
      </div>
    </>
  );
};

export default SkillTemplate;