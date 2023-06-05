import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
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
  filteredCustomers: any[] = [];
  searchTerm: string = '';

  constructor(private http: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.fetchCustomers();
    this.createForm();
  }
  search() {
    this.onSearch(this.searchTerm);
  }


  fetchCustomers() {
    const apiUrl = 'http://localhost:5000/api/customers';
    this.http.get(apiUrl).subscribe((response: any) => {
      this.customers = response;
    });
  }

  onSearch(searchTerm: string) {
    if (searchTerm.trim() === '') {
      // Arama kutusu boşsa tüm müşterileri göster
      this.filteredCustomers = this.customers;
    } else {
      searchTerm = searchTerm.toLowerCase(); // Arama terimini küçük harfe çeviriyoruz

      // Arama terimine göre müşterileri filtreleyin
      this.filteredCustomers = this.customers.filter((customer) =>
        customer.fullName.toLowerCase().includes(searchTerm)
      );
    }
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
      phoneNumbers: this.formBuilder.array([]),
      newPhoneNumber: ['', Validators.required]
    });
  }

  openEditCustomerModal(customer: any) {
    this.selectedCustomer = customer;
    this.form.patchValue(customer);
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
      const isPhoneNumberNew = phoneNumber.id === '';

      const updateUrl = isPhoneNumberNew ? apiUrl : `${apiUrl}/${phoneNumber.id}`;
      const updatedPhoneNumber = {
        number: phoneNumber.number,
        customerId: phoneNumber.customerId
      };

      const updateObservable = isPhoneNumberNew ? this.http.post(updateUrl, updatedPhoneNumber) : this.http.put(updateUrl, updatedPhoneNumber);
      updateObservables.push(updateObservable.pipe(
        map((response: any) => {
          const message = isPhoneNumberNew ? 'created' : 'updated';
          console.log(`✓ Phone number ${phoneNumber.id} ${message} successfully`);
          return response;
        })
      ));
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
      id: phoneNumber.id,
      number: this.form.value.currentPhoneNumber,
      customerId: phoneNumber.customerId
    };

    this.http.put(updateUrl, updatedPhoneNumber).subscribe((response: any) => {
      console.log(`✓ Phone number ${phoneNumber.id} updated successfully`);
    });
  }

  addPhoneNumber() {
    const newPhoneNumber: PhoneNumber = {
      number: this.form.value.newPhoneNumber,
      customerId: this.selectedCustomer.id
    };

    // Send the new phone number to the server and update the local list if successful
    const apiUrl = 'http://localhost:5000/api/phonenumbers';
    this.http.post(apiUrl, newPhoneNumber).subscribe(
      (response: any) => {
        console.log('✓ New phone number created successfully');
        newPhoneNumber.id = response.id; // Update the ID generated by the server
        this.phoneNumbers = [...this.phoneNumbers, newPhoneNumber];

        this.updateFormPhoneNumbers();
      },
      (error: any) => {
        console.error('✕ Failed to create a new phone number');
      }
    );

    this.newPhoneNumber = ''; // Clear the input field after adding the phone number
  }
}

interface PhoneNumber {
  id?: string;
  number: string;
  customerId: number;
}
