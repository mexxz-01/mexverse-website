/* =========================================================================
   MEXVERSE SMP — CLIENT LOGIC & 3D SKIN RENDERING
   Modeled directly on Web-Aetheria architecture
   ========================================================================= */

let soundActive = true;
let audioContext = null;

// Initialize Web Audio API for authentic Minecraft Ding
function playDing() {
  if (!soundActive) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!audioContext && AudioCtx) {
      audioContext = new AudioCtx();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1318.51, now);
    osc.frequency.exponentialRampToValueAtTime(1661.22, now + 0.08);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

function toggleAudio() {
  soundActive = !soundActive;
  const icon = document.getElementById('soundIcon');
  if (icon) {
    icon.className = soundActive ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
  }
  if (soundActive) playDing();
}

// Copy Server IP
function copyServerIP() {
  copyText('mexverse.qd.je');
}

function copyText(text) {
  playDing();

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied "${text}" to clipboard!`);
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
      showToast(`Copied "${text}" to clipboard!`);
    } catch (e) {
      console.error(e);
    }
    ta.remove();
  }
}

// HUD Toast Notification (Matching Aetheria HUD)
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'hud-toast';
  toast.innerHTML = `
    <div class="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center font-bold text-sm shrink-0">
      <i class="fa-solid fa-check"></i>
    </div>
    <div>
      <h6 class="text-xs font-bold text-white uppercase tracking-wider font-mono-code">ACTION COMPLETE</h6>
      <p class="text-[11px] text-slate-300 font-mono-code">${message}</p>
    </div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

// Initialize 3D Minecraft Skinview3d Viewers on Podiums
function init3DSkins() {
  if (typeof skinview3d === 'undefined') {
    setTimeout(init3DSkins, 200);
    return;
  }

  // Rank 1: MEXXZ (Champion - Center)
  const canvas1 = document.getElementById('skinCanvasRank1');
  if (canvas1) {
    try {
      const viewer1 = new skinview3d.SkinViewer({
        canvas: canvas1,
        width: canvas1.clientWidth || 240,
        height: canvas1.clientHeight || 280,
        skin: 'https://textures.minecraft.net/texture/292009a4925b34f0298f93975760184134d675a504708fa1aac308153b19f' // Default Epic Skin
      });
      viewer1.camera.position.z = 70;
      viewer1.camera.position.y = -5;
      viewer1.animation = new skinview3d.WalkingAnimation();
      viewer1.animation.speed = 0.6;
      viewer1.autoRotate = true;
      viewer1.autoRotateSpeed = 0.8;
    } catch (e) {
      console.warn('Skinviewer 1 init err', e);
    }
  }

  // Rank 2: ViperX (Silver - Left)
  const canvas2 = document.getElementById('skinCanvasRank2');
  if (canvas2) {
    try {
      const viewer2 = new skinview3d.SkinViewer({
        canvas: canvas2,
        width: canvas2.clientWidth || 200,
        height: canvas2.clientHeight || 240,
        skin: 'https://textures.minecraft.net/texture/23e9cb19058b73f8a65c92c4233ccf137e283b9e4a362ef0c16928e4e7e6'
      });
      viewer2.camera.position.z = 75;
      viewer2.camera.position.y = -5;
      viewer2.animation = new skinview3d.IdleAnimation();
      viewer2.animation.speed = 0.5;
      viewer2.autoRotate = true;
      viewer2.autoRotateSpeed = 0.6;
    } catch (e) {
      console.warn('Skinviewer 2 init err', e);
    }
  }

  // Rank 3: ShadowStrike (Bronze - Right)
  const canvas3 = document.getElementById('skinCanvasRank3');
  if (canvas3) {
    try {
      const viewer3 = new skinview3d.SkinViewer({
        canvas: canvas3,
        width: canvas3.clientWidth || 200,
        height: canvas3.clientHeight || 240,
        skin: 'https://textures.minecraft.net/texture/c234a652e90f238bc3571d729a421b4742a78122c6085a6760ef16297316719'
      });
      viewer3.camera.position.z = 75;
      viewer3.camera.position.y = -5;
      viewer3.animation = new skinview3d.IdleAnimation();
      viewer3.animation.speed = 0.5;
      viewer3.autoRotate = true;
      viewer3.autoRotateSpeed = 0.6;
    } catch (e) {
      console.warn('Skinviewer 3 init err', e);
    }
  }
}

// Live Server Status & Player Heads
async function fetchServerStatus() {
  const countText = document.getElementById('player-count-text');
  const dot = document.getElementById('server-status-dot');
  const playerList = document.getElementById('player-list-container');

  try {
    const res = await fetch('https://api.mcstatus.io/v2/status/java/impairment-telling.tun.ply.gg:65482');
    if (res.ok) {
      const data = await res.json();
      if (data.online) {
        const online = data.players.online;
        const max = data.players.max;
        if (countText) countText.textContent = `${online} / ${max} WARRIORS ONLINE`;
        if (dot) dot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 status-ring-pulse';

        // Render player heads if any players online
        if (playerList) {
          if (data.players.list && data.players.list.length > 0) {
            playerList.innerHTML = '';
            data.players.list.forEach(p => {
              const pill = document.createElement('div');
              pill.className = 'flex items-center gap-2 bg-slate-900/90 border border-rose-500/30 px-3 py-1.5 rounded-xl';
              pill.innerHTML = `
                <img src="https://mc-heads.net/avatar/${p.name_clean || p.name}/24" class="w-6 h-6 rounded" alt="${p.name_clean || p.name}">
                <span class="text-xs font-mono-code font-bold text-white">${p.name_clean || p.name}</span>
              `;
              playerList.appendChild(pill);
            });
          } else {
            playerList.innerHTML = `
              <div class="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                <img src="https://mc-heads.net/avatar/Steve/24" class="w-6 h-6 rounded" alt="Steve">
                <span class="text-xs font-mono-code text-slate-300">Server Ready • 0/${max} Exploring • Be the first to join!</span>
              </div>
            `;
          }
        }
      } else {
        if (countText) countText.textContent = 'REALM ONLINE • 20.0 TPS';
      }
    }
  } catch (e) {
    if (countText) countText.textContent = 'REALM ONLINE • MEXVERSE SMP';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchServerStatus();
  setInterval(fetchServerStatus, 25000);
  init3DSkins();
});


function copyDiscordInvite() {
  const invite = 'https://discord.gg/Z6CUm7T';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(invite).then(() => {
      playDing();
      showToast('Discord invite copied: ' + invite);
    }).catch(() => {
      showToast('Discord invite: ' + invite);
    });
  } else {
    showToast('Discord invite: ' + invite);
  }
}


// Payment & Rank Activation Modal Logic
function openPaymentModal(rankName, price, fullTitle, perks) {
  playDing();
  const modal = document.getElementById('payment-modal');
  if (!modal) return;

  const titleEl = document.getElementById('modalRankTitle');
  const priceEl = document.getElementById('modalRankPrice');
  const perksEl = document.getElementById('modalRankPerks');
  const qrImg = document.getElementById('modalQrImg');
  const upiAppBtn = document.getElementById('modalUpiAppBtn');

  if (titleEl) titleEl.textContent = fullTitle || (rankName + ' RANK');
  if (priceEl) priceEl.textContent = '₹' + price;
  if (perksEl) perksEl.textContent = perks || '';

  const upiUri = `upi://pay?pa=mexxz@slc&pn=MEXVERSE%20SMP&am=${price}&cu=INR&tn=${encodeURIComponent(rankName + ' Rank')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUri)}`;

  if (qrImg) qrImg.src = qrUrl;
  if (upiAppBtn) upiAppBtn.href = upiUri;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('payment-modal');
  if (e.target === modal) {
    closePaymentModal();
  }
});
