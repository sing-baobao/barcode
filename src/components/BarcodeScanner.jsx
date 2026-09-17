import React, { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function BarcodeScanner() {
  const [scanResult, setScanResult] = useState('Awaiting scan...');
  const videoRef = useRef(null);
  const readerRef = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    const codeReader = readerRef.current;
    
    // Start decoding from video constraints (preferring rear camera on mobile)
    codeReader.decodeFromConstraints(
      { audio: false, video: { facingMode: 'environment' } },
      videoRef.current,
      (result, error) => {
        if (result) {
          setScanResult(result.getText());
        }
      }
    ).catch((err) => {
      console.error(err);
      setScanResult('Camera permission denied or unavailable.');
    });

    // Cleanup camera stream when component unmounts
    return () => {
      codeReader.reset();
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '400px', overflow: 'hidden', borderRadius: '8px', background: '#000' }}>
        <video ref={videoRef} style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
      <div style={{ padding: '1rem', background: '#f4f4f5', borderRadius: '6px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <strong>Scanned Text:</strong> <span style={{ color: '#2563eb' }}>{scanResult}</span>
      </div>
    </div>
  );
}