// component
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'students',
    path: '/dashboard/user',
    icon: icon('ic_user'),
  },
  {
    title: 'teachers',
    path: '/dashboard/teacher',
    icon: icon('ic_teacher'),
  },
  // {
  //   title: 'merit list',
  //   path: '/dashboard/merit-list',
  //   icon: icon('ic_merit_list'),
  // },
  // {
  //   title: 'fee structure',
  //   path: '/dashboard/fee-structure',
  //   icon: icon('ic_fee'),
  // },
  {
    title: 'departments',
    path: '/dashboard/departments',
    icon: icon('ic_department'),
  },
  // {
  //   title: 'time table',
  //   path: '/dashboard/time-table',
  //   icon: icon('ic_timetable'),
  // },


];

export default navConfig;
