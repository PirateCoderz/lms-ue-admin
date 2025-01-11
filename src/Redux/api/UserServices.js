import { callAPi } from './http-common';

const loginUser = (data) => callAPi.post('/api/user/login', data);

const UserServices = {
    loginUser,
};

export default UserServices;
