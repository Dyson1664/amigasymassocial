# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/55f765f5-bef4-4be9-88d6-60c91d2d3a8b

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/55f765f5-bef4-4be9-88d6-60c91d2d3a8b) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/55f765f5-bef4-4be9-88d6-60c91d2d3a8b) and click on Share -> Publish.

### Waitlist setup

The sold-out trip waitlist saves names, email addresses, mobile numbers, and sign-up times in the private `waitlist_signups` table. Administrators can view entries from `/admin/payments`.

Apply `supabase/migrations/20261010000000_add_amigas_waitlist.sql` to the connected Supabase project before deploying the website. The table grants public visitors permission to insert a sign-up only. Entries can be read only by signed-in administrators with access to this trip.

### Amigas Vietnam traveller details

The guest dashboard collects passport given names, surname, and date of birth for
each traveller on an Amigas Vietnam booking. Guests must confirm the details match
their passports before saving. Editing any field clears the confirmation checkbox.
Admins can view confirmation times, filter missing submissions, and download CSV
from the Traveller details section of `/admin/payments`. No email is sent.

Apply `supabase/migrations/20261020130000_add_amigas_traveller_details.sql` before
deploying. It adds only the `amigas_traveller_details` table, its policies and new
functions. Existing booking/payment tables and policies are not modified. Guest
writes are restricted to the booking email and the
`vietnam-amigas-y-mas-social` trip. Authorized trip admins have read access.
The save function uses invoker permissions and saves the whole traveller list
atomically. The database enforces confirmation and stamps its time.

Run `node --test tests/traveller-details.test.cjs` for validation/export tests.
`supabase/tests/amigas_traveller_details.sql` checks access using existing bookings
inside a transaction that rolls back all test details.
The optional browser suite is `node tests/traveller-details.browser.cjs`; it
requires Playwright with Chromium (or pass an installed Playwright package path).
It builds with test-only environment values and mocks every API call.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
