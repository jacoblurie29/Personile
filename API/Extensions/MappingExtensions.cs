using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions
{
    public static class MappingExtensions
    {

        public static UserDto mapUserToDto(this UserEntity userEntity) {
            return new UserDto {
                UserEntityId = userEntity.Id,
                FirstName = userEntity.FirstName,
                LastName = userEntity.LastName,
                Email = userEntity.Email,
                Boards = userEntity.Boards.Select(board => new BoardDto {
                    BoardEntityId = board.BoardEntityId,
                    StartDate = board.StartDate,
                    Name = board.Name,
                    Description = board.Description,
                    SprintDaysLength = board.SprintDaysLength,
                    HandleOverflow = board.HandleOverflow,
                    EndDate = board.EndDate,
                    Goals = board.Goals.Select(goal => new GoalDto {
                        GoalEntityId = goal.GoalEntityId,
                        Details = goal.Details,
                        Status = goal.Status
                    }).ToList(),
                    Milestones = board.Milestones.Select(milestone => new MilestoneDto {
                        MilestoneEntityId = milestone.MilestoneEntityId,
                        Description = milestone.Description,
                        Status = milestone.Status,
                        DueDate = milestone.DueDate,
                        HardDeadline = milestone.HardDeadline,
                        AssociatedTaskIds = milestone.AssociatedTaskIds,
                        CompletedDate = milestone.CompletedDate
                    }).ToList(),
                    Sprints = board.Sprints.Select(sprint => new SprintDto {
                        SprintEntityId = sprint.SprintEntityId,
                        StartDate = sprint.StartDate,
                        EndDate = sprint.EndDate,
                        Tasks = sprint.Tasks.Select(task => new TaskDto {
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
                    }).ToList()
                }).ToList()
            };
        }

        public static BoardDto mapBoardToDto(this BoardEntity boardEntity) {
            return new BoardDto {
                BoardEntityId = boardEntity.BoardEntityId,
                StartDate = boardEntity.StartDate,
                EndDate = boardEntity.EndDate,
                Goals = boardEntity.Goals.Select(goal => new GoalDto {
                        GoalEntityId = goal.GoalEntityId,
                        Details = goal.Details,
                        Status = goal.Status
                }).ToList(),
                Sprints = boardEntity.Sprints.Select(sprint => new SprintDto {
                    SprintEntityId = sprint.SprintEntityId,
                    StartDate = sprint.StartDate,
                    EndDate = sprint.EndDate,
                    Tasks = sprint.Tasks.Select(task => new TaskDto {
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
                }).ToList()
            };
        }

        public static SprintDto mapSprintToDto(this SprintEntity sprintEntity) {
            return new SprintDto {
                SprintEntityId = sprintEntity.SprintEntityId,
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
        

        public static TaskDto mapTaskToDto(this TaskEntity taskEntity) {
            return new TaskDto {
                    TaskEntityId = taskEntity.TaskEntityId,
                    Name = taskEntity.Name,
                    Description = taskEntity.Description,
                    Links = taskEntity.Links,
                    DateCreated = taskEntity.DateCreated,
                    DateFinished = taskEntity.DateFinished,
                    DueDate = taskEntity.DueDate,
                    CurrentState = taskEntity.CurrentState,
                    Tags = taskEntity.Tags,
                    Effort = taskEntity.Effort,
                    Color = taskEntity.Color,
                    SubTasks = taskEntity.SubTasks.Select(subTask => new SubTaskDto {
                        SubTaskEntityId = subTask.SubTaskEntityId,
                        Status = subTask.Status,
                        Details = subTask.Details
                }).ToList()
            };
        }

        public static SubTaskDto mapSubtaskToDto(this SubTaskEntity subTaskEntity) {
            return new SubTaskDto {
                    SubTaskEntityId = subTaskEntity.SubTaskEntityId,
                    Status = subTaskEntity.Status,
                    Details = subTaskEntity.Details
            };
        }

        
    }
}
    
