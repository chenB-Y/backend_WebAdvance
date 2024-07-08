import express from 'express';
const router = express.Router();
import GroupController from '../controllers/group_controller';
// implementation of the group route
router.get('/getGroup/:name', GroupController.getGroupByName);

router.post('/createGroup', GroupController.createGroup);

router.put('/updateGroup/:name', GroupController.updateGroup);

router.delete('/deleteGroup/:id', GroupController.deleteGroup);

export default router;
