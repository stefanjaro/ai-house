# AI House

_v1 of AI Village (making sure the house works first before we dream up a village)_
_This is a complete rewrite of idea-v4.md since the previous idea felt too old school / gave me 1990s internet vibes_

## Notes to the Coding Agent Helping Me

* I have never developed a game before. I'm not an engineer. But I'm comfortable with an IDE and terminal.
* Any custom visuals required for this game should be created as SVG files.
* I would prefer us working in phases to incrementally develop the game. As you finish each phase, I will manually test what you've produced. I may ask you to refine your work further. I may ask you to diverge from our original plan if what I originally requested doesn't "feel" quite right.
* You have access to a PlayWright MCP which you can use to verify your own work.
* The game should have sound (ambient music, footsteps, text scrawl noises within speech bubbles, etc). But let's add that last.
* This game should run on a web browser. I intend on deploying this game when I'm satisfied with it.
* The characters in this game will be powered by powerful but cheap LLMs.

## Goal of the Game

* There is no explicit goal for this game since it's a player-controlled simulation.
* The player can set and work towards their own goals.
* There will be no points. There will be no saves. Both of these dynamics would be unnecessary for a game of this nature.

## Visual Style

* The game should look and feel like a trading card game with turn based action!
* Whenever the player is given choices to make, they'll need to choose from available cards.
* Whenever the characters are interacting, it'll look like your typical dual between monsters in a turn based game.
* However, the player isn't limited to just choosing cards as you'll see below. There are instances when they'll need to type things in.

## Game Setting

* The game takes place in a modern single-story apartment. 
* The apartment will have 4 rooms. 
1. A bedroom for the couple
2. A guest bedroom for the husband's friend.
3. A living room
4. A sacrificial altar room. Should look nothing like the rest of the house. Should stick out like a sore thumb. Should look like it actually belongs in hell.

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
* The selected characters are placed into the chosen room and the conversation begins.

### Conversation
* The player then selects the character that will begin the conversation.
* The player then writes down the topic of the conversation. It cannot be more than 25 words.
* The player will then watch the 2 characters converse with one another.
* The visual style of the conversation will be similar to that of top-down RPGs where you watch the text streaming in and then click to view the next person's response.
* Once the conversation is over, the player will be able to influence how each character updates their "journal". 

#### Journals

* Journal entries influence conversations. They are injected into the system prompt.
* Journal entries cannot be longer than 15 words. They cannot be longer than 1 single sentence.
* Characters must generate 5 entries to be added to their journal. The entries generated should represent the various ways one can remember a conversation (just the good, just the bad, misunderstandings, etc). They may also choose to update existing entries to prevent duplicates or conflicting entries. Updates will be counted as a new entry as well. 
    * Updates must stick to the 15 word and single sentence limit.
    * New entries and updates must be differentiated with a "NEW" and "UPDATE" label. In the event an entry is being updated, the older entry should be shown as well.
    * The actual number of entries they write (i.e., 3, 4 or 5) will be decided at random each time.
* The player must choose 3 of the 5 entries generated to be added to the journal.
* The player must be able to view the contents of each character's journal at any given time.

### Middle of the Day

* The player can repeat the above for another pair of characters (cannot be the same pair chosen at the start of the day) and another room (cannot be the same room chosen at the start of the day).

### End of the Day

* Once 2 conversations are complete, the day ends.
* At the end of the day, we see each character in their bedrooms.
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
* See @user-docs/api/opencode-zen.md for an example of how to call GPT-5.4-Nano via OpenCode Zen and for an example of the API response body

# Incremental Development & Validation Plan (Generated with the Assistance of GPT-5.5)

The game should be developed in phases so that the core entertainment loop can be tested as early as possible.

The objective is not to faithfully implement every idea in this document. The objective is to discover the most entertaining version of the game through rapid iteration and testing.

The core loop we need to validate is:

**Choose characters → choose room → choose starting speaker → enter topic → watch conversation → choose memories → influence future conversations.**

Everything else should support this loop rather than delay it.

### Phase 1: Character Duel Prototype

