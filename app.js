const express = require('express')
const app = express()
var number = ''
var data = null
var toggle = '-1'
var output = ''

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/views'))

app.get('/', (req, res) => {
    res.render('index.ejs', {content: data})
})
app.listen(8080, () => console.log('Server running on port 8080'))

app.get('/data', async (req, res) => {
    res.send(data)
    data = null
})

app.post('/query', async (req, res) => {
    number = req.body.number
    data = null
    await crawlWeb(async function(){
        res.redirect('/')
    })
})


// the following code relating to mongo connection is taken from: https://www.mongodb.com/blog/post/quick-start-nodejs-mongodb--how-to-get-connected-to-your-database
var client = null
const {MongoClient} = require('mongodb');
async function connectToMongo(){
            const uri = "mongodb+srv://newuser:NewUserPassword2021!!@cs4830.ie08b.mongodb.net/CS4830?retryWrites=true&w=majority";

            client = new MongoClient(uri);
	
            try {
                await client.connect();
                return client;

            } catch (e) {
                    console.error(e);
                    return null;
            } 
}
connectToMongo()

async function getData(){
    await client.db("CS4830").collection("challenge5").find({id: number}).toArray(function(err, result) {
        if (err) throw err;
        data = result[0]
    });
}
 // executing shell commands: https://stackabuse.com/executing-shell-commands-with-node-js/
async function crawlWeb(callback){
    const { exec } = require("child_process");
    const command = "scrapy crawl pdga -a number=" + number

    exec(command , (error, stdout, stderr) => {
        if (error) {
            //console.log(`error: ${error.message}`);
            toggle = 0
        }
        if (stderr) {
            //console.log(`stderr: ${stderr}`);
            toggle = 0
        }
        //console.log(`stdout: ${stdout}`);
        data = stdout
        callback()
    });
}