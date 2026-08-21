import argparse
import os
import subprocess
import sys
import threading
import time

RESET  = "\033[0m"
BOLD   = "\033[1m"
RED    = "\033[31m"
GREEN  = "\033[32m"
YELLOW = "\033[33m"
CYAN   = "\033[36m"

def log(tag: str, color: str, message: str) -> None:
    print(f"{color}{BOLD}[{tag}]{RESET} {message}", flush=True)

def log_info(tag: str, message: str)  -> None: log(tag, CYAN,   message)
def log_ok  (tag: str, message: str)  -> None: log(tag, GREEN,  message)
def log_warn(tag: str, message: str)  -> None: log(tag, YELLOW, message)
def log_err (tag: str, message: str)  -> None: log(tag, RED,    message)


def find_npm() -> str:
    candidates = ["npm.cmd", "npm"] if sys.platform == "win32" else ["npm"]
    import shutil
    for name in candidates:
        if shutil.which(name):
            return name
    log_err("dev", "npm not found. Install Node.js: https://nodejs.org/")
    sys.exit(1)


def stream_output(proc: subprocess.Popen, tag: str, color: str) -> None:
    for line in iter(proc.stdout.readline, b""):
        text = line.decode(errors="replace").rstrip()
        if text:
            print(f"{color}{BOLD}[{tag}]{RESET} {text}", flush=True)

def npm_install(npm: str, cwd: str, tag: str) -> None:
    log_info(tag, f"Running npm install in {os.path.basename(cwd)} …")
    result = subprocess.run([npm, "install"], cwd=cwd)
    if result.returncode != 0:
        log_err(tag, "npm install failed.")
        sys.exit(result.returncode)
    log_ok(tag, "npm install done.")


def start_service(npm: str, cwd: str, tag: str, color: str) -> subprocess.Popen:
    log_info(tag, f"Starting {tag} …")
    proc = subprocess.Popen(
        [npm, "run", "dev"],
        cwd=cwd,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
    )
    # Stream output on a daemon thread so it doesn't block the main loop
    t = threading.Thread(target=stream_output, args=(proc, tag, color), daemon=True)
    t.start()
    return proc


def run(args: argparse.Namespace) -> None:
    script_dir  = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(script_dir, "backend")
    frontend_dir = os.path.join(script_dir, "frontend")

    for d, label in [(backend_dir, "backend"), (frontend_dir, "frontend")]:
        if not os.path.isdir(d):
            log_err("dev", f"Directory not found: {d}")
            log_err("dev", f"Run dev.py from the Vital.site root (where {label}/ lives).")
            sys.exit(1)

    npm = find_npm()

    if args.install:
        npm_install(npm, backend_dir,  "backend")
        npm_install(npm, frontend_dir, "frontend")

    backend_proc  = start_service(npm, backend_dir,  "backend",  CYAN)
    time.sleep(1)
    frontend_proc = start_service(npm, frontend_dir, "frontend", GREEN)
    log_ok("dev", "Both services started.  Press Ctrl+C to stop.")

    try:
        while True:
            be = backend_proc.poll()
            fe = frontend_proc.poll()
            if be is not None:
                log_warn("dev", f"backend exited with code {be}.")
                break
            if fe is not None:
                log_warn("dev", f"frontend exited with code {fe}.")
                break
            time.sleep(0.5)
    except KeyboardInterrupt:
        pass
    finally:
        log_info("dev", "Stopping …")
        for proc, tag in [(backend_proc, "backend"), (frontend_proc, "frontend")]:
            if proc.poll() is None:
                proc.terminate()
                try:
                    proc.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    log_warn(tag, "Did not exit in time — killing.")
                    proc.kill()
        log_ok("dev", "Done.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Vital.site dev launcher — starts backend (:3001) + frontend (:3000)."
    )
    parser.add_argument(
        "--install", "-i",
        action="store_true",
        help="Run npm install in backend and frontend before starting.",
    )
    run(parser.parse_args())


if __name__ == "__main__":
    main()