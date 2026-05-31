import express from 'express';
import {
  buildConversationRequest,
  buildConversationTurnRequest,
  extractTranscriptFromOutput,
  extractTurnFromOutput,
} from './src/lib/conversationRequest.js';
import { characters, getCharacterById, getRoomById } from './src/lib/gameData.js';

process.loadEnvFile?.('.env');

const app = express();
const port = Number(process.env.PORT || 3101);
const REQUEST_TIMEOUT_MS = 20000;

app.use(express.json());

app.get('/api/game-data', (_request, response) => {
  response.json({
    characters: characters.map(({ id, name, role }) => ({ id, name, role })),
  });
});

app.post('/api/conversations', async (request, response) => {
  const { selectedCharacterIds, roomId, startingSpeakerId, topic } = request.body ?? {};
  const startedAt = Date.now();

  try {
    if (!Array.isArray(selectedCharacterIds) || selectedCharacterIds.length !== 2) {
      response.status(400).json({ error: 'Choose exactly two characters.' });
      return;
    }

    const selectedCharacters = selectedCharacterIds.map((characterId) => getCharacterById(characterId));
    const room = getRoomById(roomId);

    if (selectedCharacters.some((character) => !character) || !room) {
      response.status(400).json({ error: 'Choose two valid characters and a valid room.' });
      return;
    }

    const payload = buildConversationRequest({
      characters: selectedCharacters,
      room,
      startingSpeakerId,
      topic,
    });

    console.log(
      `[conversations] start room=${roomId} characters=${selectedCharacterIds.join(',')} starter=${startingSpeakerId}`,
    );

    const transcript = await requestConversation(payload);

    console.log(`[conversations] success elapsedMs=${Date.now() - startedAt} turns=${transcript.length}`);

    response.json({
      transcript,
      meta: {
        roomName: room.name,
        characterNames: selectedCharacters.map((character) => character.name),
      },
    });
  } catch (error) {
    console.error(
      `[conversations] failure elapsedMs=${Date.now() - startedAt} message=${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );

    const statusCode =
      error instanceof Error && error.message.includes('topic')
        ? 400
        : error instanceof Error && error.message.includes('required')
          ? 400
          : error instanceof Error && error.message.includes('starting speaker')
            ? 400
            : error instanceof Error && error.name === 'TimeoutError'
              ? 504
            : 502;

    response.status(statusCode).json({
      error: error instanceof Error ? error.message : 'Conversation generation failed.',
    });
  }
});

app.post('/api/conversation-turn', async (request, response) => {
  const { selectedCharacterIds, roomId, startingSpeakerId, topic, transcriptSoFar, turnNumber } = request.body ?? {};
  const startedAt = Date.now();

  try {
    if (!Array.isArray(selectedCharacterIds) || selectedCharacterIds.length !== 2) {
      response.status(400).json({ error: 'Choose exactly two characters.' });
      return;
    }

    const selectedCharacters = selectedCharacterIds.map((characterId) => getCharacterById(characterId));
    const room = getRoomById(roomId);

    if (selectedCharacters.some((character) => !character) || !room) {
      response.status(400).json({ error: 'Choose two valid characters and a valid room.' });
      return;
    }

    const payload = buildConversationTurnRequest({
      characters: selectedCharacters,
      room,
      startingSpeakerId,
      topic,
      transcriptSoFar: Array.isArray(transcriptSoFar) ? transcriptSoFar : [],
      turnNumber,
    });

    console.log(
      `[conversation-turn] start room=${roomId} characters=${selectedCharacterIds.join(',')} turn=${turnNumber}`,
    );

    const turn = await requestSingleTurn(payload);

    console.log(`[conversation-turn] success elapsedMs=${Date.now() - startedAt} turn=${turnNumber}`);

    response.json({ turn });
  } catch (error) {
    console.error(
      `[conversation-turn] failure elapsedMs=${Date.now() - startedAt} message=${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    );

    const statusCode =
      error instanceof Error && error.message.includes('topic')
        ? 400
        : error instanceof Error && error.message.includes('required')
          ? 400
          : error instanceof Error && error.message.includes('starting speaker')
            ? 400
            : error instanceof Error && error.message.includes('Turn number')
              ? 400
              : error instanceof Error && error.name === 'TimeoutError'
                ? 504
                : 502;

    response.status(statusCode).json({
      error: error instanceof Error ? error.message : 'Conversation generation failed.',
    });
  }
});

app.listen(port, () => {
  console.log(`AI House API listening on http://localhost:${port}`);
});

async function requestConversation(payload) {
  const outputText = await requestProviderText(payload);
  return extractTranscriptFromOutput(outputText);
}

async function requestSingleTurn(payload) {
  const outputText = await requestProviderText(payload);
  return extractTurnFromOutput(outputText);
}

async function requestProviderText(payload) {
  const apiKey = process.env.OPENCODE_ZEN_KEY;
  if (!apiKey) {
    throw new Error('Missing OPENCODE_ZEN_KEY in the local environment.');
  }

  const providerResponse = await fetch('https://opencode.ai/zen/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!providerResponse.ok) {
    const errorText = await providerResponse.text();
    throw new Error(`OpenCode Zen request failed: ${providerResponse.status} ${errorText}`);
  }

  const body = await providerResponse.json();
  const outputText = body.output
    ?.flatMap((item) => item.content ?? [])
    ?.filter((item) => item.type === 'output_text')
    ?.map((item) => item.text)
    ?.join('\n')
    ?.trim();

  if (!outputText) {
    throw new Error('OpenCode Zen returned no transcript text.');
  }

  return outputText;
}
