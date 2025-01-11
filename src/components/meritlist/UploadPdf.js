/* eslint-disable import/no-duplicates */
import React, { useState } from 'react';

import { Box, Button } from '@mui/material';
// eslint-disable-next-line import/no-duplicates
import { TextField } from '@mui/material';
import { FormControl } from '@mui/material';
import { InputLabel } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { Fab } from '@mui/material';
// eslint-disable-next-line import/no-unresolved
import AddIcon from '@mui/icons-material/Add';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { createMeritList } from 'src/Redux/slice/meritList';
// eslint-disable-next-line import/no-unresolved
import useDepartments from 'src/hooks/useDepartments';
import csvtojson from 'csvtojson';
import Papa from 'papaparse';

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

const initialValues = {
  title: '',
  courseName: '',
};

const UploadPdf = ({ setOpen, setRefetch, refetch }) => {
  const [pdfFile, setPdfFile] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const department = useDepartments();

  const dispatch = useDispatch();

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validations()) {
      console.log('values', values);
      try {
        const formData = new FormData();
        formData.append('file', pdfFile);
        formData.append('upload_preset', 'riphaAssets');

        const data = await fetch('https://api.cloudinary.com/v1_1/dt4gdqksu/image/upload', {
          method: 'POST',
          body: formData,
        }).then((r) => r.json());
        console.log(data);
        const res = await dispatch(
          createMeritList({
            ...values,
            file: data.secure_url,
          })
        );
        if (res.payload.data) {
          setValues(initialValues);
          setPdfFile('');
          setRefetch(!refetch);
          setOpen(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
    validations({ [name]: value });
  };

  const validations = (fieldValue = values) => {
    // eslint-disable-next-line prefer-const
    let temp = { ...errors };
    if ('title' in fieldValue) temp.title = fieldValue.title ? '' : 'This field requires';
    if ('courseName' in fieldValue) temp.courseName = fieldValue.courseName ? '' : 'This field requires';

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
      <TextField
        helperText={errors.title}
        fullWidth
        name="title"
        type="text"
        label="Title"
        onChange={handleChange}
        value={values.title}
        error={errors.title}
      />

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-standard-label">Department</InputLabel>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          name="courseName"
          value={values.courseName}
          onChange={handleChange}
          error={errors.courseName}
          label="Department"
        >
          {department &&
            department?.map((item) => (
              <MenuItem value={item.courseName} key={item._id}>
                {item.courseName}
              </MenuItem>
            ))}
        </Select>
        {errors.courseName && <p style={{ color: 'red', fontSize: '12px', paddingLeft: '5%' }}>{errors.courseName}</p>}
      </FormControl>

      <label htmlFor="upload-photo">
        <input
          style={{ display: 'none' }}
          id="upload-photo"
          name="upload-photo"
          type="file"
          onChange={handleFileInputChange}
        />
        <Fab color="secondary" size="small" component="span" aria-label="add" variant="extended">
          <AddIcon />
          Upload File
        </Fab>
      </label>

      <Box display={'flex'} justifyContent="flex-end">
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default UploadPdf;

/* eslint-disable no-unused-vars */
