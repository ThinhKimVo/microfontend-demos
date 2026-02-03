import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'healthcare-marketing',
  containerClassName: 'healthcare-marketing-remote-container',
  loadMount: () => import('healthcareMarketing/mount'),
});
