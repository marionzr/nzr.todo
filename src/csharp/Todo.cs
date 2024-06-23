using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Todo
{
    [Key]
    [Column("id", TypeName = "TEXT")]
    public Guid Id { get; set; }

    [Required]
    [Column("title", TypeName = "TEXT")]
    public required string Title { get; set; }

    [Column("description", TypeName = "TEXT")]
    public string Description { get; set; } = string.Empty;

    [Column("completed", TypeName = "BOOLEAN")]
    public bool Completed { get; set; }

    [Column("created_at", TypeName = "TIMESTAMP")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "TIMESTAMP")]
    public DateTime UpdatedAt { get; set; }
}
