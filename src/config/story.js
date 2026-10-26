// Campaign data: opponents must exist in ROSTER (see config/assets.js).
export const STORY_CAMPAIGNS = [
    {
        id: "championship_cup",
        title: "The BONK! Grand Championship",
        intro: "Pride, temptation, and absurd calories collide in the ultimate squared circle.",
        matches: [
            { opponent: "jock_chick", arenaTitle: "The Snack Bowl Arena", dialogue: "DID SOMEONE SAY PIZZA?!" },
            { opponent: "pogo_geezer", arenaTitle: "The Spring-Loaded Dome", dialogue: "I DEMAND A RECOUNT!" },
            { opponent: "wrangler", arenaTitle: "The Grand Main Event", dialogue: "THAT WAS NOT IN THE CONTRACT!" }
        ]
    }
];
