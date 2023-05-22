import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: any[];
  form: FormGroup;
  selectedCustomer: any;

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
      fullname: [''],
      gender: [''],
      occupation: ['']
    });
  }

  openEditCustomerModal(customer: any) {
    this.selectedCustomer = customer;
    this.form.patchValue({
      fullname: customer.fullname,
      gender: customer.gender,
      occupation: customer.occupation
    });
  }

  updateCustomer() {
    const updatedCustomer = {
      fullname: this.form.value.fullname,
      gender: this.form.value.gender,
      occupation: this.form.value.occupation
    };

    // TODO: HTTP isteği ile müşteri güncelleme işlemini gerçekleştirin

    this.selectedCustomer = null;
  }
}
