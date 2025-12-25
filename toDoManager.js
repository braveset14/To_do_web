const API_URL='http://localhost:3000/todos';

export const todoManager={
    async getTodos(){
        const res=await fetch(API_URL);
        return res.json();
    },
    async getTodo(id){
        const res=await fetch(`${API_URL}/${id}`);
        return res.json();
    },
    async addTodo(data){
        const res=await fetch(API_URL,{
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body:JSON.stringify({
                ...data,completed:false
            })
        });
        return res.json();
    },

    async toggleTodo(id,completed){
        await fetch(`${API_URL}/${id}`,{
            method:'PATCH',
            headers:{'Content-Type': 'application/json' },
            body: JSON.stringify(completed)
        });
    },
    async updateTodo(id,updates){
        await fetch(`${API_URL}/${id}`,{
            method:'PATCH',
            headers:{'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
    },

    async deleteTodo(id){
        await fetch(`${API_URL}/${id}`,{
            method:'DELETE'
        });
    }
};