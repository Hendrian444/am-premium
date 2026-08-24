// ==========================================
// THEME & VIDEO SLIDER (TERSIMPAN)
// ==========================================
let currentSlideIndex = parseInt(localStorage.getItem('vertex_theme')) || 0;
const wrapper = document.getElementById('slideWrapper');
const dots = document.querySelectorAll('.dot');

if (currentSlideIndex === 1) document.body.classList.add('pink-theme');

function updateSlidePosition() {
    if (wrapper) wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    if (dots.length > 0) {
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlideIndex));
    }
    if (currentSlideIndex === 1) {
        document.body.classList.add('pink-theme');
        localStorage.setItem('vertex_theme', 1);
    } else {
        document.body.classList.remove('pink-theme');
        localStorage.setItem('vertex_theme', 0);
    }
}

function moveSlide(direction) {
    currentSlideIndex += direction;
    if (currentSlideIndex < 0) currentSlideIndex = 1;
    else if (currentSlideIndex > 1) currentSlideIndex = 0;
    updateSlidePosition();
}
function currentSlide(index) {
    currentSlideIndex = index;
    updateSlidePosition();
}
window.addEventListener('DOMContentLoaded', updateSlidePosition);


// ==========================================
// CORE API SYSTEM - 100% WORK & ANTI CORS
// ==========================================
const API_KEY = 'SK-pGFkFkE6Kb2HtQkYfivFTq7N';
const API_BASE = 'https://www.free-restapi.biz.id/api';

// Fungsi Fetch Anti-Blokir (Multi-Proxy Failover)
async function fetchAntiCORS(targetUrl) {
    const proxies = [
        targetUrl, // Coba langsung (Direct)
        `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`, // Proxy 1 (Paling Kuat)
        `https://corsproxy.io/?${encodeURIComponent(targetUrl)}` // Proxy 2 (Cadangan)
    ];

    for (let url of proxies) {
        try {
            const res = await fetch(url);
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn(`Proxy gagal, mencoba jalur lain...`);
        }
    }
    throw new Error('Semua jalur koneksi ke server API gagal.');
}

