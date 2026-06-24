import { createSlice } from "@reduxjs/toolkit";

const empruntSlice = createSlice({
    name:'emprunt',
    initialState:{
     setUpdateStu:null,
     loans:[]
    },
    reducers:{
        SetLoans:(state,action)=>{state.loans = action.payload },
        SetUpdateStu:(state,action)=>{state.setUpdateStu = action.payload },
        ClearUpdateStu:(state)=>{state.setUpdateStu = null }
    }
})
export const  { SetUpdateStu, ClearUpdateStu,SetLoans } = empruntSlice.actions;
export default empruntSlice.reducer;