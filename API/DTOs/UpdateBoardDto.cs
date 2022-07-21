using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UpdateBoardDto
    {
        public string BoardEntityId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public List<GoalDto> Goals { get; set; }
        public List<MilestoneDto> Milestones { get; set; }
    }
}