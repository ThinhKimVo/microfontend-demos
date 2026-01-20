import 'zone.js';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, Component, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../app/settings/settings.component';
import '../styles.css';

@Component({
  selector: 'app-mount-root',
  template: '<app-settings></app-settings>',
})
class MountRootComponent {}

@NgModule({
  declarations: [MountRootComponent, SettingsComponent],
  imports: [BrowserModule, FormsModule],
  bootstrap: [MountRootComponent],
})
class MountModule {}

export default async function mount(
  el: HTMLElement
): Promise<{ destroy: () => void }> {
  const mountEl = document.createElement('app-mount-root');
  el.appendChild(mountEl);

  const platformRef = platformBrowserDynamic();
  const moduleRef = await platformRef.bootstrapModule(MountModule);
  const appRef = moduleRef.injector.get(ApplicationRef);

  return {
    destroy: () => {
      appRef.destroy();
      moduleRef.destroy();
      platformRef.destroy();
      el.innerHTML = '';
    },
  };
}
