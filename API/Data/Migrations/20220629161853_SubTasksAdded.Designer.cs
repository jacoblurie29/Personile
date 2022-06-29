﻿// <auto-generated />
using System;
using API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace API.Data.Migrations
{
    [DbContext(typeof(PersonileContext))]
    [Migration("20220629161853_SubTasksAdded")]
    partial class SubTasksAdded
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "6.0.6");

            modelBuilder.Entity("API.Entities.SprintEntity", b =>
                {
                    b.Property<string>("SprintEntityId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("EndDate")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("StartDate")
                        .HasColumnType("TEXT");

                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.HasKey("SprintEntityId");

                    b.ToTable("Sprints");
                });

            modelBuilder.Entity("API.Entities.SubTaskEntity", b =>
                {
                    b.Property<string>("SubTaskEntityId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Details")
                        .HasColumnType("TEXT");

                    b.Property<string>("Status")
                        .HasColumnType("TEXT");

                    b.Property<string>("TaskEntityId")
                        .HasColumnType("TEXT");

                    b.HasKey("SubTaskEntityId");

                    b.HasIndex("TaskEntityId");

                    b.ToTable("SubTasks");
                });

            modelBuilder.Entity("API.Entities.TaskEntity", b =>
                {
                    b.Property<string>("TaskEntityId")
                        .HasColumnType("TEXT");

                    b.Property<int>("Color")
                        .HasColumnType("INTEGER");

                    b.Property<int>("CurrentState")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("DateCreated")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DateFinished")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<DateTime?>("DueDate")
                        .HasColumnType("TEXT");

                    b.Property<int>("Effort")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Links")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("SprintId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Tags")
                        .HasColumnType("TEXT");

                    b.HasKey("TaskEntityId");

                    b.HasIndex("SprintId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("API.Entities.SubTaskEntity", b =>
                {
                    b.HasOne("API.Entities.TaskEntity", "Task")
                        .WithMany("SubTasks")
                        .HasForeignKey("TaskEntityId");

                    b.Navigation("Task");
                });

            modelBuilder.Entity("API.Entities.TaskEntity", b =>
                {
                    b.HasOne("API.Entities.SprintEntity", "Sprint")
                        .WithMany("Tasks")
                        .HasForeignKey("SprintId");

                    b.Navigation("Sprint");
                });

            modelBuilder.Entity("API.Entities.SprintEntity", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("API.Entities.TaskEntity", b =>
                {
                    b.Navigation("SubTasks");
                });
#pragma warning restore 612, 618
        }
    }
}
