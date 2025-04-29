/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Chip, Stack } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { editTeacherById } from '../../Redux/slice/teacher';
import useDepartments from '../../hooks/useDepartments';

// const teacherRoomsNumber = [
//   { id: 0, room: '1' },
//   { id: 1, room: '2' },
//   { id: 2, room: '3' },
//   { id: 3, room: '4' },
//   { id: 4, room: '5' },
//   { id: 5, room: '6' },
//   { id: 6, room: '7' },
// ];

const gender = [
  { id: 0, genderName: 'Male' },
  { id: 1, genderName: 'Female' },
  { id: 2, genderName: 'Other' },
];

const initialValues = {
  teacherName: '',
  qualifications: '',
  deparment: '',
  designation: '',
  gender: '',
  courses: [], // Adding courses as an array
};

const EditTeacher = ({ editTeacher, setOpen, setRefetch, refetch }) => {
  const [teacherValues, setTeacherValues] = useState({
    teacherName: editTeacher.teacherName,
    qualifications: editTeacher.qualifications,
    deparment: editTeacher.deparment,
    designation: editTeacher.designation,
    gender: editTeacher.gender,
    courses: editTeacher.courses || [], // Assuming courses is passed from the API
  });
  const [errors, setErrors] = useState({});
  const [availableCourses, setAvailableCourses] = useState([]); // Available courses based on department selection
  const [courseNameInput, setCourseNameInput] = useState('');
  const dispatch = useDispatch();
  const department = useDepartments();

  useEffect(() => {
    if (editTeacher.courses) {
      setTeacherValues((prevValues) => ({
        ...prevValues,
        courses: editTeacher.courses,
      }));
    }
  }, [editTeacher]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validations()) {
      try {
        const res = await dispatch(
          editTeacherById({
            id: editTeacher._id,
            data: teacherValues,
          })
        );
        setOpen(false);
        if (res.payload) {

          setTeacherValues(initialValues);
          setRefetch(!refetch);
          setOpen(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validations = (fieldValue = teacherValues) => {
    const temp = { ...errors };
    if ('teacherName' in fieldValue) temp.teacherName = fieldValue.teacherName ? '' : 'This field requires';
    if ('qualifications' in fieldValue) temp.qualifications = fieldValue.qualifications ? '' : 'This field requires';
    if ('deparment' in fieldValue) temp.deparment = fieldValue.deparment ? '' : 'This field requires';
    if ('designation' in fieldValue) temp.designation = fieldValue.designation ? '' : 'This field requires';
    if ('gender' in fieldValue) temp.gender = fieldValue.gender ? '' : 'This field requires';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherValues({
      ...teacherValues,
      [name]: value,
    });
    validations({ [name]: value });

    if (name === 'deparment') {
      // Update courses based on selected department
      const selectedDepartment = department.find((dept) => dept.title === value);
      if (selectedDepartment) {
        setAvailableCourses(selectedDepartment.courseName);
      }
    }
  };

  const handleAddCourse = () => {
    if (courseNameInput.trim() && !teacherValues.courses.includes(courseNameInput.trim())) {
      setTeacherValues({
        ...teacherValues,
        courses: [...teacherValues.courses, courseNameInput.trim()],
      });
      setCourseNameInput('');
    }
  };

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
          error={errors.teacherName}
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
          error={errors.qualifications}
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
            error={errors.deparment}
            label="Department"
          >
            {department &&
              department.map((item) => (
                <MenuItem value={item.title} key={item._id}>
                  {item.title}
                </MenuItem>
              ))}
          </Select>
          {errors.deparment && <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.deparment}</p>}
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
          error={errors.designation}
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

      {/* Room No Dropdown */}
      {/* <Box gap={2} display={'flex'} justifyContent="space-between">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Room No</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="teacherRoom"
            value={teacherValues.teacherRoom}
            onChange={handleChange}
            error={errors.teacherRoom}
            label="Room No"
          >
            {teacherRoomsNumber.map((item) => (
              <MenuItem value={item.room} key={item.id}>
                {item.room}
              </MenuItem>
            ))}
          </Select>
          {errors.teacherRoom && (
            <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.teacherRoom}</p>
          )}
        </FormControl>
      </Box> */}

      <Box display={'flex'} justifyContent="flex-end">
        <Button type="submit" variant="contained">
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditTeacher;
