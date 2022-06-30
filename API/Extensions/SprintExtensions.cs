using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Extensions
{
    public static class SprintExtensions
    {
        public static SprintDto mapSprintToDto(this SprintEntity sprintEntity) {
            return new SprintDto {
                SprintEntityId = sprintEntity.SprintEntityId,
                UserId = sprintEntity.UserId,
                StartDate = sprintEntity.StartDate,
                EndDate = sprintEntity.EndDate,
                Tasks = sprintEntity.Tasks.Select(task => new TaskDto {
                    TaskEntityId = task.TaskEntityId,
                    Name = task.Name,
                    Description = task.Description,
                    Links = task.Links,
                    DateCreated = task.DateCreated,
                    DateFinished = task.DateFinished,
                    DueDate = task.DueDate,
                    CurrentState = task.CurrentState,
                    Tags = task.Tags,
                    Effort = task.Effort,
                    Color = task.Color,
                    SubTasks = task.SubTasks.Select(subTask => new SubTaskDto {
                        SubTaskEntityId = subTask.SubTaskEntityId,
                        Status = subTask.Status,
                        Details = subTask.Details
                    }).ToList()
                }).ToList()

                };

            }
        }
    }
