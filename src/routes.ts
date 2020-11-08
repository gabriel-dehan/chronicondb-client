export enum RouteId {
  Items = 'items',
  Enchants  = 'enchants',
}

export enum RoutePath {
  Items = '/items',
  Enchants = '/enchants',
}

interface RoutesMapping {
  [key: string]: RouteId;
}

export const ROUTES_ID_MAPPING: RoutesMapping = {
  [RoutePath.Items]: RouteId.Items,
  [RoutePath.Enchants]: RouteId.Enchants,
};
