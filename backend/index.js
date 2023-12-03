const express = require('express');
const app = express();
const socketio = require('socket.io');
const OpenAIAPI = require('openai');

// const openai = new OpenAIAPI({apiKey: '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'});
// const openai = new OpenAIAPI({apiKey: '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'});
// const openai = new OpenAIAPI({apiKey: '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'});
// const openai = new OpenAIAPI({apiKey: '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'});
const openai = new OpenAIAPI({apiKey: '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'});

const server = app.listen(9999);
const io = socketio(server, { cors: { origin: '*' } });

var cors = require('cors');
const corsOptions = {
  origin: '*',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.post('/code-racer', async (req, res) => {
    try {
      const prompt = req.body.prompt; // Ensure req.body and req.body.prompt are defined
      console.log(prompt)
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }
  
    //   const aiResponse = await openai.createCompletion({
    //     model: 'gpt-3.5-turbo-instruct',
    //     prompt: 'Write a tagline for an ice cream shop.'
    //   });
      const aiResponse = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-3.5-turbo",
    });
        console.log("[apiResponse]", aiResponse);
      const text = aiResponse.choices[0].message;
      res.status(200).json({ text });
    } catch (error) {
      console.error(error);
      res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
    }
  });


app.post('/paragraph', async (req, res) => {
    try {
      const prompt = req.body.prompt; // Ensure req.body and req.body.prompt are defined
      console.log(prompt)
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
      }
  
    //   const aiResponse = await openai.createCompletion({
    //     model: 'gpt-3.5-turbo-instruct',
    //     prompt: 'Write a tagline for an ice cream shop.'
    //   });
      const aiResponse = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt,
    });
  
      const text = aiResponse.choices[0].text;
      res.status(200).json({ text });
    } catch (error) {
      console.error(error);
      res.status(500).send(error?.response?.data?.error?.message || 'Something went wrong');
    }
  });


io.on('connect', (socket)=> {

    socket.on('userInput', async ({userInput, gameID}) => {
        try {
            let game = await Game.findById(gameID)

            if (!game.isOpen && !game.isOver) {

                let player = game.players.find(player => player.socketID === socket.id)

                let word = game.wordArray[player.currWordInd]

                if (word === userInput) {
                    player.currWordInd++
                    if (player.currWordInd !== game.wordArray.length) {
                        game = await game.save()
                        io.to(gameID).emit('updateGame', game)
                    } 
                    else {
                        let endTime = new Date().getTime()    
                        let {startTime} = game
                        player.speedWPM = calculateWPM(endTime, startTime, player)

                        game = await game.save()
                        socket.emit('done')
                        io.to(gameID).emit('updateGame', game)
                    }
                }
            }
        } catch (error) {
            
            console.log(error)
        }
    })

    socket.on('timer', async ({gameID, playerID})=> {
        let countDown = 5
        let game = await Game.findById(gameID)
        let player = game.players.id(playerID)

        if (player.isCreator) {
            let timerID = setInterval(async() => {
                if (countDown >= 0) {
                    io.to(gameID).emit('timer', {countDown, msg : "Starting Game"})
                    countDown--
                } else {
                    game.isOpen = false
                    game = await game.save()
                    io.to(gameID).emit('updateGame', game)
                    await startGameClock(gameID)
                    clearInterval(timerID)
                }
            }, 1000)
        }
    })

    socket.on('join-game', async ({gameID : _id, userName: userName}) => {
        try {
            let game = await Game.findById(_id)
            if (game.isOpen) {
                const gameID = game._id.toString()
                socket.join(gameID)
                let player = {
                    socketID : socket.id,
                    userName: userName
                }
                game.players.push(player)
                game = await game.save()
                io.to(gameID).emit('updateGame', game)
            }
        } catch (err) {
            console.log(err)
        }
    })

    // socket.emit('test', 'connection to server successful')
    socket.on('create-game', async (userName)=>{
        try{
            const quotableData = await QuotableAPI()
            let game = new Game()
            game.wordArray = quotableData 
    
            let player = {
                socketID: socket.id,
                isCreator: true,
                userName: userName
            }
            
            game.players.push(player)

            game = await game.save()

            const gameID = game._id.toString()
            socket.join(gameID) 
             
            io.to(gameID).emit('updateGame', game)
        } catch (err) {
            console.log(err)
        }
    })
})