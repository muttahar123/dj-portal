const express = require('express');
const { createUser, updateUser, createClass, getAllUsers } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('ADMIN'));

router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:id')
    .put(updateUser);

router.route('/classes')
    .post(createClass);

module.exports = router;
