var express = require('express');
var router = express.Router();
const pdfController = require('../controller/pdf');

router.post('/get-files', pdfController.getFiles);
router.post('/save-files', pdfController.saveFiles);
router.post('/save-files/pdf', pdfController.saveFilesByPdf);

module.exports = router;