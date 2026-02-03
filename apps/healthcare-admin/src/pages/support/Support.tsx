import { useState } from 'react';
import {
  MessageSquare,
  Bell,
  Star,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import ContactMessages from './ContactMessages';
import PushNotifications from './PushNotifications';
import FeedbackManagement from './FeedbackManagement';

type Tab = 'messages' | 'push' | 'feedback';

const tabs = [
  { id: 'messages' as Tab, name: 'Contact Messages', icon: MessageSquare },
  { id: 'push' as Tab, name: 'Push Notifications', icon: Bell },
  { id: 'feedback' as Tab, name: 'Feedback', icon: Star },
];

export default function Support() {
  const [activeTab, setActiveTab] = useState<Tab>('messages');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support & Communication</h1>
        <p className="text-sm text-gray-500">Manage support tickets, notifications, and feedback</p>
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
        {activeTab === 'messages' && <ContactMessages />}
        {activeTab === 'push' && <PushNotifications />}
        {activeTab === 'feedback' && <FeedbackManagement />}
      </div>
    </div>
  );
}
