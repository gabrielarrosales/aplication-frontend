import React from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'

const Login = () => {
  return (
    //div que contiene el login 
    <div className="min-vh-100 d-flex flex-row align-items-center"  style={{ backgroundColor: '#FFF0F5',bfontFamily: "'Arial', sans-serif"}}  >
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>

            {/* bloque derecho del login*/}
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <h2  style={{ color: '#FF6B98' }}>
                      Welcome back to AdminBeauty
                    </h2>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton   className="w-100 py-2" style={{ backgroundColor: '#FF6B98'}}>
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                          <CButton color="link" className="px-0" style={{color: '#A58AAE'}}>
                            Forgot password?
                          </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>

            {/*bloque izquierdo del login*/}
              <CCard style={{ background: 'linear-gradient(to bottom, #FF6B98 0%, #A58AAE 100%)', width: '44%' }}>
                <CCardBody  className="text-center d-flex flex-column justify-content-center">
                  <div>
                    <h2>Sign up</h2>
                    <p> 
                    Register now to manage appointments,clients, and more.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>

            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>

    
  )
}

export default Login
