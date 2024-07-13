{ pkgs, lib, config, inputs, ... }:

{
  # https://devenv.sh/basics/
  env.GREET = "we've entered devenv shell successfully!";

  # https://devenv.sh/packages/
  packages = with pkgs; [
    git
    openssl
    libsoup
    webkitgtk
    nodejs_22
    nodePackages_latest.typescript-language-server
  ];

  # https://devenv.sh/scripts/
  scripts.hello.exec = "Hello, $GREET";

  enterShell = ''
    hello
    git --version
  '';

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep "2.42.0"
  '';

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/languages/
  # languages.nix.enable = true;
  languages.rust = {
    enable = true;
    channel = "nightly";
    components = [
      "rustc"
      "cargo"
      "clippy"
      "rustfmt"
      "rust-analyzer"
      "llvm-tools-preview"
      "rust-src"
      "rustc-codegen-cranelift-preview"
    ];
  };

  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
    };
  };

  languages.typescript.enable = true;

  # https://devenv.sh/pre-commit-hooks/
  # pre-commit.hooks.shellcheck.enable = true;

  # https://devenv.sh/processes/
  # processes.ping.exec = "ping example.com";

  # See full reference at https://devenv.sh/reference/options/
}
