const loader = async () => {
  const res = await fetch(chrome.runtime.getURL('js/main.js'), {method: 'GET'});
  const js = await res.text();
  const script = document.createElement('script');
  script.textContent = js;

  try {
    chrome.storage.local.get('transType', (items) => {
      let transType = items.transType;
      if (!transType) {
        transType = 'normal';
      }

      const evt = new CustomEvent('onChangeTransType', {detail: {transType: transType}});
      document.dispatchEvent(evt);
    });
    updateTransType();

  } catch (e) {}

  document.body.insertBefore(script, document.body.firstChild);
};

const updateTransType = () => {
  try {
    chrome.storage.local.get('transType', (items) => {
      let transType = items.transType;
      if (!transType) {
        transType = 'normal';
      }
      const evt = new CustomEvent('onChangeTransType', {detail: {transType: transType}});
      document.dispatchEvent(evt);
      setTimeout(updateTransType, 1000);
    });
  } catch (e) {}
};

window.addEventListener('load', () => {
  loader();
}, false);
