import * as vscode from 'vscode';
import { getLogger, Logger } from './common/Logger';
import Logic from './logic/Logic';

let logger: Logger;
let logic: Logic | undefined;
export function activate({ subscriptions }: vscode.ExtensionContext) {
	logger = getLogger("extension");
	logger.debug("activate");

	logic = new Logic(subscriptions);
}

export function deactivate() {
	if (logic != undefined) {
		logic.destroy();
		logic = undefined;
	}
}
