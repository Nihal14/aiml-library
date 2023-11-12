import React, { useEffect, useState } from 'react';
import {
  Html5QrcodeScanner,
  Html5QrcodeScanType,
  Html5QrcodeSupportedFormats
} from 'html5-qrcode';

export default function Temp() {
  const [scanResult, setScanResult] = useState(null);
  const [scannerInstance, setScannerInstance] = useState(null);
  const [isScanning, setIsScanning] = useState(true); // Added isScanning state

  const startScanner = () => {
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 2,
      supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
      formatsToSupport: [Html5QrcodeSupportedFormats.CODE_39]
    });
    scanner.render(success, error);
    setScannerInstance(scanner);
  };

  const success= (result) =>  {
    if (isScanning) {
      console.log(result);
      setScanResult(result);
      setIsScanning(false);
      document.getElementById('close').click();
    }
  }

  const error= (result) =>  {
    console.warn(result);
  }

  const closeScanner = () => {
    if (scannerInstance) {
      scannerInstance.clear();
      setScannerInstance(null);
      setIsScanning(true); // Reset isScanning to true when closing the scanner
    }
  };

  return (
    <>
      <h1>Bar Code Scanner</h1>
      <button onClick={startScanner}>Start Scanner</button>
      <button onClick={closeScanner} id='close'> Close Scanner</button>
      {scanResult ? (
        <h1>{scanResult}</h1>
      ) : (
        <div id='reader' className='w-1/2 mx-auto'></div>
      )}
    </>
  );
}
