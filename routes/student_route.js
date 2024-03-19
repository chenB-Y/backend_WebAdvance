const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/student_controller');

router.get('/', StudentController.getStudent);
router.get('/:id', StudentController.getStudent);

router.post('/', StudentController.postStudent);

router.put('/', StudentController.putStudent);

router.delete('/', StudentController.deleteStudent);

module.exports = router;
