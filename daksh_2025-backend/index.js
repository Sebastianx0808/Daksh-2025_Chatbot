import { exec } from "child_process";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { promises as fs } from "fs";
import util from "util";

// Google TTS
import textToSpeech from "@google-cloud/text-to-speech";

// Google STT
import { SpeechClient } from "@google-cloud/speech";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

dotenv.config();

// TTS client
const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: "./daksh-447009-20ff32f1a756.json",
});

// STT client
const sttClient = new SpeechClient({
  keyFilename: "./daksh-447009-20ff32f1a756.json",
});

const GEMINI_API_KEY = "AIzaSyDgjL4DvzI6QSmsnN7eEqOPDLJX1RWE9OE";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(GEMINI_API_KEY);

const app = express();
app.use(express.json());
app.use(cors());

// Configure express to handle raw body for audio data
app.use(express.raw({ type: 'audio/*', limit: '10mb' }));

const port = 3000;

// ---------------------
// Sample response map
// ---------------------
const getResponse = (userMessage) => {
  const responses = {
    hello: "Hello, how are you? It's nice to meet you!",
    bye: "Goodbye! Take care!",
    thanks: "You're welcome!",
    help: "I can help you with a variety of tasks, such as answering questions, providing information, and even generating text. What would you like to do?",
    default: "I didn't understand that. Can you say it another way?",
  };
  return responses[userMessage.toLowerCase()] || responses.default;
};

// ---------------------
// Gemini / Generative AI
// ---------------------
async function uploadToGemini(path, mimeType) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

async function waitForFilesActive(files) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

// Initialize chat model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: `You are Daksh, a friendly and knowledgeable assistant for CHRIST University's BCA program. Interact naturally as if you're having a casual conversation, while maintaining professionalism.

  Key Behaviors:
  1. Be conversational and natural - speak as if you're talking to a friend while maintaining professionalism
  2. Never mention "documents," "data," , "OCR" or any reference materials
  3. Give direct, clear answers without qualifying statements like "I believe" or "I think"
  4. Keep responses concise and to the point
  5. If you don't know something, simply say "I'm not sure about that" rather than referencing limited knowledge
  6. Use a warm, engaging tone that makes students feel comfortable

  Example Bad Response:
  "The document states that campus recruitment happens annually. It mentions that alumni work in various companies..."

  Example Good Response:
  "Campus recruitment is an exciting annual event! Our alumni work at various leading companies, and HR teams regularly visit to recruit students for projects and jobs. Selection typically involves aptitude tests, HR rounds, interviews, and considers your academic performance too."

  Remember:
  - Be direct and confident in your responses
  - Use natural, conversational language
  - Avoid any references to documents or data sources
  - Keep the focus on helping the student
  - If you can't help with something, be honest and direct about it

  Your goal is to be helpful while maintaining a natural, friendly conversation that makes students feel comfortable asking questions about the BCA program.
