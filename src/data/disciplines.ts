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
];
