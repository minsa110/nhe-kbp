# Newport Heights Elementary — Korean Bilingual Program Family Community

A family directory and communication website for KBP families, built with plain HTML/CSS/JavaScript and Firebase (free Spark tier), hosted on GitHub Pages.

---

## Page Visibility

| Page | Not logged in | Logged in (pending approval) | Logged in (approved member) | Admin |
|---|:---:|:---:|:---:|:---:|
| **Home** (announcements + events) | Public items only | Public items only | All items | All items |
| **Announcements** | Public items only | Public items only | All items | All items + Create/Edit/Delete |
| **Calendar** | Public events only | Public events only | All events | All events + Create/Edit/Delete |
| **Login / Sign up** | ✅ | ✅ | ✅ | ✅ |
| **Pending approval page** | — | ✅ | — | — |
| **Directory** | ❌ → Login | ❌ → Pending page | ✅ (privacy-filtered) | ✅ (all fields) |
| **Profile** | ❌ → Login | ❌ → Pending page | ✅ | ✅ |
| **Admin panel** | ❌ | ❌ | ❌ | ✅ |

> **Public items** = announcements or events explicitly marked 🌐 Public by an admin.
> All other content is members-only (approved accounts only).

---

## Features for **Members** (Approved Accounts)

> 👥 = All members feature<br>
> ⚙️ = Admins only feature

### Announcements

- 👥 Browse all announcements, paginated with a "Load more" button
- 👥 Filter by year and by tag (clickable tag chips)
- ⚙️ Admins can create, edit, or delete announcements

### Calendar

- 👥 Full monthly calendar view; click any event to see details and description
- ⚙️ Admins can create, edit, or delete events

### Directory

- 👥 Browse all member families; filter by parent/student name, grade, or teacher
- 👥 Toggle between grid and list view
- 👥 Each family controls which fields are visible (name, email, phone, KakaoTalk, city) -- via their Profile page

### Profile

- 👥 Edit personal info: name, city, phone number, KakaoTalk ID
- 👥 Per-field privacy toggles — choose what other families can see in the directory
- 👥 Add students (first/last name, grade, teacher, relationship to student)
- 👥 Unlink yourself from a student
- 👥 Delete your own account and remove all your data

---

## Admin Panel Pages

> ⚙️ Admin pages only visible to approved admins<br>
> Accessible at `/admin-members.html` (redirect from `/admin.html`) for approved admins only.

### Members

- ⚙️ View all families in a table (ALL fields are visible: name, email, phone, KakaoTalk, city, students, teacher(s))
- ⚙️ Filter by name/email, grade, or teacher
- ⚙️ Copy filtered email list to clipboard (for BCC in your own email client)
- ⚙️ Manually add a member (name, email, optional contact info + students); generates a ready-to-send invite message so they can create their own account
- ⚙️ Bulk import members from CSV — pre-approves all imported accounts
- ⚙️ Export filtered list to CSV
- ⚙️ Approve or deny new sign-up requests; banner shows pending count
- ⚙️ Remove a member (deletes their profile data)

#### Members CSV import format

One member per row, no header row. Columns: `Name, Email, Phone, KakaoTalk, City`

- Name and Email are required; Phone, KakaoTalk, City are optional
- Rows whose email already exists in the system are skipped
- All imported members are pre-approved (no approval step needed)

Example:

```csv
Jane Kim,jane@email.com,(425) 555-1234,janekakao,Bellevue
John Park,john@email.com,,,Redmond
```

### Students

- ⚙️ View all student records with linked parents
- ⚙️ Search by name, grade, or teacher
- ⚙️ Edit individual student records (name, grade, teacher)
- ⚙️ Export to CSV
- ⚙️ **Bulk actions** (select multiple rows):
  - **Update** grade and/or teacher across all selected students at once (useful for year-end grade promotion)
  - **Merge** — combine two or more entries for the same real student into one row; all linked parents are preserved on the kept record. The kept record is determined automatically by sign-up date (earliest first). Merge history is stored so the action can be reversed.
  - **Unmerge** — available on any student that has been merged; restores each original entry and re-links its parents exactly as they were before the merge.

### Teachers

- ⚙️ Add or remove teachers from the dropdown list used across the site

### Manage Announcements

- ⚙️ Create announcements with a rich-text body, tags, and a public/private toggle
- ⚙️ Upload images into the body
- ⚙️ Edit or delete existing announcements
- ⚙️ Pin up to 3 announcements (pinned posts appear first with an amber highlight)

### Manage Events

- ⚙️ Create events with title, date/time, location, grade tags, rich-text description, and public/private toggle
- ⚙️ Edit or delete existing events

### Admins

- ⚙️ Grant or revoke admin access by email

---

## Technical Setup

### Firebase Setup

#### 1. Firestore Database Rules
Go to **Firebase Console → Firestore Database → Rules** and paste the contents of [`firestore.rules`](firestore.rules), then click **Publish**.

#### 2. Firebase Storage Rules (for image uploads in announcements/events)
Go to **Firebase Console → Storage → Rules** and paste the contents of [`storage.rules`](storage.rules), then click **Publish**.
You must first enable Storage: **Firebase Console → Storage → Get started**.

#### 3. Authentication
Go to **Firebase Console → Authentication → Sign-in method** and enable **Email/Password**.

#### 4. Site Admin
The email set as `SITE_ADMIN_EMAIL` in [`js/config.js`](js/config.js) is automatically granted site admin access on first login. That account is also auto-approved. All other sign-ups require admin approval.

---

## Development Notes

- For testing: `python -m http.server 8080`
- Deploying to GitHub Pages: **Settings → Pages → Source: main branch / root**
- Site live at: `https://minsa110.github.io/nhe-kbp/`

---

## Tech Stack

| Layer | Tool |
|---|---|
| Hosting | GitHub Pages (free static hosting) |
| Auth | Firebase Authentication — Email/Password |
| Database | Firebase Firestore (free Spark tier) |
| Storage | Firebase Storage (free Spark tier, for images) |
| Rich text | Quill.js 1.3.7 (CDN) |
| Calendar | FullCalendar.js 6.1.10 (CDN) |
| Styling | Tailwind CSS (CDN) |

No build step, no Node.js required — all files are plain HTML/JS that run directly in the browser.
