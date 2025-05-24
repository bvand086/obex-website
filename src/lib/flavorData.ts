export interface FlavorInfo {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  hoverDescription: string;
  perfectFor: string[];
  priceId: string;
  gradientFrom: string;
  gradientTo: string;
  accentColors: {
    light: string;
    medium: string;
    dark: string;
  };
}

export const FLAVOR_DATA: FlavorInfo[] = [
  {
    id: 'mint',
    name: 'Smooth Mint',
    color: 'green',
    bgColor: '#22c55e',
    textColor: '#ffffff',
    description: 'Experience the crisp and invigorating taste of smooth mint. This classic flavour not only soothes your senses but also provides a cooling comforting sensation.',
    hoverDescription: 'Perfect For:',
    perfectFor: [
      'After meals with strong flavors',
      'When you want a cool sensation',
      'A refreshing daytime option'
    ],
    priceId: 'price_1CDEFGHIJKLMNOPQRSTUVWX',
    gradientFrom: 'green-400',
    gradientTo: 'green-600',
    accentColors: {
      light: 'green-50',
      medium: 'green-200',
      dark: 'green-700'
    }
  },
  {
    id: 'lemon',
    name: 'Lemon Meringue',
    color: 'yellow',
    bgColor: '#eab308',
    textColor: '#ffffff',
    description: 'Indulge in the delightful tang of lemon meringue, reminiscent of a classic dessert. The perfect balance of zesty lemon and sweet meringue creates a delectable treat that will brighten your day while keeping you comfortable.',
    hoverDescription: 'Perfect For:',
    perfectFor: [
      'After citrus or acidic meals',
      'When you need a mood boost',
      'A bright morning option'
    ],
    priceId: 'price_2CDEFGHIJKLMNOPQRSTUVWX',
    gradientFrom: 'yellow-400',
    gradientTo: 'yellow-500',
    accentColors: {
      light: 'yellow-50',
      medium: 'yellow-200',
      dark: 'yellow-700'
    }
  },
  {
    id: 'orange',
    name: 'Orange Cream',
    color: 'orange',
    bgColor: '#f97316',
    textColor: '#ffffff',
    description: 'Savour the nostalgic blend of creamy vanilla and bright orange with our orange creamsicle flavour. This comforting and luscious option takes you back to childhood summers, offering a soothing and enjoyable way to manage reflux.',
    hoverDescription: 'Perfect For:',
    perfectFor: [
      'After spicy meals',
      'When seeking comfort',
      'A soothing evening option'
    ],
    priceId: 'price_3CDEFGHIJKLMNOPQRSTUVWX',
    gradientFrom: 'orange-400',
    gradientTo: 'orange-600',
    accentColors: {
      light: 'orange-50',
      medium: 'orange-200',
      dark: 'orange-700'
    }
  }
]; 