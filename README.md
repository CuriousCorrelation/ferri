# Ferri (Ferris & Ferry)
Taking you over the files and directories in your system!

## A File Explorer Written In Rust With Tauri
TODO!

## Development
Reproducible development environment with devenv and Nix

Simply run `devenv shell` to activates your developer environment and `devenv up` to start all the processes.

Follow https://devenv.sh/getting-started/ if you don't have nix package manager installed already.
Check out https://nixos.org/ to know more about how nix can help you make reproducible, declarative and reliable systems.

Note the use of `url: github:NixOS/nixpkgs/nixpkgs-unstable` instead of `url: github:cachix/devenv-nixpkgs/rolling` to fix package version mismatch in `devenv.yaml`.
