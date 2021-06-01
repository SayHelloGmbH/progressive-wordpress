import styles from './installprompt/styles.css';
import { VARS } from './utils/constants';

const ACTIVE_CLASS = 'installable-active';

if (VARS.installpromptMode !== 'normal') {
  let installPromptEvent;
  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent Chrome <= 67 from automatically showing the prompt
    event.preventDefault();
    installPromptEvent = event;

    if (VARS.installpromptMode === 'trigger') {
      /**
       * Installable on click
       */

      const elements = Array.from(
        document.querySelectorAll(VARS.installpromptElement)
      );

      console.log(
        'beforeinstallprompt',
        VARS.installpromptMode,
        VARS.installpromptElement,
        elements
      );

      elements.map((element) => {
        element.classList.add(ACTIVE_CLASS);
        (element as HTMLElement).onclick = () => {
          if (element.classList.contains(ACTIVE_CLASS)) {
            installPromptEvent.prompt();
          }
        };
      });

      installPromptEvent.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          // User accepted the A2HS prompt
        } else {
          // User dismissed the A2HS prompt
        }
        elements.map((element) => element.classList.remove(ACTIVE_CLASS));
        installPromptEvent = null;
      });
    }
  });
}
