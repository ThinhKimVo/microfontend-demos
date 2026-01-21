import { Component } from '@angular/core';

interface SettingItem {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-settings',
  template: `
    <div class="space-y-6">
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6">General Settings</h2>
        <div class="space-y-4">
          <div
            *ngFor="let setting of settings"
            class="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
          >
            <div>
              <h3 class="font-medium text-gray-900">{{ setting.label }}</h3>
              <p class="text-sm text-gray-500">{{ setting.description }}</p>
            </div>
            <button
              (click)="toggleSetting(setting)"
              [class]="
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors ' +
                (setting.enabled ? 'bg-blue-600' : 'bg-gray-200')
              "
            >
              <span
                [class]="
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform ' +
                  (setting.enabled ? 'translate-x-6' : 'translate-x-1')
                "
              ></span>
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-6">Profile Information</h2>
        <form class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Display Name</label
            >
            <input
              type="text"
              [(ngModel)]="profile.name"
              name="name"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Email</label
            >
            <input
              type="email"
              [(ngModel)]="profile.email"
              name="email"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Bio</label
            >
            <textarea
              [(ngModel)]="profile.bio"
              name="bio"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <button
            type="button"
            (click)="saveProfile()"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-xl font-semibold mb-4">Danger Zone</h2>
        <div class="p-4 border border-red-200 rounded-lg bg-red-50">
          <h3 class="font-medium text-red-800 mb-2">Delete Account</h3>
          <p class="text-sm text-red-600 mb-4">
            Once you delete your account, there is no going back.
          </p>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  settings: SettingItem[] = [
    {
      id: 'notifications',
      label: 'Email Notifications',
      description: 'Receive email notifications for important updates',
      enabled: true,
    },
    {
      id: 'darkMode',
      label: 'Dark Mode',
      description: 'Enable dark mode for the interface',
      enabled: false,
    },
    {
      id: 'twoFactor',
      label: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account',
      enabled: true,
    },
    {
      id: 'analytics',
      label: 'Usage Analytics',
      description: 'Help us improve by sharing anonymous usage data',
      enabled: false,
    },
  ];

  profile = {
    name: 'John Doe',
    email: 'john@example.com',
    bio: 'Software developer passionate about microfrontends.',
  };

  toggleSetting(setting: SettingItem) {
    setting.enabled = !setting.enabled;
  }

  saveProfile() {
    alert('Profile saved successfully!');
  }
}
