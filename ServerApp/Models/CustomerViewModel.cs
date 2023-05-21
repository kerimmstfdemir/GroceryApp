using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class CustomerViewModel
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
        public List<string> PhoneNumbers { get; set; }
        public string Notes { get; set; }
    }
}
