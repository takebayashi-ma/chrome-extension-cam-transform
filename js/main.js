const main = () => {
  'use strict';
  const outputCanvas = document.createElement('canvas');
  const workingCanvas = document.createElement('canvas');
  const video = document.createElement('video');

  let type;
  let level =0;

  document.addEventListener('onChangeTransType', (e) => {
    type = e.detail.transType;
  });

  document.addEventListener('onChangeTransLevel', (e) => {
    level = e.detail.transLevel;
  });

  const outputCtx = outputCanvas.getContext('2d');
  const workingCtx = workingCanvas.getContext('2d');
  const effect = () => {
    workingCtx.drawImage(
        video,
        0,
        0,
        workingCanvas.width,
        workingCanvas.height,
    );

    filter(workingCtx);
    outputCtx.drawImage(workingCanvas, 0, 0);

    window.requestAnimationFrame(effect);
  };

  const filter = (workingCtx) => {
    switch (type) {
      case 'gamma': {
        filterGamma(workingCtx);
        workingCtx.filter = 'none';
        break;
      }
      case 'nega': {
        filterNega(workingCtx);
        workingCtx.filter = 'none';
        break;
      }
      case 'mosaic': {
        if (level == '0') {
          workingCtx.filter = 'none';
        } else {
          workingCtx.filter = `blur(${level}px)`;
        }
        break;
      }
      default: {
        workingCtx.filter = 'none';
      }

    }
  };

  const filterNega = (workingCtx) => {
    const imageData = workingCtx.getImageData(
        0,
        0,
        workingCanvas.width,
        workingCanvas.height,
    );
    for (let i = 0; i < imageData.data.length; i=i+4) {
      imageData.data[i] = 255 - imageData.data[i];
      imageData.data[i+1] = 255 - imageData.data[i+1];
      imageData.data[i+2] = 255 - imageData.data[i+2];
      imageData.data[i+3] = imageData.data[i+3];
    }
    workingCtx.putImageData(imageData, 0, 0);
  };

  const filterGamma = (workingCtx) => {
    const imageData = workingCtx.getImageData(
        0,
        0,
        workingCanvas.width,
        workingCanvas.height,
    );
    const gamma = level;
    const correctify = (val) => 255 * Math.pow(val / 255, 1 / gamma);
    for (let i = 0; i < imageData.data.length; i=i+4) {
      imageData.data[i] = correctify(imageData.data[i]);
      imageData.data[i+1] = correctify(imageData.data[i+1]);
      imageData.data[i+2] = correctify(imageData.data[i+2]);
    }
    workingCtx.putImageData(imageData, 0, 0);
  };

  video.onloadedmetadata = () => {
    video.muted = true;
    video.play();
    effect();
  };

  if (navigator.mediaDevices._getUserMedia !== undefined) return;
  try {
    navigator.mediaDevices._getUserMedia = navigator.mediaDevices.getUserMedia;
    navigator.mediaDevices.getUserMedia = (constraints) => {
      return new Promise((resolve, reject) => {
        navigator.mediaDevices._getUserMedia(constraints)
            .then((stream) => {
              video.srcObject = stream;
              video.play();
              const settings = stream.getVideoTracks()[0].getSettings();
              const framerate = settings.frameRate.max;
              outputCanvas.width = workingCanvas.width = video.width = settings.width
              outputCanvas.height = workingCanvas.height = video.height = settings.height
              const canvasStream = outputCanvas.captureStream(framerate);

              // Add audio Track
              if (stream.getAudioTracks().length > 0) {
                canvasStream.addTrack(stream.getAudioTracks()[0])
              }
              resolve(canvasStream);
            })
            .catch((err) => {
              console.error(err);
              reject(err);
            });
      });
    };
  } catch (e) {
    console.error(e);
  }
};

main();
