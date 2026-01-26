import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'family-fun',
  containerClassName: 'family-fun-remote-container',
  loadMount: () => import('familyFun/mount'),
});
