<?php

namespace Controller;

use PDO;
use Repository\Branch;
use View;

class Main
{
    /** @var PDO */
    protected $pdo;

    /** @var View */
    protected $view;

    /**
     * @param PDO $pdo
     * @param View $view
     */
    public function __construct(PDO $pdo, View $view)
    {
        $this->pdo = $pdo;
        $this->view = $view;
    }

    /**
     * @return void
     */
    public function get(): void
    {
        $parentId = filter_input(INPUT_GET, 'parent_id');
        $branch = new Branch($this->pdo);
        $this->view->view(['items' => $branch->findByParent($parentId)]);
    }

    /**
     * @return void
     */
    public function add(): void
    {
        $parentId = filter_input(INPUT_POST, 'parent_id');
        $name = filter_input(INPUT_POST, 'name');
        $branch = new Branch($this->pdo);
        $this->view->view(['success' => $branch->add($parentId, $name)]);
    }

    /**
     * @return void
     */
    public function delete(): void
    {
        $id = filter_input(INPUT_POST, 'id');
        $branch = new Branch($this->pdo);
        $this->view->view(['success' => $branch->deleteById($id)]);
    }

    /**
     * @return void
     */
    public function update(): void
    {
        $id = filter_input(INPUT_POST, 'id');
        $name = filter_input(INPUT_POST, 'name');
        $branch = new Branch($this->pdo);
        $this->view->view(['success' => $branch->update($id, $name)]);
    }
}
