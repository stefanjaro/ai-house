# AI House

_v1 of AI Village (making sure the house works first before we dream up a village)_

## Notes to the Coding Agent Helping Me

* I'd like this to be a browser-based narrative game / simulation (see more in the Game Design section below).
* I have never developed a game before. I am not aware of how to handle visuals. I plan on generating images of whatever is needed using Gemini's Nano Banano model. I will need you to tell me what to generate (avatars, backgrounds, and any other static assets based on the idea), what prompts to use, and I'll need your help with post-processing (if needed) and storing the files in the right places.
* I'm not a software engineer, but I am familiar with programming. I do not find using the terminal or an IDE daunting.
* I want you to be able to handle as much as possible without the need for me to review your code. I prefer to review the outputs than the inputs in order to provide further direction.
* I want the game to have sound (e.g., background music, little noises for button clicks, little noises for when a character is speaking) but I want to do that absolutely last.

## Technical Notes

* I want this game to be able to run on a web browser. I do not intend on deploying this game. However, setup instructions should be provided in a `setup.md` file for anyone who wants to clone the repo and run it on their own machine.
* Since the characters in this game will be powered by LLMs, users will need to supply their own API keys, endpoints, and model names. There's only 3 characters in the game, so there should be a template that they can copy and fill out to specify the configs for each character.
* The character creation screen should display the model powering each character (automatically)

## Characters Creation

When the game loads, we should see 3 characters, a husband, a wife, and a poltergeist (little troublemaker devil).
- The sprite for each character will be set. The player will not be able to customize it.
- The player can name each of the characters.
- The player can customize the "personality" (stored in a `x-personality.md` file where `x` refers to the character) of the husband and wife. This personality will serve as the system prompt that influences how they interact with other characters (their conversational likes and dislikes, their tone of voice, how they choose to remember interactions, how they feel about the other person, etc).
- The player will be able to view the personality of the poltergeist but will not be able to edit it in-game unlike the husband and wife. The poltergeist's sole role will be to bring about discord between the husband and wife

## Game World

The game world is set in a house with 4 rooms. 
- A bedroom. 
- A living room. 
- A kitchen. 
- A mystery room that looks like it's set in the underworld.

