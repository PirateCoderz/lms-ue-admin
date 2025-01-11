import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import UserServices from '../api/UserServices';

export const initialState = {
  data: {},
  loading: 'idle',
  error: null,
  message: null,
};

export const loginUsers = createAsyncThunk('users/loginUsers', async (data) => {
  try {
    console.log('data==>', data);
    const res = await UserServices.loginUser(data);
    console.log('res==>', res);
    // if (res.data) {
    //   toast.success(res.data.data.message);
    // }
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return error.message;
  }
});

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUsers.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(loginUsers.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.data = action.payload;
    });
    builder.addCase(loginUsers.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload;
    });
  },
});

export default usersSlice.reducer;
