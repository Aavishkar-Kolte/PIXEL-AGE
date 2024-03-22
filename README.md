# PIXEL-AGE

<div align="justify"> 
PIXEL-AGE is a browser-based online multiplayer fighting game (2-player game). Players can play the game with their friends or engage in random battles with opponents from around the world. To initiate a game with friends, players can create a private lobby and share the lobby code with their friends. This allows players to easily join the same game and compete against each other. Alternatively, players can quickly match up with random opponents using the "Play Online" feature. The game also has an in-game chat feature.
</div> <br>

<img src="https://github.com/Aavishkar-Kolte/PIXEL-AGE/assets/120270667/63ad7200-139a-4e32-b199-17e8ce350c24" width="100%" height="100%" alt="PIXEL-AGE">

#### [PLAY NOW](http://pixel-age.ap-south-1.elasticbeanstalk.com)

Check out gameplay demo [here](https://youtu.be/wVRw1fhWWBo?si=4GJciR4VSUVVLz-E).

Check out my Medium article [here](https://medium.com/@aavishkarkolte/this-is-how-i-developed-my-first-browser-based-online-multiplayer-fighting-game-pixel-age-f92e905f54ed), where I've documented my entire journey in detail.

## 💻 Technology Stack

- Frontend: ReactJS, HTML Canvas, CSS, JS
- Backend: NodeJS, ExpressJS, MongoDB
- Other: Socket.IO, WebRTC
- Testing: Jest

## 🚀 Features

- Private Lobbies: Players can create private lobbies and share the lobby code with friends to easily connect and compete against each other.

- Random Matchmaking: For quick gameplay, players can opt for the "Play-Online" feature, matching them with random opponents.

- In-Game Chat: Communicate with opponents or friends through the in-game chat feature.

- Basic Client-Side Prediction: To deal with latency issues, this feature allows for smoother gameplay experiences by predicting the game state locally and adjusting accordingly, thus reducing the impact of network delays. It simply calculates the current position based on the last received data and updates animation frames, maintaining the player's actions as per their last received data.

- Player Actions: Navigate forward and backward with 'a' and 'd', jump with 'w', attack using 'Space', and defend with 'k'. While defending, players receive 75% less damage.

## ✨ Architecture

<img src="https://github.com/Aavishkar-Kolte/PIXEL-AGE/assets/120270667/fc7b534e-f1f7-4f74-8cc9-479707c89e78" width="100%" height="100%" alt="PIXEL-AGE Architecture Diagram">

## ✨ Working

I developed this game out of my curiosity to delve into the mechanics of multiplayer games and explore the potential of WebRTC. In this section, I'll provide a high-level overview of how this project works.

This game uses P2P architecture, where players connect directly to each other to share game state and actions. Unlike the dedicated server setup where all players connect to one central server, in P2P, each player's system handles game calculations independently or together if the implementation of game state calculation is deterministic in nature.

There are pros and cons to using P2P. On the plus side, it eliminates the need for a dedicated server, saving on server costs, and allowing more simultaneous matches with the same resources. And that's why i chose P2P. However, it's easier for cheaters to manipulate the game in a P2P setup compared to a dedicated server where the server controls everything. But that's not my concern for now.

In this game, WebRTC is used for communication between two players, while socket.io handles communication between the player and the signaling server. When two players start a game, they connect through a signaling server. This server helps exchange their SDP (Session Description Protocol) offer and answer. Once this connection is set up, the game begins. For a more detailed understanding of how connections are established in WebRTC, you can check out this [documentation](https://webrtc.org/getting-started/peer-connections#initiating_peer_connections).

Once connection is estabilished between player the game starts. During the game, the game state is calculated on one peer and then shared with another peer. I know this is the most trivial and a not so good way to implement a multiplayer game. I have recently learned about delay-based netcode and rollback netcode and i am looking forward to implement a combined method of these two in this game in future. If you're interested in contributing to this project, feel free to implement it and initiate a pull request. I'll review it and consider merging it into the game.

To handle latency, I've implemented a basic client-side prediction method. When the game starts, one player becomes the host and the other becomes the client. Both players calculate and render visual elements like position, velocity, and animation frames. However, collision detection and damage calculations are done only on the host side. And the client-side prediction simply calculates the current position based on the last received data and updates animation frames, maintaining the player's actions as per their last received data. This means that even if there's a delay in receiving game state data on the client side, the game still feels smooth and responsive.

## 🛠️ Local Development Setup

First, clone the repository to your local machine

### Installing Dependencies

Navigate into the project directory and install all the dependencies using install-all script:

```
cd PIXEL-AGE
npm run install-all
```

The install-all script will install all the dependencies required for both the backend and frontend code.

### Configuring Environment Variables

- Copy .env.example file and rename it to .env.
- Open the .env file and update the variables according to your environment.

### Running the Project

Once the dependencies are installed and the environment variables are configured, you can run the complete project. This involves starting both the backend Express server and the frontend React server. Make sure you are in the main directory, which is PIXEL-AGE:

```
npm run start
```

Alternatively, you can start the backend Express server or the frontend React server separately using the following scripts:

```
npm run start-backend
npm run start-frontend
```

Running npm run start will launch both servers concurrently, allowing you to interact with the complete project. Use the separate scripts if you need to run each server individually.

## 🧪 Testing

As of now the project only includes tests for backend.

### Testing the Backend

To run the backend tests, you will need to navigate to the backend directory and execute the test script.

```
cd backend
npm run test
```

This will run all the jest tests and display the results in your terminal:

## 🐛 Bug Reporting

Feel free to [open an issue](https://github.com/Aavishkar-Kolte/PIXEL-AGE/issues) on GitHub if you find any bug.

<a id="feature-request"></a>

## ⭐ Feature Request

Feel free to [Open an issue](https://github.com/Aavishkar-Kolte/PIXEL-AGE/issues) on GitHub to request any additional features that you would like to see.

<br>

I hope you like this game. I am open to suggestions and constructive feedback do let me know if you have any at aavishkarkolte@gmail.com

Connect with me on [LinkedIn](https://www.linkedin.com/in/aavishkar-kolte-3025aa222/)
