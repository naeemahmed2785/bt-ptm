import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'checkbox',
  template: `
      <div [formGroup]="form">
        <div [formGroupName]="field.name" >
          <div *ngFor="let opt of field.options" class="form-check form-check-inline">
          <label class="form-check-label">
             <input [formControlName]="opt.key" class="form-check-input" 
                  type="checkbox" [id]="opt.key" />
             {{opt.label}}</label>
          </div>
        </div>
      </div> 
    `,
  styles: ['input[type="checkbox"] {transform: scale(1.5)}']

})
export class CheckBoxComponent implements OnInit {
  ngOnInit() {
    // console.log(this.field.options);
  }

  @Input() field: any = {};
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.field.name].valid; }
  get isDirty() { return this.form.controls[this.field.name].dirty; }
}