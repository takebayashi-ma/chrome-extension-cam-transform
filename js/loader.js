const loader = async () => {
  const res = await fetch(chrome.runtime.getURL('js/main.js'), {method: 'GET'});
  const js = await res.text();
  const script = document.createElement('script');
  script.textContent = js;

  chrome.storage.local.get('transType', (items) => {
    console.log(items);
    let transType = items.transType;
    if (!transType) {
      transType = 'normal';
    }
    const evt = document.createEvent('CustomEvent');
    evt.initCustomEvent('onLoadTransType', true, true, transType);
    document.dispatchEvent(evt);
  });

  document.body.insertBefore(script, document.body.firstChild);
};
window.addEventListener('load', () => {
  loader();
}, false);
