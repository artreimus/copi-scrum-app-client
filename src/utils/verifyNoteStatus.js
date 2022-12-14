import { NOTE_STATUS } from '../config/noteStatus';

const verifyNoteStatus = ({ startDate, endDate, status }) => {
  if (!status) {
    return false;
  }

  let flag = false;

  switch (status) {
    case NOTE_STATUS.ToDo:
      // if To do there should be no  start and end date
      flag = !startDate && !endDate;
      break;
    case NOTE_STATUS.InProgress:
    case NOTE_STATUS.Testing:
      // if In Progress/Testing there should be a start and no end date yet
      flag = startDate && !endDate;
      break;
    case NOTE_STATUS.Done:
      // if done there should be a start and end date
      flag = startDate && endDate;
      break;
    default:
      flag = false;
  }

  return flag;
};

export default verifyNoteStatus;
