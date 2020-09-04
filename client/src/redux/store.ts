import { createStore } from "redux";

import rootReducer from './reducers';

export type rootState = ReturnType<typeof rootReducer>;

export default createStore(rootReducer);