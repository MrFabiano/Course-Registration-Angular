import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  constructor() { }

  validateAllFormFields(formGroup: UntypedFormGroup | UntypedFormArray){
    Object.keys(formGroup.controls).forEach( field => {
      const control = formGroup.get(field);
      if(control instanceof UntypedFormControl) {
        control.markAsTouched({onlySelf: true});
        
      } else if(control instanceof UntypedFormGroup || control instanceof UntypedFormArray) {
        control.markAsTouched({onlySelf: true});
      }

      });
    }

  getErrorMessage(formGroup: UntypedFormGroup, fieldName: string){
    const field = formGroup.get(fieldName) as UntypedFormControl;
    return this.getErrorMessageFromField(field);
  }


  getErrorMessageFromField(field: UntypedFormControl){
    if(field?.hasError('required')){
      return 'Required field';
    }
    if(field?.hasError('minlength')){
      const requiredLength: number = field.errors ? field.errors['minlength']['requiredLength'] : 5;
      return `Mini size needs to be ${requiredLength} caracteres.`;
    }

    if(field?.hasError('maxLength')){
      const requiredLength: number  = field.errors ? field.errors['maxlength']['requiredLength'] : 200;
      return `Maximum size exceeded ${requiredLength} caracteres.`;
    }

    return 'Invalid field';
  }

  getFormArrayFieldErrorMessage(formGroup: UntypedFormGroup, 
    formArrayName: string, fieldName: string, index: number){
      const formArray = formGroup.get(formArrayName) as UntypedFormArray;
      const field = formArray.controls[index].get(fieldName) as UntypedFormControl;
      return this.getErrorMessageFromField(field);
          
  }

  isformArrayRequired(formGroup: UntypedFormGroup, formArrayName: string){
    const formArray = formGroup.get(formArrayName) as UntypedFormArray;
    return !formArray.valid && formArray.hasError('required') && formArray.touched;
  }
}
