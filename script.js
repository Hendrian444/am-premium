// ==========================================
// THEME & VIDEO SLIDER (TERSIMPAN)
// ==========================================
let currentSlideIndex = parseInt(localStorage.getItem('vertex_theme')) || 0;
const wrapper = document.getElementById('slideWrapper');
const dots = document.querySelectorAll('.dot');

if (currentSlideIndex === 1) {
    document.body.classList.add('pink-theme');
}

function updateSlidePosition() {
    if (wrapper) {
        wrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }
    if (dots.length > 0) {
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });
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

window.addEventListener('DOMContentLoaded', () => {
    updateSlidePosition();
});


// ==========================================
// CORE API HANDLER (VIA VERCEL PROXY INTERNAL)
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
        // Menembak endpoint Vercel Serverless Function sendiri
        const targetUrl = `/api/proxy?endpoint=${endpoint}&${paramKey}=${encodeURIComponent(inputVal)}`;
        
        const response = await fetch(targetUrl);
        if (!response.ok) throw new Error('Gagal menghubungi server Vercel Proxy');
        
        const result = await response.json();
        
        if (result.status === false || result.code === 400 || result.code === 404 || result.error) {
            return Swal.fire('Gagal!', result.message || result.error || 'Data tidak ditemukan atau parameter salah.', 'error');
        }

        let htmlBody = '';
        const data = result.data || result.result || result;

        // 1. TikTok Stalker
        if (endpoint === 'ttstalk') {
            const profile = data.user || data.userInfo || data;
            const avatar = profile.avatar || profile.avatarLarger || profile.profile_pic || 'https://via.placeholder.com/100';
            const username = profile.uniqueId || profile.nickname || profile.username || inputVal;
            const signature = profile.signature || profile.bio || 'Tidak ada deskripsi bio.';
            const followers = profile.followerCount || profile.followers || 0;
            const following = profile.followingCount || profile.following || 0;
            const likes = profile.heartCount || profile.likes || profile.heart || 0;

            htmlBody = `
                <div style="text-align:center; color:#0f172a;">
                    <img src="${avatar}" style="width:100px; height:100px; border-radius:50%; margin-bottom:12px; border:3px solid #2563eb; object-fit:cover;">
                    <h3 style="margin:0; font-size:18px; font-weight:bold;">@${username}</h3>
                    <p style="font-size:13px; color:#64748b; margin-top:6px; line-height:1.4;">${signature}</p>
                    <div style="display:flex; justify-content:center; gap:18px; margin-top:18px; padding-top:12px; border-top:1px solid #e2e8f0; font-size:13px;">
                        <div><b style="font-size:15px; color:#2563eb;">${Number(followers).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Followers</span></div>
                        <div><b style="font-size:15px; color:#2563eb;">${Number(following).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Following</span></div>
                        <div><b style="font-size:15px; color:#2563eb;">${Number(likes).toLocaleString()}</b><br><span style="color:#64748b; font-size:11px;">Likes</span></div>
                    </div>
                </div>
            `;
        }
        // 2. Remove BG & HDR
        else if (endpoint === 'removebg' || endpoint === 'hdr') {
            const imageUrl = data.url || data.result || (typeof data === 'string' && data.startsWith('http') ? data : null);

            if (imageUrl) {
                htmlBody = `
                    <div style="text-align:center;">
                        <div style="margin-bottom: 12px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px; background: #f8fafc; max-height: 280px; overflow: hidden; display: flex; justify-content: center; align-items: center;">
                            <img src="${imageUrl}" style="max-width: 100%; max-height: 260px; border-radius: 6px; object-fit: contain;">
                        </div>
                        <a href="${imageUrl}" target="_blank" style="background:#2563eb; color:white; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px; font-weight:bold; display:inline-block; box-shadow: 0 4px 6px rgba(37,99,235,0.2);">
                            📥 Download / Buka Gambar HD
                        </a>
                    </div>
                `;
            } else {
                htmlBody = `<p style="color:red; text-align:center;">URL gambar hasil proses tidak ditemukan dari server.</p>`;
            }
        }
        // 3. Downloader Lainnya
        else {
            let downloadLink = null;

            if (typeof data === 'string' && data.startsWith('http')) {
                downloadLink = data;
            } else if (data.url) {
                downloadLink = data.url;
            } else if (data.link) {
                downloadLink = data.link;
            } else if (data.download) {
                downloadLink = data.download;
            } else if (Array.isArray(data) && data.length > 0) {
                downloadLink = data[0].url || data[0].link || data[0];
            } else if (data.medias && Array.isArray(data.medias) && data.medias.length > 0) {
                downloadLink = data.medias[0].url || data.medias[0].link;
            }

            if (downloadLink && typeof downloadLink === 'string' && downloadLink.startsWith('http')) {
                const isAudio = endpoint === 'ytmp3';
                const btnColor = isAudio ? '#8b5cf6' : '#10b981';
                const icon = isAudio ? '🎵' : '📥';
                const titleText = isAudio ? 'Download File Audio (MP3)' : 'Download File Video / Media';

                htmlBody = `
                    <div style="text-align:center; padding: 10px 0;">
                        <p style="font-size:13px; color:#475569; margin-bottom:16px;">Media berhasil diekstrak dan siap diunduh.</p>
                        <a href="${downloadLink}" target="_blank" style="background:${btnColor}; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:15px; font-weight:bold; display:inline-flex; align-items:center; gap:8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            ${icon} ${titleText}
                        </a>
                    </div>
                `;
            } else {
                htmlBody = `
                    <div style="text-align:left; font-size:11px; max-height:220px; overflow-y:auto; background:#f1f5f9; padding:10px; border-radius:6px; color:#0f172a;">
                        <p style="color:#b91c1c; font-weight:bold; margin-bottom:6px;">Format tautan tidak ter-mapping otomatis:</p>
                        <pre style="margin:0; white-space:pre-wrap;">${JSON.stringify(result, null, 2)}</pre>
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
            width: endpoint === 'ttstalk' ? '420px' : '500px'
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
        
