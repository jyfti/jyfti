import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-call',
  templateUrl: './api-call.component.html',
  styleUrls: ['./api-call.component.css'],
})
export class ApiCallComponent implements OnInit {
  method: string = 'GET';
  url: string = 'http://swapi.dev/api/planets/1/';

  constructor() {}

  ngOnInit(): void {}
}
