require('dotenv').config();
const sm = require('sitemap');
const fs = require('fs');
const path = require('path');

const parentDir = path.join(__dirname, '../..');
const hostname = process.env.SITE_URL;

const sitemap = new sm.SitemapStream({ hostname });

const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },

];

links.forEach(link => sitemap.write(link));
sitemap.end();

sm.streamToPromise(sitemap).then(data => {
    fs.createWriteStream(path.join(parentDir, 'public', 'sitemap.xml')).write(data);
});
