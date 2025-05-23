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
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import { useDispatch, useSelector } from 'react-redux';
import CustomizedDialogs from '../components/custom-pop-up';
import NewTeacher from '../components/teacher/NewTeacher';
import { deleteTeacherById, getAllTeachers } from '../Redux/slice/teacher';
import EditTeacher from '../components/teacher/EditTeacher';
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'teacherName', label: 'Name', alignRight: false },
  { id: 'qualifications', label: 'Qualifications', alignRight: false },
  { id: 'regestrationNo', label: 'Registration Number', alignRight: false },
  { id: 'designation', label: 'Designation', alignRight: false },
  { id: 'courses', label: 'Courses', alignRight: false },  // Updated to show courses
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
    return filter(array, (_user) => _user.teacherName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function TeacherPage() {
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [refetch, setRefetch] = useState();
  const [newTeacherOpen, setNewTeacherOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState();
  const [editTeacherOpen, setEditTeacherOpen] = useState(false);

  const dispatch = useDispatch();
  const teacher = useSelector((s) => s.teacher?.data);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = teacher.map((n) => n.teacherName);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - teacher.length) : 0;

  const filteredUsers = applySortFilter(teacher, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const getAllTeacher = async () => {
    const res = await dispatch(getAllTeachers());
    if (res) {
      setRefetch(true);
    }
  };

  const handleDelete = async (id) => {
    const res = await dispatch(deleteTeacherById(id));
    if (res.payload) {
      setRefetch(!refetch);
    }
  };

  const handleEdit = (item) => {
    setEditTeacher(item)
    setEditTeacherOpen(true)
  }

  useEffect(() => {
    getAllTeacher();
  }, [refetch, dispatch]);

  return (
    <>
      <Helmet>
        <title>Teachers | UE</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Teachers
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setNewTeacherOpen(true)}
          >
            New Teacher
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
                  rowCount={teacher.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { _id, teacherName, qualifications, regestrationNo, designation, courses } = row;
                    const selectedUser = selected.indexOf(teacherName) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell padding="checkbox">
                          {/* <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, teacherName)} /> */}
                        </TableCell>

                        <TableCell component="th" scope="row" padding="none">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {teacherName}
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell align="left">{qualifications}</TableCell>

                        <TableCell align="left">{regestrationNo}</TableCell>

                        <TableCell align="left">{designation}</TableCell>

                        <TableCell align="left">
                          {/* Display courses as comma-separated values */}
                          {courses.join(", ")}
                        </TableCell>

                        <TableCell sx={{ display: "flex" }} align="right">
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
            count={teacher.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <CustomizedDialogs title="Add New Teacher" open={newTeacherOpen} setOpen={setNewTeacherOpen}>
        <NewTeacher refetch={refetch} setRefetch={setRefetch} setOpen={setNewTeacherOpen} />
      </CustomizedDialogs>
      <CustomizedDialogs title="Edit Teacher" open={editTeacherOpen} setOpen={setEditTeacherOpen}>
        <EditTeacher editTeacher={editTeacher} refetch={refetch} setRefetch={setRefetch} setOpen={setEditTeacher} />
      </CustomizedDialogs>
    </>
  );
}
