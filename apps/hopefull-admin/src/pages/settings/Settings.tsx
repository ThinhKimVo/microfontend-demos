import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  Mail,
  FileText,
  Bell,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CommonSettings from './CommonSettings';
import EmailTemplates from './EmailTemplates';
import ContentManagement from './ContentManagement';
import NotificationSettings from './NotificationSettings';

type Tab = 'common' | 'email' | 'content' | 'notifications';

const tabs = [
  { id: 'common' as Tab, name: 'Common Settings', icon: Building },
  { id: 'email' as Tab, name: 'Email Templates', icon: Mail },
  { id: 'content' as Tab, name: 'Content Management', icon: FileText },
  { id: 'notifications' as Tab, name: 'Notifications', icon: Bell },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('common');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings & Configuration</h1>
        <p className="text-sm text-gray-500">Manage app settings, templates, and configurations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'common' && <CommonSettings />}
        {activeTab === 'email' && <EmailTemplates />}
        {activeTab === 'content' && <ContentManagement />}
        {activeTab === 'notifications' && <NotificationSettings />}
      </div>
    </div>
  );
}
