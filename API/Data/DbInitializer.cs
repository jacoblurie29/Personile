using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.Data
{
    public static class DbInitializer
    {
        public static void Initialize(PersonileContext context) {
            if(context.Tasks.Any()) return;

            var tasks = new List<TaskEntity> {
                new TaskEntity {
                    Id = "TASK_ID_0",
                    UserId = "USER_ID_1",
                    SprintId = "SPRINT_ID_1",
                    GroupId = "GROUP_ID_1",
                    Name = "Build app frontend",
                    Description = "Build the frontend of the Personile application using React, TypeScript, and Redux",
                    Links="https://www.google.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 1,
                    Tags = "App|Frontend|Development|Personal",
                    Effort = 6,
                    Color = 0
                },
                new TaskEntity {
                    Id = "TASK_ID_1",
                    UserId = "USER_ID_1",
                    SprintId = "SPRINT_ID_1",
                    GroupId = "GROUP_ID_1",
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
                    Id = "TASK_ID_2",
                    UserId = "USER_ID_1",
                    SprintId = "SPRINT_ID_1",
                    GroupId = "GROUP_ID_1",
                    Name = "Build app database",
                    Description = "Build the database of the Personile application using SQL and .NET EF",
                    Links="https://www.google.com|https://snapchat.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 1,
                    Tags = "App|Database|Development|Personal",
                    Effort = 4,
                    Color = 0
                },new TaskEntity {
                    Id = "TASK_ID_3",
                    UserId = "USER_ID_1",
                    SprintId = "SPRINT_ID_1",
                    GroupId = "GROUP_ID_2",
                    Name = "Build app marketing",
                    Description = "Build the marketing of the Personile application using Adobe",
                    Links="https://www.google.com|https://linkedin.com|https://www.instagram.com",
                    DateCreated = new DateTime(2022, 5, 25),
                    DateFinished = null,
                    DueDate = null,
                    CurrentState = 1,
                    Tags = "App|Marketing|Business|Team",
                    Effort = 9,
                    Color = 1
                },new TaskEntity {
                    Id = "TASK_ID_4",
                    UserId = "USER_ID_1",
                    SprintId = "SPRINT_ID_1",
                    GroupId = "GROUP_ID_2",
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
                    Id = "TASK_ID_5",
                    UserId = "USER_ID_1",
                    SprintId = "SPRINT_ID_0",
                    GroupId = "GROUP_ID_0",
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
                },
            };

            foreach (var task in tasks)
            {
                context.Tasks.Add(task);
            }

            context.SaveChanges();
        }
    }
}