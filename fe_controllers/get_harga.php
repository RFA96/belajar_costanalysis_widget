<?php
    $connDB = new PDO('pgsql:host=localhost;dbname=cost_analysis_widget', 'postgres', 'sahabat45');

    $item = $_GET['item'];

    if($item == 'valve') {
        $sqlGetAllValvePrice = $connDB->query("SELECT valve_50k.valve_type, valve_50k.price FROM public.valve_50k ORDER BY valve_50k.valve_id");
        $rowGetAllValvePrice = $sqlGetAllValvePrice->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "message" => "Valve price are listed here!", "valve_price" => $rowGetAllValvePrice], JSON_PRETTY_PRINT);
    } else {
        $sqlGetAllPipePrice = $connDB->query("SELECT pipe_50k.pipe_size_inch, pipe_50k.price FROM public.pipe_50k ORDER BY pipe_50k.pipe_id");
        $rowGetAllPipePrice = $sqlGetAllPipePrice->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(["status" => "success", "message" => "Pipe price are listed here!", "pipe_price" => $rowGetAllPipePrice], JSON_PRETTY_PRINT);
    }
