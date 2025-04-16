import axios from '@/config/axios'
import { Consultorio, Paciente, Turno, ConsultorioFromAPI, Tratamiento } from '@/interfaces/models'
import { Ref } from 'vue'
/**
 * Hook para manejar los servicios de la aplicación.
 */
export const useService = (
  pacientes: Ref<Paciente[]>,
  turnos: Ref<Turno[]>,
  consultorios: Ref<Consultorio[]>,
  isEdit: Ref<boolean>,
  nuevoTurno: Ref<Turno>,
  tratamientosDisponibles: Ref<Tratamiento[]>,
  tratamientoSeleccionado: Ref<{ duracion: number | null; costo: number | null }>,
) => {
  /**
   * Servicio para cargar los turnos del calendario.
   */
  const cargarTurnos = async () => {
    try {
      const response = await axios.get('/turnos/calendario')
      turnos.value = response.data
    } catch (error) {
      console.error('Error al cargar turnos:', error)
      throw error // Propaga el error para manejarlo en el componente si es necesario
    }
  }

  /**
   * Servicio para cargar la lista de pacientes.
   */
  const cargarPacientes = async () => {
    try {
      const response = await axios.get('/pacientes')
      pacientes.value = response.data
    } catch (error) {
      console.error('Error al cargar pacientes:', error)
      throw error
    }
  }

  /**
   * Servicio para obtener consultorios y tratamientos.
   * @returns {Promise<Array>} - Lista de consultorios con sus tratamientos asociados.
   */
  const fetchConsultoriosyTratamientos = async () => {
    try {
      const response = await axios.get<ConsultorioFromAPI[]>('/consultorios/tratamientos')
      consultorios.value = response.data
        .map((consultorio: ConsultorioFromAPI) => ({
          id_consultorio: consultorio.id_consultorio,
          nombre: consultorio.nombre_consultorio,
          tratamiento: consultorio.id_tratamiento
            ? [
                {
                  id_tratamiento: consultorio.id_tratamiento,
                  nombre: consultorio.nombre_tratamiento,
                  descripcion: consultorio.descripcion_tratamiento,
                  costo: consultorio.costo_tratamiento,
                  duracion: consultorio.duracion_tratamiento,
                  color: consultorio.color_tratamiento,
                },
              ]
            : [],
          displayText: `${consultorio.nombre_consultorio} - ${
            consultorio.id_tratamiento ? consultorio.nombre_tratamiento : 'Sin tratamiento'
          }`,
        }))
        .sort((a, b) => a.id_consultorio - b.id_consultorio)
    } catch (error) {
      console.error('Error fetching consultorios and tratamientos:', error)
    }
  }
  /**
   * Servicio para cargar tratamientos disponibles por consultorio.
   * @param {number} id_consultorio - ID del consultorio.
   * @returns {Promise<Array>} - Lista de tratamientos disponibles.
   */
  const cargarTratamientosPorConsultorio = async (id_consultorio: number) => {
    try {
      const response = await axios.get(`/tratamientos/tratamientosconsul/${id_consultorio}`)
      tratamientosDisponibles.value = response.data || []

      if (isEdit.value && nuevoTurno.value.id_tratamiento) {
        actualizarDetallesTratamiento(nuevoTurno.value.id_tratamiento)
      } else {
        nuevoTurno.value.id_tratamiento = null
        tratamientoSeleccionado.value = { duracion: null, costo: null }
      }
    } catch (error) {
      console.error('Error al cargar tratamientos:', error)
      tratamientosDisponibles.value = []
    }
  }
  const actualizarDetallesTratamiento = (id_tratamiento: number) => {
    const tratamiento = tratamientosDisponibles.value.find(
      (t) => t.id_tratamiento === id_tratamiento,
    )

    if (tratamiento) {
      tratamientoSeleccionado.value = {
        duracion: Number(tratamiento.duracion),
        costo: tratamiento.costo,
      }
    } else {
      tratamientoSeleccionado.value = { duracion: null, costo: null }
    }
  }

  // Retornamos un objeto con todos los servicios
  return {
    cargarTurnos,
    cargarPacientes,
    fetchConsultoriosyTratamientos,
    cargarTratamientosPorConsultorio,
  }
}
