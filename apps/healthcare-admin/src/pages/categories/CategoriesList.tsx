import { useState, useRef } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Search,
  Eye,
  EyeOff,
  Users,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import CategoryFormModal from './CategoryFormModal';
import DeleteCategoryModal from './DeleteCategoryModal';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
  therapistCount: number;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Mock categories
const initialCategories: Category[] = [
  {
    id: 'CAT-001',
    name: 'Anxiety & Depression',
    description: 'Treatment for anxiety disorders, depression, and mood-related conditions',
    icon: '🧠',
    status: 'active',
    therapistCount: 45,
    displayOrder: 1,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
  },
  {
    id: 'CAT-002',
    name: 'Couples Therapy',
    description: 'Relationship counseling and marriage therapy',
    icon: '💑',
    status: 'active',
    therapistCount: 32,
    displayOrder: 2,
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-01-08T09:15:00Z',
  },
  {
    id: 'CAT-003',
    name: 'Family Therapy',
    description: 'Family counseling and parenting support',
    icon: '👨‍👩‍👧‍👦',
    status: 'active',
    therapistCount: 28,
    displayOrder: 3,
    createdAt: '2023-02-01T10:00:00Z',
    updatedAt: '2024-01-05T11:20:00Z',
  },
  {
    id: 'CAT-004',
    name: 'Trauma & PTSD',
    description: 'Specialized treatment for trauma survivors and PTSD',
    icon: '🛡️',
    status: 'active',
    therapistCount: 22,
    displayOrder: 4,
    createdAt: '2023-02-15T10:00:00Z',
    updatedAt: '2024-01-02T16:45:00Z',
  },
  {
    id: 'CAT-005',
    name: 'Addiction & Recovery',
    description: 'Support for substance abuse and behavioral addictions',
    icon: '🔄',
    status: 'active',
    therapistCount: 18,
    displayOrder: 5,
    createdAt: '2023-03-01T10:00:00Z',
    updatedAt: '2023-12-28T10:00:00Z',
  },
  {
    id: 'CAT-006',
    name: 'Child & Adolescent',
    description: 'Mental health support for children and teenagers',
    icon: '👶',
    status: 'active',
    therapistCount: 35,
    displayOrder: 6,
    createdAt: '2023-03-15T10:00:00Z',
    updatedAt: '2023-12-20T14:30:00Z',
  },
  {
    id: 'CAT-007',
    name: 'Grief & Loss',
    description: 'Bereavement counseling and grief support',
    icon: '🕯️',
    status: 'active',
    therapistCount: 15,
    displayOrder: 7,
    createdAt: '2023-04-01T10:00:00Z',
    updatedAt: '2023-12-15T09:00:00Z',
  },
  {
    id: 'CAT-008',
    name: 'Career Counseling',
    description: 'Professional development and workplace stress management',
    icon: '💼',
    status: 'inactive',
    therapistCount: 8,
    displayOrder: 8,
    createdAt: '2023-04-15T10:00:00Z',
    updatedAt: '2023-11-01T10:00:00Z',
  },
];

export default function CategoriesList() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [search, setSearch] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter categories
  const filteredCategories = categories
    .filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.description.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      const newCategories = [...categories];
      const [draggedItem] = newCategories.splice(draggedIndex, 1);
      newCategories.splice(dragOverIndex, 0, draggedItem);

      // Update display order
      const reordered = newCategories.map((cat, index) => ({
        ...cat,
        displayOrder: index + 1,
      }));

      setCategories(reordered);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setIsEditing(false);
    setShowFormModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setIsEditing(true);
    setShowFormModal(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleSaveCategory = (data: Partial<Category>) => {
    if (isEditing && selectedCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, ...data, updatedAt: new Date().toISOString() }
            : cat
        )
      );
    } else {
      const newCategory: Category = {
        id: `CAT-${String(categories.length + 1).padStart(3, '0')}`,
        name: data.name || '',
        description: data.description || '',
        icon: data.icon || '📁',
        status: data.status || 'active',
        therapistCount: 0,
        displayOrder: categories.length + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCategories((prev) => [...prev, newCategory]);
    }
    setShowFormModal(false);
    setSelectedCategory(null);
  };

  const handleConfirmDelete = (type: 'soft' | 'hard') => {
    if (!selectedCategory) return;

    if (type === 'hard') {
      setCategories((prev) => prev.filter((cat) => cat.id !== selectedCategory.id));
    } else {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id
            ? { ...cat, status: 'inactive' as const, updatedAt: new Date().toISOString() }
            : cat
        )
      );
    }
    setShowDeleteModal(false);
    setSelectedCategory(null);
  };

  const handleToggleStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? { ...cat, status: cat.status === 'active' ? 'inactive' : 'active', updatedAt: new Date().toISOString() }
          : cat
      )
    );
  };

  const activeCount = categories.filter((c) => c.status === 'active').length;
  const totalTherapists = categories.reduce((sum, c) => sum + c.therapistCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">
            {categories.length} categories • {activeCount} active • {totalTherapists} therapists
          </p>
        </div>
        <button onClick={handleAddCategory} className="btn btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </button>
      </div>

      {/* Search */}
      <div className="card p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            className="input pl-10 w-full max-w-md"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <GripVertical className="h-5 w-5 text-blue-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Drag to reorder</p>
          <p className="text-sm text-blue-700">
            Drag categories using the grip handle to change their display order in the app.
          </p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3"></th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Therapists</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCategories.map((category, index) => (
              <tr
                key={category.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={cn(
                  'hover:bg-gray-50 transition-colors',
                  draggedIndex === index && 'opacity-50',
                  dragOverIndex === index && 'bg-primary-50'
                )}
              >
                <td className="px-4 py-4">
                  <button className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                    <GripVertical className="h-5 w-5" />
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm font-mono text-gray-500">{category.id}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm text-gray-500 max-w-xs truncate">{category.description}</p>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    {category.therapistCount}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleToggleStatus(category.id)}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full transition-colors',
                      category.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    {category.status === 'active' ? (
                      <>
                        <Eye className="h-3 w-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Inactive
                      </>
                    )}
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">#{category.displayOrder}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategories.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFormModal && (
        <CategoryFormModal
          category={selectedCategory}
          isEditing={isEditing}
          existingNames={categories.filter((c) => c.id !== selectedCategory?.id).map((c) => c.name)}
          onClose={() => {
            setShowFormModal(false);
            setSelectedCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}

      {showDeleteModal && selectedCategory && (
        <DeleteCategoryModal
          category={selectedCategory}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
