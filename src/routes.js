import { element } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

//const añadidos por mi
const Services = React.lazy(() => import('./views/pages/services/Services'));
const Users = React.lazy (() => import('./views/pages/users/Users'));
const Stock = React.lazy(() => import('./views/pages/stock/Stock'));
const AddAppointment = React.lazy(() => import('./views/pages/appointments/addAppointment/AddAppointment'));
const AppointmentCalendar = React.lazy(() => import('./views/pages/appointments/appointmentCalendar/AppointmentCalendar'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  //ruta añadida por mi

  { path: '/services', name: 'Services', element: Services },
  { path: '/users', name: 'Users', element: Users},
  { path: '/stock', name: 'Stock', element: Stock},
  { path: '/appointments/add', element: AddAppointment},
  { path: '/appointments/calendar', element: AppointmentCalendar},
  
]

export default routes
