import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { findByBarcode, products } from "@/lib/products";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Scan a barcode | Nutrixon" },
      { name: "description", content: "Scan or type a product barcode to see its junk percentage and approval status." },
      { property: "og:title", content: "Scan a barcode | Nutrixon" },
      { property: "og:description", content: "Scan or type a product barcode to see its junk percentage and approval status." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ScanPage,
});

type Detector = { detect: (v: HTMLVideoElement) => Promise<{ rawValue: string }[]> };

function ScanPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);

  const lookup = useCallback(
    (value: string) => {
      const p = findByBarcode(value);
      if (p) navigate({ to: "/products/$id", params: { id: p.id } });
      else setMessage(`No product found for barcode ${value || "(empty)"}. Try one of the samples below.`);
    },
    [navigate],
  );

  const stop = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setScanning(false);
  }, []);

  useEffect(() => stop, [stop]);

  async function start() {
    setMessage("");
    const BD = (window as unknown as { BarcodeDetector?: new (o: object) => Detector }).BarcodeDetector;
    if (!BD || !navigator.mediaDevices?.getUserMedia) {
      setMessage("Camera scanning isn't supported in this browser. Please type the barcode instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      streamRef.current = stream;
      setScanning(true);
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      const detector = new BD({ formats: ["ean_13", "ean_8", "upc_a", "code_128"] });
      const tick = async () => {
        try {
          const found = await detector.detect(video);
          if (found[0]) {
            stop();
            lookup(found[0].rawValue);
            return;
          }
        } catch {
          /* keep trying */
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      stop();
      setMessage("Couldn't open the camera. Allow camera access or type the barcode instead.");
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Scan a barcode</h1>
      <p className="mt-2 text-muted-foreground">Point your camera at the barcode on the pack, or type the number.</p>

      <div className="card-surface mt-6 overflow-hidden p-5">
        <div className={scanning ? "mb-4 overflow-hidden rounded-xl bg-hero" : "hidden"}>
          <video ref={videoRef} playsInline muted className="aspect-video w-full object-cover" />
        </div>
        {scanning ? (
          <button onClick={stop} className="w-full rounded-full border px-5 py-3 text-sm font-semibold hover:bg-secondary">
            Stop camera
          </button>
        ) : (
          <button
            onClick={start}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Open camera and scan
          </button>
        )}

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>

        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            lookup(code);
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="e.g. 8901234500028"
            aria-label="Barcode number"
            className="min-w-0 flex-1 rounded-full border bg-background px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring"
          />
          <button className="rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-accent-foreground hover:opacity-90">
            Look up
          </button>
        </form>
        {message && <p className="mt-3 text-sm text-bad">{message}</p>}
      </div>

      <h2 className="mt-8 text-sm font-bold uppercase tracking-wider text-muted-foreground">Try a sample</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {products.slice(0, 6).map((p) => (
          <button
            key={p.id}
            onClick={() => lookup(p.barcode)}
            className="rounded-full border bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"
          >
            {p.barcode} · {p.name}
          </button>
        ))}
      </div>
    </div>
  );
}
