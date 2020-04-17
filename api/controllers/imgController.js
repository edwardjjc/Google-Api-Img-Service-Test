// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');
const fs = require('fs');

var responseJson = [];

const client = new vision.ImageAnnotatorClient();

exports.evaluateImages = async function(req,res) {
    const imgFolder = req.body['path'];
    var images = req.body['images'].split(',');
    
    itemP = {};
    itemP["EvaluatedFolder"] = imgFolder;
    itemP.EvaluatedImages = [];

    for(file in images){
        var file = images[file];
        itemC = {};
        const fileName = imgFolder + file;
        itemC["EvaluatedImage"] = file;
        itemC.Labels = [];

        await client.labelDetection(fileName).then(results => {
            const labels = results[0].labelAnnotations;
            labels.forEach(label => {
                itemCL = {};
                itemCL["Score"] = parseFloat(label.score * 100).toFixed(2);
                itemCL["Description"] = label.description;
                itemC.Labels.push(itemCL);
            });
            itemP.EvaluatedImages.push(itemC);
        }).catch(err => {
            res.json({ message: "Ocurrio un error al evaluar la imagen" });
        });
    }
    responseJson.push(itemP);
    res.json(responseJson);
    responseJson = [];
}

exports.evaluatePath = async function(req,res) {
    const imgFolder = req.body['path'];
    
    await fs.readdir(imgFolder, async (err, files) => {
        itemP = {};
        itemP["EvaluatedFolder"] = imgFolder;
        itemP.EvaluatedImages = [];

        for(file in files){
            var file = files[file];
            itemC = {};
            const fileName = imgFolder + file;
            itemC["EvaluatedImage"] = file;
            itemC.Labels = [];

            await client.labelDetection(fileName).then(results => {
                const labels = results[0].labelAnnotations;
                labels.forEach(label => {
                    itemCL = {};
                    itemCL["Score"] = parseFloat(label.score * 100).toFixed(2);
                    itemCL["Description"] = label.description;
                    itemC.Labels.push(itemCL);
                });
                itemP.EvaluatedImages.push(itemC);
            }).catch(err => {
                res.json({ message: "Ocurrio un error al evaluar la imagen" });
            });
        }

        responseJson.push(itemP);
        res.json(responseJson);
        responseJson = [];

        /*files.forEach(file => {
          //const fileName = './imgs/Edward.png';
          const fileName = imgFolder + file;
          console.log(fileName);
          // Performs label detection on the local file
          client.labelDetection(fileName).then(results => {
              const labels = results[0].labelAnnotations;
              console.log('Labels: ' + fileName);
              labels.forEach(label => console.log(label.description + ' Score: ' + label.score));
          }).catch(err => {
              console.error('ERROR:', err);
              res.json({ message: "Ocurrio un error al evaluar la imagen" });
          });
        });*/
      });
      //res.json({ message: "imagenes evaluadas" });
}