Build the smallest possible playable version of the game.

The player should be able to:

* Select 2 of the 3 default characters.
* Select 1 of the 4 rooms.
* Select which character starts the conversation.
* Enter a conversation topic of no more than 25 words.
* Watch a short turn-based conversation.

The UI does not need to look good yet.

The purpose of this phase is to answer:

**Is it fun to watch two AI personalities interact with one another?**

### Phase 2: Trading Card Presentation

Transform the prototype into a card game.

The player should make all choices through cards.

Create cards for:

* Characters
* Rooms
* Conversation starter selection

The conversation screen should resemble a turn-based duel between two character cards.

The purpose of this phase is to answer:

**Does the card-game presentation make the experience feel more engaging?**

### Phase 3: Character Creation

Add editable character creation.

The player should be able to:

* Rename characters.
* Edit personalities.
* Review personalities at any time.

Personalities should directly influence conversation behaviour.

The purpose of this phase is to answer:

**Do players enjoy shaping the cast before the simulation begins?**

### Phase 4: Room Effects

Implement room-specific behavioural modifiers.

Each room should noticeably affect conversations.

The sacrificial altar room should invert character personalities and be implemented first.

The purpose of this phase is to answer:

**Do room choices create interesting strategic and narrative differences?**

### Phase 5: Memory Candidate Generation

After every conversation, each character should generate 5 possible memory updates.

Each candidate must:

* Be labelled NEW or UPDATE.
* Be a single sentence.
* Be no longer than 15 words.
* Include the original entry when generating an UPDATE.

The player should not yet choose memories.

Simply display the generated options.

The purpose of this phase is to answer:

**Are the generated memories interesting enough to become a core mechanic?**

### Phase 6: Memory Curation

Allow the player to choose which memories survive.

The player should:

* Review generated memory candidates.
* Select which memories are added or updated.
* View journals at any time.

Journals become visible game state.

The purpose of this phase is to answer:

**Is curating memories more entertaining than allowing memories to update automatically?**

### Phase 7: Memory-Driven Conversations

Inject journals into future conversations.

Characters should treat their journals as their memory of previous events.

Conflicts, misunderstandings, selective recollections, grudges, and changing opinions should emerge naturally from journal contents.

The purpose of this phase is to answer:

**Do player-curated memories create meaningful long-term consequences?**

### Phase 8: Day Structure

Add the daily gameplay loop.

Each day should contain:

* A first conversation.
* A second conversation.
* Restrictions preventing the same pair and room from being reused during the day.

The purpose of this phase is to answer:

**Do daily constraints create more interesting decisions?**

### Phase 9: Forgetting

Implement the sleep cycle.

At the end of each day, characters may forget journal entries according to the defined probabilities.

The game should visibly track what was forgotten.

The purpose of this phase is to answer:

**Does forgetting create compelling narrative drift and unpredictability?**

### Phase 10: Day 10 Ending

Implement the complete game loop.

At the end of Day 10, display:

* Final journals.
* Forgotten memories.
* Relationship evolution.
* Character changes over time.

The purpose of this phase is to answer:

**Does the simulation generate satisfying emergent stories across multiple days?**

### Phase 11: Visual Polish

Improve the visual quality of the card game.

Possible additions:

* Better card layouts.
* Character portraits.
* Room artwork.
* Animations.
* Card transitions.
* Particle effects.
* Enhanced readability.

Only add visual polish after the game is already fun.

### Phase 12: Sound

Add audio as the final phase.

Possible additions:

* Ambient music.
* Room-specific ambience.
* Text scrawl sounds.
* Card selection sounds.
* Turn transition sounds.

Sound should enhance an already enjoyable experience rather than compensate for missing gameplay.

### Development Principle

At the end of every phase, stop development and manually test the game.

Ask:

* What felt fun?
* What felt boring?
* What felt repetitive?
* What felt confusing?
* What should be removed?
* What should be exaggerated?
* What should be changed before moving to the next phase?

Never continue building features simply because they appear in this document. Prioritise what proves entertaining during testing.