const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(bodyParser.json());


// Use middleware
app.use(express.json());

// Use user routes
app.use('/api/user', userRoutes);
app.get('/', (req, res) => {

    const message = '<h1>Hii, All of you Welcome!</h1>';

    // Send the message as a response
    res.send(message);
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://parthasarathi:sarathi31@cluster0.przcikx.mongodb.net/passwordreset', )
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('Error connecting to MongoDB:', err));