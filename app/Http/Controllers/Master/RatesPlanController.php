<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Carbon;

use App\Models\Room\Type;

class RatesPlanController extends Controller
{
    public function index()
    {
        $setting = $this->setting();
        //menu code
        $menu = $this->menu();

        return view('master_data.rates_plan.index', get_defined_vars());
    }

    public function create()
    {
        $setting = $this->setting();
        //menu code
        $menu = $this->menu();
        $rooms = Type::orderBy('room_order', 'ASC')->get();

        return view('master_data.rates_plan.create', get_defined_vars());
    }

}
