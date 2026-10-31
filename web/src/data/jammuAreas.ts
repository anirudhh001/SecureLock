export interface JammuArea {
  id: string;
  name: string;
  category: 'Commercial' | 'Heritage' | 'Residential' | 'Transit' | 'Academic' | 'Administrative';
  latitude: number;
  longitude: number;
  address: string;
  landmark: string;
  description: string;
  pincode: string;
}

export const JAMMU_AREAS: JammuArea[] = [
  {
    id: 'gandhi-nagar',
    name: 'Gandhi Nagar',
    category: 'Commercial',
    latitude: 32.7065,
    longitude: 74.8652,
    address: 'Gandhi Nagar, Gole Market, Jammu, J&K 180004',
    landmark: 'Gole Market & Apsara Road Hub',
    description: 'Premier commercial and executive enclave south of River Tawi.',
    pincode: '180004',
  },
  {
    id: 'bahu-fort',
    name: 'Bahu Fort & Bagh-e-Bahu',
    category: 'Heritage',
    latitude: 32.7291,
    longitude: 74.8805,
    address: 'Bahu Fort, River Tawi Bank, Jammu, J&K 180006',
    landmark: 'Historic 3,000-Year-Old Citadel & Aquarium',
    description: 'Ancient fortress perched high on the cliff overlooking River Tawi.',
    pincode: '180006',
  },
  {
    id: 'raghunath-bazaar',
    name: 'Old City (Raghunath Bazaar)',
    category: 'Heritage',
    latitude: 32.7303,
    longitude: 74.8622,
    address: 'Raghunath Bazaar, Old Heritage Core, Jammu, J&K 180001',
    landmark: 'Raghunath Temple & Historic Bazaar',
    description: 'Vibrant cultural, trade, and heritage core of historic Jammu.',
    pincode: '180001',
  },
  {
    id: 'trikuta-nagar',
    name: 'Trikuta Nagar',
    category: 'Residential',
    latitude: 32.7018,
    longitude: 74.8778,
    address: 'Trikuta Nagar, Sector 1, Jammu, J&K 180012',
    landmark: 'Railhead Business Complex',
    description: 'Major planned sector hosting commercial complexes and residences.',
    pincode: '180012',
  },
  {
    id: 'jammu-university',
    name: 'University of Jammu',
    category: 'Academic',
    latitude: 32.7176,
    longitude: 74.8687,
    address: 'University of Jammu Campus, Gujarbhai, Jammu, J&K 180006',
    landmark: 'Central Library & Research Enclave',
    description: 'Premier educational and scientific campus bordering Tawi riverbank.',
    pincode: '180006',
  },
  {
    id: 'satwari-airport',
    name: 'Satwari / Jammu Airport (IXJ)',
    category: 'Transit',
    latitude: 32.6912,
    longitude: 74.8465,
    address: 'Satwari Airport Road, Jammu Cantt, J&K 180003',
    landmark: 'Civil Enclave & Cantt Terminal',
    description: 'Aviation gateway for Jammu region with military defense base.',
    pincode: '180003',
  },
  {
    id: 'jammu-tawi',
    name: 'Jammu Tawi Railway Station',
    category: 'Transit',
    latitude: 32.7056,
    longitude: 74.8744,
    address: 'Railway Colony, Jammu Tawi, J&K 180012',
    landmark: 'Northern Railway Main Terminus',
    description: 'Principal rail lifeline interconnecting Jammu and Kashmir.',
    pincode: '180012',
  },
  {
    id: 'channi-himmat',
    name: 'Channi Himmat',
    category: 'Residential',
    latitude: 32.6885,
    longitude: 74.8930,
    address: 'Channi Himmat Housing Sector, Jammu, J&K 180015',
    landmark: 'Sector 3 Commercial Strip',
    description: 'Modern residential township adjacent to national highway corridor.',
    pincode: '180015',
  },
  {
    id: 'sidhra',
    name: 'Sidhra & Golf Course',
    category: 'Administrative',
    latitude: 32.7645,
    longitude: 74.8995,
    address: 'Sidhra River Bypass, Jammu, J&K 180019',
    landmark: 'Jammu Tawi Golf Course & Bridge',
    description: 'Scenic north bypass corridor along upper Tawi embankment.',
    pincode: '180019',
  },
  {
    id: 'canal-road',
    name: 'Canal Road / Jewel Chowk',
    category: 'Commercial',
    latitude: 32.7214,
    longitude: 74.8512,
    address: 'Canal Road, Jewel Chowk, Jammu, J&K 180016',
    landmark: 'Ranbir Canal & Transit Hub',
    description: 'Key transit intersection connecting the city center to Akhnoor road.',
    pincode: '180016',
  },
  {
    id: 'janipur',
    name: 'Janipur / High Court Complex',
    category: 'Administrative',
    latitude: 32.7538,
    longitude: 74.8425,
    address: 'High Court Lane, Janipur, Jammu, J&K 180007',
    landmark: 'J&K High Court Complex',
    description: 'Judicial and administrative headquarters of Jammu division.',
    pincode: '180007',
  }
];

export const DEFAULT_JAMMU_CENTER = {
  latitude: 32.7065,
  longitude: 74.8652,
  zoom: 14,
};
