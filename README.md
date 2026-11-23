# MentorLagbe – Client

MentorLagbe is an online tuition marketplace that connects students with tutors. Students can find tuition opportunities, apply to tuition posts, save their favorite tuitions, and manage their applications. Tutors can publish tuition posts and manage applicants.

## Live Website

https://mentorlagbe-client-sandy.vercel.app/

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Better Auth
- Stripe
- Sonner
- Lucide React

## Key Features

- Student, Tutor, and Admin dashboards.
- Secure authentication and role-based access.
- Browse and search tuition posts.
- Students can apply for tuition opportunities.
- Bookmark and manage saved tuitions.
- Free and Pro subscription plans.
- Tutors can create, edit, close, activate, and delete tuition posts.
- Tutors can review and manage student applications.
- Admin dashboard for managing users and tuition posts.
- Online subscription payments using Stripe.
- Responsive design for mobile, tablet, and desktop.
- Toast notifications and loading states.

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Aysha014/mentorlagbe-client.git
   ```

2. Navigate to the project directory:

   ```bash
   cd mentorlagbe-client
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env.local` file in the root directory and configure the required environment variables:

   ```env
   NEXT_PUBLIC_API_URL=YOUR_SERVER_URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   BETTER_AUTH_URL=http://localhost:3000
   BETTER_AUTH_SECRET=YOUR_BETTER_AUTH_SECRET
   GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
   GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
   NEXT_PUBLIC_IMGBB_API_KEY=YOUR_IMGBB_API_KEY
   ```

   Add any additional environment variables required by your authentication and payment configuration.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open http://localhost:3000 in your browser.

## Deployment

The client application is deployed on Vercel.

Live URL: https://mentorlagbe-client-sandy.vercel.app/

## Author

Developed as a full-stack web development project.
