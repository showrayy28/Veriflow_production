// VeriFlow Web 2.0 Constants

export const MANGROVE_SPECIES = [
  {
    name: 'Rhizophora mucronata',
    commonName: 'Asiatic Mangrove / Red Mangrove',
    woodDensityFactor: 1.12,
    description: 'Dense stilt-root structure, exceptional wave attenuation and coastal sediment carbon trapping.',
    nativeRegions: 'Sundarbans, Andaman & Nicobar, Mahanadi Delta',
  },
  {
    name: 'Avicennia marina',
    commonName: 'Grey Mangrove / White Mangrove',
    woodDensityFactor: 0.96,
    description: 'High salt tolerance, extensive pencil roots (pneumatophores), high below-ground biomass.',
    nativeRegions: 'Bhitarkanika, Gulf of Kutch, Pichavaram',
  },
  {
    name: 'Bruguiera gymnorhiza',
    commonName: 'Black Mangrove / Large-leafed Orange',
    woodDensityFactor: 1.08,
    description: 'Tall canopy former, high above-ground biomass volume, long carbon residence times.',
    nativeRegions: 'Godavari Delta, Krishna Estuary, Sundarbans',
  },
  {
    name: 'Sonneratia alba',
    commonName: 'Apple Mangrove / Mangrove Apple',
    woodDensityFactor: 1.05,
    description: 'Rapid pioneer colonizer on tidal mudflats, fast annual carbon accumulation rate.',
    nativeRegions: 'Coringa Wildlife Sanctuary, Konkan Coast',
  },
];

export const POLYGON_AMOY_CHAIN = {
  chainId: '0x13882', // 80002 in hex
  chainIdDecimal: 80002,
  chainName: 'Polygon Amoy Testnet',
  nativeCurrency: {
    name: 'MATIC',
    symbol: 'MATIC',
    decimals: 18,
  },
  rpcUrls: ['https://rpc-amoy.polygon.technology/'],
  blockExplorerUrls: ['https://amoy.polygonscan.com/'],
};

export const DEMO_USERS = {
  farmer: {
    email: 'ramesh@sunderbans.in',
    name: 'Ramesh Mondal (Coastal Farmer)',
    role: 'farmer',
    badge: 'Farmer Portal',
    address: '0x71C83D431a89c9d4b009FE543477F5B648834465',
  },
  admin: {
    email: 'admin@veriflow.org',
    name: 'Dr. Aris Thorne (MRV Lead Auditor)',
    role: 'admin',
    badge: 'MRV Auditor Studio',
    address: '0x2546BcD3c84621e976D8185a91A922aE364C9FF3',
  },
  buyer: {
    email: 'esg@greenfuture.com',
    name: 'GreenFuture ESG Capital Corp',
    role: 'buyer',
    badge: 'ESG Marketplace Buyer',
    address: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
  },
};
