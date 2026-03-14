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