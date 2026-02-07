import express from 'express';
import { createUser, updateUser, deleteUser, createClass, updateClass, deleteClass, getAllUsers, getAllClasses } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser)
    .delete(deleteUser);

router.route('/classes')
    .get(getAllClasses)
    .post(createClass);

router.route('/classes/:id')
    .put(updateClass)
    .delete(deleteClass);

export default router;


