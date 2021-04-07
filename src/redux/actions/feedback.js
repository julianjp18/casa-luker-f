export const ALERT_DISMISS = 'ALERT_DISMISS';
export const ALERT_SHOW = 'ALERT_SHOW';

export const alertDismiss = () => (
  {
    type: ALERT_DISMISS,
    payload: {
      info: {
        message: null, type: null,
      },
    },
  });


export const alertShow = (data) => ({ type: ALERT_SHOW, payload: data });
