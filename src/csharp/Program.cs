using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Configure SQLite with Entity Framework Core
builder.Services.AddDbContext<TodoDbContext>(options =>
    options.UseSqlite("Data Source=../../todos.db"));

var app = builder.Build();

app.UseHttpsRedirection();

// Create database and tables
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<TodoDbContext>();
    db.Database.EnsureCreated();
}

// API routes

// Get all todos
app.MapGet("/todos", async (TodoDbContext db, bool? completed) =>
{
    if (completed.HasValue)
    {
        return await db.Todos
            .Where(t => t.Completed == completed.Value)
            .ToListAsync();
    }

    return await db.Todos.ToListAsync();
});

// Get todo by id
app.MapGet("/todos/{id}", async Task<Results<Ok<Todo>, NotFound>> (Guid id, TodoDbContext db) =>
{
    return await db.Todos.FindAsync(id)
        is Todo todo
            ? TypedResults.Ok(todo)
            : TypedResults.NotFound();
});

// Create a new todo
app.MapPost("/todos", async (TodoDbContext db, TodoCreateDto todoDto) =>
{
    // Validate todo
    if (string.IsNullOrWhiteSpace(todoDto.Title))
    {
        return Results.BadRequest(new { error = "Title is required" });
    }

    var todo = new Todo
    {
        Id = Guid.NewGuid(),
        Title = todoDto.Title,
        Description = todoDto.Description ?? string.Empty,
        Completed = todoDto.Completed,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow
    };

    db.Todos.Add(todo);
    await db.SaveChangesAsync();

    return Results.Created($"/todos/{todo.Id}", todo);
});

// Update a todo
app.MapPut("/todos/{id}", async (Guid id, TodoUpdateDto todoDto, TodoDbContext db) =>
{
    var todo = await db.Todos.FindAsync(id);

    if (todo is null)
    {
        return Results.NotFound(new { error = "Todo not found" });
    }

    // Validate title if provided
    if (todoDto.Title != null && string.IsNullOrWhiteSpace(todoDto.Title))
    {
        return Results.BadRequest(new { error = "Title cannot be empty" });
    }

    // Update only provided fields
    if (todoDto.Title != null) {
        todo.Title = todoDto.Title;
    }

    if (todoDto.Description != null) {
        todo.Description = todoDto.Description;
    }

    if (todoDto.Completed != null) {
        todo.Completed = todoDto.Completed.Value;
    }

    todo.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();

    return Results.Ok(todo);
});

// Delete a todo
app.MapDelete("/todos/{id}", async (Guid id, TodoDbContext db) =>
{
    var todo = await db.Todos.FindAsync(id);

    if (todo is null)
    {
        return Results.NotFound(new { error = "Todo not found" });
    }

    db.Todos.Remove(todo);
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Todo deleted successfully" });
});

await app.RunAsync();

// DTOs
public record TodoCreateDto(string Title, string? Description = null, bool Completed = false);
public record TodoUpdateDto(string? Title = null, string? Description = null, bool? Completed = null);
