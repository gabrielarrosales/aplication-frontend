import React, { useState, useEffect } from 'react'
import {
  CModal, CModalHeader, CModalTitle, CModalBody, CButton, CForm, CFormInput, CFormSelect, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CCard, CCardBody
} from '@coreui/react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { BASE_URL } from '../../../../config'// Importa la variable global

const API_URL = `${BASE_URL}/reservations`

const HOURS = [
  '09:00', '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00'
]

export default function ReservationsTable() {
  const [reservations, setReservations] = useState([])
  const [users, setUsers] = useState([])
  const [services, setServices] = useState([])
  const [employees, setEmployees] = useState([])
  const [modal, setModal] = useState({ visible: false, editing: false, reservation: null })
  const [formData, setFormData] = useState(getEmptyForm())
  const [deleteModal, setDeleteModal] = useState({ visible: false, reservation: null })
  const [pdfRange, setPdfRange] = useState({ from: '', to: '' })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchData(API_URL, setReservations)
    fetchData(`${BASE_URL}/users`, setUsers)
    fetchData(`${BASE_URL}/services`, setServices)
    fetchData(`${BASE_URL}/employees`, setEmployees)
    // eslint-disable-next-line
  }, [token])

  function fetchData(url, setter) {
    fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setter(Array.isArray(data) ? data : []))
  }

  const getUserName = id => {
    const u = users.find(u => u.iduser === Number(id))
    return u ? `${u.firstname} ${u.lastname}` : 'Sin usuario'
  }
  const getServiceName = id => {
    const s = services.find(s => s.idservice === Number(id))
    return s ? s.servicename : 'Sin servicio'
  }
  const getEmployeeName = id => {
    const e = employees.find(e => e.idemployee === Number(id))
    return e ? `${e.firstname} ${e.lastname}` : 'Sin empleado'
  }

  function getEmptyForm(date = '', hour = '') {
    return {
      iduser: '',
      idservice: '',
      date,
      hour,
      id_employee: '',
      status: 'pendiente',
    }
  }

  function isEmployeeBusy(id_employee, date, hour, ignoreId = null) {
    const normalizeDate = d => {
      if (!d) return ''
      if (typeof d === 'string' && d.length >= 10) return d.slice(0,10)
      const dt = new Date(d)
      if (isNaN(dt)) return ''
      return dt.toISOString().slice(0,10)
    }
    const normalizeHour = h => {
      if (!h) return ''
      if (/^\d{2}:\d{2}$/.test(h)) return h
      if (/^\d{2}:\d{2}:\d{2}$/.test(h)) return h.slice(0,5)
      return h
    }
    const dateNorm = normalizeDate(date)
    const hourNorm = normalizeHour(hour)
    return reservations.some(r =>
      r.id_employee === Number(id_employee) &&
      normalizeDate(r.date) === dateNorm &&
      normalizeHour(r.hour) === hourNorm &&
      r.idreservation !== ignoreId
    )
  }

  function formatDateYMD(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d)) return dateStr
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  function getFilteredReservations() {
    if (!pdfRange.from && !pdfRange.to) return reservations
    return reservations.filter(r => {
      const date = r.date ? r.date.slice(0, 10) : ''
      return (!pdfRange.from || date >= pdfRange.from) &&
             (!pdfRange.to || date <= pdfRange.to)
    })
  }

  function handleGeneratePDF() {
    const filtered = getFilteredReservations()
    if (filtered.length === 0) {
      alert('No hay reservas en el rango seleccionado.')
      return
    }
    const doc = new jsPDF()
    doc.text('Reporte de Reservas', 14, 15)
    autoTable(doc, {
      startY: 25,
      head: [[
        'Cliente', 'Servicio', 'Empleado', 'Fecha', 'Hora', 'Estado'
      ]],
      body: filtered.map(r => [
        getUserName(r.iduser),
        getServiceName(r.idservice),
        getEmployeeName(r.id_employee),
        formatDateYMD(r.date),
        r.hour ? r.hour.slice(0,5) : '',
        r.status.charAt(0).toUpperCase() + r.status.slice(1)
      ]),
      styles: { fontSize: 10 }
    })
    doc.save('reservas.pdf')
  }

  function openNewModal() {
    setFormData(getEmptyForm())
    setModal({ visible: true, editing: false, reservation: null })
  }

  function openEditModal(reservation) {
    setFormData({
      iduser: reservation.iduser || '',
      idservice: reservation.idservice || '',
      date: reservation.date ? reservation.date.slice(0,10) : '',
      hour: reservation.hour ? reservation.hour.slice(0,5) : '',
      id_employee: reservation.id_employee || '',
      status: reservation.status || 'pendiente',
    })
    setModal({ visible: true, editing: true, reservation })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const today = new Date()
    const selected = new Date(formData.date)
    if (selected.setHours(0,0,0,0) < today.setHours(0,0,0,0)) {
      alert('No puedes agendar en fechas pasadas')
      return
    }
    let hour = formData.hour
    if (hour && hour.length === 5) hour = hour + ':00'
    if (isEmployeeBusy(formData.id_employee, formData.date, hour, modal.editing ? modal.reservation.idreservation : null)) {
      alert('El empleado ya tiene una reserva en esa fecha y hora')
      return
    }
    const dataToSend = {
      ...formData,
      iduser: Number(formData.iduser),
      idservice: Number(formData.idservice),
      id_employee: Number(formData.id_employee),
      hour,
    }
    if (modal.editing) {
      fetch(`${API_URL}/${modal.reservation.idreservation}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSend),
      })
        .then(async res => {
          if (!res.ok) throw new Error(await res.text())
          return res.json()
        })
        .then(data => {
          setReservations(reservations.map(r => r.idreservation === data.idreservation ? data : r))
          closeModal()
        })
        .catch(err => alert('Error del backend: ' + err.message))
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(dataToSend),
      })
        .then(async res => {
          if (!res.ok) throw new Error(await res.text())
          return res.json()
        })
        .then(data => {
          setReservations([...reservations, data])
          closeModal()
        })
        .catch(err => alert('Error del backend: ' + err.message))
    }
  }

  function handleDelete() {
    if (!deleteModal.reservation) return
    fetch(`${API_URL}/${deleteModal.reservation.idreservation}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(() => {
        setReservations(reservations.filter(r => r.idreservation !== deleteModal.reservation.idreservation))
        setDeleteModal({ visible: false, reservation: null })
        closeModal()
      })
  }

  function closeModal() {
    setModal({ visible: false, editing: false, reservation: null })
    setFormData(getEmptyForm())
  }

  function DeleteConfirmationModal() {
    return (
      <CModal visible={deleteModal.visible} onClose={() => setDeleteModal({ visible: false, reservation: null })}>
        <CModalHeader>
          <CModalTitle>Confirmar eliminación</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p>¿Estás seguro de que deseas eliminar esta reserva?</p>
          <div className="text-end">
            <CButton color="secondary" className="me-2" onClick={() => setDeleteModal({ visible: false, reservation: null })}>
              Cancelar
            </CButton>
            <CButton color="danger" onClick={handleDelete}>
              Eliminar
            </CButton>
          </div>
        </CModalBody>
      </CModal>
    )
  }

  function ReservationModal() {
    return (
      <CModal visible={modal.visible} onClose={closeModal} alignment="center" size="lg" backdrop="static">
        <CModalHeader className="bg-primary text-white">
          <CModalTitle>{modal.editing ? 'Editar Reserva' : 'Nueva Reserva'}</CModalTitle>
        </CModalHeader>
        <CModalBody style={{ background: '#f8f9fa' }}>
          <CForm onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <CFormSelect
                  label="Cliente"
                  value={formData.iduser}
                  onChange={e => setFormData({ ...formData, iduser: e.target.value })}
                  required
                  disabled={modal.editing}
                >
                  <option value="">Selecciona un cliente</option>
                  {users.map(u => (
                    <option key={u.iduser} value={u.iduser}>{u.firstname} {u.lastname}</option>
                  ))}
                </CFormSelect>
              </div>
              <div className="col-md-6">
                <CFormSelect
                  label="Servicio"
                  value={formData.idservice}
                  onChange={e => setFormData({ ...formData, idservice: e.target.value })}
                  required
                  disabled={modal.editing}
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map(s => (
                    <option key={s.idservice} value={s.idservice}>{s.servicename}</option>
                  ))}
                </CFormSelect>
              </div>
              <div className="col-md-6">
                <CFormInput
                  type="date"
                  label="Fecha"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  disabled={modal.editing}
                />
              </div>
              <div className="col-md-6">
                <CFormSelect
                  label="Hora"
                  value={formData.hour}
                  onChange={e => setFormData({ ...formData, hour: e.target.value })}
                  required
                >
                  <option value="">Selecciona una hora</option>
                  {HOURS.map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </CFormSelect>
              </div>
              <div className="col-md-6">
                <CFormSelect
                  label="Empleado"
                  value={formData.id_employee}
                  onChange={e => setFormData({ ...formData, id_employee: e.target.value })}
                  required
                  disabled={modal.editing}
                >
                  <option value="">Selecciona un empleado</option>
                  {employees.map(emp => (
                    <option key={emp.idemployee} value={emp.idemployee}>{emp.firstname} {emp.lastname}</option>
                  ))}
                </CFormSelect>
              </div>
              <div className="col-md-6">
                <CFormSelect
                  label="Estado"
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </CFormSelect>
              </div>
            </div>
            <div className="text-end mt-4">
              {modal.editing && (
                <CButton color="danger" className="me-2" onClick={() => setDeleteModal({ visible: true, reservation: modal.reservation })}>
                  Eliminar
                </CButton>
              )}
              <CButton color="secondary" className="me-2" onClick={closeModal}>
                Cancelar
              </CButton>
              <CButton color="primary" type="submit">
                {modal.editing ? 'Guardar Cambios' : 'Crear Reserva'}
              </CButton>
            </div>
          </CForm>
        </CModalBody>
      </CModal>
    )
  }

  // Diseño moderno y elegante con cabecera dentro de la carta
  return (
    <div className="container py-4">
      <CCard className="mb-4 shadow border-0" style={{ borderRadius: 18 }}>
        <div
          className="d-flex justify-content-between align-items-center px-4 py-3"
          style={{
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            background: '#fff',
            borderBottom: '1px solid #f0f1f3'
          }}
        >
          <h3 className="mb-0 fw-bold" style={{ color: 'var(--cui-primary)' }}>Reservas</h3>
          <CButton color="primary" onClick={openNewModal}>
            <i className="bi bi-plus-lg me-2"></i>Nueva Reserva
          </CButton>
        </div>
        <CCardBody>
          <div className="d-flex align-items-end gap-2 mb-4 flex-wrap">
            <div>
              <label className="form-label mb-0 fw-semibold">Desde</label>
              <input
                type="date"
                className="form-control"
                value={pdfRange.from}
                onChange={e => setPdfRange({ ...pdfRange, from: e.target.value })}
                max={pdfRange.to || undefined}
              />
            </div>
            <div>
              <label className="form-label mb-0 fw-semibold">Hasta</label>
              <input
                type="date"
                className="form-control"
                value={pdfRange.to}
                onChange={e => setPdfRange({ ...pdfRange, to: e.target.value })}
                min={pdfRange.from || undefined}
              />
            </div>
            <CButton color="success" className="ms-2" onClick={handleGeneratePDF}>
              <i className="bi bi-file-earmark-pdf me-2"></i>Generar PDF
            </CButton>
          </div>
          <CTable hover responsive bordered align="middle" className="shadow-sm" style={{ borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell>Cliente</CTableHeaderCell>
                <CTableHeaderCell>Servicio</CTableHeaderCell>
                <CTableHeaderCell>Empleado</CTableHeaderCell>
                <CTableHeaderCell>Fecha</CTableHeaderCell>
                <CTableHeaderCell>Hora</CTableHeaderCell>
                <CTableHeaderCell>Estado</CTableHeaderCell>
                <CTableHeaderCell>Acciones</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {reservations.length === 0 && (
                <CTableRow>
                  <CTableDataCell colSpan={7} className="text-center text-muted">
                    No hay reservas registradas.
                  </CTableDataCell>
                </CTableRow>
              )}
              {reservations.map(r => (
                <CTableRow key={r.idreservation}>
                  <CTableDataCell>{getUserName(r.iduser)}</CTableDataCell>
                  <CTableDataCell>{getServiceName(r.idservice)}</CTableDataCell>
                  <CTableDataCell>{getEmployeeName(r.id_employee)}</CTableDataCell>
                  <CTableDataCell>{formatDateYMD(r.date)}</CTableDataCell>
                  <CTableDataCell>{r.hour ? r.hour.slice(0,5) : ''}</CTableDataCell>
                  <CTableDataCell>
                    <span className={
                      r.status === 'pendiente' ? 'badge bg-warning text-dark' :
                      r.status === 'completada' ? 'badge bg-success' :
                      'badge bg-danger'
                    }>
                      {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
                    </span>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton size="sm" color="info" className="me-2" variant="outline" onClick={() => openEditModal(r)}>
                      <i className="bi bi-pencil-square"></i> Editar
                    </CButton>
                    <CButton size="sm" color="danger" variant="outline" onClick={() => setDeleteModal({ visible: true, reservation: r })}>
                      <i className="bi bi-trash"></i> Eliminar
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
          <ReservationModal />
          <DeleteConfirmationModal />
        </CCardBody>
      </CCard>
    </div>
  )
}