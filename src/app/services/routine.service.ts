// Importaciones necesarias
import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Routine } from '../models/routine.model';

// Decorador @Injectable para indicar que esta clase se puede inyectar como dependencia
@Injectable({
  providedIn: 'root', // El servicio estará disponible de forma global en toda la aplicación
})
export class RoutineService {
  // Lista privada que almacena las rutinas en memoria
  private routines: Routine[] = [];

  // Constructor que carga las rutinas desde el almacenamiento al inicializar el servicio
  constructor() {
    this.cargarRoutines();
  }

  /**
   * Agrega una nueva rutina a la lista y la guarda en el almacenamiento
   * @param routine - La rutina a agregar
   */
  async addRoutine(routine: Routine) {
    this.routines.push(routine); // Añade la rutina a la lista
    await this.guardarRoutines(); // Guarda las rutinas actualizadas en el almacenamiento
  }

  /**
   * Marca una rutina como completada o no completada y guarda el cambio
   * @param index - Índice de la rutina en la lista
   */
  async marcarRoutine(index: number) {
    this.routines[index].completado = !this.routines[index].completado; // Cambia el estado de completado
    await this.guardarRoutines(); // Guarda los cambios
  }

  /**
   * Obtiene la lista de rutinas, cargándolas del almacenamiento si es necesario
   * @returns Lista de rutinas
   */
  async obtenerRoutines(): Promise<Routine[]> {
    if (this.routines.length === 0) {
      await this.cargarRoutines(); // Carga las rutinas si la lista está vacía
    }
    return this.routines;
  }

  /**
   * Elimina una rutina por su índice y actualiza el almacenamiento
   * @param index - Índice de la rutina a eliminar
   */
  async eliminarRoutine(index: number) {
    this.routines.splice(index, 1); // Elimina la rutina del array
    await this.guardarRoutines(); // Guarda la lista actualizada
  }

  /**
   * Guarda la lista actual de rutinas en el almacenamiento
   */
  private async guardarRoutines() {
    try {
      await Preferences.set({
        key: 'routines',
        value: JSON.stringify(this.routines), // Convierte la lista a JSON para almacenamiento
      });
      console.log('Rutinas guardadas:', this.routines);
    } catch (error) {
      console.error('Error guardando rutinas:', error); // Captura y muestra errores en caso de fallos
    }
  }

  /**
   * Carga las rutinas almacenadas en el dispositivo
   */
  async cargarRoutines() {
    try {
      const { value } = await Preferences.get({ key: 'routines' }); // Obtiene los datos almacenados
      console.log('Datos crudos de Preferences:', value); // Muestra los datos crudos para depuración
      if (value) {
        this.routines = JSON.parse(value) as Routine[]; // Parsea los datos JSON almacenados
        console.log('Rutinas cargadas:', this.routines);
      }
    } catch (error) {
      console.error('Error cargando rutinas:', error); // Captura errores en la carga
    }
  }
}
