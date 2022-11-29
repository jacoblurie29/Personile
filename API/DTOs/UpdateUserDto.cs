using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UpdateUserDto
    {
        public string UserEntityId { get; set; }
        public string Email { get; set;}
        public string FirstName { get; set; }
        public string LastName { get; set; }

    }
}