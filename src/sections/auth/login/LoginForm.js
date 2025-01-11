import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Box, Stack, IconButton, InputAdornment, TextField, FormControl, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
// eslint-disable-next-line import/no-duplicates
import axios from 'axios';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { loginUsers } from 'src/Redux/slice/users';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const initialValues = {
  username: '',
  password: '',
};

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState(initialValues);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  console.log(values);

  useEffect(() => {
    if (localStorage.getItem('ripha_admin_token')) {
      navigate('/dashboard/user', { replace: true });
    }
  }, []);

  const loginUser = async (data) => {
    try {
      const res = await dispatch(loginUsers(data));
      if (res.payload.user) {
        localStorage.setItem('ripha_admin_token', res.payload.token);
        navigate('/dashboard/user', { replace: true });
      }
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(values);
  };

  return (
    <Box onSubmit={handleSubmit} component="form">
      <Stack spacing={3}>
        <TextField name="username" label="User Name" value={values.username} onChange={handleChange} />

        <TextField
          onChange={handleChange}
          value={values.password}
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }} />

      <Button fullWidth size="large" type="submit" variant="contained">
        Login
      </Button>
    </Box>
  );
}
