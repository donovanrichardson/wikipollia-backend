# WikiPollia back end
This is the back end for my WikiPollia app. 

## Models
- Article
    - Title: String
    - Votes: ObjectId refs Vote
- Vote
    - Up or Down: boolean??
    - Article: ObjectId refs Article
    - OldId: Number or String
    - Comment: optional String

## Methods

### Exposed
- /vote: POST adds a new vote
- /vote/:id: PUT edits a vote
- /vote/:id: DELETE deletes a vote
- /vote/:id: GET gets vote by id
- /article/:name/votes : GET gets all votes for an article BY NAME
- /article/:name: gets: GET gets the score and other details for an article. Mught merge with above method

### not exposed
- add an article to DB
