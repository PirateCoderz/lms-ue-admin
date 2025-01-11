/* eslint-disable react/prop-types */
import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import {  editDepartmentById } from 'src/Redux/slice/department';
// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved
// import Button from 'src/theme/overrides/Button'

const initialValues = {
  title: '',
  courseName: '',
};

const EditDepartment = ({ setOpen, setRefetch, refetch, editDepartment }) => {
  const [departmentValues, setDepartmentValues] = useState({
    title: editDepartment.title,
    courseName: editDepartment.courseName,
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();



  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('values', departmentValues);

    if (validations()) {
      const res = await dispatch(
        editDepartmentById({
          id: editDepartment._id,
          data: departmentValues,
        })
      );
      if (res.payload) {
        setDepartmentValues(initialValues);
        setRefetch(!refetch);
        setOpen(false);
      }
    }
  };
  const validations = (fieldValue = departmentValues) => {
    // eslint-disable-next-line prefer-const
    let temp = { ...errors };
    if ('title' in fieldValue) temp.studentName = fieldValue.title ? '' : 'This field requires';
    if ('courseName' in fieldValue) temp.courseName = fieldValue.courseName ? '' : 'This field requires';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentValues({
      ...departmentValues,
      [name]: value,
    });
    validations({ [name]: value });
  };

  return (
    <Box display={'flex'} flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
      <Box gap={2} display={'flex'} flexDirection="coulmn">
        <TextField
          helperText={errors.title}
          fullWidth
          name="title"
          type="text"
          value={departmentValues.title}
          label="Title"
          onChange={handleChange}
          error={errors.title}
        />
        <TextField
          helperText={errors.courseName}
          fullWidth
          name="courseName"
          type="text"
          value={departmentValues.courseName}
          label="Course Name"
          onChange={handleChange}
          error={errors.courseName}
        />
      </Box>

      <Box display={'flex'} justifyContent="flex-end">
        <Button type="submit" variant="contained">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditDepartment;
