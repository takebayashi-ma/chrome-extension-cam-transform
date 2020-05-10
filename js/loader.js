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
      updateTransType(transType)
    });

    chrome.storage.local.get('transLevel', (items) => {
      let transLevel = items.transLevel;
      if (!transLevel) {
        transLevel = '0';
      }
      updateTransLevel(transLevel)
    });
    chrome.storage.local.onChanged.addListener((changes) => {
      if (changes.transLevel) {
        updateTransLevel(changes.transLevel.newValue)
      }
      if (changes.transType) {
        updateTransType(changes.transType.newValue)
      }
    });
  } catch (e) {}

  document.body.insertBefore(script, document.body.firstChild);
};

const updateTransType = (transType) => {
  try {
    const evt = new CustomEvent('onChangeTransType', {detail: {transType: transType}});
    document.dispatchEvent(evt);
  } catch (e) {}
};

const updateTransLevel = (transLevel) => {
  try {
    const evt = new CustomEvent('onChangeTransLevel', {detail: {transLevel: transLevel}});
    document.dispatchEvent(evt);
  } catch (e) {}
};

window.addEventListener('load', () => {
  loader();
}, false);
