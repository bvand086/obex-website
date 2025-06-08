import { SERVER_FLAVORS } from './stripeConfig';

export function containsFlavorName(str: string): boolean {
  if (!str) return false;
  const lowercaseStr = str.toLowerCase();
  return SERVER_FLAVORS.some(flavor => lowercaseStr.includes(flavor.name.toLowerCase()));
}

export function generateDefaultFlavorDistribution(quantity: number): string {
  const baseCount = Math.floor(quantity / SERVER_FLAVORS.length);
  const remainder = quantity % SERVER_FLAVORS.length;
  
  return SERVER_FLAVORS.map((flavor, index: number) => {
    const count = baseCount + (index < remainder ? 1 : 0);
    return `${flavor.name}: ${count}`;
  }).join(', ');
}

export function getFlavorDetails(item: { flavor_breakdown?: string; flavorName?: string; quantity: number }): string {
  let flavorDetails = item.flavor_breakdown;
  
  // If flavor_breakdown is empty or appears to be a package name (not containing any flavour names)
  if (!flavorDetails || 
      !containsFlavorName(flavorDetails) || 
      flavorDetails.toLowerCase().includes('package')) {
    
    // Use flavorName if it contains actual flavour information
    if (item.flavorName && containsFlavorName(item.flavorName)) {
      flavorDetails = item.flavorName;
    } else {
      // Generate default even distribution if all else fails
      flavorDetails = generateDefaultFlavorDistribution(item.quantity);
    }
  }
  
  return flavorDetails;
}