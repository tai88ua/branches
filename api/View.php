<?php

class View
{
    /**
     * @param array $data
     */
    public function view(array $data)
    {
        echo json_encode($data);
    }
}