The husband and wife can move anywhere in the house but cannot access the mystery room (In fact they won't know that the room exists). Only the poltergeist can access the mystery room. However, the poltergeist cannot access the bedroom.

Each room will influence the type of conversation that the husband, wife, and poltergeist will have (stored in a `x-room-infleunce.md` file where `x` refers to the room; not editable in-game).
- The bedroom is for reflective conversations. Reminiscing about the past.
- The kitchen is for ambitious conversations. Planning for the future.
- The living room is for relaxing conversations. Any topic of interest.
- No conversations between 2 characters will take place in the mystery room since it's only accessible by the poltergeist. However, this is where the poltergeist will create their diabolical plans (short monologues that should be visible to the player).

## Game Dynamics

### Random Selections

Each day the following will be selected at random:
- The poltergeist will decide on which of 2 other characters they want to interact with. The poltergeist will always begin the conversation.
- 2 rooms will be selected for conversations to take place. This must always exclude the mystery room and the room that was chosen the previous day (unless the previous day didn't happen because we just started a new game).
* The first room is where the husband and wife will have a conversation. 
* The second room is where the poltergeist and whomever they select will have a conversation
* The first and second room cannot be the same.
- Who begins the conversation between the husband and wife will be determined at random.

### Each Day's Activities
Each day will be comprised of the following activities:
- A conversation between the husband and wife (this should always be first).
- A conversation between the poltergeist and whomever they've selected
- Memory writing
- Diabolical planning
- Sleep and reset

### Husband and Wife Conversation
- The husband and wife will head to the room that was selected for their conversation. After a brief pause, whoever was selected to start the conversation will begin it. 
- The conversation will last for a maximum of 20 turns (10 turns for each character). Each turn cannot be more than 50 words long.
- They must be aware of the turn limit and "wrap up" the conversation when they're nearing the end of their turn limit.
- The player must be able to see what they're talking about.
- (Technical note: A log of the conversation must be written to a `husband-wife-conversations/` folder. Every new conversation will generate a new log file).

### Poltergeist Conversation
- Once the husband and wife wrap up, the one who was selected to have a conversation with the poltergeist will move to the room it's supposed to take place in. The poltergeist should've already moved to this room at the beginning of the day. Once the character gets there, after a brief pause, the poltergeist will begin the conversation.
- The conversation will last for a maximum of 10 turns (5 turns for each character). Each turn cannot be more than 50 words long.
- They must be aware of the turn limit and "wrap up" the conversation when they're nearing the end of their turn limit.
- The player must be able to see what they're talking about.
- (Technical note: A log of the conversation must be written to a `poltergeist-conversations/` folder. Every new conversation will generate a new log file).

### Memory Writing
The husband and wife will then head to the bedroom as the poltergeist heads to the mystery room.

For the husband and wife:
- Both the husband and wife will "reflect" upon all the conversations they've had during the day and choose what 5 things they want to remember. What they choose will be written to their memory (or an `x-memory.md` file where the `x` refers to either the husband or the wife).
- Their memory can only contain a maximum of 20 items. Therefore, if they've reached the maximum, they must choose to discard 5 items.
- The player must be able to see this entire process (the thoughts should appear on the screen) and it should take place for one character at a time (starting with the wife, ending with the husband).
- Together with their personality, their memories will influence the conversations they have with each other (how they begin the conversation, their mood, etc). Their memory is essentially a daily-changing extension to their personality system prompt.

For the poltergeist:
- The poltergeist will also reflect the conversation they've had and choose 2 things they want to remember. What they choose will be written to their memory (or an `poltergeist-memory.md` file).
- Their memory can only contain a maximum of 10 items. Therefore, if they've reached the maximum, they must choose to discard 2 items.
- The player must be able to see this process. In other words, their thoughts should appear on the screen.
- Similar to the husband and wife, together with their personality, their memory will influence the conversations they have.

### Sleep & Reset
- The husband, wife, and poltergeist will then go to sleep and lose track of the conversations that took place during the day.
- A new day will then begin (and the player should be able to see this on the screen).

### End of the Game
- The game will proceed for 10 days and then come to an end.
- At the end of the game (the 11th day), all characters must meet in the living room.
- The husband must then express his feelings about his wife to her.
- The wife must express her feelings about her husband to him.
- The poltergeist will be "listening in" on the conversation and will inform the player about whether they achieved their diabolical plan to tear them apart or not.
- These end of game conversations must be written to a log file stored in `end-of-game-conversations/`
- The user can then end the game and go back the start screen.

## Game Design

This is my idea for the design of the main part of the game. For the main menu or the character creation screens, I'll let you have creative freedom.
- Fundamentally, this game is a website but it still needs to "feel" like a game in the same way the popular browser-based narrative game Fallen London "feels" like a game.
- The visuals of the game should be set in medieval times.
- When any activity is taking place (random selections, conversations, memory writing), the text for each turn should be streamed in, it shouldn't appear all at once. 
- The game window has 4 areas - a top bar, a right side panel, a center screen, and a bottom bar.
- The top bar should display the day (e.g., Day X of 10). It should be the thinnest of the areas.
- A right panel that's for displaying the following a history of the events in the game. This is where a player currently at day 4 for instance (watching it unfold in the center screen) can look up what activities (random selections, conversation logs, and memory writing) happened in day 1. Each day's activities should be "collapsed" (think of an accordion element named by each day). Each type of activity in the history should be styled differently.
- The bottom bar should display the avatars and names of the characters and allow the user to open up their personalities and the current state of their memories. These would open up in scrollable pop-up modals (styled like medieval scrolls), which they can then close.
- The center screen should display the day's activities:
* It should display the random selections made at the start of the day
* It should then bring into focus the room that the characters are in at any given time (fade in effect for the room first and then the characters)
* The conversation or memory writing unfolding should appear as a slightly transparent overlay over the room. Every turn that involves a character thinking or reflecting must appear as a speech bubble with the name and avatar of the character placed at the bottom left. Until a conversation or reflection within a room ends, a player should be able to "scroll up" to see the previous responses (explicitly that means the latest response should always appear at the bottom).
- For any activity in the game, the user should have to click (with their mouse) anywhere in the center screen to proceed to the next activity.