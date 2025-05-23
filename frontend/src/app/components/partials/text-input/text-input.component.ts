import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent implements OnInit {
  @Input()
  control!: AbstractControl;
  @Input()
  showErrorsWhen: boolean = true;
  @Input()
  label!: string;
  @Input()
  type: 'text' | 'password' | 'email' | 'file' | 'radio' | 'number' = 'text';
  @Input()
  accept!: string;
  @Input()
  ariaLabel!: string;
  @Input()
  value!: any;

  get formControl() {
    return this.control as FormControl;
  }

  constructor() {}

  ngOnInit() {}
}
