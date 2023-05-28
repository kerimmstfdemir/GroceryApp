using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ServerApp.Models
{
    public class PhoneNumbersViewModel
    {
        public int Id { get; set; }
        public string Number { get; set; }
        public int CustomerId { get; set; }
    }
}
