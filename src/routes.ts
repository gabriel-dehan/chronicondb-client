export enum RouteId {
  Items = 'items',
  Enchants  = 'enchants',
  Skills = 'skills',
  Developers = 'developers',
}

export enum RoutePath {
  Items = '/items',
  Enchants = '/enchants',
  Skills = '/skills',
  Developers = '/developers',
}

interface RoutesMapping {
  [key: string]: RouteId;
}

export const ROUTES_ID_MAPPING: RoutesMapping = {
  [RoutePath.Items]: RouteId.Items,
  [RoutePath.Enchants]: RouteId.Enchants,
  [RoutePath.Skills]: RouteId.Skills,
  [RoutePath.Developers]: RouteId.Developers,
};
