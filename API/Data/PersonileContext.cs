using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PersonileContext : DbContext
    {
        public PersonileContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<TaskEntity> Tasks { get; set; }
    }
}