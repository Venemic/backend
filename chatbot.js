(function () {
  // Step 1: Get iframe URL from the script tag’s `src`
  function getIframeUrl() {
    const currentScript = document.currentScript || (function () {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();
    const urlParams = new URL(currentScript.src).searchParams;
    return urlParams.get('url') || 'https://default.com';
  }

  const iframeURL = getIframeUrl();

  // Step 2: Create chat button
  const chatButton = document.createElement('div');
  chatButton.innerHTML = '💬 Chat';
  chatButton.style.position = 'fixed';
  chatButton.style.bottom = '20px';
  chatButton.style.right = '20px';
  chatButton.style.backgroundColor = '#007aff';
  chatButton.style.color = '#fff';
  chatButton.style.padding = '12px 20px';
  chatButton.style.borderRadius = '50px';
  chatButton.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
  chatButton.style.cursor = 'pointer';
  chatButton.style.zIndex = '9998';
  chatButton.style.fontFamily = 'Arial, sans-serif';
  chatButton.style.fontSize = '16px';

  // Step 3: Create iframe container
  const iframeContainer = document.createElement('div');
  iframeContainer.style.position = 'fixed';
  iframeContainer.style.bottom = '80px';
  iframeContainer.style.right = '20px';
  iframeContainer.style.width = '400px';
  iframeContainer.style.height = '600px';
  iframeContainer.style.border = 'none';
  iframeContainer.style.zIndex = '9999';
  iframeContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
  iframeContainer.style.borderRadius = '8px';
  iframeContainer.style.overflow = 'hidden';
  iframeContainer.style.backgroundColor = '#fff';
  iframeContainer.style.transform = 'scale(0)';
  iframeContainer.style.transformOrigin = 'bottom right';
  iframeContainer.style.transition = 'transform 0.3s ease';

  // Step 4: Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeURL;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allow = 'camera; microphone; clipboard-write';

  // Step 5: Append elements
  iframeContainer.appendChild(iframe);
  document.body.appendChild(chatButton);
  document.body.appendChild(iframeContainer);

  // Step 6: Toggle iframe on button click
  let isOpen = false;
  chatButton.addEventListener('click', () => {
    iframeContainer.style.transform = isOpen ? 'scale(0)' : 'scale(1)';
    isOpen = !isOpen;
  });
})();
