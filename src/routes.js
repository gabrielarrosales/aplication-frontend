
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//const añadidos por mi
const Services = React.lazy(() => import('./views/pages/services/Services'));
const User = React.lazy (() => import('./views/pages/users/Users'));
const Employees = React.lazy(() => import('./views/pages/employees/Employees'));
const AddAppointment = React.lazy(() => import('./views/pages/appointments/addAppointment/AddAppointment'));
const AppointmentCalendar = React.lazy(() => import('./views/pages/appointments/appointmentCalendar/AppointmentCalendar'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  //ruta añadida por mi

  { path: '/services', name: 'Services', element: Services },
  { path: '/employees', name: 'Employees', element: Employees},
  { path: '/appointments/add', element: AddAppointment},
  { path: '/appointments/calendar', element: AppointmentCalendar},
  { path: '/users', name: 'User', element: User}
]

export default routes
