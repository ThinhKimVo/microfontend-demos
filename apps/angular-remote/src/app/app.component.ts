import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="max-w-4xl mx-auto">
        <header class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Angular Remote</h1>
          <p class="text-gray-600">Standalone mode - Running on port 3103</p>
        </header>
        <app-settings></app-settings>
      </div>
    </div>
  `,
})
export class AppComponent {}
