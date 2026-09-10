import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null; // Boş ise kontrol etme (required tarafından kontrol edilir)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(control.value) ? null : { invalidEmail: true };
  };
}



export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }


    const digits = control.value.replace(/\D/g, '');

    if (digits.length === 10 || digits.length === 11) {
      return null;
    }

    return { invalidPhone: true };
  };
}



export function identityNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const identityNumber = control.value.toString();

  
    if (identityNumber.length !== 11) {
      return { invalidIdentityNumber: true };
    }

  
    
    if (!/^\d+$/.test(identityNumber)) {
      return { invalidIdentityNumber: true };
    }


    return null;
  };
}


export function minLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return control.value.length >= minLength ? null : { minLength: true };
  };
}



export function maxLengthValidator(maxLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    return control.value.length <= maxLength ? null : { maxLength: true };
  };
}



export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return selectedDate <= today ? null : { futureDate: true };
  };
}


export function ageValidator(minAge: number, maxAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= minAge && age <= maxAge) {
      return null;
    }

    return { invalidAge: true };
  };
}


export function appointmentDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const selectedDate = new Date(control.value);
    const today = new Date();
    const maxDate = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    maxDate.setHours(0, 0, 0, 0);


    maxDate.setDate(maxDate.getDate() + 20);

    
    if (selectedDate < today) {
      return { geçmişTarih: true };
    }

  
    if (selectedDate > maxDate) {
      return { çokİleriTarih: true };
    }

    return null;
  };
}