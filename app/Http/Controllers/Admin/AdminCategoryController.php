<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class AdminCategoryController extends Controller
{
    public function index()
    {
        $categories = Category::with('parent')->get()->map(fn($cat) => [
            'id' => $cat->id,
            'name' => $cat->name,
            'img' => $cat->img,
            'parent_id' => $cat->parent_id,
            'parent_name' => $cat->parent?->name,
            'created_at' => $cat->created_at->format('d.m.Y H:i'),
        ]);
        $parents = Category::whereNull('parent_id')->get(['id', 'name']);

        return Inertia::render('Admin/Categories/index', [
            'categories' => $categories,
            'parents' => $parents,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'img' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'parent_id');
        if ($request->hasFile('img')) {
            $path = 'storage/'.$request->file('img')->store('categories', 'public');
            $data['img'] = $path;
        }

        Category::create($data);
        return redirect()->route('admin.categories.index')->with('success', 'Категория создана');
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id',
            'img' => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'parent_id');
        if ($request->hasFile('img')) {
            if ($category->img) {
                Storage::disk('public')->delete($category->img);
            }
            $path = $request->file('img')->store('categories', 'public');
            $data['img'] = 'storage/'.$path;
        }

        $category->update($data);
        return redirect()->route('admin.categories.index')->with('success', 'Категория обновлена');
    }

    public function destroy(Category $category)
    {
        if ($category->children()->exists() || $category->products()->exists()) {
            return back()->with('error', 'Нельзя удалить категорию, у которой есть подкатегории или товары');
        }
        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Категория удалена');
    }
}
