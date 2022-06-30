using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(PersonileContext context) {
            if(context.Sprints.Any()) return;

            var sprints = new List<SprintEntity>  {
                    new SprintEntity {
                        SprintEntityId = "SPRINT_ID_1",
                        UserId = "USER_ID_1",
                    },
                    new SprintEntity {
                        SprintEntityId = "SPRINT_ID_2",
                        UserId = "USER_ID_1",
                    }
                };

            var tasksForSprint0 = new List<TaskEntity> {
                new TaskEntity {
                    TaskEntityId = "TASK_ID_0",
                    Name = "Build app frontend",
                    Description = "Build the frontend of the Personile application using React, TypeScript, and Redux",
                    Links="https://www.google.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
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
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 1,
                    Tags = "App|Backend|Development|Personal",
                    Effort = 8,
                    Color = 0
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_2",
                    Name = "Build app database",
                    Description = "Build the database of the Personile application using SQL and .NET EF",
                    Links="https://www.google.com|https://snapchat.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 2,
                    Tags = "App|Database|Development|Personal",
                    Effort = 4,
                    Color = 0
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_3",
                    Name = "Build app marketing",
                    Description = "Build the marketing of the Personile application using Adobe",
                    Links="https://www.google.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
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
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 0,
                    Tags = "App|Social|Business|Team",
                    Effort = 3,
                    Color = 1
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_5",
                    Name = "Make app idea",
                    Description = "Create the idea for the Personile application",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 2,
                    Tags = "App|Development|Team",
                    Effort = 6,
                    Color = 2
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_6",
                    Name = "Collaborate with team",
                    Description = "Work with other team members to create the application",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 0,
                    Tags = "App|Development|Team",
                    Effort = 6,
                    Color = 2
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_7",
                    Name = "Get outside funding",
                    Description = "Convince people to invest in the application",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 1,
                    Tags = "App|Money|Team",
                    Effort = 6,
                    Color = 2
                },new TaskEntity {
                    TaskEntityId = "TASK_ID_8",
                    Name = "Write app documentation",
                    Description = "Write wiki on how people can use the applcation efficiently",
                    Links="https://www.cnn.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 1,
                    Tags = "App|Usage|Documentation",
                    Effort = 6,
                    Color = 2
                },
        };

 

        var subTasksForTask0 = new List<SubTaskEntity> {
                        new SubTaskEntity {
                            SubTaskEntityId = "SUBTASK_ID_1",
                            Status = "Incomplete",
                            Details = "Details",
                        },
                        new SubTaskEntity {
                            SubTaskEntityId = "SUBTASK_ID_2",
                            Status = "Incomplete",
                            Details = "Details",
                        },
                        new SubTaskEntity {
                            SubTaskEntityId = "SUBTASK_ID_3",
                            Status = "Complete",
                            Details = "Details",
                        },
                        new SubTaskEntity {
                            SubTaskEntityId = "SUBTASK_ID_4",
                            Status = "Complete",
                            Details = "Details",
                        }
                };

        tasksForSprint0[0].SubTasks = subTasksForTask0;



        sprints[0].Tasks = tasksForSprint0;

        sprints[1].Tasks = tasksForSprint1;

        foreach (var sprint in sprints)
        {
            context.Sprints.Add(sprint);
        }



            context.SaveChanges();
        }
    }
}