import { callAPi } from './http-common';

const createTeacher = (data) => callAPi.post("/api/teacher/createTeacher", data);
const getAllTeachers = () => callAPi.get("/api/teacher/getTeachers");
const deleteTeacherById = (id) => callAPi.delete(`/api/teacher/deleteTeacherById/${id}`);
const editTeacherById = (id, data) => callAPi.patch(`/api/teacher/updateTeacherById/${id}`, data);



const TeacherServices = {
    createTeacher,
    getAllTeachers,
    deleteTeacherById,
    editTeacherById
};

export default TeacherServices;
