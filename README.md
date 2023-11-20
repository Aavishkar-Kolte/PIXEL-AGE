
# PIXEL-AGE

<div align="justify"> 
 PIXEL-AGE is a browser-based, online multiplayer game (2-player game) designed to play with friends or to engage in random battles with opponents from around the world. To initiate a game with friends, players can create a private lobby and share the lobby code with their friends. This allows players to easily join the same game and compete against each other using the lobby code. Or players can rapidly match up with random opponents using the "Play Online" feature.
</div>




#### [PLAY NOW](http://pixel-age.ap-south-1.elasticbeanstalk.com)


## TECH-STACK
- Frontend: ReactJS, HTML Canvas, CSS, JS
- Backend: NodeJS, ExpressJS, MongoDB
- Other: Socket.IO, WebRTC

## CHALLENGES THAT I FACED

- Understanding game creation and basic game physics
- Working with Canvas in ReactJS
- Conceptualising the game: game flow, player actions and controls, game score, and results
- Dealing with data inconsistency in the initial architecture
- Understanding online multiplayer game architectures and game state calculations
- Choosing the right architecture for my specific case and managing game state calculations
- Deciding on the most suitable technology for implementing the chosen architecture among the available options.
- Choosing between TCP and UDP protocols
- Implementing a peer-to-peer (P2P) architecture using Socket.IO for the signalling server and WebRTC for game state and player data sharing
- Designing the website's UI/UX.
- Reducing game latency.

## THINGS I'VE LEARNED
- Online multiplayer game architectures: P2P and dedicated servers
- Communication technologies like Socket.IO, WebRTC, and their architecture
- Why UDP is preferable to TCP for game state sharing
- Proficiency in ReactJS and ReactJS hooks
- Understanding HTML Canvas and the rendering of 2D game graphics

## FLAWS IN THIS GAME
- High in-game latency for geographically distant players.
- It's an unfair game. Because the game calculations are all done on one player's system in a P2P architecture, that player experiences nearly no latency, while the other player experiences noticeably higher latency based on the packet routes and geographical distance between the two players.
- The game is not very secure.

## THE STORY BEHIND THE GAME

<div align="justify">

On October 4, 2023, at 2 a.m. I saw this video on YouTube by Chris Courses ([link](https://www.youtube.com/watch?v=vyqbNFMDRGQ)). In this video tutorial, he teaches how to make a 2-player fighting game in JS. I couldn't wait to see how he created that game because the thumbnail was so captivating. After watching a little portion of that video, I was like, "I want to do this." I wanted to make this game, but after seeing the 3.2 million views on the video, I realised that it must have been done by a lot of people before because it's not that difficult to replicate it. So, I gave up on that idea. The very next day, it reminded me of Nekki's Shadow Fight 2. When I first played Shadow Fight 2, I was in the ninth grade. At the time, it was one of my favourite games. I used to spend hours playing it. But I always felt that it would have been a lot more fun if I could play it with my friends in real-time. And this YouTube video brought back those memories. I had an amazing idea to make it an online multiplayer game. It felt very hard for me to do, and I wasn't sure how to go about it. However, the drive to build this game was so strong that I ultimately made the decision to start working on it.

The initial idea was to watch Chris's YouTube video, try to implement it as it is by myself to understand it, and later on, implement it in ReactJS, and then somehow connect two players. After watching his video, I created my own version, with some changes such as altering player sprites, background sprites, and the addition of torch and candle sprites. I also introduced a defence control that triggers when the "k" key is pressed. When defence is activated, the game character uses his shield to defend, the player's speed decreases, and he is unable to jump or attack. Additionally, I implemented code to ensure that the player remains within the canvas frame during gameplay, these features were not present in Chris's original code. Once that was done, I tried to implement it in ReactJS. While Chris used HTML, CSS, and JS in his YouTube video, I had recently learned ReactJS and wanted to build the website's frontend using it. The game uses HTML canvas to render frames on the website’s frontend. And working with HTML canvas in ReactJS is challenging, but thanks to Marshall Ruse's article "Converting a Vanilla JS Canvas Animation to React" ([link](https://medium.com/@ruse.marshall/converting-a-vanilla-js-canvas-animation-to-react-78443bad6d7b#:~:text=To%20animate%20the%20canvas%20we,use%20of%20the%20browser's%20window.)), his article helped me understand how to use canvas in ReactJS. And I successfully implemented it in ReactJS.

Now it was time to somehow connect two players. I had no idea about connecting two web browsers on which the players would be playing the game. After some research, I came across a JavaScript library called Socket.io, but it wasn't the thing I was looking for since it was designed for client-server architecture. In such a setup, the game state would be sent from the client to the server, undergo server-side processing (e.g., searching for the intended player's socket ID or room ID), and then be sent to the intended player. Game state is basically the current representation of all relevant data that describes the current state of a video game at any given moment, it generally includes player position, velocity, events, and environmental data. This process would introduce significant latency, which is unacceptable for high-paced games like fighting games where even milliseconds of delay can affect the game results.

