import React, { useState } from 'react';
import {
CCard,
CardBody,
CCardHeader,
CTable,
CTableHead,
CTableRow,
CTableHeaderCell,
CTableBody,
CTableDataCell,
CButton,
CFormSelect,
CFormInput,
CRow,
CCol,
CForm,
CInputGroup,
CBadge
} from '@coreui/react';

const Users = () => {

const [formData, setFormData] = useState({
    ClientUserName: '',
    ClientFirstName: '',
    ClientLastName: '',
    ClientEmail: '',
    Roll: '',
    ClienteDateRegister: '',
});

const [users, setUsers] = useState([
    { 
        username: 'juanperez', 
        firstName: 'Juan', 
        lastName: 'Pérez', 
        email: 'juan@gmail.com', 
        phone: '04121234567', 
        address: 'Av. Principal, Caracas', 
        role: 'cliente', 
        registrationDate: '20-05-2024'
    },
    { 
        username: 'mariagarcia', 
        firstName: 'María', 
        lastName: 'García', 
        email: 'maria@gmail.com', 
        phone: '04243334455', 
        address: 'Calle Bolívar, Valencia', 
        role: 'empleado', 
        registrationDate: '15-04-2024'
    },
    { 
        username: 'anaperez', 
        firstName: 'Ana', 
        lastName: 'Perez',
        email: 'ana@gmail.com', 
        phone: '04127787813', 
        address: 'Av. Libertador', 
        role: 'empleado',
        registrationDate: '25-01-2025'
    }
]);


const [searchTerm, setSearchTerm] = useState('');
const [filterRole, setFilterRole] = useState('all');
const [filterDate, setFilterDate] = useState('');


const filteredUsers = users.filter(user => {
    const matchesSearch = 
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDate = !filterDate || user.registrationDate === filterDate;
    
    return matchesSearch && matchesRole && matchesDate;
});


const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
        id: users.length + 1,
        username: formData.ClientUserName,
        firstName: formData.ClientFirstName,
        lastName: formData.ClientLastName,
        email: formData.ClientEmail,
        phone: formData.ClientPhone,
        address: formData.ClientAddress,
        role: formData.Roll,
        registrationDate: formData.ClienteDateRegister
    };
    setUsers([...users, newUser]);
    setFormData({
        ClientUserName: '',
        ClientFirstName: '',
        ClientLastName: '',
        ClientEmail: '',
        Roll: '',
        ClienteDateRegister: ''
    });
};


const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
    setUsers(users.filter(user => user.id !== id));
    }
};

return (
    <CCard className="mb-4">
        <CCardHeader>
            <h5 className="mb-0">Users</h5>
        </CCardHeader>

        <CCardBody>
        
            <CForm onSubmit={handleSubmit}>
                <CRow className="g-3">
                    <CCol md={6}>
                        <CFormInput
                            label="Client username"
                            placeholder="username"
                            value={formData.ClientUserName}
                            onChange={(e) => setFormData({...formData, ClientUserName: e.target.value})}
                            required
                        />
                    </CCol>

                <CCol md={6}>
                    <CFormInput
                        label="Client firstname"
                        placeholder="firstname"
                        value={formData.ClientFirstName}
                        onChange={(e) => setFormData({...formData, ClientFirstName: e.target.value})}
                        required
                    />
                </CCol>

                <CCol md={6}>
                    <CFormInput
                        label="Client lastname"
                        placeholder="lastname"
                        value={formData.ClientLastName}
                        onChange={(e) => setFormData({...formData, ClientLastName: e.target.value})}
                        required
                        />
                </CCol>

                <CCol md={6}>
                    <CFormInput
                        label="Client e-mail"
                        placeholder="email"
                        value={formData.ClientEmail}
                        onChange={(e) => setFormData({...formData, ClientEmail: e.target.value})}
                        required
                    />
                </CCol>

                <CCol md={6}>
                <CFormInput
                    label="Client phone number"
                    placeholder="phone number"
                    value={formData.ClientPhone}
                    onChange={(e) => setFormData({...formData, ClientPhone: e.target.value})}
                    required
                />
                </CCol>

                <CCol md={6}>
                <CFormInput
                    label="Client address"
                    placeholder="address"
                    value={formData.ClientAddress}
                    onChange={(e) => setFormData({...formData, ClientAddress: e.target.value})}
                    required
                />
                </CCol>

                <CCol md={6}>
                <CFormSelect
                    label="Role"
                    value={formData.Roll}
                    onChange={(e) => setFormData({...formData, Roll: e.target.value})}
                    required
                >
                    <option value="">Select a role</option>
                    <option value="administrador">Administrador</option>
                    <option value="cliente">Cliente</option>
                    <option value="empleado">Empleado</option>
                </CFormSelect>
                </CCol>

                <CCol md={3}>
                <CFormInput
                    type="date"
                    label="Date register"
                    value={formData.ClienteDateRegister}
                    onChange={(e) => setFormData({...formData, ClienteDateRegister: e.target.value})}
                    required
                />
                </CCol>

                <CCol md={12} className="text-end">
                <CButton type="submit" color="primary">Add User</CButton>
                </CCol>
            </CRow>
            </CForm>

            {/* Filtros */}
            <div className="mt-5">
            <CRow className="mb-3 g-3">
                <CCol md={4}>
                <CInputGroup>
                    <CFormInput
                    placeholder="Buscar por username, nombre o email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>
                </CCol>
                
                <CCol md={2}>
                <CFormSelect
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="all">Todos los roles</option>
                    <option value="administrador">Administrador</option>
                    <option value="cliente">Cliente</option>
                    <option value="empleado">Empleado</option>
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
                    setFilterRole('all');
                    setFilterDate('');
                    }}
                >
                    Limpiar
                </CButton>
                </CCol>
            </CRow>

            {/* Tabla */}
            <CTable striped hover responsive>
                <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>Username</CTableHeaderCell>
                    <CTableHeaderCell>FirstName</CTableHeaderCell>
                    <CTableHeaderCell>LastName</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Phone</CTableHeaderCell>
                    <CTableHeaderCell>Address</CTableHeaderCell>
                    <CTableHeaderCell>Role</CTableHeaderCell>
                    <CTableHeaderCell>DateRegister</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
                </CTableHead>

                <CTableBody>
                {filteredUsers.map((user) => (
                    <CTableRow key={user.id}>
                    <CTableDataCell>{user.username}</CTableDataCell>
                    <CTableDataCell>{user.firstName}</CTableDataCell>
                    <CTableDataCell>{user.lastName}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.phone}</CTableDataCell>
                    <CTableDataCell>{user.address}</CTableDataCell>
                    <CTableDataCell>
                        <CBadge color={user.role === 'empleado' ? 'primary' : user.role === 'administrador' ? 'danger' : 'success'}>
                        {user.role}
                        </CBadge>
                    </CTableDataCell>
                    <CTableDataCell>{user.registrationDate}</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(user.id)}>
                        Eliminar
                        </CButton>
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

export default Users;