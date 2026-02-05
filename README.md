# Enterprise View Screen Simulation

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Threejs](https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white)

A specialized Star Trek-themed warp drive simulation built with React Three Fiber. mimics the main viewscreen from *The Original Series*, complete with steerable starfields, rainbow warp trails, and a warp tunnel effect.

## Features

-   **Warping Stars**: 3D starfield with infinite scrolling and recycling logic.
-   **Visual Effects**:
    -   **Rainbow Trails**: Stars cycle through colors as they streak past, mimicking retro video game or classic sci-fi aesthetics.
    -   **Warp Tunnel**: Vignetted "tunnel" vision effect at high speeds.
    -   **World Bending**: Custom vertex shaders bend the world based on steering input.
-   **Interactive Controls**:
    -   **Steering**: Use **Arrow Keys** to steer the ship in 3D space.
    -   **Warp Speed**: Adjustable speed slider affecting star velocity and trail length.
    -   **Trail Length**: Independent control for the visual length of star streaks.
    -   **Star Density**: Adjust the number of stars in the simulation.

## Tech Stack

-   **Framework**: React 19 + TypeScript
-   **Build Tool**: Vite
-   **3D Engine**: Three.js
-   **Renderer**: React Three Fiber (R3F) + Drei
-   **Styling**: Vanilla CSS for the bridge interface

## Getting Started

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## Controls

-   **Arrow Keys**: Steer the ship (Up, Down, Left, Right)
-   **Sliders**: Adjust Warp Speed, Trail Length, and Star Count.
