import React, { useState } from 'react';
import { AppInfo, isMobileApp } from '../../data/apps';
import { gradientPresets, GradientPreset } from '../../constants/themes';
import { ScreenshotManager } from './ScreenshotManager';
import { HtmlEditor } from './HtmlEditor';
import { RichTextEditor } from './RichTextEditor';

interface EditAppDrawerProps {
  app: AppInfo;
  isNew: boolean;
  onChange: (app: AppInfo) => void;
  onSave: () => void;
  onCancel: () => void;
}

type TabId = 'general' | 'appearance' | 'media' | 'advanced';

export const EditAppDrawer: React.FC<EditAppDrawerProps> = ({
  app,
  isNew,
  onChange,
  onSave,
  onCancel,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [editorMode, setEditorMode] = useState<'visual' | 'html' | 'preview'>('visual');

  const updateField = <K extends keyof AppInfo>(field: K, value: AppInfo[K]) => {
    onChange({ ...app, [field]: value });
  };

  const applyGradientPreset = (preset: GradientPreset) => {
    onChange({
      ...app,
      gradient: preset.gradient,
      bgGradient: preset.bgGradient,
      borderColor: preset.borderColor,
      textColor: preset.textColor,
    });
  };

  const tabs = [
    { id: 'general' as TabId, label: 'General', icon: InfoIcon },
    { id: 'appearance' as TabId, label: 'Appearance', icon: PaletteIcon },
    { id: 'media' as TabId, label: 'Media', icon: ImageIcon },
    { id: 'advanced' as TabId, label: 'Advanced', icon: CodeIcon },
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Full Page Modal */}
      <div className="w-full h-full bg-white flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
              {app.name?.charAt(0) || 'A'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isNew ? 'Create New App' : 'Edit App'}
              </h2>
              <p className="text-sm text-slate-500">
                {isNew ? 'Add a new application to your platform' : app.name}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-white">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        App Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={app.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="My Awesome App"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        URL Path <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-500 text-sm">
                          /
                        </span>
                        <input
                          type="text"
                          value={app.path.replace(/^\//, '')}
                          onChange={(e) => updateField('path', '/' + e.target.value.replace(/^\//, ''))}
                          className="flex-1 px-4 py-3 bg-white border border-slate-300 rounded-r-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="my-app"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={app.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows={4}
                        placeholder="A brief description of what this app does..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Technical Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Framework</label>
                      <select
                        value={app.framework}
                        onChange={(e) => updateField('framework', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <optgroup label="Web">
                          <option value="React">React</option>
                          <option value="Vue">Vue</option>
                          <option value="Angular">Angular</option>
                        </optgroup>
                        <optgroup label="Mobile">
                          <option value="React Native">React Native</option>
                          <option value="Flutter">Flutter</option>
                          <option value="Swift">Swift-iOS</option>
                          <option value="Kotlin">Kotlin-android</option>
                        </optgroup>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Port</label>
                      <input
                        type="number"
                        value={app.port}
                        onChange={(e) => updateField('port', parseInt(e.target.value) || 3100)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Version</label>
                      <input
                        type="text"
                        value={app.version}
                        onChange={(e) => updateField('version', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile App QR Code Section - shown when framework is mobile */}
                {isMobileApp(app.framework) && (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <MobileIcon className="w-5 h-5" />
                      Mobile App Install
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* iOS App */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <AppleIcon className="w-5 h-5 text-slate-700" />
                          <label className="text-sm font-medium text-slate-700">iOS App Store URL</label>
                        </div>
                        <input
                          type="url"
                          value={app.iosAppUrl || ''}
                          onChange={(e) => updateField('iosAppUrl', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="https://apps.apple.com/app/..."
                        />
                        {app.iosAppUrl && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(app.iosAppUrl)}`}
                              alt="iOS QR Code"
                              className="w-28 h-28 mx-auto rounded-lg"
                            />
                            <p className="text-xs text-slate-500 mt-2">iOS QR Code</p>
                          </div>
                        )}
                      </div>

                      {/* Android App */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <AndroidIcon className="w-5 h-5 text-green-600" />
                          <label className="text-sm font-medium text-slate-700">Google Play Store URL</label>
                        </div>
                        <input
                          type="url"
                          value={app.androidAppUrl || ''}
                          onChange={(e) => updateField('androidAppUrl', e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                          placeholder="https://play.google.com/store/apps/..."
                        />
                        {app.androidAppUrl && (
                          <div className="p-3 bg-white rounded-xl border border-slate-200 text-center">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(app.androidAppUrl)}`}
                              alt="Android QR Code"
                              className="w-28 h-28 mx-auto rounded-lg"
                            />
                            <p className="text-xs text-slate-500 mt-2">Android QR Code</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Deployment Status</h3>
                  <label className="flex items-center gap-4 cursor-pointer p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={app.integrated ?? false}
                        onChange={(e) => updateField('integrated', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"></div>
                    </div>
                    <div>
                      <span className="font-medium text-slate-900">Integrated & Deployed</span>
                      <p className="text-sm text-slate-500">Enable when app is ready and deployed to production</p>
                    </div>
                  </label>
                </div>

                {/* Preview Card */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4">Preview</h3>
                  <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0`}>
                        {app.name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-lg truncate">{app.name || 'App Name'}</h4>
                        <p className="text-slate-500 text-sm mt-1 line-clamp-2">{app.description || 'App description will appear here'}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${app.gradient} text-white`}>
                            {app.framework}
                          </span>
                          <span className="text-xs text-slate-400">Port {app.port}</span>
                          <span className="text-xs text-slate-400">v{app.version}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Color Theme Selection */}
              <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Color Theme</h3>
                <p className="text-sm text-slate-500 mb-4">Choose a color theme for your app's branding</p>
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                  {gradientPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyGradientPreset(preset)}
                      className={`relative group p-1 rounded-xl transition-all ${
                        app.gradient === preset.gradient
                          ? 'ring-2 ring-blue-500 ring-offset-2'
                          : 'hover:scale-105'
                      }`}
                    >
                      <div className={`h-12 rounded-lg bg-gradient-to-br ${preset.gradient}`}></div>
                      <p className="text-xs font-medium text-slate-600 mt-1.5 text-center truncate">{preset.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Preview</h3>
                <div className="space-y-4">
                  {/* Card Preview */}
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${app.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {app.name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{app.name || 'App Name'}</h4>
                        <p className="text-slate-500 text-sm truncate">{app.description || 'Description'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Badge Preview */}
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r ${app.gradient} text-white`}>
                      {app.framework}
                    </span>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${app.bgGradient} ${app.textColor} ${app.borderColor} border`}>
                      v{app.version}
                    </span>
                  </div>

                  {/* Button Preview */}
                  <button className={`w-full px-4 py-2 bg-gradient-to-r ${app.gradient} text-white font-medium rounded-lg shadow-sm`}>
                    Launch App
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-2">Screenshots</h3>
                <p className="text-sm text-slate-500 mb-4">Add screenshots to showcase your app. Images will be auto-resized and compressed.</p>
                <ScreenshotManager
                  screenshots={app.screenshots || []}
                  appId={app.id}
                  onChange={(screenshots) => updateField('screenshots', screenshots)}
                />
              </div>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Editor Area - Takes 2/3 of the space */}
              <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">Detail Content</h3>
                    <p className="text-sm text-slate-500">Add content for the app detail page</p>
                  </div>
                  {/* Editor Mode Toggle */}
                  <div className="flex items-center bg-slate-200 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setEditorMode('visual')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        editorMode === 'visual'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Visual Editor - Edit like a document"
                    >
                      <span className="flex items-center gap-1.5">
                        <EditIcon className="w-4 h-4" />
                        Visual
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('html')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        editorMode === 'html'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="HTML Editor - Edit raw HTML code"
                    >
                      <span className="flex items-center gap-1.5">
                        <CodeIcon className="w-4 h-4" />
                        HTML
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode('preview')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                        editorMode === 'preview'
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                      title="Preview - See how it will look"
                    >
                      <span className="flex items-center gap-1.5">
                        <EyeIcon className="w-4 h-4" />
                        Preview
                      </span>
                    </button>
                  </div>
                </div>

                {/* Editor Content */}
                <div className="flex-1 min-h-0">
                  {editorMode === 'visual' && (
                    <RichTextEditor
                      value={app.detailContent || ''}
                      onChange={(value) => updateField('detailContent', value)}
                      placeholder="Start typing your content here..."
                    />
                  )}

                  {editorMode === 'html' && (
                    <HtmlEditor
                      value={app.detailContent || ''}
                      onChange={(value) => updateField('detailContent', value)}
                      placeholder="Add custom HTML content..."
                    />
                  )}

                  {editorMode === 'preview' && (
                    <div className="h-full overflow-auto bg-white rounded-lg border border-slate-300 p-6">
                      {app.detailContent ? (
                        <div
                          className="prose prose-slate max-w-none app-detail-content"
                          dangerouslySetInnerHTML={{ __html: app.detailContent }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                          <div className="text-center">
                            <EyeIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No content to preview</p>
                            <p className="text-sm">Switch to Visual or HTML mode to add content</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tips Sidebar */}
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <div className="flex gap-3">
                    <EditIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Visual Editor</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Edit like a document. Select text and use the toolbar to format.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex gap-3">
                    <CodeIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">HTML Editor</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        For advanced users. Edit raw HTML with Tailwind CSS classes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="font-medium text-slate-800 mb-2">Formatting Tips</h4>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• <strong>Ctrl+B</strong> for bold</li>
                    <li>• <strong>Ctrl+I</strong> for italic</li>
                    <li>• <strong>Ctrl+U</strong> for underline</li>
                    <li>• Select text then click toolbar buttons</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onCancel}
            className="px-6 py-3 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/30"
          >
            {isNew ? 'Create App' : 'Save Changes'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
      `}</style>
    </div>
  );
};

// Icons
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CodeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const MobileIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const AppleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const AndroidIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-1.37-.59-2.88-.92-4.47-.92s-3.1.33-4.47.92L5.65 5.67c-.19-.29-.55-.38-.84-.22-.3.16-.42.54-.26.85L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25S6.31 12.75 7 12.75s1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
  </svg>
);
