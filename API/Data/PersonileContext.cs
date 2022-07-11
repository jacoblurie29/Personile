using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace API.Data
{
    public class PersonileContext : IdentityDbContext<UserEntity>
    {
        public PersonileContext(DbContextOptions options) : base(options)
        {
        }
        
        public DbSet<SprintEntity> Sprints { get; set; }
        public DbSet<TaskEntity> Tasks { get; set; }
        public DbSet<SubTaskEntity> SubTasks { get; set; }

        // The following is necessary for cascade deleting (EF Core orphans rows and does not support true cascading)
        // Will have to implement for ANY deleted object with a parent or child
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // modelBuilder.Entity<TaskEntity>()
            // .HasKey(k => new {k.TaskEntityId, k.SprintId});

            modelBuilder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole{Name= "Member", NormalizedName= "MEMBER"},
                    new IdentityRole{Name= "Admin", NormalizedName= "ADMIN"}
                );

        }

    }
}