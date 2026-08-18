# Strapi Setup Guide for Reservations

## Completed Frontend Changes
- ✅ Date field restricted to today only (read-only in form)
- ✅ Phone field made optional
- ✅ Time slots changed to 30-minute dropdown (12:00-23:30)
- ✅ All numbers formatted to English (0-9) throughout the page
- ✅ "View Full Menu" button moved to top of featured menu section

## Remaining Tasks (Strapi Backend)

### 1. Enable/Disable Reservations Toggle

**Option A: Create a Global Settings Single Type**

1. Go to Strapi Content-type Builder
2. Click "Create new single type"
3. Name it "Settings" or "Restaurant Settings"
4. Add these fields:
   - `acceptingReservations` (Boolean) - Toggle for enabling/disabling reservations
   - `adminEmail` (Email) - Where reservation emails should be sent
   - `restaurantPhone` (String) - Restaurant contact phone
   - `reservationNotes` (Text) - Optional notes shown when reservations are disabled

5. Create one Settings entry in the content manager
6. Set `acceptingReservations` to `true` or `false` as needed

**Option B: Add as a Field to Restaurant Info (if exists)**

If you already have a restaurant info/settings collection, add the `acceptingReservations` boolean field there.

---

### 2. Email Notifications for Reservations

**Setup Steps:**

#### A. Configure Strapi Email Plugin

1. In `cms/config/plugins.js`, configure email provider:

```javascript
'email': {
  config: {
    provider: 'nodemailer',
    providerOptions: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    settings: {
      defaultFrom: 'noreply@samdan.sa',
      defaultReplyTo: 'aleenamussarat@gmail.com',
    },
  },
},
```

2. Add to `.env`:
```
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASSWORD=your-password
```

#### B. Update Inquiry Controller

In `cms/src/api/inquiry/controllers/inquiry.js`, add email sending logic:

```javascript
async create(ctx) {
  // Check if reservations are enabled
  const settings = await strapi.db.query('api::setting.setting').findOne();
  
  if (!settings?.acceptingReservations) {
    return ctx.badRequest('Reservations are currently disabled');
  }

  // Create the inquiry
  const result = await super.create(ctx);

  // Send email notification
  try {
    await strapi.plugins['email'].services.email.send({
      to: settings.adminEmail || 'aleenamussarat@gmail.com',
      from: 'noreply@samdan.sa',
      subject: `New Reservation Inquiry from ${ctx.request.body.data.name}`,
      html: `
        <h2>New Reservation Inquiry</h2>
        <p><strong>Name:</strong> ${ctx.request.body.data.name}</p>
        <p><strong>Phone:</strong> ${ctx.request.body.data.phone || 'Not provided'}</p>
        <p><strong>Date:</strong> ${ctx.request.body.data.date}</p>
        <p><strong>Time:</strong> ${ctx.request.body.data.time}</p>
        <p><strong>Guests:</strong> ${ctx.request.body.data.guests}</p>
        <p><strong>Notes:</strong> ${ctx.request.body.data.notes || 'None'}</p>
      `,
    });
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't fail the reservation if email fails
  }

  return result;
}
```

#### C. Frontend: Check Reservation Status

In `src/services/strapi.js`, add a function to check if reservations are enabled:

```javascript
export async function checkReservationsEnabled() {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch(`${STRAPI_URL}/api/setting?populate=*`, { 
        signal: controller.signal 
      })
      if (!res.ok) throw new Error(`Failed to fetch settings: ${res.status}`)
      const json = await res.json()
      return json?.data?.acceptingReservations !== false
    } finally {
      clearTimeout(timeout)
    }
  } catch (error) {
    console.error('Failed to check reservation status:', error)
    return true // Default to allowing reservations if check fails
  }
}

```

Update `Contact.jsx` to disable the form if reservations are disabled:

```javascript
const [reservationsEnabled, setReservationsEnabled] = useState(true)

useEffect(() => {
  checkReservationsEnabled().then(setReservationsEnabled)
}, [])

// In the form JSX:
{!reservationsEnabled ? (
  <div className="reserve-notice">
    <p>Reservations are currently closed. Please call us directly.</p>
  </div>
) : (
  <form>
    {/* form fields */}
  </form>
)}
```

---

### 3. Alternative Email Solution (If Nodemailer Setup is Complex)

Use a service like **SendGrid** or **Mailgun**:

1. Install plugin: `strapi install email-sendgrid` (or similar)
2. Configure with API key in `.env`
3. Update controller to use the plugin

---

### 4. Admin Notification Email Template Improvements

Consider adding:
- Reservation confirmation email sent to customer
- Automatic SMS if phone is provided
- Email reminders before reservation date
- Admin dashboard view of all reservations

---

## Testing Checklist

- [ ] Phone field is optional in Strapi schema
- [ ] Settings/configuration collection exists with `acceptingReservations` toggle
- [ ] Email plugin is configured with SMTP or SendGrid
- [ ] Inquiry controller sends email on new reservation
- [ ] Frontend checks reservation status before allowing submission
- [ ] Disabled reservations message shows when appropriate
- [ ] Emails are received at admin address with all reservation details

---

## Summary of Changes Made

### Frontend (React/Vite)
- ✅ `src/lib/useReservationForm.js` - Date locked to today, time slots dropdown, phone optional
- ✅ `src/components/Contact.jsx` - Updated form fields
- ✅ `src/components/ReserveModal.jsx` - Updated form fields
- ✅ `src/components/FeaturedMenu.jsx` - Moved CTA button to top
- ✅ `src/App.css` - Added select styling, applied font-variant-numeric for English numbers

### Backend (Strapi)
- ✅ `cms/src/api/inquiry/content-types/inquiry/schema.json` - Phone field now optional
- ⏳ Email plugin configuration (needs manual setup)
- ⏳ Settings collection for reservation toggle (needs creation)
- ⏳ Email sending logic in controller (needs implementation)
