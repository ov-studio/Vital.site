import os
import shutil
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

def log(tag, color, message): print(f"{color}{BOLD}[{tag}]{RESET} {message}", flush=True)
def log_info(tag, message): log(tag, CYAN,   message)
def log_ok  (tag, message): log(tag, GREEN,  message)
def log_warn(tag, message): log(tag, YELLOW, message)
def log_err (tag, message): log(tag, RED,    message)


class Dev:
    def __init__(self, script_dir):
        self.script_dir   = script_dir
        self.backend_dir  = os.path.join(script_dir, "backend")
        self.frontend_dir = os.path.join(script_dir, "frontend")
        self.shared_dir   = os.path.join(script_dir, "shared")
        self.npm          = self.find_npm()
        self.node         = self.find_node()

    def find_npm(self):
        candidates = ["npm.cmd", "npm"] if sys.platform == "win32" else ["npm"]
        for name in candidates:
            if shutil.which(name):
                return name
        log_err("dev", "npm not found. Install Node.js: https://nodejs.org/")
        sys.exit(1)

    def find_node(self):
        candidates = ["node.exe", "node"] if sys.platform == "win32" else ["node"]
        for name in candidates:
            if shutil.which(name):
                return name
        log_err("dev", "node not found. Install Node.js: https://nodejs.org/")
        sys.exit(1)

    def install(self, cwd, tag):
        log_info(tag, f"Installing dependencies ...")
        result = subprocess.run([self.npm, "install"], cwd=cwd)
        if result.returncode != 0:
            log_err(tag, "npm install failed.")
            sys.exit(result.returncode)
        log_ok(tag, "Done")

    def run_sync(self):
        sync_js = os.path.join(self.shared_dir, "sync.js")
        if not os.path.isfile(sync_js):
            log_warn("dev", "shared/sync.js not found — skipping initial sync")
            return
        log_info("dev", "Running shared sync once ...")
        result = subprocess.run([self.node, sync_js], cwd=self.script_dir)
        if result.returncode != 0:
            log_err("dev", "shared/sync.js failed.")
            sys.exit(result.returncode)
        log_ok("dev", "Sync complete")

    def stream(self, proc, tag, color):
        for line in iter(proc.stdout.readline, b""):
            text = line.decode(errors="replace").rstrip()
            if text:
                print(f"{color}{BOLD}[{tag}]{RESET} {text}", flush=True)

    def start(self, cwd, tag, color):
        log_info(tag, f"Starting {tag} ...")
        proc = subprocess.Popen(
            [self.npm, "run", "dev"],
            cwd=cwd,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        threading.Thread(target=self.stream, args=(proc, tag, color), daemon=True).start()
        return proc

    def run(self):
        for d, label in [(self.backend_dir, "backend"), (self.frontend_dir, "frontend")]:
            if not os.path.isdir(d):
                log_err("dev", f"Directory not found: {d}")
                sys.exit(1)

        for cwd, tag in [(self.backend_dir, "backend"), (self.frontend_dir, "frontend")]:
            if not os.path.isdir(os.path.join(cwd, "node_modules")):
                self.install(cwd, tag)

        self.run_sync()
        backend_proc  = self.start(self.backend_dir,  "backend",  CYAN)
        time.sleep(1.5)
        frontend_proc = self.start(self.frontend_dir, "frontend", GREEN)
        log_ok("dev", "Both services started. Press Ctrl+C to stop.")

        try:
            while True:
                if backend_proc.poll()  is not None: log_warn("dev", "backend exited.");  break
                if frontend_proc.poll() is not None: log_warn("dev", "frontend exited."); break
                time.sleep(0.5)
        except KeyboardInterrupt:
            pass
        finally:
            log_info("dev", "Stopping ...")
            for proc, tag in [(backend_proc, "backend"), (frontend_proc, "frontend")]:
                if proc.poll() is None:
                    proc.terminate()
                    try:
                        proc.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        proc.kill()
            log_ok("dev", "Done.")


def main():
    Dev(os.path.dirname(os.path.abspath(__file__))).run()


if __name__ == "__main__":
    main()
