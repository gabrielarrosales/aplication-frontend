import React, { useState } from 'react';
import {
CCard,
CCardBody,
CCardHeader,
CCol,
CRow,
CForm,
CFormInput,
CFormSelect, //para poder hacer como un menu que se despliega con opciones
CButton,
CTable,
CTableHead,
CTableRow,
CTableHeaderCell,
CTableBody,
CTableDataCell,
CInputGroup
} from '@coreui/react';

//estos son los estados iniciales para el formulario
const AddAppointment = () => {
const [formData, setFormData] = useState({
    clientName: '',
    service: '',
    date: '',
    time: '',
    status: 'pending'
});

// estado para las citas y filtros
const [appointments, setAppointments] = useState([]); //originalmente sin nada dentro ya que se espera que llegue algo 
const [searchTerm, setSearchTerm] = useState('');
const [filterStatus, setFilterStatus] = useState('all');
const [filterDate, setFilterDate] = useState(''); 
//[lo que guardo, funcion que va a actualizar el valor]= valor inicial

const sampleData = [
    { id: 1, client: 'Juan Pérez', service: 'Corte', date: '2024-05-20', time: '10:00', status: 'pending' },
    { id: 2, client: 'María García', service: 'Color', date: '2024-05-21', time: '14:30', status: 'completed' }
];

// para el envio del formulario
const handleSubmit = (e) => {
    
    e.preventDefault();

    //para crear el nuevo dato que se enviara 
    const newAppointment = {
    id: appointments.length + 1,
    ...formData //copia todos los datos del formulario
    };

    setAppointments([...appointments, newAppointment]); //aqui toma las citas existentes ...apointments y le agrega la nueva
    setFormData({ clientName: '', service: '', date: '', time: '', status: 'pending' });//reinicio
};

// Filtrar citas 
const filteredAppointments = sampleData.filter(appointment => {
    const matchesSearch = appointment.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDate = !filterDate || appointment.date === filterDate; // Nuevo filtro por fecha
    
    return matchesSearch && matchesStatus && matchesDate;
});

return (
    <CCard className="mb-4">
        <CCardHeader>
            <h5 className="mb-0">Create new appointment</h5>
        </CCardHeader>

        <CCardBody>
            {/* Formulario de agregar cita */}
            <CForm onSubmit={handleSubmit}>
                <CRow className="g-3">

                    <CCol md={6}>
                        <CFormInput
                            label="Client name"
                            placeholder="name"
                            value={formData.clientName}
                            onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                            required
                            />
                    </CCol>
            
                    <CCol md={6}>
                        <CFormSelect
                            label="Service"
                            value={formData.service}
                            onChange={(e) => setFormData({...formData, service: e.target.value})}
                            required
                            >
                            <option value="">Selecct a service</option>
                            <option value="Corte">Corte</option>
                            <option value="Color">Color</option>
                            <option value="Tratamiento">Tratamiento</option>
                        </CFormSelect>
                    </CCol>

                    <CCol md={3}>
                        <CFormInput
                            type="date"
                            label="Date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            required
                            />
                        </CCol>

                    <CCol md={3}>
                        <CFormInput
                            type="time"
                            label="Time"
                            value={formData.time}
                            onChange={(e) => setFormData({...formData, time: e.target.value})}
                            required
                            />
                        </CCol>

                    <CCol md={12} className="text-end">
                        <CButton type="submit" color="primary">Agendar Cita</CButton>
                    </CCol>

                </CRow>
            </CForm>

        {/* Filtros y Tabla */}
        <div className="mt-5">
          <CRow className="mb-3 g-3">
            <CCol md={4}>
              <CInputGroup>
                <CFormInput
                  placeholder="Buscar por nombre o servicio..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>
            
            <CCol md={2}>
              <CFormSelect
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="completed">Completado</option>
              </CFormSelect>
            </CCol>

            {/* Nuevo filtro por fecha */}
            <CCol md={3}>
              <CFormInput
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Filtrar por fecha"
              />
            </CCol>

            <CCol md={3} className="text-end">
              <CButton 
                color="secondary" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                  setFilterDate('');
                }}
              >
                Limpiar Filtros
              </CButton>
            </CCol>
          </CRow>

          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Cliente</CTableHeaderCell>
                <CTableHeaderCell>Servicio</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Hora</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            
            <CTableBody>
              {filteredAppointments.map(appointment => (
                <CTableRow key={appointment.id}>
                  <CTableDataCell>{appointment.client}</CTableDataCell>
                  <CTableDataCell>{appointment.service}</CTableDataCell>
                  <CTableDataCell>{appointment.date}</CTableDataCell>
                  <CTableDataCell>{appointment.time}</CTableDataCell>
                  <CTableDataCell>
                    <span className={`badge bg-${appointment.status === 'pending' ? 'warning' : 'success'}`}>
                      {appointment.status}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="danger" size="sm">Eliminar</CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
    </CCard>
  );
};

export default AddAppointment;