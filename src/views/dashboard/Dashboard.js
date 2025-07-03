import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CTable, CTableBody, CTableDataCell,
  CTableHead, CTableHeaderCell, CTableRow, CBadge, CProgress, CWidgetStatsA
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilUser, cilPeople, cilList, cilCalendar } from '@coreui/icons';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('http://localhost:3001/users', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('http://localhost:3001/employees', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('http://localhost:3001/services', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
      fetch('http://localhost:3001/reservations', { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
    ]).then(([usersData, employeesData, servicesData, reservationsData]) => {
      setUsers(Array.isArray(usersData) ? usersData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setServices(Array.isArray(servicesData) ? servicesData : []);
      setReservations(Array.isArray(reservationsData) ? reservationsData : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

const formatDateYMD = (dateStr) => {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d)) return '-';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

  // Resumen de reservas por estado
  const reservationStatus = reservations.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  // Últimos registros
  const lastUsers = users.slice(-5).reverse();
  const lastEmployees = employees.slice(-5).reverse();
  const lastServices = services.slice(-5).reverse();
  const lastReservations = reservations.slice(-5).reverse();

  // Utilidades para mostrar nombres reales en reservas
  const getClientName = (iduser) => {
    const user = users.find(u => u.iduser === Number(iduser));
    return user ? `${user.firstname} ${user.lastname}` : '-';
  };

  const getServiceName = (idservice) => {
    const service = services.find(s => s.idservice === Number(idservice));
    return service ? service.servicename : '-';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <h2 className="mb-4">Dashboard General</h2>
      <CRow className="mb-4">
        <CCol md={3}>
          <CWidgetStatsA
            color="primary"
            value={users.length}
            title="Usuarios"
            icon={<CIcon icon={cilUser} height={36} />}
          />
        </CCol>
        <CCol md={3}>
          <CWidgetStatsA
            color="info"
            value={employees.length}
            title="Empleados"
            icon={<CIcon icon={cilPeople} height={36} />}
          />
        </CCol>
        <CCol md={3}>
          <CWidgetStatsA
            color="success"
            value={services.length}
            title="Servicios"
            icon={<CIcon icon={cilList} height={36} />}
          />
        </CCol>
        <CCol md={3}>
          <CWidgetStatsA
            color="warning"
            value={reservations.length}
            title="Reservas"
            icon={<CIcon icon={cilCalendar} height={36} />}
          />
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Últimos Usuarios</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Usuario</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lastUsers.map(u => (
                    <CTableRow key={u.iduser}>
                      <CTableDataCell>{u.username}</CTableDataCell>
                      <CTableDataCell>{u.firstname} {u.lastname}</CTableDataCell>
                      <CTableDataCell>{u.email}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Últimos Empleados</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Especialidad</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lastEmployees.map(e => (
                    <CTableRow key={e.idemployee}>
                      <CTableDataCell>{e.firstname} {e.lastname}</CTableDataCell>
                      <CTableDataCell>{e.specialty}</CTableDataCell>
                      <CTableDataCell>{e.email}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mb-4">
        <CCol md={6}>
          <CCard>
            <CCardHeader>Últimos Servicios</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Servicio</CTableHeaderCell>
                    <CTableHeaderCell>Categoría</CTableHeaderCell>
                    <CTableHeaderCell>Precio</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lastServices.map(s => (
                    <CTableRow key={s.idservice}>
                      <CTableDataCell>{s.servicename}</CTableDataCell>
                      <CTableDataCell>{s.idcategory}</CTableDataCell>
                      <CTableDataCell>{s.price}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol md={6}>
          <CCard>
            <CCardHeader>Últimas Reservas</CCardHeader>
            <CCardBody>
              <CTable hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Cliente</CTableHeaderCell>
                    <CTableHeaderCell>Servicio</CTableHeaderCell>
                    <CTableHeaderCell>Fecha</CTableHeaderCell>
                    <CTableHeaderCell>Estado</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {lastReservations.map(r => (
                    <CTableRow key={r.idreservation}>
                      <CTableDataCell>{getClientName(r.iduser)}</CTableDataCell>
                      <CTableDataCell>{getServiceName(r.idservice)}</CTableDataCell>
                      <CTableDataCell>{formatDateYMD(r.date || r.fecha)}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={
                          r.status === 'pendiente' ? 'warning' :
                          r.status === 'completada' ? 'success' :
                          r.status === 'cancelada' ? 'danger' : 'secondary'
                        }>
                          {r.status}
                        </CBadge>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CCard>
        <CCardHeader>Resumen de Reservas por Estado</CCardHeader>
        <CCardBody>
          <CRow>
            {Object.entries(reservationStatus).map(([status, count]) => (
              <CCol md={3} key={status}>
                <h6>{status.charAt(0).toUpperCase() + status.slice(1)}</h6>
                <CProgress value={count} max={reservations.length} color={
                  status === 'pendiente' ? 'warning' :
                  status === 'completada' ? 'success' :
                  status === 'cancelada' ? 'danger' : 'info'
                } className="mb-2" />
                <span>{count} reserva(s)</span>
              </CCol>
            ))}
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Dashboard;