import { createApp, App } from 'vue';
import Dashboard from '../components/Dashboard/Dashboard.vue';
import '../styles.css';

export default function mount(el: HTMLElement): { unmount: () => void } {
  const app: App = createApp(Dashboard);
  app.mount(el);

  return {
    unmount: () => {
      app.unmount();
    },
  };
}
