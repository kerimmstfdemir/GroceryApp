import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

declare var $: any;

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: any[];
  form: FormGroup;
  selectedCustomer: any;
  message: string = '';
  phoneNumbers: PhoneNumber[] = [];
  newPhoneNumber: string = '';

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.fetchCustomers();
    this.createForm();
  }

  fetchCustomers() {
    const apiUrl = 'http://localhost:5000/api/customers';

    this.http.get(apiUrl).subscribe((response: any) => {
      this.customers = response;
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      gender: ['', Validators.required],
      occupation: ['', Validators.required],
      birthDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      website: [''],
      subscribeToAds: [false],
      address: ['', Validators.required],
      city: ['', Validators.required],
      notes: [''],
      phoneNumbers: this.formBuilder.array([])
    });
  }

  openEditCustomerModal(customer: any) {
    this.selectedCustomer = customer;
    this.form.patchValue({
      fullName: customer.fullName,
      gender: customer.gender,
      occupation: customer.occupation,
      birthDate: customer.birthDate,
      email: customer.email,
      website: customer.website,
      subscribeToAds: customer.subscribeToAds,
      address: customer.address,
      city: customer.city,
      notes: customer.notes
    });

    this.getPhoneNumbers(customer.id).subscribe((phoneNumbers: PhoneNumber[]) => {
      this.phoneNumbers = phoneNumbers;
      this.updateFormPhoneNumbers();
    });
  }

  updateFormPhoneNumbers() {
    const phoneNumbersFormArray = this.form.get('phoneNumbers') as FormArray;
    phoneNumbersFormArray.clear();

    this.phoneNumbers.forEach(phoneNumber => {
      phoneNumbersFormArray.push(this.formBuilder.group({
        id: [phoneNumber.id],
        number: [phoneNumber.number, Validators.required],
        customerId: [phoneNumber.customerId]
      }));
    });
  }

  updateCustomer() {
    this.updateCustomerData();

    this.updatePhoneNumbers().subscribe(() => {
      console.log('✓ Phone numbers updated successfully');
    });

    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  updateCustomerData() {
    const updatedCustomer = this.form.value;

    const apiUrl = `http://localhost:5000/api/customers/${this.selectedCustomer.id}`;
    this.http.put(apiUrl, updatedCustomer).subscribe((response: any) => {
      console.log('✓ Customer updated successfully');
      this.message = '✓ Customer updated successfully';
      this.fetchCustomers();
    });

    $('#editModal').modal('hide');
  }

  getPhoneNumbers(customerId: number): Observable<PhoneNumber[]> {
    const apiUrl = `http://localhost:5000/api/phonenumbers`;
    return this.http.get<PhoneNumber[]>(apiUrl).pipe(
      map((phoneNumbers: PhoneNumber[]) => phoneNumbers.filter(phoneNumber => phoneNumber.customerId === customerId))
    );
  }

  updatePhoneNumbers() {
    const apiUrl = 'http://localhost:5000/api/phonenumbers';
    const updateObservables: Observable<any>[] = [];

    this.phoneNumbers.forEach(phoneNumber => {
      if (phoneNumber.id !== '') {

        const updateUrl = `${apiUrl}/${phoneNumber.id}`;
        const updatedPhoneNumber = {
          number: phoneNumber.number,
          customerId: phoneNumber.customerId
        };

        updateObservables.push(this.http.put(updateUrl, updatedPhoneNumber).pipe(
          map((response: any) => {
            console.log(`✓ Phone number ${phoneNumber.id} updated successfully`);
            return response;
          })
        ));
      } else {

        const createUrl = apiUrl;
        const newPhoneNumber = {
          number: phoneNumber.number,
          customerId: phoneNumber.customerId
        };

        updateObservables.push(this.http.post(createUrl, newPhoneNumber).pipe(
          map((response: any) => {
            console.log(`✓ New phone number created successfully`);
            return response;
          })
        ));
      }
    });

    const deletedPhoneNumbers = this.phoneNumbers.filter(phoneNumber => phoneNumber.id !== '' && phoneNumber.hasOwnProperty('isDeleted') && phoneNumber['isDeleted']);
    deletedPhoneNumbers.forEach(phoneNumber => {
      const deleteUrl = `${apiUrl}/${phoneNumber.id}`;

      updateObservables.push(this.http.delete(deleteUrl).pipe(
        map((response: any) => {
          console.log(`✓ Phone number ${phoneNumber.id} deleted successfully`);
          return response;
        })
      ));
    });

    return forkJoin(updateObservables);
  }

  deletePhoneNumber(phoneNumberId: string) {
    const confirmation = confirm('Are you sure you want to delete this phone number?');
    if (confirmation) {

      this.phoneNumbers = this.phoneNumbers.filter(phoneNumber => phoneNumber.id !== phoneNumberId);

      const deleteUrl = `http://localhost:5000/api/phonenumbers/${phoneNumberId}`;
      this.http.delete(deleteUrl).subscribe((response: any) => {
        console.log(`✓ Phone number ${phoneNumberId} deleted successfully`);
        this.fetchCustomers();
      });
    }
  }

  updatePhoneNumber(phoneNumber: PhoneNumber) {
    const updateUrl = `http://localhost:5000/api/phonenumbers/${phoneNumber.id}`;
    const updatedPhoneNumber = {
      number: phoneNumber.number,
      customerId: phoneNumber.customerId
    };

    this.http.put(updateUrl, updatedPhoneNumber).subscribe((response: any) => {
      console.log(`✓ Phone number ${phoneNumber.id} updated successfully`);
    });
  }

  addPhoneNumber() {
    const newPhoneNumber: PhoneNumber = {
      id: '', // Yeni bir ID atanacaktır
      number: this.newPhoneNumber,
      customerId: this.selectedCustomer.id
    };
    this.phoneNumbers.push(newPhoneNumber);
    this.updateFormPhoneNumbers();

    this.newPhoneNumber = '';
  }
}

interface PhoneNumber {
  id: string;
  number: string;
  customerId: number;
}
