require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// 1. DB CONNECTION
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('SUCCESS: MongoDB Connected'))
  .catch((err) => console.error('CONNECTION ERROR:', err));

// =======================
// 2. USER MODEL
// =======================
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', UserSchema);

// =======================
// 3. JOB MODEL (TIED TO USER)
// =======================
const JobSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },

  description: { type: String, default: "" },
  location: { type: String, default: "" },
  salary: { type: String, default: "" },

  status: {
    type: String,
    enum: ["applied", "interview", "rejected", "offer"],
    default: "applied",
  },

  dateApplied: { type: Date, default: Date.now },

  stages: {
  type: Array,
  default: []
},


  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Job = mongoose.model("Job", JobSchema);

// =======================
// 4. JWT HELPER
// =======================
const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// =======================
// 5. AUTH ROUTES
// =======================

// SIGNUP
app.post('/auth/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'User already exists. Please login.' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password: hashedPassword });
    const token = generateToken(user);

    return res.status(201).json({
      message: 'User created successfully',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error('SIGNUP ERROR:', err);
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

// LOGIN
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password.' });

    const token = generateToken(user);

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error('LOGIN ERROR:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

// =======================
// 6. AUTH MIDDLEWARE
// =======================
const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
  } catch (err) {
    console.error('AUTH ERROR:', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// =======================
// 7. PROTECTED JOB ROUTES
// =======================

// GET ALL JOBS
app.get('/jobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.userId }).sort({ dateApplied: -1 });
    res.json(jobs);
  } catch (err) {
    console.error('GET /jobs error:', err);
    res.status(500).json({ message: 'Failed to fetch jobs' });
  }
});

// CREATE JOB
app.post('/jobs', auth, async (req, res) => {
  try {
    const { company, role, description, location, salary, status } = req.body;

    if (!company || !role)
      return res.status(400).json({ message: 'Company and role are required.' });

    const newJob = await Job.create({
      company,
      role,
      description,
      location,
      salary,
      status: status || "applied",
      user: req.userId,
    });

    res.status(201).json(newJob);
  } catch (err) {
    console.error('POST /jobs error:', err);
    res.status(500).json({ message: 'Failed to create job' });
  }
});

// UPDATE JOB
app.put('/jobs/:id', auth, async (req, res) => {
  try {
    const updatedJob = await Job.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!updatedJob)
      return res.status(404).json({ message: 'Job not found' });

    res.json(updatedJob);
  } catch (err) {
    console.error('PUT /jobs/:id error:', err);
    res.status(500).json({ message: 'Failed to update job' });
  }
});

// DELETE JOB
app.delete('/jobs/:id', auth, async (req, res) => {
  try {
    const deleted = await Job.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!deleted)
      return res.status(404).json({ message: 'Job not found' });

    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('DELETE /jobs/:id error:', err);
    res.status(500).json({ message: 'Failed to delete job' });
  }
});

// =======================
// 8. START SERVER
// =======================
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

