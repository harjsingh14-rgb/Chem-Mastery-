import React, { useState } from "react";
import { MECHS } from "../data/mechanisms";
import track from "../utils/track";

export default function MechanismsTab({ hasFullAccess, FREE_MECH_COUNT, logActivity, LockedOverlay }) {
  const [mechId, setMechId] = useState(null);
  const [mechStep, setMechStep] = useState(0);
  const [mechOpenCards, setMechOpenCards] = useState({});

  const activeMech = mechId ? MECHS.find(m => m.id === mechId) : null;

  if (!activeMech) return (
    <div style={{ padding:"16px", flex:1, overflowY:"auto" }}>
      <style>{`@keyframes mechFadeIn{from{opacity:0}to{opacity:1}}`}</style>
      <p style={{ color:"#475569", fontSize:"15px", marginBottom:"20px", lineHeight:1.6 }}>
        Handdrawn curly-arrow mechanisms with interactive explanations. Tap a mechanism to start.
      </p>
      {Object.entries(
        MECHS.reduce((acc,m)=>{ (acc[m.category]=acc[m.category]||[]).push(m); return acc; }, {})
      ).map(([cat, list]) => (
        <div key={cat} style={{ marginBottom:"22px" }}>
          <div style={{ fontSize:"13px", fontWeight:800, color:"#0f1d35", textTransform:"uppercase", letterSpacing:"1.2px", marginBottom:"10px", borderBottom:"2px solid #e2e8f0", paddingBottom:"6px" }}>{cat}</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
            {list.map((m, mIdx) => {
              const mechLocked = !hasFullAccess && mIdx >= FREE_MECH_COUNT;
              const hasImages = m.hasHanddrawn;
              return (
              <button key={m.id} onClick={()=>{ if (!mechLocked) { setMechId(m.id); setMechStep(0); setMechOpenCards({}); track("view_mechanism", { mechanism: m.id, title: m.title }); logActivity("mechanism"); } }}
                style={{ background:"#ffffff", border:`2px solid ${m.color}30`, borderRadius:"14px",
                  padding:"16px 18px", textAlign:"left", cursor: mechLocked ? "default" : "pointer", fontFamily:"inherit",
                  boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"border-color 0.2s", position:"relative", overflow:"hidden",
                  opacity: hasImages ? 1 : 0.5 }}>
                {mechLocked && <LockedOverlay />}
                <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                  <div style={{ width:"12px", height:"12px", borderRadius:"50%", background:m.color, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:"16px", fontWeight:700, color:"#0f1d35", marginBottom:"4px", lineHeight:1.3 }}>{m.title}</div>
                    <div style={{ fontSize:"14px", color:"#475569", fontFamily:"'DM Sans',system-ui,sans-serif", letterSpacing:"0.3px" }}>{m.subtitle}</div>
                  </div>
                  <div style={{ display:"flex", gap:"5px", flexShrink:0 }}>
                    {!hasImages && <span style={{ fontSize:"11px", fontWeight:700, background:"#f59e0b20", color:"#d97706", padding:"3px 8px", borderRadius:"8px" }}>SOON</span>}
                    {m.specs.map(s=><span key={s} style={{ fontSize:"11px", fontWeight:700, background:`${m.color}15`, color:m.color, padding:"3px 8px", borderRadius:"8px" }}>{s.replace("_"," ")}</span>)}
                  </div>
                </div>
              </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  if (activeMech.hasHanddrawn) {
    const images = activeMech.handdrawnImages || [];
    const explainers = activeMech.explainers || [];
    const hasMultipleImages = images.length > 1;

    return (
      <div style={{ padding:"0", flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
        <style>{`@keyframes mechFadeIn{from{opacity:0}to{opacity:1}}`}</style>

        <div style={{ padding:"12px 16px 8px", display:"flex", alignItems:"center", gap:"10px", borderBottom:"1px solid #e8edf3" }}>
          <button onClick={()=>{ setMechId(null); setMechStep(0); setMechOpenCards({}); }}
            style={{ background:"#f0f4f8", border:"1px solid #dde4ed", borderRadius:"8px", padding:"6px 12px",
              color:"#29ABE2", cursor:"pointer", fontSize:"12px", fontFamily:"inherit", fontWeight:600 }}>
            ← Back
          </button>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"22px", fontWeight:800, color:"#0f1d35", letterSpacing:"-0.3px" }}>{activeMech.title}</div>
            <div style={{ fontSize:"15px", color:"#475569", fontFamily:"'DM Sans',system-ui,sans-serif", fontWeight:500, marginTop:"2px" }}>{activeMech.subtitle}</div>
          </div>
        </div>

        {hasMultipleImages && (
          <div style={{ display:"flex", gap:"6px", padding:"10px 16px 4px", overflowX:"auto" }}>
            {images.map((img, idx) => (
              <button key={idx} onClick={()=>setMechStep(idx)}
                style={{ padding:"7px 14px", borderRadius:"20px", border:"none", cursor:"pointer",
                  fontFamily:"inherit", fontSize:"12px", fontWeight:700, whiteSpace:"nowrap",
                  background: mechStep === idx ? activeMech.color : "#f0f4f8",
                  color: mechStep === idx ? "#fff" : "#4a6080",
                  transition:"all 0.2s" }}>
                {img.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display:"flex", gap:"16px", padding:"10px 16px 24px", flex:1, minHeight:0 }}>
          <div key={`mech-img-${mechStep}`} style={{ flex:"1 1 55%", minWidth:0, background:"#fff", border:"1.5px solid #e2e8f0",
            borderRadius:"16px", padding:"12px", overflow:"hidden", animation:"mechFadeIn 0.3s ease", alignSelf:"flex-start" }}>
            <img
              src={process.env.PUBLIC_URL + images[Math.min(mechStep, images.length - 1)].src}
              alt={activeMech.title}
              style={{ width:"100%", height:"auto", display:"block", borderRadius:"10px" }}
            />
          </div>

          <div style={{ flex:"1 1 45%", minWidth:0, display:"flex", flexDirection:"column", gap:"8px", overflowY:"auto" }}>
            <div style={{ fontSize:"13px", fontWeight:800, color:"#64748b", textTransform:"uppercase", letterSpacing:"1.5px", marginBottom:"6px" }}>
              Tap to learn each part
            </div>
            {explainers.map((ex, idx) => {
              const isOpen = mechOpenCards[idx];
              const stepColors = ["#29ABE2", "#059669", "#d97706", "#dc2626", "#7c3aed", "#0284c7", "#ea580c", "#0d9488"];
              const circleColor = stepColors[idx % stepColors.length];
              return (
                <button key={idx} onClick={()=> setMechOpenCards(prev => ({ ...prev, [idx]: !prev[idx] }))}
                  style={{ background: isOpen ? `${circleColor}08` : "#fff",
                    border: isOpen ? `2px solid ${circleColor}40` : "1.5px solid #e2e8f0",
                    borderRadius:"12px", padding:"10px 14px", textAlign:"left", cursor:"pointer",
                    fontFamily:"inherit", transition:"all 0.2s" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                    <div style={{ width:"26px", height:"26px", borderRadius:"50%", flexShrink:0,
                      background: circleColor,
                      color: "#fff",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:"12px", fontWeight:800, transition:"all 0.2s" }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex:1, fontSize:"13px", fontWeight:700, color:"#1a2d45", lineHeight:1.3 }}>
                      {ex.title}
                    </div>
                    <div style={{ fontSize:"14px", color:"#94a3b8", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition:"transform 0.2s", flexShrink:0 }}>
                      ▼
                    </div>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop:"8px", paddingTop:"8px", borderTop:`1px solid ${circleColor}20`,
                      fontSize:"13px", color:"#475569", lineHeight:1.65, fontWeight:400,
                      animation:"mechFadeIn 0.2s ease" }}>
                      {ex.text}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding:"40px 24px", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
      <div style={{ fontSize:"48px", marginBottom:"16px" }}>🧪</div>
      <div style={{ fontSize:"22px", fontWeight:800, color:"#0f1d35", marginBottom:"8px" }}>Handdrawn Explanation Coming Soon</div>
      <div style={{ fontSize:"15px", color:"#64748b", lineHeight:1.6, maxWidth:"400px" }}>
        The handdrawn step-by-step explanation of this mechanism is being built. Check back soon!
      </div>
      <button onClick={()=>{ setMechId(null); setMechStep(0); }}
        style={{ marginTop:"20px", padding:"10px 24px", borderRadius:"12px", border:"none", cursor:"pointer",
          background:"#29ABE2", color:"#fff", fontSize:"14px", fontWeight:700, fontFamily:"inherit" }}>
        ← Back to List
      </button>
    </div>
  );
}
