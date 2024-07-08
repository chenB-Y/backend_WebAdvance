import express from 'express';
const router = express.Router();
import GroupController from '../controllers/group_controller';

router.get('/getGroup/:id', GroupController.getGroupById);

router.post('/createGroup', GroupController.createGroup);

router.put('/updateGroup/:id', GroupController.updateGroup);

router.delete('/deleteGroup/:id', GroupController.deleteGroup);

export default router;