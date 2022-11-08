import React, { FunctionComponent } from 'react';

import Header from 'components/molecules/Artifacts/Header/Header';
import useInfiniteScroll from 'hooks/useInfiniteScroll';
import './List.scss';
import { ArtifactInterface } from 'types/Artifact.types';

import Artifact from '../Artifact/Artifact';

interface Props {
  artifacts: ArtifactInterface[];
}

const List: FunctionComponent<Props> = ({ artifacts }) => {
  const { paginatedData, InfiniteScroll } =  useInfiniteScroll<ArtifactInterface>(artifacts, 10);

  return (
    <div className="o-artifactsList">
      {artifacts.length > 0 ? (
        <>
          <Header />
          <div className="o-artifactsList__container">
            <div className="o-artifactsList__artifacts">
              <InfiniteScroll>
                {paginatedData.map(artifact => (
                  <Artifact key={`artifact-${artifact.uuid}-${artifact.class}`} artifact={artifact}/>
                ))}
              </InfiniteScroll>
            </div>
          </div>
        </>
      ) : (
        <div className="o-artifactsList__noArtifact">
          No artifact was found matching these criteria.
        </div>
      )}
    </div>
  );
};

export default List;