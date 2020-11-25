import { useContext } from 'react';

import EngineContext from 'engine/context';
import Engine from 'engine/Engine';

export default function useEngine(from: string): Engine {
  const engine = useContext(EngineContext);

  return engine;
}