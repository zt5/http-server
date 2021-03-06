import * as vscode from 'vscode';
import { Command } from '../common/Command';
import { BrowserType } from '../common/define';
import Listener from "../common/Listener";
import { getLogger, Logger } from '../common/Logger';
import ServerBar from './ServerBar';
import WebServer from './WebServer';

export default class Logic extends Listener {
    private _webServer: WebServer;
    private _bar: ServerBar;
    private logger: Logger;
    private _indexPath: string | undefined;
    private _prevType: BrowserType | undefined;
    public constructor(protected subscriptions: vscode.Disposable[]) {
        super();
        this.logger = getLogger(this);


        this._bar = new ServerBar(this, subscriptions);
        this._webServer = new WebServer(this);

        this.addListener(vscode.commands.registerCommand(Command.OPEN_FIREFOX, (args) => {
            this.logger.debug(`call ${Command.OPEN_FIREFOX}`, args);
            this.startWebServer(args, BrowserType.FireFox);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_FIREFOX_DEVELOPER, (args) => {
            this.logger.debug(`call ${Command.OPEN_FIREFOX_DEVELOPER}`, args);
            this.startWebServer(args, BrowserType.FireFox);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_FIREFOX_NIGHTLY, (args) => {
            this.logger.debug(`call ${Command.OPEN_FIREFOX_NIGHTLY}`, args);
            this.startWebServer(args, BrowserType.FireFox);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_CHROME, (args) => {
            this.logger.debug(`call ${Command.OPEN_CHROME}`, args);
            this.startWebServer(args, BrowserType.Chrome);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_CHROME_DEVELOPER, (args) => {
            this.logger.debug(`call ${Command.OPEN_CHROME_DEVELOPER}`, args);
            this.startWebServer(args, BrowserType.Chrome);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_CHROME_CANARY, (args) => {
            this.logger.debug(`call ${Command.OPEN_CHROME_CANARY}`, args);
            this.startWebServer(args, BrowserType.Chrome);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_EDGE, (args) => {
            this.logger.debug(`call ${Command.OPEN_EDGE}`, args);
            this.startWebServer(args, BrowserType.Edge);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_INTERNAL_EXPLORER, (args) => {
            this.logger.debug(`call ${Command.OPEN_INTERNAL_EXPLORER}`, args);
            this.startWebServer(args, BrowserType.Ie);
        }));
        this.addListener(vscode.commands.registerCommand(Command.OPEN_SAFARI, (args) => {
            this.logger.debug(`call ${Command.OPEN_SAFARI}`, args);
            this.startWebServer(args, BrowserType.Safari);
        }));
        this.addListener(vscode.commands.registerCommand(Command.SERVER_RESTART, (args: string[]) => {
            this.logger.debug(`call ${Command.SERVER_RESTART}`);
            if (!this._indexPath) return;
            this._webServer.destroy().then(() => {
                this._webServer = new WebServer(this);
                this._webServer.start();
            })
        }));
        // this.addListener(vscode.workspace.onDidChangeConfiguration(e => {
        //     if (Helper.valConfIsChange(e, "firefoxType")) {

        //     } 
        // }))
    }
    private startWebServer(args: { fsPath: string }, type: BrowserType) {
        if (args && args.fsPath) {
            this._indexPath = args.fsPath;
            this._prevType = type;
            this._webServer.start();
        }
    }
    public get prevType() {
        return this._prevType;
    }
    public get indexPath() {
        return this._indexPath;
    }
    public get service() {
        return this._webServer;
    }
    public get urlStr() {
        if (this._webServer) {
            return this._webServer.urlStr;
        }
        return undefined;
    }
    public get bar() {
        return this._bar;
    }
    public async destroy() {
        super.destroy();
        this.logger.debug("destroy");
        if (this._bar) {
            this._bar.destroy();
        }
        if (this._webServer) {
            await this._webServer.destroy();
        }
    }
}