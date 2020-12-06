export enum RouteId {
  Items = 'items',
  Item = 'item',
  Enchants  = 'enchants',
  Enchant  = 'enchant',
  Skills = 'skills',
  Skill = 'skill',
  Help = 'help',
  Developers = 'developers',
}

export enum RoutePath {
  Items = '/items',
  Item = '/item/:uuid',
  Enchant = '/enchants',
  Enchants = '/enchant/:uuid',
  Skills = '/skills',
  Skill = '/skill/:uuid',
  Help = '/help',
  Developers = '/developers',
}

interface RoutesMapping {
  [key: string]: RouteId;
}

export const ROUTES_ID_MAPPING: RoutesMapping = {
  [RoutePath.Items]: RouteId.Items,
  [RoutePath.Item]: RouteId.Item,
  [RoutePath.Enchants]: RouteId.Enchants,
  [RoutePath.Enchant]: RouteId.Enchant,
  [RoutePath.Skills]: RouteId.Skills,
  [RoutePath.Skill]: RouteId.Skill,
  [RoutePath.Help]: RouteId.Help,
  [RoutePath.Developers]: RouteId.Developers,
};
