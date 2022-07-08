using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class PersonileContext : DbContext
    {
        public PersonileContext(DbContextOptions options) : base(options)
        {
        }
        
        public DbSet<UserEntity> Users { get; set; }
        public DbSet<SprintEntity> Sprints { get; set; }

        public DbSet<TaskEntity> Tasks { get; set; }

        public DbSet<SubTaskEntity> SubTasks { get; set; }

        // The following is necessary for cascade deleting (EF Core orphans rows and does not support true cascading)
        // Will have to implement for ANY deleted object with a parent or child
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskEntity>()
            .HasKey(k => new {k.TaskEntityId, k.SprintId});

        }

    }
}