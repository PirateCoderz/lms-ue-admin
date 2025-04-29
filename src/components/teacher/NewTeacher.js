/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Chip, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { createTeacher } from '../../Redux/slice/teacher';
import useDepartments from '../../hooks/useDepartments';

const initialValues = {
  teacherName: '',
  qualifications: '',
  deparment: '',
  designation: '',
  gender: '',
  courses: [], // Add courses as an array
};

const gender = [
  {
    id: 0,
    genderName: 'Male',
  },
  {
    id: 1,
    genderName: 'Female',
  },
  {
    id: 2,
    genderName: 'Other',
  },
];

const NewTeacher = ({ setOpen, setRefetch, refetch }) => {
  const [teacherValues, setTeacherValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [courseNameInput, setCourseNameInput] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const dispatch = useDispatch();
  const department = useDepartments(); // Get department data

  // Whenever the department changes, filter and show related courses
  useEffect(() => {
    if (teacherValues.deparment) {
      const selectedDepartment = department.find((dept) => dept.title === teacherValues.deparment);
      if (selectedDepartment) {
        setAvailableCourses(selectedDepartment.courseName || []);
      }
    }
  }, [teacherValues.deparment, department]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validations()) {
      try {
        // Dispatch the createTeacher action from Redux
        const res = await dispatch(createTeacher(teacherValues));

        if (res.payload && res.payload.data) {
          setTeacherValues(initialValues); // Reset the form
          setRefetch(!refetch); // Trigger refetch to update data
          setOpen(false); // Close the modal

          // Show success alert
          Swal.fire({
            title: 'Success!',
            text: 'Teacher created successfully!',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            setOpen(false); // Close the modal after confirmation
            window.location.reload(); // Refresh the page after confirmation
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Form validation
  const validations = (fieldValue = teacherValues) => {
    const temp = { ...errors };
    if ('teacherName' in fieldValue) temp.teacherName = fieldValue.teacherName ? '' : 'This field is required';
    if ('qualifications' in fieldValue) temp.qualifications = fieldValue.qualifications ? '' : 'This field is required';
    if ('deparment' in fieldValue) temp.deparment = fieldValue.deparment ? '' : 'This field is required';
    if ('designation' in fieldValue) temp.designation = fieldValue.designation ? '' : 'This field is required';
    if ('gender' in fieldValue) temp.gender = fieldValue.gender ? '' : 'This field is required';
    setErrors({ ...temp });
    return Object.values(temp).every((x) => x === '');
  };

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherValues({
      ...teacherValues,
      [name]: value,
    });
    validations({ [name]: value });
  };

  // Handle adding courses
  const handleAddCourse = () => {
    if (courseNameInput.trim() && !teacherValues.courses.includes(courseNameInput.trim())) {
      setTeacherValues({
        ...teacherValues,
        courses: [...teacherValues.courses, courseNameInput.trim()],
      });
      setCourseNameInput('');
    }
  };

  // Handle removing a course
  const handleRemoveCourse = (course) => {
    setTeacherValues({
      ...teacherValues,
      courses: teacherValues.courses.filter((item) => item !== course),
    });
  };

  return (
    <Box display={'flex'} flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <TextField
          helperText={errors.teacherName}
          fullWidth
          name="teacherName"
          type="text"
          label="Teacher Name"
          onChange={handleChange}
          value={teacherValues.teacherName}
          error={Boolean(errors.teacherName)} // Convert error message to boolean for `error` prop
        />
      </Box>

      <Box gap={2} display={'flex'} justifyContent="space-between">
        <TextField
          value={teacherValues.qualifications}
          helperText={errors.qualifications}
          fullWidth
          name="qualifications"
          type="text"
          label="Qualifications"
          onChange={handleChange}
          error={Boolean(errors.qualifications)} // Convert error message to boolean for `error` prop
        />

        {/* Department dropdown */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Department</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="deparment"
            value={teacherValues.deparment}
            onChange={handleChange}
            error={Boolean(errors.deparment)} // Convert error message to boolean for `error` prop
            label="Department"
          >
            {department &&
              department.map((item) => (
                <MenuItem value={item.title} key={item._id}>
                  {item.title}
                </MenuItem>
              ))}
          </Select>
          {errors.deparment && (
            <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.deparment}</p>
          )}
        </FormControl>
      </Box>

      <Box gap={2} display={'flex'} justifyContent="space-between">
        <TextField
          helperText={errors.designation}
          fullWidth
          name="designation"
          type="text"
          label="Designation"
          value={teacherValues.designation}
          onChange={handleChange}
          error={Boolean(errors.designation)} // Convert error message to boolean for `error` prop
        />

        {/* Gender dropdown */}
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Gender</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="gender"
            value={teacherValues.gender}
            onChange={handleChange}
            label="Gender"
            error={Boolean(errors.gender)} // Convert error message to boolean for `error` prop
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

      {/* Courses Selection */}
      <Box gap={2} display={'flex'} flexDirection="column">
        {/* Dropdown to select a course */}
        <FormControl fullWidth>
          <InputLabel id="select-course-label">Select Course</InputLabel>
          <Select
            labelId="select-course-label"
            id="select-course"
            value={courseNameInput}
            onChange={(e) => setCourseNameInput(e.target.value)}
            label="Select Course"
          >
            {availableCourses.map((course, index) => (
              <MenuItem value={course} key={index}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={handleAddCourse} variant="outlined">
          Add Course
        </Button>

        {/* Display selected courses as Chips */}
        <Stack direction="row" spacing={1} mt={2}>
          {teacherValues.courses.map((course, index) => (
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
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default NewTeacher;
