// A profile picture: shown as an Avatar, with a button to choose a photo from
// the device. The photo is squared, shrunk to 192px and stored as a small
// JPEG data URL in users.photoURL, so no file storage is involved and every
// list that already shows an Avatar picks it up.
import React, { useRef, useState } from "react";
import { T } from "../ui/theme";
import { Avatar, Button } from "../ui/components";

const SIZE = 192;

/** Read an image file and return a square JPEG data URL (about 10 to 20 KB). */
export function fileToAvatarDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) { reject(new Error("Please choose a photo (JPEG, PNG or HEIC)")); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      try {
        const side = Math.min(img.naturalWidth, img.naturalHeight);
        const sx = (img.naturalWidth - side) / 2, sy = (img.naturalHeight - side) / 2;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE; canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, SIZE, SIZE);
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
        const out = canvas.toDataURL("image/jpeg", 0.82);
        URL.revokeObjectURL(url);
        if (out.length > 120000) reject(new Error("That photo could not be made small enough. Try a different one."));
        else resolve(out);
      } catch (e) { reject(new Error("Could not read that photo")); }
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read that photo. Try a JPEG or PNG.")); };
    img.src = url;
  });
}

/**
 * onSave(dataUrlOrNull) saves the picture (or removes it). canEdit false just
 * shows the avatar.
 */
export default function PhotoUpload({ name, email, photoURL, size = 96, canEdit = true, onSave, align = "center" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  const pick = async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true); setErr(null);
    try { await onSave(await fileToAvatarDataUrl(file)); } catch (x) { setErr(x.message || "Could not save the photo"); }
    setBusy(false);
  };
  const remove = async () => {
    setBusy(true); setErr(null);
    try { await onSave(null); } catch (x) { setErr(x.message || "Could not remove the photo"); }
    setBusy(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: align, gap: 8 }}>
      <div style={{ borderRadius: "50%", padding: 3, background: T.card, border: `1px solid ${T.border}` }}>
        <Avatar name={name} email={email} photoURL={photoURL} size={size} />
      </div>
      {canEdit && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: align }}>
          <input ref={inputRef} type="file" accept="image/*" onChange={pick} style={{ display: "none" }} aria-label="Choose a photo" />
          <Button size="sm" disabled={busy} onClick={() => inputRef.current && inputRef.current.click()}>{busy ? "Saving…" : photoURL ? "Change photo" : "Add photo"}</Button>
          {photoURL && <Button size="sm" variant="ghost" disabled={busy} onClick={remove}>Remove</Button>}
        </div>
      )}
      {err && <span style={{ fontSize: 12, color: T.red, textAlign: "center" }}>{err}</span>}
    </div>
  );
}
