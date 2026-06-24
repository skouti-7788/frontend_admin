import { configureStore } from "@reduxjs/toolkit";
import empruntsSlice from "./redux/emruntsSlice";
import blacklistesSlice from './redux/blacklistesSlice'
const store = configureStore({
    reducer:{
       emprunt:empruntsSlice,
       blacklistes:blacklistesSlice
    }
})
export default store;