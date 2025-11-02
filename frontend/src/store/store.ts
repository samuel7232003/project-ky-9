import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import languageReducer from './slices/languageSlice';
import loginReducer from '../pages/Login/Login.duck';
import mainReducer from '../pages/Main/Main.duck';
import knowledgeLibReducer from '../pages/Main/KnowledgeLib/KnowledgeLib.duck';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    login: loginReducer,
    main: mainReducer,
    knowledgeLib: knowledgeLibReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


