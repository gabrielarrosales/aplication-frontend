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
CInputGroup, //contenedor
CInputGroupText,// para colocar boton simple
CButton,

CDropdown, 
CDropdownToggle, 
CDropdownMenu,
CDropdownItem
}from '@coreui/react';


const Services = () => {
    return (
        <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center ">
                    <h2>Services</h2>  
                <CDropdown>
                    <CDropdownToggle color="secondary">
                        CATEGORY
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem>Hair</CDropdownItem>
                        <CDropdownItem>Nails</CDropdownItem>
                        <CDropdownItem>Facial</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
                <CDropdown>
                    <CDropdownToggle color="secondary">
                        TYPE
                    </CDropdownToggle>
                    <CDropdownMenu>
                        <CDropdownItem>Basic</CDropdownItem>
                        <CDropdownItem>Medium</CDropdownItem>
                    <   CDropdownItem>Premium</CDropdownItem>
                    </CDropdownMenu>
                </CDropdown>
                    <CButton color= 'primary' >
                        add new service
                    </CButton>
            </CCardHeader>

            <CCardBody>
                <CTable striped hover responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell> ID </CTableHeaderCell>
                            <CTableHeaderCell> NAME </CTableHeaderCell>
                            <CTableHeaderCell> CATEGORY </CTableHeaderCell>
                            <CTableHeaderCell> TYPE </CTableHeaderCell>
                            <CTableHeaderCell> DURATION </CTableHeaderCell>
                            <CTableHeaderCell> PRICE ($) </CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>

                    <CTableBody>
                        <CTableRow>
                            <CTableDataCell>1</CTableDataCell>
                            <CTableDataCell> Gold Facial</CTableDataCell>
                            <CTableDataCell>Facial</CTableDataCell>
                            <CTableDataCell>Premium</CTableDataCell>
                            <CTableDataCell>01:00:00</CTableDataCell>
                            <CTableDataCell>15</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableDataCell>2</CTableDataCell>
                            <CTableDataCell> Basic hydration</CTableDataCell>
                            <CTableDataCell>Hair</CTableDataCell>
                            <CTableDataCell>Basic</CTableDataCell>
                            <CTableDataCell>00:30:00</CTableDataCell>
                            <CInputGroup>
                                <CTableDataCell>08</CTableDataCell>
                                <CInputGroupText>$</CInputGroupText>
                            </CInputGroup>
                        </CTableRow>
                        <CTableRow>
                            <CTableDataCell>3</CTableDataCell>
                            <CTableDataCell> Hair dye</CTableDataCell>
                            <CTableDataCell>Hair</CTableDataCell>
                            <CTableDataCell>Medium</CTableDataCell>
                            <CTableDataCell>01:00:00</CTableDataCell>
                            <CTableDataCell>80</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                            <CTableDataCell>4</CTableDataCell>
                            <CTableDataCell> semi-permanent polish</CTableDataCell>
                            <CTableDataCell>Nails</CTableDataCell>
                            <CTableDataCell>Basis</CTableDataCell>
                            <CTableDataCell>00:45:00</CTableDataCell>
                            <CTableDataCell>5</CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
            </CCardBody>
        </CCard>
    );
}

export default Services;