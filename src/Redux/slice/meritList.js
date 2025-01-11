import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import MeritListServices from '../api/MeritListServices';

export const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  message: null,
};

export const createMeritList = createAsyncThunk('meritList/createMeritList', async (data) => {
  try {
    console.log("data==>", data)
    const res = await MeritListServices.createMeritList(data);
    console.log("res==>", res)
    if (res.data) {
      toast.success(res.data.data.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return error.message;
  }
});

export const getAllMeritList = createAsyncThunk('meritList/getAllMeritList', async () => {
  try {
    const res = await MeritListServices.getAllMeritList();
    console.log("res==>", res)
    if (res.data) {
      toast.success(res.data.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response.message);
    return error.message;
  }
});

export const deleteMeritListById = createAsyncThunk('meritList/deleteMeritListById', async (id) => {
  try {
    const res = await MeritListServices.deleteMeritListById(id);
    console.log("res==>", res)
    if (res.data) {
      toast.success(res.data.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response.message);
    return error.message;
  }
});



export const meritListSlice = createSlice({
  name: 'meritList',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(createMeritList.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createMeritList.fulfilled, (state) => {
      state.loading = 'idle';
      // state.data = action.payload;
      // state.message = action.payload.message;
    });
    builder.addCase(createMeritList.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(getAllMeritList.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllMeritList.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.data = action.payload;
      state.message = action.payload.message;
    });
    builder.addCase(getAllMeritList.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(deleteMeritListById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(deleteMeritListById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.message = action.payload.message;
    });
    builder.addCase(deleteMeritListById.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

  },
});


export default meritListSlice.reducer;
