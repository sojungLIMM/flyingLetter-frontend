import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { postLogin, getLoggedInUser } from "../api/axios";
import { ACCESS_TOKEN } from "../constants";

export const login = createAsyncThunk(
  "user/login",
  async (
    { navigate, setModalMessage, email, password },
    { rejectWithValue }
  ) => {
    try {
      const response = await postLogin({ email, password });

      navigate("/main");

      return response;
    } catch (err) {
      setModalMessage(err.message);

      return rejectWithValue(err.message);
    }
  }
);

export const getLoginUserByToken = createAsyncThunk(
  "user/getLoginUserByToken",
  async (setModalMessage, { rejectWithValue }) => {
    try {
      const response = await getLoggedInUser();

      return response;
    } catch (err) {
      setModalMessage(err.message);

      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isLoggedIn: false,
  status: "",
  data: {
    email: "",
    nickname: "",
    profileImage: "",
    language: "",
    lat: "",
    lng: "",
    country: "",
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem(ACCESS_TOKEN);
      state.isLoggedIn = false;
      state.status = "";
      state.data = initialState.data;
    },
  },
  extraReducers: {
    [login.pending]: (state) => {
      state.status = "pending";
    },
    [login.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.status = "success";
      state.data = action.payload;
    },
    [login.rejected]: (state) => {
      state.status = "failed";
      localStorage.removeItem(ACCESS_TOKEN);
    },
    [getLoginUserByToken.pending]: (state) => {
      state.status = "pending";
    },
    [getLoginUserByToken.fulfilled]: (state, action) => {
      state.isLoggedIn = true;
      state.status = "success";
      state.data = action.payload;
    },
    [getLoginUserByToken.rejected]: (state) => {
      state.status = "failed";
      localStorage.removeItem(ACCESS_TOKEN);
    },
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
