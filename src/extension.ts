import * as vscode from 'vscode';
import Context from './common/Context';
import { getLogger } from './common/Logger';
import Logic from './logic/Logic';
import WebServer from './logic/WebServer';
import ServerBar from './logic/ServerBar';

let logic: Logic | undefined;
export function activate(vsContext: vscode.ExtensionContext) {
	let context = new Context();
	context.vsc = vsContext;
	context.server = new WebServer(context);
	context.bar = new ServerBar(context);

	getLogger("extension").debug("activate");

	logic = new Logic(context);
}

export function deactivate() {
	if (logic != undefined) {
		logic.destroy();
		logic = undefined;
	}
}
