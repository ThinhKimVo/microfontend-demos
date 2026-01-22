import React, { useEffect, useRef } from 'react';

const ElearningAdminPortalRemoteWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const unmountRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadRemote = async () => {
      if (!containerRef.current) return;

      try {
        const { default: mount } = await import('elearningAdminPortal/mount');
        const { unmount } = mount(containerRef.current);
        unmountRef.current = unmount;
      } catch (error) {
        console.error('Failed to load elearning-admin-portal remote:', error);
      }
    };

    loadRemote();

    return () => {
      if (unmountRef.current) {
        unmountRef.current();
      }
    };
  }, []);

  return <div ref={containerRef} className="elearning-admin-portal-remote-container" />;
};

export default ElearningAdminPortalRemoteWrapper;
