export enum RouteId {
  Items = 'items',
  Item = 'item',
  Enchants  = 'enchants',
  Skills = 'skills',
  Skill = 'skill',
  Artifacts = 'artifacts',
  Developers = 'developers',
}

export enum RoutePath {
  Items = '/items',
  Item = '/item/:uuid',
  Enchants = '/enchants',
  Skills = '/skills',
  Skill = '/skill/:uuid',
  Artifacts = '/artifacts',
  Developers = '/developers',
}

interface RoutesMapping {
  [key: string]: RouteId;
}

export const ROUTES_ID_MAPPING: RoutesMapping = {
  [RoutePath.Items]: RouteId.Items,
  [RoutePath.Item]: RouteId.Item,
  [RoutePath.Enchants]: RouteId.Enchants,
  [RoutePath.Skills]: RouteId.Skills,
  [RoutePath.Skill]: RouteId.Skill,
  [RoutePath.Artifacts]: RouteId.Artifacts,
  [RoutePath.Developers]: RouteId.Developers,
};
