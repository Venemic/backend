(function () {
  // ✅ Restrict to allowed Shopify domains only
  const allowedDomains = ['chatbot-poc.myshopify.com'];

  const currentDomain = window.location.hostname;
  if (!allowedDomains.includes(currentDomain)) {
    console.warn(`[chatbot.js] Blocked on unauthorized domain: ${currentDomain}`);
    return;
  }

  // ✅ Extract iframe URL from script tag’s query param
  function getIframeUrl() {
    const currentScript = document.currentScript || (function () {
      const scripts = document.getElementsByTagName('script');
      return scripts[scripts.length - 1];
    })();
    const urlParams = new URL(currentScript.src).searchParams;
    return urlParams.get('url') || 'https://default.com';
  }

  const iframeURL = getIframeUrl();

  // ✅ Create chat button
  const chatButton = document.createElement('div');
  chatButton.innerHTML = '💬 Chat';
  Object.assign(chatButton.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: '#007aff',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: '50px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    zIndex: '9998',
    fontFamily: 'Arial, sans-serif',
    fontSize: '16px'
  });

  // ✅ Create iframe container
  const iframeContainer = document.createElement('div');
  Object.assign(iframeContainer.style, {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '400px',
    height: '600px',
    border: 'none',
    zIndex: '9999',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    transform: 'scale(0)',
    transformOrigin: 'bottom right',
    transition: 'transform 0.3s ease'
  });

  // ✅ Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeURL;
  iframe.allow = 'camera; microphone; clipboard-write';
  Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    border: 'none'
  });

  iframeContainer.appendChild(iframe);
  document.body.appendChild(chatButton);
  document.body.appendChild(iframeContainer);

  // ✅ Toggle iframe
  let isOpen = false;
  chatButton.addEventListener('click', () => {
    iframeContainer.style.transform = isOpen ? 'scale(0)' : 'scale(1)';
    isOpen = !isOpen;
  });
})();
