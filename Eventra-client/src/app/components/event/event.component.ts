import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css'],
})
export class EventComponent {
  events: any[] = [];
  event: any = {};
  newEvent = { name: '', date: '', location: '' }; 
  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.getAllEvents();
  }

  addEvent() {
    this.eventService.createEvent(this.event).subscribe((data) => {
      this.events.push(data);
      this.event = {}; // reset form
       this.newEvent = { name: '', date: '', location: '' };
    });
  }

  getAllEvents() {
    this.eventService.getEvents().subscribe((data) => {
      console.log(data);
      
      this.events = data.data.events;
    });
  }

  deleteEvent(eventId: string) {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.events = this.events.filter((e) => e._id !== eventId);
    });
  }
}
