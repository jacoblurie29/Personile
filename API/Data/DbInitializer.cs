using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(PersonileContext context, UserManager<UserEntity> userManager) {

            

            if(context.Users.Any()) return;


            var board = new List<BoardEntity> {
                new BoardEntity {
                    BoardEntityId = Guid.NewGuid().ToString(),
                    Name = "Main board",
                    Description = "Your main board with all of your tasks!",
                    StartDate = "Sun Jul 10 2022 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    EndDate = "Sat Aug 06 2022 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    SprintDaysLength = 14,
                    HandleOverflow = "start",
                    Sprints= new List<SprintEntity> {},
                    Goals= new List<GoalEntity> {},
                    Milestones = new List<MilestoneEntity> {}
                }
            };

            var goals = new List<GoalEntity> {
                new GoalEntity {
                    GoalEntityId = Guid.NewGuid().ToString(),
                    Details = "Complete project on time",
                    Status = "Incomplete"
                },
                new GoalEntity {
                    GoalEntityId = Guid.NewGuid().ToString(),
                    Details = "Utilize resources online",
                    Status = "Incomplete"
                },
                new GoalEntity {
                    GoalEntityId = Guid.NewGuid().ToString(),
                    Details = "Work with teammates",
                    Status = "Incomplete"
                }
            };

            var milestones = new List<MilestoneEntity> {
                new MilestoneEntity {
                    MilestoneEntityId = Guid.NewGuid().ToString(),
                    Description = "Finish Controllers",
                    Status = "Incomplete",
                    DueDate = "Sun Jul 27 2022 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    HardDeadline = false,
                    AssociatedTaskIds = "",
                    CompletedDate = "",
                },
                new MilestoneEntity {
                    MilestoneEntityId = Guid.NewGuid().ToString(),
                    Description = "Submit Project",
                    Status = "Incomplete",
                    DueDate = "",
                    HardDeadline = false,
                    AssociatedTaskIds = "",
                    CompletedDate = "",
                },
                new MilestoneEntity {
                    MilestoneEntityId = Guid.NewGuid().ToString(),
                    Description = "Receive good grades",
                    Status = "Incomplete",
                    DueDate = "Sun Jul 29 2022 00:00:00 GMT-0400 (Eastern Daylight Time)",
                    HardDeadline = true,
                    AssociatedTaskIds = "",
                    CompletedDate = "",
                }
            };

            var sprints = new List<SprintEntity>  {
                    new SprintEntity {
                        SprintEntityId = Guid.NewGuid().ToString(),
                        StartDate="Sun Jul 10 2022 00:00:00 GMT-0400 (Eastern Daylight Time)",
                        EndDate="Sat Jul 23 2022 00:00:00 GMT-0400 (Eastern Daylight Time)"

                    },
                    new SprintEntity {
                        SprintEntityId = Guid.NewGuid().ToString(),
                        StartDate="Sun Jul 24 2022 00:00:00 GMT-0400 (Eastern Daylight Time)",
                        EndDate="Sat Aug 06 2022 00:00:00 GMT-0400 (Eastern Daylight Time)"
                    }
                };
                

            var tasksForSprint0 = new List<TaskEntity> {
                new TaskEntity {
                    TaskEntityId = "TASK_ID_0",
                    Name = "Build app frontend",
                    Description = "Build the frontend of the Personile application using React, TypeScript, and Redux",
                    Links="https://www.google.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 1,
                    Tags = "App|Frontend|Development|Personal",
                    Effort = 6,
                    Color = 0,
                },
                new TaskEntity {
                    TaskEntityId = "TASK_ID_1",
                    Name = "Build app backend",
                    Description = "Build the backend of the Personile application using C# and .NET",
                    Links="https://www.fox.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 1,
                    Tags = "App|Backend|Development|Personal",
                    Effort = 8,
                    Color = 0
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_2",
                    Name = "Build app database",
                    Description = "Build the database of the Personile application using SQL and .NET EF",
                    Links="https://www.google.com|https://snapchat.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 2,
                    Tags = "App|Database|Development|Personal",
                    Effort = 4,
                    Color = 0
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_3",
                    Name = "Build app marketing",
                    Description = "Build the marketing of the Personile application using Adobe",
                    Links="https://www.google.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 2,
                    Tags = "App|Marketing|Business|Team",
                    Effort = 9,
                    Color = 1
                }
        };
        
        var tasksForSprint1 = new List<TaskEntity> { 
            new TaskEntity {
                    TaskEntityId = "TASK_ID_4",
                    Name = "Create app social media",
                    Description = "Build the social media presence of the Personile application",
                    Links="https://www.google.com|https://linkedin.com|https://www.tiktok.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 0,
                    Tags = "App|Social|Business|Team",
                    Effort = 3,
                    Color = 1
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_5",
                    Name = "Make app idea",
                    Description = "Create the idea for the Personile application",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 2,
                    Tags = "App|Development|Team",
                    Effort = 6,
                    Color = 2
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_6",
                    Name = "Collaborate with team",
                    Description = "Work with other team members to create the application",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 0,
                    Tags = "App|Development|Team",
                    Effort = 6,
                    Color = 2
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_7",
                    Name = "Get outside funding",
                    Description = "Convince people to invest in the application",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 1,
                    Tags = "App|Money|Team",
                    Effort = 6,
                    Color = 2
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_8",
                    Name = "Write app documentation",
                    Description = "Write wiki on how people can use the applcation efficiently",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = "Fri Jul 08 2022 12:40:27 GMT-0400 (Eastern Daylight Time)",
                    DateFinished = "",
                    DueDate = "",
                    CurrentState = 1,
                    Tags = "App|Usage|Documentation",
                    Effort = 6,
                    Color = 2
                },
        };


        sprints[0].Tasks = tasksForSprint0;
        sprints[1].Tasks = tasksForSprint1;

        board[0].Sprints.Add(sprints[0]);
        board[0].Sprints.Add(sprints[1]);

        board[0].Goals.Add(goals[0]);
        board[0].Goals.Add(goals[1]);
        board[0].Goals.Add(goals[2]);

        board[0].Milestones.Add(milestones[0]);
        board[0].Milestones.Add(milestones[1]);
        board[0].Milestones.Add(milestones[2]);


        if (!userManager.Users.Any()) {
               var userMember = new UserEntity {
                    UserName = "memberuser@test.com",
                    FirstName = "Member",
                    LastName = "User",
                    Email = "memberuser@test.com",
                    Boards = board
                };
                var userAdmin = new UserEntity {
                    UserName = "adminuser@test.com",
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "adminuser@test.com",
                    Boards = {}
                };

                await userManager.CreateAsync(userMember, "Pa$$w0rd");
                await userManager.AddToRoleAsync(userMember, "Member");

                await userManager.CreateAsync(userAdmin, "Pa$$w0rd");
                await userManager.AddToRolesAsync(userAdmin, new[] {"Member","Admin"});
            }

        context.SaveChanges();
        }
    }
}