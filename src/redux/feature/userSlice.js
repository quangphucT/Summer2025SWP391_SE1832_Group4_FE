import { createSlice } from "@reduxjs/toolkit";

const initialState = null;
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveInformation: (state, action) => (state = action.payload),
    removeInformation: () => initialState,
    updateProfile: (state, action) => {
      return {
        ...state,
        ...action.payload, // chỉ ghi đè phần thay đổi
      };
    },
  },
});
export const { saveInformation, removeInformation, updateProfile } = userSlice.actions;
export default userSlice.reducer;