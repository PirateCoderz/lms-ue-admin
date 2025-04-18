/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { editTeacherById } from 'src/Redux/slice/teacher';
// eslint-disable-next-line import/no-unresolved
import useDepartments from 'src/hooks/useDepartments';
// import Button from 'src/theme/overrides/Button'



const teacherRoomsNumber = [
  {
    id: 0,
    room: '1',
  },
  {
    id: 1,
    room: '2',
  },
  {
    id: 2,
    room: '3',
  },
  {
    id: 3,
    room: '4',
  },
  {
    id: 4,
    room: '5',
  },
  {
    id: 5,
    room: '6',
  },
  {
    id: 6,
    room: '7',
  },
];

const gender = [
  {
    id: 0,
    gender: 'male',
  },
  {
    id: 1,
    gender: 'female',
  },
  {
    id: 2,
    gender: 'other',
  },
];

const initialValues = {
  firstname: '',
  last_name: '',
  teacherRoom: '',
  qualification: '',
  department: '',
  designation: '',
  gender: '',
};

const EditTeacher = ({ editTeacher, setOpen, setRefetch, refetch }) => {
  const [teacherValues, setTeacherValues] = useState({
    firstname: editTeacher.firstname,
    last_name: editTeacher.last_name,
    teacherRoom: editTeacher.teacherRoom,
    qualification: editTeacher.qualification,
    department: editTeacher.department,
    designation: editTeacher.designation,
    gender: editTeacher.gender,
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
const department = useDepartments()
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
    // eslint-disable-next-line prefer-const
    let temp = { ...errors };
    if ('firstname' in fieldValue) temp.firstname = fieldValue.firstname ? '' : 'This field requires';
    if ('last_name' in fieldValue) temp.last_name = fieldValue.last_name ? '' : 'This field requires';
    if ('qualification' in fieldValue) temp.qualification = fieldValue.qualification ? '' : 'This field requires';
    if ('teacherRoom' in fieldValue) temp.teacherRoom = fieldValue.teacherRoom ? '' : 'This field requires';
    if ('department' in fieldValue) temp.department = fieldValue.department ? '' : 'This field requires';
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
  };

  return (
    <Box display={'flex'} flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <TextField
          helperText={errors.firstname}
          fullWidth
          name="firstname"
          type="text"
          label="Teacher Name"
          onChange={handleChange}
          value={teacherValues.firstname}
          error={errors.firstname}
        />
        <TextField
          helperText={errors.last_name}
          fullWidth
          value={teacherValues.last_name}
          name="last_name"
          type="text"
          label="Last Name"
          onChange={handleChange}
          error={errors.last_name}
        />
      </Box>
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <TextField
          value={teacherValues.qualification}
          helperText={errors.qualification}
          fullWidth
          name="qualification"
          type="text"
          label="Qualification"
          onChange={handleChange}
          error={errors.qualification}
        />

        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Department</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="department"
            value={teacherValues.department}
            onChange={handleChange}
            error={errors.department}
            label="Department"
          >
            {department && department.map((item) => (
              <MenuItem value={item.title} key={item._id}>
                {item.title}
              </MenuItem>
            ))}
          </Select>
          {errors.department && <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.department}</p>}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Teacher Room</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="teacherRoom"
            value={teacherValues.teacherRoom}
            onChange={handleChange}
            error={errors.teacherRoom}
            label="teacherRoom"
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
              <MenuItem value={item.gender} key={item.id}>
                {item.gender}
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

export default EditTeacher;
