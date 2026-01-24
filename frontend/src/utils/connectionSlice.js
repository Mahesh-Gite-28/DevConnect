import { createSlice } from "@reduxjs/toolkit";

const connectionSlice=createSlice({
    name:"connections",
    initialState:[],
    reducers:{
        addconnections:(state,action)=>action.payload,
        removeconnections:()=>[]
    }
})

export const { addconnections, removeconnections } = connectionSlice.actions;
export default connectionSlice.reducer;