function open(el) {
  return new Promise((resolve, reject) => {
    const config = {
      video: {
        facingMode: { ideal: 'environment' },
      },
    };

    navigator
      .mediaDevices
      .getUserMedia(config)
      .then(stream => {
        el.srcObject = stream;
        el.onplaying = () => resolve(el);
      })
      .catch(err => {
        console.error(err);
        reject(err)
      });
  });
}

import { createDetector } from '../detector';

async function scan(el) {
  const detector = await createDetector();
  return detector.detect(el);
}

export default { open, scan };
