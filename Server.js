/** @format */

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const PORT = 3000;

const { MONGODB_URI } = require('./config');

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', () => {
	// console.log('Connected');
});

mongoose.connection.on('error', (error) => {
	console.log('Some error occurred', error);
});

// const customMiddleware = (req, res, next) => {
//     console.log("customerMiddleware");
//     next();
// }

require('./models/user_model');
require('./models/post_model');

app.use(express.json());
app.use(require('./routes/authentication'));
app.use(require('./routes/postRoute'));
app.use(require('./routes/userRoute'));

// app.use(customMiddleware);

app.get('/', (req, res) => {
	console.log('Welcome');
	res.send('Welcome !');
});

// app.get('/home',customMiddleware,(req,res) => {
//     console.log("Home");
//     res.send("Home !");
// });

app.listen(PORT, () => {
	console.log('server started');
});
