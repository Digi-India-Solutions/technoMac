const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const adminRoute = require('./routes/Admin');
const bannerRoute = require('./routes/Banner');
const ContactRoute = require('./routes/Contact');
const faqRoute = require('./routes/Faq');
const { categoryRouter } = require('./routes/category');
const { parentCategoryRouter } = require('./routes/ParentCategory')
const { subCategoryRouter } = require('./routes/subCategory');
const { productRouter } = require('./routes/Product');
const warrantyRoute = require('./routes/Warrenty');
const certificateRoute = require('./routes/Certificate');
const catalogueRoute = require('./routes/Catalogue');
const catelogurDownloadRoute = require('./routes/CatalogueDownload');
const newUpdateRoutes = require('./routes/NewUpdate');
const subscriberRoute = require('./routes/Subscriber');
const testimonialRoute = require('./routes/Testimonial');
const clientRoute = require('./routes/Client');
const callBackRoute = require('./routes/CallBack');

const dns = require('dns');

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log(err);
  });
app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/admin', adminRoute);
app.use('/api/banner', bannerRoute);
app.use('/api/contact', ContactRoute);
app.use('/api/category', categoryRouter);
app.use('/api/parentCategory', parentCategoryRouter)
app.use('/api/sub-category', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/warranty', warrantyRoute);
app.use('/api/faq', faqRoute);
app.use('/api/certificate', certificateRoute);
app.use('/api/catalogue', catalogueRoute);
app.use('/api/catalogueDownload', catelogurDownloadRoute);
app.use('/api/newupdate', newUpdateRoutes);
app.use('/api/subscribe', subscriberRoute);
app.use('/api/testimonial', testimonialRoute);
app.use('/api/client', clientRoute);
app.use('/api/callback', callBackRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