To address this issue, I explored and found WebRTC. It is commonly used for video and audio-conferencing applications, and I discovered that it could serve my purpose as it establishes direct connections between computers, eliminating the need for a server in between. I was able to gain a better understanding of WebRTC through a YouTube video by Piyush Garg ([link](https://youtu.be/pGAp5rxv6II?si=2BTry7--CuRdqmBM)) that described its architecture and working. Furthermore, I found that WebRTC offers data channels that can be used to share strings, making it suitable for exchanging player data and game state data. Thanks to Chaim, his video on WebRTC data channels ([link](https://youtu.be/NBPDYco-alo?si=qvyl9mKudzmkRFwY)) helped me understand WebRTC data channels. WebRTC's capability to establish a direct connection between two computers over the internet aligned perfectly with my requirements. As a result, I made the decision to use WebRTC for sharing player data and game state data in my online multiplayer game.

Both TCP and UDP can be used for data sharing with WebRTC, and the question that arises is: which one is better for this application? Nowadays, both TCP and UDP are commonly used in combination for various types of data. However, for my relatively uncomplicated game, I chose to stick with one protocol. Hussein Nasser's YouTube video "When to Use UDP vs. TCP in Building a Backend Application?" ([link](https://youtu.be/G86axGfnWag?si=dH6EhOcjTQPA3u65)) was very helpful in guiding my decision. UDP offers lower latency compared to TCP because it skips the handshaking and acknowledgment processes. Additionally, it's faster in data transmission because it doesn't wait for acknowledgments or retransmit lost packets. In real-time applications like gaming, reducing latency is critical for ensuring a smoother and more responsive user experience. UDP is often the preferred choice for managing high-bandwidth data, making it particularly well-suited for real-time multiplayer games. As a result, I implemented the WebRTC component for UDP and successfully connected two players.

Now the question is, what data should I share between players so they can play with each other? Here's where I made a dumb mistake. I thought that by simply sharing player key events with each other, as the game state calculation code is the same on both sides, the final output on the screen should be the same. However, I saw that this approach didn't work as expected. There were moments where, if one player hit the other player while moving, the attacking player saw damage on their own computer, but it was not reflected on the other player's computer. And this is where I understood why there is a crucial need for a common source of truth in the game.

I had no idea how online multiplayer games work. So, I searched for information about how online multiplayer games work and their architecture. I came across some YouTube videos by Shrine ([link](https://www.youtube.com/watch?v=77vYKsXC4IE)), Nick Maltbie ([link](https://youtu.be/KBBJqPL5-eU?si=36GFyWrTnhYIsZUz)), Tom Weiland ([link](https://youtu.be/eQt7TwCr6ao?si=heCTLP0WlGqp8T3Q)), and an article by Aleksei Elivanov ([link](https://betterprogramming.pub/real-time-game-server-internals-basic-theory-architecture-optimization-auto-scaling-b2070aa803d9)) that helped me a lot in understanding online multiplayer game architectures. Aleksei Elivanov also explained why there is a need for a single source of truth in the game and addressed the issue that I was facing previously to some extent. I found that there are two main ways to manage game state data in an online multiplayer game: P2P architecture or dedicated server architecture. I decided to build my game on a P2P architecture because:
1.	I don't want to spend money running dedicated servers and managing dedicated content delivery networks.
2.	I want my game to be highly scalable with low hosting requirements.

These reasons were satisfied by the P2P architecture. In P2P architecture, the game state is calculated on one of the player's computers, called host-peer/seed, and sent to other players, called client-peers/leech. This approach eliminates the need for a dedicated server to calculate the game state, reducing costs and ensuring high scalability. Also, the resources required on the server side to handle thousands of players simultaneously are very low in P2P architecture as compared to dedicated server architecture. However, this architecture has its own drawbacks, and the major issue is that the game can be unfair. In a P2P architecture, all game calculations are done on one player's system, which means that player experiences minimal latency. Meanwhile, the other player may experience significantly higher latency due to differences in packet routes and geographical distance between the two players.

So, I implemented P2P architecture, and it resolved the data inconsistency problem that was there in my initial game architecture. But that’s not it; I have updated the architecture a bit for a smoother experience. I have added client-peer-side game state calculation, or better if I say predictions. Now the architecture has a combination of host-peer side and client-peer side calculations/predictions. It is very obvious that sharing game states will have some delay, and even during this delay, we have to render frames on screen. We can’t wait on the client-peer side for 50, 100, or 200ms to render each frame, which will lead to a very poor experience. To fix it, I have added client-peer side calculations/predictions. So, basically complete game state is calculated, including player positions, player velocities, game events, player events (movement, attack and defence), and data that requires a single source of truth like player health, player damage, and game results. on the host-peer side. On the other hand, on the client-peer side, only player positions, player velocities, and their actions are calculated, which can be predicted from previous game state data such as player positions, player velocity, and player actions. This addition to the game architecture improved the game experience drastically.
 
Finally, the game was ready. I hosted it on AWS for testing. When I tested it with my brother, it was working! I was so happy until I changed my network to my mobile’s hotspot. During the first test, me and my brother were both connected to the same router. I found that it was not working if players were on different network, this was because the router firewall was blocking the WebRTC connection. To resolve this, there is a concept of STUN/TURN server. You can check it out. So, I added free STUN and TURN server links in WebRTC connection configs. And finally, it was working as expected. Later on, I tested the game with my friends who were geographically away from me to see the effect of distance on latency. Thanks to Tanya Nijhawan and Ayush Mhetre for helping me test this game. I found that the game experience in general is not that bad, and it's quite good for players who are geographically closer and whose network router firewalls are not too strict. Still, the game has some flaws, and latency can be reduced by implementing this system with a dedicated server and content delivery network, but for the time being, I believe it's acceptable.

I am open to suggestions and constructive feedback do let me know if you have any. I hope you like this game, and I hope you learn something from my experience.

</div>

## ACKNOWLEDGEMENT
<div align="justify">
I would like to express my appreciation to all the individuals mentioned in the "THE STORY" section, their articles and videos were very helpful throughout this journey. Thanks to my friends Tanya Nijhawan and Ayush Mhetre for helping me test the game. And special thanks to my brother Charul Kolte for making the game map and fixing the player sprites. Thanks to everyone, your support and contributions were invaluable in this journey.
<div>
