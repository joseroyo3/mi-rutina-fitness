export class Routine {
  id: number;
  nombre: string;
  repeticiones: number;
  completado: boolean;
  imagen?: string;

  constructor(
    id: number,
    nombre: string,
    repeticiones: number,
    completado: boolean,
    imagen?: string
  ) {
    this.id = id;
    this.nombre = nombre;
    this.repeticiones = repeticiones;
    this.completado = completado;
    this.imagen = imagen;
  }
}
