const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const adminRoute = require('./routes/admin');
const bannerRoute = require('./routes/banner');
const ContactRoute = require('./routes/Contact');
const faqRoute = require('./routes/faq');
const {
  categoryRouter,
} = require('./routes/category');
const {
  subCategoryRouter,
} = require('./routes/subCategory');
const {
  productRouter,
} = require('./routes/Product');
const warrantyRoute = require('./routes/Warrenty');



const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4",]);

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

app.use('/api/admin', adminRoute);
app.use('/api/banner', bannerRoute);
app.use('/api/contact', ContactRoute);
app.use('/api/category', categoryRouter);
app.use('/api/sub-category', subCategoryRouter);
app.use('/api/product', productRouter);
app.use('/api/warranty', warrantyRoute);
app.use('/api/faq', faqRoute);
 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
