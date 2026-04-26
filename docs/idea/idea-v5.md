# AI House

_v1 of AI Village (making sure the house works first before we dream up a village)_
_This is a complete rewrite of idea-v4.md since the previous idea felt too old school / gave me 1990s internet vibes_

## Notes to the Coding Agent Helping Me

* I have never developed a game before. I'm not an engineer. But I'm comfortable with an IDE and terminal.
* I want the visuals to be developed and tested first before any of the game logic is written. The visuals should be SVGs so you should develop them yourself.
* I would prefer us working in phases to incrementally develop the game. As you finish each phase, I will manually test what you've produced. I may ask you to refine your work further. I may ask you to diverge from our original plan if what I originally requested doesn't "feel" quite right.
* You have access to a chrome devtools MCP which you can use to verify your own work.
* The game should have sound (ambient music, footsteps, text scrawl noises within speech bubbles, etc). But let's add that last.
* This game should run on a web browser. I do not intend on deploying this game.
* The characters in this game will be powered by LLMs. Players will need to supply their own API key on the UI before they can play the game. The API key should be stored in a plain text file in the codebase. It should NEVER be committed.

## Goal of the Game

* There is no explicit goal for this game since it's a player-controlled simulation.
* The player can set and work towards their own goals.
* There will be no points. There will be no saves. Both of these dynamics would be unnecessary for a game of this nature.

## Setting

* The game takes place in a modern apartment. Furniture, appliances, bookshelves, fittings, etc., should be visible but will not be interactable. Characters should not be allowed to walk through any of these. They must navigate around them. 
* The apartment will have only level.
* The apartment should be rectangular with 4 rooms. 
1. A bedroom for the couple (the master bedroom, larger than the guest bedroom)
2. A guest bedroom for the husband's friend. Should be located down a hallway.
3. A living & dining room combo (the largest room in the house). Should contain a TV area, a kitchenette, and a reading area. The bedroom is directly accessible from the living room.
4. A sacrificial altar room that's located halfway through the hallway. Should look nothing like the rest of the house. Should stick out like a sore thumb. Should look like it actually belongs in hell.

## Character Creation

* 3 characters. A couple (husband and wife). And the husband's male best friend.
* The player can name each character. The player can adjust the personality of each character as well. 
- Personalities serve as system prompts that affect how the characters interact with each other. 
- Personalities are only set during character creation and cannot be changed during the game.
- The player should always be able to look up a character's personality at any time during the game.

* Default character names and personalities will be set for each character for the player to either modify or completely rewrite. The default personality should be highly detailed but must be no longer than 250 words (since these personalities serve as system prompts as well).

## The Rooms

* Characters must be aware of the room that a conversation is taking place in. It must be injected into the system prompt.
* The sacrificial alter room MUST ALWAYS influence the characters to be the COMPLETE OPPOSITE of themselves. 

## Conversation Nature

* Conversations should be natural. No formal English (unless that's a part of the character's personality).
* Text within square brackets (e.g., [shifts nervously]) should be used to indicate actions. 

## Game Dynamics

### Start of the Day
* The player chooses to start Day X.
* The player selects 2 characters and choose a room to send them to.
* The player watches as these 2 characters make their way to the room.

### Conversation
* The player then selects the character that will begin the conversation.
* The player then writes down the topic of the conversation. It cannot be more than 25 words.
* The player will then watch the 2 characters converse with one another.
* The visual style of the conversation will be similar to that of top-down RPGs where you watch the text streaming in and then click to view the next person's response.
* Once the conversation is over, the player will be able to see each character update their "journal". 

#### Journals

* Journal entries cannot be longer than 25 words. They cannot be longer than 1 single sentence.
* Characters may write between 3 to 5 entries in a journal. The number of entries they write will be decided at random.
* Characters can choose to update historical journal entries as well. This should be done in order to prevent journal entries that conflict or contradict each other.
* Journal entries influence conversations. They are injected into the system prompt.
* At the end of a conversation, a player can see the new journal entries being added for each character or historical ones being updated. They cannot, however, view journal entries at any time (unlike personalities).

### Middle of the Day

* The player can repeat the above for another pair of characters (cannot be the same pair chosen at the start of the day) and another room (cannot be the same room chosen at the start of the day).

### End of the Day

* Once 2 conversations are complete, the day ends.
* At the end of the day, each character goes to their respective bedrooms.
* During their "sleep cycle" there will be 
- A 50% chance that 1 entry noted down in their journal is removed (or "forgotten")
- A 5%% chance that 2 entries noted down in their journal are removed
- A 0.1% chance that 3 entries noted down in the journal are removed
* Only one of the above is possible at the end of each day.

* Characters will have no recollection of anything that took place during the previous day except for what they've noted down in their journal.

### Next Day & End of Game

* Day X+1 then begins and the player will repeat the above. This will keep happening until the player hits Day 10.
* At the end of Day 10, the player will be shown the final journals of each character including what was forgotten during each day.

## LLMs

* OpenCode Zen is our LLM provider
* All characters will be powered by GPT-5.4-Nano
* See @docs/api/opencode-zen.md for an example of how to call GPT-5.4-Nano via OpenCode Zen and for an example of the API response body