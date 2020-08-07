# WikiPollia back end
This is the back end for my WikiPollia app. A wireframe and other planning docs can be found [here](https://git.generalassemb.ly/donovanrichardson/project-2/blob/master/project-worksheet.md)

## Models
- Article
    - Title: String
    - Votes: ObjectId refs Vote
    - Score: Number
- Vote
    - Up: boolean
    - Article: ObjectId refs Article
    - OldId: Number or String
    - Comment: optional String

## Methods

The front end uses these methods so that users can vote interactively.

### Exposed
- /vote: POST adds a new vote
<!-- - /vote/:id: PUT edits a vote -->
<!-- - /vote/:id: DELETE deletes a vote -->
<!-- - /vote/:id: GET gets vote by id -->
- /article  GET gets the name and score of the top five articles by score.
<!-- - /article/:name: gets: GET gets the score and other details for an article. Might merge with above method -->

### not exposed
- add an article to DB

### Examples

#### Adding votes

```
POST https://wikipollia.herokuapp.com/vote
body: {
        "up":true,
        "article":"Barack Obama",
        "comment":"He's Barack"
    }

    POST https://wikipollia.herokuapp.com/vote
body: {
        "up":false,
        "article":"Barack Obama",
        "comment":"I don't like"
    }

    example response:
    {
    "title": "Barack Obama",
    "score": 3,
    "oldid": "971213249"
}

GET https://wikipollia.herokuapp.com/article

response: 
[
    {
        "score": 6,
        "title": "LMNOP"
    },
    {
        "score": 3,
        "title": "Tim Apple"
    },
    {
        "score": 3,
        "title": "Pokémon"
    },
    {
        "score": 3,
        "title": "Barack Obama"
    },
    {
        "score": 3,
        "title": "Wikipedia"
    }
]


```
