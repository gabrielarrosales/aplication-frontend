import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CBadge,
  CProgress
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilCalendar, cilShower, cilStar } from '@coreui/icons';

const Dashboard = () => {

  const [appointments, setAppointments] = useState([]);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    setTimeout(() => {
      
      const mockAppointments = [
        { id: 1, client: 'María García', service: 'Corte de cabello', date: '2024-05-20', time: '10:00' },
        { id: 2, client: 'Juan Pérez', service: 'Coloración', date: '2024-05-21', time: '14:30' },
        { id: 3, client: 'Ana López', service: 'Manicura', date: '2024-05-22', time: '16:00' }
      ];

    
      const mockProducts = [
        { id: 1, name: 'Shampoo Anticaspa', stock: 4, minStock: 5 },
        { id: 2, name: 'Tinte Rubio', stock: 3, minStock: 5 },
        { id: 3, name: 'Esmalte Rojo', stock: 10, minStock: 5 },
        { id: 4, name: 'Crema Hidratante', stock: 2, minStock: 5 }
      ];

      
      const mockServices = [
        { id: 1, name: 'Corte de cabello', requests: 15 },
        { id: 2, name: 'Coloración', requests: 8 },
        { id: 3, name: 'Manicura', requests: 12 },
        { id: 4, name: 'Pedicura', requests: 6 }
      ];

      setAppointments(mockAppointments);
      setProducts(mockProducts);
      setServices(mockServices);
      setLoading(false);
    }, 1000);
  }, []);

  
  const lowStockProducts = products.filter(product => product.stock < 5);

  
  const popularServices = [...services].sort((a, b) => b.requests - a.requests).slice(0, 3);

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

      <h2 className="mb-4">Dashboard - Admin Beauty</h2>

      
      <CCard className="mb-4">
        <CCardHeader>
          <CIcon icon={cilCalendar} className="me-2" />
          Citas Pendientes
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Cliente</CTableHeaderCell>
                <CTableHeaderCell>Servicio</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Hora</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {appointments.map(appointment => (
                <CTableRow key={appointment.id}>
                  <CTableDataCell>{appointment.client}</CTableDataCell>
                  <CTableDataCell>{appointment.service}</CTableDataCell>
                  <CTableDataCell>{appointment.date}</CTableDataCell>
                  <CTableDataCell>{appointment.time}</CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      
      <CCard className="mb-4">
        <CCardHeader>
          <CIcon icon={cilShower} className="me-2" />
          Productos con Bajo Stock menores a 5 unidades
        </CCardHeader>
        <CCardBody>
          {lowStockProducts.length > 0 ? (
            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Producto</CTableHeaderCell>
                  <CTableHeaderCell>Unidades</CTableHeaderCell>
                  <CTableHeaderCell>Estado</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {lowStockProducts.map(product => (
                  <CTableRow key={product.id}>
                    <CTableDataCell>{product.name}</CTableDataCell>
                    <CTableDataCell>{product.stock}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color="danger">Reabastecer</CBadge>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          ) : (
            <div className="text-center text-success">
              <p>¡Todos los productos tienen stock suficiente!</p>
            </div>
          )}
        </CCardBody>
      </CCard>

    
      <CCard className="mb-4">
        <CCardHeader>
          <CIcon icon={cilStar} className="me-2" />
          Servicios Más Solicitados
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Servicio</CTableHeaderCell>
                <CTableHeaderCell>Solicitudes</CTableHeaderCell>
                <CTableHeaderCell>Popularidad</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {popularServices.map(service => (
                <CTableRow key={service.id}>
                  <CTableDataCell>{service.name}</CTableDataCell>
                  <CTableDataCell>{service.requests}</CTableDataCell>
                  <CTableDataCell>
                    <CProgress 
                      color={service.requests > 10 ? 'success' : service.requests > 5 ? 'warning' : 'info'}
                      value={(service.requests / popularServices[0].requests) * 100}
                    />
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Dashboard;