# Superiores-The-Game

"Superiores-The-Game" is a 2D platformer built with Phaser 3, where players navigate through challenging levels, battling enemies and aiming for victory.

## Features

*   **Character Selection**: Choose from unique characters, each with distinct abilities.
*   **Dynamic Levels**: Explore a horizontally scrolling stage designed for engaging gameplay.
*   **Basic Combat**: Engage with enemies using projectiles.
*   **Score and Lives System**: Track your progress and manage your attempts.

## How to Run

1.  **Prerequisites**: Ensure you have Node.js (version 18 or higher) installed.
2.  **Clone the repository**:
    ```bash
    git clone <repository_url>
    cd Superiores-The-Game
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Provide Assets**: This game uses placeholder `.txt` files for images. You will need to provide actual image files in the following locations:
    *   `assets/images/backgrounds/initial_bg.png`: Initial background image (JPG/PNG, 640x480px).
    *   `assets/images/ui/black_bg.png`: Black background for character selection (PNG, 640x480px, completely black).
    *   `assets/images/characters/el_abogado/player_abogado.png`: Spritesheet for 'El Abogado' (PNG, 16x16px per frame, with idle, run, jump, attack animations).
    *   `assets/images/characters/el_financiero/player_financiero.png`: Spritesheet for 'El Financiero' (PNG, 16x16px per frame, with idle, run, jump, attack animations).
    *   `assets/images/characters/el_cientista/player_cientista.png`: Spritesheet for 'El Cientista de Datos' (PNG, 16x16px per frame, with idle, run, jump, attack animations).
    *   `assets/images/enemies/guard/enemy_guard.png`: Spritesheet for 'Guard' enemy (PNG, 16x16px per frame, with idle, walk, attack animations).
    *   `assets/images/enemies/rat/enemy_rat.png`: Spritesheet for 'Rat' enemy (PNG, 16x16px per frame, with idle, walk animations).
    *   **Note**: The game resolution is 640x480 pixels. Character and enemy sprites are expected to be 16x16 pixels per frame.

5.  **Start the Game**:
    ```bash
    npm start
    ```
    Open your web browser and navigate to `http://localhost:8080` (or the port indicated in the console).

## Controls

*   **Left**: `ArrowLeft` or `A`
*   **Right**: `ArrowRight` or `D`
*   **Jump**: `Space`, `ArrowUp`, or `W`
*   **Power/Fire Projectile**: `LeftControl`
*   **Select (Menu/Character Select)**: `Enter`
*   **Back/Escape (In-game)**: `Escape`

## Project Structure

*   `css/`: Contains styling for the HTML page.
*   `js/`: Contains the game's JavaScript logic.
    *   `entities/`: Player, Enemy, Projectile classes.
    *   `scenes/`: Game scenes (Menu, Character Select, Game).
    *   `utils/`: Utility functions (e.g., controls mapping).
*   `assets/images/`: New directory for game assets (backgrounds, characters, enemies, UI).
*   `server.js`: Node.js Express server to serve the game.
*   `.github/workflows/deploy.yml`: GitHub Actions workflow for deployment.

## License

This project is licensed under the MIT License.
