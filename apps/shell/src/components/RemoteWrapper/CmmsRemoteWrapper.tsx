import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'cmms',
  containerClassName: 'cmms-remote-container',
  loadMount: () => import('cmms/mount'),
});
