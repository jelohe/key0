export async function createDetector() {
  const BarcodeDetector = window.BarcodeDetector;
  if (!BarcodeDetector) {
    const mod = await import('barcode-detector/polyfill');
    window.BarcodeDetector = window.BarcodeDetector || mod.BarcodeDetector;
  }
  return new window.BarcodeDetector({ formats: ['qr_code'] });
}
