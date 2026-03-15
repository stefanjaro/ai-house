# 1. Implementation Plan Creation

```
You're going to help me create a game. The first thing I want you to do is read my idea in the @docs/idea/idea-v3.md file and then advise me on how we should build it out.
```

```
Now create a highly detailed phased implementation plan for this game. Within the @docs/implementation-plan folder, you must:
- Create an overview .md file with a summary of each of the phases
- Create a separate .md file for each phase

Ensure the game is built in such a manner where I can successfully test each phase myself before we move on to the next phase. This means building the game incrementally so we have a short feedback loop.

Explicitly mention in the implementation plan files what I need to do outside of the IDE (for e.g., generating sprites for the game world).

This implementation plan will serve as your memory as I work with you, and you must ensure you keep the files up to date at all times. I may ask you to change certain aspects of the original idea at times based on whether I think it's coming to life well or not. In these cases, you must explicitly note the divergence from the original plan in the implementation plan files so you can remember them.

Complete this task by also initialising a claude.md file so you're always aware of the context of this project, where the implementation plan files are stored and when and why they should be updated.
```

```
Update the CLAUDE.md file with the following
- Instead of including some key design rules, just add a single note pointing to where the idea-v3.md file is. Mention that that's the original game idea and the user may choose to diverge from it when progressing through each implementation plan phase
- Ensure that we follow test-driven development (write tests first, write code, run tests and ensure they pass, repeat if not).
```

```
I think there's some repetition in the CLAUDE.md file now. Please review it and remove the repetition
```

# 2. Development

_Just the big ones. Not stuff like "Proceed with Phase X"._

## 2.1 Phase 2

```
This is what Gemini generated for the house tileset. Is this correct?

FYI, when we ask Gemini to generate an image with a transparent background, the image it generates contains grey and white boxes as a background that are hardcoded. So it's feigning transparency instead of it being actually transparent. We should ask Gemini to generate an image with a white background and then use a tool like remove.bg to make it transparent.
```

```
Let's do individual sprites. Let's update the phase 2 file with the prompts that I need to use and I'll copy them from there and generate all of them in one go.
```

```
I've had Gemini generate the pixel art for all the furniture sprites and I've stored the raw files in @gemini-raw-art/. I used the names you've mentioned in the phase 2 plan. 

Before I painstakingly put each of these through remove.bg, can you see if we can use imagemagick to remove the white backgrounds from them instead?

Let's run it on all the images and I'll look through each one to see if they're satisfactory before we do anything else.
```

```
I think it looks great. 

Before we move on. Here's the spritesheet generated for the husband. What do you think of this? Should we prompt Gemini differently or take a different approach now?
```

```
Alright. All the sprites and sprite sheets have been generated. 
- Let's remove the backgrounds from wife.png, husband.png, and poltergeist.png.
- Then resize them all according to your plan, move them into the right folders as per your plan 
- Then add @gemini-raw-art to the gitignore file so we're not committing large image files that aren't necessary into the github repo
```

```
Before I hit M to cycle characters, I wanted to share what the game currently looks like with you. Don't you think everything is waaayyyy too small? 
```

```
This is a lot better, but all the placements are screwed up (overlapping sprites) and the characters are fuzzy too since you've upscaled them from a smaller size. Why don't we try resizing it to the size you've upscaled them to since we have the original images in the gemini-raw-art folder? And then fix the placements accordingly.
```

```
This is crisp and nice but the placements are completely off.   
Let's make it look neater. 
```

```
Okay, I think it's pretty...basic. And maybe that's because we're using really basic sprites and basic native colours for the walls and floors. And before we proceed, I'd like the game to look nice. The nicer it looks, the more motivated I will be to work on it.

So here's what I've done. I've downloaded some free sprites and spritesheets from itch.io, specifically from https://vinerox.itch.io/ and https://penzilla.itch.io/. I want to credit them in the readme.md file (remember that).

You'll find them in the following folders (I've renamed gemini-raw-art to raw-art)
- @raw-art/itchio/boy-girl-characters contains sprites for the husband and wife
- @raw-art/itchio/poltergeist.png is a spritesheet for the poltergeist
- @raw-art/itchio/top-down-house contains sprites for the house

Now, I want you to have complete liberty with how you use the house sprites to design the house. There should only be 4 rooms as per our original game design, but feel free to creatively use the sprites provided to decorate the house to your liking. I want it to look vibrant and alive.

Plan this carefully because this is what will make or break the game.
```

```
Something has gone terribly, terribly wrong. We're using a combination of the old sprites and the new ones. Why are there multiple poltergeits that appear!? And the game world looks chaotic! Utterly, utterly chaotic!
```

```
I want you to confirm that you will NOT use the gemini generated sprites anymore. That you will remove them from the asset folders / game folders and rely ONLy on the itchio sprites  
```