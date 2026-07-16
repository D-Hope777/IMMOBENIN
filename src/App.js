import React, { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// SUPABASE CONFIG
// ============================================================
const SUPABASE_URL = "https://frfltrcvilohwzsagkyf.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Vi37xSbxZuPhmhZfkm3pQg_44lcUroe";

// ============================================================
// NUMÉROS DE PAIEMENT — Remplissez quand vous avez le numéro,
// laissez "" (vide) pour les méthodes pas encore actives.
// Elles n'apparaîtront pas sur le site jusqu'à ce qu'un numéro soit renseigné.
// ============================================================
const PAYMENT_METHODS = [
  { id: "mtn", label: "MTN Mobile Money", number: "01 69 13 58 60", color: "#FFCC00", textColor: "#040C13" },
  { id: "moov", label: "Moov Money", number: "", color: "#0099CC", textColor: "#fff" },
  { id: "wave", label: "Wave", number: "", color: "#1DC9E8", textColor: "#040C13" },
  { id: "celtiis", label: "Celtiis Money", number: "", color: "#E30613", textColor: "#fff" },
].filter(m => m.number); // n'affiche que les méthodes avec un numéro renseigné

const LOGO_ICON = "data:image/png;base64,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";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80";
const MAX_PHOTOS = 8;
const MAX_SIZE_MB = 5;

// ============================================================
// TARIFICATION — modifiez ces deux valeurs pour ajuster les prix
// (ex: promotion temporaire à 1000 F CFA)
// ============================================================
const PRICE_STANDARD = 500;  // PROMO LANCEMENT — publication 60 jours
const PRICE_FEATURED = 5000;  // supplément mise en vedette
const PRICE_TOTAL_FEATURED = PRICE_STANDARD + PRICE_FEATURED;

// ============================================================
// SERVICE CONCIERGE — vérification sur place par un agent mandaté
// ============================================================
const CONCIERGE_FIXED_CITIES = ["Cotonou", "Abomey-Calavi"];
const CONCIERGE_FIXED_PRICE = 35000;

const DEMO_LISTINGS = [
  { id:"1", is_featured:true, type:"Vente", category:"Villa", title:"Villa moderne à Fidjrossè", price:85000000, city:"Cotonou", neighborhood:"Fidjrossè", bedrooms:4, bathrooms:3, area:320, images:["https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600&q=80","https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=600&q=80","https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"], agents:{full_name:"Rodrigue Kossou",phone:"22997001122",agency_name:"Kossou Immobilier"}, created_at:new Date().toISOString(), is_active:true },
  { id:"2", is_featured:true, type:"Location", category:"Appartement", title:"Appart meublé résidence gardée", price:250000, city:"Cotonou", neighborhood:"Cadjehoun", bedrooms:2, bathrooms:1, area:90, images:["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80","https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80"], agents:{full_name:"Aïcha Hounsou",phone:"22996112233",agency_name:null}, created_at:new Date().toISOString(), is_active:true },
  { id:"3", is_featured:false, type:"Vente", category:"Terrain", title:"Terrain titré à Abomey-Calavi", price:18000000, city:"Abomey-Calavi", neighborhood:null, bedrooms:null, bathrooms:null, area:600, images:["https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80"], agents:{full_name:"Edmond Zinsou",phone:"22994556677",agency_name:null}, created_at:new Date().toISOString(), is_active:true },
  { id:"4", is_featured:false, type:"Location", category:"Bureau", title:"Bureau climatisé centre-ville", price:180000, city:"Cotonou", neighborhood:"Ganhi", bedrooms:null, bathrooms:1, area:55, images:["https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80","https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80"], agents:{full_name:"Patricia Dossou",phone:"22991234567",agency_name:"Dossou Properties"}, created_at:new Date().toISOString(), is_active:true },
  { id:"5", is_featured:false, type:"Vente", category:"Maison", title:"Maison F5 à Akpakpa", price:32000000, city:"Cotonou", neighborhood:"Akpakpa", bedrooms:5, bathrooms:2, area:200, images:["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80","https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80"], agents:{full_name:"Comlan Agbessi",phone:"22998877665",agency_name:null}, created_at:new Date().toISOString(), is_active:true },
  { id:"6", is_featured:false, type:"Location", category:"Villa", title:"Villa avec piscine à Sèmè", price:600000, city:"Sèmè-Kpodji", neighborhood:null, bedrooms:3, bathrooms:2, area:250, images:["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&q=80","https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=600&q=80"], agents:{full_name:"Nadège Houngbo",phone:"22993344556",agency_name:null}, created_at:new Date().toISOString(), is_active:true },
];

// ============================================================
// SUPABASE CLIENT
// ============================================================
const db = {
  get: (table, params="") => fetch(`${SUPABASE_URL}/rest/v1/${table}${params}`, {
    headers:{ apikey:SUPABASE_ANON_KEY, Authorization:`Bearer ${SUPABASE_ANON_KEY}` }
  }).then(r=>r.json()),
  post: (table, body) => fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method:"POST",
    headers:{ apikey:SUPABASE_ANON_KEY, Authorization:`Bearer ${SUPABASE_ANON_KEY}`, "Content-Type":"application/json", Prefer:"return=representation" },
    body:JSON.stringify(body)
  }).then(r=>r.json()),
  uploadImage: async (file, path) => {
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/Listing-Images/${path}`, {
      method:"POST",
      headers:{ apikey:SUPABASE_ANON_KEY, Authorization:`Bearer ${SUPABASE_ANON_KEY}`, "Content-Type": file.type },
      body: file
    });
    if (!res.ok) {
      const body = await res.text().catch(()=>"");
      throw new Error(`HTTP ${res.status} ${res.statusText} — ${body.slice(0,150)}`);
    }
    return `${SUPABASE_URL}/storage/v1/object/public/Listing-Images/${path}`;
  }
};

// ============================================================
// IMAGE COMPRESSION (client-side, no library needed)
// ============================================================
function compressImage(file, maxW=1200, quality=0.82) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        URL.revokeObjectURL(url);
        resolve(new File([blob], file.name, { type: "image/jpeg" }));
      }, "image/jpeg", quality);
    };
    img.src = url;
  });
}

function readAsDataURL(file) {
  return new Promise(res => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.readAsDataURL(file);
  });
}

// ============================================================
// HELPERS
// ============================================================
function formatPrice(price, type) {
  return type==="Location" ? `${Number(price).toLocaleString("fr-FR")} F CFA/mois` : `${Number(price).toLocaleString("fr-FR")} F CFA`;
}
const CATEGORIES = ["Tous","Vente","Location","Terrain","Bureau"];
const CITIES = ["Toutes villes","Cotonou","Abomey-Calavi","Porto-Novo","Parakou","Sèmè-Kpodji","Djougou","Bohicon","Natitingou","Lokossa","Ouidah","Abomey","Kandi","Pobè","Savè","Kpomassè","Comè","Aplahoué","Dassa-Zoumè","Allada","Malanville","Sakété","Tchaourou","Nikki","Cové","Banikoara","Ifangni","Toffo"];

// ============================================================
// PHOTO UPLOADER COMPONENT
// ============================================================
function PhotoUploader({ photos, onChange }) {
  const dropRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const processFiles = useCallback(async (files) => {
    setErrors([]);
    const newErrors = [];
    const incoming = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) { newErrors.push(`${file.name} : format non supporté`); continue; }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) { newErrors.push(`${file.name} : taille max ${MAX_SIZE_MB} Mo`); continue; }
      if (photos.length + incoming.length >= MAX_PHOTOS) { newErrors.push(`Maximum ${MAX_PHOTOS} photos autorisées`); break; }
      const compressed = await compressImage(file);
      const preview = await readAsDataURL(compressed);
      incoming.push({ file: compressed, preview, id: Date.now() + Math.random() });
    }
    if (newErrors.length) setErrors(newErrors);
    if (incoming.length) onChange([...photos, ...incoming]);
  }, [photos, onChange]);

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const removePhoto = (id) => onChange(photos.filter(p => p.id !== id));

  const movePhoto = (fromIdx, toIdx) => {
    const arr = [...photos];
    const [item] = arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, item);
    onChange(arr);
  };

  const dragPhoto = useRef(null);

  return (
    <div>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:scale(0.95)} to{opacity:1;transform:scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .photo-thumb { animation: fadeIn 0.25s ease; }
        .photo-thumb:hover .remove-btn { opacity:1!important; }
      `}</style>

      {/* Drop Zone */}
      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => document.getElementById("photo-file-input").click()}
        style={{
          border: `2px dashed ${dragging ? "#005F2E" : "#D0C8C0"}`,
          borderRadius: 14,
          padding: "28px 20px",
          textAlign: "center",
          cursor: "pointer",
          background: dragging ? "#FFF0EB" : "#FAFAF8",
          transition: "all 0.2s",
          marginBottom: 14
        }}
      >
        <div style={{ fontSize: 36, marginBottom: 8 }}>📸</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15, color: "#040C13", marginBottom: 4 }}>
          {dragging ? "Déposez ici !" : "Glissez vos photos ici"}
        </div>
        <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: "#5F6B74" }}>
          ou cliquez pour sélectionner • JPG, PNG, WEBP • Max {MAX_SIZE_MB} Mo/photo • {photos.length}/{MAX_PHOTOS} photos
        </div>
        <input
          id="photo-file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={e => processFiles(e.target.files)}
          style={{ display: "none" }}
        />
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div style={{ background: "#FFEBEE", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
          {errors.map((e, i) => (
            <div key={i} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: "#C62828" }}>⚠️ {e}</div>
          ))}
        </div>
      )}

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div>
          <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 12, color: "#5F6B74", marginBottom: 8 }}>
            🖱️ Glissez pour réorganiser · La 1ère photo est la photo principale
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 8 }}>
            {photos.map((photo, idx) => (
              <div
                key={photo.id}
                className="photo-thumb"
                draggable
                onDragStart={() => { dragPhoto.current = idx; }}
                onDragOver={e => { e.preventDefault(); }}
                onDrop={e => { e.preventDefault(); e.stopPropagation(); if (dragPhoto.current !== null && dragPhoto.current !== idx) { movePhoto(dragPhoto.current, idx); dragPhoto.current = null; } }}
                style={{
                  position: "relative",
                  borderRadius: 10,
                  overflow: "hidden",
                  aspectRatio: "1",
                  border: idx === 0 ? "3px solid #005F2E" : "2px solid #E0DDD8",
                  cursor: "grab",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
              >
                <img src={photo.preview} alt={`${idx+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
                {idx === 0 && (
                  <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"rgba(0,95,46,0.85)", fontSize:9, fontWeight:700, color:"#fff", textAlign:"center", padding:"3px 0", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
                    PRINCIPALE
                  </div>
                )}
                <button
                  className="remove-btn"
                  onClick={e => { e.stopPropagation(); removePhoto(photo.id); }}
                  style={{
                    position:"absolute", top:4, right:4, width:22, height:22,
                    borderRadius:"50%", background:"rgba(0,0,0,0.7)", border:"none",
                    color:"#fff", fontSize:12, cursor:"pointer", display:"flex",
                    alignItems:"center", justifyContent:"center",
                    opacity: 0, transition:"opacity 0.2s"
                  }}
                >✕</button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <div
                onClick={() => document.getElementById("photo-file-input").click()}
                style={{
                  borderRadius: 10, border: "2px dashed #D0C8C0", aspectRatio:"1",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  cursor:"pointer", background:"#FAFAF8", color:"#AAA", fontSize:22
                }}
              >
                <div>+</div>
                <div style={{ fontSize:9, fontFamily:"'Plus Jakarta Sans',sans-serif", marginTop:2 }}>Ajouter</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PHOTO GALLERY (in listing detail modal)
// ============================================================
function PhotoGallery({ images }) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) return (
    <img src={FALLBACK_IMG} alt="listing" style={{ width:"100%", height:240, objectFit:"cover", borderRadius:"18px 18px 0 0" }} />
  );

  const prev = (e) => { e.stopPropagation(); setCurrent(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(i => (i + 1) % images.length); };

  return (
    <>
      <div style={{ position:"relative", borderRadius:"18px 18px 0 0", overflow:"hidden" }}>
        <img
          src={images[current]}
          alt={`${current+1}`}
          onClick={() => setLightbox(true)}
          style={{ width:"100%", height:260, objectFit:"cover", display:"block", cursor:"zoom-in" }}
          onError={e => { e.target.src = FALLBACK_IMG; }}
        />
        {/* Counter badge */}
        <div style={{ position:"absolute", top:12, right:12, background:"rgba(0,0,0,0.6)", color:"#fff", fontSize:11, fontWeight:600, padding:"4px 10px", borderRadius:20, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
          📷 {current+1}/{images.length}
        </div>
        {/* Arrows */}
        {images.length > 1 && <>
          <button onClick={prev} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff", width:36, height:36, borderRadius:"50%", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>‹</button>
          <button onClick={next} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff", width:36, height:36, borderRadius:"50%", fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>›</button>
        </>}
        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div style={{ position:"absolute", bottom:0, left:0, right:0, background:"linear-gradient(to top, rgba(0,0,0,0.6), transparent)", padding:"16px 12px 10px", display:"flex", gap:6, justifyContent:"center" }}>
            {images.map((img, i) => (
              <div key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                style={{ width:44, height:32, borderRadius:6, overflow:"hidden", border: i === current ? "2px solid #E78A45" : "2px solid transparent", cursor:"pointer", flexShrink:0 }}>
                <img src={img} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} onError={e => { e.target.src = FALLBACK_IMG; }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.95)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <button onClick={() => setLightbox(false)} style={{ position:"absolute", top:16, right:16, background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:40, height:40, borderRadius:"50%", fontSize:18, cursor:"pointer" }}>✕</button>
          {images.length > 1 && <>
            <button onClick={prev} style={{ position:"absolute", left:16, background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:48, height:48, borderRadius:"50%", fontSize:22, cursor:"pointer" }}>‹</button>
            <button onClick={next} style={{ position:"absolute", right:16, background:"rgba(255,255,255,0.15)", border:"none", color:"#fff", width:48, height:48, borderRadius:"50%", fontSize:22, cursor:"pointer" }}>›</button>
          </>}
          <img src={images[current]} alt="" style={{ maxWidth:"90vw", maxHeight:"88vh", borderRadius:12, objectFit:"contain" }} onClick={e => e.stopPropagation()} />
          <div style={{ position:"absolute", bottom:16, left:0, right:0, display:"flex", justifyContent:"center", gap:8 }}>
            {images.map((_,i) => <div key={i} onClick={e=>{e.stopPropagation();setCurrent(i);}} style={{ width: i===current?24:8, height:8, borderRadius:4, background: i===current?"#E78A45":"rgba(255,255,255,0.4)", cursor:"pointer", transition:"all 0.2s" }} /> )}
          </div>
        </div>
      )}
    </>
  );
}

// ============================================================
// UPLOAD PROGRESS BAR
// ============================================================
function UploadProgress({ current, total, label }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div style={{ background:"#FAF8F5", borderRadius:12, padding:"14px 16px", marginBottom:12 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:12, fontWeight:600, color:"#555" }}>{label}</span>
        <span style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:13, fontWeight:700, color:"#005F2E" }}>{pct}%</span>
      </div>
      <div style={{ height:6, background:"#E0DDD8", borderRadius:6, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:"#005F2E", borderRadius:6, transition:"width 0.3s" }} />
      </div>
      {total > 1 && (
        <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:11, color:"#5F6B74", marginTop:4 }}>
          Photo {current} sur {total} en cours d'upload...
        </div>
      )}
    </div>
  );
}

// ============================================================
// CARD
// ============================================================
function WaBtn({phone,title}) {
  const msg = encodeURIComponent(`Bonjour, je suis intéressé(e) par : "${title}" sur ImmoBénin.`);
  return (
    <a href={`https://wa.me/${phone}?text=${msg}`} target="_blank" rel="noopener noreferrer"
      style={{display:"flex",alignItems:"center",gap:6,background:"#25D366",color:"#fff",border:"none",borderRadius:8,padding:"8px 14px",fontSize:13,fontWeight:600,textDecoration:"none",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>
  );
}

function Card({l, onSelect}) {
  const img = l.images?.[0] || FALLBACK_IMG;
  const photoCount = l.images?.length || 0;
  return (
    <div onClick={()=>onSelect(l)}
      style={{background:"#fff",borderRadius:14,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.08)",cursor:"pointer",transition:"transform 0.2s,box-shadow 0.2s",border:l.is_featured?"2px solid #E78A45":"2px solid transparent",position:"relative"}}
      onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.14)"}}
      onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,0.08)"}}>
      {l.is_featured&&<div style={{position:"absolute",top:12,left:12,zIndex:2,background:"#E78A45",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>⭐ EN VEDETTE</div>}
      <div style={{position:"absolute",top:12,right:12,zIndex:2,background:l.type==="Vente"?"#005F2E":"#E78A45",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{l.type}</div>
      {photoCount > 1 && <div style={{position:"absolute",bottom:108,right:10,zIndex:2,background:"rgba(0,0,0,0.55)",color:"#fff",fontSize:11,padding:"3px 8px",borderRadius:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📷 {photoCount}</div>}
      <img src={img} alt={l.title} style={{width:"100%",height:200,objectFit:"cover"}} onError={e=>{e.target.src=FALLBACK_IMG}}/>
      <div style={{padding:"14px 14px 12px"}}>
        <div style={{fontSize:11,color:"#5F6B74",fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:3}}>{l.category} • {l.neighborhood||l.city}</div>
        <div style={{fontSize:15,fontWeight:700,color:"#040C13",fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:6,lineHeight:1.3}}>{l.title}</div>
        <div style={{fontSize:17,fontWeight:800,color:"#005F2E",fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:10}}>{formatPrice(l.price,l.type)}</div>
        <div style={{display:"flex",gap:12,fontSize:12,color:"#555",fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:12}}>
          {l.bedrooms&&<span>🛏 {l.bedrooms}</span>}
          {l.bathrooms&&<span>🚿 {l.bathrooms}</span>}
          {l.area&&<span>📐 {l.area} m²</span>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,color:"#999",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
            <strong style={{color:"#040C13"}}>{l.agents?.full_name||"Agent"}</strong><br/>
            <span style={{fontSize:11}}>{new Date(l.created_at).toLocaleDateString("fr-FR")}</span>
          </div>
          <WaBtn phone={l.agents?.phone||"22997000000"} title={l.title}/>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// DETAIL MODAL (with gallery)
// ============================================================
function DetailModal({listing,onClose,onRequestVerification}) {
  const [form,setForm]=useState({name:"",phone:"",message:""});
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  if(!listing) return null;

  const send=async()=>{
    if(!form.name||!form.phone) return;
    setSending(true);
    try { await db.post("inquiries",{listing_id:listing.id,agent_id:listing.agent_id,sender_name:form.name,sender_phone:form.phone,message:form.message||`Intéressé(e) par : ${listing.title}`,channel:"web"}); } catch(e){}
    setSending(false); setSent(true);
  };

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:18,maxWidth:600,width:"100%",maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
        {/* Gallery */}
        <PhotoGallery images={listing.images} />

        <div style={{padding:22}}>
          <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap"}}>
            <span style={{background:listing.type==="Vente"?"#005F2E":"#E78A45",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{listing.type}</span>
            <span style={{background:"#F0EDE8",color:"#555",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{listing.category}</span>
            {listing.is_featured&&<span style={{background:"#E78A45",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>⭐ En vedette</span>}
            {listing.images?.length>1&&<span style={{background:"#E8F0FE",color:"#1a73e8",fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📷 {listing.images.length} photos</span>}
          </div>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:20,fontWeight:800,color:"#040C13",marginBottom:4}}>{listing.title}</h2>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"#5F6B74",marginBottom:10}}>📍 {listing.neighborhood?`${listing.neighborhood}, `:""}{listing.city}</p>
          {listing.description&&<p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,color:"#555",lineHeight:1.6,marginBottom:12}}>{listing.description}</p>}
          <div style={{fontSize:24,fontWeight:800,color:"#005F2E",fontFamily:"'Plus Jakarta Sans',sans-serif",marginBottom:16}}>{formatPrice(listing.price,listing.type)}</div>
          <div style={{display:"flex",gap:16,marginBottom:18,padding:14,background:"#FAF8F5",borderRadius:12,flexWrap:"wrap"}}>
            {listing.bedrooms&&<div style={{textAlign:"center"}}><div style={{fontSize:20}}>🛏</div><div style={{fontSize:14,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{listing.bedrooms}</div><div style={{fontSize:11,color:"#5F6B74"}}>Chambres</div></div>}
            {listing.bathrooms&&<div style={{textAlign:"center"}}><div style={{fontSize:20}}>🚿</div><div style={{fontSize:14,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{listing.bathrooms}</div><div style={{fontSize:11,color:"#5F6B74"}}>Sdb</div></div>}
            {listing.area&&<div style={{textAlign:"center"}}><div style={{fontSize:20}}>📐</div><div style={{fontSize:14,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{listing.area}</div><div style={{fontSize:11,color:"#5F6B74"}}>m²</div></div>}
          </div>

          {/* CONCIERGE CTA */}
          <button onClick={()=>onRequestVerification?.(listing)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"12px",background:"#FFF8E1",border:"2px solid #FFCC80",borderRadius:12,color:"#7A4F01",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer",marginBottom:18}}>
            🕵️ Faire vérifier ce bien par un agent ImmoBénin
          </button>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:14,background:"#F9F9F9",borderRadius:12,marginBottom:18}}>
            <div>
              <div style={{fontSize:14,fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{listing.agents?.full_name||"Agent"}</div>
              {listing.agents?.agency_name&&<div style={{fontSize:12,color:"#5F6B74",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{listing.agents.agency_name}</div>}
            </div>
            <WaBtn phone={listing.agents?.phone||"22997000000"} title={listing.title}/>
          </div>
          <div style={{background:"#FAF8F5",borderRadius:14,padding:16,border:"1px solid #F0EDE8"}}>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,marginBottom:10}}>📩 Envoyer un message</div>
            {sent?(
              <div style={{textAlign:"center",padding:14,color:"#1C6E3D",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600}}>✅ Message envoyé ! L'agent vous contactera bientôt.</div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                <input placeholder="Votre nom *" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={{padding:"10px 12px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}/>
                <input placeholder="WhatsApp / Téléphone *" value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} style={{padding:"10px 12px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}/>
                <textarea placeholder="Votre message..." value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={3} style={{padding:"10px 12px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,resize:"vertical"}}/>
                <button onClick={send} disabled={sending||!form.name||!form.phone} style={{padding:11,background:sending?"#ccc":"#005F2E",border:"none",borderRadius:10,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,cursor:sending?"not-allowed":"pointer"}}>{sending?"Envoi...":"Envoyer"}</button>
              </div>
            )}
          </div>
          <button onClick={onClose} style={{marginTop:12,width:"100%",padding:11,border:"2px solid #F0EDE8",borderRadius:10,background:"transparent",color:"#5F6B74",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,cursor:"pointer"}}>Fermer</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PUBLISH MODAL (with PhotoUploader)
// ============================================================
function PublishModal({onClose,onSuccess}) {
  const [step,setStep]=useState(1);
  const [loading,setLoading]=useState(false);
  const [uploadProgress,setUploadProgress]=useState({current:0,total:0,label:""});
  const [error,setError]=useState("");
  const [photos,setPhotos]=useState([]); // [{file, preview, id}]
  const [f,setF]=useState({type:"Vente",category:"Villa",title:"",description:"",price:"",city:"Cotonou",neighborhood:"",area:"",bedrooms:"",bathrooms:"",is_featured:false,agent_name:"",agent_phone:"",agent_email:"",agency_name:"",payment_method:"",payment_ref:"",amount_declared:""});
  const [acceptedTerms,setAcceptedTerms]=useState(false);
  const u=(k,v)=>setF(p=>({...p,[k]:v}));
  const cost=f.is_featured?PRICE_TOTAL_FEATURED:PRICE_STANDARD;

  const submit=async()=>{
    setLoading(true); setError(""); setUploadProgress({current:0,total:0,label:""});
    try {
      // 1. Create agent
      setUploadProgress({current:0,total:photos.length,label:"Création du profil agent..."});
      const agentRes=await db.post("agents",{full_name:f.agent_name,phone:f.agent_phone,email:f.agent_email||null,agency_name:f.agency_name||null,city:f.city});
      const agent=Array.isArray(agentRes)?agentRes[0]:agentRes;
      if(!agent?.id){
        const errMsg=agentRes?.message||agentRes?.error||agentRes?.hint||JSON.stringify(agentRes);
        throw new Error(`Agent: ${errMsg}`);
      }

      // 2. Upload photos
      const imageUrls=[];
      const uploadErrors=[];
      for(let i=0;i<photos.length;i++){
        setUploadProgress({current:i+1,total:photos.length,label:`Upload photo ${i+1}/${photos.length}...`});
        const ext=photos[i].file.name.split(".").pop()||"jpg";
        const path=`${agent.id}_${Date.now()}_${i}.${ext}`;
        try {
          const url=await db.uploadImage(photos[i].file, path);
          imageUrls.push(url);
        } catch(e){ uploadErrors.push(e.message||"erreur inconnue"); }
      }
      if(uploadErrors.length>0 && imageUrls.length===0){
        throw new Error(`Échec de l'upload des photos : ${uploadErrors[0]}`);
      }

      // 3. Create listing
      setUploadProgress({current:photos.length,total:photos.length,label:"Enregistrement de l'annonce..."});
      const listingRes=await db.post("listings",{agent_id:agent.id,title:f.title,description:f.description||null,type:f.type,category:f.category,city:f.city,neighborhood:f.neighborhood||null,price:parseInt(f.price),area:f.area?parseInt(f.area):null,bedrooms:f.bedrooms?parseInt(f.bedrooms):null,bathrooms:f.bathrooms?parseInt(f.bathrooms):null,is_featured:f.is_featured,images:imageUrls,payment_status:"pending",is_active:false,terms_accepted_at:new Date().toISOString()});
      const listing=Array.isArray(listingRes)?listingRes[0]:listingRes;
      if(!listing?.id){
        const errMsg=listingRes?.message||listingRes?.error||listingRes?.hint||JSON.stringify(listingRes);
        throw new Error(`Listing: ${errMsg}`);
      }

      // 4. Payment record
      await db.post("payments",{listing_id:listing.id,agent_id:agent.id,amount:cost,type:f.is_featured?"featured":"standard",status:"pending",payment_method:f.payment_method,payment_ref:f.payment_ref,amount_declared:parseInt(f.amount_declared)});

      setStep(4); onSuccess?.();
    } catch(err){ setError(err.message||"Une erreur est survenue"); }
    setLoading(false); setUploadProgress({current:0,total:0,label:""});
  };

  const inp=(placeholder,key,type="text",extra={})=>(
    <input placeholder={placeholder} type={type} value={f[key]} onChange={e=>u(key,e.target.value)}
      style={{padding:"10px 12px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,...extra}}/>
  );

  const canNext1 = f.title && f.price;
  const canNext2 = f.agent_name && f.agent_phone;

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:18,maxWidth:540,width:"100%",maxHeight:"92vh",overflow:"auto",boxShadow:"0 24px 60px rgba(0,0,0,0.3)"}}>
        <div style={{background:"#005F2E",padding:"20px 22px 16px",borderRadius:"18px 18px 0 0"}}>
          <h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#fff",fontSize:19,fontWeight:800,margin:0}}>Publier une annonce</h2>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",color:"rgba(255,255,255,0.85)",fontSize:12,margin:"4px 0 0"}}>
            {["","Étape 1 — Votre bien & photos","Étape 2 — Vos coordonnées","Étape 3 — Récapitulatif","✅ Annonce créée !"][step]}
          </p>
        </div>

        <div style={{padding:22}}>
          {/* STEP 1 */}
          {step===1&&(
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <div style={{display:"flex",gap:8}}>
                {["Vente","Location"].map(t=>(
                  <button key={t} onClick={()=>u("type",t)} style={{flex:1,padding:9,border:`2px solid ${f.type===t?"#005F2E":"#E0DDD8"}`,borderRadius:10,background:f.type===t?"#FFF0EB":"#fff",color:f.type===t?"#005F2E":"#555",fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer"}}>{t}</button>
                ))}
              </div>
              <select value={f.category} onChange={e=>u("category",e.target.value)} style={{padding:"10px 12px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>
                {["Villa","Appartement","Maison","Terrain","Bureau","Local commercial"].map(c=><option key={c}>{c}</option>)}
              </select>
              {inp("Titre de l'annonce *","title")}
              <textarea placeholder="Description du bien..." value={f.description} onChange={e=>u("description",e.target.value)} rows={2} style={{padding:"10px 12px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,resize:"vertical"}}/>
              {inp("Prix en F CFA *","price","number")}
              <div style={{display:"flex",gap:8}}>
                <select value={f.city} onChange={e=>u("city",e.target.value)} style={{flex:1,padding:"10px 12px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>
                  {CITIES.slice(1).map(c=><option key={c}>{c}</option>)}
                </select>
                {inp("Quartier","neighborhood","text",{flex:1})}
              </div>
              <div style={{display:"flex",gap:8}}>
                {inp("m²","area","number",{flex:1})}
                {inp("Chambres","bedrooms","number",{flex:1})}
                {inp("Sdb","bathrooms","number",{flex:1})}
              </div>

              {/* PHOTO UPLOADER */}
              <div style={{background:"#FAF8F5",borderRadius:14,padding:14,border:"1px solid #F0EDE8"}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,marginBottom:10}}>📸 Photos du bien</div>
                <PhotoUploader photos={photos} onChange={setPhotos}/>
              </div>

              <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer",background:"#FAF8F5",padding:12,borderRadius:12,border:"2px solid #F0EDE8"}}>
                <input type="checkbox" checked={f.is_featured} onChange={e=>u("is_featured",e.target.checked)} style={{marginTop:3,width:18,height:18}}/>
                <div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,color:"#E78A45"}}>⭐ Mettre en vedette (+5 000 F CFA)</div>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5F6B74"}}>Badge doré + position prioritaire</div>
                </div>
              </label>
            </div>
          )}

          {/* STEP 2 */}
          {step===2&&(
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              {inp("Nom complet *","agent_name")}
              {inp("Numéro WhatsApp * (ex: 22997001122)","agent_phone")}
              {inp("Email (optionnel)","agent_email","email")}
              {inp("Nom de l'agence (optionnel)","agency_name")}
            </div>
          )}

          {/* STEP 3 */}
          {step===3&&(
            <div>
              {photos.length>0&&(
                <div style={{marginBottom:14}}>
                  <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,marginBottom:8}}>📸 {photos.length} photo{photos.length>1?"s":""} sélectionnée{photos.length>1?"s":""}</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {photos.map((p,i)=>(
                      <div key={p.id} style={{width:52,height:52,borderRadius:8,overflow:"hidden",border:i===0?"2px solid #005F2E":"2px solid #E0DDD8"}}>
                        <img src={p.preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{background:"#FAF8F5",borderRadius:14,padding:16,marginBottom:14}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14,marginBottom:10}}>Récapitulatif</div>
                {[["Type",`${f.type} — ${f.category}`],["Titre",f.title||"—"],["Ville",`${f.neighborhood?f.neighborhood+", ":""}${f.city}`],["Prix",`${parseInt(f.price||0).toLocaleString("fr-FR")} F CFA`],["Superficie",f.area?`${f.area} m²`:"—"],["Vendeur",f.agent_name],["WhatsApp",f.agent_phone]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif",padding:"5px 0",borderBottom:"1px solid #E8E4DF"}}>
                    <span style={{color:"#5F6B74"}}>{k}</span><span style={{fontWeight:600}}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"#fff3e0",borderRadius:14,padding:16,border:"2px solid #E78A45",marginBottom:12}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14,marginBottom:8}}>Montant à payer</div>
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,marginBottom:3}}><span>Publication 60 jours</span><span style={{fontWeight:700}}>{PRICE_STANDARD.toLocaleString("fr-FR")} F CFA</span></div>
                {f.is_featured&&<div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,marginBottom:3}}><span>⭐ Mise en vedette</span><span style={{fontWeight:700}}>{PRICE_FEATURED.toLocaleString("fr-FR")} F CFA</span></div>}
                <div style={{display:"flex",justifyContent:"space-between",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:19,fontWeight:800,color:"#005F2E",marginTop:8,paddingTop:8,borderTop:"2px solid #E78A45"}}><span>Total</span><span>{cost.toLocaleString("fr-FR")} F CFA</span></div>
              </div>
              <div style={{background:"#FAF8F5",borderRadius:14,padding:16,border:"2px solid #E0DDD8"}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14,marginBottom:10}}>💳 Comment payer</div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {PAYMENT_METHODS.map(m=>(
                    <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:m.color,color:m.textColor,borderRadius:10,padding:"10px 14px"}}>
                      <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13}}>{m.label}</span>
                      <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15,letterSpacing:0.5}}>{m.number}</span>
                    </div>
                  ))}
                </div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5F6B74",marginTop:10}}>
                  Envoyez exactement <strong>{cost.toLocaleString("fr-FR")} F CFA</strong> à l'un de ces numéros, puis attendez la confirmation.
                </div>
              </div>

              {/* DÉCLARATION DE PAIEMENT — obligatoire */}
              <div style={{background:"#E8F4FD",border:"2px solid #90CAF9",borderRadius:14,padding:16,marginTop:14}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:14,color:"#0c5460",marginBottom:4}}>📲 Après avoir payé, complétez ceci</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#0c5460",marginBottom:12,lineHeight:1.5}}>
                  Indiquez la <strong>référence de transaction</strong> reçue par SMS après votre paiement. Sans cette référence, nous ne pouvons pas confirmer votre paiement.
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <select value={f.payment_method} onChange={e=>u("payment_method",e.target.value)} style={{padding:"11px 13px",border:`2px solid ${f.payment_method?"#90CAF9":"#E0DDD8"}`,borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,background:"#fff"}}>
                    <option value="">Mode de paiement utilisé *</option>
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="moov">Moov Money</option>
                    <option value="wave">Wave</option>
                    <option value="celtiis">Celtiis Money</option>
                  </select>
                  <input placeholder="Référence de transaction (ex: MP240615.1234.A56789) *" value={f.payment_ref} onChange={e=>u("payment_ref",e.target.value)}
                    style={{padding:"11px 13px",border:`2px solid ${f.payment_ref?"#90CAF9":"#E0DDD8"}`,borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}/>
                  <input placeholder="Montant exact envoyé en F CFA *" type="number" value={f.amount_declared} onChange={e=>u("amount_declared",e.target.value)}
                    style={{padding:"11px 13px",border:`2px solid ${f.amount_declared?"#90CAF9":"#E0DDD8"}`,borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}/>
                  {f.amount_declared && parseInt(f.amount_declared)!==cost && (
                    <div style={{background:"#FFF3CD",borderRadius:8,padding:"8px 12px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#856404"}}>
                      ⚠️ Le montant indiqué ({parseInt(f.amount_declared).toLocaleString("fr-FR")} F CFA) ne correspond pas au total attendu ({cost.toLocaleString("fr-FR")} F CFA). Vérifiez avant de continuer.
                    </div>
                  )}
                </div>
              </div>

              {/* DISCLAIMER LÉGAL */}
              <div style={{background:"#FFF8E1",border:"2px solid #FFCC80",borderRadius:14,padding:16,marginTop:14}}>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:13,color:"#7A4F01",marginBottom:8}}>⚖️ Engagement de bonne foi</div>
                <ul style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5D4500",lineHeight:1.6,margin:"0 0 10px",paddingLeft:18}}>
                  <li>Je certifie que ce bien existe réellement et que j'ai le droit de le vendre ou de le louer.</li>
                  <li>Les informations fournies (prix, localisation, état du bien) sont exactes à ma connaissance.</li>
                  <li>Je comprends que la publication d'une fausse annonce, d'une annonce frauduleuse, ou l'usurpation de l'identité d'un tiers est passible de poursuites pénales conformément à la législation béninoise en vigueur.</li>
                  <li>ImmoBénin se réserve le droit de suspendre tout compte ou annonce signalé pour fraude, sans remboursement, et de transmettre les informations aux autorités compétentes si nécessaire.</li>
                </ul>
                <label style={{display:"flex",alignItems:"flex-start",gap:10,cursor:"pointer"}}>
                  <input type="checkbox" checked={acceptedTerms} onChange={e=>setAcceptedTerms(e.target.checked)} style={{marginTop:2,width:18,height:18,flexShrink:0}}/>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,fontWeight:700,color:"#5D4500"}}>
                    J'ai lu et j'accepte ces conditions. Je confirme que cette annonce est authentique.
                  </span>
                </label>
              </div>
              {loading && uploadProgress.total>0 && <div style={{marginTop:12}}><UploadProgress {...uploadProgress}/></div>}
              {error&&<div style={{background:"#FFEBEE",borderRadius:10,padding:12,marginTop:10,color:"#C62828",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12}}>⚠️ {error}</div>}
            </div>
          )}

          {/* STEP 4 — SUCCESS */}
          {step===4&&(
            <div style={{textAlign:"center",padding:"18px 0"}}>
              <div style={{fontSize:52,marginBottom:14}}>🎉</div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:19,color:"#1C6E3D",marginBottom:8}}>Demande envoyée avec succès !</h3>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"#555",marginBottom:14,lineHeight:1.6}}>
                Votre annonce sera publiée après <strong>vérification</strong> et <strong>paiement</strong> de <strong>{cost.toLocaleString("fr-FR")} F CFA</strong> :
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14,textAlign:"left"}}>
                {PAYMENT_METHODS.map(m=>(
                  <div key={m.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:m.color,color:m.textColor,borderRadius:10,padding:"10px 14px"}}>
                    <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13}}>{m.label}</span>
                    <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15,letterSpacing:0.5}}>{m.number}</span>
                  </div>
                ))}
              </div>
              <div style={{background:"#FAF8F5",borderRadius:12,padding:12,fontSize:12,fontFamily:"'Plus Jakarta Sans',sans-serif",color:"#555"}}>
                📱 Votre annonce sera mise en ligne dans les <strong>2 heures</strong> suivant le paiement, après validation par notre équipe.
              </div>
            </div>
          )}

          {/* BUTTONS */}
          <div style={{display:"flex",gap:10,marginTop:18}}>
            {step>1&&step<4&&<button onClick={()=>setStep(s=>s-1)} style={{flex:1,padding:12,border:"2px solid #E0DDD8",borderRadius:12,background:"#fff",color:"#555",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,cursor:"pointer"}}>← Retour</button>}
            {step<3&&<button onClick={()=>setStep(s=>s+1)} disabled={(step===1&&!canNext1)||(step===2&&!canNext2)} style={{flex:2,padding:12,background:"#005F2E",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",opacity:((step===1&&!canNext1)||(step===2&&!canNext2))?0.5:1}}>Continuer →</button>}
            {step===3&&<button onClick={submit} disabled={loading||!acceptedTerms||!f.payment_method||!f.payment_ref||!f.amount_declared} style={{flex:2,padding:12,background:(loading||!acceptedTerms||!f.payment_method||!f.payment_ref||!f.amount_declared)?"#ccc":"#1C6E3D",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,cursor:(loading||!acceptedTerms||!f.payment_method||!f.payment_ref||!f.amount_declared)?"not-allowed":"pointer"}}>{loading?"Upload en cours...":!f.payment_method||!f.payment_ref||!f.amount_declared?"Complétez la référence de paiement":!acceptedTerms?"Acceptez les conditions ci-dessus":"✓ Confirmer & Enregistrer"}</button>}
            {step===4&&<button onClick={onClose} style={{flex:1,padding:12,background:"#005F2E",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer"}}>Voir les annonces</button>}
          </div>
          {step<4&&<div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12}}>{[1,2,3].map(n=><div key={n} style={{width:n===step?24:8,height:8,borderRadius:4,background:n<=step?"#005F2E":"#E0DDD8",transition:"all 0.3s"}}/>)}</div>}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// EMPLACEMENT PUBLICITAIRE — cadre réservé, vide, à vendre
// ============================================================
function AdSlot({ size = "banner" }) {
  const dims = {
    banner:   { width: "100%", height: 90 },
    sidebar:  { width: "100%", height: 400 },
  };
  const d = dims[size] || dims.banner;
  return (
    <div style={{
      width: d.width, height: d.height,
      border: "2px dashed #D0C8C0", borderRadius: 14,
      background: "repeating-linear-gradient(45deg, #FAF8F5, #FAF8F5 10px, #F0EDE8 10px, #F0EDE8 20px)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 6, flexShrink: 0
    }}>
      <div style={{ fontSize: size==="sidebar"?28:20, opacity: 0.4 }}>📢</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: size==="sidebar"?13:12, color: "#9C9389", textAlign: "center", padding: "0 12px" }}>
        Espace publicitaire disponible
      </div>
      <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 11, color: "#B0A89E" }}>
        Contactez-nous pour réserver
      </div>
    </div>
  );
}

// ============================================================
// SPINNER
// ============================================================
function Spinner() {
  return (
    <div style={{display:"flex",justifyContent:"center",padding:60}}>
      <div style={{width:40,height:40,borderRadius:"50%",border:"4px solid #F0EDE8",borderTopColor:"#005F2E",animation:"spin 0.8s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

// ============================================================
// SERVICE CONCIERGE — page dédiée
// ============================================================
function ConciergePage({ onBack, prefillListing }) {
  const [form, setForm] = useState({
    listing_title: prefillListing?.title || "",
    city: prefillListing?.city || "Cotonou",
    requester_name: "",
    requester_phone: "",
    requester_role: "acheteur",
    notes: "",
  });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const isFixedPrice = CONCIERGE_FIXED_CITIES.includes(form.city);
  const priceLabel = isFixedPrice ? `${CONCIERGE_FIXED_PRICE.toLocaleString("fr-FR")} F CFA` : "Sur devis";

  const u = (k,v) => setForm(f=>({...f,[k]:v}));
  const canSubmit = form.requester_name && form.requester_phone && form.city;

  const submit = async () => {
    setSending(true); setError("");
    try {
      await db.post("concierge_requests",{
        listing_id: prefillListing?.id || null,
        listing_title: form.listing_title || null,
        city: form.city,
        requester_name: form.requester_name,
        requester_phone: form.requester_phone,
        requester_role: form.requester_role,
        notes: form.notes || null,
        price_quoted: isFixedPrice ? CONCIERGE_FIXED_PRICE : null,
        status: "pending"
      });
      setSent(true);
    } catch(e) { setError("Une erreur est survenue, réessayez."); }
    setSending(false);
  };

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#FAF8F5",minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      <header style={{background:"#fff",borderBottom:"1px solid #F0EDE8",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div onClick={onBack} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
            <img src={LOGO_ICON} alt="" style={{width:40,height:40,objectFit:"contain"}}/>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:20,color:"#040C13"}}>Immo<span style={{color:"#005F2E"}}>Bénin</span></span>
          </div>
          <button onClick={onBack} style={{background:"#F0EDE8",color:"#555",border:"none",borderRadius:10,padding:"9px 16px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer"}}>← Retour au site</button>
        </div>
      </header>

      {/* HERO */}
      <div style={{backgroundImage:"url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=85')",backgroundSize:"cover",backgroundPosition:"center",position:"relative",padding:"48px 16px 40px"}}>
        <div style={{position:"absolute",inset:0,background:"rgba(20,10,5,0.78)"}}/>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{fontSize:40,marginBottom:10}}>🕵️</div>
          <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:"clamp(24px,4vw,32px)",color:"#fff",margin:"0 0 10px"}}>Service Concierge</h1>
          <p style={{color:"rgba(255,255,255,0.75)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,lineHeight:1.6,maxWidth:520,margin:"0 auto"}}>
            Avant d'acheter ou de louer, faites vérifier un bien sur place par l'un de nos agents mandatés — visite physique, vérification du titre, photos supplémentaires. Réponse en <strong style={{color:"#E78A45"}}>24h</strong>.
          </p>
        </div>
      </div>

      <div style={{maxWidth:700,margin:"0 auto",padding:"32px 16px 60px"}}>
        {/* COMMENT ÇA MARCHE */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:28}}>
          {[
            {icon:"📝",title:"1. Vous demandez",desc:"Remplissez le formulaire ci-dessous avec le bien à vérifier"},
            {icon:"📞",title:"2. On vous contacte",desc:"Un agent vous appelle pour confirmer les détails et le tarif"},
            {icon:"🏠",title:"3. Vérification sur place",desc:"Visite physique, contrôle du titre, photos et compte-rendu"},
            {icon:"✅",title:"4. Rapport en 24h",desc:"Vous recevez un compte-rendu détaillé par WhatsApp"},
          ].map(s=>(
            <div key={s.title} style={{background:"#fff",borderRadius:14,padding:16,boxShadow:"0 2px 10px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:24,marginBottom:6}}>{s.icon}</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,color:"#040C13",marginBottom:4}}>{s.title}</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5F6B74",lineHeight:1.5}}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* TARIFS */}
        <div style={{background:"#fff",borderRadius:16,padding:22,marginBottom:28,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"2px solid #F0EDE8"}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:16,marginBottom:14}}>💰 Tarifs</div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#FFF0EB",borderRadius:12,marginBottom:10}}>
            <div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,color:"#040C13"}}>Cotonou & Abomey-Calavi</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5F6B74"}}>Prix fixe, sans surprise</div>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:20,color:"#005F2E"}}>{CONCIERGE_FIXED_PRICE.toLocaleString("fr-FR")} F CFA</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 16px",background:"#F5F5F5",borderRadius:12}}>
            <div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,color:"#040C13"}}>Autres villes du Bénin</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5F6B74"}}>Selon la distance et l'accessibilité</div>
            </div>
            <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:16,color:"#555"}}>Sur devis</div>
          </div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5F6B74",marginTop:12,lineHeight:1.5}}>
            Le service peut être payé par l'acheteur intéressé ou par le vendeur souhaitant rassurer ses visiteurs.
          </div>
        </div>

        {/* FORMULAIRE */}
        <div style={{background:"#fff",borderRadius:16,padding:22,boxShadow:"0 2px 12px rgba(0,0,0,0.06)",border:"2px solid #F0EDE8"}}>
          {sent ? (
            <div style={{textAlign:"center",padding:"20px 0"}}>
              <div style={{fontSize:48,marginBottom:12}}>🎉</div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:18,color:"#1C6E3D",marginBottom:8}}>Demande envoyée !</h3>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"#555",lineHeight:1.6}}>
                Un agent ImmoBénin vous contactera sur WhatsApp dans les 24h pour confirmer les détails{!isFixedPrice&&" et le tarif"}.
              </p>
            </div>
          ) : (
            <>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:16,marginBottom:16}}>📋 Demander une vérification</div>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                <input placeholder="Titre ou lien de l'annonce concernée (optionnel)" value={form.listing_title} onChange={e=>u("listing_title",e.target.value)}
                  style={{padding:"11px 13px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}/>
                <select value={form.city} onChange={e=>u("city",e.target.value)} style={{padding:"11px 13px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}>
                  {CITIES.slice(1).map(c=><option key={c}>{c}</option>)}
                </select>
                <div style={{display:"flex",gap:8}}>
                  {["acheteur","vendeur"].map(r=>(
                    <button key={r} onClick={()=>u("requester_role",r)} style={{flex:1,padding:10,border:`2px solid ${form.requester_role===r?"#005F2E":"#E0DDD8"}`,borderRadius:10,background:form.requester_role===r?"#FFF0EB":"#fff",color:form.requester_role===r?"#005F2E":"#555",fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer",textTransform:"capitalize"}}>{r}</button>
                  ))}
                </div>
                <input placeholder="Votre nom complet *" value={form.requester_name} onChange={e=>u("requester_name",e.target.value)}
                  style={{padding:"11px 13px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}/>
                <input placeholder="Votre numéro WhatsApp *" value={form.requester_phone} onChange={e=>u("requester_phone",e.target.value)}
                  style={{padding:"11px 13px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13}}/>
                <textarea placeholder="Précisions utiles (adresse exacte, disponibilités pour la visite...)" value={form.notes} onChange={e=>u("notes",e.target.value)}
                  rows={3} style={{padding:"11px 13px",border:"2px solid #E0DDD8",borderRadius:10,fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,resize:"vertical"}}/>

                <div style={{background:isFixedPrice?"#E8F5E9":"#FFF3CD",borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,fontWeight:600,color:isFixedPrice?"#2e7d32":"#856404"}}>Tarif estimé</span>
                  <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:16,fontWeight:800,color:isFixedPrice?"#2e7d32":"#856404"}}>{priceLabel}</span>
                </div>

                {error&&<div style={{background:"#FFEBEE",borderRadius:10,padding:12,color:"#C62828",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12}}>⚠️ {error}</div>}

                <button onClick={submit} disabled={!canSubmit||sending} style={{padding:13,background:(!canSubmit||sending)?"#ccc":"#005F2E",border:"none",borderRadius:12,color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,cursor:(!canSubmit||sending)?"not-allowed":"pointer"}}>
                  {sending?"Envoi...":"Envoyer ma demande →"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <footer style={{background:"#040C13",padding:"22px 16px",textAlign:"center"}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:19,color:"#fff",marginBottom:4}}>Immo<span style={{color:"#005F2E"}}>Bénin</span></div>
        <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>© 2025 ImmoBénin · Cotonou, Bénin · contact@immobenin.bj</p>
      </footer>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function ImmoBenin() {
  const [listings,setListings]=useState([]);
  const [loading,setLoading]=useState(true);
  const [filter,setFilter]=useState("Tous");
  const [city,setCity]=useState("Toutes villes");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState(null);
  const [showPublish,setShowPublish]=useState(false);
  const [featIdx,setFeatIdx]=useState(0);
  const [view,setView]=useState("home"); // "home" | "concierge"

  const fetchListings=useCallback(async()=>{
    setLoading(true);
    try {
      const data=await db.get("listings","?select=*,agents(full_name,phone,agency_name)&is_active=eq.true&order=is_featured.desc,created_at.desc");
      if(Array.isArray(data)&&data.length>0){ setListings(data); }
      else { setListings(DEMO_LISTINGS); }
    } catch { setListings(DEMO_LISTINGS); }
    setLoading(false);
  },[]);

  useEffect(()=>{fetchListings();},[fetchListings]);

  const featured=listings.filter(l=>l.is_featured);
  useEffect(()=>{
    if(featured.length<2) return;
    const t=setInterval(()=>setFeatIdx(i=>(i+1)%featured.length),4000);
    return ()=>clearInterval(t);
  },[featured.length]);

  const filtered=listings.filter(l=>{
    const mf=filter==="Tous"||l.type===filter||l.category===filter;
    const mc=city==="Toutes villes"||(l.city||"").includes(city);
    const ms=!search||l.title.toLowerCase().includes(search.toLowerCase())||(l.city||"").toLowerCase().includes(search.toLowerCase())||(l.neighborhood||"").toLowerCase().includes(search.toLowerCase());
    return mf&&mc&&ms;
  });

  const curFeat=featured[featIdx]||featured[0]||listings[0];

  if (view==="concierge") {
    return <ConciergePage onBack={()=>setView("home")} prefillListing={selected} />;
  }

  return (
    <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",background:"#FAF8F5",minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* HEADER */}
      <header style={{background:"#fff",borderBottom:"1px solid #F0EDE8",position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
        <div style={{maxWidth:1100,margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:64}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <img src={LOGO_ICON} alt="" style={{width:40,height:40,objectFit:"contain"}}/>
            <span style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:20,color:"#040C13"}}>Immo<span style={{color:"#005F2E"}}>Bénin</span></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <button onClick={()=>{setSelected(null);setView("concierge");}} style={{background:"#FAF8F5",color:"#555",border:"2px solid #F0EDE8",borderRadius:10,padding:"9px 16px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
              🕵️ <span style={{display:window.innerWidth<640?"none":"inline"}}>Service Concierge</span>
            </button>
            <button onClick={()=>setShowPublish(true)} style={{background:"#005F2E",color:"#fff",border:"none",borderRadius:10,padding:"10px 20px",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:"0 4px 14px rgba(0,95,46,0.35)"}}>
              + Publier une annonce
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div style={{backgroundImage:"url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=85')",backgroundSize:"cover",backgroundPosition:"center 30%",position:"relative",padding:"64px 16px 52px"}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(0,95,46,0.82) 0%,rgba(28,28,30,0.78) 100%)"}}/>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center",position:"relative",zIndex:1}}>
          <div style={{fontSize:12,fontWeight:700,letterSpacing:2,color:"#E78A45",marginBottom:12,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>IMMOBILIER AU BÉNIN</div>
          <h1 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:"clamp(28px,5vw,48px)",color:"#fff",margin:"0 0 14px",lineHeight:1.2}}>Trouvez votre bien idéal<br/><span style={{color:"#E78A45"}}>au Bénin</span></h1>
          <p style={{color:"rgba(255,255,255,0.65)",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:14,marginBottom:26}}>Villas, appartements, terrains, bureaux — vente & location dans tout le pays</p>
          <div style={{display:"flex",gap:8,background:"#fff",borderRadius:14,padding:8,maxWidth:520,margin:"0 auto"}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher par quartier, type de bien..." style={{flex:1,border:"none",outline:"none",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,padding:"8px 10px",background:"transparent",color:"#040C13"}}/>
            <button style={{background:"#005F2E",border:"none",borderRadius:10,padding:"10px 18px",color:"#fff",fontWeight:700,fontFamily:"'Plus Jakarta Sans',sans-serif",cursor:"pointer",fontSize:13}}>Chercher</button>
          </div>
          <div style={{display:"flex",gap:28,justifyContent:"center",marginTop:26}}>
            {[["🏠",listings.filter(l=>l.type==="Vente").length,"À vendre"],["🔑",listings.filter(l=>l.type==="Location").length,"À louer"],["📷",listings.reduce((s,l)=>s+(l.images?.length||0),0),"Photos"]].map(([icon,n,label])=>(
              <div key={label} style={{textAlign:"center"}}>
                <div style={{fontSize:18}}>{icon}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:22,color:"#E78A45"}}>{n}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"rgba(255,255,255,0.6)"}}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AD BANNER */}
      <div style={{maxWidth:1100,margin:"20px auto 0",padding:"0 16px"}}>
        <AdSlot size="banner"/>
      </div>

      {/* FEATURED */}
      {curFeat&&(
        <div style={{maxWidth:1100,margin:"28px auto 0",padding:"0 16px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
            <div><div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:"#005F2E",marginBottom:4}}>Sélection du moment</div><h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:19,color:"#040C13",margin:0}}>⭐ Annonces en vedette</h2></div>
            {featured.length>1&&<div style={{display:"flex",gap:6}}>{featured.map((_,i)=><div key={i} onClick={()=>setFeatIdx(i)} style={{width:i===featIdx?24:8,height:8,borderRadius:4,background:i===featIdx?"#005F2E":"#D0C8C0",cursor:"pointer",transition:"all 0.3s"}}/>)}</div>}
          </div>
          <div style={{borderRadius:18,overflow:"hidden",position:"relative",cursor:"pointer",boxShadow:"0 8px 32px rgba(0,0,0,0.14)",border:"2px solid #E78A45"}} onClick={()=>setSelected(curFeat)}>
            <img src={curFeat.images?.[0]||FALLBACK_IMG} alt={curFeat.title} style={{width:"100%",height:260,objectFit:"cover",display:"block"}}/>
            {curFeat.images?.length>1&&<div style={{position:"absolute",top:12,right:12,background:"rgba(0,0,0,0.6)",color:"#fff",fontSize:11,padding:"3px 10px",borderRadius:14,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>📷 {curFeat.images.length} photos</div>}
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(0,0,0,0.75) 0%,transparent 50%)"}}/>
            <div style={{position:"absolute",bottom:0,left:0,right:0,padding:22}}>
              <div style={{display:"flex",gap:8,marginBottom:6}}>
                <span style={{background:"#E78A45",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>⭐ EN VEDETTE</span>
                <span style={{background:curFeat.type==="Vente"?"#005F2E":"#E78A45",color:"#fff",fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{curFeat.type}</span>
              </div>
              <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:21,color:"#fff",margin:"0 0 4px"}}>{curFeat.title}</h3>
              <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:13,color:"rgba(255,255,255,0.8)",margin:"0 0 6px"}}>📍 {curFeat.neighborhood?`${curFeat.neighborhood}, `:""}{curFeat.city}</p>
              <div style={{fontSize:21,fontWeight:800,color:"#E78A45",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>{formatPrice(curFeat.price,curFeat.type)}</div>
            </div>
          </div>
        </div>
      )}

      {/* LISTINGS + SIDEBARS PUBLICITAIRES */}
      <div style={{maxWidth:1340,margin:"26px auto 0",padding:"0 16px",display:"flex",gap:20,alignItems:"flex-start"}}>
        {/* Sidebar gauche - visible seulement sur grand écran */}
        <div style={{width:160,flexShrink:0,position:"sticky",top:80,display:typeof window!=="undefined"&&window.innerWidth<1024?"none":"block"}}>
          <AdSlot size="sidebar"/>
        </div>

        {/* Colonne centrale - annonces */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
            {CATEGORIES.map(c=>(
              <button key={c} onClick={()=>setFilter(c)} style={{padding:"7px 16px",borderRadius:30,border:`2px solid ${filter===c?"#005F2E":"#E0DDD8"}`,background:filter===c?"#005F2E":"#fff",color:filter===c?"#fff":"#555",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:12,cursor:"pointer",transition:"all 0.2s"}}>{c}</button>
            ))}
            <select value={city} onChange={e=>setCity(e.target.value)} style={{padding:"7px 14px",borderRadius:30,border:"2px solid #E0DDD8",background:"#fff",color:"#555",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:600,fontSize:12,cursor:"pointer"}}>
              {CITIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#5F6B74",marginBottom:18}}>
            {filtered.length} annonce{filtered.length>1?"s":""} trouvée{filtered.length>1?"s":""}
          </div>
          {loading?<Spinner/>:(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:18,marginBottom:40}}>
              {filtered.map(l=><Card key={l.id} l={l} onSelect={setSelected}/>)}
            </div>
          )}
          {!loading&&filtered.length===0&&(
            <div style={{textAlign:"center",padding:"60px 20px",color:"#5F6B74"}}>
              <div style={{fontSize:46,marginBottom:10}}>🔍</div>
              <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:17,color:"#040C13",marginBottom:6}}>Aucune annonce trouvée</div>
              <button onClick={()=>{setFilter("Tous");setCity("Toutes villes");setSearch("");}} style={{color:"#005F2E",border:"none",background:"none",fontWeight:700,cursor:"pointer",fontSize:13,fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Réinitialiser les filtres</button>
            </div>
          )}
        </div>

        {/* Sidebar droite - visible seulement sur grand écran */}
        <div style={{width:160,flexShrink:0,position:"sticky",top:80,display:typeof window!=="undefined"&&window.innerWidth<1024?"none":"block"}}>
          <AdSlot size="sidebar"/>
        </div>
      </div>

      {/* PRICING SECTION */}
      <div style={{backgroundImage:"url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=85')",backgroundSize:"cover",backgroundPosition:"center",position:"relative",padding:"40px 16px",textAlign:"center",margin:"10px 0 0"}}>
        <div style={{position:"absolute",inset:0,background:"rgba(20,10,5,0.80)"}}/>
        <div style={{maxWidth:700,margin:"0 auto",position:"relative",zIndex:1}}>
          <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:11,letterSpacing:1.5,textTransform:"uppercase",color:"#E78A45",marginBottom:8}}>Publier une annonce</div><h2 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:22,color:"#fff",marginBottom:4}}>Publiez votre bien sur ImmoBénin</h2>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",color:"rgba(255,255,255,0.65)",marginBottom:24,fontSize:13}}>Simple, rapide, efficace — jusqu'à 8 photos par annonce</p>
          <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap",marginBottom:24}}>
            {[{label:"Annonce standard",price:`${PRICE_STANDARD.toLocaleString("fr-FR")} F CFA`,desc:"60 jours · 8 photos",icon:"📋",promo:true},{label:"Annonce en vedette",price:`${PRICE_TOTAL_FEATURED.toLocaleString("fr-FR")} F CFA`,desc:"Standard + badge ⭐ + priorité",icon:"⭐"},{label:"Espace publicitaire",price:"Sur devis",desc:"Bandeau haut · colonnes gauche/droite",icon:"📢"}].map(p=>(
              <div key={p.label} style={{background:"rgba(255,255,255,0.08)",borderRadius:14,padding:"18px 20px",textAlign:"center",minWidth:150,border:p.promo?"2px solid #E78A45":"1px solid rgba(232,160,32,0.3)",position:"relative"}}>
                {p.promo&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"#E78A45",color:"#040C13",fontSize:10,fontWeight:800,padding:"3px 10px",borderRadius:20,whiteSpace:"nowrap",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>🔥 PROMO LANCEMENT</div>}
                <div style={{fontSize:26,marginBottom:5}}>{p.icon}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:700,fontSize:13,color:"#fff",marginBottom:3}}>{p.label}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:18,color:"#E78A45",marginBottom:3}}>{p.price}</div>
                <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"rgba(255,255,255,0.55)"}}>{p.desc}</div>
              </div>
            ))}
          </div>
          <button onClick={()=>setShowPublish(true)} style={{background:"#005F2E",border:"none",borderRadius:12,padding:"13px 32px",color:"#fff",fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:"0 6px 20px rgba(0,95,46,0.4)"}}>+ Publier maintenant</button>
        </div>
      </div>

      {/* AVERTISSEMENT ACHETEURS */}
      <div style={{background:"#FFF8E1",borderTop:"1px solid #FFE0B2",padding:"16px 16px"}}>
        <div style={{maxWidth:700,margin:"0 auto",textAlign:"center"}}>
          <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,color:"#7A4F01",lineHeight:1.6,margin:0}}>
            ⚠️ <strong>Avis important :</strong> ImmoBénin met en relation acheteurs et vendeurs mais ne vérifie pas systématiquement chaque annonce. Faites toujours vos propres vérifications avant tout paiement ou engagement (visite, titre de propriété, identité du vendeur). En cas de doute, utilisez notre <button onClick={()=>{setSelected(null);setView("concierge");}} style={{background:"none",border:"none",color:"#005F2E",fontWeight:700,textDecoration:"underline",cursor:"pointer",fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:12,padding:0}}>service Concierge</button>.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{background:"#040C13",padding:"22px 16px",textAlign:"center"}}>
        <div style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontWeight:900,fontSize:19,color:"#fff",marginBottom:4}}>Immo<span style={{color:"#005F2E"}}>Bénin</span></div>
        <p style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:11,color:"rgba(255,255,255,0.4)",margin:0}}>© 2025 ImmoBénin · Cotonou, Bénin · contact@immobenin.bj</p>
      </footer>

      {selected&&<DetailModal listing={selected} onClose={()=>setSelected(null)} onRequestVerification={()=>setView("concierge")}/>}
      {showPublish&&<PublishModal onClose={()=>setShowPublish(false)} onSuccess={fetchListings}/>}
    </div>
  );
}
