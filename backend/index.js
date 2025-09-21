require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');  
const sequelize = require('./config/db');
require('./config/passport')(passport);  

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.send('DevDash API is running!');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});