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
    }
}