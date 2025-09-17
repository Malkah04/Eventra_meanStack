export interface Event {
  _id: string;
  name: string; 
  description: string;
  date: string;
  time: string;
  ticketPrice: number; 
  categoryId: {
    _id: string;
    name: string;
  };
  venueId: {
    _id: string;
    name: string;
  };
  organizerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    fullName: string;
  };
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  updatedAt: string;
  id: string;
  images?: string[];
}


export interface CreateEventRequest {
  name: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  capacity: number;
  images: string[];
  categoryId: string;
  venueId: string;
  location: {
    lat: number;
    lng: number;
  };
}