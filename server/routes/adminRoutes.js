import express from 'express';
import { createUser, updateUser, createClass, getAllUsers, getAllClasses } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser);

router.route('/classes')
    .get(getAllClasses)
    .post(createClass);

export default router;

