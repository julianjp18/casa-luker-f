import { notification } from 'antd';

export default (result) => {
  if (result.info) {
    notification[result.info.type ? result.info.type : 'error']({
      message: result.info.message,
      duration: 10,
    });
  }
};
