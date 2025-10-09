const path = require('path');
const fs = require('fs');
const axios = require('axios');
const parse = require('node-html-parser').parse;
const baseDir = '/home/GoFindOrient/wwwroot/'; //linux
// const baseDir = 'F:/home/GoFindOrient/wwwroot/'; //windows

exports.getFiles = function getFiles(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  if(req.query.url == '') {
    return res.status(400).json({ error: 'Missing url parameter' });
  } else {
    const html = getFileByUrl(req.query.url)
    const parseHtmlData = parseHtml(html)
    res.json(parseHtmlData);
  }
}

exports.saveFiles = async function saveFiles(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  const request = req.body
  if (!request.filename) {
      return res.status(400).json({ error: 'Missing filename' });
  }
  const accordionRoot = parse(request.accordion)
  accordionRoot.querySelectorAll('.link-modal-list').forEach(div => {
    div.remove()
  })
  accordionRoot.querySelectorAll('img').forEach(img => {
    img.remove()
  })
  request.accordionNoImg = accordionRoot.toString()
  const bannerBase64 = await axios.get(request.bannerSrc, { responseType: 'arraybuffer' })
    .then(response => Buffer.from(response.data, 'binary').toString('base64'))
  request.banner = `<img src="data:image/png;base64,${bannerBase64}" alt="banner" class="img-height" />`
  const quotationHtml = new Promise((resolve, reject) => {
    res.render('quotation', { ...request }, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    })
  })
  const quotationPdfHtml = new Promise((resolve, reject) => {
    res.render('quotation-pdf', { ...request }, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    })
  })
  // const confirmPdfHtml = new Promise((resolve, reject) => {
  //   res.render('confirm-pdf', { ...request }, (err, html) => {
  //     if (err) {
  //       return reject(err);
  //     }
  //     resolve(html);
  //   })
  // })
  Promise.all([quotationHtml,quotationPdfHtml])
    .then(([quotationHtml, quotationPdfHtml]) => {
      if(quotationHtml) {
        fs.writeFileSync(path.join(baseDir, request.filename), quotationHtml, 'utf8')
        fs.writeFileSync(path.join(baseDir, request.filename).replace('Itinerary', 'pdf'), quotationPdfHtml, 'utf8')
      }
      const safeFilename = path.basename(request.filename).replace(/[^a-zA-Z0-9_\-\.]/g, '');
      res.json({ message: 'HTML file generated successfully', file: safeFilename });
    })
    .catch(err => {
      res.status(500).json({ err });
    })
}

const getFileByUrl = (url) => {
    const safePath = path.normalize(url).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(baseDir, safePath);
    const data = fs.readFileSync(filePath, 'utf8')
    return data
}

const parseHtml = (html) => {
  const root = parse(html)
  const h1 = root.querySelector('.welcome-text h1').textContent
  const bannerImg = root.querySelector('#overNight') ? root.querySelector('#banner-img').toString() : ''
  const bannerSrc = root.querySelector('#banner-img').attributes['data-src'] || root.querySelector('#banner-img').attributes['src']
  const detailUl = root.querySelector('.detail-ul').toString()
  const title = root.querySelector('title').textContent
  const accordion = root.querySelector('#accordion').toString()
  const overNight = root.querySelector('#overNight') ? root.querySelector('#overNight').textContent : ''
  const pricePayment = root.querySelector('#pricePayment').toString()
  const noteForPrice = root.querySelector('#noteForPrice') ? root.querySelector('#noteForPrice').toString() : ''
  const priceIncludes = root.querySelector('#priceIncludes').toString()
  const priceExcludes = root.querySelector('#priceExcludes')?.toString()
  const cancellationPolicy = root.querySelector('#cancellationPolicy').toString()
  const quotationSideBar = root.querySelector('.quotation-sidebar').toString()
  const tourPrice = root.querySelector('#tourPrice').toString()
  const service = root.querySelector('.customer-service-card').toString()
  const paypalScript = root.querySelectorAll('script')[root.querySelectorAll('script').length - 1].toString()
  const paypalBtn = root.querySelector('#paypalBtn') ? root.querySelector('#paypalBtn').toString() : ''

  return {
    h1,
    title,
    bannerImg,
    bannerSrc,
    detailUl,
    accordion,
    overNight,
    pricePayment,
    noteForPrice,
    priceIncludes,
    priceExcludes,
    tourPrice,
    service,
    quotationSideBar,
    cancellationPolicy,
    paypalScript,
    paypalBtn
  }
}
