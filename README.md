# Eventra - MEAN Stack Application

## Overview
Eventra is a full-stack MEAN application that connects event organizers, venues, and attendees in a seamless platform. It helps organizers find venues, advertise events, and track bookings and attendees, while admins manage the platform.

## Features

### 1. User Types
- **Event Organizer (Needing a Venue):**  
  Can search and book venues based on location, capacity, and price. They can also create an event advertisement with all event details, allowing attendees to book tickets.  
- **Event Organizer (Already Has a Venue):**  
  Can directly advertise their event with full details, making it available for attendees to book tickets.  
- **Attendee/User:**  
  Can browse and filter events, book tickets, and see details like location, capacity, and price.  
- **Admin:**  
  Approves or rejects events, monitors bookings and sales, and tracks attendance. The platform may take a commission from bookings.

### 2. Event & Venue Management
- Organizers can find suitable venues and book them for their events.
- Organizers can create detailed event listings including date, location, capacity, and price.
- Admins can oversee and approve events before they are public.
- Attendance and sales can be tracked for each event.

### 3. Payments
- Integrated booking payment system.
- Admin takes a percentage of each transaction.

## Tech Stack
- **Frontend:** Angular
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Other:** RESTful APIs, JWT Authentication, File Storage for images

## Installation
1. Clone the repository:  
```bash
git clone https://github.com/Malkah04/Eventra_meanStack.git
cd backend
npm install
