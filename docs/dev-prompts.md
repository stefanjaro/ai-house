# 0. Notes

* _Moved my first attempt at creating an rpg-like game to the `rpg-like-version` git branch_

# 1. Implementation Plan Creation

```
You're going to help me create a game. The first thing I want you to do is read my idea in the @docs/idea/idea-v4.md file and then advise me on how we should build it out.
```

```
I want to generate the assets for the game as early as possible. Let's work with the assets from the very beginning in case we need to adjust the design along the way as we progress through the phases.

Answers to your question: A single config file for all the keys, endpoints, and models for each character.

Now create a highly detailed phased implementation plan for this game. Within the @docs/implementation-plan folder, you must:
- Create an overview .md file with a summary of each of the phases
- Create a separate .md file for each phase

Ensure the game is built in such a manner where I can successfully test each phase myself before we move on to the next phase. This means building the game incrementally so we have a short feedback loop.

Explicitly mention in the implementation plan files what I need to do outside of the IDE (for e.g., generating sprites for the game world).

This implementation plan will serve as your memory as I work with you, and you must ensure you keep the files up to date at all times. I may ask you to change certain aspects of the original idea at times based on whether I think it's coming to life well or not. In these cases, you must explicitly note the divergence from the original plan in the implementation plan files so you can remember them.

Complete this task by also initialising a claude.md file so you're always aware of the context of this project, where the implementation plan files are stored and when and why they should be updated. 
- Do not repeat any information already available in existing files, just indicate where they can be found.
- Ensure that we follow test-driven development (write tests first, write code, run tests and ensure they pass, repeat if not).
- Ensure the CLAUDE.md file doesn't contain repetitive or duplicated information across it either.
```

# 2. Development

_Just for the lengthy prompts. Not the straightforward stuff like "Let's begin with Phase X"._

## 2.1 Phase 0

```
I'm getting an image with really thick borders for this one

"""
An ornate medieval decorative border or frame. Illuminated manuscript style. Rich red, gold, and dark green. Knotwork and foliage motifs in the corners and along the edges. The center is empty/transparent. PNG format with transparent center.
"""

Can you rewrite it so that thinner borders are generated? I think by vividly describing the detail required for the borders, Gemini is emphasizing the borders
```

```
I've had Gemini generate all the images and I've stored them in the @raw-visuals folder. I've named them as per the phase 0 plan.

- Can you use imagemagick (or another CLI tool that you prefer) to remove the white background from the husband, wife, poltergeist, parchment, and border images?
- Then use the same (or an alternative CLI tool) to resize the images into the sizes specified in the plan
- Then move them into the right folders.

Then do whatever else is required to complete phase 0.
```

```
I see some problems based on your report because I didn't have Gemini follow the dimensions you recommended + the imagemagick remove background tool didn't work very well.

- I've rengenerated the visuals for husband, wife, poltergeist, and parchment.
- Furthermore, I've put husband, wife, poltergeist, parchment, and boarder through a commercial remove background tool.

You'll find the new images in the same @raw-visuals/ folder which you can resize as needed and replace the old respective @public/assets images with.

FYI, I overwrote the old images in the @raw-visuals folder but the ones with no white background have a -nobg at the end.
```

## 2.2 Phase 2

```
I've updated the config.json file. But before I proceed to test if it works in the manner you've described, I want you to take a look at a doc that I just created - @docs/api/opencode-zen.md.

This document describes how these endpoints should be called and provides examples of the responses.

I want you to do 2 things:
1) Before I perform the test, make sure your implementation (if you've already done it to call the APIs) is correct
2) Update the CLAUDE.md file with the location and purpose of this new doc
```

## 2.3 Phase 5

