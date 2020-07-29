const express=require('express')
const router = express.Router();

router.get('/', (request, response)=>{
    response.send('Server up and running')
})

module.exports = router;