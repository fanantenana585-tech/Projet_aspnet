using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BackendApi.Migrations
{
    /// <inheritdoc />
    public partial class AddParcoursResponsableEnseignantColumnFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResponsableEnseignantId",
                table: "Parcours",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Parcours_ResponsableEnseignantId",
                table: "Parcours",
                column: "ResponsableEnseignantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Parcours_Enseignants_ResponsableEnseignantId",
                table: "Parcours",
                column: "ResponsableEnseignantId",
                principalTable: "Enseignants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Parcours_Enseignants_ResponsableEnseignantId",
                table: "Parcours");

            migrationBuilder.DropIndex(
                name: "IX_Parcours_ResponsableEnseignantId",
                table: "Parcours");

            migrationBuilder.DropColumn(
                name: "ResponsableEnseignantId",
                table: "Parcours");
        }
    }
}
