// ── All-India city registry ───────────────────────────────────────────────
// Every city a user can pick during signup or search, with its state/UT
// ("region") and approximate coordinates so "Near Me" and distance work for
// doctors registered anywhere in the country.

export interface CityInfo {
  name: string;
  region: string;
  lat: number;
  lng: number;
}

// State/UT capitals plus major cities, all across India.
export const INDIAN_CITIES: CityInfo[] = [
  // ── Andhra Pradesh ──
  { name: "Visakhapatnam", region: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  { name: "Vijayawada", region: "Andhra Pradesh", lat: 16.5062, lng: 80.648 },
  { name: "Guntur", region: "Andhra Pradesh", lat: 16.3067, lng: 80.4365 },
  { name: "Tirupati", region: "Andhra Pradesh", lat: 13.6288, lng: 79.4192 },
  { name: "Nellore", region: "Andhra Pradesh", lat: 14.4426, lng: 79.9865 },
  { name: "Kurnool", region: "Andhra Pradesh", lat: 15.8281, lng: 78.0373 },
  { name: "Rajahmundry", region: "Andhra Pradesh", lat: 17.0005, lng: 81.804 },
  { name: "Amaravati", region: "Andhra Pradesh", lat: 16.5417, lng: 80.515 },
  // ── Arunachal Pradesh ──
  { name: "Itanagar", region: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053 },
  // ── Assam ──
  { name: "Guwahati", region: "Assam", lat: 26.1445, lng: 91.7362 },
  { name: "Dibrugarh", region: "Assam", lat: 27.4728, lng: 94.912 },
  { name: "Silchar", region: "Assam", lat: 24.8333, lng: 92.7789 },
  { name: "Jorhat", region: "Assam", lat: 26.7509, lng: 94.2037 },
  { name: "Tezpur", region: "Assam", lat: 26.6529, lng: 92.7926 },
  { name: "Nagaon", region: "Assam", lat: 26.3468, lng: 92.6845 },
  // ── Bihar ──
  { name: "Patna", region: "Bihar", lat: 25.5941, lng: 85.1376 },
  { name: "Gaya", region: "Bihar", lat: 24.7914, lng: 85.0002 },
  { name: "Bhagalpur", region: "Bihar", lat: 25.2425, lng: 86.9842 },
  { name: "Muzaffarpur", region: "Bihar", lat: 26.1225, lng: 85.3905 },
  { name: "Darbhanga", region: "Bihar", lat: 26.1542, lng: 85.8918 },
  { name: "Purnia", region: "Bihar", lat: 25.7771, lng: 87.4753 },
  { name: "Ara", region: "Bihar", lat: 25.5565, lng: 84.6603 },
  // ── Chhattisgarh ──
  { name: "Raipur", region: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
  { name: "Bhilai", region: "Chhattisgarh", lat: 21.1938, lng: 81.3509 },
  { name: "Bilaspur", region: "Chhattisgarh", lat: 22.0797, lng: 82.1409 },
  { name: "Korba", region: "Chhattisgarh", lat: 22.3595, lng: 82.7504 },
  { name: "Durg", region: "Chhattisgarh", lat: 21.1904, lng: 81.2849 },
  // ── Delhi (NCT) ──
  { name: "Delhi", region: "Delhi", lat: 28.6139, lng: 77.209 },
  { name: "New Delhi", region: "Delhi", lat: 28.6139, lng: 77.209 },
  // ── Goa ──
  { name: "Panaji", region: "Goa", lat: 15.4909, lng: 73.8278 },
  { name: "Margao", region: "Goa", lat: 15.2832, lng: 73.9862 },
  { name: "Vasco da Gama", region: "Goa", lat: 15.3959, lng: 73.8153 },
  { name: "Mapusa", region: "Goa", lat: 15.5913, lng: 73.8094 },
  // ── Gujarat ──
  { name: "Ahmedabad", region: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Surat", region: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Vadodara", region: "Gujarat", lat: 22.3072, lng: 73.1812 },
  { name: "Rajkot", region: "Gujarat", lat: 22.3039, lng: 70.8022 },
  { name: "Gandhinagar", region: "Gujarat", lat: 23.2156, lng: 72.6369 },
  { name: "Bhavnagar", region: "Gujarat", lat: 21.7645, lng: 72.1519 },
  { name: "Jamnagar", region: "Gujarat", lat: 22.4707, lng: 70.0577 },
  { name: "Junagadh", region: "Gujarat", lat: 21.5222, lng: 70.4579 },
  { name: "Anand", region: "Gujarat", lat: 22.5645, lng: 72.9289 },
  // ── Chandigarh (UT) ──
  { name: "Chandigarh", region: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  // ── Haryana ──
  { name: "Gurugram", region: "Haryana", lat: 28.4595, lng: 77.0266 },
  { name: "Faridabad", region: "Haryana", lat: 28.4089, lng: 77.3178 },
  { name: "Panipat", region: "Haryana", lat: 29.3909, lng: 76.9635 },
  { name: "Ambala", region: "Haryana", lat: 30.3782, lng: 76.7767 },
  { name: "Hisar", region: "Haryana", lat: 29.1492, lng: 75.7217 },
  { name: "Rohtak", region: "Haryana", lat: 28.8955, lng: 76.6066 },
  { name: "Karnal", region: "Haryana", lat: 29.6857, lng: 76.9905 },
  // ── Himachal Pradesh ──
  { name: "Shimla", region: "Himachal Pradesh", lat: 31.1048, lng: 77.1734 },
  { name: "Dharamshala", region: "Himachal Pradesh", lat: 32.219, lng: 76.3234 },
  { name: "Mandi", region: "Himachal Pradesh", lat: 31.7088, lng: 76.9329 },
  { name: "Solan", region: "Himachal Pradesh", lat: 30.909, lng: 77.0987 },
  { name: "Hamirpur", region: "Himachal Pradesh", lat: 31.6863, lng: 76.5176 },
  // ── Jharkhand ──
  { name: "Ranchi", region: "Jharkhand", lat: 23.3441, lng: 85.3096 },
  { name: "Jamshedpur", region: "Jharkhand", lat: 22.8046, lng: 86.2029 },
  { name: "Dhanbad", region: "Jharkhand", lat: 23.7957, lng: 86.4304 },
  { name: "Bokaro", region: "Jharkhand", lat: 23.6693, lng: 86.1511 },
  { name: "Deoghar", region: "Jharkhand", lat: 24.4798, lng: 86.697 },
  { name: "Hazaribagh", region: "Jharkhand", lat: 23.9925, lng: 85.3608 },
  // ── Karnataka ──
  { name: "Bangalore", region: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Mysuru", region: "Karnataka", lat: 12.2958, lng: 76.6394 },
  { name: "Hubballi", region: "Karnataka", lat: 15.3647, lng: 75.124 },
  { name: "Mangaluru", region: "Karnataka", lat: 12.9141, lng: 74.856 },
  { name: "Belagavi", region: "Karnataka", lat: 15.8497, lng: 74.4977 },
  { name: "Kalaburagi", region: "Karnataka", lat: 17.3297, lng: 76.8343 },
  { name: "Davangere", region: "Karnataka", lat: 14.4644, lng: 75.9218 },
  { name: "Ballari", region: "Karnataka", lat: 15.1394, lng: 76.9214 },
  { name: "Shivamogga", region: "Karnataka", lat: 13.9299, lng: 75.5681 },
  // ── Kerala ──
  { name: "Thiruvananthapuram", region: "Kerala", lat: 8.5241, lng: 76.9366 },
  { name: "Kochi", region: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Kozhikode", region: "Kerala", lat: 11.2588, lng: 75.7804 },
  { name: "Thrissur", region: "Kerala", lat: 10.5276, lng: 76.2144 },
  { name: "Kollam", region: "Kerala", lat: 8.8932, lng: 76.6141 },
  { name: "Palakkad", region: "Kerala", lat: 10.7867, lng: 76.6548 },
  { name: "Kannur", region: "Kerala", lat: 11.8745, lng: 75.3704 },
  { name: "Alappuzha", region: "Kerala", lat: 9.4981, lng: 76.3388 },
  // ── Madhya Pradesh ──
  { name: "Bhopal", region: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { name: "Indore", region: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Jabalpur", region: "Madhya Pradesh", lat: 23.1815, lng: 79.9864 },
  { name: "Gwalior", region: "Madhya Pradesh", lat: 26.2183, lng: 78.1828 },
  { name: "Ujjain", region: "Madhya Pradesh", lat: 23.1765, lng: 75.7885 },
  { name: "Sagar", region: "Madhya Pradesh", lat: 23.8388, lng: 78.7378 },
  { name: "Ratlam", region: "Madhya Pradesh", lat: 23.3315, lng: 75.0367 },
  { name: "Rewa", region: "Madhya Pradesh", lat: 24.5362, lng: 81.3037 },
  // ── Maharashtra ──
  { name: "Mumbai", region: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { name: "Pune", region: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Nagpur", region: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { name: "Nashik", region: "Maharashtra", lat: 19.9975, lng: 73.7898 },
  { name: "Aurangabad", region: "Maharashtra", lat: 19.8762, lng: 75.3433 },
  { name: "Solapur", region: "Maharashtra", lat: 17.6599, lng: 75.9064 },
  { name: "Kolhapur", region: "Maharashtra", lat: 16.705, lng: 74.2433 },
  { name: "Thane", region: "Maharashtra", lat: 19.2183, lng: 72.9781 },
  { name: "Navi Mumbai", region: "Maharashtra", lat: 19.033, lng: 73.0297 },
  { name: "Amravati", region: "Maharashtra", lat: 20.9374, lng: 77.7796 },
  { name: "Sangli", region: "Maharashtra", lat: 16.8524, lng: 74.5815 },
  { name: "Jalgaon", region: "Maharashtra", lat: 21.0077, lng: 75.5626 },
  // ── Manipur ──
  { name: "Imphal", region: "Manipur", lat: 24.817, lng: 93.9368 },
  // ── Meghalaya ──
  { name: "Shillong", region: "Meghalaya", lat: 25.5788, lng: 91.8933 },
  // ── Mizoram ──
  { name: "Aizawl", region: "Mizoram", lat: 23.7271, lng: 92.7176 },
  // ── Nagaland ──
  { name: "Kohima", region: "Nagaland", lat: 25.6751, lng: 94.1086 },
  { name: "Dimapur", region: "Nagaland", lat: 25.9092, lng: 93.7271 },
  // ── Odisha ──
  { name: "Bhubaneswar", region: "Odisha", lat: 20.2961, lng: 85.8245 },
  { name: "Cuttack", region: "Odisha", lat: 20.4625, lng: 85.8828 },
  { name: "Rourkela", region: "Odisha", lat: 22.2604, lng: 84.8536 },
  { name: "Berhampur", region: "Odisha", lat: 19.3133, lng: 84.7938 },
  { name: "Sambalpur", region: "Odisha", lat: 21.4669, lng: 83.9812 },
  { name: "Puri", region: "Odisha", lat: 19.8135, lng: 85.8312 },
  // ── Punjab ──
  { name: "Ludhiana", region: "Punjab", lat: 30.901, lng: 75.8573 },
  { name: "Amritsar", region: "Punjab", lat: 31.634, lng: 74.8723 },
  { name: "Jalandhar", region: "Punjab", lat: 31.326, lng: 75.5762 },
  { name: "Patiala", region: "Punjab", lat: 30.3398, lng: 76.3869 },
  { name: "Bathinda", region: "Punjab", lat: 30.211, lng: 74.9455 },
  { name: "Mohali", region: "Punjab", lat: 30.7046, lng: 76.7179 },
  // ── Rajasthan ──
  { name: "Jaipur", region: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Jodhpur", region: "Rajasthan", lat: 26.2389, lng: 73.0243 },
  { name: "Udaipur", region: "Rajasthan", lat: 24.5854, lng: 73.7125 },
  { name: "Kota", region: "Rajasthan", lat: 25.2138, lng: 75.8648 },
  { name: "Bikaner", region: "Rajasthan", lat: 28.0229, lng: 73.3119 },
  { name: "Ajmer", region: "Rajasthan", lat: 26.4499, lng: 74.6399 },
  { name: "Bharatpur", region: "Rajasthan", lat: 27.2213, lng: 77.4901 },
  { name: "Alwar", region: "Rajasthan", lat: 27.5527, lng: 76.6243 },
  { name: "Sikar", region: "Rajasthan", lat: 27.6094, lng: 75.1399 },
  // ── Sikkim ──
  { name: "Gangtok", region: "Sikkim", lat: 27.3389, lng: 88.6065 },
  // ── Tamil Nadu ──
  { name: "Chennai", region: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", region: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { name: "Madurai", region: "Tamil Nadu", lat: 9.9252, lng: 78.1198 },
  { name: "Tiruchirappalli", region: "Tamil Nadu", lat: 10.7905, lng: 78.7047 },
  { name: "Salem", region: "Tamil Nadu", lat: 11.6643, lng: 78.146 },
  { name: "Tirunelveli", region: "Tamil Nadu", lat: 8.7139, lng: 77.7567 },
  { name: "Vellore", region: "Tamil Nadu", lat: 12.9165, lng: 79.1325 },
  { name: "Erode", region: "Tamil Nadu", lat: 11.341, lng: 77.7172 },
  { name: "Thoothukudi", region: "Tamil Nadu", lat: 8.7642, lng: 78.1348 },
  { name: "Kanyakumari", region: "Tamil Nadu", lat: 8.0883, lng: 77.5385 },
  // ── Telangana ──
  { name: "Hyderabad", region: "Telangana", lat: 17.385, lng: 78.4867 },
  { name: "Warangal", region: "Telangana", lat: 17.9689, lng: 79.5941 },
  { name: "Nizamabad", region: "Telangana", lat: 18.6725, lng: 78.0941 },
  { name: "Karimnagar", region: "Telangana", lat: 18.4386, lng: 79.1288 },
  { name: "Khammam", region: "Telangana", lat: 17.2473, lng: 80.1514 },
  { name: "Secunderabad", region: "Telangana", lat: 17.4399, lng: 78.4983 },
  // ── Tripura ──
  { name: "Agartala", region: "Tripura", lat: 23.8315, lng: 91.2868 },
  // ── Uttar Pradesh ──
  { name: "Lucknow", region: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Kanpur", region: "Uttar Pradesh", lat: 26.4499, lng: 80.3319 },
  { name: "Varanasi", region: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { name: "Agra", region: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
  { name: "Meerut", region: "Uttar Pradesh", lat: 28.9845, lng: 77.7064 },
  { name: "Prayagraj", region: "Uttar Pradesh", lat: 25.4358, lng: 81.8463 },
  { name: "Ghaziabad", region: "Uttar Pradesh", lat: 28.6692, lng: 77.4538 },
  { name: "Aligarh", region: "Uttar Pradesh", lat: 27.8974, lng: 78.088 },
  { name: "Moradabad", region: "Uttar Pradesh", lat: 28.8386, lng: 78.7733 },
  { name: "Gorakhpur", region: "Uttar Pradesh", lat: 26.7606, lng: 83.3732 },
  { name: "Bareilly", region: "Uttar Pradesh", lat: 28.367, lng: 79.4304 },
  { name: "Jhansi", region: "Uttar Pradesh", lat: 25.4484, lng: 78.5685 },
  { name: "Noida", region: "Uttar Pradesh", lat: 28.5355, lng: 77.391 },
  { name: "Mathura", region: "Uttar Pradesh", lat: 27.4924, lng: 77.6737 },
  { name: "Saharanpur", region: "Uttar Pradesh", lat: 29.964, lng: 77.546 },
  // ── Uttarakhand ──
  { name: "Dehradun", region: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { name: "Haridwar", region: "Uttarakhand", lat: 29.9457, lng: 78.1642 },
  { name: "Roorkee", region: "Uttarakhand", lat: 29.8543, lng: 77.888 },
  { name: "Haldwani", region: "Uttarakhand", lat: 29.2225, lng: 79.5286 },
  { name: "Rishikesh", region: "Uttarakhand", lat: 30.0869, lng: 78.2676 },
  { name: "Nainital", region: "Uttarakhand", lat: 29.3919, lng: 79.4542 },
  // ── West Bengal ──
  { name: "Kolkata", region: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Howrah", region: "West Bengal", lat: 22.5958, lng: 88.2636 },
  { name: "Durgapur", region: "West Bengal", lat: 23.5204, lng: 87.3119 },
  { name: "Asansol", region: "West Bengal", lat: 23.6833, lng: 86.9833 },
  { name: "Siliguri", region: "West Bengal", lat: 26.7271, lng: 88.3953 },
  { name: "Darjeeling", region: "West Bengal", lat: 27.041, lng: 88.2663 },
  { name: "Bardhaman", region: "West Bengal", lat: 23.2324, lng: 87.8612 },
  { name: "Kharagpur", region: "West Bengal", lat: 22.346, lng: 87.232 },
  // ── Union Territories ──
  { name: "Jammu", region: "Jammu & Kashmir", lat: 32.7266, lng: 74.857 },
  { name: "Srinagar", region: "Jammu & Kashmir", lat: 34.0837, lng: 74.7973 },
  { name: "Leh", region: "Ladakh", lat: 34.1526, lng: 77.5771 },
  { name: "Kargil", region: "Ladakh", lat: 34.5539, lng: 76.1349 },
  { name: "Port Blair", region: "Andaman & Nicobar Islands", lat: 11.6234, lng: 92.7265 },
  { name: "Silvassa", region: "Dadra & Nagar Haveli and Daman & Diu", lat: 20.2762, lng: 73.0162 },
  { name: "Daman", region: "Dadra & Nagar Haveli and Daman & Diu", lat: 20.3974, lng: 72.8328 },
  { name: "Kavaratti", region: "Lakshadweep", lat: 10.5593, lng: 72.6358 },
  { name: "Puducherry", region: "Puducherry", lat: 11.9416, lng: 79.8083 },
  { name: "Karaikal", region: "Puducherry", lat: 10.9254, lng: 79.838 },
];

// Case-insensitive geo lookup, e.g. "bhopal" → { region: "Madhya Pradesh", lat: .., lng: .. }
export function cityGeo(name?: string): { region: string; lat?: number; lng?: number } | null {
  if (!name) return null;
  const wanted = name.trim().toLowerCase();
  const found = INDIAN_CITIES.find((c) => c.name.toLowerCase() === wanted);
  if (!found) return null;
  return { region: found.region, lat: found.lat, lng: found.lng };
}

export const INDIAN_CITY_NAMES: string[] = INDIAN_CITIES.map((c) => c.name).sort();
