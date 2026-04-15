<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Product_image;
use App\Models\Product_attribute_value;
use App\Models\Attribute;
use App\Models\Attribute_value;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminProductController extends Controller
{
    public function index()
    {
        $products = Product::with('images', 'category')->orderBy('id', 'desc')->get()->map(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'price' => $p->price,
            'stock' => $p->stock,
            'status' => $p->status,
            'category_name' => $p->category->name ?? null,
            'image' => $p->images->first()?->image_url,
        ]);
        return Inertia::render('Admin/Products/index', ['products' => $products]);
    }

    public function create()
    {
        $categories = Category::with('parent')->get()->map(fn($c) => [
            'id' => $c->id,
            'name' => $c->parent ? $c->parent->name . ' → ' . $c->name : $c->name,
        ]);
        $attributes = Attribute::all();
        return Inertia::render('Admin/Products/create', [
            'categories' => $categories,
            'attributes' => $attributes,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|in:active,inactive',
            'category_id' => 'required|exists:categories,id',
            'images' => 'array',
            'images.*' => 'image|max:2048',
            'attribute_values' => 'nullable',
        ]);

        DB::beginTransaction();
        try {
            $product = Product::create($request->only('name', 'description', 'price', 'stock', 'status', 'category_id'));

            // Загрузка изображений
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $path = 'storage/'.$file->store('products', 'public');
                    Product_image::create([
                        'product_id' => $product->id,
                        'image_url' => $path,
                        'sort_order' => 0,
                    ]);
                }
            }

            // Сохранение атрибутов
            if ($request->filled('attribute_values')) {
                $attrs = $request->input('attribute_values');
                // Если пришла строка JSON, декодируем. Если массив — оставляем как есть
                if (is_string($attrs)) {
                    $attrs = json_decode($attrs, true);
                }
                if (is_array($attrs)) {
                    foreach ($attrs as $attrId => $value) {
                        $value = trim($value);
                        if (!empty($value)) {
                            $attrValue = Attribute_value::firstOrCreate([
                                'attribute_id' => $attrId,
                                'value' => $value,
                            ]);
                            Product_attribute_value::create([
                                'product_id' => $product->id,
                                'attribute_value_id' => $attrValue->id,
                            ]);
                        }
                    }
                }
            }

            DB::commit();
            return redirect()->route('admin.products.index')->with('flash', ['success' => 'Товар создан']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Ошибка создания товара: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->with('error', 'Ошибка: ' . $e->getMessage())->withInput();
        }
    }


    public function edit(Product $product)
    {
        $product->load('images', 'product_attribute_values.attribute_value.attribute');
        $categories = Category::with('parent')->get()->map(fn($c) => [
            'id' => $c->id,
            'name' => $c->parent ? $c->parent->name . ' → ' . $c->name : $c->name,
        ]);
        $attributes = Attribute::all();
        $productAttributes = [];
        foreach ($product->product_attribute_values as $pav) {
            if ($pav->attribute_value && $pav->attribute_value->attribute) {
                $productAttributes[$pav->attribute_value->attribute->id] = $pav->attribute_value->value;
            }
        }

        return Inertia::render('Admin/Products/edit', [
            'product' => $product,
            'categories' => $categories,
            'attributes' => $attributes,
            'productAttributes' => $productAttributes,
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'status' => 'required|in:active,inactive',
            'category_id' => 'required|exists:categories,id',
            'attribute_values' => 'nullable|string',
        ]);

        $product->update($request->only('name', 'description', 'price', 'stock', 'status', 'category_id'));

        // Обновление атрибутов
        Product_attribute_value::where('product_id', $product->id)->delete();
        if ($request->filled('attribute_values')) {
            $attrs = json_decode($request->attribute_values, true);
            if (is_array($attrs)) {
                foreach ($attrs as $attrId => $value) {
                    if (!empty($value)) {
                        $attrValue = Attribute_value::firstOrCreate([
                            'attribute_id' => $attrId,
                            'value' => $value,
                        ]);
                        Product_attribute_value::create([
                            'product_id' => $product->id,
                            'attribute_value_id' => $attrValue->id,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('admin.products.index')->with('success', 'Товар обновлён');
    }

    public function destroy(Product $product)
    {
        foreach ($product->images as $image) {
            Storage::disk('public')->delete($image->image_url);
        }
        $product->delete();
        return redirect()->route('admin.products.index')->with('success', 'Товар удалён');
    }

    public function uploadImage(Request $request, Product $product)
    {
        $request->validate(['image' => 'required|image|max:2048']);
        $path = 'storage/'.$request->file('image')->store('products', 'public');
        $product->images()->create(['image_url' => $path, 'sort_order' => $product->images()->count()]);
        return back()->with('success', 'Изображение добавлено');
    }

    public function deleteImage(Product_image $image)
    {
        Storage::disk('public')->delete($image->image_url);
        $image->delete();
        return back()->with('success', 'Изображение удалено');
    }
}
