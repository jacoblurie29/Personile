using API.DTOs;
using API.Entities;
using AutoMapper;

namespace API.RequestHelpers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<BoardDto, BoardEntity>();
            CreateMap<GoalDto, GoalEntity>();
            CreateMap<MilestoneDto, MilestoneEntity>();
            CreateMap<SprintDto, SprintEntity>();
            CreateMap<TaskDto, TaskEntity>();
            CreateMap<SubTaskDto, SubTaskEntity>();
            CreateMap<UpdateTaskDto, TaskEntity>();
            CreateMap<UpdateBoardDto, BoardEntity>();
            
        }
    }
}