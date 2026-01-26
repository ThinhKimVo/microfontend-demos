import React from 'react';
import { AppInfo } from '../../data/apps';

interface AppsTableProps {
  apps: AppInfo[];
  onEdit: (app: AppInfo) => void;
  onDelete: (id: string) => void;
}

export const AppsTable: React.FC<AppsTableProps> = ({ apps, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">App</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Path</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Port</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Framework</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {apps.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white font-bold`}>
                    {app.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{app.name}</div>
                    <div className="text-sm text-gray-500">{app.description}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600 font-mono">{app.path}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{app.port}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {app.framework}
                </span>
              </td>
              <td className="px-6 py-4">
                {app.integrated ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                    Deployed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                    Not Deployed
                  </span>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onEdit(app)}
                  className="text-blue-600 hover:text-blue-800 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(app.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
