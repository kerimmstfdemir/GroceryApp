using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ServerApp.Models;

namespace ServerApp.Database
{
    public class CustomerContext:DbContext
    {
      public CustomerContext(DbContextOptions<CustomerContext> options) : base(options)
        {
        }

        public DbSet<Customer> Customers { get; set; }
        public DbSet<PhoneNumber> PhoneNumbers { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Customer>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.FullName).IsRequired();
                entity.Property(c => c.Gender).IsRequired();
                entity.Property(c => c.Occupation).IsRequired();
                entity.Property(c => c.BirthDate).IsRequired();
                entity.Property(c => c.Email).IsRequired();
                entity.Property(c => c.Website).IsRequired();
                entity.Property(c => c.SubscribeToAds).IsRequired();
                entity.Property(c => c.Address).IsRequired();
                entity.Property(c => c.City).IsRequired();
                entity.Property(c => c.Notes);

                entity.HasMany(c => c.PhoneNumbers)
                .WithOne(p => p.Customer)
                .HasForeignKey(p => p.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<PhoneNumber>(entity =>
            {
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Number).IsRequired();
                entity.Property(p => p.CustomerId).IsRequired();

                entity.HasOne(p => p.Customer)
                .WithMany(c => c.PhoneNumbers)
                .HasForeignKey(p => p.CustomerId)
                .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
