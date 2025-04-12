import React from 'react'
import { 
    CButton,   // Botones
    CCard,     // Tarjetas (contenedores estilizados)
    CCardBody, // Cuerpo de la tarjeta
    CForm,     // Formularios
    CFormInput // Campos de entrada
} from '@coreui/react';

const PasswordReset = () => {
    return (
    <div>
        <h1>Restablecer Contraseña</h1>
        <form>
        <input type="email" placeholder="Tu correo" />
        <button type="submit">Enviar</button>
        </form>
    </div>
    )
}

export default PasswordReset;