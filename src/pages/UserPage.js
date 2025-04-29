/* eslint-disable react/prop-types */
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
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// components
import CustomizedDialogs from '../components/custom-pop-up';
// import EditStudents from '../components/students/EditStudents';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import NewStudents from '../components/students/NewStudents'; // New Students component
// sections
// import { UserListHead, UserListToolbar } from '../../sections/@dashboard/user';
import EditStudents from '../components/students/EditStudents';
import { deleteStudentById, getAllStudents } from '../Redux/slice/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'studentName', label: 'Name', alignRight: false },
  { id: 'courseName', label: 'Courses', alignRight: false },
  
  { id: 'regestrationNo', label: 'Registration Number', alignRight: false },
  { id: 'session', label: 'Session', alignRight: false },
  { id: '', label: '', alignRight: false },
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
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.studentName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refetch, setRefetch] = useState(false);
  const [newStudentOpen, setNewStudentOpen] = useState(false);

  const [editStudent, setEditStudent] = useState();
  const [editStudentOpen, setEditStudentOpen] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector((s) => s.user?.data);
  const department = useSelector((s) => s.department?.data);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = user.map((n) => n.studentName);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.length) : 0;

  const filteredUsers = applySortFilter(user, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const getAllUsers = async () => {
    const res = await dispatch(getAllStudents());
    if (res) {
      setRefetch(true);
    }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteStudentById(id));
    if (res.payload) {
      setRefetch(!refetch);
    }
  };

  const handleEdit = (item) => {
    setEditStudent(item);
    setEditStudentOpen(true);
  };

  useEffect(() => {
    getAllUsers();
  }, [refetch, dispatch]);

  return (
    <>
      <Helmet>
        <title> Student | UE </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Students
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setNewStudentOpen(true)}
          >
            New Student
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
                  rowCount={user.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      const { _id, studentName, courseName, regestrationNo, session, rollNo, isVerified } = row;
                      const selectedUser = selected.indexOf(studentName) !== -1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox" />
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {studentName}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">
                            {/* Display courses as comma-separated list */}
                            {Array.isArray(courseName) ? courseName.join(', ') : courseName}
                          </TableCell>
                          <TableCell>{regestrationNo}</TableCell>
                          <TableCell>{session}</TableCell>

                          <TableCell sx={{ display: 'flex' }} align="right">
                            <MenuItem onClick={() => handleEdit(row)}>
                              <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                              Edit
                            </MenuItem>
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
                        <Paper sx={{ textAlign: 'center' }}>
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
            count={user.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <CustomizedDialogs title="Add New Student" open={newStudentOpen} setOpen={setNewStudentOpen}>
        <NewStudents refetch={refetch} setRefetch={setRefetch} setOpen={setNewStudentOpen} />
      </CustomizedDialogs>
      <CustomizedDialogs title="Edit Student" open={editStudentOpen} setOpen={setEditStudentOpen}>
        <EditStudents
          editStudent={editStudent}
          refetch={refetch}
          setRefetch={setRefetch}
          setOpen={setEditStudentOpen}
        />
      </CustomizedDialogs>
    </>
  );
}
