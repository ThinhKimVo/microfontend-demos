import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Phone } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+1 234-567-8900', role: 'USER', status: 'Active', joined: '2024-01-05' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234-567-8901', role: 'THERAPIST', status: 'Active', joined: '2024-01-04' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 234-567-8902', role: 'USER', status: 'Inactive', joined: '2024-01-03' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', phone: '+1 234-567-8903', role: 'USER', status: 'Active', joined: '2024-01-02' },
  { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', phone: '+1 234-567-8904', role: 'ADMIN', status: 'Active', joined: '2024-01-01' },
];

export default function UsersListBridge() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
        <p className="text-sm text-gray-500">Manage user accounts from Hopefull platform</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="input w-auto"
            >
              <option value="all">All Roles</option>
              <option value="USER">Users</option>
              <option value="THERAPIST">Therapists</option>
              <option value="ADMIN">Admins</option>
            </select>
            <button className="btn btn-primary flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700 font-medium">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" /> {user.email}
                    </span>
                    <span className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" /> {user.phone}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                    user.role === 'THERAPIST' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.joined}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {mockUsers.length} users
        </p>
        <div className="flex gap-2">
          <button className="btn bg-white border border-gray-300 hover:bg-gray-50">Previous</button>
          <button className="btn btn-primary">Next</button>
        </div>
      </div>
    </div>
  );
}
