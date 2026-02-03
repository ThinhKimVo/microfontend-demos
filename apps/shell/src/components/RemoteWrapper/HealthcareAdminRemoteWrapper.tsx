import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'healthcare-admin',
  containerClassName: 'healthcare-admin-remote-container',
  loadMount: () => import('healthcareAdmin/mount'),
});
