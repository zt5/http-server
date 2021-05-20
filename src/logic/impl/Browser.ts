import { ChildProcess } from "child_process";
import * as treekill from "tree-kill";
import { getLogger, Logger } from "../../common/Logger";
import WebServer from "../WebServer";
export default abstract class Browser {
    protected progress: ChildProcess | undefined;
    protected logger: Logger;
    protected url: string = "";
    public father: WebServer | undefined
    constructor() {
        this.logger = getLogger(this);
    }
    protected abstract get execPath(): string[];
    public abstract run(url: string): Promise<void>;
    protected exitHandler = (...args: any[]) => {
        this.logger.debug(...args)
    }
    protected errorHandler = (err: Error) => {
        this.logger.error(err)
    }
    protected closeHandler = (code: number, signal: NodeJS.Signals) => {
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