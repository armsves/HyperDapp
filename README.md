# HyperDapp 🚀

A decentralized application (dApp) showcase and rating platform built with Hypergraph, featuring blockchain interaction tracking powered by Substreams.

## 🌟 Features

### Core Functionality
- **dApp Showcase**: Browse and discover active decentralized applications
- **dApp Submission**: Submit new dApps for community review
- **Rating System**: Rate dApps with blockchain-verified voting weights
- **Admin Panel**: Manage dApp approvals and activations
- **Blockchain Tracking**: Real-time interaction tracking using Substreams

### Advanced Features
- **Weighted Voting**: Voting power based on actual blockchain interactions
- **Substreams Integration**: Real-time blockchain data processing
- **Hypergraph Storage**: Decentralized data storage and management
- **Geo Connect Authentication**: Web3 wallet authentication
- **Responsive Design**: Modern UI with custom color palette

## 🎨 Design System

### Color Palette
- **Primary (Deep Purple)**: `#4B0082` - Base background/headers
- **Accent 1 (Electric Blue)**: `#3D9BE9` - Links, hover states, highlights
- **Accent 2 (Magenta)**: `#E940A9` - Call-to-action buttons, badges
- **Light Background**: `#1E1B2E` - Cards and contrast sections
- **Text (Light)**: `#F5F5F5` - Main text on dark backgrounds
- **Muted Text**: `#B0B0B0` - Descriptions, secondary info
- **Success**: `#4ADE80` - Positive metrics, ratings
- **Warning**: `#F87171` - Alerts, low ratings

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Blockchain**: Hypergraph, Substreams
- **Authentication**: Geo Connect
- **Data Storage**: Hypergraph Spaces (Public/Private)

### Project Structure
```
hyperdapp/
├── app/                          # Next.js app directory
│   ├── api/substreams/          # Substreams API integration
│   ├── public-space/[spaceid]/  # Public dApp showcase
│   ├── private-space/[spaceid]/ # Private dApp submission
│   ├── admin/dapps/             # Admin panel
│   ├── schema.ts                # Hypergraph schema definitions
│   ├── mapping.ts               # Hypergraph entity mappings
│   └── page.tsx                 # Landing page
├── Components/                  # React components
│   ├── Layout.tsx               # Main app layout
│   ├── Space/                   # Space-specific components
│   └── ui/                      # UI components
├── lib/                         # Utility libraries
│   └── blockchain-tracker.js     # Substreams integration
└── public/                      # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Hypergraph account
- Substreams API token (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hyperdapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUBSTREAMS_API_TOKEN=your_substreams_token_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📋 Usage Guide

### For Users

#### 1. **Connect Wallet**
- Click "Sign in with Geo Connect" in the top navigation
- Connect your Web3 wallet
- Your wallet address will be displayed in the navigation

#### 2. **Browse dApps**
- Navigate to "dApps Showcase" to view active dApps
- Each dApp shows:
  - Name, description, and category
  - Contract address
  - Current rating (1-5 stars)
  - Social links (X, GitHub)

#### 3. **Rate dApps**
- Click "Rate" on any dApp card
- View your interaction history with the contract
- See your voting weight based on usage
- Select a rating (1-5 stars)
- Your vote is weighted based on blockchain interactions

### For Developers

#### 1. **Submit dApps**
- Navigate to "Submit dApp" 
- Fill out the dApp information:
  - **Name**: dApp name
  - **Description**: Brief description
  - **Category**: DeFi, Gaming, Social, Tools, NFT, Infrastructure
  - **Contract Address**: Smart contract address
  - **Image URL**: Logo or screenshot
  - **Social Links**: X and GitHub URLs (optional)

#### 2. **Admin Management**
- Admin wallet: `0x141EA27023cEEf7d45611889699849cB267d89ca`
- Access admin panel to approve/reject submitted dApps
- Toggle dApp active status

### For Blockchain Integration

#### 1. **Substreams Configuration**
The system tracks interactions with specific contracts:
- **Uniswap V4 Permit2**: `0x000000000022D473030F116dDEE9F6B43aC78BA3`
- **Target Wallet**: `0xb39682FcCa63c5513cb70772AbC3bba4B4fafB68`

#### 2. **Voting Weight System**
- **No interactions**: 1x weight (standard vote)
- **1-4 interactions**: 1.2x weight (Light user)
- **5-14 interactions**: 1.5x weight (Regular user)
- **15-49 interactions**: 2.0x weight (Heavy user)
- **50+ interactions**: 3.0x weight (Power user)

## 🔧 Configuration

### Hypergraph Spaces
- **Public Space**: `745bd24c-3bf7-4e1d-b413-cffadddd0c61` (dApp showcase)
- **Private Space**: `c7967341-e422-4b1d-aa36-bfe8ee56aae1` (submissions)

### Substreams Settings
```javascript
const SUBSTREAMS_CONFIG = {
  TOKEN: "your_token_here",
  ENDPOINT: "https://mainnet.eth.streamingfast.io",
  SPKG: "/ethereum-explorer-v0.1.2.spkg",
  MODULE: "map_contract_events",
  START_BLOCK: '23456000',
  STOP_BLOCK: '+1000'
};
```

## 📊 Data Schema

### Dapp Entity
```typescript
class Dapp {
  name: string;                    // dApp name
  description?: string;            // Description
  category?: string;               // Category (DeFi, Gaming, etc.)
  contract?: string;               // Smart contract address
  rating?: number;                // Average rating (1-5)
  active?: boolean;                // Admin approval status
  image?: string;                  // Image URL
  xUrl?: string;                  // X (Twitter) URL
  githubUrl?: string;             // GitHub URL
}
```

## 🔄 Workflow

### dApp Submission Process
1. **User submits dApp** → Created in private space with `active: false`
2. **Admin reviews** → Toggles `active: true` in admin panel
3. **dApp appears** → Now visible in public showcase
4. **Users rate** → Blockchain interactions determine voting weight

### Rating Process
1. **User clicks "Rate"** → System fetches interaction history
2. **Substreams analysis** → Counts blockchain interactions
3. **Weight calculation** → Determines voting multiplier
4. **Vote submission** → Weighted rating applied to dApp

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Components
- **`PublicSpace.tsx`**: Main dApp showcase with rating system
- **`PrivateSpace.tsx`**: dApp submission form
- **`Layout.tsx`**: Navigation and authentication
- **`blockchain-tracker.js`**: Substreams integration
- **`route.ts`**: API endpoint for blockchain data

## 🔐 Security

### Admin Access
- Only wallet `0x141EA27023cEEf7d45611889699849cB267d89ca` can access admin features
- Admin panel allows toggling dApp active status

### Data Validation
- Image URLs validated before display
- Contract addresses checked for proper format
- Rating values capped at 5.0 maximum

## 🌐 Deployment

### Vercel Deployment
1. Connect repository to Vercel
2. Set environment variables:
   - `NEXT_PUBLIC_SUBSTREAMS_API_TOKEN`
3. Deploy automatically on push to main branch

### Environment Variables
```env
NEXT_PUBLIC_SUBSTREAMS_API_TOKEN=your_substreams_token
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Hypergraph**: Decentralized data storage and management
- **Substreams**: Real-time blockchain data processing
- **Geo Connect**: Web3 authentication
- **Next.js**: React framework
- **Tailwind CSS**: Styling framework

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**HyperDapp** - Empowering decentralized application discovery through blockchain-verified community ratings. 🚀