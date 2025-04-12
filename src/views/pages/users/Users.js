import React from 'react';
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
CInputGroup,
CInputGroupText,
CFormInput,
CCardFooter,
} from '@coreui/react';
import { cilSearch, cilUserPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Users = () => {
return (
    <CCard>
        <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5>Lista de Usuarios</h5>
            <div className="d-flex">
            <CInputGroup className="me-3" style={{ width: '300px' }}>
                <CInputGroupText>
                <CIcon icon={cilSearch} />
                </CInputGroupText>
                <CFormInput placeholder="Buscar usuario..." />
            </CInputGroup>
            <CButton color="primary">
                <CIcon icon={cilUserPlus} className="me-2" />
                Nuevo Usuario
            </CButton>
        </div>
    </CCardHeader>

    <CCardBody>
        <CTable striped hover responsive>
            <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>ID</CTableHeaderCell>
                    <CTableHeaderCell>Nombre</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>Rol</CTableHeaderCell>
                    <CTableHeaderCell>Acciones</CTableHeaderCell>
                </CTableRow>
            </CTableHead>

            <CTableBody>
                <CTableRow>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>Ana Pérez</CTableDataCell>
                    <CTableDataCell>ana@example.com</CTableDataCell>
                    <CTableDataCell>Estilista</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="info" size="sm" className="me-2">
                            Editar
                        </CButton>
                        <CButton color="danger" size="sm">
                            Eliminar
                        </CButton>
                    </CTableDataCell>
                </CTableRow>
                <CTableRow>
                    <CTableDataCell>2</CTableDataCell>
                    <CTableDataCell>Carlos López</CTableDataCell>
                    <CTableDataCell>carlos@example.com</CTableDataCell>
                    <CTableDataCell>Administrador</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="info" size="sm" className="me-2">
                            Editar
                        </CButton>
                        <CButton color="danger" size="sm">
                            Eliminar
                        </CButton>
                    </CTableDataCell>
                </CTableRow>
                <CTableRow>
                    <CTableDataCell>3</CTableDataCell>
                    <CTableDataCell>María García</CTableDataCell>
                    <CTableDataCell>maria@example.com</CTableDataCell>
                    <CTableDataCell>Recepcionista</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="info" size="sm" className="me-2">
                            Editar
                        </CButton>
                    <CButton color="danger" size="sm">
                        Eliminar
                    </CButton>
                    </CTableDataCell>
                </CTableRow>
                <CTableRow>
                    <CTableDataCell>4</CTableDataCell>
                    <CTableDataCell>Juan Martínez</CTableDataCell>
                    <CTableDataCell>juan@example.com</CTableDataCell>
                    <CTableDataCell>Estilista</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="info" size="sm" className="me-2">
                            Editar
                        </CButton>
                        <CButton color="danger" size="sm">
                            Eliminar
                        </CButton>
                    </CTableDataCell>
                </CTableRow>
                <CTableRow>
                    <CTableDataCell>5</CTableDataCell>
                    <CTableDataCell>Lucía Fernández</CTableDataCell>
                    <CTableDataCell>lucia@example.com</CTableDataCell>
                    <CTableDataCell>Recepcionista</CTableDataCell>
                    <CTableDataCell>
                        <CButton color="info" size="sm" className="me-2">
                            Editar
                        </CButton>
                        <CButton color="danger" size="sm">
                            Eliminar
                        </CButton>
                    </CTableDataCell>
                </CTableRow>
            </CTableBody>
        </CTable>
        <CCardFooter>hola holaaa</CCardFooter>
    </CCardBody>
    </CCard>
);
};

export default Users;