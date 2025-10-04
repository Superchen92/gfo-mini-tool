var express = require('express');
var router = express.Router();
const pdfController = require('../controller/pdf');

router.get('/get-files', pdfController.getFiles);
router.post('/save-files', pdfController.saveFiles);

module.exports = router;