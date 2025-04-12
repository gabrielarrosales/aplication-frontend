import React, { useEffect, useState, createRef } from 'react'
import { CRow, CCol, CCard, CCardHeader, CCardBody, CButton, CModal, CModalBody, CModalHeader, CModalFooter, CForm, CFormInput, CFormLabel, CFormSelect,
CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilListNumbered, cilPlus, cilX, cilPencil, cibDropbox } from '@coreui/icons'
import { data, Navigate, useNavigate } from 'react-router-dom'
import "src/scss/stock.scss"



const Stock = () => {

  const Navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [stockId, setStockId] = useState(null);


  const [stockItems, setStockItems] = useState([
    {
      name: 'Shampoo',
      description: 'Hair cleansing product',
      amount: 50,                            
      date: '2025-04-01',                    
    },
    {
      name: 'Hair Dryer',
      description: 'Electric device for drying hair',
      amount: 10,
      date: '2025-03-28',
    },
    {
      name: 'Nail Polish',
      description: 'Coloring product for nails',
      amount: 30,
      date: '2025-04-05',
    },
    {
      name: 'Hair Brush',
      description: 'Tool for styling hair',
      amount: 20,
      date: '2025-04-10',
    },
  ]);




  const [modalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    date: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDelete = (index) => {
    const updatedStockItems = stockItems.filter((_, i) => i !== index);
    setStockItems(updatedStockItems);
  };

  const editRegister = (index) => {
    setFormData(stockItems[index]);
    setIsEditing(true);
    setStockId(index);
    setModalVisible(true);
  };

  const handleSubmit = () => {

    if (isEditing) {
      const updatedStockItems = [...stockItems];
      updatedStockItems[stockId] = formData;
      setStockItems(updatedStockItems);
      setIsEditing(false);
      setStockId(null);
    } else {
      setStockItems([...stockItems, formData]);
    }

    setFormData({
      name: '',
      Description: '',
      Amount: '',
      Date: '',
    });
    setModalVisible(false);
  };

  return (
    <>
      <div className='container'>
        <div className="button-box">
          <CCardBody>
            <CButton className="button_add" onClick={() =>{
                    setFormData({
                      name: '',
                      Description: '',
                      Amount: '',
                      Date: '',
                    }); 
                    setModalVisible(true); 
                    setIsEditing(false);
                  }}
              
              >Add <CIcon icon={cilPlus} /> </CButton>
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
              <CModalHeader className='Modal-header'>Add New Stock Item</CModalHeader>
              <CModalBody className='Modal-body'>
                <CForm>
                  <div className="mb-3">
                    <CFormInput
                      type='text'
                      id='name'
                      name='name'
                      placeholder='Item Name'
                      value={formData.name}
                      onChange={handleInputChange}
                    ></CFormInput>
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      type='text'
                      id='description'
                      name='description'
                      placeholder='Description'
                      value={formData.description}
                      onChange={handleInputChange}
                    ></CFormInput>
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      type='number'
                      id='amount'
                      name='amount'
                      placeholder='Amount'
                      value={formData.amount}
                      onChange={handleInputChange}
                    ></CFormInput>
                  </div>
                  <div className="mb-3">
                    <CFormInput
                      type='date'
                      id='date'
                      name='date'
                      placeholder='Date'
                      value={formData.date}
                      onChange={handleInputChange}
                    ></CFormInput>
                  </div>
                </CForm>
              </CModalBody>
              <CModalFooter className='Modal-footer'>
                <CButton className='button-close' onClick={() => setModalVisible(false)}>Close</CButton>
                <CButton className='button-save' onClick={handleSubmit}>Save</CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </div>
        <CCard className="c_list">
          <CCardHeader>Stock Management</CCardHeader>
          <CCardBody>
            <div className="table-responsive">
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell><CIcon icon={cilListNumbered} /> </CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Description</CTableHeaderCell>
                    <CTableHeaderCell>Amount</CTableHeaderCell>
                    <CTableHeaderCell>Date</CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                    <CTableHeaderCell></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {stockItems.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{item.name}</CTableDataCell>
                      <CTableDataCell>{item.description}</CTableDataCell>
                      <CTableDataCell>{item.amount}</CTableDataCell>
                      <CTableDataCell>{item.date}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          className='button-edit'
                          onClick={() => editRegister(index)} 
                          color='success'
                        >Edit</CButton>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          className='button-delete'
                          onClick={() => handleDelete(index)}
                          color='danger'
                        >delete</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </div>
    </>
  );
};

export default Stock;