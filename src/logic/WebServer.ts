import * as path from "path";
import Context from "../common/Context";
import HttpServer from '../common/HttpServer';
import { Logger, getLogger, showLog } from "../common/Logger";
import { HttpMsgType, ServiceStatus } from "../common/define";
import Browser from "./impl/Browser";
import BrowserFactory from "./impl/BrowserFactory";

export default class WebServer {
    private server: HttpServer;
    private _isDestroy = false;
    private logger: Logger;
    private browser: Browser | undefined;
    constructor(private context: Context) {
        this.logger = getLogger(this);
        this.server = new HttpServer(context);
    }
    public async start() {
        showLog();
        return this._start().catch(err => {
            this.logger.error(err);
            if (this.server) this.server.clear();
        });
    }
    private async _start() {
        this.logger.debug(`start`)
        if (!this.context.browser) {
            throw new Error(`命令参数prevType错误`);
        }
        await this.server.clear()
        if (this.browser) await this.browser.destroy();
        this.browser = BrowserFactory.factory(this.context.browser);
        if (!this.browser) {
            throw new Error(`不支持的浏览器`);
        } else {
            this.browser.father = this;
        }
        this.exec();
    }
    private exec() {
        if (this._isDestroy) return;
        if (!this.context.indexpath) {
            throw new Error(`命令参数indexPath错误`);
        }
        this.logger.debug(`index path: ${this.context.indexpath}`)
        this.context.bar.status = ServiceStatus.Starting;

        this.server.start(path.dirname(this.context.indexpath), (type: HttpMsgType, data: string) => {
            switch (type) {
                case HttpMsgType.Error:
                    this.logger.debug(data);
                    break;
                case HttpMsgType.Message:
                    this.logger.debug(data)
                    break;
                case HttpMsgType.Exit:
                    this.context.bar.status = ServiceStatus.Free;
                    this.logger.debug(`exit code: ${data}`);
                    break;
                case HttpMsgType.Url:
                    this.context.url = data;
                    this.logger.debug(`url: ${data}`);

                    if (this.browser) {
                        this.browser.run(this.context.url);
                        this.context.bar.status = ServiceStatus.Running;
                    }
                    else this.logger.error(`browser is null`);
                    break;
            }
        })
    }
    public async destroy() {
        this.logger.debug(`destroy`)
        this._isDestroy = true;
        await this.server.clear();
        if (this.browser) {
            await this.browser.destroy();
            this.browser = undefined;
        }
    }
    public get isDestroy() {
        return this._isDestroy;
    }
}