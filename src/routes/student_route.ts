import express from 'express';
const router = express.Router();
import StudentController from '../controllers/student_controller';

router.get('/', StudentController.get.bind(StudentController));
router.get('/:id', StudentController.get.bind(StudentController));

router.post('/', StudentController.post.bind(StudentController));

router.put('/', StudentController.put.bind(StudentController));

router.delete('/', StudentController.delete.bind(StudentController));

export default router;
