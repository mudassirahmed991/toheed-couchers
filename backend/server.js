const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// --- CLOUDINARY CONFIG (Images Cloud par save hongi) ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'toheed_couture_products', // Cloudinary folder name
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage });

// --- UPLOAD ROUTE ---
app.post('/api/upload', upload.array('images', 10), (req, res) => {
  // Cloudinary returns the URL in 'path'
  const imagePaths = req.files.map(file => file.path);
  res.send(imagePaths);
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// --- MODELS ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number, default: 0 },
  isOnSale: { type: Boolean, default: false },
  saleEndDate: { type: Date },
  description: { type: String },
  images: [{ type: String }],
  colors: [{ type: String }],
  stock: { type: Number, default: 0 },
}, { timestamps: true });
const Product = mongoose.model('Product', productSchema);

const orderSchema = new mongoose.Schema({
  customerDetails: { name: String, email: String, address: String, phone: String },
  orderItems: [],
  totalPrice: Number,
  status: { type: String, default: 'Pending' },
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

const settingSchema = new mongoose.Schema({
  websiteName: { type: String, default: "Toheed'sCouchers" },
  logo: { type: String, default: "" }, 
  contactEmail: { type: String, default: 'info@empowerher.com.pk' },
  contactPhone: { type: String, default: '+923459119770' },
  address: { type: String, default: 'Multan Road, Lahore' },
  whatsapp: { type: String, default: '923459119770' },
  aboutUsText: { type: String, default: 'Our mission is to empower...' },
  banners: [{ type: String }],      
  lowerBanners: [{ type: String }],
  quickLinks: [{ title: String, url: String }]
});
const Setting = mongoose.model('Setting', settingSchema);

// --- MIDDLEWARE ---
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) { res.status(401).json({ message: 'Not authorized' }); }
  } else { res.status(401).json({ message: 'No token' }); }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) next();
  else res.status(401).json({ message: 'Not authorized as admin' });
};

// --- ROUTES ---
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    });
  } else { res.status(401).json({ message: 'Invalid credentials' }); }
});

app.get('/api/users/seed', async (req, res) => {
  const adminExists = await User.findOne({ email: 'admin@example.com' });
  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    await User.create({ name: 'Admin', email: 'admin@example.com', password: hashedPassword, isAdmin: true });
    res.send('Admin created');
  } else { res.send('Admin already exists'); }
});

app.get('/api/products', async (req, res) => res.json(await Product.find({})));
app.get('/api/products/:id', async (req, res) => res.json(await Product.findById(req.params.id)));
app.post('/api/products', protect, admin, async (req, res) => res.status(201).json(await Product.create(req.body)));

app.put('/api/products/:id', protect, admin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    Object.assign(product, req.body);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else { res.status(404).json({ message: 'Product not found' }); }
});

app.delete('/api/products/:id', protect, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product removed' });
});

app.post('/api/orders', async (req, res) => res.status(201).json(await Order.create(req.body)));
app.get('/api/orders', protect, admin, async (req, res) => res.json(await Order.find({}).sort({ createdAt: -1 })));
app.put('/api/orders/:id/status', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) { order.status = req.body.status; await order.save(); res.json(order); }
});

app.get('/api/settings', async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) settings = await Setting.create({});
  res.json(settings);
});

app.put('/api/settings', protect, admin, async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) settings = new Setting({});
  Object.assign(settings, req.body);
  const updatedSettings = await settings.save();
  res.json(updatedSettings);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));