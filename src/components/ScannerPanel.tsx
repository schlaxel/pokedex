import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import type { ScanStatus } from "../types";

type ScannerPanelProps = {
  onScan: (value: string) => void;
  onError: (message: string) => void;
  status: ScanStatus;
};

function getScannerErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "Camera access was blocked. Please allow camera permission and reopen the scanner.";
    }

    if (error.name === "NotFoundError") {
      return "No camera was found on this device.";
    }

    if (error.name === "NotReadableError") {
      return "The camera is already in use by another app.";
    }
  }

  return "The camera could not be started. Try the manual code field below.";
}

export function ScannerPanel({ onScan, onError, status }: ScannerPanelProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    let active = true;
    let stopScanner: (() => void) | undefined;
    let mediaStream: MediaStream | undefined;

    async function start() {
      try {
        if (!navigator.mediaDevices?.getUserMedia || !videoRef.current) {
          onError(
            "Camera scanning is unavailable here. Try Chrome/Safari directly, or use HTTPS on your phone.",
          );
          return;
        }

        if (!window.isSecureContext && window.location.hostname !== "localhost") {
          onError(
            "Camera access needs HTTPS on phones. Open this over HTTPS or test in a normal browser on localhost.",
          );
          return;
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
          },
          audio: false,
        });

        const controls = await reader.decodeFromStream(
          mediaStream,
          videoRef.current,
          (result, error) => {
            if (!active) {
              return;
            }

            if (result) {
              onScan(result.getText());
            }

            if (error && !(error instanceof NotFoundException)) {
              console.error(error);
            }
          },
        );
        stopScanner = () => {
          controls.stop();
          mediaStream?.getTracks().forEach((track) => track.stop());
        };
      } catch (error) {
        console.error(error);
        onError(getScannerErrorMessage(error));
      }
    }

    void start();

    return () => {
      active = false;
      stopScanner?.();
      mediaStream?.getTracks().forEach((track) => track.stop());
    };
  }, [onError, onScan]);

  return (
    <div className="scanner-panel">
      <div className="scanner-panel__video-wrap">
        <video ref={videoRef} className="scanner-panel__video" muted playsInline />
      </div>
      <div className={`scan-status scan-status--${status.kind}`}>
        {status.kind === "idle" ? "Point the camera at a QR code." : status.message}
      </div>
    </div>
  );
}
