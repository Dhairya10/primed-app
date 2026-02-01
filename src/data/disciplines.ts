export interface Role {
  id: string;
  title: string;
  company: string;
  description: string;
  logoPath: string;
}

export interface Discipline {
  id: string;
  name: string;
  roles: Role[];
}

export const DISCIPLINES: Discipline[] = [
  {
    id: 'product',
    name: 'Product',
    roles: [
      {
        id: 'pm-netflix',
        title: 'Growth Product Manager',
        company: 'Netflix',
        description: 'How would you structure pricing for programmatic ads to maximize revenue while maintaining subscriber growth?',
        logoPath: '/src/assets/company-logos/netflix.png',
      },
      {
        id: 'pm-uber',
        title: 'Associate Product Manager',
        company: 'Uber',
        description: 'Uber for Business grew 50% in Q4 2024. How would you measure the success of this product?',
        logoPath: '/src/assets/company-logos/uber.png',
      },
      {
        id: 'pm-airbnb',
        title: 'Product Manager',
        company: 'Airbnb',
        description: "How would you improve Airbnb's AI fraud detection to reduce false positives that block legitimate bookings?",
        logoPath: '/src/assets/company-logos/airbnb.png',
      },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    roles: [
      {
        id: 'designer-spotify',
        title: 'UX Designer',
        company: 'Spotify',
        description: 'Users abandon 65% of AI-generated playlists. How would you design a prompt refinement experience to fix this?',
        logoPath: '/src/assets/company-logos/Spotify_Primary_Logo_RGB_Green.png',
      },
      {
        id: 'designer-figma',
        title: 'Senior Product Designer',
        company: 'Figma',
        description: "Teams share developer seats to cut costs. How would you design a seat management system that balances budget constraints with accountability?",
        logoPath: '/src/assets/company-logos/Figma Icon (Full-color).png',
      },
      {
        id: 'designer-notion',
        title: 'Product Designer',
        company: 'Notion',
        description: "Notion Mail's AI miscategorizes important emails. How would you design an adaptive learning system to reduce these errors?",
        logoPath: '/src/assets/company-logos/notion.png',
      },
    ],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    roles: [
      {
        id: 'marketing-stripe',
        title: 'Growth Marketing Manager',
        company: 'Stripe',
        description: "How would you develop a growth strategy to drive enterprise adoption of Stripe's new Stablecoin Financial Accounts?",
        logoPath: '/src/assets/company-logos/stripe.png',
      },
      {
        id: 'marketing-slack',
        title: 'Product Marketing Manager',
        company: 'Slack',
        description: 'Slack is repositioning as an "agentic operating system." How would you craft product messaging for this new vision?',
        logoPath: '/src/assets/company-logos/slack.png',
      },
      {
        id: 'marketing-chatgpt',
        title: 'Product Marketing Manager',
        company: 'ChatGPT',
        description: "GPT-4o's voice capabilities remain underutilized. Develop a campaign to drive voice mode adoption among 400 million weekly users",
        logoPath: '/src/assets/company-logos/chatgpt.png',
      },
    ],
  },
];
