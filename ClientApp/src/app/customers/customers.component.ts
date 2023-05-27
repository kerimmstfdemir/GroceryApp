import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';
import { FormArray, Validators } from '@angular/forms';

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
      notes: ['']
    });
  }

  openEditCustomerModal(customer: any) {
    this.selectedCustomer = customer;
    this.form.patchValue({
      fullname: customer.fullName,
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
  }

  updateCustomer() {
    const updatedCustomer = {
      fullName: this.form.value.fullName,
      gender: this.form.value.gender,
      occupation: this.form.value.occupation,
      birthDate: this.form.value.birthDate,
      email: this.form.value.email,
      website: this.form.value.website,
      subscribeToAds: this.form.value.subscribeToAds,
      address: this.form.value.address,
      city: this.form.value.city,
      notes: this.form.value.notes
    };

    const apiUrl = `http://localhost:5000/api/customers/${this.selectedCustomer.id}`;
  this.http.put(apiUrl, updatedCustomer).subscribe((response: any) => {
    console.log('✓ Customer updated successfully');
    this.message = '✓ Customer updated successfully';
    this.fetchCustomers();

    setTimeout(() => {
      this.message = '';
    }, 3000);
  });

    $('#editModal').modal('hide');
  }
}
