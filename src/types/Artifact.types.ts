// { "shape": "Star Artifact",
//   "class": "Any Class",
//   "val": "1",
//   "id": "10041",
//   "description": "Become immune to all negative effects (debuffs), except cooldown-related effects.",
//   "name": "Blessed Health" }

import { CharacterClass } from './Character.types';

export interface ArtifactInterface {
  uuid: number;
  name: string;
  description: string;
  class: CharacterClass;
  type: ArtifactType;
  value: string;
}

export enum ArtifactType {
  Triangle = 'Triangle',
  Rhombus = 'Rhombus',
  Star = 'Star'
}