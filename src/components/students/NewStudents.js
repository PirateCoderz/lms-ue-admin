/* eslint-disable react/prop-types */
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line import/no-duplicates
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { getAllDepartments } from 'src/Redux/slice/department';
// eslint-disable-next-line import/no-unresolved
import { createStudent } from 'src/Redux/slice/user';
// import Button from 'src/theme/overrides/Button'
// eslint-disable-next-line import/no-unresolved



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
  studentName: '',
  fatherName: '',
  courseName: '',
  gender: '',
  IDcard: '',
};

const NewStudents = ({ setOpen, setRefetch, refetch }) => {
  const [studentValues, setStudentValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const department = useSelector((s)=> s.department?.data)

  const dispatch = useDispatch();

  const getAllDepartment = async () => {
    const res = await dispatch(getAllDepartments());
    console.log(res)
    if (res) {
      setRefetch(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validations()) {
      console.log('values', studentValues);
      const res = await dispatch(createStudent(JSON.stringify(studentValues)));
      if(res.payload.data){
        setStudentValues(initialValues);
        setRefetch(!refetch)
        setOpen(false)
      }
    }
  };
  const validations = (fieldValue = studentValues) => {
    // eslint-disable-next-line prefer-const
    let temp = { ...errors };
    if ('studentName' in fieldValue) temp.studentName = fieldValue.studentName ? '' : 'This field requires';
    if ('fatherName' in fieldValue) temp.fatherName = fieldValue.fatherName ? '' : 'This field requires';
    if ('courseName' in fieldValue) temp.courseName = fieldValue.courseName ? '' : 'This field requires';
    if ('gender' in fieldValue) temp.gender = fieldValue.gender ? '' : 'This field requires';
    if ('IDcard' in fieldValue) temp.IDcard = fieldValue.IDcard ? '' : 'This field requires';
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
          label="Father Name"
          value={studentValues.fatherName}
          onChange={handleChange}
          error={errors.fatherName}
        />
        <TextField
          helperText={errors.IDcard}
          fullWidth
          name="IDcard"
          type="text"
          label="IDcard"
          value={studentValues.IDcard}
          onChange={handleChange}
          error={errors.IDcard}
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
            {department && department?.map((item) => (
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
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default NewStudents;
