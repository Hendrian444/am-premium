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
// MODERN SECURE REDIRECTOR (100% WORK & STABIL)
// ==========================================
function runApiTool(endpoint, inputId, toolName) {
    const inputVal = document.getElementById(inputId).value.trim();
    if (!inputVal) {
        return Swal.fire({
            icon: 'warning',
            title: 'Input Kosong',
            text: 'Harap masukkan tautan atau username terlebih dahulu!',
            confirmButtonColor: '#2563eb'
        });
    }

    const encodedUrl = encodeURIComponent(inputVal);
    let targetSiteName = '';
    let targetLink = '';

    // Pemetaan rujukan situs downloader publik paling stabil di dunia
    switch(endpoint) {
        case 'ttdl':
            targetSiteName = 'SnapTik / TikWM';
            targetLink = `https://snaptik.app/en?url=${encodedUrl}`;
            break;
        case 'igdl':
            targetSiteName = 'SnapInsta / SaveIG';
            targetLink = `https://snapinsta.app/`;
            break;
        case 'ttstalk':
            let cleanUser = inputVal.replace('@', '');
            targetSiteName = 'Urlebird Stalker';
            targetLink = `https://urlebird.com/user/${cleanUser}/`;
            break;
        case 'ytmp3':
            targetSiteName = 'Y2mate Audio Converter';
            targetLink = `https://www.y2mate.com`;
            break;
        case 'ytmp4':
            targetSiteName = 'SaveFrom YouTube';
            targetLink = `https://en.savefrom.net/#url=${encodedUrl}`;
            break;
        case 'removebg':
            targetSiteName = 'Remove.bg Official';
            targetLink = `https://www.remove.bg/`;
            break;
        case 'hdr':
            targetSiteName = "Let's Enhance AI";
            targetLink = `https://letsenhance.io/`;
            break;
        default:
            targetSiteName = 'Web Resmi';
            targetLink = inputVal;
    }

    // Tampilkan animasi transisi modern sebelum membuka situs
    Swal.fire({
        title: 'Mengarahkan...',
        text: `Menyiapkan koneksi aman ke ${targetSiteName}`,
        icon: 'success',
        timer: 1200,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    }).then(() => {
        window.open(targetLink, '_blank');
    });
}


// ==========================================
// SCRIPT PENDUKUNG UTAMA (INDEX.HTML)
// ==========================================
function showMaintenanceAlert() {
    Swal.fire({ 
        icon: 'warning', 
        title: 'Sistem Maintenance', 
        text: 'Fitur utama konsol sedang dalam perbaikan server. Silakan gunakan menu Utility Tools.',
        confirmButtonColor: '#2563eb'
    });
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
        
