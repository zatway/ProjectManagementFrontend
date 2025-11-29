import { combineReducers, configureStore } from '@reduxjs/toolkit';
import systemDataSlice from "./slices/systemDataSlice.ts";

const rootReducer = combineReducers({
    systemData: systemDataSlice,

});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['signalR/connect/fulfilled'],
                ignoredPaths: ['payload'],
            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppState = ReturnType<typeof rootReducer>;

export default store;
