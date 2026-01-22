// Hopefull Admin Remote
declare module 'hopefullAdmin/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'hopefullAdmin/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}


// AssestManagement Remote
declare module 'assestManagement/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'assestManagement/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

// Cmms Remote
declare module 'cmms/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'cmms/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

// FamilyFun Remote
declare module 'familyFun/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'familyFun/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

// BookingGuestPortal Remote
declare module 'bookingGuestPortal/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'bookingGuestPortal/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

// BookingHostPortal Remote
declare module 'bookingHostPortal/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'bookingHostPortal/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

// ElearningAdminPortal Remote
declare module 'elearningAdminPortal/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'elearningAdminPortal/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

// ElearningStudentPortal Remote
declare module 'elearningStudentPortal/App' {
  const App: React.ComponentType;
  export default App;
}

declare module 'elearningStudentPortal/mount' {
  interface MountOptions {
    initialPath?: string;
  }
  const mount: (el: HTMLElement, options?: MountOptions) => { unmount: () => void };
  export default mount;
}

