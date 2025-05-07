import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilExternalLink,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilSpa,
  cilCalendar,
  cilPeople,
  cilClipboard,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'USERS',
    to: '/users', 
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />, 
  },

  {
    component: CNavItem,
    name: 'SERVICES',
    to: '/services', 
    icon: <CIcon icon={cilSpa} customClassName="nav-icon" />, 
  },


  {
    component: CNavItem,
    name: 'STOCK',
    to: '/stock', 
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />, 
  },


  {
    component: CNavGroup, 
    name: 'APPOINTMENTS',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Add Appointment',
        to: '/appointments/add',
      },
      {
        component: CNavItem,
        name: 'Calendar',
        to: '/appointments/calendar',
      }
    ]
  }

]

export default _nav
