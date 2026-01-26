import { createRemoteWrapper } from './createRemoteWrapper';

export default createRemoteWrapper({
  name: 'elearning-student-portal',
  containerClassName: 'elearning-student-portal-remote-container',
  loadMount: () => import('elearningStudentPortal/mount'),
});
