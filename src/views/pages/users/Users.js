import React, { useState, useEffect } from 'react';
import {
CCard,
CCardBody,
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
CBadge,
CModal,
CModalHeader,
CModalTitle,
CModalBody
} from '@coreui/react';

const Users = () => {

const [users, setUsers] = useState([]);
const [searchTerm, setSearchTerm] = useState('');
const [formData, setFormData] = useState({
    ClientUserName: '',
    ClientFirstName: '',
    ClientLastName: '',
    ClientEmail: '',
    Role: '',
    ClienteDateRegister: '',
    ClientAddress: '',
    ClientPhone: '',
});

useEffect(() => {
    fetch('http://localhost:5000/users')
        .then((response) => response.json())
        .then((data) => {
        setUsers(data);
        })
        .catch((error) => {
        console.error('Error al cargar los usuarios:', error);
        });
    }, []);

const [filterRole, setFilterRole] = useState('all');
const [filterDate, setFilterDate] = useState('');

const filteredUsers = users.filter(user => {
    const searchText = searchTerm.toLowerCase();
    const matchesSearch = 
        user.username.toLowerCase().includes(searchText) ||
        user.firstName.toLowerCase().includes(searchText) ||
        user.lastName.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText);
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesDate = !filterDate || user.ClienteDateRegister === filterDate;
    
    return matchesSearch && matchesRole && matchesDate;
});

const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
        username: formData.ClientUserName,
        firstName: formData.ClientFirstName,
        lastName: formData.ClientLastName,
        email: formData.ClientEmail,
        phone: formData.ClientPhone,
        address: formData.ClientAddress,
        role: formData.Role,
        registrationDate: formData.ClienteDateRegister
    };

    fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          setFormData({
            ClientUserName: '',
            ClientFirstName: '',
            ClientLastName: '',
            ClientEmail: '',
            Role: '',
            ClienteDateRegister: '',
          });
        })
        .catch((error) => {
          console.error('Error al agregar el usuario:', error);
        });
    };


    const handleDelete = (id) => {
        console.log(`Intentando eliminar el usuario con ID: ${id}`);
        if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
            fetch(`http://localhost:5000/users/${id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    // Filtra los usuarios eliminando el que tiene el ID especificado
                    setUsers(users.filter((user) => user.id !== id));
                })
                .catch((error) => {
                    console.error('Error al eliminar el usuario:', error);
                });
        }
    };

const [editingUser, setEditingUser] = useState(null);
const [visibleModal, setVisibleModal] = useState(false);
const handleEdit = (user) => {
    setEditingUser(user);
    setVisibleModal(true);
};

const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingUser),
    })
        .then((response) => response.json())
        .then((data) => {
            setUsers(users.map((user) => (user.id === data.id ? data : user)));
            setVisibleModal(false);
            setEditingUser(null);
        })
        .catch((error) => console.error('Error al actualizar el usuario:', error));
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
                    value={formData.Role}
                    onChange={(e) => setFormData({...formData, Role: e.target.value})}
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
                        <CButton color="danger" size="sm" className="me-2" onClick={() => handleDelete(user.id)} >
                            Eliminar
                        </CButton>
                        <CButton color="warning" size="sm" className="me-2" onClick={() => handleEdit(user)}>
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
                <CModalTitle>Editar Usuario</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CForm onSubmit={handleUpdate}>
                    <CFormInput
                        label="Username"
                        value={editingUser?.username || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        label="First Name"
                        value={editingUser?.firstName || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        label="Last Name"
                        value={editingUser?.lastName || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        label="Email"
                        value={editingUser?.email || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        label="Phone"
                        value={editingUser?.phone || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormInput
                        label="Address"
                        value={editingUser?.address || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                        className="mb-3"
                        required
                    />
                    <CFormSelect
                        label="Role"
                        value={editingUser?.role || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                        className="mb-3"
                        required
                    >
                        <option value="administrador">Administrador</option>
                        <option value="cliente">Cliente</option>
                        <option value="empleado">Empleado</option>
                    </CFormSelect>
                    <CFormInput
                        type="date"
                        label="Registration Date"
                        value={editingUser?.ClienteDateRegister || ''}
                        onChange={(e) => setEditingUser({ ...editingUser, ClienteDateRegister: e.target.value })}
                        className="mb-3"
                        required
                    />
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

export default Users;