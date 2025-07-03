import React, { useEffect, useState } from 'react';
import {
  CCard, CCardHeader, CCardBody, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CButton, CFormInput, CRow, CCol, CForm, CModal,
  CModalHeader, CModalTitle, CModalBody, CModalFooter, CFormSelect
} from '@coreui/react';
import { BASE_URL } from '../../../config'; // Asegúrate de que la ruta sea correcta

const Users = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstname: '',
    lastname: '',
    email: '',
    phonenumber: '',
    address: '',
    idroll: '',
    fecha_ingresado: '',
  });
  const [search, setSearch] = useState({
    username: '',
    firstname: '',
    lastname: '',
    email: '',
    fecha_ingresado: '',
  });
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [deleteUser, setDeleteUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const token = localStorage.getItem('token');

  // Cargar usuarios
  useEffect(() => {
    fetch(`${BASE_URL}/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Error al cargar los usuarios:', err));
  }, [token]);

  // Filtro avanzado
  const filteredUsers = users.filter(user =>
    (user.username?.toLowerCase().includes(search.username.toLowerCase())) &&
    (user.firstname?.toLowerCase().includes(search.firstname.toLowerCase())) &&
    (user.lastname?.toLowerCase().includes(search.lastname.toLowerCase())) &&
    (user.email?.toLowerCase().includes(search.email.toLowerCase())) &&
    (user.fecha_ingresado?.slice(0, 10).includes(search.fecha_ingresado))
  );

  // Abrir modal para crear usuario
  const handleAddModalOpen = () => {
    setFormData({
      username: '',
      password: '',
      firstname: '',
      lastname: '',
      email: '',
      phonenumber: '',
      address: '',
      idroll: '',
      fecha_ingresado: '',
    });
    setVisibleAddModal(true);
  };

  const handleAddModalClose = () => setVisibleAddModal(false);

  // Crear usuario
  const handleSubmit = (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key] && key !== 'fecha_ingresado') {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
      }
    }
    const dataToSend = { ...formData, idroll: Number(formData.idroll) };
    fetch(`${BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || 'Error al agregar usuario');
        return data;
      })
      .then((data) => {
        setUsers([...users, data]);
        setVisibleAddModal(false);
      })
      .catch((err) => alert(err.message));
  };

  // Eliminar usuario con modal de confirmación
  const handleDelete = (user) => {
    setDeleteUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    fetch(`${BASE_URL}/users/${deleteUser.iduser}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setUsers(users.filter((user) => user.iduser !== deleteUser.iduser));
        setShowDeleteModal(false);
        setDeleteUser(null);
      })
      .catch((err) => alert('Error al eliminar usuario: ' + err));
  };

  // Editar usuario
  const handleEdit = (user) => {
    setEditingUser(user);
    setVisibleEditModal(true);
  };

  // Actualizar usuario con modal de confirmación
  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`${BASE_URL}/users/${editingUser.iduser}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(editingUser),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || 'Error al actualizar usuario');
        return data;
      })
      .then((data) => {
        setUsers(users.map((user) => (user.iduser === data.iduser ? data : user)));
        setVisibleEditModal(false);
        setEditingUser(null);
        setShowUpdateModal(true);
        setTimeout(() => setShowUpdateModal(false), 1800);
      })
      .catch((err) => alert(err.message));
  };

  // Formato elegante para la tabla
  return (
    <CCard className="mb-4 shadow border-0" style={{ borderRadius: 18 }}>
      <CCardHeader className="d-flex justify-content-between align-items-center bg-white" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--cui-primary)' }}>Usuarios</h5>
        <CButton color="primary" onClick={handleAddModalOpen}>
          Crear nuevo usuario
        </CButton>
      </CCardHeader>
      <CCardBody>
        {/* Filtros avanzados */}
        <CRow className="mb-4 g-3">
          <CCol md={2}>
            <CFormInput
              label="Usuario"
              placeholder="Buscar usuario"
              value={search.username}
              onChange={e => setSearch({ ...search, username: e.target.value })}
              size="sm"
            />
          </CCol>
          <CCol md={2}>
            <CFormInput
              label="Nombre"
              placeholder="Buscar nombre"
              value={search.firstname}
              onChange={e => setSearch({ ...search, firstname: e.target.value })}
              size="sm"
            />
          </CCol>
          <CCol md={2}>
            <CFormInput
              label="Apellido"
              placeholder="Buscar apellido"
              value={search.lastname}
              onChange={e => setSearch({ ...search, lastname: e.target.value })}
              size="sm"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label="Email"
              placeholder="Buscar email"
              value={search.email}
              onChange={e => setSearch({ ...search, email: e.target.value })}
              size="sm"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label="Fecha de ingreso"
              type="date"
              value={search.fecha_ingresado}
              onChange={e => setSearch({ ...search, fecha_ingresado: e.target.value })}
              size="sm"
            />
          </CCol>
        </CRow>

        {/* Tabla elegante */}
        <CTable hover responsive bordered align="middle" className="shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Usuario</CTableHeaderCell>
              <CTableHeaderCell>Nombre</CTableHeaderCell>
              <CTableHeaderCell>Apellido</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              <CTableHeaderCell>Teléfono</CTableHeaderCell>
              <CTableHeaderCell>Dirección</CTableHeaderCell>
              <CTableHeaderCell>Rol</CTableHeaderCell>
              <CTableHeaderCell>Fecha Ingreso</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredUsers.map((user) => (
              <CTableRow key={user.iduser}>
                <CTableDataCell>{user.username}</CTableDataCell>
                <CTableDataCell>{user.firstname}</CTableDataCell>
                <CTableDataCell>{user.lastname}</CTableDataCell>
                <CTableDataCell>{user.email}</CTableDataCell>
                <CTableDataCell>{user.phonenumber}</CTableDataCell>
                <CTableDataCell>{user.address}</CTableDataCell>
                <CTableDataCell>{user.idroll}</CTableDataCell>
                <CTableDataCell>{user.fecha_ingresado?.slice(0, 10)}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="danger" size="sm" className="me-2" variant="outline"
                    onClick={() => handleDelete(user)}>
                    Eliminar
                  </CButton>
                  <CButton color="warning" size="sm" variant="outline"
                    onClick={() => handleEdit(user)}>
                    Modificar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Modal para crear usuario */}
        <CModal visible={visibleAddModal} onClose={handleAddModalClose}>
          <CModalHeader>
            <CModalTitle>Crear nuevo usuario</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleSubmit}>
              <CFormInput
                label="Usuario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Nombre"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Apellido"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Teléfono"
                value={formData.phonenumber}
                onChange={(e) => setFormData({ ...formData, phonenumber: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Dirección"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Rol (idroll)"
                type="number"
                value={formData.idroll}
                onChange={(e) => setFormData({ ...formData, idroll: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Fecha de ingreso"
                type="date"
                value={formData.fecha_ingresado}
                onChange={(e) => setFormData({ ...formData, fecha_ingresado: e.target.value })}
                className="mb-3"
              />
              <div className="text-end">
                <CButton color="secondary" className="me-2" onClick={handleAddModalClose}>
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  Crear
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>

        {/* Modal para editar usuario */}
        <CModal visible={visibleEditModal} onClose={() => setVisibleEditModal(false)}>
          <CModalHeader>
            <CModalTitle>Modificar Usuario</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleUpdate}>
              <CFormInput
                label="Usuario"
                value={editingUser?.username || ''}
                onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Contraseña"
                type="password"
                value={editingUser?.password || ''}
                onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Nombre"
                value={editingUser?.firstname || ''}
                onChange={(e) => setEditingUser({ ...editingUser, firstname: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Apellido"
                value={editingUser?.lastname || ''}
                onChange={(e) => setEditingUser({ ...editingUser, lastname: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Email"
                type="email"
                value={editingUser?.email || ''}
                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Teléfono"
                value={editingUser?.phonenumber || ''}
                onChange={(e) => setEditingUser({ ...editingUser, phonenumber: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Dirección"
                value={editingUser?.address || ''}
                onChange={(e) => setEditingUser({ ...editingUser, address: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Rol (idroll)"
                type="number"
                value={editingUser?.idroll || ''}
                onChange={(e) => setEditingUser({ ...editingUser, idroll: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Fecha de ingreso"
                type="date"
                value={editingUser?.fecha_ingresado?.slice(0, 10) || ''}
                onChange={(e) => setEditingUser({ ...editingUser, fecha_ingresado: e.target.value })}
                className="mb-3"
              />
              <div className="text-end">
                <CButton color="secondary" className="me-2" onClick={() => setVisibleEditModal(false)}>
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  Guardar Cambios
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>

        {/* Modal de confirmación de eliminación */}
        <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <CModalHeader>
            <CModalTitle>Confirmar eliminación</CModalTitle>
          </CModalHeader>
          <CModalBody>
            ¿Estás seguro de que deseas eliminar al usuario <b>{deleteUser?.username}</b>?
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setShowDeleteModal(false)}>
              Cancelar
            </CButton>
            <CButton color="danger" onClick={confirmDelete}>
              Eliminar
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Modal de confirmación de actualización */}
        <CModal visible={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <CModalBody className="text-center">
            <span className="fw-bold" style={{ color: 'var(--cui-primary)' }}>
              ¡Usuario actualizado correctamente!
            </span>
          </CModalBody>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default Users;