(function () {
  // Create Chat Button
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
  chatButton.style.transition = 'opacity 0.3s ease';

  // Create iframe container
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
  iframeContainer.style.transition = 'transform 0.3s ease';

  // Create Close Button
  const closeButton = document.createElement('div');
  closeButton.innerHTML = '&times;';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '15px';
  closeButton.style.fontSize = '24px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.zIndex = '10000';
  closeButton.style.color = '#333';

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = 'https://plugins-ui-qa-in.smsinfini.com/send_lead?plugin=zoho&action_service=SMS&org=3600268000000181661&user=3600268000000906003&lead_id=3600268000023319207&module_type=Leads&is_admin=true';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';
  iframe.allow = 'camera; microphone; clipboard-write';

  // Append elements
  iframeContainer.appendChild(closeButton);
  iframeContainer.appendChild(iframe);
  document.body.appendChild(chatButton);
  document.body.appendChild(iframeContainer);

  // Show iframe on button click
  chatButton.addEventListener('click', () => {
    iframeContainer.style.transform = 'scale(1)';
    chatButton.style.opacity = '0';
    setTimeout(() => {
      chatButton.style.display = 'none';
    }, 300);
  });

  // Hide iframe on close click
  closeButton.addEventListener('click', () => {
    iframeContainer.style.transform = 'scale(0)';
    setTimeout(() => {
      chatButton.style.display = 'block';
      chatButton.style.opacity = '1';
    }, 300);
  });
})();
