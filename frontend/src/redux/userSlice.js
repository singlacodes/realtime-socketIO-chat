import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers: null,
    selectedUser: null,
    socket: null,
    onlineUsers: [],
    searchData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = Array.isArray(action.payload) ? action.payload : [];
    },
    setSearchData: (state, action) => {
      state.searchData = action.payload;
    },
  },
});

export const {
  setUserData,
  setOtherUsers,
  setSelectedUser,
  setSocket,
  setOnlineUsers,
  setSearchData,
} = userSlice.actions;
export default userSlice.reducer;
