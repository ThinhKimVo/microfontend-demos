import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'elearning-admin-portal',
  containerClassName: 'elearning-admin-portal-remote-container',
  loadMount: () => import('elearningAdminPortal/mount'),
});
