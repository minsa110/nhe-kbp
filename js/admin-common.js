// Shared utilities for all admin pages

function renderAdminNav(active) {
  const links = [
    { id: 'members',       href: 'admin-members.html',       icon: '👥', label: 'Members' },
    { id: 'students',      href: 'admin-students.html',      icon: '🎓', label: 'Students' },
    { id: 'teachers',      href: 'admin-teachers.html',      icon: '🍎', label: 'Teachers' },
    { id: 'announcements', href: 'admin-announcements.html', icon: '📢', label: 'Announcements' },
    { id: 'events',        href: 'admin-events.html',        icon: '📅', label: 'Events' },
    { id: 'admins',        href: 'admin-admins.html',        icon: '🔑', label: 'Admins' },
  ];
  const el = document.getElementById('admin-subnav');
  if (!el) return;
  el.innerHTML = `
    <div class="bg-indigo-50 border-b border-indigo-100 overflow-x-auto">
      <div class="max-w-7xl mx-auto px-4 flex min-w-max">
        ${links.map(l => `
          <a href="${l.href}"
             style="padding:0.6rem 1rem;font-size:0.85rem;font-weight:500;text-decoration:none;white-space:nowrap;
                    border-bottom:2px solid ${l.id === active ? '#4f46e5' : 'transparent'};
                    color:${l.id === active ? '#4338ca' : '#4b5563'};
                    background:${l.id === active ? '#fff' : 'transparent'}">
            ${l.icon} ${l.label}
          </a>`).join('')}
      </div>
    </div>`;
}

async function getTeacherList() {
  try {
    const snap = await db.collection('config').doc('teachers').get();
    return snap.exists ? (snap.data().list || []) : [];
  } catch (e) { return []; }
}

async function loadTeachersIntoSelect(selectId, blankLabel = 'Select teacher…') {
  const list = await getTeacherList();
  const sel = document.getElementById(selectId);
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = `<option value="">${blankLabel}</option>`;
  list.forEach(t => {
    const o = document.createElement('option');
    o.value = t; o.textContent = t;
    sel.appendChild(o);
  });
  if (current) sel.value = current;
}

function downloadCSV(rows, filename) {
  const csv = rows.map(r =>
    r.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(',')
  ).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = filename;
  a.click();
}
