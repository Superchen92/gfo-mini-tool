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
  const template = request.filename.includes('confirm') ? 'confirm' : 'quotation'
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
  const pageHtml = new Promise((resolve, reject) => {
    res.render(template, { ...request }, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    })
  })
  const pdfHtml = new Promise((resolve, reject) => {
    res.render(template + '-pdf', { ...request }, (err, html) => {
      if (err) {
        return reject(err);
      }
      resolve(html);
    })
  })
  Promise.all([pageHtml,pdfHtml])
    .then(([pageHtml, pdfHtml]) => {
      if(pageHtml) {
        fs.writeFileSync(path.join(baseDir, request.filename), pageHtml, 'utf8')
        fs.writeFileSync(path.join(baseDir, request.filename).replace('Itinerary', 'pdf'), pdfHtml, 'utf8')
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
  
  //common
  const h1 = root.querySelector('.welcome-text h1').textContent
  const title = root.querySelector('title').textContent
  const accordion = root.querySelector('#accordion') ? root.querySelector('#accordion').toString() : ''
  const bannerImg = root.querySelector('#banner-img') ? root.querySelector('#banner-img').toString() : ''
  const bannerSrc = root.querySelector('#banner-img') ? root.querySelector('#banner-img').attributes['data-src'] || root.querySelector('#banner-img').attributes['src'] : ''
  const cancellationPolicy = root.querySelector('#cancellationPolicy') ? root.querySelector('#cancellationPolicy').toString() : ''
  const priceIncludes = root.querySelector('#priceIncludes') ? root.querySelector('#priceIncludes').toString() : ''
  const priceExcludes = root.querySelector('#priceExcludes') ? root.querySelector('#priceExcludes').toString() : ''
  const sideBar = root.querySelector('#sideBar') ? root.querySelector('#sideBar').toString() : ''
  const payment = root.querySelector('#payment') ? root.querySelector('#payment').toString() : ''
  const paypalScript = root.querySelectorAll('script')[root.querySelectorAll('script').length - 1].toString()

  //confirm
  const confirmationNumber = root.querySelector('#confirmationNumber') ? root.querySelector('#confirmationNumber').toString() : ''
  const contactInfo = root.querySelector('#contactInfo') ? root.querySelector('#contactInfo').toString() : ''
  const transportation = root.querySelector('#transportation') ? root.querySelector('#transportation').toString() : ''
  const groupMember = root.querySelector('#groupMember') ? root.querySelector('#groupMember').toString() : ''
  const accommodation = root.querySelector('#accommodation') ? root.querySelector('#accommodation').toString() : ''

  //quotation
  const detailUl = root.querySelector('.detail-ul') ? root.querySelector('.detail-ul').toString() : ''
  const overNight = root.querySelector('#overNight') ? root.querySelector('#overNight').toString() : ''
  const pricePayment = root.querySelector('#pricePayment') ? root.querySelector('#pricePayment').toString() : ''
  const noteForPrice = root.querySelector('#noteForPrice') ? root.querySelector('#noteForPrice').toString() : ''

  return {
    //common
    h1,
    title,
    accordion,
    bannerImg,
    bannerSrc,
    cancellationPolicy,
    priceIncludes,
    priceExcludes,
    sideBar,
    payment,
    paypalScript,
    //confirm
    confirmationNumber,
    contactInfo,
    transportation,
    groupMember,
    accommodation,
    //quotation
    detailUl,
    overNight,
    pricePayment,
    noteForPrice,
  }
}
