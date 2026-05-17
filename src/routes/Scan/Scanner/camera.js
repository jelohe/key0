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

async function scan(el) {
  const BarcodeDetector = window.BarcodeDetector;
  if (!BarcodeDetector) {
    try {
      const mod = await import('barcode-detector/polyfill');
      window.BarcodeDetector = window.BarcodeDetector || mod.BarcodeDetector;
    } catch {
      throw new Error('BarcodeDetector not available in this browser');
    }
  }
  const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
  return detector.detect(el);
}

export default { open, scan };
