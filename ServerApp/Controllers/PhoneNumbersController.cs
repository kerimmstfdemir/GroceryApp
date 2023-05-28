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
    [ApiController]
    [Route("api/[controller]")]
    public class PhoneNumbersController : ControllerBase
    {
        private readonly PhoneNumbersContext _context;

        public PhoneNumbersController(PhoneNumbersContext context)
        {
            _context = context;
        }

        // GET: api/phonenumbers
        [HttpGet]
        public IActionResult GetAllPhoneNumbers()
        {
            var phoneNumbers = _context.PhoneNumbers.ToList();
            var phoneNumberViewModels = phoneNumbers.Select(p => new PhoneNumbersViewModel
            {
                Id = p.Id,
                Number = p.Number,
                CustomerId = p.CustomerId
            }).ToList();

            return Ok(phoneNumberViewModels);
        }

        // GET: api/phonenumbers/{id}
        [HttpGet("{id}")]
        public IActionResult GetPhoneNumber(int id)
        {
            var phoneNumber = _context.PhoneNumbers.FirstOrDefault(p => p.Id == id);
            if (phoneNumber == null)
            {
                return NotFound();
            }

            var phoneNumberViewModel = new PhoneNumbersViewModel
            {
                Id = phoneNumber.Id,
                Number = phoneNumber.Number,
                CustomerId = phoneNumber.CustomerId
            };

            return Ok(phoneNumberViewModel);
        }

        // POST: api/phonenumbers
        [HttpPost]
        public IActionResult CreatePhoneNumber(PhoneNumber phoneNumber)
        {
            _context.PhoneNumbers.Add(phoneNumber);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetPhoneNumber), new { id = phoneNumber.Id }, phoneNumber);
        }

        // PUT: api/phonenumbers/{id}
        [HttpPut("{id}")]
        public IActionResult UpdatePhoneNumber(int id, PhoneNumber updatedPhoneNumber)
        {
            var phoneNumber = _context.PhoneNumbers.FirstOrDefault(p => p.Id == id);
            if (phoneNumber == null)
            {
                return NotFound();
            }

            phoneNumber.Number = updatedPhoneNumber.Number;
            phoneNumber.CustomerId = updatedPhoneNumber.CustomerId;

            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/phonenumbers/{id}
        [HttpDelete("{id}")]
        public IActionResult DeletePhoneNumber(int id)
        {
            var phoneNumber = _context.PhoneNumbers.FirstOrDefault(p => p.Id == id);
            if (phoneNumber == null)
            {
                return NotFound();
            }

            _context.PhoneNumbers.Remove(phoneNumber);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
