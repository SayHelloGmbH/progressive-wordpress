const body = document.querySelector('body');

export const setPushButtonState = (state: PushButtonStateTypes): void =>
  body.setAttribute('pwp-push-button-state', state);
