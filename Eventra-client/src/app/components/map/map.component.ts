import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { VenueService } from '../../services/venue.service';
import { Event } from '../../models/models/event.model';
import { Venue } from '../../models/models/venue.model';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map!: L.Map;
  events: Event[] = [];
  venues: Venue[] = [];
  showEvents = true;
  showVenues = true;

  constructor(
    private eventService: EventService,
    private venueService: VenueService
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.loadData();
  }

  initMap(): void {
    this.map = L.map('map', {
      center: [40.7128, -74.0060], // Default NYC
      zoom: 10
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
  }

  loadData(): void {
    // Load events
    this.eventService.getEvents(1, 100).subscribe(res => {
      this.events = res.events.filter((e: Event) => e.location && e.location.lat && e.location.lng);
      this.addEventMarkers();
    });

    // Load venues
    this.venueService.getVenues(1, 100).subscribe(res => {
      this.venues = res.venues.filter((v: Venue) => v.location && v.location.lat && v.location.lng);
      this.addVenueMarkers();
    });
  }

  addEventMarkers(): void {
    if (!this.showEvents) return;

    this.events.forEach(event => {
      const redIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [32, 32]
      });
      const yellowIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
        iconSize: [32, 32]
      });

      const marker = L.marker([event.location.lat, event.location.lng], { icon: redIcon }).addTo(this.map);

      marker.on('mouseover', () => marker.setIcon(yellowIcon));
      marker.on('mouseout', () => marker.setIcon(redIcon));
      marker.on('click', () => marker.setIcon(yellowIcon));

      const popupContent = `
        <div style="max-width:250px;">
          <h4>${event.name}</h4>
          <p>${event.description?.slice(0,100)}...</p>
          <p><b>Date:</b> ${new Date(event.date).toLocaleDateString()}</p>
          <p><b>Time:</b> ${event.time}</p>
          <p><b>Price:</b> ${event.ticketPrice === 0 ? 'Free' : '$'+event.ticketPrice}</p>
          <button style="background:#d35400;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">Book Event</button>
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  }

  addVenueMarkers(): void {
    if (!this.showVenues) return;

    this.venues.forEach(venue => {
      const blueIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        iconSize: [32, 32]
      });
      const greenIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
        iconSize: [32, 32]
      });

      const marker = L.marker([venue.location.lat, venue.location.lng], { icon: blueIcon }).addTo(this.map);

      marker.on('mouseover', () => marker.setIcon(greenIcon));
      marker.on('mouseout', () => marker.setIcon(blueIcon));
      marker.on('click', () => marker.setIcon(greenIcon));

      const popupContent = `
        <div style="max-width:250px;">
          <h4>${venue.name}</h4>
          <p>${venue.description?.slice(0,100)}...</p>
          <p><b>City:</b> ${venue.city}</p>
          <p><b>Capacity:</b> ${venue.capacity}</p>
          <p><b>Price/Day:</b> $${venue.pricePerDay}</p>
          <button style="background:#2980b9;color:white;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">View Details</button>
        </div>
      `;
      marker.bindPopup(popupContent);
    });
  }

  toggleEvents(): void {
    this.showEvents = !this.showEvents;
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        const iconUrl = layer.getIcon()?.options.iconUrl;
        if (iconUrl && iconUrl.includes('red-dot')) layer.remove();
      }
    });
    if (this.showEvents) this.addEventMarkers();
  }

  toggleVenues(): void {
    this.showVenues = !this.showVenues;
    this.map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        const iconUrl = layer.getIcon()?.options.iconUrl;
        if (iconUrl && iconUrl.includes('blue-dot')) layer.remove();
      }
    });
    if (this.showVenues) this.addVenueMarkers();
  }
}
