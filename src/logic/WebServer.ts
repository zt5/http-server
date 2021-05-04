import * as path from "path";
import { BrowserType, ServiceStatus, HttpMsgType } from "../common/define";
import HttpServer from '../common/HttpServer';
import { getLogger, Logger, showLog } from "../common/Logger";
import Browser from "./impl/Browser";
import BrowserFactory from "./impl/BrowserFactory";
import Chrome from "./impl/Chrome";
import Firefox from "./impl/Firefox";
import Logic from "./Logic";

export default class WebServer {
    private server: HttpServer;
    private _urlStr: string | undefined;
    private _isDestroy = false;
    private logger: Logger;
    private browser: Browser | undefined;
    constructor(public father: Logic) {
        this.logger = getLogger(this);
        this.server = new HttpServer();
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
        if (!this.father.prevType) {
            throw new Error(`命令参数prevType错误`);
        }
        await this.server.clear()
        if (this.browser) await this.browser.destroy();
        this.browser = BrowserFactory.factory(this.father.prevType);
        if (!this.browser) {
            throw new Error(`不支持的浏览器`);
        } else {
            this.browser.father = this;
        }
        this.exec();
    }
    private exec() {
        if (this._isDestroy) return;
        if (!this.father.indexPath) {
            throw new Error(`命令参数indexPath错误`);
        }
        this.logger.debug(`index path: ${this.father.indexPath}`)
        this.father.bar.status = ServiceStatus.Starting;

        this.server.start(path.dirname(this.father.indexPath), (type: HttpMsgType, data: string) => {
            switch (type) {
                case HttpMsgType.Error:
                    this.logger.debug(data);
                    break;
                case HttpMsgType.Message:
                    this.logger.debug(data)
                    break;
                case HttpMsgType.Exit:
                    this.father.bar.status = ServiceStatus.Free;
                    this.logger.debug(`exit code: ${data}`);
                    break;
                case HttpMsgType.Url:
                    this._urlStr = data;
                    this.logger.debug(`url: ${data}`);

                    if (this.browser) {
                        this.browser.run(this._urlStr);
                        this.father.bar.status = ServiceStatus.Running;
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
    public get urlStr() {
        return this._urlStr;
    }
}