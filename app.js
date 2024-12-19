const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const users = [];
const products = [];
const orders = [];
const isEmailUnique = (email) => !users.some((user) => user.email === email);
const findUserById = (id) => users.find((user) => user.id === id);
const findProductById = (id) => products.find((product) => product.id === id);

//POST register
app.post('/users/register', (req, res) => {
  const { username, email, password, is_admin = false } = req.body;

  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters' });
  }
  if (!email || !isEmailUnique(email)) {
    return res.status(400).json({ error: 'Email already exists or is invalid.' });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const newUser = { id: users.length + 1, username, email, is_admin, password }; 
  users.push(newUser);
  res.status(201).json({ user: { id: newUser.id, username, email, is_admin } });
});

// POST /users/login
app.post('/users/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = users.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  res.status(200).json({ message: 'Login successful!', user: { id: user.id, username: user.username, email: user.email, is_admin: user.is_admin } });
});

// GET /products
app.get('/products', (req, res) => {
    res.status(200).json({ products });
  }); 

// POST /products
app.post('/products', (req, res) => {
  const { name, description, price, category, image_url, is_active = true } = req.body;

  if (!name || name.length < 1) {
    return res.status(400).json({ error: 'Product name is required.' });
  }
  if (!price || price <= 0) {
    return res.status(400).json({ error: 'Product price must be greater than 0.' });
  }

  const newProduct = { id: products.length + 1, name, description, price, category, image_url, is_active };
  products.push(newProduct);
  res.status(201).json({ product: newProduct });
});



// POST /orders
app.post('/orders', (req, res) => {
  const { user_id, products: orderedProducts, total_price, status = 'PENDING' } = req.body;

  if (!user_id || !findUserById(user_id)) {
    return res.status(400).json({ error: 'Invalid user ID.' });
  }

  if (!orderedProducts || !Array.isArray(orderedProducts) || orderedProducts.length === 0) {
    return res.status(400).json({ error: 'Products must be a non-empty array.' });
  }

  for (const item of orderedProducts) {
    const product = findProductById(item.product_id);
    if (!product || item.quantity <= 0) {
      return res.status(400).json({ error: `Invalid product ID or quantity for product ID ${item.product_id}.` });
    }
  }

  if (!total_price || total_price <= 0) {
    return res.status(400).json({ error: 'Total price must be greater than 0.' });
  }

  const newOrder = { id: orders.length + 1, user_id, products: orderedProducts, total_price, status };
  orders.push(newOrder);
  res.status(201).json({ order: newOrder });
});

// GET /orders
app.get('/orders', (req, res) => {
  res.status(200).json({ orders });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
