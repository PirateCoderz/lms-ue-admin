/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Chip, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editStudentById } from '../../Redux/slice/user';
import useDepartments from '../../hooks/useDepartments';

const gender = [
  { id: 0, genderName: 'Male' },
  { id: 1, genderName: 'Female' },
  { id: 2, genderName: 'Other' },
];

const initialValues = {
  studentName: '',
  fatherName: '',
  department: '',
  courseName: [], // Array for courses
  gender: '',
};

const EditStudents = ({ editStudent, setOpen, setRefetch, refetch }) => {
  const [studentValues, setStudentValues] = useState({
    studentName: editStudent.studentName,
    fatherName: editStudent.fatherName,
    department: editStudent.department, // Department
    courseName: Array.isArray(editStudent.courseName) ? editStudent.courseName : [], // Ensure it's always an array
    gender: editStudent.gender,
  });
  
  const [errors, setErrors] = useState({});
  const [courseNameInput, setCourseNameInput] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]); // Store available courses based on department
  const dispatch = useDispatch();
  const department = useDepartments();

  // Update the available courses based on the selected department
  useEffect(() => {
    const selectedDepartment = department?.find(dep => dep.title === studentValues.department);
    if (selectedDepartment) {
      setAvailableCourses(selectedDepartment.courseName); // Set courses for the selected department
    }
  }, [studentValues.department, department]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Before Update:', studentValues); // Print data before update

    if (validations()) {
      try {
        const res = await dispatch(
          editStudentById({
            id: editStudent._id,
            data: studentValues,
          })
        );
        if (res.payload) {
          setStudentValues(initialValues);
          setRefetch(!refetch);
          setOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Validations for form fields
  const validations = (fieldValue = studentValues) => {
    const temp = { ...errors };
    if ('studentName' in fieldValue) temp.studentName = fieldValue.studentName ? '' : 'This field requires';
    if ('fatherName' in fieldValue) temp.fatherName = fieldValue.fatherName ? '' : 'This field requires';
    if ('department' in fieldValue) temp.department = fieldValue.department ? '' : 'This field requires';
    if ('courseName' in fieldValue)
      temp.courseName = fieldValue.courseName.length > 0 ? '' : 'At least one course is required';
    if ('gender' in fieldValue) temp.gender = fieldValue.gender ? '' : 'This field requires';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentValues({
      ...studentValues,
      [name]: value,
    });
    validations({ [name]: value });
  };

  // Add selected course to the list
  const handleAddCourse = () => {
    if (courseNameInput.trim() && !studentValues.courseName.includes(courseNameInput.trim())) {
      setStudentValues({
        ...studentValues,
        courseName: [...studentValues.courseName, courseNameInput.trim()],
      });
      setCourseNameInput('');
    }
  };

  // Remove course from the selected list
  const handleRemoveCourse = (course) => {
    setStudentValues({
      ...studentValues,
      courseName: studentValues.courseName.filter((item) => item !== course),
    });
  };

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
      </Box>

      <Box gap={2} display={'flex'} justifyContent="space-between">
        {/* Department Dropdown */}
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
        </FormControl>

        {/* Courses Dropdown */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Courses</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="courseNameInput"
            value={courseNameInput}
            onChange={(e) => setCourseNameInput(e.target.value)}
            label="Course"
          >
            {availableCourses.map((course, index) => (
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
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditStudents;
