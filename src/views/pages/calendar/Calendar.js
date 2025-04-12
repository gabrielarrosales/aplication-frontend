import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CCard, CCardBody, CCardHeader, CForm, CButton, CCol, CRow, CFormInput, CFormLabel } from '@coreui/react';

const localizer = momentLocalizer(moment);

const Calendar = () => {
  const [appointments, setAppointments] = useState([]); // Estado para las citas al llenar el formulario , la info se guarda aqui 
  const [newAppointment, setNewAppointment] = useState({  //arreglo para guardar las citas 
    title: '',
    start: '',
    end: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      title: newAppointment.title,
      start: new Date(newAppointment.start), 
      end: new Date(newAppointment.end),     
    };
    setAppointments([...appointments, newEvent]);
    setNewAppointment({ title: '', start: '', end: '' }); //limpia el el arreglo de citas al enviar el formulario
  };

  return (
    <>
      <CCard>
        <CCardHeader>Appointment Form</CCardHeader>
        <CCardBody>
          <CForm onSubmit={handleSubmit}> {/* Formulario para agregar citas y on submit indica que al presionar un boton de ese tipo guarde el formulario */}
            <CRow className="mb-3">
              <CCol md="12">
                <CFormLabel>Quote Title</CFormLabel>
                <CFormInput
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) => setNewAppointment({ ...newAppointment, title: e.target.value })}
                  required
                />
              </CCol>
            </CRow>
            <CRow className="mb-3">
              <CCol md="6">
                <CFormLabel>Start Date</CFormLabel>
                <CFormInput
                  type="datetime-local"
                  value={newAppointment.start}
                  onChange={(e) => setNewAppointment({ ...newAppointment, start: e.target.value })}
                  required
                />
              </CCol>
              <CCol md="6">
                <CFormLabel>Completion Date</CFormLabel>
                <CFormInput
                  type="datetime-local"
                  value={newAppointment.end}
                  onChange={(e) => setNewAppointment({ ...newAppointment, end: e.target.value })}
                  required
                />
              </CCol>
            </CRow>
            <CButton type="submit" color="primary">Add Appointment</CButton>
          </CForm>
        </CCardBody>
      </CCard>


      <CCard className="mt-4">
        <CCardHeader>Appointment Calendar</CCardHeader> 
        <CCardBody>
          <BigCalendar
            localizer={localizer}
            events={appointments}
            startAccessor="start"  //indica las fechas ... events es el arreglo de citas
            endAccessor="end"
            style={{backgroundColor: '#f8f9fa', height: 500, margin: '20px' }}
            eventPropGetter={() => {
              return { style: { backgroundColor:'#e296ad ', color: 'black', borderRadius: '5px', padding: '5px' } };
            }}
          />
        </CCardBody>
      </CCard>
    </>
  );
};

export default Calendar;