import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import { T } from "../../ui/theme";
import { Button, Icon } from "../../ui/components";

const COLOURS = ["#1D4ED8", "#0F1D35", "#B91C1C", "#15803D"];

/**
 * A pen layer over the question image. Strokes are kept in image pixel
 * coordinates so the drawing stays aligned when the page is resized, and so
 * the export (question + ink) is at the image's own resolution.
 *
 * ref.exportCanvas() -> an HTMLCanvasElement with the question and the ink.
 * ref.isEmpty() -> no strokes yet.
 */
const DrawCanvas = forwardRef(function DrawCanvas({ src, width, height, active, onChange }, ref) {
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const strokes = useRef([]);        // [{ colour, size, eraser, points: [[x,y],...] }]
  const current = useRef(null);
  const [colour, setColour] = useState(COLOURS[0]);
  const [size, setSize] = useState(3);
  const [eraser, setEraser] = useState(false);
  const [, bump] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useImperativeHandle(ref, () => ({
    /**
     * The question with the ink on top, at image resolution. If the image host
     * does not allow cross-origin reads the canvas would be tainted, so fall
     * back to the ink alone on white and say so: { canvas, inkOnly }.
     */
    async exportCanvas() {
      const c = document.createElement("canvas");
      c.width = width; c.height = height;
      const ctx = c.getContext("2d");
      ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height);
      let inkOnly = false;
      try {
        const img = await loadCors(src);
        ctx.drawImage(img, 0, 0, width, height);
        paint(ctx, 1);
        c.toDataURL("image/jpeg", 0.5);           // throws if tainted
      } catch {
        inkOnly = true;
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, width, height);
        paint(ctx, 1);
      }
      return { canvas: c, inkOnly };
    },
    isEmpty() { return strokes.current.length === 0; },
    clear() { strokes.current = []; redraw(); onChange && onChange(0); },
  }));

  const paint = (ctx, scale) => {
    for (const s of strokes.current.concat(current.current ? [current.current] : [])) {
      if (s.points.length === 0) continue;
      ctx.save();
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.lineWidth = s.size * scale * (s.eraser ? 6 : 1);
      ctx.strokeStyle = s.eraser ? "#fff" : s.colour;
      ctx.globalCompositeOperation = s.eraser ? "destination-out" : "source-over";
      ctx.beginPath();
      ctx.moveTo(s.points[0][0] * scale, s.points[0][1] * scale);
      if (s.points.length === 1) ctx.lineTo(s.points[0][0] * scale + 0.1, s.points[0][1] * scale);
      for (let i = 1; i < s.points.length; i++) ctx.lineTo(s.points[i][0] * scale, s.points[i][1] * scale);
      ctx.stroke();
      ctx.restore();
    }
  };

  const redraw = () => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    ctx.clearRect(0, 0, cv.width, cv.height);
    paint(ctx, cv.width / width);
  };

  // Keep the overlay the same displayed size as the image, at device resolution
  useEffect(() => {
    const cv = canvasRef.current, img = imgRef.current;
    if (!cv || !img) return undefined;
    const fit = () => {
      const r = img.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
      cv.style.width = `${r.width}px`; cv.style.height = `${r.height}px`;
      redraw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(img);
    return () => ro.disconnect();
    // eslint-disable-next-line
  }, [loaded, width, height]);

  const toImage = (e) => {
    const cv = canvasRef.current;
    const r = cv.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * width, ((e.clientY - r.top) / r.height) * height];
  };

  const down = (e) => {
    if (!active) return;
    e.preventDefault();
    canvasRef.current.setPointerCapture(e.pointerId);
    current.current = { colour, size: size * (width / 1100), eraser, points: [toImage(e)] };
    redraw();
  };
  const move = (e) => {
    if (!current.current) return;
    e.preventDefault();
    current.current.points.push(toImage(e));
    redraw();
  };
  const up = (e) => {
    if (!current.current) return;
    strokes.current.push(current.current);
    current.current = null;
    redraw(); bump(n => n + 1);
    onChange && onChange(strokes.current.length);
  };
  const undo = () => { strokes.current.pop(); redraw(); bump(n => n + 1); onChange && onChange(strokes.current.length); };

  const tool = (on, onClick, label, children, key) => (
    <button key={key} type="button" onClick={onClick} aria-label={label} title={label}
      style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${on ? T.ink : T.border}`, background: on ? T.ink : T.card, color: on ? "#fff" : T.ink, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", padding: 0 }}>
      {children}
    </button>
  );

  const sizeButtons = [2, 3, 5].map(s => tool(!eraser && size === s, () => { setSize(s); setEraser(false); }, `Pen size ${s}`,
    <span style={{ width: s * 2 + 2, height: s * 2 + 2, borderRadius: "50%", background: "currentColor" }} />, `size${s}`));
  const eraserButton = tool(eraser, () => setEraser(e => !e), "Eraser", <span style={{ fontSize: 11, fontWeight: 700 }}>Er</span>, "eraser");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {active && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", padding: "8px 10px", background: T.soft, borderRadius: T.radiusSm, position: "sticky", top: 70, zIndex: 5 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.muted, marginRight: 4 }}>Pen</span>
          {COLOURS.map(c => (
            <button key={c} type="button" onClick={() => { setColour(c); setEraser(false); }} aria-label={`Pen colour ${c}`}
              style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: `3px solid ${!eraser && colour === c ? "#fff" : "transparent"}`, boxShadow: !eraser && colour === c ? `0 0 0 2px ${c}` : "none", cursor: "pointer", padding: 0 }} />
          ))}
          <span style={{ width: 1, height: 22, background: T.border, margin: "0 4px" }} />
          {sizeButtons}
          {eraserButton}
          <span style={{ width: 1, height: 22, background: T.border, margin: "0 4px" }} />
          <Button size="sm" onClick={undo} disabled={strokes.current.length === 0}>Undo</Button>
          <Button size="sm" variant="ghost" onClick={() => { strokes.current = []; redraw(); bump(n => n + 1); onChange && onChange(0); }} disabled={strokes.current.length === 0}>Clear</Button>
          <span style={{ marginLeft: "auto", fontSize: 12, color: T.muted, display: "flex", alignItems: "center", gap: 6 }}><Icon name="pencil" size={13} /> Draw straight on the question</span>
        </div>
      )}
      <div style={{ position: "relative", lineHeight: 0, borderRadius: T.radiusSm, overflow: "hidden", border: `1px solid ${T.border}`, background: "#fff" }}>
        <img ref={imgRef} src={src} alt="Exam question" width={width} height={height} onLoad={() => setLoaded(true)}
          style={{ width: "100%", height: "auto", display: "block", userSelect: "none" }} draggable={false} />
        <canvas ref={canvasRef}
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={(e) => { if (current.current) up(e); }}
          style={{ position: "absolute", inset: 0, touchAction: active ? "none" : "auto", cursor: active ? (eraser ? "cell" : "crosshair") : "default", pointerEvents: active ? "auto" : "none" }} />
      </div>
    </div>
  );
});

function loadCors(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("cors"));
    img.src = url;
  });
}

export default DrawCanvas;
