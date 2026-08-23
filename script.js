// ==========================================
// THEME & VIDEO SLIDER (TERSIMPAN DI BROWSER)
// ==========================================
// Mengambil status tema yang tersimpan (supaya gak kerestart saat pindah halaman)
let currentSlideIndex = parseInt(localStorage.getItem('vertex_theme')) || 0;
const wrapper = document.getElementById('slideWrapper');
const dots = document.querySelectorAll('.dot');

// Langsung aplikasikan tema saat halaman pertama kali dimuat
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

// Pastikan posisi video pas saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    updateSlidePosition();
});


// ==========================================
// CORE API TOOLS LOGIC (UNTUK HALAMAN TOOLS)
// ==========================================
const API_KEY = 'SK-pGFkFkE6Kb2HtQkYfivFTq7N';
const API_BASE = 'https://www.free-restapi.biz.id/api';

async function runApiTool(endpoint, inputId, paramKey, toolName) {
    const inputVal = document.getElementById(inputId).value.trim();
    if (!inputVal) {
        return Swal.fire('Oops!', 'Kolom input nggak boleh kosong ya, Lek!', 'warning');
    }

    Swal.fire({ 
        title: 'Sedang Memproses...', 
        text: 'Tunggu sebentar, request sedang dikirim ke server...',
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
    });

    try {
        const requestUrl = `${API_BASE}/${endpoint}?${paramKey}=${encodeURIComponent(inputVal)}&apikey=${API_KEY}`;
        const response = await fetch(requestUrl);
        if (!response.ok) throw new Error('API Timeout / Error');
        
        const result = await response.json();
        if (result.status === false || result.code === 400 || result.code === 404) {
             return Swal.fire('Gagal!', result.message || 'Data tidak ditemukan atau limit API habis.', 'error');
        }

        let htmlBody = '';

        if (endpoint === 'removebg' || endpoint === 'hdr') {
            let imgUrl = result.data?.url || result.data || result.url; 
            if (typeof imgUrl === 'string' && imgUrl.startsWith('http')) {
                htmlBody = `
                    <img src="${imgUrl}" style="max-width:100%; border-radius:8px; margin-bottom:15px; border:1px solid #e2e8f0;">
                    <br><a href="${imgUrl}" target="_blank" style="background:#2563eb; color:white; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;">🔍 Buka Full Gambar</a>
                `;
            }
        } 
        else if (endpoint === 'ttstalk' && result.data) {
            let p = result.data;
            let avatar = p.avatar || p.profile_pic || 'https://via.placeholder.com/100';
            htmlBody = `
                <div style="text-align:center; color:#0f172a;">
                    <img src="${avatar}" style="width:100px; height:100px; border-radius:50%; margin-bottom:10px; border:3px solid #2563eb;">
                    <h3 style="margin:0; font-size:18px;">${p.nickname || p.username || inputVal}</h3>
                    <p style="font-size:13px; color:#64748b; margin-top:4px;">${p.signature || p.bio || 'Tidak ada bio'}</p>
                    <div style="display:flex; justify-content:center; gap:20px; margin-top:15px; font-size:13px;">
                        <div><b style="font-size:16px;">${p.followers || 0}</b><br>Followers</div>
                        <div><b style="font-size:16px;">${p.following || 0}</b><br>Following</div>
                        <div><b style="font-size:16px;">${p.likes || p.heart || 0}</b><br>Likes</div>
                    </div>
                </div>
            `;
        }
        else {
            let mediaUrl = result.data?.url || result.data?.link || result.data?.download || result.url || (typeof result.data === 'string' && result.data.startsWith('http') ? result.data : null);
            if (!mediaUrl && Array.isArray(result.data) && result.data.length > 0) mediaUrl = result.data[0].url || result.data[0].link;

            if (mediaUrl && typeof mediaUrl === 'string' && mediaUrl.startsWith('http')) {
                let btnColor = endpoint === 'ytmp3' ? '#8b5cf6' : '#10b981';
                let icon = endpoint === 'ytmp3' ? '🎵' : '📥';
                htmlBody = `
                    <div style="margin-top:10px;">
                        <a href="${mediaUrl}" target="_blank" style="background:${btnColor}; color:white; padding:12px 24px; border-radius:8px; text-decoration:none; font-size:15px; font-weight:bold; display:inline-flex; align-items:center; gap:8px;">
                            ${icon} Download File
                        </a>
                    </div>
                `;
            } else {
                htmlBody = `<div style="text-align:left; font-size:11px; max-height:250px; overflow-y:auto; background:#f1f5f9; padding:12px; border-radius:6px; color:#0f172a;"><pre style="margin:0; white-space:pre-wrap;">${JSON.stringify(result, null, 2)}</pre></div>`;
            }
        }

        Swal.fire({ title: `✅ ${toolName}`, html: htmlBody, confirmButtonText: 'Tutup', confirmButtonColor: '#2563eb', background: '#ffffff' });
    } catch (error) {
        Swal.fire('Waduh Error!', 'Gagal menghubungi server API. Cek lagi URL yang dimasukkan.', 'error');
    }
}


// ==========================================
// UNTUK INDEX.HTML (MAINTENANCE, STREAM, CHARTS)
// ==========================================
function showMaintenanceAlert() {
    Swal.fire({ icon: 'warning', title: 'Sistem Maintenance', text: 'Fitur ini sedang dalam perbaikan API. Silakan gunakan menu Utility Tools.' });
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

// Inisialisasi Chart jika ada di halaman tersebut
if (document.getElementById('chartRequests')) {
    setInterval(() => {
        updateChart('chartRequests'); updateChart('chartSuccess');
        const cpuEl = document.getElementById('cpuVal'); if(cpuEl) cpuEl.innerText = Math.floor(Math.random() * 40) + 60; 
        updateChart('chartCpu');
        const threadEl = document.getElementById('threadVal'); if(threadEl) threadEl.innerText = Math.floor(Math.random() * 10) + 40;
        updateChart('chartThread');
    }, 1500);
}

// ==========================================
// AUDIO PLAYER
// ==========================================
const bgMusic = document.getElementById('bgMusic');
const audioToggleBtn = document.getElementById('audioToggleBtn');
const audioStatusText = document.getElementById('audioStatusText');

function toggleMusicManual() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
        bgMusic.play();
        if(audioToggleBtn) audioToggleBtn.innerText = "❚❚";
        if(audioStatusText) audioStatusText.innerText = "Status: Playing";
    } else {
        bgMusic.pause();
        if(audioToggleBtn) audioToggleBtn.innerText = "▶";
        if(audioStatusText) audioStatusText.innerText = "Status: Paused";
    }
    }
    
