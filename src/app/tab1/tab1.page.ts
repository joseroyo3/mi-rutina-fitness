import { Component } from '@angular/core';

import { RoutineService } from '../services/routine.service';
import { Routine } from '../models/routine.model';
import { LoadingController } from '@ionic/angular'; //circulito de load

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {
  routines: Routine[] = [];
  constructor(
    private routineService: RoutineService,
    private loadingCtrl: LoadingController
  ) {}

  async ionViewWillEnter() {
    console.log('Refrescando Tab 1...'); // Mensaje en consola para seguimiento

    // Crea un indicador de carga (loading)
    const loading = await this.loadingCtrl.create({
      message: 'Cargando hábitos...', // Mensaje que se muestra durante la carga
      spinner: 'crescent', // Estilo del spinner (círculo giratorio)
    });

    await loading.present(); // Muestra el loading en pantalla

    this.routines = await this.routineService.obtenerRoutines();
    // Obtiene los hábitos del servicio y actualiza la lista
    console.log('Hábitos actualizados:', this.routines); // Muestra los datos obtenidos en consola

    await loading.dismiss(); // Oculta el indicador de carga una vez que los datos se han cargado
  }

  /**
   * Hook del ciclo de vida de Angular que se ejecuta una sola vez cuando
   * se inicializa el componente.
   * Ideal para cargar datos la primera vez que se muestra la página.
   */
  async ngOnInit() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando rutinas...', // Mensaje del indicador de carga
      spinner: 'crescent', // Estilo del spinner
      duration: 2000, // Duración máxima del indicador de carga (en milisegundos)
    });

    await loading.present(); // Muestra el indicador de carga

    this.routines = await this.routineService.obtenerRoutines();
    // Obtiene las rutinas al iniciar el componente
    console.log('Rutinas actualizadas:', this.routines); // Muestra los datos obtenidos en consola

    await loading.dismiss(); // Oculta el indicador de carga
  }

  /**
   * Elimina una rutina según su nombre y actualiza la lista de rutinas.
   * @param nombre - Nombre de la rutina a eliminar
   */
  async eliminarRoutine(id: number) {
    await this.routineService.eliminarRoutine(id); // Llama al servicio para eliminar la rutina
    this.routines = await this.routineService.obtenerRoutines();
    // Actualiza la lista después de eliminar la rutina
  }

  /**
   * Marca o desmarca una rutina como completada y actualiza su estado en
   * el almacenamiento.
   * @param nombre - Nombre de la rutina a actualizar
   */
  async marcarCompletado(id: number) {
    await this.routineService.marcarRoutine(id);
    // Cambia el estado de completado de la rutina
  }
}