async function runApiTool(endpoint, inputId, paramKey, toolName) {
    const inputVal = document.getElementById(inputId).value.trim();
    if (!inputVal) return Swal.fire('Oops!', 'Kolom link/username harus diisi!', 'warning');

    Swal.fire({ 
        title: 'Mengekstrak Data...', 
        text: 'Menembus server API, mohon tunggu sebentar...',
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    try {
        const url = `${API_BASE}/${endpoint}?${paramKey}=${encodeURIComponent(inputVal)}&apikey=${API_KEY}`;
        const json = await fetchAntiCORS(url);

        // Cek validitas respon dari API
        if (json.status === false || json.code === 400 || json.code === 404 || json.success === false) {
            return Swal.fire('Gagal!', json.message || 'Data tidak ditemukan atau link salah.', 'error');
        }

        // ==========================================
        // EXTRACTOR DATA SUPER PRESISI (Berdasarkan Screenshot JSON)
        // ==========================================
        let raw = json.result || json.data || json;
        
        let media = {
            title: '', cover: '', video: null, audio: null, image: null, profile: null
        };

        // 1. TIKTOK DOWNLOADER
        if (endpoint === 'ttdl') {
            media.title = raw.title || raw.desc || 'Video TikTok';
            media.cover = raw.cover || raw.origin_cover || '';
            if (raw.videos && Array.isArray(raw.videos)) {
                let hd = raw.videos.find(v => v.type === 'nowatermark_hd');
                let no = raw.videos.find(v => v.type === 'nowatermark');
                media.video = (hd || no || raw.videos[0])?.url;
            } else {
                media.video = raw.url || raw.video;
            }
        }
        // 2. TIKTOK STALKER
        else if (endpoint === 'ttstalk') {
            let p = raw.user || raw.userInfo || raw;
            media.profile = {
                username: p.uniqueId || p.username || inputVal,
                avatar: p.avatarLarger || p.avatar || p.profile_pic || 'https://via.placeholder.com/150',
                bio: p.signature || p.bio || 'Tidak ada bio',
                followers: p.followerCount || p.followers || 0,
                following: p.followingCount || p.following || 0,
                likes: p.heartCount || p.heart || p.likes || 0
            };
        }
        // 3. IG DOWNLOADER
        else if (endpoint === 'igdl') {
            let item = Array.isArray(raw) ? raw[0] : (raw.media ? raw.media[0] : raw);
            if (item) {
                media.title = item.title || 'Instagram Media';
                media.cover = item.thumbnail || item.cover || '';
                let link = item.url || item.link;
                if (link && (link.includes('.mp4') || item.type === 'video')) media.video = link;
                else media.image = link;
            }
        }
        // 4. YOUTUBE MP3 & MP4
        else if (endpoint === 'ytmp3' || endpoint === 'ytmp4') {
            media.title = raw.title || 'YouTube Media';
            media.cover = raw.thumb || raw.thumbnail || '';
            let link = raw.download || raw.url || raw.link;
            if (endpoint === 'ytmp3') media.audio = link;
            else media.video = link;
        }
        // 5. REMOVE BG & HDR
        else if (endpoint === 'removebg' || endpoint === 'hdr') {
            media.image = (typeof raw === 'string' && raw.startsWith('http')) ? raw : (raw.url || raw.image || raw.link);
        }
        // FALLBACK: Coba cari URL secara kasar kalau belum ketemu
        else {
            let strJson = JSON.stringify(json);
            let match = strJson.match(/https?:\/\/[^\s"']+/);
            if (match) media.video = match[0]; // Anggap aja file yg bisa didownload
        }


        // ==========================================
        // BUILDER TAMPILAN HTML UNTUK SWEETALERT
        // ==========================================
        let htmlBody = '';

        // Tampilan Profil (Stalker)
        if (media.profile) {
            htmlBody = `
                <div style="text-align:center; color:#0f172a;">
                    <img src="${media.profile.avatar}" style="width:110px; height:110px; border-radius:50%; margin-bottom:12px; border:4px solid #2563eb; object-fit:cover; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <h3 style="margin:0; font-size:20px; font-weight:bold;">@${media.profile.username}</h3>
                    <p style="font-size:13px; color:#64748b; margin-top:6px; padding:0 15px;">${media.profile.bio}</p>
                    <div style="display:flex; justify-content:space-around; margin-top:20px; padding-top:15px; border-top:1px solid #e2e8f0; font-size:13px; background:#f8fafc; border-radius:8px;">
                        <div><b style="font-size:16px; color:#0f172a;">${Number(media.profile.followers).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Followers</span></div>
                        <div><b style="font-size:16px; color:#0f172a;">${Number(media.profile.following).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Following</span></div>
                        <div><b style="font-size:16px; color:#0f172a;">${Number(media.profile.likes).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Likes</span></div>
                    </div>
                </div>
            `;
        } 
        // Tampilan Video & Audio (TTDL, IGDL, YT)
        else if (media.video || media.audio) {
            let linkDl = media.video || media.audio;
            let isAudio = !!media.audio;
            
            let preview = '';
            if (media.video) {
                preview = `
                    <div style="background:#000; border-radius:8px; overflow:hidden; display:flex; justify-content:center; align-items:center; height:240px; margin-bottom:12px;">
                        <video controls poster="${media.cover}" style="max-width:100%; max-height:100%;">
                            <source src="${media.video}" type="video/mp4">
                        </video>
                    </div>`;
            } else if (media.audio) {
                preview = `
                    ${media.cover ? `<img src="${media.cover}" style="width:100%; max-height:180px; object-fit:cover; border-radius:8px; margin-bottom:12px;">` : ''}
                    <div style="margin-bottom:12px;">
                        <audio controls style="width:100%;"><source src="${media.audio}" type="audio/mpeg"></audio>
                    </div>`;
            }

            htmlBody = `
                <div style="text-align:center;">
                    ${preview}
                    <p style="font-size:13px; color:#475569; margin-bottom:16px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;"><b>File:</b> ${media.title || 'Media File'}</p>
                    <a href="${linkDl}" target="_blank" style="background:${isAudio ? '#8b5cf6' : '#10b981'}; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:15px; font-weight:bold; display:inline-flex; align-items:center; gap:8px; width:100%; justify-content:center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        📥 ${isAudio ? 'Download Lagu (MP3)' : 'Download Video HD'}
                    </a>
                </div>
            `;
        } 
        // Tampilan Gambar (IG Foto, RemoveBG, HDR)
        else if (media.image) {
            htmlBody = `
                <div style="text-align:center;">
                    <div style="margin-bottom:12px; background:#f8fafc; border:1px solid #cbd5e1; border-radius:8px; padding:4px; max-height:280px; overflow:hidden; display:flex; justify-content:center;">
                        <img src="${media.image}" style="max-width:100%; max-height:260px; border-radius:6px; object-fit:contain;">
                    </div>
                    <a href="${media.image}" target="_blank" style="background:#2563eb; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:15px; font-weight:bold; display:inline-flex; align-items:center; gap:8px; width:100%; justify-content:center;">
                        📥 Download Gambar HD
                    </a>
                </div>
            `;
        } 
        // Fallback jika aneh
        else {
            htmlBody = `
                <div style="text-align:left; font-size:11px; max-height:220px; overflow-y:auto; background:#f1f5f9; padding:10px; border-radius:6px; color:#0f172a;">
                    <p style="color:#b91c1c; font-weight:bold; margin-bottom:6px;">Berhasil diekstrak, tapi format tidak dikenali. Ini data mentahnya:</p>
                    <pre style="margin:0; white-space:pre-wrap;">${JSON.stringify(json, null, 2)}</pre>
                </div>
            `;
        }

        // Tampilkan Hasil Akhir
        Swal.fire({
            title: `✅ ${toolName} Siap!`,
            html: htmlBody,
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#2563eb',
            background: '#ffffff',
            width: media.profile ? '400px' : '480px'
        });

    } catch (error) {
        console.error(error);
        Swal.fire('Error Jaringan!', 'Semua jalur proxy gagal atau server API sedang mati. Coba lagi nanti.', 'error');
    }
}

// ==========================================
// SCRIPT INDEX.HTML & LAINNYA
// ==========================================
function showMaintenanceAlert() {
    Swal.fire({ icon: 'warning', title: 'Sistem Maintenance', text: 'Fitur utama sedang dalam perbaikan. Silakan gunakan menu Utility Tools.' });
}

function generateHexLine() {
    const chars = '0123456789ABCDEF'; let line = '0x';
    for(let i=0; i<32; i++) { line += chars[Math.floor(Math.random() * chars.length)]; if(i % 8 === 7 && i !== 31) line += ' '; }
    return line;
}

const streamBox = document.getElementById('dataStream');
if (streamBox) {
    setInterval(() => {
        const p = document.createElement('div'); p.className = 'stream-line';
        p.innerHTML = `[${new Date().toISOString().substring(11,23)}] <span style="color:var(--warning);">ERR_API_WAIT: ${generateHexLine()}</span>`;
        streamBox.prepend(p);
        if(streamBox.children.length > 15) streamBox.removeChild(streamBox.lastChild);
    }, 1200);
}

function updateChart(containerId) {
    const container = document.getElementById(containerId);
    if(!container) return;
    const bars = container.children;
    if(bars.length === 0) {
        for(let i=0; i<20; i++) {
            const bar = document.createElement('div'); bar.className = 'mc-bar'; bar.style.height = `${Math.floor(Math.random() * 80) + 20}%`;
            container.appendChild(bar);
        } return;
    }
    for(let i=0; i<bars.length-1; i++) {
        bars[i].style.height = bars[i+1].style.height; bars[i].className = bars[i+1].className;
    }
    bars[bars.length-1].style.height = `${Math.floor(Math.random() * 80) + 20}%`;
    bars[bars.length-1].className = 'mc-bar active';
    setTimeout(() => { if(bars[bars.length-1]) bars[bars.length-1].className = 'mc-bar'; }, 400);
}

if (document.getElementById('chartRequests')) {
    setInterval(() => {
        updateChart('chartRequests'); updateChart('chartSuccess');
        const cpuEl = document.getElementById('cpuVal'); if(cpuEl) cpuEl.innerText = Math.floor(Math.random() * 40) + 60; 
        updateChart('chartCpu');
        const threadEl = document.getElementById('threadVal'); if(threadEl) threadEl.innerText = Math.floor(Math.random() * 10) + 40;
        updateChart('chartThread');
    }, 1500);
            }
