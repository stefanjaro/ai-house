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

## 2.1 Phase 1


