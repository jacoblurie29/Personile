using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class GoalEntity
    {
        public string GoalEntityId { get; set; }
        public string Details { get; set; }
        public string Status { get; set; }
        public BoardEntity BoardEntity { get; set; }
        public string BoardEntityId { get; set; }
    }
}