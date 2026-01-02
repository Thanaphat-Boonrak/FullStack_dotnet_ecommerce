import { Component, computed, input, Self } from '@angular/core';
import {
  ReactiveFormsModule,
  type ControlValueAccessor,
  NgControl,
  type FormControl,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatInput, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule, MatInput, MatFormField, MatLabel, MatError],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.scss',
})
export class TextInputComponent implements ControlValueAccessor {
  label = input('');
  type = input('text');
  placeholder = input<string | null>(null);

  placeHolder = computed(() => this.placeholder() ?? this.label());

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }
  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
  setDisabledState?(isDisabled: boolean): void {}

  get control() {
    return this.ngControl.control as FormControl;
  }
}
