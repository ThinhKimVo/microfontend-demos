import { useState, useRef } from 'react';
import {
  X,
  Upload,
  Image,
  AlertCircle,
  Smartphone,
  Users,
  Check,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Category } from './CategoriesList';

interface CategoryFormModalProps {
  category: Category | null;
  isEditing: boolean;
  existingNames: string[];
  onClose: () => void;
  onSave: (data: Partial<Category>) => void;
}

// Common emoji icons for categories
const emojiOptions = [
  '🧠', '💑', '👨‍👩‍👧‍👦', '🛡️', '🔄', '👶', '🕯️', '💼',
  '🧘', '💪', '🌈', '🎯', '💭', '🌟', '🤝', '❤️',
  '🏥', '🎓', '🧩', '🌿', '🔥', '⚡', '🎭', '📚',
];

// Mock therapists using categories
const mockTherapistsUsingCategory = [
  { id: 'THP-001', name: 'Dr. Sarah Smith' },
  { id: 'THP-002', name: 'Dr. Michael Brown' },
  { id: 'THP-003', name: 'Dr. Emily Chen' },
  { id: 'THP-004', name: 'Dr. James Wilson' },
  { id: 'THP-005', name: 'Dr. Lisa Johnson' },
];

export default function CategoryFormModal({
  category,
  isEditing,
  existingNames,
  onClose,
  onSave,
}: CategoryFormModalProps) {
  const [name, setName] = useState(category?.name || '');
  const [description, setDescription] = useState(category?.description || '');
  const [icon, setIcon] = useState(category?.icon || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(category?.status || 'active');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [iconType, setIconType] = useState<'emoji' | 'custom'>(category?.icon?.startsWith('http') ? 'custom' : 'emoji');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTherapists, setShowTherapists] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (existingNames.some((n) => n.toLowerCase() === name.toLowerCase().trim())) {
      newErrors.name = 'Category name already exists';
    }

    if (!icon && !customIconUrl) {
      newErrors.icon = 'Icon is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    onSave({
      name: name.trim(),
      description: description.trim(),
      icon: iconType === 'custom' ? customIconUrl : icon,
      status,
    });

    setIsLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/svg+xml', 'image/png'].includes(file.type)) {
        setErrors((prev) => ({ ...prev, icon: 'Only SVG or PNG files are allowed' }));
        return;
      }

      // Validate file size (max 1MB)
      if (file.size > 1024 * 1024) {
        setErrors((prev) => ({ ...prev, icon: 'File size must be less than 1MB' }));
        return;
      }

      // Create preview URL
      const url = URL.createObjectURL(file);
      setCustomIconUrl(url);
      setIcon('');
      setIconType('custom');
      setErrors((prev) => {
        const { icon, ...rest } = prev;
        return rest;
      });
    }
  };

  const selectedIcon = iconType === 'custom' ? customIconUrl : icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Category' : 'Add New Category'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Fields */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className={cn('input', errors.name && 'border-red-500')}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder="e.g., Anxiety & Depression"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this category..."
                />
              </div>

              {/* Icon Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon <span className="text-red-500">*</span>
                </label>

                {/* Icon Type Tabs */}
                <div className="flex gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setIconType('emoji')}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      iconType === 'emoji'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    Emoji
                  </button>
                  <button
                    type="button"
                    onClick={() => setIconType('custom')}
                    className={cn(
                      'px-3 py-1.5 text-sm rounded-lg transition-colors',
                      iconType === 'custom'
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    )}
                  >
                    Upload Image
                  </button>
                </div>

                {iconType === 'emoji' ? (
                  <div className="grid grid-cols-8 gap-2 p-3 bg-gray-50 rounded-lg">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setIcon(emoji);
                          setCustomIconUrl('');
                          if (errors.icon) setErrors((prev) => ({ ...prev, icon: '' }));
                        }}
                        className={cn(
                          'w-10 h-10 text-xl rounded-lg transition-colors flex items-center justify-center',
                          icon === emoji
                            ? 'bg-primary-100 ring-2 ring-primary-500'
                            : 'bg-white hover:bg-gray-100'
                        )}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                        customIconUrl ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                      )}
                    >
                      {customIconUrl ? (
                        <div className="flex flex-col items-center">
                          <img src={customIconUrl} alt="Icon preview" className="w-16 h-16 object-contain mb-2" />
                          <p className="text-sm text-primary-600">Click to change</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Click to upload SVG or PNG</p>
                          <p className="text-xs text-gray-400 mt-1">512x512px recommended, max 1MB</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".svg,.png,image/svg+xml,image/png"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </div>
                )}

                {errors.icon && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.icon}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {status === 'active' ? 'Active' : 'Inactive'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {status === 'active' ? 'Visible in the app' : 'Hidden from users'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === 'active'}
                      onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </div>

              {/* Therapists Using This Category */}
              {isEditing && category && category.therapistCount > 0 && (
                <div>
                  <button
                    type="button"
                    onClick={() => setShowTherapists(!showTherapists)}
                    className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <Users className="h-4 w-4" />
                    {category.therapistCount} therapists using this category
                  </button>

                  {showTherapists && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                      <ul className="space-y-1">
                        {mockTherapistsUsingCategory.slice(0, category.therapistCount).map((therapist) => (
                          <li key={therapist.id} className="text-sm text-gray-600 flex items-center gap-2">
                            <Check className="h-3 w-3 text-green-500" />
                            {therapist.name}
                          </li>
                        ))}
                        {category.therapistCount > 5 && (
                          <li className="text-sm text-gray-400">
                            +{category.therapistCount - 5} more...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Smartphone className="h-4 w-4 inline mr-1" />
                Mobile App Preview
              </label>
              <div className="bg-gray-900 rounded-3xl p-3 max-w-[280px] mx-auto">
                <div className="bg-white rounded-2xl overflow-hidden">
                  {/* Mock Status Bar */}
                  <div className="h-6 bg-gray-100 flex items-center justify-center">
                    <div className="w-16 h-1 bg-gray-300 rounded-full"></div>
                  </div>

                  {/* Mock App Header */}
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Categories</p>
                  </div>

                  {/* Category Preview Card */}
                  <div className="p-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        {selectedIcon ? (
                          iconType === 'custom' && customIconUrl ? (
                            <img src={customIconUrl} alt="Icon" className="w-8 h-8 object-contain" />
                          ) : (
                            <span className="text-2xl">{icon}</span>
                          )
                        ) : (
                          <Image className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {name || 'Category Name'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {description || 'Description goes here...'}
                        </p>
                      </div>
                    </div>

                    {/* Mock other categories */}
                    <div className="mt-2 space-y-2 opacity-50">
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                          <div className="h-2 w-32 bg-gray-100 rounded mt-1"></div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1">
                          <div className="h-3 w-20 bg-gray-200 rounded"></div>
                          <div className="h-2 w-28 bg-gray-100 rounded mt-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mock Bottom Bar */}
                  <div className="h-16 border-t border-gray-100 flex items-center justify-around px-4">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-primary-500 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isLoading}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                {isEditing ? 'Save Changes' : 'Create Category'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
