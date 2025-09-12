import { Venue } from './venue.model';
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  capacity: number;
  availableSeats: number;
  images: string[];
  categoryId: string;
  venueId: string;
  organizerId: string;
  location: {
    lat: number;
    lng: number;
  };
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  venue?: Venue;
  category?: Category;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
}

export interface CreateEventRequest {
  title: string;
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