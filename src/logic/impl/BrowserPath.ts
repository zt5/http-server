import { spawn } from "child_process";
import { existsSync, statSync } from "fs";
import * as vscode from "vscode";
import Browser from "./Browser";
export default abstract class BrowserPath extends Browser {
    public async run(url: string) {
        await this.clear();
        this.url = url;
        const execPaths = this.execPath;
        let execPath: string | undefined;
        for (let str of execPaths) {
            if (existsSync(str)) {
                execPath = str;
                break;
            }
        }
        if (!execPath) {
            vscode.window.showErrorMessage(`未安装浏览器`);
            return;
        }
        else if (!existsSync(execPath)) {
            vscode.window.showErrorMessage(`路径: ${execPath} 不存在`);
            return;
        } else if (statSync(execPath).isDirectory()) {
            vscode.window.showErrorMessage(`路径: ${execPath} 不能是目录`);
            return;
        }
        this.progress = spawn(execPath, [this.url], { detached: true, stdio: 'ignore' });
        if (this.progress) {
            this.progress.unref();
            this.progress.on("close", this.closeHandler);
            this.progress.on("error", this.errorHandler);
            this.progress.on("exit", this.exitHandler);
        }
    }
}