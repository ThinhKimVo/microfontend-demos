import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'booking-guest-portal',
  containerClassName: 'booking-guest-portal-remote-container',
  loadMount: () => import('bookingGuestPortal/mount'),
});
