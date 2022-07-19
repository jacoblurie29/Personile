using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class BoardEntity
    {
        public string BoardEntityId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public int SprintDaysLength { get; set; }
        public List<SprintEntity> Sprints { get; set; }
        public List<GoalEntity> Goals { get; set; }
        public List<MilestoneEntity> Milestones { get; set; }
        public string UserEntityId { get; set; }
        public UserEntity UserEntity { get; set; }

    }
}