import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import StudentServices from '../api/StudentServices';

export const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  message: null,
};

export const createStudent = createAsyncThunk('students/createStudent', async (data) => {
  try {
    console.log("data==>", data)
    const res = await StudentServices.createStudent(data);
    console.log("res==>", res)
    if (res.data) {
      toast.success(res.data.message);
    }
    return res.data;
  } catch (error) {
    toast.error(error.response.data.message);
    return error.message;
  }
});

export const getAllStudents = createAsyncThunk('students/getAllStudents', async () => {
  try {
    const res = await StudentServices.getAllStudents();
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

export const deleteStudentById = createAsyncThunk('students/deleteStudentById', async (id) => {
  try {
    const res = await StudentServices.deleteStudentById(id);
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

export const editStudentById = createAsyncThunk('students/editStudentById', async (datas) => {  
  console.log(datas)
  const {id, data} = datas
  try {
    const res = await StudentServices.editStudentById(id, data);
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

export const userSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    handleLogout: (state) => {
      state.data = [];
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createStudent.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createStudent.fulfilled, (state) => {
      state.loading = 'idle';
      // state.data = action.payload;
      // state.message = action.payload.message;
    });
    builder.addCase(createStudent.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(getAllStudents.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllStudents.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.data = action.payload;
      state.message = action.payload.message;
    });
    builder.addCase(getAllStudents.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(deleteStudentById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(deleteStudentById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.message = action.payload.message;
    });
    builder.addCase(deleteStudentById.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(editStudentById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(editStudentById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.message = action.payload.message;
    });
    builder.addCase(editStudentById.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });
  },
});

export const { handleLogout } = userSlice.actions;

export default userSlice.reducer;
