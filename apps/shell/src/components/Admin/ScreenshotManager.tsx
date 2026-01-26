import React from 'react';
import { AppScreenshot } from '../../data/apps';

interface ScreenshotManagerProps {
  screenshots: AppScreenshot[];
  appId: string;
  onChange: (screenshots: AppScreenshot[]) => void;
}

export const ScreenshotManager: React.FC<ScreenshotManagerProps> = ({
  screenshots,
  appId,
  onChange,
}) => {
  const handleUrlChange = (index: number, url: string) => {
    const newScreenshots = [...screenshots];
    newScreenshots[index] = { ...newScreenshots[index], url };
    onChange(newScreenshots);
  };

  const handleAltChange = (index: number, alt: string) => {
    const newScreenshots = [...screenshots];
    newScreenshots[index] = { ...newScreenshots[index], alt };
    onChange(newScreenshots);
  };

  const handleRemove = (index: number) => {
    onChange(screenshots.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const maxWidth = 1200;
      const maxHeight = 800;
      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      onChange([
        ...screenshots,
        {
          url: compressedBase64,
          alt: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        },
      ]);
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleDownload = (screenshot: AppScreenshot, index: number) => {
    const link = document.createElement('a');
    link.href = screenshot.url;
    link.download = `${appId || 'app'}-${index + 1}.png`;
    link.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Screenshots</label>
      <div className="space-y-3">
        {screenshots.map((screenshot, index) => {
          const isBase64 = screenshot.url.startsWith('data:image');
          return (
            <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
              <div className="w-20 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0 relative group">
                <img
                  src={screenshot.url}
                  alt={screenshot.alt}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>';
                  }}
                />
                {isBase64 && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleDownload(screenshot, index)}
                      className="p-1 bg-white rounded text-gray-700 hover:bg-gray-100"
                      title="Download image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={isBase64 ? `/screenshots/${appId || 'app'}-${index + 1}.png` : screenshot.url}
                    onChange={(e) => !isBase64 && handleUrlChange(index, e.target.value)}
                    className={`flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 ${isBase64 ? 'bg-amber-50 text-amber-700 border-amber-300' : ''}`}
                    placeholder="URL (e.g., /screenshots/app-1.png)"
                    readOnly={isBase64}
                  />
                  {isBase64 && (
                    <span className="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded whitespace-nowrap flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Will save
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={screenshot.alt}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500"
                  placeholder="Alt text (e.g., Dashboard overview)"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                title="Remove screenshot"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          );
        })}

        <label className="w-full py-2 px-3 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center gap-2 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Upload Image:</strong> Auto-saves to <code className="bg-gray-100 px-1 rounded">public/screenshots/</code> on Save Changes</p>
        </div>
      </div>
    </div>
  );
};
