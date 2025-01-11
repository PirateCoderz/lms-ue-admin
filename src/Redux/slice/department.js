import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import DepartmentsServices from '../api/DepartmentsServices';

export const initialState = {
  data: [],
  loading: 'idle',
  error: null,
  message: null,
};

export const createDepartment = createAsyncThunk('deparments/createDepartment', async (data) => {
  try {
    console.log("data==>", data)
    const res = await DepartmentsServices.createDepartment(data);
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

export const getAllDepartments = createAsyncThunk('departments/getAllDepartments', async () => {
  try {
    const res = await DepartmentsServices.getAllDepartments();
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

export const deleteDepartmentById = createAsyncThunk('departments/deleteDepartmentById', async (id) => {
  try {
    const res = await DepartmentsServices.deleteDepartmentById(id);
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

export const editDepartmentById = createAsyncThunk('departments/editDepartmentById', async (datas) => {  
  console.log(datas)
  const {id, data} = datas
  try {
    const res = await DepartmentsServices.editDepartmentById(id, data);
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
  name: 'departments',
  initialState,
  reducers: {
    handleLogout: (state) => {
      state.data = [];
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createDepartment.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(createDepartment.fulfilled, (state) => {
      state.loading = 'idle';
      // state.data = action.payload;
      // state.message = action.payload.message;
    });
    builder.addCase(createDepartment.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(getAllDepartments.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(getAllDepartments.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.data = action.payload;
      state.message = action.payload.message;
    });
    builder.addCase(getAllDepartments.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(deleteDepartmentById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(deleteDepartmentById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.message = action.payload.message;
    });
    builder.addCase(deleteDepartmentById.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });

    builder.addCase(editDepartmentById.pending, (state) => {
      state.loading = 'pending';
    });
    builder.addCase(editDepartmentById.fulfilled, (state, action) => {
      state.loading = 'idle';
      state.message = action.payload.message;
    });
    builder.addCase(editDepartmentById.rejected, (state, action) => {
      state.loading = 'rejected';
      state.message = action.payload
    });
  },
});

export const { handleLogout } = userSlice.actions;

export default userSlice.reducer;
