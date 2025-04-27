// Importaciones necesarias de Angular, servicios personalizados y plugins de Capacitor
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Para la gestión de formularios reactivos y validaciones
import { RoutineService } from '../services/routine.service'; // Servicio personalizado para gestionar rutinas
import { Routine } from '../models/routine.model'; // Modelo de datos para las rutinas
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // API de cámara de Capacitor
import { Capacitor } from '@capacitor/core'; // Para obtener la plataforma en la que se ejecuta la app (web o móvil)

// Decorador que define el componente de Angular
@Component({
  selector: 'app-tab2', // Selector del componente para ser usado en las plantillas HTML
  templateUrl: 'tab2.page.html', // Ruta del archivo de plantilla HTML asociado
  styleUrls: ['tab2.page.scss'], // Ruta del archivo de estilos SCSS asociado
  standalone: false, // Indica que el componente no es independiente y requiere de un módulo
})
export class Tab2Page {
  routineForm: FormGroup; // Formulario reactivo para gestionar la rutina
  imagen: string | null = null; // Variable para almacenar la imagen seleccionada en formato base64

  // Constructor con inyección de dependencias
  constructor(
    private fb: FormBuilder, // Servicio para crear formularios reactivos
    private routineService: RoutineService // Servicio para gestionar las rutinas
  ) {
    // Inicialización del formulario reactivo con validadores
    this.routineForm = this.fb.group({
      nombre: ['', Validators.required], // Campo 'nombre' requerido
      repeticiones: ['', Validators.required], // Campo 'repeticiones' requerido
    });
  }

  /**
   * Método para seleccionar una imagen, diferenciando entre plataformas web y móvil.
   */
  async seleccionarImagen() {
    try {
      let image: any;
      // Comprobación de la plataforma
      if (Capacitor.getPlatform() === 'web') {
        // En plataforma web, se utiliza un input de tipo file
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*'; // Solo acepta archivos de imagen
        input.click(); // Simula un clic para abrir el selector de archivos
        input.onchange = () => {
          const file = input.files?.[0]; // Obtiene el primer archivo seleccionado
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              this.imagen = reader.result as string; // Convierte la imagen a base64
              console.log(
                'Imagen seleccionada desde la galería en web:',
                this.imagen
              );
            };
            reader.readAsDataURL(file); // Lee el archivo y lo convierte a base64
          }
        };
      } else {
        // En dispositivos móviles, se usa la API de cámara de Capacitor
        image = await Camera.getPhoto({
          quality: 90, // Calidad de la imagen
          allowEditing: false, // No permite edición de la imagen
          resultType: CameraResultType.DataUrl, // El resultado se obtiene en formato base64
          source: CameraSource.Prompt, // Muestra una opción para elegir entre cámara o galería
        });
        this.imagen = image.dataUrl || null; // Guarda la imagen en base64 o null si falla
        console.log('Imagen seleccionada en móvil:', this.imagen);
      }
    } catch (error) {
      // Muestra el error en consola si la selección de la imagen falla
      console.error('Error al seleccionar imagen:', error);
    }
  }

  /**
   * Método para agregar una nueva rutina utilizando los datos del formulario.
   */
  async agregarRoutine() {
    if (this.routineForm.valid) {
      // Crea un nuevo objeto de tipo Routine
      const nuevaRoutine: Routine = new Routine(
        Date.now(), // ID único usando la fecha actual en milisegundos
        this.routineForm.value.nombre, // Nombre del ejercicio
        Number(this.routineForm.value.repeticiones), // Número de repeticiones
        false, // Completado inicial en false
        this.imagen ?? undefined // GUARDAMOS IMAGEN
      );

      // Llama al servicio para agregar la nueva rutina
      await this.routineService.addRoutine(nuevaRoutine);
      console.log('Rutina agregada:', nuevaRoutine);

      // Reinicia el formulario y borra la imagen seleccionada
      this.routineForm.reset();
      this.imagen = null;
    }
  }
}
