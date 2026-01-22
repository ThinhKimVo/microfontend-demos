import React, { useEffect, useRef } from 'react';

const AssestManagementRemoteWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(false);
  const unmountRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    const loadRemote = async () => {
      if (!containerRef.current) return;

      try {
        const { default: mount } = await import('assestManagement/mount');
        const { unmount } = mount(containerRef.current);
        unmountRef.current = unmount;
      } catch (error) {
        console.error('Failed to load assest-management remote:', error);
      }
    };

    loadRemote();

    return () => {
      if (unmountRef.current) {
        try {
          unmountRef.current();
        } catch (e) {
          // Ignore unmount errors
        }
        unmountRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className="assest-management-remote-container" />;
};

export default AssestManagementRemoteWrapper;
