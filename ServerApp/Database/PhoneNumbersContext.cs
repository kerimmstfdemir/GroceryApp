using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;

namespace ServerApp.Database
{
    public class PhoneNumbersContext:DbContext
    {
        public PhoneNumbersContext(DbContextOptions<PhoneNumbersContext> options) : base(options)
        {
        }

        public DbSet<PhoneNumber> PhoneNumbers { get; set; }
    }
}
