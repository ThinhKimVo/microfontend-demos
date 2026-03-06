import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/admin';

interface CategoryForm { name: string; description: string; icon: string; isActive: boolean }
const DEFAULT_FORM: CategoryForm = { name: '', description: '', icon: '🧠', isActive: true };

export default function CategoriesList() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<{ visible: boolean; editId: string | null; form: CategoryForm }>({
    visible: false, editId: null, form: DEFAULT_FORM,
  });

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { mutate: create, isPending: isCreating } = useMutation({
    mutationFn: (data: Omit<CategoryForm, 'isActive'>) => createCategory(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal(); },
  });

  const { mutate: update, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CategoryForm> }) => updateCategory(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['categories'] }); closeModal(); },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['categories'] }),
    onError: (e: any) => alert(e?.response?.data?.message || 'Cannot delete this category'),
  });

  const closeModal = () => setModal({ visible: false, editId: null, form: DEFAULT_FORM });

  const handleSave = () => {
    if (!modal.form.name.trim()) { alert('Name is required'); return; }
    if (modal.editId) {
      update({ id: modal.editId, data: modal.form });
    } else {
      create({ name: modal.form.name, description: modal.form.description, icon: modal.form.icon });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500">Manage therapy specializations</p>
        </div>
        <button
          onClick={() => setModal({ visible: true, editId: null, form: DEFAULT_FORM })}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />Add Category
        </button>
      </div>

      {isLoading ? (
        <div className="card p-8 text-center text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(categories as any[]).map((cat) => (
            <div key={cat.id} className="card p-5 flex items-start gap-4">
              <span className="text-3xl">{cat.icon || '🧠'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900">{cat.name}</h3>
                  {!cat.isActive && (
                    <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">Inactive</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 truncate">{cat.description || 'No description'}</p>
                <p className="text-xs text-gray-400 mt-1">{cat._count?.therapists ?? 0} therapists</p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setModal({
                    visible: true,
                    editId: cat.id,
                    form: { name: cat.name, description: cat.description || '', icon: cat.icon || '🧠', isActive: cat.isActive },
                  })}
                  className="p-1.5 text-gray-400 hover:text-primary-600 rounded"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => { if (confirm(`Delete "${cat.name}"?`)) remove(cat.id); }}
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal.visible && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl p-6 w-full sm:max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{modal.editId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={closeModal}><X className="h-5 w-5 text-gray-400" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                <input
                  className="input text-center text-2xl"
                  maxLength={2}
                  value={modal.form.icon}
                  onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, icon: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  className="input w-full"
                  placeholder="Category name"
                  value={modal.form.name}
                  onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, name: e.target.value } }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="input w-full min-h-[72px]"
                  placeholder="Brief description..."
                  value={modal.form.description}
                  onChange={(e) => setModal((m) => ({ ...m, form: { ...m.form, description: e.target.value } }))}
                />
              </div>
              {modal.editId && (
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Active</label>
                  <button
                    onClick={() => setModal((m) => ({ ...m, form: { ...m.form, isActive: !m.form.isActive } }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${modal.form.isActive ? 'bg-primary-600' : 'bg-gray-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${modal.form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}
            </div>

            <button
              className="btn btn-primary w-full mt-6 py-3 disabled:opacity-60"
              onClick={handleSave}
              disabled={isCreating || isUpdating}
            >
              {modal.editId ? 'Save Changes' : 'Create Category'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
