const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();

// middle ware
app.use(express.json());
app.use(cors())








app.listen(port || 3000, (
    console.log(`Server is ruccing on port ${port || 3000}`)
))