/* The prototype always runs full-screen on the real device (phone, tablet or desktop).
   The device already shows its own status bar, so the mock iOS status bar and home
   indicator are hidden (see responsive.css and the onboarding CSS). */
document.documentElement.setAttribute('data-host', 'device');
