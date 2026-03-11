# User Guide - Good Practices Platform

## 1. Overview

Good Practices Platform is a bilingual (Vietnamese/English) knowledge hub for sustainable agriculture in shrimp and rice value chains.

Main user groups:
- Visitors: browse public content without logging in.
- Registered users: create an account and sign in.
- Moderators/Admins: manage content in the admin area.

Default language is Vietnamese (`/vi` or non-prefixed routes). English pages are under `/en/...`.

## 2. Accessing the Platform

Open the homepage:
- Local: `http://localhost:3000`
- Production: your deployed domain

Top navigation includes:
- Home
- Library
- Events
- Explore
- Language switch (`VI`/`EN`)
- Sign in

## 3. Public User Features

### 3.1 Browse Content

Go to `Library` to access the main repository:
- Search by keyword
- Filter by category
- Filter by content type
- Paginate through results

Quick-access cards in Library link to:
- Policies
- Reports
- Global best practices
- Vietnam best practices

### 3.2 View Content Detail

Open any item to see:
- Title, description, type, publish date, view count
- Rich text content
- Image/video (if provided)
- PDF viewer + download/open buttons (for PDF items)
- External reference/content URL (if provided)

### 3.3 View Events

`Events` and `Tat ca su kien` pages provide:
- Event cards
- Event date/time
- Event location (if available)
- Pagination for full event listing

### 3.4 Other Public Pages

Public pages include:
- News
- Stories
- Partners
- Commitment
- ESG
- Members
- Join us
- Contact

## 4. Account Registration and Sign-In

### 4.1 Register (`/auth/signup`)

Required fields:
- Full name
- Email
- Phone
- Province
- Password + confirmation

Optional:
- Organization

Registration checks:
- Email must be unique
- Phone must be unique

After successful registration, sign in at `/auth/signin`.

### 4.2 Sign In (`/auth/signin`)

Use email + password credentials.

After sign-in:
- Admin users are redirected to `/admin`
- Other users are redirected to `/`

## 5. Admin and Moderator Guide

Admin area: `/admin`  
Access:
- `ADMIN`: full access
- `MODERATOR`: content management access

### 5.1 Admin Dashboard

Dashboard includes:
- Content statistics
- Content table
- Create/edit/delete actions
- Selection checkboxes for bulk actions

Table indicators:
- Featured content icon
- Non-public content icon
- Status badge: Draft/Published/Archived
- Content type badge

### 5.2 Create or Edit Content

Open **Them noi dung** or edit an existing row.

Main fields:
- Vietnamese content: title, description, body
- English content: title/description/body (optional)
- Category (from dynamic taxonomy)
- Type (Article, Document, Story, Project Activity, Guide, Policy, News, Event)
- Tags
- Homepage section placement (optional)
- Content URL / external URL
- YouTube URL
- Thumbnail/image/file attachments
- Visibility (`Cong khai`)
- Status (`Draft`, `Published`, `Archived` for Admin)

Rules enforced:
- Category is required and must exist/active.
- `EVENT` requires a valid start time.
- `PROJECT_ACTIVITY` requires Content URL.
- End time must be after start time.
- Section placement is validated by type.

### 5.3 Event-Specific Fields

When `Type = EVENT`, additional fields appear:
- All-day toggle
- Start date/time
- End date/time
- Timezone
- Location

### 5.4 File Upload and File Library

In content form, you can:
- Upload file(s) directly
- Or choose from File Manager

File Manager features:
- Search files
- Filter by file type
- Grid/List view
- Preview/download
- Pagination

### 5.5 Category Management (Admin only)

Page: `/admin/categories`

Admin can:
- Create category (slug, VI/EN name, order)
- Edit category
- Activate/deactivate category
- Delete category (only if not used by content)

### 5.6 User Management (Admin only)

Page: `/admin/users`

Admin can:
- View all users and activity counts
- Search users by name/email/phone/org/role
- Export user list to CSV
- Export user list to Excel (`.xls`)

## 6. Roles and Permissions

- Visitor: browse all public pages/content.
- Logged-in user: create/update own content through APIs; cannot access admin UI.
- Moderator: access admin content management.
- Admin: full admin rights (users, categories, featured/archive controls).

## 7. Notes and Current Limitations

- Some pages (for example Join Us) currently display forms but do not submit to a backend workflow.
- Admin dashboard includes bulk action buttons; if a bulk action fails, update items individually in the meantime.
- On Vercel, persistent file storage is limited; external storage links are recommended for durable files.

## 8. Troubleshooting

- Cannot sign in:
  - Verify email/password
  - Check if account already exists and password is correct
- Access denied on `/admin`:
  - Confirm account role is `ADMIN` or `MODERATOR`
- Content not visible publicly:
  - Ensure `isPublic = true` and `status = PUBLISHED`
- Event not listed correctly:
  - Confirm event start date/time is valid
- Upload problems:
  - Check file size/type limits
  - Prefer external links for large/critical documents

## 9. Quick URL Reference

- Home: `/` or `/vi` or `/en`
- Sign in: `/auth/signin`
- Sign up: `/auth/signup`
- Library: `/library`
- Events: `/tat-ca-su-kien`
- Admin dashboard: `/admin`
- Admin users: `/admin/users`
- Admin categories: `/admin/categories`
