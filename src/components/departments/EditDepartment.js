/* eslint-disable react/prop-types */
import { Box, Button, TextField, Chip, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editDepartmentById } from '../../Redux/slice/department';

const initialValues = {
  title: '',
  courseName: [],
};

const EditDepartment = ({ setOpen, setRefetch, refetch, editDepartment }) => {
  const [departmentValues, setDepartmentValues] = useState({
    title: editDepartment.title,
    courseName: editDepartment.courseName || [],
  });
  const [errors, setErrors] = useState({});
  const [courseNameInput, setCourseNameInput] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    const temp = { ...errors };
    if ('title' in fieldValue) temp.title = fieldValue.title ? '' : 'This field is required';
    if ('courseName' in fieldValue) temp.courseName = fieldValue.courseName.length > 0 ? '' : 'At least one course is required';
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

  const handleAddCourse = () => {
    if (courseNameInput.trim() && !departmentValues.courseName.includes(courseNameInput.trim())) {
      setDepartmentValues({
        ...departmentValues,
        courseName: [...departmentValues.courseName, courseNameInput.trim()],
      });
      setCourseNameInput('');
    }
  };

  const handleRemoveCourse = (course) => {
    setDepartmentValues({
      ...departmentValues,
      courseName: departmentValues.courseName.filter((item) => item !== course),
    });
  };

  return (
    <Box display={'flex'} flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
      <Box gap={2} display={'flex'} flexDirection="column">
        <TextField
          helperText={errors.title}
          fullWidth
          name="title"
          type="text"
          value={departmentValues.title}
          label="Department Title"
          onChange={handleChange}
          error={!!errors.title}
        />

        {/* Add New Course */}
        <Box display="flex" alignItems="center" gap={2}>
          <TextField
            fullWidth
            name="courseNameInput"
            type="text"
            value={courseNameInput}
            label="Add Course"
            onChange={(e) => setCourseNameInput(e.target.value)}
          />
          <Button onClick={handleAddCourse} variant="outlined" disabled={!courseNameInput.trim()}>
            Add Course
          </Button>
        </Box>

        {errors.courseName && <Typography color="error">{errors.courseName}</Typography>}

        {/* Display Chips for courses */}
        <Stack direction="row" spacing={1} mt={2}>
          {departmentValues.courseName.map((course, index) => (
            <Chip
              key={index}
              label={course}
              onDelete={() => handleRemoveCourse(course)}
              color="primary"
            />
          ))}
        </Stack>
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
