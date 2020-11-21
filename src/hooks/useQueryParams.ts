import { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import qs from 'query-string';

export default function useQueryparams<T extends Record<string, string | undefined>>(): [T, (params: T) => void] {
  const history = useHistory();
  const location = useLocation();
  const parsedQuery = qs.parse(location.search) as T;
  const [queryParams, setQueryParams] = useState<T>(parsedQuery);

  useEffect(() => {
    history.replace({
      search: qs.stringify(queryParams),
    });
  }, [queryParams, history]);

  useEffect(() => {
    setQueryParams(qs.parse(location.search) as T);
  }, [location.search]);

  const _setQueryParams = (params: Partial<T>) => {
    const _params = { ...queryParams, ...params };
    setQueryParams(_params);
  };

  return [queryParams, _setQueryParams];
}
