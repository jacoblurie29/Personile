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
        
        public DbSet<BoardEntity> Boards { get; set; }
        public DbSet<GoalEntity> Goals { get; set; }
        public DbSet<MilestoneEntity> Milestones { get; set; }
        public DbSet<TaskMilestoneEntity> TaskMilestones { get; set; }
        public DbSet<SprintEntity> Sprints { get; set; }
        public DbSet<TaskEntity> Tasks { get; set; }
        public DbSet<SubTaskEntity> SubTasks { get; set; }

        // The following is necessary for cascade deleting (EF Core orphans rows and does not support true cascading)
        // Will have to implement for ANY deleted object with a parent or child
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            /* For anyone reading this, you have no idea how long it took me to figure out the code below XD */

            modelBuilder
            .Entity<SubTaskEntity>()
            .HasOne(t => t.TaskEntity)
            .WithMany(s => s.SubTasks)
            .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder
            .Entity<TaskEntity>()
            .HasOne(s => s.SprintEntity)
            .WithMany(t => t.Tasks)
            .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder
            .Entity<SprintEntity>()
            .HasOne(b => b.BoardEntity)
            .WithMany(s => s.Sprints)
            .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder
            .Entity<BoardEntity>()
            .HasOne(u => u.UserEntity)
            .WithMany(b => b.Boards)
            .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder
            .Entity<GoalEntity>()
            .HasOne(b => b.BoardEntity)
            .WithMany(g => g.Goals)
            .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder
            .Entity<MilestoneEntity>()
            .HasOne(b => b.BoardEntity)
            .WithMany(m => m.Milestones)
            .OnDelete(DeleteBehavior.ClientCascade);

            modelBuilder
            .Entity<TaskEntity>()
            .HasMany(m => m.Milestones)
            .WithMany(t => t.Tasks)
            .UsingEntity<TaskMilestoneEntity>(
                tm => tm
                    .HasOne(tm => tm.MilestoneEntity)
                    .WithMany()
                    .HasForeignKey("MilestoneEntityId"),
                tm => tm
                    .HasOne(tm => tm.TaskEntity)
                    .WithMany()
                    .HasForeignKey("TaskEntityId")
            ).ToTable("TaskMilestones")
             .HasKey(tm => new { tm.TaskEntityId, tm.MilestoneEntityId});

            modelBuilder.Entity<IdentityRole>()
                .HasData(
                    new IdentityRole{Name= "Member", NormalizedName= "MEMBER"},
                    new IdentityRole{Name= "Admin", NormalizedName= "ADMIN"}
                );

        }

    }
}