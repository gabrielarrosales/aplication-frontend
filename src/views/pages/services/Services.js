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
  CFormSelect,
  CForm,
  CRow,
  CCol,
  CInputGroup,
  CBadge,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';

const Services = () => {
  // Estado para el formulario
  const [formData, setFormData] = useState({
    serviceName: '',
    category: '',
    type: '',
    duration: '',
    price: '',
  });

  // Estado para los servicios y filtros
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');

  // desde json-server
  useEffect(() => {
    fetch('http://localhost:5000/services')
      .then((response) => response.json())
      .then((data) => setServices(data))
      .catch((error) => console.error('Error al cargar los servicios:', error));
  }, []);

  // Crear nuevo servicio
  const handleSubmit = (e) => {
    e.preventDefault();

    const newService = {
      name: formData.serviceName,
      category: formData.category,
      type: formData.type,
      duration: formData.duration,
      price: parseFloat(formData.price),
    };

    fetch('http://localhost:5000/services', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newService),
    })
      .then((response) => response.json())
      .then((data) => {
        setServices([...services, data]);
        setFormData({
          serviceName: '',
          category: '',
          type: '',
          duration: '',
          price: '',
        });
      })
      .catch((error) => console.error('Error al agregar el servicio:', error));
  };

  // Eliminar servicio
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este servicio?')) {
      fetch(`http://localhost:5000/services/${id}`, {
        method: 'DELETE',
      })
        .then(() => {
          setServices(services.filter((service) => service.id !== id));
        })
        .catch((error) => console.error('Error al eliminar el servicio:', error));
    }
  };

  // Filtrar servicios
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesType = filterType === 'all' || service.type === filterType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const formatCurrency = (value, currency = '$') => {
    return `${currency} ${value.toFixed(2)}`;
  };

const [editingService, setEditingService] = useState(null);
const [visibleModal, setVisibleModal] = useState(false);
const handleEdit = (service) => {
  setEditingService(service);
  setVisibleModal(true);
};
const handleUpdate = (e) => {
  e.preventDefault();

  fetch(`http://localhost:5000/services/${editingService.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editingService),
  })
    .then((response) => response.json())
    .then((data) => {
      setServices(services.map((service) => (service.id === data.id ? data : service)));
      setVisibleModal(false);
      setEditingService(null);
    })
    .catch((error) => console.error('Error al actualizar el servicio:', error));
};

  return (
    <CCard className="mb-4">
      <CCardHeader className="mb-4">
        <h5 className="mb-0">Services</h5>
      </CCardHeader>

      <CCardBody>
        {/* Formulario de agregar servicio */}
        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormInput
                label="Service name"
                placeholder="Service name"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                required
              />
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                <option value="">Select a category</option>
                <option value="Corte">Corte de cabello</option>
                <option value="Color">Decoloracion o color</option>
                <option value="Facial">Faciales</option>
                <option value="Nails">Manicura y pedicura</option>
                <option value="Tratamiento">Tratamiento</option>
              </CFormSelect>
            </CCol>

            <CCol md={6}>
              <CFormSelect
                label="Type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select a type</option>
                <option value="Basic">Basico</option>
                <option value="Express">Express</option>
                <option value="Premium">Premium</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormInput
                label="Duration (HH:MM)"
                placeholder="Duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                required
              />
            </CCol>

            <CCol md={3}>
              <CFormInput
                label="Price (00.00)"
                placeholder="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </CCol>

            <CCol md={12} className="text-end">
              <CButton type="submit" color="primary">
                Add new service
              </CButton>
            </CCol>
          </CRow>
        </CForm>

        {/* Filtros */}
        <div className="mt-5">
          <CRow className="mb-3 g-3">
            <CCol md={4}>
              <CInputGroup>
                <CFormInput
                  placeholder="Buscar por nombre o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </CInputGroup>
            </CCol>

            <CCol md={3}>
              <CFormSelect
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Todas las categorías</option>
                <option value="Corte">Corte de cabello</option>
                <option value="Color">Color</option>
                <option value="Facial">Faciales</option>
                <option value="Nails">Manicura y pedicura</option>
                <option value="Tratamiento">Tratamiento</option>
              </CFormSelect>
            </CCol>

            <CCol md={3}>
              <CFormSelect
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">Todos los tipos</option>
                <option value="Basic">Basico</option>
                <option value="Express">Express</option>
                <option value="Premium">Premium</option>
              </CFormSelect>
            </CCol>

            <CCol md={2} className="text-end">
              <CButton
                color="secondary"
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('all');
                  setFilterType('all');
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
                <CTableHeaderCell>NAME</CTableHeaderCell>
                <CTableHeaderCell>CATEGORY</CTableHeaderCell>
                <CTableHeaderCell>TYPE</CTableHeaderCell>
                <CTableHeaderCell>DURATION</CTableHeaderCell>
                <CTableHeaderCell>PRICE</CTableHeaderCell>
                <CTableHeaderCell>ACCIONES</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              {filteredServices.map((service) => (
                <CTableRow key={service.id}>
                  <CTableDataCell>{service.name}</CTableDataCell>
                  <CTableDataCell>{service.category}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge
                      color={
                        service.type === 'Premium'
                          ? 'primary'
                          : service.type === 'Express'
                          ? 'warning'
                          : 'secondary'
                      }
                    >
                      {service.type}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{service.duration}</CTableDataCell>
                  <CTableDataCell>{formatCurrency(service.price)}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                    >
                      Eliminar
                    </CButton>
                    <CButton
                        color="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(service)}
                    >
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
    <CModalTitle>Editar Servicio</CModalTitle>
  </CModalHeader>
  <CModalBody>
    <CForm onSubmit={handleUpdate}>
      <CFormInput
        label="Nombre del servicio"
        value={editingService?.name || ''}
        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
        className="mb-3"
        required
      />
      <CFormSelect
        label="Categoría"
        value={editingService?.category || ''}
        onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
        className="mb-3"
        required
      >
        <option value="Corte">Corte de cabello</option>
        <option value="Color">Decoloracion o color</option>
        <option value="Facial">Faciales</option>
        <option value="Nails">Manicura y pedicura</option>
        <option value="Tratamiento">Tratamiento</option>
      </CFormSelect>
      <CFormSelect
        label="Tipo"
        value={editingService?.type || ''}
        onChange={(e) => setEditingService({ ...editingService, type: e.target.value })}
        className="mb-3"
        required
      >
        <option value="Basic">Basico</option>
        <option value="Express">Express</option>
        <option value="Premium">Premium</option>
      </CFormSelect>
      <CFormInput
        label="Duración (HH:MM)"
        value={editingService?.duration || ''}
        onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
        className="mb-3"
        required
      />
      <CFormInput
        label="Precio"
        type="number"
        step="0.01"
        value={editingService?.price || ''}
        onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
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