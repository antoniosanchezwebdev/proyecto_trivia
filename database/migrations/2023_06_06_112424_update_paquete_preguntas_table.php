<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('paquete_preguntas', function ($table) {
            $table->string('photo_url')->afterColumn('categoria');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('paquete_preguntas', function ($table) {
            $table->dropColumn('photo_url');
        });
    }
};