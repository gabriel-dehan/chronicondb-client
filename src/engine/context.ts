import { createContext } from 'react';

import Engine from 'engine/Engine';

/* Ugly but the engine context will be set for sure in the App and it is not supposed to be null
 * We could create a new Engine() to discard it right afterwards but that'd be worse in term of memory
 */
const EngineContext = createContext<Engine>(null as unknown as Engine);

export default EngineContext;
