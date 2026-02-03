import { useState } from 'react';
import {
  X,
  AlertTriangle,
  Trash2,
  EyeOff,
  Users,
  Ban,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Category } from './CategoriesList';

interface DeleteCategoryModalProps {
  category: Category;
  onClose: () => void;
  onConfirm: (type: 'soft' | 'hard') => void;
}

// Mock therapists using the category
const getMockTherapists = (count: number) => {
  const names = [
    'Dr. Sarah Smith',
    'Dr. Michael Brown',
    'Dr. Emily Chen',
    'Dr. James Wilson',
    'Dr. Lisa Johnson',
    'Dr. David Lee',
    'Dr. Jennifer Garcia',
    'Dr. Robert Miller',
  ];
  return names.slice(0, Math.min(count, names.length)).map((name, i) => ({
    id: `THP-${String(i + 1).padStart(3, '0')}`,
    name,
  }));
};

export default function DeleteCategoryModal({
  category,
  onClose,
  onConfirm,
}: DeleteCategoryModalProps) {
  const [deleteType, setDeleteType] = useState<'soft' | 'hard' | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hasTherapists = category.therapistCount > 0;
  const canHardDelete = !hasTherapists;
  const therapists = getMockTherapists(category.therapistCount);

  const handleConfirm = async () => {
    if (!deleteType) return;
    if (deleteType === 'hard' && confirmText !== category.name) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onConfirm(deleteType);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-full">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Delete Category</h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Category Info */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <span className="text-3xl">{category.icon}</span>
            <div>
              <p className="font-medium text-gray-900">{category.name}</p>
              <p className="text-sm text-gray-500">{category.id}</p>
            </div>
          </div>

          {/* Therapists Warning */}
          {hasTherapists && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    {category.therapistCount} therapists are using this category
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    You cannot permanently delete this category while therapists are assigned to it.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-yellow-600" />
                    <div className="text-sm text-yellow-700">
                      {therapists.slice(0, 3).map((t) => t.name).join(', ')}
                      {category.therapistCount > 3 && ` +${category.therapistCount - 3} more`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Delete Options */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Choose delete option:</p>

            {/* Soft Delete Option */}
            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors',
                deleteType === 'soft'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <input
                type="radio"
                name="deleteType"
                value="soft"
                checked={deleteType === 'soft'}
                onChange={() => setDeleteType('soft')}
                className="mt-1 h-4 w-4 text-primary-600 border-gray-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">Soft Delete (Hide)</span>
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded">Recommended</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Hide this category from the app but keep all data. The category can be reactivated later.
                  Therapists will remain assigned.
                </p>
              </div>
            </label>

            {/* Hard Delete Option */}
            <label
              className={cn(
                'flex items-start gap-3 p-4 rounded-lg border-2 transition-colors',
                canHardDelete ? 'cursor-pointer' : 'cursor-not-allowed opacity-60',
                deleteType === 'hard'
                  ? 'border-red-500 bg-red-50'
                  : canHardDelete
                  ? 'border-gray-200 hover:border-gray-300'
                  : 'border-gray-200'
              )}
            >
              <input
                type="radio"
                name="deleteType"
                value="hard"
                checked={deleteType === 'hard'}
                onChange={() => canHardDelete && setDeleteType('hard')}
                disabled={!canHardDelete}
                className="mt-1 h-4 w-4 text-red-600 border-gray-300"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-gray-900">Permanent Delete</span>
                  {!canHardDelete && (
                    <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded flex items-center gap-1">
                      <Ban className="h-3 w-3" />
                      Unavailable
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {canHardDelete
                    ? 'Permanently remove this category and all associated data. This action cannot be undone.'
                    : 'Cannot permanently delete while therapists are assigned. Reassign or remove therapists first.'}
                </p>
              </div>
            </label>
          </div>

          {/* Hard Delete Confirmation */}
          {deleteType === 'hard' && canHardDelete && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                <p className="text-sm text-red-800">
                  This will permanently delete "{category.name}" and cannot be undone.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-red-800 mb-1">
                  Type the category name to confirm:
                </label>
                <input
                  type="text"
                  className="input border-red-300 focus:border-red-500 focus:ring-red-500"
                  placeholder={category.name}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="btn btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={
              isLoading ||
              !deleteType ||
              (deleteType === 'hard' && (!canHardDelete || confirmText !== category.name))
            }
            className={cn(
              'btn',
              deleteType === 'hard'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'btn-primary'
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : deleteType === 'soft' ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Hide Category
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Permanently
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
