import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'hopefull-admin',
  containerClassName: 'hopefull-admin-remote-container',
  loadMount: () => import('hopefullAdmin/mount'),
});
