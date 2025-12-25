export function Todo(title,description='',category='',duedate='',completed=false){
    this.title = title;
    this.description = description;
    this.category = category;
    this.dueDate = dueDate;
    this.completed = completed;
}