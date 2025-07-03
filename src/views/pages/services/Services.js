import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardHeader,
  CCardBody,
  CTable,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CTableRow,
  CFormInput,
  CButton,
  CForm,
  CRow,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
} from '@coreui/react';

const Services = () => {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    servicename: '',
    idcategory: '',
    idtype: '',
    duration: '',
    price: '',
  });

  // Estado para los servicios y filtros
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    servicename: '',
    idcategory: '',
    idtype: '',
    price: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Modales de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Modal para editar servicio
  const [editingService, setEditingService] = useState(null);
  const [visibleModal, setVisibleModal] = useState(false);

  // Token JWT si lo usas
  const token = localStorage.getItem('token');

  // Cargar servicios desde el backend real
  useEffect(() => {
    fetch('http://localhost:3001/services', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Error al cargar los servicios:', error));
  }, [token]);

  // Crear nuevo servicio
  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.servicename.length < 3) {
      alert('El nombre del servicio debe tener al menos 3 caracteres');
      return;
    }
    if (!formData.idcategory || isNaN(Number(formData.idcategory)) || Number(formData.idcategory) <= 0) {
      alert('La categoría debe ser un número positivo');
      return;
    }
    // Validar formato HH:mm:ss
    const durationRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    if (!durationRegex.test(formData.duration)) {
      alert('Formato de duración inválido. Usa HH:mm:ss (ej: 00:30:00)');
      return;
    }

    const newService = {
      servicename: formData.servicename,
      idcategory: Number(formData.idcategory),
      idtype: Number(formData.idtype),
      duration: formData.duration,
      price: Number(formData.price),
    };

    fetch('http://localhost:3001/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newService),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensaje || 'Error al agregar servicio');
        return data;
      })
      .then((data) => {
        setServices([...services, data]);
        setFormData({
          servicename: '',
          idcategory: '',
          idtype: '',
          duration: '',
          price: '',
        });
        setShowAddForm(false);
        setShowCreateModal(true);
        setTimeout(() => setShowCreateModal(false), 1800);
      })
      .catch((error) => alert(error.message));
  };

  // Eliminar servicio con modal de confirmación
  const handleDelete = (service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    fetch(`http://localhost:3001/services/${serviceToDelete.idservice}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setServices(services.filter((service) => service.idservice !== serviceToDelete.idservice));
        setShowDeleteModal(false);
        setServiceToDelete(null);
      })
      .catch((error) => alert('Error al eliminar el servicio: ' + error));
  };

  // Editar servicio
  const handleEdit = (service) => {
    setEditingService(service);
    setVisibleModal(true);
  };

  // Actualizar servicio con modal de confirmación
  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:3001/services/${editingService.idservice}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...editingService,
        idcategory: Number(editingService.idcategory),
        idtype: Number(editingService.idtype),
        price: Number(editingService.price),
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.mensaje || 'Error al actualizar servicio');
        return data;
      })
      .then((data) => {
        setServices(services.map((service) => (service.idservice === data.idservice ? data : service)));
        setVisibleModal(false);
        setEditingService(null);
        setShowUpdateModal(true);
        setTimeout(() => setShowUpdateModal(false), 1800);
      })
      .catch((error) => alert(error.message));
  };

  // Filtros avanzados
  const filteredServices = Array.isArray(services)
    ? services.filter((service) => {
        const name = service?.servicename?.toLowerCase() || '';
        const idcategory = String(service?.idcategory || '');
        const idtype = String(service?.idtype || '');
        const price = String(service?.price || '');
        return (
          name.includes(filters.servicename.toLowerCase()) &&
          idcategory.includes(filters.idcategory) &&
          idtype.includes(filters.idtype) &&
          price.includes(filters.price)
        );
      })
    : [];

  // Estilo moderno y elegante
  return (
    <CCard className="mb-4 shadow border-0" style={{ borderRadius: 18 }}>
      <CCardHeader className="mb-4 d-flex justify-content-between align-items-center bg-white" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
        <h5 className="mb-0 fw-bold" style={{ color: 'var(--cui-primary)' }}>Servicios</h5>
        <CButton color="primary" onClick={() => setShowAddForm(true)}>
          Agregar nuevo servicio
        </CButton>
      </CCardHeader>

      <CCardBody>
        {/* Modal para crear nuevo servicio */}
        <CModal visible={showAddForm} onClose={() => setShowAddForm(false)}>
          <CModalHeader>
            <CModalTitle>Agregar nuevo servicio</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleSubmit}>
              <CRow className="g-3">
                <CCol md={12}>
                  <CFormInput
                    label="Nombre del servicio"
                    placeholder="Nombre del servicio"
                    value={formData.servicename}
                    onChange={(e) => setFormData({ ...formData, servicename: e.target.value })}
                    required
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="ID Categoría"
                    type="number"
                    value={formData.idcategory}
                    onChange={(e) => setFormData({ ...formData, idcategory: e.target.value })}
                    required
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="ID Tipo"
                    type="number"
                    value={formData.idtype}
                    onChange={(e) => setFormData({ ...formData, idtype: e.target.value })}
                    required
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Duración (HH:MM:SS)"
                    placeholder="Duración"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    className="mb-3"
                  />
                </CCol>
                <CCol md={6}>
                  <CFormInput
                    label="Precio"
                    placeholder="Precio"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="mb-3"
                  />
                </CCol>
              </CRow>
              <div className="text-end mt-3">
                <CButton color="secondary" className="me-2" onClick={() => setShowAddForm(false)}>
                  Cancelar
                </CButton>
                <CButton type="submit" color="primary">
                  Guardar servicio
                </CButton>
              </div>
            </CForm>
          </CModalBody>
        </CModal>

        {/* Filtros avanzados */}
        <CRow className="mb-4 g-3">
          <CCol md={3}>
            <CFormInput
              label="Buscar por nombre"
              placeholder="Nombre del servicio"
              value={filters.servicename}
              onChange={e => setFilters({ ...filters, servicename: e.target.value })}
              size="sm"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label="Buscar por ID Categoría"
              placeholder="ID Categoría"
              value={filters.idcategory}
              onChange={e => setFilters({ ...filters, idcategory: e.target.value })}
              size="sm"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label="Buscar por ID Tipo"
              placeholder="ID Tipo"
              value={filters.idtype}
              onChange={e => setFilters({ ...filters, idtype: e.target.value })}
              size="sm"
            />
          </CCol>
          <CCol md={3}>
            <CFormInput
              label="Buscar por precio"
              placeholder="Precio"
              value={filters.price}
              onChange={e => setFilters({ ...filters, price: e.target.value })}
              size="sm"
            />
          </CCol>
        </CRow>

        {/* Tabla elegante */}
        <CTable hover responsive bordered align="middle" className="shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
          <CTableHead color="light">
            <CTableRow>
              <CTableHeaderCell>Nombre</CTableHeaderCell>
              <CTableHeaderCell>ID Categoría</CTableHeaderCell>
              <CTableHeaderCell>ID Tipo</CTableHeaderCell>
              <CTableHeaderCell>Duración</CTableHeaderCell>
              <CTableHeaderCell>Precio</CTableHeaderCell>
              <CTableHeaderCell>Acciones</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {filteredServices.map((service) => (
              <CTableRow key={service.idservice}>
                <CTableDataCell>{service.servicename}</CTableDataCell>
                <CTableDataCell>{service.idcategory}</CTableDataCell>
                <CTableDataCell>{service.idtype}</CTableDataCell>
                <CTableDataCell>{service.duration}</CTableDataCell>
                <CTableDataCell>{service.price}</CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="danger"
                    size="sm"
                    className="me-2"
                    variant="outline"
                    onClick={() => handleDelete(service)}
                  >
                    Eliminar
                  </CButton>
                  <CButton
                    color="warning"
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                  >
                    Modificar
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>

        {/* Modal de confirmación de eliminación */}
        <CModal visible={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
          <CModalHeader>
            <CModalTitle>Confirmar eliminación</CModalTitle>
          </CModalHeader>
          <CModalBody>
            ¿Estás seguro de que deseas eliminar el servicio <b>{serviceToDelete?.servicename}</b>?
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

        {/* Modal de confirmación de creación */}
        <CModal visible={showCreateModal} onClose={() => setShowCreateModal(false)}>
          <CModalBody className="text-center">
            <span className="fw-bold" style={{ color: 'var(--cui-primary)' }}>
              ¡Servicio creado correctamente!
            </span>
          </CModalBody>
        </CModal>

        {/* Modal de confirmación de actualización */}
        <CModal visible={showUpdateModal} onClose={() => setShowUpdateModal(false)}>
          <CModalBody className="text-center">
            <span className="fw-bold" style={{ color: 'var(--cui-primary)' }}>
              ¡Servicio actualizado correctamente!
            </span>
          </CModalBody>
        </CModal>

        {/* Modal para editar servicio */}
        <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
          <CModalHeader>
            <CModalTitle>Editar Servicio</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleUpdate}>
              <CFormInput
                label="Nombre del servicio"
                value={editingService?.servicename || ''}
                onChange={(e) => setEditingService({ ...editingService, servicename: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="ID Categoría"
                type="number"
                value={editingService?.idcategory || ''}
                onChange={(e) => setEditingService({ ...editingService, idcategory: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="ID Tipo"
                type="number"
                value={editingService?.idtype || ''}
                onChange={(e) => setEditingService({ ...editingService, idtype: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Duración (HH:MM:SS)"
                value={editingService?.duration || ''}
                onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Precio"
                type="number"
                value={editingService?.price || ''}
                onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
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

export default Services;