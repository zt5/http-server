import { ChildProcess, spawn } from "child_process";
import { existsSync, statSync } from "fs";
import * as treekill from "tree-kill";
import * as vscode from "vscode";
import { getLogger, Logger } from "../../common/Logger";
import WebServer from "../WebServer";
export default abstract class Browser {
    private progress: ChildProcess | undefined;
    private logger: Logger;
    public father: WebServer | undefined
    constructor() {
        this.logger = getLogger(this);
    }
    protected abstract get execPath(): string[];
    public async run(url: string) {
        await this.clear();
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
        this.progress = spawn(execPath, [url], { detached: true, stdio: 'ignore' });
        if (this.progress) {
            this.progress.unref();
            this.progress.on("close", this.closeHandler);
            this.progress.on("error", this.errorHandler);
            this.progress.on("exit", this.exitHandler);
        }
    }
    private exitHandler = (...args: any[]) => {
        this.logger.debug(...args)
    }
    private errorHandler = (err: Error) => {
        this.logger.error(err)
    }
    private closeHandler = (code: number, signal: NodeJS.Signals) => {
        this.logger.debug("exit: ", code, signal)
    }
    public async destroy() {
        await this.clear();
    }
    protected async clear() {
        if (this.progress) {
            this.progress.off("close", this.closeHandler);
            this.progress.off("error", this.errorHandler);
            this.progress.off("exit", this.exitHandler);
            this.logger.debug(`killProgress pid: ${this.progress.pid}`)

            return new Promise<void>((resolve, reject) => {
                if (this.progress) {
                    treekill(this.progress.pid, err => {
                        if (err) {
                            this.logger.debug(err);
                        }
                        if (this.progress) {
                            this.logger.debug(`killProgress pid: ${this.progress.pid} success!`)
                        }
                        this.progress = undefined;
                        resolve();
                    });
                } else {
                    resolve();
                }
            });
        }
    }
}