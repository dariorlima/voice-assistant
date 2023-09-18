import fs from 'fs';
import NodeMic from 'node-mic';
import { OpenAI } from 'openai';
import { uIOhook, UiohookKey } from 'uiohook-napi'
import { config } from 'dotenv';

config();

const openai = new OpenAI();

async function main() {

    const audioStream = await getMic({
        onStart: (fileName) => {
            console.log(`Recording started to ${fileName}`);
        },
        onStop: async (fileName) => {
            const defFileName = `./audios/${new Date().getTime()}.wav`;
            fs.copyFileSync(fileName, defFileName);

            const transcript = await openai.audio.transcriptions.create({
                file: fs.createReadStream(defFileName),
                model: 'whisper-1',
                response_format: 'json'
            });

            /**
             * Modules Logic
             */

            console.log(`Recording stopped to ${fileName}`);
            fs.rmSync(fileName);
        }
    });

    uIOhook.on('keydown', async (e) => {
        if (e.keycode === UiohookKey.Q) {
            audioStream.start('tmp.wav');
        }

        if (e.keycode === UiohookKey.Escape) {
            audioStream.stop('tmp.wav');
        }
    });

    uIOhook.start()
}

async function getMic({
    onStart,
    onStop
}) {
    const mic = new NodeMic({
        rate: 16000,
        channels: 1,
        threshold: 6
    });

    return ({
        start: (fileName) => {
            onStart(fileName);
            console.log(mic.audioStream)
            const micInputStream = mic.getAudioStream();
            const outputFileStream = fs.createWriteStream(fileName);
            micInputStream.pipe(outputFileStream);
            mic.start();
        },
        stop: async (fileName) => {
            await onStop(fileName);
            mic.stop();
        }
    })
}

(async () => {
    await main();
})();