import {configureStore} from '@reduxjs/toolkit';
import mainReducer from './main/mainSlice'

export const store = configureStore({
    reducer: {
        main: mainReducer
    },
});
