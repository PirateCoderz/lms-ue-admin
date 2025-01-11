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
// eslint-disable-next-line import/no-unresolved
import { createTimeTable } from 'src/Redux/slice/timeTable';
import { Typography } from '@mui/material';

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
  courseName: '',
};

const NewTimetable = ({ setOpen, setRefetch, refetch }) => {
  const [csvFile, setCsvFile] = useState(null);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const department = useDepartments();
  const [showFileError, setFileShowError] = useState(false);

  const dispatch = useDispatch();
  const parseCSV = async (csvFile, commonConfig) => {
    const parsedData = await new Promise((resolve, reject) => {
      Papa.parse(csvFile, {
        ...commonConfig,
        header: true,
        complete: (result) => {
          resolve(result.data);
        },
        error: (err) => {
          reject(err);
        },
      });
    });

    return parsedData;
  };

  // eslint-disable-next-line consistent-return
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (!allowedMimeTypes.exec(event.target.files[0].type)) {
      setFileShowError(true);
      setCsvFile();
      return false;
    }
    setFileShowError(false);

    setCsvFile(file);
  };

  const allowedMimeTypes = /^text\/csv$/i;
  console.log(showFileError);
  // eslint-disable-next-line consistent-return
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validations()) {
      console.log('values', values);
      if (!allowedMimeTypes.exec(csvFile.type)) {
        setFileShowError(true);
        setCsvFile();
        return false;
      }
      try {
        const data = await parseCSV(csvFile);
        console.log('data==>', data);
        const res = await dispatch(
          createTimeTable({
            ...values,
            fileData: data,
          })
        );
        if (res.payload.data) {
          setValues(initialValues);
          setCsvFile('');
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
    if ('courseName' in fieldValue) temp.courseName = fieldValue.courseName ? '' : 'This field requires';

    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === '');
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} component="form" onSubmit={handleSubmit}>
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
      <h4
        style={{
          color: 'red',
        }}
      >
        {showFileError ? 'please upload csv file only' : ''}
      </h4>
      <Box display={'flex'} justifyContent="flex-end">
        <Button type="submit" variant="contained">
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default NewTimetable;

/* eslint-disable no-unused-vars */
