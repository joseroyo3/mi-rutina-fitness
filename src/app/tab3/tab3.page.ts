import { Component } from '@angular/core';
import { Preferences } from '@capacitor/preferences'; // Para guardar y cargar configuración

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  nombreUsuario: string = '';
  temaOscuro: boolean = false;

  constructor() {}

  async ionViewWillEnter() {
    // Carga los datos guardados cuando se entra en la página
    const nombre = await Preferences.get({ key: 'nombreUsuario' });
    const tema = await Preferences.get({ key: 'temaOscuro' });

    if (nombre.value) {
      this.nombreUsuario = nombre.value;
    }

    if (tema.value) {
      this.temaOscuro = tema.value === 'true';
    }
  }

  async guardarConfiguracion() {
    // Guarda el nombre del usuario
    await Preferences.set({
      key: 'nombreUsuario',
      value: this.nombreUsuario,
    });

    // Guarda la preferencia de tema
    await Preferences.set({
      key: 'temaOscuro',
      value: this.temaOscuro.toString(),
    });

    console.log('Configuración guardada');
  }

  alternarTema(event: CustomEvent) {
    this.temaOscuro = event.detail.checked;
    this.guardarConfiguracion();
  }
}
