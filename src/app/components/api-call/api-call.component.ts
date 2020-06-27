import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-api-call',
  templateUrl: './api-call.component.html',
  styleUrls: ['./api-call.component.css'],
})
export class ApiCallComponent implements OnInit {
  method: string = 'GET';
  url: string = 'https://wordsapiv1.p.mashape.com/words/example/synonyms';

  constructor() {}

  ngOnInit(): void {}
}
