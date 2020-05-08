window.addEventListener('load', () => {
  loadType();
  const radioTag = document.getElementsByName('transType');
  radioTag.forEach((element) => {
    element.addEventListener('click', (event) => {
      saveTransType();
    });
  });
});

const defaultStore = {
  transType: 'normal',
};

const loadType = () => {
  chrome.storage.local.get('transType', (items) => {
    const radioTag = document.getElementsByName('transType');
    if (!items.transType) {
      radioTag[0].checked = true;
      return;
    }
    radioTag.forEach((element) => {
      if (element.value == items.transType) {
        element.checked = true;
      }
    });
  },
  );
};

const saveTransType = () => {
  if (!document.querySelector('input:checked[name=transType]')) {
    return;
  }

  const transType = document.querySelector(
      'input:checked[name=transType]',
  ).value;

  defaultStore['transType'] = transType
  chrome.storage.local.set(defaultStore);
};
