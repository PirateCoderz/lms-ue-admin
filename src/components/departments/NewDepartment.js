/* eslint-disable react/prop-types */
import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { createDepartment } from 'src/Redux/slice/department';
// eslint-disable-next-line import/no-unresolved
// import Button from 'src/theme/overrides/Button'

const initialValues = {
  title: '',
  courseName: '',
};

const NewDepartment = ({ setOpen, setRefetch, refetch }) => {
  const [departmentValues, setDepartmentValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('values', departmentValues);

    if (validations()) {
      console.log('values', departmentValues);
      const res = await dispatch(createDepartment(JSON.stringify(departmentValues)));
      console.log(res)
      if (res.payload.data) {
        setDepartmentValues(initialValues);
        setRefetch(!refetch);
        setOpen(false);
      }
    }
  };
  const validations = (fieldValue = departmentValues) => {
    // eslint-disable-next-line prefer-const
    let temp = { ...errors };
    if ('title' in fieldValue) temp.first_name = fieldValue.title ? '' : 'This field requires';
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
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default NewDepartment;
