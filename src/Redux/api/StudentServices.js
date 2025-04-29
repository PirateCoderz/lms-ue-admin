import { callAPi } from './http-common';

const createStudent = (data) => callAPi.post("/api/students/createStudent", data);
const getAllStudents = () => callAPi.get("/api/students/getStudents");
const deleteStudentById = (id) => callAPi.delete(`/api/students/deleteStudentById/${id}`);
const editStudentById = (id, data) => callAPi.patch(`/api/students/updateStudentById/${id}`, data);




const StudentServices = {
  createStudent,
  getAllStudents,
  deleteStudentById,
  editStudentById
};

export default StudentServices;
