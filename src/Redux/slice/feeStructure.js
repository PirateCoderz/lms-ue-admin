import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import FeeStructureServices from '../api/FeeStructureServices';

export const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  message: null,
};

export const createFeeStructure = createAsyncThunk('feeStructure/createFeeStructure', async (data) => {
  try {
    console.log("data==>", data)
    const res = await FeeStructureServices.createFeeStructure(data);
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

export const getAllFeeStructure = createAsyncThunk('feeStructure/getAllFeeStructure', async () => {
  try {
    const res = await FeeStructureServices.getAllFeeStructure();
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

export const deleteFeeStructuretById = createAsyncThunk('feeStructure/deleteFeeStructuretById', async (id) => {
  try {
    const res = await FeeStructureServices.deleteFeeStructuretById(id);
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
    builder.addCase(createFeeStructure.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createFeeStructure.fulfilled, (state) => {
      state.loading = 'idle';
      // state.data = action.payload;
      // state.message = action.payload.message;
    });
    builder.addCase(createFeeStructure.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(getAllFeeStructure.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllFeeStructure.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.data = action.payload;
      state.message = action.payload.message;
    });
    builder.addCase(getAllFeeStructure.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(deleteFeeStructuretById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(deleteFeeStructuretById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.message = action.payload.message;
    });
    builder.addCase(deleteFeeStructuretById.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

  },
});


export default meritListSlice.reducer;
