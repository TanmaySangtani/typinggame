// import express from 'express';
// // import * as dotenv from 'dotenv';
// import { Configuration, OpenAIApi } from 'openai';

// // dotenv.config();

// const router = express.Router();

// // const configuration = new Configuration({
// //   apiKey: process.env.OPENAI_API_KEY,
// // });
// const configuration = new Configuration({
//   apiKey: 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,
// });

// const openai = new OpenAIApi(configuration);

// router.route('/').get((req, res) => {
//   res.status(200).json({ message: 'Hello from DALL-E!' });
// });

// router.route('/').post(async (req, res) => {
//   try {
//     // const { prompt } = req.body;

//     const aiResponse = await openai.completions.create({
//         model: 'gpt-3.5-turbo-instruct',
//         prompt: 'Write an lcs code dp in cpp.'
//     });

//     const text = aiResponse.choices.text;

//     res.status(200).json({ text: text });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send(error?.response.data.error.message || 'Something went wrong');
//   }
// });

// export default router;
