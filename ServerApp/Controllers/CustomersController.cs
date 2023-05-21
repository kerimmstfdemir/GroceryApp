using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApp.Database;
using ServerApp.Models;

namespace ServerApp.Controllers
{
    //* localhost:5000/api/products
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private readonly CustomerContext _context;

        public CustomersController(CustomerContext context)
        {
            _context = context;
        }

        // GET: api/customers
        [HttpGet]
        public IActionResult GetAllCustomers()
        {
            var customers = _context.Customers.Include(c => c.PhoneNumbers).ToList();
            var customerViewModels = customers.Select(c => new CustomerViewModel
            {
                Id = c.Id,
                FullName = c.FullName,
                Gender = c.Gender,
                Occupation = c.Occupation,
                BirthDate = c.BirthDate,
                Email = c.Email,
                Website = c.Website,
                SubscribeToAds = c.SubscribeToAds,
                Address = c.Address,
                City = c.City,
                PhoneNumbers = c.PhoneNumbers.Select(p => p.Number).ToList(),
                Notes = c.Notes
            }).ToList();

            return Ok(customerViewModels);
        }

        // GET: api/customers/{id}
        [HttpGet("{id}")]
        public IActionResult GetCustomer(int id)
        {
            var customer = _context.Customers.Include(c => c.PhoneNumbers).FirstOrDefault(c => c.Id == id);
            if (customer == null)
            {
                return NotFound();
            }

            var customerViewModel = new CustomerViewModel
            {
                Id = customer.Id,
                FullName = customer.FullName,
                Gender = customer.Gender,
                Occupation = customer.Occupation,
                BirthDate = customer.BirthDate,
                Email = customer.Email,
                Website = customer.Website,
                SubscribeToAds = customer.SubscribeToAds,
                Address = customer.Address,
                City = customer.City,
                PhoneNumbers = customer.PhoneNumbers.Select(p => p.Number).ToList(),
                Notes = customer.Notes
            };

            return Ok(customerViewModel);
        }

        // POST: api/customers
        [HttpPost]
        public IActionResult CreateCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetCustomer), new { id = customer.Id }, customer);
        }

        // PUT: api/customers/{id}
        [HttpPut("{id}")]
        public IActionResult UpdateCustomer(int id, Customer updatedCustomer)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
            {
                return NotFound();
            }

            customer.FullName = updatedCustomer.FullName;
            customer.Gender = updatedCustomer.Gender;
            customer.Occupation = updatedCustomer.Occupation;
            customer.BirthDate = updatedCustomer.BirthDate;
            customer.Email = updatedCustomer.Email;
            customer.Website = updatedCustomer.Website;
            customer.SubscribeToAds = updatedCustomer.SubscribeToAds;
            customer.Address = updatedCustomer.Address;
            customer.City = updatedCustomer.City;
            customer.Notes = updatedCustomer.Notes;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/customers/{id}
        [HttpDelete("{id}")]
        public IActionResult DeleteCustomer(int id)
        {
            var customer = _context.Customers.FirstOrDefault(c => c.Id == id);
            if (customer == null)
            {
                return NotFound();
            }

            _context.Customers.Remove(customer);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
