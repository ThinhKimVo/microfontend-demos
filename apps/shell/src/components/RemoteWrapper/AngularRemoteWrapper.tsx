import React, { useEffect, useRef } from 'react';

const AngularRemoteWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const destroyRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const loadAngularRemote = async () => {
      if (!containerRef.current) return;

      try {
        const { default: mount } = await import('angularRemote/mount');
        const { destroy } = await mount(containerRef.current);
        destroyRef.current = destroy;
      } catch (error) {
        console.error('Failed to load Angular remote:', error);
      }
    };

    loadAngularRemote();

    return () => {
      if (destroyRef.current) {
        destroyRef.current();
      }
    };
  }, []);

  return <div ref={containerRef} className="angular-remote-container" />;
};

export default AngularRemoteWrapper;
