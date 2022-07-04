using System.Collections.Generic;

namespace API.Entities
{
    public class UserEntity
    {
        public string UserEntityId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public List<SprintEntity> Sprints { get; set; }
    }
}