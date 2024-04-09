require('dotenv').config();
const express = require('express');
const server = express();
const bodyParser = require('body-parser');
server.use(bodyParser.urlencoded());
server.use(bodyParser.json());
server.use(express.static(process.env.STATIC_FOLDER));
server.post('/compare', async (req, res) => {
    try {
        let inp1 = req.body.p1;
        let inp2 = req.body.p2;
        const { GoogleGenerativeAI } = require("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `COMPARE 15 SPECIFICATION OF THE PRODUCT ${inp1} and ${inp2} IN TABLE FORMAT price in Rs last row`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        // Convert Gemini API response string into HTML table format
        const specificationText = text.replace(/\| (.+) \| (.+) \| (.+) \|/g, '<tr><th>$1</th><td>$2</td><td>$3</td></tr>')
                                      .replace(/\|---\|---\|---\|/g, '')
                                    //   .replace(/\|**|/g,'');
                                    .replaceAll('**','')
        // Generate complete HTML response
        const htmlResponse = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Comparison</title>
                <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;900&display=swap');


                *{
                    margin:0;
                    padding:0;
                    box-sizing:border-box;
                    font-family: "Poppins", sans-serif;
                }
                body{
                    padding: 30px;
                    width:100%;
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;
                    overflow-x:hidden;
                    background-image: url('./img/img1.jpg');
                    background-position:top;
                    background-size:cover;
                    background-repeat: no-repeat;
                }

                .table-wrapper{
                    border-radius: 20px;
                    overflow:hidden;
                    width:80%;
                    height:80%;
                    background-color:rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(5px);
                    display:flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items:center;

                }
                .table-wrapper>h2{
                    background-color: rgba(170,170,170,0.2);
                    backdrop-filter: blur(8px);
                    width:100%;
                    padding:20px 10px;
                    text-align:center;
                }
                    table {
                        text-align:center;
                        border-radius:20px;
                        border:1px solid #000;
                        border-collapse: collapse;
                        width: 75%;
                        background-color:#EEEEEE;
                        overflow:hidden;
                        margin:40px;
                    }
                    table tr:nth-child(2n){
                        background-color:#DDDDDD;
                    }
                    table tr:hover{
                        background-color:#CCCCCC;
                        transition: 0.2s all;
                    }
                    th, td {
                        padding: 12px 20px;
                        text-align: left;
                    }
                    th {
                        padding:8px 30px;
                        font-weight: 700;
                        color: #000;
                    }
                </style>
            </head>
            <body>
            <div class='table-wrapper'>
                    <h2>Comparison Table</h2>
                    <table>
                        ${specificationText}
                    </table>
                </div>
             
            </body>
            </html>
        `;
        res.send(htmlResponse);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('An error occurred');
    }
});
server.listen(process.env.PORT, () => {
    console.log('Server started', process.env.PORT);
});