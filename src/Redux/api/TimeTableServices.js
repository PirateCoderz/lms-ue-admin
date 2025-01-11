import { callAPi } from './http-common';

const createTimeTable = (data) => callAPi.post("/api/timeTable/createTimeTable", data);
const getAllTimeTable = () => callAPi.get("/api/timeTable/getTimeTable");
const deleteTimeTableById = (id) => callAPi.delete(`/api/timeTable/deleteTimeTable/${id}`);




const TimeTableServices = {
    createTimeTable,
    getAllTimeTable,
    deleteTimeTableById,
};

export default TimeTableServices;
