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
// SMART PUBLIC DOWNLOADER REDIRECTOR (100% WORK)
// ==========================================
function runApiTool(endpoint, inputId, paramKey, toolName) {
    const inputVal = document.getElementById(inputId).value.trim();
    if (!inputVal) {
        return Swal.fire('Oops!', 'Kolom input tidak boleh kosong, Lek!', 'warning');
    }

    const encodedUrl = encodeURIComponent(inputVal);
    let actionHtml = '';

    // 1. TikTok Downloader
    if (endpoint === 'ttdl') {
        actionHtml = `
            <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Pilih server publik downloader TikTok tercepat:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="https://snaptik.app/en?url=${encodedUrl}" target="_blank" style="background:#000; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block; box-shadow:0 4px 6px rgba(0,0,0,0.1);">⚡ Buka via SnapTik (Rekomendasi)</a>
                <a href="https://tikwm.com/" target="_blank" style="background:#2563eb; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block;">🚀 Buka via TikWM</a>
            </div>
        `;
    } 
    // 2. Instagram Downloader
    else if (endpoint === 'igdl') {
        actionHtml = `
            <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Pilih server publik downloader Instagram:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="https://snapinsta.app/" target="_blank" style="background:#e1306c; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block; box-shadow:0 4px 6px rgba(0,0,0,0.1);">📸 Buka via SnapInsta</a>
                <a href="https://saveig.app/en" target="_blank" style="background:#2563eb; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block;">🔥 Buka via SaveIG</a>
            </div>
        `;
    } 
    // 3. TikTok Stalker
    else if (endpoint === 'ttstalk') {
        let username = inputVal.replace('@', '');
        actionHtml = `
            <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Pilih platform stalker akun TikTok:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="https://urlebird.com/user/${username}/" target="_blank" style="background:#000; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block; box-shadow:0 4px 6px rgba(0,0,0,0.1);">🕵️ Stalk via Urlebird</a>
                <a href="https://tokcounter.com/" target="_blank" style="background:#2563eb; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block;">📊 Cek Statistik via TokCounter</a>
            </div>
        `;
    } 
    // 4. YouTube MP3 & MP4
    else if (endpoint === 'ytmp3' || endpoint === 'ytmp4') {
        const isMp3 = endpoint === 'ytmp3';
        actionHtml = `
            <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Pilih server converter YouTube (${isMp3 ? 'MP3' : 'MP4'}):</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="https://www.y2mate.com" target="_blank" style="background:#ef4444; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block; box-shadow:0 4px 6px rgba(0,0,0,0.1);">🔴 Buka via Y2mate</a>
                <a href="https://en.savefrom.net/#url=${encodedUrl}" target="_blank" style="background:#10b981; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block;">🟢 Buka via SaveFrom</a>
            </div>
        `;
    } 
    // 5. Remove Background
    else if (endpoint === 'removebg') {
        actionHtml = `
            <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Gunakan layanan penghapus background terbaik:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="https://www.remove.bg/" target="_blank" style="background:#2563eb; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block; box-shadow:0 4px 6px rgba(0,0,0,0.1);">✂️ Buka Remove.bg (Resmi)</a>
                <a href="https://photoroom.com/background-remover" target="_blank" style="background:#8b5cf6; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block;">✨ Buka Photoroom AI</a>
            </div>
        `;
    } 
    // 6. Image HDR Enhancer
    else if (endpoint === 'hdr') {
        actionHtml = `
            <p style="font-size:13px; color:#64748b; margin-bottom:15px;">Gunakan layanan peningkat kualitas / HDR gambar:</p>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <a href="https://letsenhance.io/" target="_blank" style="background:#2563eb; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block; box-shadow:0 4px 6px rgba(0,0,0,0.1);">✨ Buka Let's Enhance AI</a>
                <a href="https://upscale.media/" target="_blank" style="background:#10b981; color:white; padding:12px; border-radius:8px; text-decoration:none; font-weight:bold; display:block;">🔍 Buka Upscale.media</a>
            </div>
        `;
    }

    Swal.fire({
        title: `⚡ ${toolName} Ready`,
        html: actionHtml,
        showConfirmButton: false,
        showCloseButton: true,
        background: '#ffffff',
        width: '420px'
    });
}


// ==========================================
// SCRIPT PENDUKUNG UTAMA (INDEX.HTML)
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
