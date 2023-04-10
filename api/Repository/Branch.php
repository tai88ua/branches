<?php

namespace Repository;

use PDO;
use Model\Bbanch as ModelBbanch;

class Branch
{
    /** @var PDO */
    protected $pdo;

    /**
     * @param PDO $pdo
     */
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /**
     * @param int $parentId
     * @return array
     */
    public function findByParent(int $parentId): array
    {
        $sth = $this->pdo->prepare(
            'SELECT `id`, `parent_id`, `name`, (
                        SELECT `id` FROM `branches` WHERE `parent_id` = `b`.`id` LIMIT 1
                        ) as `child`  
                    FROM `branches` AS `b` 
                    WHERE `parent_id` = :parent_id'
        );
        $sth->execute(['parent_id' => $parentId]);
        $items = $sth->fetchAll(PDO::FETCH_ASSOC);

        $branches = [];
        foreach ($items as $item) {
            $modelBranch = new ModelBbanch();
            $modelBranch->setId($item['id']);
            $modelBranch->setParentId($item['parent_id']);
            $modelBranch->setName($item['name']);
            $modelBranch->setHasChild((bool)$item['child']);
            $branches[] = $modelBranch;
        }

        return $branches;
    }

    /**
     * @param int $parentId
     * @param string $name
     * @return bool
     */
    public function add(int $parentId, string $name): bool
    {
        $sth = $this->pdo->prepare(
            'INSERT INTO `branches` (`parent_id`, `name`) VALUES (:parent_id, :name);'
        );
        return $sth->execute(['parent_id' => $parentId, 'name' => $name]);
    }

    /**
     * @param $id
     * @param $name
     * @return bool
     */
    public function update($id, $name): bool
    {
        $sth = $this->pdo->prepare('UPDATE `branches` SET `name` = :name WHERE `id` = :id');
        return $sth->execute(['id' => $id, 'name' => $name]);
    }

    /**
     * @param $id
     * @return bool
     */
    public function deleteById($id): bool
    {
        $sth = $this->pdo->prepare(
            'DELETE FROM `branches` WHERE `id` = :id OR parent_id = :id;'
        );
        return $sth->execute(['id' => $id]);
    }
}
