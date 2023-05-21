using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class Customer
    {
        public int Id { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string Occupation { get; set; }
        public DateTime? BirthDate { get; set; }
        public string Email { get; set; }
        public string Website { get; set; }
        public bool SubscribeToAds { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public List<PhoneNumber> PhoneNumbers { get; set; }
        public string Notes { get; set; }
    }

    public class PhoneNumber
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public int CustomerId { get; set; }
        public Customer Customer { get; set; }
    }
}
