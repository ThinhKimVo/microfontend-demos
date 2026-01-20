import React, { useEffect, useRef } from 'react';

const VueRemoteWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const unmountRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadVueRemote = async () => {
      if (!containerRef.current) return;

      try {
        const { default: mount } = await import('vueRemote/mount');
        const { unmount } = mount(containerRef.current);
        unmountRef.current = unmount;
      } catch (error) {
        console.error('Failed to load Vue remote:', error);
      }
    };

    loadVueRemote();

    return () => {
      if (unmountRef.current) {
        unmountRef.current();
      }
    };
  }, []);

  return <div ref={containerRef} className="vue-remote-container" />;
};

export default VueRemoteWrapper;
