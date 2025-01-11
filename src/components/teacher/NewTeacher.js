import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { createTeacher } from 'src/Redux/slice/teacher';
// eslint-disable-next-line import/no-unresolved
import useDepartments from 'src/hooks/useDepartments';
// import Button from 'src/theme/overrides/Button'

const degreeProgrames = [
  {
    id: 0,
    qualifications: 'BSCS',
  },
  {
    id: 1,
    qualifications: 'BSIT',
  },
  {
    id: 2,
    qualifications: 'BSSE',
  },
  {
    id: 3,
    qualifications: 'BS MATH',
  },
  {
    id: 4,
    qualifications: 'BS PHYSICS',
  },
  {
    id: 5,
    qualifications: 'BS CHEMISTRY',
  },
  {
    id: 6,
    qualifications: 'BS POLITICAL SCIECNCE',
  },
];

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
  {
    id: 7,
    room: '8',
  },
  {
    id: 8,
    room: '9',
  },
  {
    id: 9,
    room: '10',
  },
  {
    id: 10,
    room: '11',
  },
  {
    id: 10,
    room: '11',
  },
  {
    id: 11,
    room: '12',
  },
  {
    id: 12,
    room: '13',
  },
  {
    id: 13,
    room: '14',
  },
  {
    id: 14,
    room: '15',
  },
  {
    id: 15,
    room: '16',
  },
  {
    id: 16,
    room: '17',
  },
  {
    id: 17,
    room: '18',
  },
  {
    id: 18,
    room: '19',
  },
  {
    id: 19,
    room: '20',
  },
  {
    id: 20,
    room: '21',
  },
  {
    id: 21,
    room: '22',
  },
  {
    id: 22,
    room: '23',
  },
];

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

const initialValues = {
  teacherName: '',
  fatherName: '',
  teacherRoom: '',
  qualifications: '',
  deparment: '',
  designation: '',
  gender: '',
};

const NewTeacher = ({ setOpen, setRefetch, refetch }) => {
  const [teacherValues, setTeacherValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const department = useDepartments()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validations()) {
      console.log('values', teacherValues);
      try {
        const res = await dispatch(createTeacher(teacherValues));
        if (res.payload.data) {
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
    if ('teacherName' in fieldValue) temp.teacherName = fieldValue.teacherName ? '' : 'This field requires';
    if ('fatherName' in fieldValue) temp.fatherName = fieldValue.fatherName ? '' : 'This field requires';
    if ('qualifications' in fieldValue) temp.qualifications = fieldValue.qualifications ? '' : 'This field requires';
    if ('teacherRoom' in fieldValue) temp.teacherRoom = fieldValue.teacherRoom ? '' : 'This field requires';
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
        <TextField
          helperText={errors.fatherName}
          fullWidth
          value={teacherValues.fatherName}
          name="fatherName"
          type="text"
          label="Father Name"
          onChange={handleChange}
          error={errors.fatherName}
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
            {department && department?.map((item) => (
              <MenuItem value={item.courseName} key={item._id}>
                {item.courseName}
              </MenuItem>
            ))}
          </Select>
          {errors.deparment && <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.deparment}</p>}
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

export default NewTeacher;
