<?php

namespace App\Http\Controllers\API;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class TaskController extends Controller
{
    #region Index
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
    #endregion Index

    #region Store
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
    #endregion Store

    #region Update
    // Atualizar uma tarefa (descrição e/ou status)
    public function update(Request $request, $id)
    {
        $task = Task::find($id);

    if (!$task) {
        return response()->json(['error' => 'Task not found'], 404);
    }

    $request->validate([
        'description' => 'nullable|string|max:255',
        'completed' => 'nullable|boolean',
    ]);

    if ($request->has('description')) {
        $task->description = $request->description;
    }

    if ($request->has('completed')) {
        $task->completed = $request->completed;
    }

    $task->save();

    return response()->json($task);
}
#endregion Update

    #region Destroy
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
    #endregion Destroy
}
