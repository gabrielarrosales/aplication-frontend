import React from 'react'
import{
CCard, //lo que contiene a todos
CCardHeader, //el titulo 
CCardBody, //el cuerpo
CTable, //el contenedor de la tabla
CTableHead, //el titulo de la tabla
CTableHeaderCell, //para colocar los nombres de las columnas
CTableBody, //cuerpo de la tabla
CTableDataCell, //para colocar los datos de las columnas
CTableRow, //para añadir una fila
CFormInput, //barrita para ingresar datos
CButton,
CFormSelect,
CForm,
CRow,
CCol,

CInputGroup, //contenedor
CInputGroupText,// para colocar boton simple
CDropdown, 
CDropdownToggle, 
CDropdownMenu,
CDropdownItem,
}from '@coreui/react';


const Services = () => {
    function formatCurrency(value, currency) {

        return `${currency ?? "$"} ${value.toFixed(2)}`;
    }

    return (
        <>
            <CCard>
                <CCardHeader className= "mb-4">
                        <h5 className="mb-0">Services</h5>  
                </CCardHeader>

                <CCardBody>
                        <CForm >
                            <CRow className="g-3">
                                <CCol md={6}>
                                    <CFormInput
                                        label="Service name"
                                        placeholder="Service name"
                                        required
                                        />
                                </CCol>
                    
                                <CCol md={6}>
                                    <CFormSelect
                                        label="Category"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="Corte">Corte de cabello</option>
                                        <option value="Color">Decoloracion o color</option>
                                        <option value="Color">Faciales</option>
                                        <option value="Color">Manicura y pedicura</option>
                                        <option value="Tratamiento">Tratamiento</option>
                                    </CFormSelect>
                                </CCol>

                                <CCol md={6}>
                                    <CFormSelect
                                        label="Type"
                                        required
                                    >
                                        <option value="">Select a type</option>
                                        <option value="Corte">Basico</option>
                                        <option value="Color">Express</option>
                                        <option value="Color">Premium</option>
                                        <option value="Tratamiento">Tratamiento</option>
                                    </CFormSelect>
                                </CCol>
                    
                                <CCol md={3}>
                                    <CFormInput
                                        label="Duration (HH:MM)"
                                        placeholder="Duration"
                                        required
                                    />
                                </CCol>

                                <CCol md={6}>
                                    <CFormInput
                                        label="Price (00.00)"
                                        placeholder="price"
                                        required
                                        />
                                </CCol>
                                
                    
                                <CCol md={12} className="text-end">
                                    <CButton type="submit" color="primary">Add new service</CButton>
                                </CCol>
                    
                            </CRow>
                        </CForm>

                    <div className="mt-5">
                        <CTable striped hover responsive>
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell> ID </CTableHeaderCell>
                                    <CTableHeaderCell> NAME </CTableHeaderCell>
                                    <CTableHeaderCell> CATEGORY </CTableHeaderCell>
                                    <CTableHeaderCell> TYPE </CTableHeaderCell>
                                    <CTableHeaderCell> DURATION </CTableHeaderCell>
                                    <CTableHeaderCell> PRICE </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>

                            <CTableBody>

                                    <CTableRow>
                                        <CTableDataCell>1</CTableDataCell>
                                        <CTableDataCell> Gold Facial</CTableDataCell>
                                        <CTableDataCell>Facial</CTableDataCell>
                                        <CTableDataCell>Premium</CTableDataCell>
                                        <CTableDataCell>01:00:00</CTableDataCell>
                                        <CTableDataCell>{formatCurrency(10)}</CTableDataCell>
                                    </CTableRow>

                                    <CTableRow>
                                        <CTableDataCell>2</CTableDataCell>
                                        <CTableDataCell> Basic hydration</CTableDataCell>
                                        <CTableDataCell>Hair</CTableDataCell>
                                        <CTableDataCell>Basic</CTableDataCell>
                                        <CTableDataCell>00:30:00</CTableDataCell>
                                        <CTableDataCell>{formatCurrency(15)}</CTableDataCell>
                                    </CTableRow>

                                    <CTableRow>
                                        <CTableDataCell>3</CTableDataCell>
                                        <CTableDataCell> Hair dye</CTableDataCell>
                                        <CTableDataCell>Hair</CTableDataCell>
                                        <CTableDataCell>Medium</CTableDataCell>
                                        <CTableDataCell>01:00:00</CTableDataCell>
                                        <CTableDataCell>{formatCurrency(80)}</CTableDataCell>
                                    </CTableRow>

                                    <CTableRow>
                                        <CTableDataCell>4</CTableDataCell>
                                        <CTableDataCell> semi-permanent polish</CTableDataCell>
                                        <CTableDataCell>Nails</CTableDataCell>
                                        <CTableDataCell>Basis</CTableDataCell>
                                        <CTableDataCell>00:45:00</CTableDataCell>
                                        <CTableDataCell>{formatCurrency(5)}</CTableDataCell>
                                    </CTableRow>

                            </CTableBody>
                        </CTable>
                    </div>
                </CCardBody>
            </CCard>
        </>

    );
}

export default Services;