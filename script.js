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
// CORE API HANDLER VIA VERCEL PROXY INTERNAL
// ==========================================
async function runApiTool(endpoint, inputId, paramKey, toolName) {
    const inputVal = document.getElementById(inputId).value.trim();
    if (!inputVal) {
        return Swal.fire('Oops!', 'Kolom input tidak boleh kosong, Lek!', 'warning');
    }

    Swal.fire({ 
        title: 'Sedang Memproses...', 
        text: `Menghubungkan ke server Vercel Proxy...`,
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    try {
        // Nembak ke proxy Vercel sendiri (Bebas CORS 100%)
        const targetUrl = `/api/proxy?endpoint=${endpoint}&${paramKey}=${encodeURIComponent(inputVal)}`;
        
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('Gagal menghubungi Vercel Serverless Function');
        
        const json = await response.json();
        
        if (json.status === false || json.code === 400 || json.code === 404 || json.error) {
            return Swal.fire('Gagal!', json.message || json.error || 'Data tidak ditemukan atau parameter salah.', 'error');
        }

        // Ambil objek dalaman berdasarkan struktur JSON dari screenshot lu
        const raw = json.result || json.data || json;
        let htmlBody = '';

        // ==========================================
        // 1. TIKTOK DOWNLOADER (DENGAN PRATINJAU PEMUTAR VIDEO)
        // ==========================================
        if (endpoint === 'ttdl') {
            let videoUrl = null;
            let coverImg = raw.cover || '';
            let videoTitle = raw.title || 'Video TikTok No Watermark';

            // Ambil dari array videos (nowatermark_hd / nowatermark) sesuai struktur JSON lu
            if (raw.videos && Array.isArray(raw.videos)) {
                let hdVid = raw.videos.find(v => v.type === 'nowatermark_hd');
                let normalVid = raw.videos.find(v => v.type === 'nowatermark');
                let selected = hdVid || normalVid || raw.videos[0];
                if (selected) videoUrl = selected.url;
            } else {
                videoUrl = raw.url || raw.link;
            }

            if (videoUrl) {
                htmlBody = `
                    <div style="text-align:center;">
                        <div style="background:#000; border-radius:8px; overflow:hidden; display:flex; justify-content:center; align-items:center; height:240px; margin-bottom:12px;">
                            <video controls poster="${coverImg}" style="max-width:100%; max-height:100%;">
                                <source src="${videoUrl}" type="video/mp4">
                                Browser Anda tidak mendukung video.
                            </video>
                        </div>
                        <p style="font-size:12px; color:#475569; margin-bottom:14px; text-align:left; line-height:1.4;"><b>Judul:</b> ${videoTitle}</p>
                        <a href="${videoUrl}" target="_blank" style="background:#10b981; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:bold; display:inline-flex; align-items:center; gap:8px; width:100%; justify-content:center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            📥 Download Video (No Watermark)
                        </a>
                    </div>
                `;
            } else {
                htmlBody = `<p style="color:red; text-align:center;">Tautan video tidak ditemukan dalam respon JSON.</p>`;
            }
        }
        // ==========================================
        // 2. TIKTOK STALKER
        // ==========================================
        else if (endpoint === 'ttstalk') {
            const profile = raw.user || raw.userInfo || raw;
            const avatar = profile.avatar || profile.avatarLarger || profile.profile_pic || 'https://via.placeholder.com/100';
            const username = profile.uniqueId || profile.nickname || profile.username || inputVal;
            const signature = profile.signature || profile.bio || 'Tidak ada deskripsi bio.';
            const followers = profile.followerCount || profile.followers || 0;
            const following = profile.followingCount || profile.following || 0;
            const likes = profile.heartCount || profile.likes || profile.heart || 0;

            htmlBody = `
                <div style="text-align:center; color:#0f172a;">
                    <img src="${avatar}" style="width:105px; height:105px; border-radius:50%; margin-bottom:12px; border:3px solid #2563eb; object-fit:cover;">
                    <h3 style="margin:0; font-size:18px; font-weight:bold;">@${username}</h3>
                    <p style="font-size:13px; color:#64748b; margin-top:6px; line-height:1.4;">${signature}</p>
                    <div style="display:flex; justify-content:space-around; margin-top:18px; padding-top:12px; border-top:1px solid #e2e8f0; font-size:13px; background:#f8fafc; border-radius:8px;">
                        <div><b style="font-size:15px; color:#2563eb;">${Number(followers).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Followers</span></div>
                        <div><b style="font-size:15px; color:#2563eb;">${Number(following).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Following</span></div>
                        <div><b style="font-size:15px; color:#2563eb;">${Number(likes).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Likes</span></div>
                    </div>
                </div>
            `;
        }
        // ==========================================
        // 3. REMOVE BG & HDR (PRATINJAU GAMBAR)
        // ==========================================
        else if (endpoint === 'removebg' || endpoint === 'hdr') {
            const imageUrl = raw.url || raw.result || (typeof raw === 'string' && raw.startsWith('http') ? raw : null);

            if (imageUrl) {
                htmlBody = `
                    <div style="text-align:center;">
                        <div style="margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px; background: #f8fafc; max-height: 260px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                            <img src="${imageUrl}" style="max-width: 100%; max-height: 240px; border-radius: 6px; object-fit: contain;">
                        </div>
                        <a href="${imageUrl}" target="_blank" style="background:#2563eb; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:bold; display:inline-block; width:100%; box-shadow: 0 4px 6px rgba(37,99,235,0.2);">
                            📥 Download Gambar HD
                        </a>
                    </div>
                `;
            } else {
                htmlBody = `<p style="color:red; text-align:center;">URL gambar hasil proses tidak ditemukan.</p>`;
            }
        }
        // ==========================================
        // 4. DOWNLOADER LAINNYA (IGDL, YTMP3, YTMP4)
        // ==========================================
        else {
            let downloadLink = raw.url || raw.link || raw.download || (typeof raw === 'string' && raw.startsWith('http') ? raw : null);
            if (!downloadLink && Array.isArray(raw) && raw.length > 0) downloadLink = raw[0].url || raw[0].link;

            if (downloadLink && typeof downloadLink === 'string' && downloadLink.startsWith('http')) {
                const isAudio = endpoint === 'ytmp3';
                const btnColor = isAudio ? '#8b5cf6' : '#10b981';
                const icon = isAudio ? '🎵' : '📥';
                const titleText = isAudio ? 'Download Audio (MP3)' : 'Download Media File';

                let previewBox = '';
                if (!isAudio && (endpoint === 'ytmp4' || endpoint === 'igdl')) {
                    previewBox = `
                        <div style="background:#000; border-radius:8px; overflow:hidden; display:flex; justify-content:center; align-items:center; height:220px; margin-bottom:12px;">
                            <video controls style="max-width:100%; max-height:100%;"><source src="${downloadLink}" type="video/mp4"></video>
                        </div>`;
                } else if (isAudio) {
                    previewBox = `
                        <div style="margin-bottom:12px;">
                            <audio controls style="width:100%;"><source src="${downloadLink}" type="audio/mpeg"></audio>
                        </div>`;
                }

                htmlBody = `
                    <div style="text-align:center;">
                        ${previewBox}
                        <a href="${downloadLink}" target="_blank" style="background:${btnColor}; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:bold; display:inline-flex; align-items:center; gap:8px; width:100%; justify-content:center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            ${icon} ${titleText}
                        </a>
                    </div>
                `;
            } else {
                htmlBody = `
                    <div style="text-align:left; font-size:11px; max-height:220px; overflow-y:auto; background:#f1f5f9; padding:10px; border-radius:6px; color:#0f172a;">
                        <pre style="margin:0; white-space:pre-wrap;">${JSON.stringify(json, null, 2)}</pre>
                    </div>
                `;
            }
        }

        Swal.fire({
            title: `✅ ${toolName} Berhasil`,
            html: htmlBody,
            confirmButtonText: 'Tutup',
            confirmButtonColor: '#2563eb',
            background: '#ffffff',
            width: '460px'
        });

    } catch (error) {
        console.error(error);
        Swal.fire('Waduh Gagal!', 'Terjadi kesalahan pada server proxy Vercel.', 'error');
    }
}


// ==========================================
// SCRIPT PENDUKUNG INDEX.HTML
// ==========================================
function showMaintenanceAlert() {
    Swal.fire({ icon: 'warning', title: 'Sistem Maintenance', text: 'Fitur utama sedang dalam perbaikan. Silakan gunakan menu Utility Tools.' });
}

function generateHexLine() {
    const chars = '0123456789ABCDEF';
    let line = '0x';
    for(let i=0; i<32; i++) {
        line += chars[Math.floor(Math.random() * chars.length)];
        if(i % 8 === 7 && i !== 31) line += ' ';
    }
    return line;
}

const streamBox = document.getElementById('dataStream');
if (streamBox) {
    setInterval(() => {
        const p = document.createElement('div');
        p.className = 'stream-line';
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
            const bar = document.createElement('div');
            bar.className = 'mc-bar';
            bar.style.height = `${Math.floor(Math.random() * 80) + 20}%`;
            container.appendChild(bar);
        }
        return;
    }
    for(let i=0; i<bars.length-1; i++) {
        bars[i].style.height = bars[i+1].style.height;
        bars[i].className = bars[i+1].className;
    }
    const newHeight = Math.floor(Math.random() * 80) + 20;
    bars[bars.length-1].style.height = `${newHeight}%`;
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
