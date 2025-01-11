import { callAPi } from './http-common';

const createDepartment = (data) => callAPi.post("/api/department/createDepartment", data);
const getAllDepartments = () => callAPi.get("/api/department/getDepartments");
const deleteDepartmentById = (id) => callAPi.delete(`/api/department/deleteDepartmentById/${id}`);
const editDepartmentById = (id, data) => callAPi.patch(`/api/department/updateDepartmentById/${id}`, data);




const DepartmentsServices = {
    createDepartment,
    getAllDepartments,
    deleteDepartmentById,
    editDepartmentById
};

export default DepartmentsServices;
