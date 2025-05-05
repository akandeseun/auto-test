const express = require('express');
const multer = require('multer');
const { executeTest } = require('../controllers/testController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/run', upload.single('collection'), executeTest);

module.exports = router;
