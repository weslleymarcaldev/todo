<?php

namespace App\Http\Controllers\API;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    // Exibir tarefas de uma lista
    public function index(Request $request)
    {
        $request->validate([
            'list_id' => 'required|integer|exists:todo_lists,id'
        ]);

        $tasks = Task::where('to_do_list_id', $request->list_id)
                     ->orderBy('created_at', 'asc')
                     ->get();

        return response()->json($tasks);
    }

    // Criar uma nova tarefa
    public function store(Request $request)
    {
        $list = JWTAuth::parseToken()->authenticate()->todoLists()->find($request->list_id);

        $request->validate([
            'description' => 'required|string|max:255',
            'list_id' => 'required|integer|exists:todo_lists,id'
        ]);

        $task = Task::create([
            'description' => $request->description,
            'to_do_list_id' => $request->list_id,
            'completed' => false
        ]);

        return response()->json($task, 201);
    }

    // Alterar o status de uma tarefa
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $task->completed = !$task->completed;
        $task->save();

        return response()->json($task);
    }

    // Excluir uma tarefa
    public function destroy($id)
    {
        $task = Task::find($id);

        if (!$task) {
            return response()->json(['error' => 'Task not found'], 404);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
