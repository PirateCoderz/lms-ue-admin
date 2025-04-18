/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { createStudent, editStudentById } from 'src/Redux/slice/user';
// eslint-disable-next-line import/no-unresolved
import useDepartments from 'src/hooks/useDepartments';
// import Button from 'src/theme/overrides/Button'


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
  first_name: '',
  fatherName: '',
  courseName: '',
  gender: '',
};

const EditStudents = ({editStudent, setOpen, setRefetch, refetch }) => {
  const [studentValues, setStudentValues] = useState({
    first_name: editStudent.first_name,
    fatherName: editStudent.fatherName,
    courseName: editStudent.courseName,
    gender:editStudent.gender,
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const deparment = useDepartments()
  console.log("deparment", deparment)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validations()) {
      console.log('values', studentValues);
      const res = await dispatch(editStudentById({
        id:editStudent._id,
        data:studentValues
      }));
      console.log("res", res)
      if(res.payload){
        setStudentValues(initialValues);
        setRefetch(!refetch)
        setOpen(false)
      }
    }
  };
  const validations = (fieldValue = studentValues) => {
    // eslint-disable-next-line prefer-const
    let temp = { ...errors };
    if ('first_name' in fieldValue) temp.first_name = fieldValue.first_name ? '' : 'This field requires';
    if ('fatherName' in fieldValue) temp.fatherName = fieldValue.fatherName ? '' : 'This field requires';
    if ('courseName' in fieldValue) temp.courseName = fieldValue.courseName ? '' : 'This field requires';
    if ('gender' in fieldValue) temp.gender = fieldValue.gender ? '' : 'This field requires';
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentValues({
      ...studentValues,
      [name]: value,
    });
    validations({ [name]: value });
  };

  return (
    <Box display={'flex'} flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <TextField
          helperText={errors.first_name}
          fullWidth
          name="first_name"
          type="text"
          value={studentValues.first_name}
          label="Student Name"
          onChange={handleChange}
          error={errors.first_name}
        />
        <TextField
          helperText={errors.fatherName}
          fullWidth
          name="fatherName"
          type="text"
          label="Father Name"
          value={studentValues.fatherName}
          onChange={handleChange}
          error={errors.fatherName}
        />
      </Box>
      <Box gap={2} display={'flex'} justifyContent="space-between">
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-standard-label">Degree Programes</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            name="courseName"
            value={studentValues.courseName}
            onChange={handleChange}
            error={errors.courseName}
            label="Degree Programe"
          >
            {deparment && deparment?.map((item) => (
              <MenuItem value={item.courseName} key={item._id}>
                {item.courseName}
              </MenuItem>
            ))}
          </Select>
          {errors.courseName && (
            <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.courseName}</p>
          )}
        </FormControl>
      </Box>
      <Box gap={2} display={'flex'} justifyContent="space-between">
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
