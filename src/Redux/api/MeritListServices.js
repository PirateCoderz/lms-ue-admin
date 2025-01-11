import { callAPi } from './http-common';

const createMeritList = (data) => callAPi.post("/api/meritList/createMeritList", data);
const getAllMeritList = () => callAPi.get("/api/meritList/getMeritList");
const deleteMeritListById = (id) => callAPi.delete(`/api/meritList/deleteMeritListById/${id}`);




const MeritListServices = {
    createMeritList,
    getAllMeritList,
    deleteMeritListById,
};

export default MeritListServices;
