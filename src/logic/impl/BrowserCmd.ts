import { spawn } from "child_process";
import * as vscode from "vscode";
import Browser from "./Browser";
export default abstract class BrowserCmd extends Browser {
    public async run(url: string) {
        await this.clear();
        this.url = url;
        const execPath = this.execPath;
        if (!execPath || execPath.length == 0) {
            vscode.window.showErrorMessage(`没有可运行的命令`);
            return;
        }
        this.progress = spawn(execPath[0], execPath.slice(1), { detached: true, stdio: 'ignore' });
        if (this.progress) {
            this.progress.unref();
            this.progress.on("close", this.closeHandler);
            this.progress.on("error", this.errorHandler);
            this.progress.on("exit", this.exitHandler);
        }
    }
}