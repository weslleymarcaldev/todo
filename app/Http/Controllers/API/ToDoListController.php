<?php

namespace App\Http\Controllers\API;

use App\Models\TodoList;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class TodoListController extends Controller
{
    #region Index
    // Exibir todas as listas do usuário
    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $lists = TodoList::where('user_id', $user->id)
                         ->orderBy('created_at', 'asc')
                         ->get();

        return response()->json($lists);
    }
    #endregion Index

    #region Store
    // Criar uma nova lista
    public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $list = $user->todoLists()->create([
            'title' => $request->title,
        ]);

        return response()->json($list, 201);
    }
    #endregion Store
}
