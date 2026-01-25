import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],   
  reducers: {
    addfeed: (state, action) => action.payload,
    removefeed: () => null,
    removeonefeed:(state,action)=>{
      const newArr=state.filter((user)=>user._id!=action.payload);
      return newArr;
    }
  },
});

export const { addfeed, removefeed,removeonefeed } = feedSlice.actions;
export default feedSlice.reducer;
