// Shared auth state and utilities used by every page

let currentUser = null;
let currentUserData = null;
let _notifUnsubscribe = null;

async function initAuth(options = {}) {
  const {
    requireAuth = false,
    requireAdmin = false,
    onReady = null
  } = options;

  return new Promise((resolve) => {
    auth.onAuthStateChanged(async (user) => {
      currentUser = user;

      if (user) {
        try {
          const snap = await db.collection('users').doc(user.uid).get();
          currentUserData = snap.exists ? snap.data() : null;

          // Auto-promote the site admin on first sign-in
          if (user.email === SITE_ADMIN_EMAIL && (!currentUserData || !currentUserData.isSiteAdmin)) {
            const patch = {
              uid: user.uid,
              email: user.email,
              isAdmin: true,
              isSiteAdmin: true,
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              privacy: { name: true, email: false, phone: false, kakao: false, city: true }
            };
            await db.collection('users').doc(user.uid).set(patch, { merge: true });
            const refreshed = await db.collection('users').doc(user.uid).get();
            currentUserData = refreshed.data();
          }
        } catch (e) {
          console.error('Error loading user data:', e);
        }

        _listenNotifications(user.uid);
      } else {
        currentUserData = null;
        if (_notifUnsubscribe) { _notifUnsubscribe(); _notifUnsubscribe = null; }
      }

      _updateNav();

      if (requireAuth && !user) { window.location.href = 'login.html'; return; }
      // Block unapproved users from protected pages (but not pending.html itself)
      if (requireAuth && user && currentUserData && currentUserData.approved === false) {
        if (!window.location.pathname.includes('pending.html')) {
          window.location.href = 'pending.html'; return;
        }
      }
      if (requireAdmin && (!currentUserData || !currentUserData.isAdmin)) {
        window.location.href = 'index.html'; return;
      }

      if (onReady) onReady(user, currentUserData);
      resolve({ user, userData: currentUserData });
    });
  });
}

function _listenNotifications(uid) {
  if (_notifUnsubscribe) _notifUnsubscribe();
  _notifUnsubscribe = db.collection('notifications').doc(uid)
    .collection('items')
    .where('read', '==', false)
    .onSnapshot(snap => {
      const badge = document.getElementById('notif-badge');
      if (badge) {
        const count = snap.size;
        badge.textContent = count;
        badge.classList.toggle('hidden', count === 0);
      }
    });
}

function _updateNav() {
  const loggedIn = !!currentUser;
  const isAdmin = loggedIn && currentUserData && currentUserData.isAdmin;

  _setVisible('nav-login', !loggedIn);
  _setVisible('nav-profile', loggedIn);
  _setVisible('nav-logout', loggedIn);
  _setVisible('nav-notif', loggedIn);
  _setVisible('nav-admin', isAdmin);

  // Mobile menu mirrors desktop
  _setVisible('mob-login', !loggedIn);
  _setVisible('mob-profile', loggedIn);
  _setVisible('mob-logout', loggedIn);
  _setVisible('mob-admin', isAdmin);
}

function _setVisible(id, visible) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('hidden', !visible);
}

async function signOut() {
  await auth.signOut();
  window.location.href = 'index.html';
}

// Open notification panel (simple dropdown)
async function openNotifications() {
  if (!currentUser) return;
  const snap = await db.collection('notifications').doc(currentUser.uid)
    .collection('items').orderBy('createdAt', 'desc').limit(20).get();

  const panel = document.getElementById('notif-panel');
  if (!panel) return;

  const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  if (items.length === 0) {
    panel.innerHTML = '<p class="text-sm text-gray-500 p-4">No notifications</p>';
  } else {
    panel.innerHTML = items.map(n => `
      <div class="p-3 border-b last:border-0 ${n.read ? 'opacity-60' : 'bg-indigo-50'} cursor-pointer hover:bg-gray-50"
           onclick="handleNotif('${n.id}','${n.type}','${n.relatedId || ''}')">
        <p class="text-sm">${n.message}</p>
        <p class="text-xs text-gray-400 mt-1">${n.createdAt ? formatDate(n.createdAt) : ''}</p>
      </div>`).join('');
  }
  panel.classList.toggle('hidden');
}

async function handleNotif(notifId, type, relatedId) {
  if (!currentUser) return;
  await db.collection('notifications').doc(currentUser.uid)
    .collection('items').doc(notifId).update({ read: true });

  if (type === 'linkRequest' && relatedId) {
    window.location.href = `profile.html#linkRequests`;
  }
  document.getElementById('notif-panel')?.classList.add('hidden');
}

function formatDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateTime(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) +
    ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-5 py-3 rounded-lg shadow-xl text-white z-[9999] text-sm font-medium
    ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.5s'; }, 2800);
  setTimeout(() => toast.remove(), 3400);
}

// Mobile nav toggle (called by hamburger button in HTML)
function toggleMobileMenu() {
  document.getElementById('mobile-menu')?.classList.toggle('hidden');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('#notif-container')) {
    document.getElementById('notif-panel')?.classList.add('hidden');
  }
});
