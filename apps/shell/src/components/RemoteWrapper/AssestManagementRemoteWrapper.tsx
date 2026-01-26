import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'assest-management',
  containerClassName: 'assest-management-remote-container',
  loadMount: () => import('assestManagement/mount'),
});
