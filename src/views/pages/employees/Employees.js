import React, { useState, useEffect } from 'react';
import {
  CCard, CCardBody, CCardHeader, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CButton, CFormInput, CRow, CCol, CForm,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    address: '',
    phonenumber: '',
    specialty: '',
    username: '',
    password: '',
    email: '',
  });
  const [filters, setFilters] = useState({
    firstname: '',
    lastname: '',
    specialty: '',
  });
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [visibleEditModal, setVisibleEditModal] = useState(false);
  const [visibleAddModal, setVisibleAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Obtén el token del localStorage
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch('http://localhost:3001/employees', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('No autorizado');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setEmployees(data);
        } else {
          setEmployees([]);
        }
      })
      .catch((err) => {
        alert('No autorizado o sesión expirada');
        window.location.href = '/login';
      });
  }, [token]);

  const filteredEmployees = Array.isArray(employees)
    ? employees.filter((emp) =>
        emp.firstname?.toLowerCase().includes(filters.firstname.toLowerCase()) &&
        emp.lastname?.toLowerCase().includes(filters.lastname.toLowerCase()) &&
        emp.specialty?.toLowerCase().includes(filters.specialty.toLowerCase())
      )
    : [];

  const handleAddModalOpen = () => {
    setFormData({
      firstname: '',
      lastname: '',
      address: '',
      phonenumber: '',
      specialty: '',
      username: '',
      password: '',
      email: '',
    });
    setVisibleAddModal(true);
  };

  const handleAddModalClose = () => setVisibleAddModal(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    for (const key in formData) {
      if (!formData[key]) {
        alert('Por favor, complete todos los campos.');
        return;
      }
    }
    fetch('http://localhost:3001/employees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.mensaje || 'Error al agregar empleado');
        }
        return data;
      })
      .then((data) => {
        setEmployees([...employees, data]);
        setVisibleAddModal(false);
        setShowCreateModal(true);
        setTimeout(() => setShowCreateModal(false), 1800);
      })
      .catch((err) => alert(err.message));
  };

  const handleDelete = (emp) => {
    setEmployeeToDelete(emp);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:3001/employees/${employeeToDelete.idemployee}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setEmployees(employees.filter((emp) => emp.idemployee !== employeeToDelete.idemployee));
        setShowDeleteModal(false);
        setEmployeeToDelete(null);
      })
      .catch((err) => alert('Error al eliminar empleado: ' + err));
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setVisibleEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    fetch(`http://localhost:3001/employees/${editingEmployee.idemployee}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(editingEmployee),
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployees(
          employees.map((emp) => (emp.idemployee === data.idemployee ? data : emp))
        );
        setVisibleEditModal(false);
        setEditingEmployee(null);
        setShowUpdateModal(true);
        setTimeout(() => setShowUpdateModal(false), 1800);
      })
      .catch((err) => alert('Error al actualizar empleado: ' + err));
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({ firstname: '', lastname: '', specialty: '' });
  };

  return (
    <CCard className="mb-4 shadow border-0" style={{ borderRadius: 18 }}>
      <CCardHeader className="d-flex justify-content-between align-items-center bg-white" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--cui-primary)' }}>Empleados</h5>
        <CButton color="primary" onClick={handleAddModalOpen}>
          Agregar Empleado
        </CButton>
      </CCardHeader>
      <CCardBody>
        {/* Filtros */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <CFormInput
              label="Nombre"
              placeholder="Filtrar por nombre"
              name="firstname"
              value={filters.firstname}
              onChange={handleFilterChange}
              size="sm"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label="Apellido"
              placeholder="Filtrar por apellido"
              name="lastname"
              value={filters.lastname}
              onChange={handleFilterChange}
              size="sm"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label="Especialidad"
              placeholder="Filtrar por especialidad"
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              size="sm"
            />
          </CCol>
          <CCol md={3} className="text-end">
            <CButton color="secondary" onClick={handleClearFilters}>
              Limpiar filtros
            </CButton>
          </CCol>
        </CRow>

        {/* Tabla elegante */}
        <CTable hover responsive bordered align="middle" className="shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Nombre</CTableHeaderCell>
              <CTableHeaderCell>Apellido</CTableHeaderCell>
              <CTableHeaderCell>Dirección</CTableHeaderCell>
              <CTableHeaderCell>Teléfono</CTableHeaderCell>
              <CTableHeaderCell>Especialidad</CTableHeaderCell>
              <CTableHeaderCell>Usuario</CTableHeaderCell>
              <CTableHeaderCell>Correo</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredEmployees.map((emp) => (
              <CTableRow key={emp.idemployee}>
                <CTableDataCell>{emp.firstname}</CTableDataCell>
                <CTableDataCell>{emp.lastname}</CTableDataCell>
                <CTableDataCell>{emp.address}</CTableDataCell>
                <CTableDataCell>{emp.phonenumber}</CTableDataCell>
                <CTableDataCell>{emp.specialty}</CTableDataCell>
                <CTableDataCell>{emp.username}</CTableDataCell>
                <CTableDataCell>{emp.email}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="warning"
                    size="sm"
                    className="me-2"
                    variant="outline"
                    onClick={() => handleEdit(emp)}
                  >
                    Modificar
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(emp)}
                  >
                    Eliminar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Modal de agregar */}
        <CModal visible={visibleAddModal} onClose={handleAddModalClose}>
          <CModalHeader>
            <CModalTitle>Agregar Empleado</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleSubmit}>
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
                label="Dirección"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                label="Especialidad"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Usuario"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Correo"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              <div className="text-end">
                <CButton color="secondary" className="me-2" onClick={handleAddModalClose}>
                  Cancelar
                </CButton>
                <CButton color="primary" type="submit">
                  Agregar
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>

        {/* Modal de edición */}
        <CModal visible={visibleEditModal} onClose={() => setVisibleEditModal(false)}>
          <CModalHeader>
            <CModalTitle>Modificar Empleado</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleUpdate}>
              <CFormInput
                label="Nombre"
                value={editingEmployee?.firstname || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, firstname: e.target.value })
                }
                className="mb-3"
                required
              />
              <CFormInput
                label="Apellido"
                value={editingEmployee?.lastname || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, lastname: e.target.value })
                }
                className="mb-3"
                required
              />
              <CFormInput
                label="Dirección"
                value={editingEmployee?.address || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, address: e.target.value })
                }
                className="mb-3"
                required
              />
              <CFormInput
                label="Teléfono"
                value={editingEmployee?.phonenumber || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, phonenumber: e.target.value })
                }
                className="mb-3"
                required
              />
              <CFormInput
                label="Especialidad"
                value={editingEmployee?.specialty || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, specialty: e.target.value })
                }
                className="mb-3"
                required
              />
              <CFormInput
                label="Usuario"
                value={editingEmployee?.username || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, username: e.target.value })
                }
                className="mb-3"
                required
              />
              <CFormInput
                label="Correo"
                type="email"
                value={editingEmployee?.email || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, email: e.target.value })
                }
                className="mb-3"
                required
              />
              <CFormInput
                label="Contraseña"
                type="password"
                value={editingEmployee?.password || ''}
                onChange={(e) =>
                  setEditingEmployee({ ...editingEmployee, password: e.target.value })
                }
                className="mb-3"
                required
              />
              <div className="text-end">
                <CButton
                  color="secondary"
                  className="me-2"
                  onClick={() => setVisibleEditModal(false)}
                >
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
            ¿Estás seguro de que deseas eliminar al empleado <b>{employeeToDelete?.firstname} {employeeToDelete?.lastname}</b>?
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
              ¡Empleado actualizado correctamente!
            </span>
          </CModalBody>
        </CModal>

        {/* Modal de confirmación de creación */}
        <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <CModalBody className="text-center">
            <span className="fw-bold" style={{ color: 'var(--cui-primary)' }}>
              ¡Empleado creado correctamente!
            </span>
          </CModalBody>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default Employees;