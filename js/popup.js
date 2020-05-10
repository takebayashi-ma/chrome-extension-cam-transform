window.addEventListener('load', () => {
  loadType();
  const radioTag = document.getElementsByName('transType');
  radioTag.forEach((element) => {
    element.addEventListener('click', (event) => {
      saveTransType();
    });
  });

  document.querySelector('#transLevel').addEventListener('change', event => {
    saveTransLevel(event.target.value)
  });

  chrome.storage.local.get(['transType', 'transLevel'], (items) => {
    if (items.transType) {
      setTransLevelElm(items.transType)
    }
  })
});

const defaultStore = {
  transType: 'normal',
  transLevel: '0'
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

const setTransLevelElm = (transType) => {
  const transLevelElm = document.querySelector('#transLevel');
  switch (transType) {
    case 'normal': {
      document.querySelector('#box-trans-level').className = 'hide';
      break;
    }
    case 'gamma': {
      transLevelElm.min = 1
      transLevelElm.max = 20
      transLevelElm.step = 0.1
      transLevelElm.value = getDefaultTransLevel(transType)
      document.querySelector('#box-trans-level').className = 'show';
      break;
    }
    case 'nega': {
      document.querySelector('#box-trans-level').className = 'hide';
      break;
    }
    case 'mosaic': {
      transLevelElm.min = 0
      transLevelElm.max = 20
      transLevelElm.step = 0.1
      transLevelElm.value = getDefaultTransLevel(transType)
      document.querySelector('#box-trans-level').className = 'show';
      break;
    }
  }
}

const getDefaultTransLevel = (transType) => {
  const defaultLevel = {
    'normal': 0,
    'gamma': 2,
    'nega': 0,
    'mosaic': 2
  };
  return defaultLevel[transType];
}

const saveTransType = () => {
  if (!document.querySelector('input:checked[name=transType]')) {
    return;
  }

  const transType = document.querySelector(
      'input:checked[name=transType]',
  ).value;

  defaultStore['transType'] = transType;
  chrome.storage.local.set(defaultStore, () => {
    setTransLevelElm(transType)
    saveTransLevel(getDefaultTransLevel(transType))
  });
};

const saveTransLevel = (transLevel) => {
  defaultStore['transLevel'] =transLevel;
  chrome.storage.local.set(defaultStore);
}
