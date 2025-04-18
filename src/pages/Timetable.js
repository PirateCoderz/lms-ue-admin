/* eslint-disable import/no-unresolved */
import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import CustomizedDialogs from 'src/components/custom-pop-up';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMeritListById, getAllMeritList } from 'src/Redux/slice/meritList';
import UploadFee from 'src/components/feeStructure/UploadFee';
import { deleteFeeStructuretById, getAllFeeStructure } from 'src/Redux/slice/feeStructure';
import NewDepartment from 'src/components/departments/NewDepartment';
import { deleteDepartmentById, getAllDepartments } from 'src/Redux/slice/department';
import EditDepartment from 'src/components/departments/EditDepartment';
import NewTimetable from 'src/components/timetable/NewTimetable';
import { deleteTimeTableById, getAllTimeTable } from 'src/Redux/slice/timeTable';
import Papa from 'papaparse';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'courseName', label: 'Degree Programes', alignRight: false },
  { id: 'fileData', label: 'Time Table', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user?.courseName?.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Timetable() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [refetch, setRefetch] = useState();

  const [newDepartmentOpen, setNewDepartmentOpen] = useState(false);

  const [editDepartment, setEditDepartment] = useState();

  const [editDepartmentOpen, setEditDepartmentOpen] = useState();

  const dispatch = useDispatch();

  // const feeStructure = useSelector((s) => s.feeStructure?.data);

  const timeTable = useSelector((s) => s.timeTable?.data);

  console.log('deparment==>', timeTable);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = timeTable.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - timeTable.length) : 0;

  const filteredUsers = applySortFilter(timeTable, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const getAllTimeTables = async () => {
    const res = await dispatch(getAllTimeTable());
    console.log(res);
    if (res) {
      setRefetch(true);
    }
  };
  const handleEdit = (item) => {
    setEditDepartment(item);
    setEditDepartmentOpen(true);
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteTimeTableById(id));
    if (res.payload) {
      setRefetch(!refetch);
    }
  };

  const csvfile = (file) => {
    const csvData = Papa.unparse(file);
    const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const csvUrl = URL.createObjectURL(csvBlob);
    return csvUrl;
  };

  useEffect(() => {
    getAllTimeTables();
  }, [refetch, dispatch]);

  return (
    <>
      <Helmet>
        <title> User | UE Alignment Portal </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Time Table
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setNewDepartmentOpen(true)}
          >
            New Time Table
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={timeTable.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, courseName, title, fileData } = row;
                    const selectedUser = selected.indexOf(title) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, title)} /> */}
                        </TableCell>

                        <TableCell align="left">{courseName}</TableCell>
                        <TableCell align="left">
                          <a href={csvfile(fileData)} download="data.csv">
                            Download
                          </a>
                        </TableCell>

                        <TableCell sx={{ display: 'flex' }} align="right">
                          <MenuItem sx={{ color: 'error.main' }} onClick={() => handleDelete(_id)}>
                            <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                            Delete
                          </MenuItem>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={timeTable.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <CustomizedDialogs title="Add New Time Table" open={newDepartmentOpen} setOpen={setNewDepartmentOpen}>
        <NewTimetable refetch={refetch} setRefetch={setRefetch} setOpen={setNewDepartmentOpen} />
      </CustomizedDialogs>
      <CustomizedDialogs title="Edit Time Table" open={editDepartmentOpen} setOpen={setEditDepartmentOpen}>
        <EditDepartment
          editDepartment={editDepartment}
          refetch={refetch}
          setRefetch={setRefetch}
          setOpen={setEditDepartmentOpen}
        />
      </CustomizedDialogs>
    </>
  );
}
