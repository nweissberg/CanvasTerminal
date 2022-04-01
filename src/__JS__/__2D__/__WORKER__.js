// importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js")

// var model = tf.sequential();
// async function lernLinear(){
//     model.add(tf.layers.dense({units: 1, inputShape: [1]}));

//     // Prepare the model for training: Specify the loss and the optimizer.
//     model.compile({
//         loss: 'meanSquaredError',
//         optimizer: 'sgd'
//     });

//     // Generate some synthetic data for training.
//     const xs = tf.tensor2d([0, 1, 2, 3, 4], [5, 1]);
//     const ys = tf.tensor2d([-1, 1, 3, 5, 7], [5, 1]);

//     // Train the model using the data.
//     return await model.fit(xs, ys,{ epochs:250 })
// }


onmessage = function (e) {
    // switch(e.data.command){
    //     case 'trainTF':
    //         lernLinear(e.data.number).then(() => {
    //           const output = model.predict(tf.tensor2d([6], [1, 1]));
    //           self.postMessage(Array.from(output.dataSync())[0]);
    //         });
    //         break;
    //     }
    console.log(e.data)
    
}
