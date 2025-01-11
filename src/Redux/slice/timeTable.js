import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import TimeTableServices from '../api/TimeTableServices';

export const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  message: null,
};

export const createTimeTable = createAsyncThunk('timeTable/createTimeTable', async (data) => {
  try {
    console.log("data==>", data)
    const res = await TimeTableServices.createTimeTable(data);
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

export const getAllTimeTable = createAsyncThunk('timeTable/getAllTimeTable', async () => {
  try {
    const res = await TimeTableServices.getAllTimeTable();
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

export const deleteTimeTableById = createAsyncThunk('timeTable/deleteTimeTableById', async (id) => {
  try {
    const res = await TimeTableServices.deleteTimeTableById(id);
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



export const timeTabletSlice = createSlice({
  name: 'timeTable',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder.addCase(createTimeTable.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createTimeTable.fulfilled, (state) => {
      state.loading = 'idle';
      // state.data = action.payload;
      // state.message = action.payload.message;
    });
    builder.addCase(createTimeTable.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(getAllTimeTable.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllTimeTable.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.data = action.payload;
      state.message = action.payload.message;
    });
    builder.addCase(getAllTimeTable.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(deleteTimeTableById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(deleteTimeTableById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.message = action.payload.message;
    });
    builder.addCase(deleteTimeTableById.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

  },
});


export default timeTabletSlice.reducer;
