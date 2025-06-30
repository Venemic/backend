(function () {
  const iframe = document.createElement('iframe');
  iframe.src = 'https://plugins-ui-qa-in.smsinfini.com/send_lead?plugin=zoho&action_service=SMS&org=3600268000000181661&user=3600268000000906003&lead_id=3600268000023319207&module_type=Leads&is_admin=true';
  iframe.style.position = 'fixed';
  iframe.style.bottom = '20px';
  iframe.style.right = '20px';
  iframe.style.width = '400px';
  iframe.style.height = '600px';
  iframe.style.border = 'none';
  iframe.style.zIndex = '9999';
  iframe.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
  iframe.style.borderRadius = '8px';
  iframe.allow = 'camera; microphone; clipboard-write';
  document.body.appendChild(iframe);
})();
