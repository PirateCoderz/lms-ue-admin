// eslint-disable-next-line import/no-duplicates
import React from 'react';
// eslint-disable-next-line import/no-duplicates
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line import/no-unresolved
import { getAllDepartments } from 'src/Redux/slice/department';

const useDepartments = () => {
  const dispatch = useDispatch();
  const department = useSelector((s) => s.department?.data);

  const [refetch, setRefetch] = useState();
  const getAllDepartment = async () => {
    const res = await dispatch(getAllDepartments());
    console.log(res);
    if (res) {
      setRefetch(true);
    }
  };
  useEffect(() => {
    getAllDepartment();
  }, [refetch, dispatch]);
  return department;
};

export default useDepartments;