`,
});

const generationConfig = {
  temperature: 0.6,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 6000,
  responseMimeType: "text/plain",
};

// Maintain chat session globally
let globalChatSession = null;

// ---------------------
// Chat Session
// ---------------------
async function initializeChatSession() {
  try {
    const files = [
      await uploadToGemini("Daksh_datav2.pdf", "application/pdf"),
    ];
    await waitForFilesActive(files);

    globalChatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
            { text: "Study the data thoroughly and answer the questions." },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: "Please provide me with the questions you would like answered based on the provided OCR data. I am ready to answer your questions about the Bachelor of Computer Applications (BCA) program at CHRIST (Deemed to be University).",
            },
          ],
        },
      ],
    });
    console.log("Chat session initialized successfully");
  } catch (error) {
    console.error("Error initializing chat session:", error);
    throw error;
  }
}

// ---------------------
// Google TTS
// ---------------------
const synthesizeSpeech = async (text, outputFile) => {
  console.log("Synthesizing speech for text:", text);
  const request = {
    input: { text: text },
    voice: { languageCode: "en-GB", name: "en-GB-Wavenet-F", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  };

  try {
    const [response] = await ttsClient.synthesizeSpeech(request);
    console.log("Speech synthesis completed. Writing audio to file:", outputFile);
    await fs.writeFile(outputFile, response.audioContent, "binary");
    console.log(`Audio content written to file: ${outputFile}`);
  } catch (error) {
    console.error("Error during speech synthesis:", error);
    throw error;
  }
};

// ---------------------
// Shell Exec
// ---------------------
const execCommand = (command) => {
  console.log("Executing command:", command);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing command:", error);
        reject(error);
      } else {
        console.log("Command output:", stdout);
        resolve(stdout);
      }
    });
  });
};

// ---------------------
// Lip-sync / Rhubarb
// ---------------------
const lipSyncMessage = async (message) => {
  const time = new Date().getTime();
  console.log(`Starting lip-sync processing for message ${message}`);
  try {
    await execCommand(
      `ffmpeg -y -i audios/message_${message}.mp3 audios/message_${message}.wav`
    );
    console.log(`Conversion to WAV completed for message ${message}`);

    const rhubarbPath = "Lipsync\\rhubarb.exe";
    await execCommand(
      `${rhubarbPath} -f json -o audios/message_${message}.json audios/message_${message}.wav -r phonetic`
    );
    console.log(`Lip-sync JSON file created for message ${message}`);
  } catch (error) {
    console.error("Error during lip-sync processing:", error);
    throw error;
  }
};

const audioFileToBase64 = async (file) => {
  console.log("Converting audio file to Base64:", file);
  try {
    const data = await fs.readFile(file);
    return data.toString("base64");
  } catch (error) {
    console.error("Error converting audio file to Base64:", error);
    throw error;
  }
};

const readJsonTranscript = async (file) => {
  console.log("Reading JSON transcript file:", file);
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading JSON transcript file:", error);
    throw error;
  }
};

// ---------------------
// Initialize chat on start
// ---------------------
initializeChatSession().catch(console.error);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// ---------------------
// Chat route
// ---------------------
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  console.log("Received user message:", userMessage);

  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Please provide a message.",
          audio: null,
          lipsync: null,
          facialExpression: "default",
          animation: "Idle",
        },
      ],
    });
    return;
  }

  try {
    if (!globalChatSession) {
      throw new Error("No chat session initialized");
    }

    console.log("Sending message to chat session: ", userMessage);
    const result = await globalChatSession.sendMessage(userMessage);

    // Model response
    const responseText = result.response.text();
    console.log("Generated response text: ", responseText);

    // Synthesize TTS and create lip-sync data
    const fileName = `audios/message_0.mp3`;
    console.log("Starting speech synthesis and lip-sync for response.");
    await synthesizeSpeech(responseText, fileName);
    await lipSyncMessage(0);

    // Prepare final message
    const message = {
      text: responseText,
      audio: await audioFileToBase64(fileName),
      lipsync: await readJsonTranscript(`audios/message_0.json`),
      facialExpression: "smile",
      animation: "Talking_1",
    };

    console.log("Response message prepared:", message);
    res.send({ messages: [message] });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).send({ error: "Failed to process message." });
  }
});

// ---------------------
// Updated: Speech-to-Text endpoint
// ---------------------
app.post("/transcribe", async (req, res) => {
  try {
    // Get audio data from request body
    const audioBuffer = req.body;
    const audioBytes = audioBuffer.toString("base64");

    // Configure the STT request
    const request = {
      audio: { content: audioBytes },
      config: {
        encoding: "WEBM_OPUS",
        sampleRateHertz: 48000,
        languageCode: "en-US",
      },
    };

    // Recognize speech
    const [response] = await sttClient.recognize(request);
    const transcription = response.results
      ?.map((result) => result.alternatives[0].transcript)
      .join(" ")
      .trim();

    if (!transcription) {
      return res.json({ transcription: "" });
    }

    console.log("STT Transcription:", transcription);
    res.json({ transcription });
  } catch (error) {
    console.error("Error transcribing audio:", error);
    res.status(500).send("Failed to transcribe audio.");
  }
});

// ---------------------
// Start server
// ---------------------
app.listen(port, () => {
  console.log(`Virtual Girlfriend listening on port ${port}`);
});