```
I just got this error when I ran npm run test:live. Can you make sure we're calling the right endpoint in the right way by checking your implementation against @docs/api/opencode-zen.md?

"""
stefanjaro@jaro-thinkpad:~/Documents/personal-projects/ai-villag
e$ npm run test:live

> ai-house@1.0.0 test:live
> node scripts/liveConversationTest.js

Loading config and content...

Running a couple conversation in the bedroom (max 4 turns)...

──────────────────────────────────────────────────

[Arthur]: file:///home/stefanjaro/Documents/personal-projects/ai-village/src/services/llmService.js:14
      throw new Error(`LLM request failed: ${res.status} — ${text}`);
            ^

Error: LLM request failed: 401 — {
    "error": {
        "message": "Incorrect API key provided: test-key. You can find your API key at https://platform.openai.com/account/api-keys.",
        "type": "invalid_request_error",
        "param": null,
        "code": "invalid_api_key"
    }
}

    at Object.streamCompletion (file:///home/stefanjaro/Documents/personal-projects/ai-village/src/services/llmService.js:14:13)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async Object.runConversation (file:///home/stefanjaro/Documents/personal-projects/ai-village/src/services/conversationOrchestrator.js:101:7)
    at async file:///home/stefanjaro/Documents/personal-projects/ai-village/scripts/liveConversationTest.js:29:1

Node.js v18.19.1
"""
```

```
You're right. For some reason the config.json file had been reset. I just populated it with the right endpoints, models, and secrets.

But after running npm run test:live again, I see this error.

"""
<truncated>
"""
```

```
It worked! But I don't like the way they speak (see below for what the test generated). I know this game is set in medieval times but I'd like them to speak normally like modern day humans. When speaking to each other, I would like them to not put their thoughts within asterisks. Thoughts are for when they're reflecting only. But whatever actions they're performing which the other character can see can be within asterisks. Update whatever system prompt is influencing this behaviour.

"""
[Arthur]: *The fire crackles low as I set my ledger aside, watching you brush your hair by candlelight. These thirty winters together, and still I find myself searching for words when they matter most.* 

The chronicles record our victories, yet none capture how your laughter turns stone walls to sanctuary.

[Eleanor]: *My brush stills; through the mirror's amber glow, I catch the boy who stole apples from my orchard, now grey at temple.*

Those chronicles omit how you, fierce war-lord, trembled holding our firstborn—your battle-scarred hands made suddenly gentle. That victory eclipses every conquest.

[Arthur]: *I clear my throat, suddenly finding the tapestry most fascinating.* 

The boy who trembled then trembles still—only now the siege is time itself, and you, my lady, remain the fortress I never wish to yield.

[Eleanor]: *Setting my brush down, I reach for your weathered hand.*

Then let us stand together, my love—two old banners still flying, threadbare yet unbroken. Time may batter these walls, but it will never breach what we've built within them.
"""
```

## 2.4 Phase 6

```
How do I test this myself? Is there a way to do so?
```

```
I ran npm run test:memory, and look at what happened (see below). I know it ran on the same conversation, but it ended up just adding the same memories to the file which isn't right. The characters should be able to see what memories they have so they don't end up duplicating memories. It should be more intelligently handled.

"""
stefanjaro@jaro-thinkpad:~/Documents/personal-projects/ai-village$ npm run test:memory

> ai-house@1.0.0 test:memory
> node scripts/liveMemoryTest.js


Live Memory Reflection Test — Character: husband
────────────────────────────────────────────────────────────

Current memory (3 items):
  1. Eleanor enjoys the harvest festival's music and dancing - she does not merely tolerate it for my sake
  2. Eleanor wishes I would dance with her at the festival more often
  3. I promised to dance with Eleanor at this year's harvest festival, and she will hold me to it

Streaming reflection thoughts:

NEW MEMORIES:
1. Eleanor enjoys the harvest festival's music and dancing - she does not merely tolerate it for my sake
2. Eleanor wishes I would dance with her at the festival more often
3. I promised to dance with Eleanor at this year's harvest festival, and she will hold me to it

DISCARD:
None needed - total memories now at 3

────────────────────────────────────────────────────────────
Memory updated. New total: 6 items.

Updated memory:
  1. Eleanor enjoys the harvest festival's music and dancing - she does not merely tolerate it for my sake
  2. Eleanor wishes I would dance with her at the festival more often
  3. I promised to dance with Eleanor at this year's harvest festival, and she will hold me to it
  4. Eleanor enjoys the harvest festival's music and dancing - she does not merely tolerate it for my sake
  5. Eleanor wishes I would dance with her at the festival more often
  6. I promised to dance with Eleanor at this year's harvest festival, and she will hold me to it

Check data/memory/husband-memory.md to confirm the file was written.
"""
```