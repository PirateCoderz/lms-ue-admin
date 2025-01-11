import { callAPi } from './http-common';

const createFeeStructure = (data) => callAPi.post("/api/feeStructure/createFeeStructure", data);
const getAllFeeStructure = () => callAPi.get("/api/feeStructure/getFeeStructure");
const deleteFeeStructuretById = (id) => callAPi.delete(`/api/feeStructure/deleteFeeStructureById/${id}`);




const FeeStructureServices = {
    createFeeStructure,
    getAllFeeStructure,
    deleteFeeStructuretById,
};

export default FeeStructureServices;
