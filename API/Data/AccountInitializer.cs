using System;
using System.Collections.Generic;
using System.Globalization;
using API.DTOs;
using API.Entities;
using API.RequestHelpers;

namespace API.Data
{
    public class AccountInitializer
    {
        public BoardEntity generateInitialUserBoard() {
            BoardEntity defaultBoard = new BoardEntity{
                    BoardEntityId = Guid.NewGuid().ToString(),
                    Name = "Main board",
                    Description = "Your main board with all of your tasks!",
                    StartDate = DateTime.Today.ToString("ddd MMM dd yyyy"),
                    EndDate = DateTime.Today.AddDays(30).ToString("ddd MMM dd yyyy"),
                    SprintDaysLength = 14,
                    HandleOverflow = "start",
                    Sprints= new List<SprintEntity> {},
                    Goals= new List<GoalEntity> {
                        new GoalEntity {
                            GoalEntityId = Guid.NewGuid().ToString(),
                            Details = "Define your goals!",
                            Status = "Incomplete"
                        }
                    },
                    Milestones = new List<MilestoneEntity> {}
            };

            return defaultBoard;
        }

        public TaskEntity generateInitialUserTask() {

            return new TaskEntity {
                TaskEntityId = Guid.NewGuid().ToString(),
                Name = "Create tasks!",
                Description = "Track your work with tasks in each sprint.",
                Links="https://www.google.com/",
                DateCreated = DateTime.Today.ToString("ddd MMM dd yyyy"),
                DateFinished = "",
                DueDate = "",
                CurrentState = 0,
                Tags = "Tags|Are|Useful!",
                Effort = 6,
                Color = 2,
                Order = 0,
                Milestones = new List<MilestoneEntity>()
            };


        }

        public MilestoneEntity generateInitialUserMilestone(string desc, int addDays) {

            return new MilestoneEntity {
                MilestoneEntityId = Guid.NewGuid().ToString(),
                Description = desc,
                Status = "Incomplete",
                DueDate = DateTime.Today.AddDays(addDays).ToString("ddd MMM dd yyyy"),
                HardDeadline = false,
                AssociatedTaskIds = "",
                CompletedDate = "",
                Tasks = new List<TaskEntity>()
            };
                    
        }
    }
}