const { createTask, fetchAllTask ,updateTaskById,deleteTaskById} = require('../Controllers/TaskController');

const router = require('express').Router();


// to get all the task
router.get('/',fetchAllTask);

 //to creact a task 
 router.post ('/',createTask);

 //to update a task 
router.put ('/:id',updateTaskById);

 //to delete a task
 router.delete('/:id',deleteTaskById);



 module.exports = router;
