var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
const pdfController = require('../controller/pdf');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization'); // 从请求头获取token（例如: "Bearer your_token"）
    if (!token) return res.sendStatus(401); // 无token返回401状态码
  
    jwt.verify(token.replace('Bearer ', ''), 'secret', (err, user) => { // 验证token
        if (err) return res.sendStatus(403); // token无效返回403状态码
        req.user = user; // 将解码后的用户信息附加到请求对象上，供后续中间件或路由使用
        next(); // 继续执行后续的路由处理函数
    });
};

router.post('/get-files',authenticateToken, pdfController.getFiles);
router.post('/save-files',authenticateToken, pdfController.saveFiles);
router.post('/save-files/pdf',authenticateToken, pdfController.saveFilesByPdf);

router.post('/login', function(req, res, next) {
  const { name, password } = req.body;
  if (name === 'admin' && password === '123456') {
    const token = jwt.sign({ name }, 'secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

module.exports = router;