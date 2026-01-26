import React, { useEffect, useRef } from 'react';

type MountFunction = (container: HTMLElement) => { unmount: () => void };
type MountLoader = () => Promise<{ default: MountFunction }>;

interface RemoteWrapperConfig {
  name: string;
  containerClassName: string;
  loadMount: MountLoader;
}

/**
 * Factory function to create RemoteWrapper components.
 * Reduces boilerplate across all remote wrapper files.
 *
 * @example
 * const MyRemoteWrapper = createRemoteWrapper({
 *   name: 'my-app',
 *   containerClassName: 'my-app-remote-container',
 *   loadMount: () => import('myApp/mount'),
 * });
 */
export function createRemoteWrapper(config: RemoteWrapperConfig): React.FC {
  const { name, containerClassName, loadMount } = config;

  const RemoteWrapper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mountedRef = useRef(false);
    const unmountRef = useRef<(() => void) | null>(null);

    useEffect(() => {
      if (mountedRef.current) return;
      mountedRef.current = true;

      const loadRemote = async () => {
        if (!containerRef.current) return;

        try {
          const { default: mount } = await loadMount();
          const { unmount } = mount(containerRef.current);
          unmountRef.current = unmount;
        } catch (error) {
          console.error(`Failed to load ${name} remote:`, error);
        }
      };

      loadRemote();

      return () => {
        if (unmountRef.current) {
          try {
            unmountRef.current();
          } catch {
            // Ignore unmount errors
          }
          unmountRef.current = null;
        }
      };
    }, []);

    return <div ref={containerRef} className={containerClassName} />;
  };

  RemoteWrapper.displayName = `${name}RemoteWrapper`;

  return RemoteWrapper;
}
