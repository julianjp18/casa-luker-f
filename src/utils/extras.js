import { notification } from 'antd';
import moment from 'moment';

export const getDuration = (initTime, finishTime) => {
  // start time and end time
  var startTime = moment(initTime, "HH:mm:ss");
  var endTime = moment(finishTime, "HH:mm:ss");

  // calculate total duration
  var duration = moment.duration(endTime.diff(startTime));
  
  // duration in hours
  var hours = parseInt(duration.asHours());

  // duration in minutes
  var minutes = parseInt(duration.asMinutes())%60;

  var seconds = parseInt(duration.asSeconds())%60;

  return `${hours}:${minutes}:${seconds}`;
}

export const openNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};

export const STATUS = {
  IN_PRODUCTION: 'IN_PRODUCTION',
  IN_STOCK: 'IN_STOCK',
  NOT_ARRIVE: 'NOT_ARRIVE',
  ARRIVE: 'ARRIVE',
  ON_DOCK: 'ON_DOCK',
  EXIT: 'EXIT'
};

export const COLORS = ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"];

export const MONTHS_LABELS = ["Enero", "Febrero", "Marzo", "Abril"];

export const CITIES = ['Bogotá D.C.', 'Tunja', 'Bucaramanga', 'Cartagena', 'Barranquilla'];
    