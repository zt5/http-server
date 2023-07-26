import * as vscode from 'vscode';
import { Command } from '../common/Command';
import Context from '../common/Context';
import { BrowserType } from '../common/define';
import Listener from "../common/Listener";
import { getLogger, Logger } from '../common/Logger';
import WebServer from './WebServer';

export default class Logic extends Listener {
    private logger: Logger;
    public constructor(protected context: Context) {
        super();
        this.logger = getLogger(this);
        this.regCmd();
    }
    private regCmd() {
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
            if (!this.context.indexpath) return;
            this.context.server.destroy().then(() => {
                this.context.server = new WebServer(this.context);
                this.context.server.start();
            })
        }));
    }
    private startWebServer(args: { fsPath: string }, type: BrowserType) {
        if (args && args.fsPath) {
            this.context.indexpath = args.fsPath;
            this.context.browser = type;
            this.context.server.start();
        }
    }
    public async destroy() {
        super.destroy();
        this.logger.debug("destroy");
        if (this.context.server) {
            await this.context.server.destroy();
        }
        if (this.context.bar) {
            this.context.bar.destroy();
        }
    }
}