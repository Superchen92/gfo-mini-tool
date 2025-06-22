const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// GET /file?url=filename
app.get('/api/file', (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'Missing url parameter' });
    }

    // 防止路径穿越攻击
    const baseDir = '/home/GoFindOrient/wwwroot/';
    const safePath = path.normalize(url).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(baseDir, safePath);

    // 确保文件在指定目录下
    if (!filePath.startsWith(baseDir)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.type('text').send(data);
    });
});

// 生成HTML文件的API
app.post('/api/generate-html', express.json(), (req, res) => {
    const { filename, content } = req.body;
    if (!filename || !content) {
        return res.status(400).json({ error: 'Missing filename or content' });
    }

    // 只允许.html后缀，防止路径穿越
    const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9_\-\.]/g, '');
    if (!safeFilename.endsWith('.html')) {
        return res.status(400).json({ error: 'Filename must end with .html' });
    }

    const filePath = path.join(__dirname, safeFilename);

    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to write file' });
        }
        res.json({ message: 'HTML file generated successfully', file: safeFilename });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});