# BITS Dubai BookBid

A modern textbook marketplace platform designed specifically for BITS Pilani Dubai students, featuring real-time bidding, secure payments, and seamless user experience.

## Features

### 🎯 Core Functionality
- **Real-time Bidding**: Live auction system with countdown timers
- **Secure Payments**: Stripe integration with escrow-style transactions
- **User Profiles**: Comprehensive dashboards and rating systems
- **Advanced Search**: Filter by condition, price, course, and more
- **Real-time Chat**: Direct messaging between buyers and sellers

### 🔐 Authentication & Security
- **Supabase Auth**: Email/password and Google OAuth
- **Domain Restriction**: Limited to @dubai.bits-pilani.ac.in emails
- **Row Level Security**: Database-level access control
- **GDPR Compliance**: Privacy controls and data export

### 📱 User Experience
- **Responsive Design**: Mobile-first approach
- **Dark/Light Mode**: Theme switching
- **Onboarding Flow**: Guided setup for new users
- **Help Center**: Comprehensive FAQs and support

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd bits-dubai-bookbid
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   Fill in your Supabase and Stripe credentials.

4. **Run database migrations**
   Execute the SQL scripts in the `scripts/` folder in your Supabase dashboard.

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

Visit `http://localhost:3000` to see the application.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── books/             # Book listing pages
│   ├── dashboard/         # User dashboard
│   ├── help/              # Help center
│   └── api/               # API routes
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client setup
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
├── scripts/              # Database migration scripts
└── public/               # Static assets
\`\`\`

## Key Features

### Real-time Bidding System
- Live bid updates using Supabase Realtime
- Automatic outbid notifications
- Countdown timers with urgency indicators
- Auto-bidding with maximum bid caps

### Secure Payment Processing
- Stripe Elements integration
- Escrow-style transaction handling
- Payment confirmation and order tracking
- Webhook handling for payment events

### Comprehensive User Management
- Profile creation and management
- Activity tracking and statistics
- Review and rating system
- Privacy controls and data export

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the [Help Center](./app/help)
- Review [Deployment Guide](./DEPLOYMENT.md)
- Contact the development team

---

Built with ❤️ for BITS Pilani Dubai students
