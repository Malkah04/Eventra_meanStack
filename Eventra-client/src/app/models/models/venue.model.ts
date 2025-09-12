export interface Venue {
  _id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  capacity: number;
  pricePerDay: number;
  images: string[];
  amenities: string[];
  location: {
    lat: number;
    lng: number;
  };
  organizerId: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVenueRequest {
  name: string;
  description: string;
  address: string;
  city: string;
  capacity: number;
  pricePerDay: number;
  images: string[];
  amenities: string[];
  location: {
    lat: number;
    lng: number;
  };
}