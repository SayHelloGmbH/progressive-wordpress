(function (plugin) {
  let installPromptEvent;

  if (plugin.installprompt.mode === 'normal') {
    return;
  }

  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent Chrome <= 67 from automatically showing the prompt
    event.preventDefault();
    installPromptEvent = event;

    if (plugin.installprompt.mode === 'trigger') {
      /**
       * Installable on click
       */

      const $elements = document.querySelectorAll(plugin.installprompt.onclick);
      let i, ii;

      for (i = 0; i < $elements.length; ++i) {
        $elements[i].classList.add('installable-active');
        $elements[i].onclick = function () {
          if (this.classList.contains('installable-active')) {
            installPromptEvent.prompt();
            installPromptEvent.userChoice.then((choice) => {
              if (choice.outcome === 'accepted') {
                // User accepted the A2HS prompt
              } else {
                // User dismissed the A2HS prompt
              }

              for (ii = 0; ii < $elements.length; ++ii) {
                $elements[ii].classList.remove('installable-active');
              }

              installPromptEvent = null;
            });
          }
        };
      }
    } else {
      installPromptEvent.prompt();
    }
  });
})(PwpJsVars);
