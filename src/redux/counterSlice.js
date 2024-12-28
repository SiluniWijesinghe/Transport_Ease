import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    clearCounter:(state)=>{
      state.value=0;
    }
  },
});

export const { increment,clearCounter } = counterSlice.actions;
export default counterSlice.reducer;
