import './offline-indicator/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const offlineIndicator = document.querySelector('.offline-indicator');
  if (offlineIndicator) {
    window.addEventListener('online', () =>
      offlineIndicator.setAttribute('hidden', 'true')
    );
    window.addEventListener('offline', () =>
      offlineIndicator.setAttribute('hidden', 'false')
    );
  }
});
