import { createSlice } from "@reduxjs/toolkit";

const blacklistesSlice = createSlice({
    name:'blacklistes',
    initialState:{
      blackliste :[]
    },
    reducers:{
         setBlacklistes:(state,action)=>{state.blackliste = action.payload },
     }
})
export const  { setBlacklistes } = blacklistesSlice.actions;
export default blacklistesSlice.reducer;