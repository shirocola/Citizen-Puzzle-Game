# Jigsaw Puzzle Game

This project is an offline jigsaw puzzle game designed to be used on a vertical monitor with a 43-inch screen, especially suited for touch screens. The game is meant to provide an engaging and interactive experience for users who enjoy solving jigsaw puzzles.

## Features

- **Offline Mode**: The game can be played without an internet connection.
- **Full-Screen Mode**: The game runs in full-screen mode for an immersive experience.
- **User-Friendly Interface**: Simple and intuitive design to cater to users of all ages.
- **Prevent Two-Finger Right Click**: Prevents two-finger right-click to avoid bad UX on touch screens.

## User Story

As a user, I want to play a jigsaw puzzle game on a large vertical touch screen monitor, so that I can have an enjoyable and interactive experience solving puzzles.

### Steps to Play

1. **Start Screen**: When the game is launched, the start screen with "Touch to Start" message will appear.
2. **Full-Screen Mode**: Upon touching the screen, the game will enter full-screen mode for a more immersive experience.
3. **Game Screen**: The game screen will display the puzzle grid and the pieces. Users can drag and drop the pieces to complete the puzzle.
4. **Timer**: A timer will count down, challenging users to complete the puzzle within the allotted time.
5. **Result Screen**: After completing the puzzle or when the time runs out, a result screen will display whether the user won or lost. A win will redirect to a discount page, and a loss will prompt a retry.

## Setup and Installation

### Prerequisites

- A 43-inch vertical touch screen monitor
- A computer with a web browser (preferably Chrome)
- Uniform Server for running the project offline

### Installation

1. **Copy Project Files**: Copy the entire project directory to a flash drive.
2. **Uniform Server**: Download and extract [Uniform Server](https://www.uniformserver.com/) to the flash drive.
3. **Start Server**: Run `UniController.exe` (Windows) or `start.sh` (Linux) from the flash drive to start the server.
4. **Open Browser**: Open the web browser and navigate to `http://localhost` to start the game.

## Usage

1. **Navigate to the Start Page**: Upon loading the game, you will see the "Touch to Start" screen.
2. **Fullscreen Mode**: Click or touch the screen to enter fullscreen mode and start the game.
3. **Solve the Puzzle**: Drag and drop the pieces to complete the puzzle within the given time.
4. **View Results**: Upon completion, view the result screen to see if you have won or lost.

## Customization

### Adding New Images

1. **Image Folder**: Add your images to the `assets` folder.
2. **Update Script**: Modify the `script.js` to include the new images in the puzzle piece generation.

### Adjusting Timer

1. **Modify Timer**: Change the `timeLeft` variable in `script.js` to adjust the puzzle completion time.

## Troubleshooting

- **Full-Screen Issues**: Ensure you have enabled full-screen mode by clicking or touching the screen. For automatic fullscreen, modify the browser settings or use kiosk mode.
- **Touch Screen Compatibility**: Ensure the touch screen drivers are installed and the monitor is calibrated correctly.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

