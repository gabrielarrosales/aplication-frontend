import React, { useState, useEffect} from 'react';
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
CInputGroup,

CModal,
CModalHeader,
CModalTitle,
CModalBody
} from '@coreui/react';


const AddAppointment = () => {

//estos son los estados iniciales para el formulario
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
const [editingAppointment, setEditingAppointment] = useState(null);
const [visibleModal, setVisibleModal] = useState(false);
//[lo que guardo, funcion que va a actualizar el valor]= valor inicial

    useEffect(() => {
        fetch('http://localhost:5000/appointments')
        .then((response) => response.json())
        .then((data) => setAppointments(data))
        .catch((error) => console.error('Error al cargar las citas:', error));
    }, []);

    // para el envio del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        const newAppointment = {
        clientName: formData.clientName,
        service: formData.service,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        };

        fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAppointment),
        })
        .then((response) => response.json())
        .then((data) => {
            setAppointments([...appointments, data]);
            setFormData({ clientName: '', service: '', date: '', time: '', status: 'pending' });
        })
        .catch((error) => console.error('Error al agregar la cita:', error));
    };

    const handleDelete = (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta cita?')) {
        fetch(`http://localhost:5000/appointments/${id}`, {
            method: 'DELETE',
        })
            .then(() => {
            setAppointments(appointments.filter((appointment) => appointment.id !== id));
            })
            .catch((error) => console.error('Error al eliminar la cita:', error));
        }
    };


const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        appointment.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesDate = !filterDate || appointment.date === filterDate;
    
    return matchesSearch && matchesStatus && matchesDate;
});




const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setVisibleModal(true);
};

const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/appointments/${editingAppointment.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAppointment),
    })
        .then((response) => response.json())
        .then((data) => {
            setAppointments(appointments.map((app) => (app.id === data.id ? data : app)));
            setVisibleModal(false); 
            setEditingAppointment(null); 
        })
        .catch((error) => console.error('Error al actualizar la cita:', error));
};

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
                    Clean
                    </CButton>
                </CCol>
            </CRow>

        <CTable striped hover responsive>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>Client</CTableHeaderCell>
                    <CTableHeaderCell>Service</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell>Hour</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Accions</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            
            <CTableBody>
                {filteredAppointments.map(appointment => (
                    <CTableRow key={appointment.id}>
                        <CTableDataCell>{appointment.clientName}</CTableDataCell>
                        <CTableDataCell>{appointment.service}</CTableDataCell>
                        <CTableDataCell>{appointment.date}</CTableDataCell>
                        <CTableDataCell>{appointment.time}</CTableDataCell>
                        <CTableDataCell>
                            <span className={`badge bg-${appointment.status === 'pending' ? 'warning' : 'success'}`}>
                                {appointment.status}
                            </span>
                        </CTableDataCell>

                        <CTableDataCell>
                            <CButton color="danger" size="sm" onClick={() => handleDelete(appointment.id)} className="me-2">
                                Eliminar
                            </CButton>
                            <CButton color="warning" size="sm" onClick={() => handleEdit(appointment)}>
                                Modificar
                            </CButton>
                        </CTableDataCell>


                    </CTableRow>
                ))}
            </CTableBody>
        </CTable>
        </div>
        
        <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
            <CModalHeader>
                <CModalTitle>Editar Cita</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleUpdate}>
                    <CFormInput
                        label="Cliente"
                        value={editingAppointment?.clientName || ''}
                        onChange={(e) => setEditingAppointment({ ...editingAppointment, clientName: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        label="Servicio"
                        value={editingAppointment?.service || ''}
                        onChange={(e) => setEditingAppointment({ ...editingAppointment, service: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        type="date"
                        label="Fecha"
                        value={editingAppointment?.date || ''}
                        onChange={(e) => setEditingAppointment({ ...editingAppointment, date: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        type="time"
                        label="Hora"
                        value={editingAppointment?.time || ''}
                        onChange={(e) => setEditingAppointment({ ...editingAppointment, time: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormSelect
                        label="Estado"
                        value={editingAppointment?.status || ''}
                        onChange={(e) => setEditingAppointment({ ...editingAppointment, status: e.target.value })}
                        className="mb-3"
                        required
                    >
                        <option value="pending">Pendiente</option>
                        <option value="completed">Completada</option>
                    </CFormSelect>
                    <div className="text-end">
                        <CButton color="secondary" className="me-2" onClick={() => setVisibleModal(false)}>
                            Cancelar
                        </CButton>
                        <CButton color="primary" type="submit">
                            Guardar Cambios
                        </CButton>
                    </div>
                </CForm>
            </CModalBody>
        </CModal>
        
        </CCardBody>
    </CCard>
);
};

export default AddAppointment;