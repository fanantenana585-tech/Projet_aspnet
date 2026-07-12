using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddEmploiDuTempsFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.AlterColumn<string>(
                name: "Initiales",
                table: "Enseignants",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "Groupe",
                table: "EmploiDuTemps",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Jour",
                table: "EmploiDuTemps",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MentionId",
                table: "EmploiDuTemps",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Niveau",
                table: "EmploiDuTemps",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Note",
                table: "EmploiDuTemps",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ParcoursId",
                table: "EmploiDuTemps",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nom = table.Column<string>(type: "text", nullable: false),
                    Departement = table.Column<string>(type: "text", nullable: false),
                    Promotion = table.Column<int>(type: "integer", nullable: false),
                    ProfesseurId = table.Column<int>(type: "integer", nullable: false),
                    Salle = table.Column<string>(type: "text", nullable: false),
                    Jour = table.Column<string>(type: "text", nullable: false),
                    Creneau = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "UserSettings",
                columns: table => new
                {
                    Key = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    UserId = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSettings", x => x.Key);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "UserSettings");

            migrationBuilder.DropColumn(
                name: "Groupe",
                table: "EmploiDuTemps");

            migrationBuilder.DropColumn(
                name: "Jour",
                table: "EmploiDuTemps");

            migrationBuilder.DropColumn(
                name: "MentionId",
                table: "EmploiDuTemps");

            migrationBuilder.DropColumn(
                name: "Niveau",
                table: "EmploiDuTemps");

            migrationBuilder.DropColumn(
                name: "Note",
                table: "EmploiDuTemps");

            migrationBuilder.DropColumn(
                name: "ParcoursId",
                table: "EmploiDuTemps");

            migrationBuilder.AlterColumn<string>(
                name: "Initiales",
                table: "Enseignants",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CreatedAt = table.Column<DateTime>(type: "timestamp without time zone", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });
        }
    }
}
