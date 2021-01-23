const axios = require("axios");
const AWS = require("aws-sdk");

exports.handler = async (event, context, callback) => {
    
    var docClient = new AWS.DynamoDB.DocumentClient(
        {
            region: 'ap-southeast-1',
            accessKeyId: 'AKIAWUC2TK6CHAVW5T6V',
            secretAccessKey: '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'
        }
    );

    var getUnSendMail = async(docClient)=>{
        return new Promise((resolve, reject)=>{
            var tableName = 'AlarmToBeMailed'
            var params = {
                TableName: tableName,
                Select: "ALL_ATTRIBUTES"
            };
            var arr = []
            docClient.scan(params, (err, data)=>{
                if (err) {
                    resolve("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    var body = data.Items
                    for(i=0;i<body.length;i++){
                        if(body[i].SendMail == 'false'){
                            arr.push(body[i])
                        }
                    }
                    resolve(arr)
                }
            })
        })
    }

    let unsendMails = await getUnSendMail(docClient)
    for(i=0;i<unsendMails.length;i++){
        if(unsendMails[i].SendMail == 'false'){
            var sendmail = await axios.post(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/sendmail`,unsendMails[i])
        }
    }
};