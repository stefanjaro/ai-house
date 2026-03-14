# --- Character Creation ---

When the game loads, the player should be given the option to create 5 characters:
- They can choose the sprite for the character. They should be able to choose from 5 pre-defined sprites.
- They can name their characters. The names should be single names. No two names should be the same (regardless of capitalization). Names can only have letters and not numbers, spaces, or special characters.
- They can define the character's base identity using words and this will be stored in an "base_identity.md" file for the character. They can choose from 10 pre-defined identities but they can also choose to edit these as they wish. This will also help them figure out what kind of content should ideally be in an identity file.
- They can choose the LLM that they want powering the character from a dropdown. 

## Technical Implementation Note

- The models available for them to choose from will be those that they've provided API keys for in a config file. 
- They'll need to specify both the model and the API key for it in the config file. If a model is missing an API key value, it should not appear in the dropdown. 
- When they select a model in the game, we should send the model a very small health check query to ensure the API key works. The results of the health check should be displayed to the player as well.

# --- Game World ---

- Every character will have their own wooden house. Each house will consist of a bed, plant, kitchen table, and single kitchen chair.
- The outside game world will consist of 3 meeting zones:
    1. A park - with a single tree and a park bench, 
    2. A fountain
    3. A grocery store.
- All 3 meeting zones must be spaced out across the map so much so that it takes some time for the characters to head to the zone.
- All characters will be aware of where the other characters live and the meeting zones.
- There will be no other characters or NPCs in the game other than the main 5.

# --- Game Dynamics ---

- Day/night loop. Days can last only for 3 conversations across all characters.

## Starters and Receivers

- As soon as they wake up, 3 characters chosen at random will be assigned as "Conversation Starters". The remaining 2 characters will be assigned as "Conversation Receivers".
- The Conversation Receivers will decide by themselves which of the meeting zones they'll want to spend their days at.
- The Conversation Starters will decide which of the 2 Conversation Receivers they want to speak to and what they want to speak to them about. They should then go out in search of that character.
- If they notice that target character (e.g., Character X) is already engaged in a conversation with someone else (e.g., Character Y), they must change their plan and find someone other than Characters X and Y to interact with and they should think about what they want to talk to this character about. They should then go out in search of this character.
- Characters must remember which of the Conversation Receivers they've seen engaged in another conversation and which they haven't so that they don't keep going after the same Conversation Receiver.
- Once a conversation is over, the starters and receivers should have zero "social battery" for the day. They should go back home, waiting for night time (i.e., the end of all conversations).
- A character can never enter another character's house. They can only interact with them outside in a meeting zone (they cannot interact with them on the way to a meeting zone either, they must follow them). A character can  know that another character is in their homes and thus unavailable to speak to for the day.
- If no characters are available for a Conversation Starter to engage with, they must have an "internal dialogue".

## Character-to-Character Conversations

- Conversations can only last 20 turns (specifically 10 turns for each character). Characters must be aware of this and "wrap up" the conversation when they're nearing the end of their turn limit.
- All turns cannot be more than 50 words long.
- A log of the entire conversation must be held in a temporary file to help with reflections at night (see below).  

## Internal Dialogues

- Given the odd number of characters, we'll always have a single character with no one to talk to. Once this character realizes that the others are either busy or have drained social batteries, they should then engage in a 10 turn conversation with themselves (an internal dialogue). Each turn must end with a question that they'll answer in the next turn. They should be aware of their 10 turn limit and "wrap up" their internal dialogue towards the end of it.
- All turns cannot be more than 100 words long.

## Reflections

- At the end of the day (this is the night time sequence), all characters must "reflect" on the conversations they've had. These reflections must lead to 2 entries into 2 files.
- The first file is the "X-relationship.md" file. This is where they'll store what they've learned about Character X (where X is any given character) and what they think of them. They can either append new entries to this file or rewrite existing entries.
- The second is the "extended_identity.md" file. This is where they'll reflect on what they've learned about themselves during the conversation. They can either append new entries to this file or rewrite existing entries.
- The character that had an internal dialogue during the day will only update their extended identity file.
- In addition to their base identity, it's these files that will determine what each character wants to speak to the other about (or what they want to speak to themselves about in the case of internal dialogues). 
- A character can NEVER update their base identity file.
- Once a reflection is complete, all conversation log files for the day must be deleted.

# --- Player Controls ---

- Players play more of an observer role in this game. 
- Players should be able to pause and resume the game at any time. When they pause the game, they should be able to access the "X-relationship.md", "base_identity.md", and "extended_identity.md" files of any character. This is the primary way that they'll see what the characters have updated their relationsip and extended identity files with.
- To make it easier for players to keep track of what's going on, they must be the ones that trigger the conversations to begin when 2 characters meet. This way they can pay attention to one conversation at time. The same applies for when a character wants to have an internal dialogue with themselves.