const main = () => {
  'use strict';
  const outputCanvas = document.createElement('canvas');
  const workingCanvas = document.createElement('canvas');
  const video = document.createElement('video');
  let type;

  outputCanvas.width = 640;
  outputCanvas.height = 480;

  workingCanvas.width = 640;
  workingCanvas.height = 480;

  video.width = 640;
  video.height = 480;

  document.addEventListener('onLoadTransType', (e) => {
    type = e.detail;
  });

  const outputCtx = outputCanvas.getContext('2d');
  const workingCtx = workingCanvas.getContext('2d');
  const trick = () => {
    workingCtx.drawImage(
        video,
        0,
        0,
        workingCanvas.width,
        workingCanvas.height,
    );

    const imageData = workingCtx.getImageData(
        0,
        0,
        workingCanvas.width,
        workingCanvas.height,
    );
    filter(imageData);

    workingCtx.putImageData(imageData, 0, 0);

    outputCtx.drawImage(workingCanvas, 0, 0);

    window.requestAnimationFrame(trick);
  };

  const filter = (imageData) => {
    switch (type) {
      case 'gamma':
        filterGamma(imageData);
        break;
      case 'negaposi':
        filterNegaPosi(imageData);
        break;
      case 'mosaic':
        filterMosaic(imageData);
        break;
    }
  };

  const filterNegaPosi = (imageData) => {
    for (let i = 0; i < imageData.data.length; i=i+4) {
      imageData.data[i] = 255 - imageData.data[i];
      imageData.data[i+1] = 255 - imageData.data[i+1];
      imageData.data[i+2] = 255 - imageData.data[i+2];
      imageData.data[i+3] = imageData.data[i+3];
    }
  };

  const filterGamma = (imageData) => {
    const gamma = 3.0;
    const correctify = (val) => 255 * Math.pow(val / 255, 1 / gamma);
    for (let i = 0; i < imageData.data.length; i=i+4) {
      imageData.data[i] = correctify(imageData.data[i]);
      imageData.data[i+1] = correctify(imageData.data[i+1]);
      imageData.data[i+2] = correctify(imageData.data[i+2]);
    }
  };

  const filterMosaic = (imageData) => {

  }

  video.onloadedmetadata = () => {
    video.play();
    trick();
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
              const framerate = 60;
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
