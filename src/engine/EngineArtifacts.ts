import Minisearch from 'minisearch';

import { allEnumValues } from '../helpers/typeUtils';
import { ArtifactInterface, ArtifactType } from '../types/Artifact.types';
import { ArtifactsFilters } from '../types/Filters.types';
import Engine, { DataInterface } from './Engine';

export default class EngineArtifacts {
  public readonly engine: Engine;
  private searchEngine: Minisearch;
  public types: ArtifactType[];

  constructor(engine: Engine) {
    this.engine = engine;
    this.types = allEnumValues(ArtifactType);
    this.searchEngine = new Minisearch({
      idField: 'uuid',
      fields: ['name', 'class', 'type', 'description'],
      storeFields: ['uuid'],
    });
  }

  public onDataLoaded() {
    this.searchEngine.removeAll();
    this.searchEngine.addAll(this.data.artifactsSearchIndex);
  }

  /* Getters */
  private get data(): DataInterface {
    return this.engine.data as DataInterface;
  }

  private get artifacts(): ArtifactInterface[] {
    if (this.engine.loaded) {
      return this.data.artifacts;
    }

    return [];
  }

  public all(filters: ArtifactsFilters): ArtifactInterface[] {
    let artifacts = this.artifacts ?? [];
    artifacts = this.filterBySearch(artifacts, filters);
    artifacts = this.filterByType(artifacts, filters);
    artifacts.sort((a, b) => a.uuid - b.uuid);
    return artifacts;
  }

  private filterBySearch(artifacts: ArtifactInterface[], filters: ArtifactsFilters) {
    if (filters.search) {
      const resultingUuids = this.searchEngine.search(filters.search, {
        prefix: true,
        combineWith: 'AND',
      }).map(r => r.uuid);

      return artifacts.filter(skill => resultingUuids.includes(skill.uuid));
    }

    return artifacts;
  }

  public get defaultType(): ArtifactType {
    return ArtifactType.Triangle;
  }

  private filterByType(artifacts: ArtifactInterface[], filters: ArtifactsFilters) {
    if (filters.type) {
      return artifacts.filter(({ type }) => type === filters.type);
    }

    return artifacts;
  }
}
