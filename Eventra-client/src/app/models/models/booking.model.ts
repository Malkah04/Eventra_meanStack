import { User } from './user.model';
import { Event } from './event.model';
export interface Booking {
  _id: string;
  eventId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  bookingDate: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  event?: Event;
  user?: User;
}

export interface CreateBookingRequest {
  eventId: string;
  quantity: number;
  
}