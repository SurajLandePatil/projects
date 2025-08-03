import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {
  @Input() message: string = 'Loading...';
  @Input() size: number = 50;
  @Input() overlay: boolean = false;
  @Input() type: 'spinner' | 'dots' | 'bars' | 'pulse' = 'spinner';

  constructor() {}

  ngOnInit(): void {}
}
