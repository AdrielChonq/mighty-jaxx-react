import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./";

const initialState: types.IModalMessage = {
  isOpen: false,
  title: "",
  content: "",
  positiveLabel: "",
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    showModalMessage: (state, action: PayloadAction<types.IModalMessage>) => {
      state.isOpen = action.payload.isOpen;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.positiveLabel = action.payload.positiveLabel;
    },
    hideModalMessage: (state) => {
      state.isOpen = false;
      state.title = "";
      state.content = "";
      state.positiveLabel = "";
    },
  },
});

export const { showModalMessage, hideModalMessage } = commonSlice.actions;

export const getIsOpen = (state: RootState) => state.common.isOpen;

export default commonSlice.reducer;
