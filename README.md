# Tic-Tac-Toe
Tic Tac Toe 🎯
This is my implementation of The Odin Project’s Tic Tac Toe JavaScript project, designed to demonstrate clean architecture using factory functions and the module pattern.

🚀 Features
Game flow control using modular components: Game module, Player factory, GameView module, and GameController module

State management fully encapsulated—minimal global variables allowed 

Two-player gameplay: custom name input or default names (“Player X” and “Player O”), turn indicator, restart button, and validation to prevent overwriting squares 

🛠️ Built With
Vanilla JavaScript using factory functions, IIFEs, private and public scopes via module pattern

HTML / CSS for the UI

Git & GitHub for version control and hosting

🔍 Technical Approach
Game module maintains the underlying 3×3 board array and provides win/tie checking logic.

Player factory creates player objects (marker, name, score), keeping player logic isolated.

GameView module handles UI rendering: updating board display, showing current turn, names, reset functionality.

GameController module orchestrates game state, turn swapping, win detection, and reset behavior—all loosely coupled components

🎓 Why This Matters
Helps reinforce concepts learned in The Odin Project such as architecture planning, separation of concerns, and scope encapsulation.

Using the module pattern ensures your code stays organized, avoids naming conflicts, and scales better for future enhancements.