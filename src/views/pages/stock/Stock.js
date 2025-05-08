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
CFormInput,
CRow,
CCol,
CForm,
CInputGroup,
CModal,
CModalHeader, 
CModalTitle, 
CModalBody,
} from '@coreui/react';

const Stock = () => {

const [stockItems, setStockItems] = useState([]);
const [formData, setFormData] = useState({
    productName: '',
    amount: '',
    date: ''
});

useEffect(() => {
    fetch('http://localhost:5000/stockItems')
      .then((response) => response.json())
      .then((data) => {
        setStockItems(data);
      })
      .catch((error) => {
        console.error('Error al cargar los items del stock:', error);
      });
  }, []);


    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');


    const filteredStock = stockItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = !filterDate || item.date === filterDate;
        
        return matchesSearch && matchesDate;
    });


        const handleSubmit = (e) => {
            e.preventDefault();
            const newItem = {
                name: formData.productName,
                amount: parseInt(formData.amount),
                date: formData.date,
            };

            fetch('http://localhost:5000/stockItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newItem),
            })
            .then((response) => response.json())
            .then((data) => {
                setStockItems([...stockItems, data]);
                setFormData({
                productName: '',
                amount: '',
                date: '',
                });
            })
            .catch((error) => {
                console.error('Error al agregar el producto al stock:', error);
            });
        };

    
        const handleDelete = (id) => {
            console.log(`Intentando eliminar el item con ID: ${id}`);
            if (window.confirm('¿Estás seguro de eliminar este item del stock?')) {
            fetch(`http://localhost:5000/stockItems/${id}`, {
                method: 'DELETE',
            })
                .then(() => {
                setStockItems(stockItems.filter((item) => item.id !== id));
                })
                .catch((error) => {
                console.error('Error al eliminar el producto del stock:', error);
                });
            }
        };

    const [editingItem, setEditingItem] = useState(null);
    const [visibleModal, setVisibleModal] = useState(false);
    const handleEdit = (item) => {
        setEditingItem(item);
        setVisibleModal(true);
    };

const handleUpdate = (e) => {
  e.preventDefault();


  fetch(`http://localhost:5000/stockItems/${editingItem.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(editingItem),
  })
    .then((response) => response.json())
    .then((data) => {
      setStockItems(stockItems.map((item) => (item.id === data.id ? data : item)));
      setVisibleModal(false);
      setEditingItem(null);
    })
    .catch((error) => {
      console.error('Error al actualizar el producto:', error);
    });
};

    return (
        <CCard className="mb-4">
        <CCardHeader>
            <h5 className="mb-0">Stock</h5>
        </CCardHeader>

        <CCardBody>
            {/* Formulario de agregar stock */}
            <CForm onSubmit={handleSubmit}>
            <CRow className="g-3">
                <CCol md={6}>
                <CFormInput
                    label="Nombre del producto"
                    placeholder="Nombre"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    required
                />
                </CCol>

                <CCol md={3}>
                <CFormInput
                    label="Cantidad"
                    placeholder="Cantidad"
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    required
                />
                </CCol>

                <CCol md={3}>
                <CFormInput
                    type="date"
                    label="Fecha de ingreso"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                />
                </CCol>

                <CCol md={12} className="text-end">
                <CButton type="submit" color="primary">Agregar al Stock</CButton>
                </CCol>
            </CRow>
            </CForm>

            {/* Filtros */}
            <div className="mt-5">
            <CRow className="mb-3 g-3">
                <CCol md={6}>
                <CInputGroup>
                    <CFormInput
                    placeholder="Buscar por nombre de producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </CInputGroup>
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
                    setFilterDate('');
                    }}
                >
                    Limpiar filtros
                </CButton>
                </CCol>
            </CRow>

            {/* Tabla */}
            <CTable striped hover responsive>
                <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>PRODUCTO</CTableHeaderCell>
                    <CTableHeaderCell>CANTIDAD</CTableHeaderCell>
                    <CTableHeaderCell>FECHA INGRESO</CTableHeaderCell>
                    <CTableHeaderCell>ACCIONES</CTableHeaderCell>
                </CTableRow>
                </CTableHead>

                <CTableBody>
                {filteredStock.map(item => (
                    <CTableRow key={item.id}>
                    <CTableDataCell>{item.name}</CTableDataCell>
                    <CTableDataCell>{item.amount}</CTableDataCell>
                    <CTableDataCell>{item.date}</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="warning" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                            Modificar
                        </CButton>
                        <CButton color="danger" size="sm" onClick={() => handleDelete(item.id)}>
                            Eliminar
                        </CButton>
                    </CTableDataCell>
                    </CTableRow>
                ))}
                </CTableBody>

            </CTable>
            </div>
        
        <CModal visible={visibleModal} onClose={() => setVisibleModal(false)}>
          <CModalHeader>
            <CModalTitle>Modificar Producto</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleUpdate}>
              <CFormInput
                label="Nombre del producto"
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                className="mb-3"
                required
              />
              <CFormInput
                label="Cantidad"
                type="number"
                value={editingItem?.amount || ''}
                onChange={(e) => setEditingItem({ ...editingItem, amount: parseInt(e.target.value) || 0 })}
                className="mb-3"
                required
              />
              <CFormInput
                type="date"
                label="Fecha de ingreso"
                value={editingItem?.date || ''}
                onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
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

export default Stock;