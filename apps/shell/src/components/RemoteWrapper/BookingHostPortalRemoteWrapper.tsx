import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'booking-host-portal',
  containerClassName: 'booking-host-portal-remote-container',
  loadMount: () => import('bookingHostPortal/mount'),
});
