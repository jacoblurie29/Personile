using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class GoalDto
    {
        public string GoalEntityId { get; set; }
        public string Details { get; set; }
        public string Status { get; set; }
    }
}