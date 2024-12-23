import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null, // No user is logged in initially
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload; // Set user data
    },
    clearUser: (state) => {
      state.user = null; // Clear user data
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
