import { handleCreateLobby, handleJoinLobby } from "./lobbyHandlers";
import { Player } from "../models/Player";


jest.mock("../models/Player"); // Mocking the Player model
jest.useFakeTimers(); // Using fake timers for testing


const mockPlayerSave = jest.fn(); // Mock function for Player.save()
const mockSocket = {
    id: "mockSocketId",
    emit: jest.fn(), // Mock function for socket.emit()
    join: jest.fn(), // Mocck function for socket.join()
    broadcast: { to: jest.fn().mockReturnThis(), emit: jest.fn() } // Mock object for socket.broadcast
};


beforeEach(() => {
    // Clear the mock's call count (and other call information) before each test
    Player.findOne.mockClear();
    Player.deleteOne.mockClear();
    mockSocket.emit.mockClear();
    mockSocket.join.mockClear();
    mockSocket.broadcast.to.mockClear();
});

afterAll(() => {
    jest.useRealTimers(); // Restoring real timers after all tests are done
});


describe("handleCreateLobby", () => {

    it("should create a new lobby with a unique code", async () => {
        Player.findOne.mockResolvedValue(null); // Mocking Player.findOne() to return null which means no player with the same lobby code exists
        Player.create.mockResolvedValue({ // Mocking Player.create() to return a mock player object
            save: mockPlayerSave,
            _id: "mockPlayerId",
        });

        await handleCreateLobby({ name: "testName" }, mockSocket, false);

        jest.runAllTimers();

        expect(Player.findOne).toHaveBeenCalledTimes(1);
        expect(Player.create).toHaveBeenCalledTimes(1);
        expect(mockPlayerSave).toHaveBeenCalledTimes(1);
        expect(mockSocket.join).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith("created-lobby", { // Expecting mockSocket.emit() to be called with following arguments
            name: "testName",
            lobbyCode: expect.any(String),
            playerId: "mockPlayerId",
        });
        expect(Player.deleteOne).toHaveBeenCalledTimes(1); // testing if newly created player is deleted after 10 minutes
    });

});


describe("handleJoinLobby", () => {

    it("should join an open lobby with valid lobby code", async () => {
        Player.findOne.mockResolvedValueOnce({ // Mocking Player.findOne() to return an player test object
            _id: "existingPlayerId",
            lobbyIsOpen: true,
        });
        Player.create.mockResolvedValue({
            save: mockPlayerSave,
            _id: "newPlayerId",
        });

        await handleJoinLobby(
            { name: "testName", lobbyCode: "testCode" },
            mockSocket,
            false
        );

        jest.runAllTimers();

        expect(Player.findOne).toHaveBeenCalledTimes(1);
        expect(Player.create).toHaveBeenCalledTimes(1);
        expect(mockPlayerSave).toHaveBeenCalledTimes(1);
        expect(mockSocket.join).toHaveBeenCalledTimes(1);
        expect(mockSocket.emit).toHaveBeenCalledWith("joined-lobby", {
            name: "testName",
            lobbyCode: expect.any(String),
        });
        expect(mockSocket.broadcast.to).toHaveBeenCalledWith("testCode"); // Expecting mockSocket.broadcast.to() to be called with "testCode"
        expect(mockSocket.broadcast.emit).toHaveBeenCalledWith("new-player-joined", {
            name: "testName",
        });
        expect(Player.updateOne).toHaveBeenCalledWith(
            { _id: "existingPlayerId" },
            { lobbyIsOpen: false }
        );
        expect(Player.deleteOne).toHaveBeenCalledTimes(1); // testing if newly created player is deleted after 10 minutes
    });


    it("should handle case when lobby code is not found", async () => {
        Player.findOne.mockResolvedValueOnce(null); // Mocking Player.findOne() to return null

        await handleJoinLobby(
            { name: "testName", lobbyCode: "nonExistentCode" },
            mockSocket,
            false
        );
        jest.runAllTimers();

        expect(mockSocket.emit).toHaveBeenCalledWith("lobby-not-found", { // Expecting mockSocket.emit() to be called with following arguments
            lobbyCode: "nonExistentCode",
        });
    });

});
