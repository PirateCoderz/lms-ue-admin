/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Chip, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllDepartments } from '../../Redux/slice/department';
import { createStudent } from '../../Redux/slice/user';

const gender = [
  { id: 0, genderName: 'Male' },
  { id: 1, genderName: 'Female' },
  { id: 2, genderName: 'Other' },
];

const initialValues = {
  studentName: '',
  fatherName: '',
  department: '',
  courseName: [], // Now courseName is an array
  gender: '',
  IDcard: '',
};

const NewStudents = ({ setOpen, setRefetch, refetch }) => {
  const [studentValues, setStudentValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [courseNameInput, setCourseNameInput] = useState('');
  const department = useSelector((s) => s.department?.data); // Get department data from the redux store
  const dispatch = useDispatch();

  // Fetch departments
  const getAllDepartment = async () => {
    const res = await dispatch(getAllDepartments());
    if (res) {
      setRefetch(true);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validations()) {
      const res = await dispatch(createStudent(studentValues));
      if (res.payload.data) {
        setStudentValues(initialValues);
        setRefetch(!refetch);
        setOpen(false);
      }
    }
  };

  // Validations for the form fields
  const validations = (fieldValue = studentValues) => {
    const temp = { ...errors };
    if ('studentName' in fieldValue) temp.studentName = fieldValue.studentName ? '' : 'This field requires';
    if ('fatherName' in fieldValue) temp.fatherName = fieldValue.fatherName ? '' : 'This field requires';
    if ('department' in fieldValue) temp.department = fieldValue.department ? '' : 'This field requires';
    if ('courseName' in fieldValue)
      temp.courseName = fieldValue.courseName.length > 0 ? '' : 'At least one course is required';
    if ('gender' in fieldValue) temp.gender = fieldValue.gender ? '' : 'This field requires';
    if ('IDcard' in fieldValue) temp.IDcard = fieldValue.IDcard ? '' : 'This field requires';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  // Handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentValues({
      ...studentValues,
      [name]: value,
    });
    validations({ [name]: value });

    // When department is changed, reset courses
    if (name === 'department') {
      const selectedDepartment = department.find((dept) => dept.title === value);
      if (selectedDepartment) {
        setStudentValues((prevState) => ({
          ...prevState,
          courseName: [], // Reset courses when department changes
        }));
      }
    }
  };

  // Add a course to the selected list
  const handleAddCourse = () => {
    if (courseNameInput.trim() && !studentValues.courseName.includes(courseNameInput.trim())) {
      setStudentValues({
        ...studentValues,
        courseName: [...studentValues.courseName, courseNameInput.trim()],
      });
      setCourseNameInput('');
    }
  };

  // Remove a selected course from the list
  const handleRemoveCourse = (course) => {
    setStudentValues({
      ...studentValues,
      courseName: studentValues.courseName.filter((item) => item !== course),
    });
  };

  useEffect(() => {
    getAllDepartment();
  }, [refetch, dispatch]);

  return (
    <Box display={'flex'} flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <TextField
          helperText={errors.studentName}
          fullWidth
          name="studentName"
          type="text"
          value={studentValues.studentName}
          label="Student Name"
          onChange={handleChange}
          error={errors.studentName}
        />
        <TextField
          helperText={errors.fatherName}
          fullWidth
          name="fatherName"
          type="text"
          value={studentValues.fatherName}
          label="Father Name"
          onChange={handleChange}
          error={errors.fatherName}
        />
        <TextField
          helperText={errors.IDcard}
          fullWidth
          name="IDcard"
          type="text"
          value={studentValues.IDcard}
          label="ID Card"
          onChange={handleChange}
          error={errors.IDcard}
        />
      </Box>

      {/* Department Dropdown */}
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Department</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="department"
            value={studentValues.department}
            onChange={handleChange}
            error={errors.department}
            label="Department"
          >
            {department?.map((item) => (
              <MenuItem key={item._id} value={item.title}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
          {errors.department && <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.department}</p>}
        </FormControl>
      </Box>

      {/* Courses Dropdown (based on department) */}
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Courses</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="courseNameInput"
            value={courseNameInput}
            onChange={(e) => setCourseNameInput(e.target.value)}
            label="Courses"
          >
            {department
              .find((dept) => dept.title === studentValues.department)?.courseName?.map((course, index) => (
                <MenuItem key={index} value={course}>
                  {course}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button onClick={handleAddCourse} variant="outlined">
          Add Course
        </Button>
      </Box>

      {/* Display selected courses as chips */}
      <Box>
        <Stack direction="row" spacing={1}>
          {studentValues.courseName.map((course, index) => (
            <Chip
              key={index}
              label={course}
              onDelete={() => handleRemoveCourse(course)}
              color="primary"
            />
          ))}
        </Stack>
      </Box>

      <Box gap={2} display={'flex'} justifyContent="space-between">
        {/* Gender Dropdown */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="gender"
            value={studentValues.gender}
            onChange={handleChange}
            label="Gender"
            error={errors.gender}
          >
            {gender.map((item) => (
              <MenuItem value={item.genderName} key={item.id}>
                {item.genderName}
              </MenuItem>
            ))}
          </Select>
          {errors.gender && <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.gender}</p>}
        </FormControl>
      </Box>

      <Box display={'flex'} justifyContent="flex-end">
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default NewStudents;
