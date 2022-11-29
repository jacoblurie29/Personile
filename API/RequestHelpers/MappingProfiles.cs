using System.Linq;
using API.DTOs;
using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<UserEntity, UserDto>();
            CreateMap<BoardEntity, BoardDto>();
            CreateMap<GoalEntity, GoalDto>();
            CreateMap<MilestoneEntity, MilestoneDto>()
                .ForMember(dto => dto.TaskIds, opt => opt.MapFrom(x => x.Tasks.Select(t => t.TaskEntityId)));
            CreateMap<SprintEntity, SprintDto>();
            CreateMap<TaskEntity, TaskDto>()
                .ForMember(dto => dto.MilestoneIds, opt => opt.MapFrom(x => string.Join("|", x.Milestones.Select(t => t.MilestoneEntityId).ToList())));
            CreateMap<SubTaskEntity, SubTaskDto>();
            CreateMap<BoardDto, BoardEntity>();
            CreateMap<GoalDto, GoalEntity>();
            CreateMap<MilestoneDto, MilestoneEntity>();
            CreateMap<SprintDto, SprintEntity>();
            CreateMap<TaskDto, TaskEntity>();
            CreateMap<SubTaskDto, SubTaskEntity>();
            CreateMap<UpdateTaskDto, TaskEntity>();
            CreateMap<UpdateBoardDto, BoardEntity>();
            CreateMap<ActivityEventEntity, ActivityEventDto>();
            CreateMap<ActivityEventDto, ActivityEventEntity>();
            
        }
    }
}