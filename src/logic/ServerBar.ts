import * as vscode from 'vscode';
import { Command } from '../common/Command';
import Context from '../common/Context';
import { ServiceStatus } from "../common/define";
import Listener from '../common/Listener';
import { getLogger, Logger, showLog } from '../common/Logger';
export default class ServerBar extends Listener {
    private statusBar: vscode.StatusBarItem;
    private _status = ServiceStatus.Free;
    private logger: Logger;
    public constructor(protected context: Context) {
        super();

        this.logger = getLogger(this);
        const barCommandId = 'http-server.showMenu';
        const pickItems = ["$(refresh) 重启", `$(output) 显示日志窗口`];
        this.addListener(vscode.commands.registerCommand(barCommandId, () => {
            this.logger.debug(`receive cmd: ${barCommandId}`)
            vscode.window.showQuickPick(pickItems).then(result => {
                this.logger.debug(`select cmd: ${result}`)
                switch (result) {
                    case pickItems[0]:
                        vscode.commands.executeCommand(Command.SERVER_RESTART);
                        break;
                    case pickItems[1]:
                        showLog();
                        break;
                }
            })
        }));

        this.statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
        this.statusBar.command = barCommandId;
        this.statusBar.show();
        this.context.vsc.subscriptions.push(this.statusBar);

        this.updateView();
    }
    public get status() {
        return this._status;
    }
    public set status(status: ServiceStatus) {
        this.logger.debug(`status: ${status}`)
        this._status = status;
        this.updateView();
    }
    private updateView() {
        this.updateBarTxt();
    }
    private updateBarTxt() {
        let _statusTxt: string, _extStatusTxt: string = "";
        switch (this._status) {
            case ServiceStatus.Destroying:
                _statusTxt = `$(loading~spin) Http Server关闭中`;
                break;
            case ServiceStatus.Running:
                if (this.context.server && this.context.url) {
                    _statusTxt = `$(vm-active) ${this.context.url}`;
                } else {
                    _statusTxt = `$(vm-active) Http Server运行中`;
                }
                break;
            case ServiceStatus.Free:
                _statusTxt = `$(vm-outline) Http Server已停止`;
                break;
            case ServiceStatus.Starting:
                _statusTxt = `$(repo-sync~spin) Http Server启动中`;
                break;
        }
        if (_extStatusTxt != "") {
            this.statusBar.text = `${_statusTxt} | ${_extStatusTxt}`;
        } else {
            this.statusBar.text = `${_statusTxt}`;
        }
    }
    public destroy() {
        super.destroy();
        this.logger.debug(`destroy`)
        if (this.statusBar) {
            this.statusBar.dispose();
        }
    }
}