import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import * as vscode from "vscode";
import { ConfigObj, Platform } from "./define";

export default class Helper {
	public static convertObjStr(msg: string | number | boolean | Error | unknown) {
		if (typeof msg == "string") return msg;
		else if (typeof msg == "number") return `${msg}`;
		else if (typeof msg == "boolean") return `${msg}`;
		else if (msg instanceof Error) {
			if (msg.stack) return msg.stack;
			else return msg.message;
		}
		else if (msg === null || msg === undefined) return `${msg}`;
		else return JSON.stringify(msg);
	}
	public static getWinAppDataDir() {
		return process.env.LOCALAPPDATA || '/';
	}
	public static getPlatform() {
		const platformType = os.platform();
		if (platformType === 'darwin') {
			return Platform.OSX;
		} else if (platformType === 'win32') {
			return Platform.Windows;
		} else {
			return Platform.Linux;
		}
	}
	public static getConfigObj() {
		return <ConfigObj>vscode.workspace.getConfiguration("http-server");
	}
	public static valConfIsChange(e: vscode.ConfigurationChangeEvent, key: string) {
		return e.affectsConfiguration("http-server." + key, this.getCurRootUri())
	}
	public static getCurRootUri() {
		let result: vscode.WorkspaceFolder | undefined;
		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (workspaceFolders && workspaceFolders.length > 0) {
			for (const workspaceFolder of workspaceFolders) {
				const folderString = workspaceFolder.uri.fsPath;
				if (!folderString) {
					continue;
				}
				result = workspaceFolder;
				break;
			}
		}
		return result;
	}
	public static getCurRootPath() {
		let result: string = "";
		let folder = this.getCurRootUri();
		if (folder) result = folder.uri.fsPath
		return result;
	}

	public static loopFile(file: string, fileFun: (file: string) => void) {
		let state = fs.statSync(file);
		if (state.isDirectory()) {
			let dirs = fs.readdirSync(file);
			for (let i = 0; i < dirs.length; i++) {
				this.loopFile(path.join(file, dirs[i]), fileFun);
			}
		} else {
			fileFun(file);
		}
	};
	public static writeFile(file: string, data: string): Promise<void> {
		return new Promise((resolve, reject) => {
			let parentPath = path.dirname(file);
			if (!fs.existsSync(parentPath)) fs.mkdirSync(parentPath);
			fs.writeFile(file, data, (err) => {
				if (err) reject(err);
				else resolve();
			})
		})
	}
	public static readFile(file: string): Promise<string> {
		return new Promise((resolve, reject) => {
			fs.readFile(file, { encoding: "utf-8" }, (err, data) => {
				if (err) reject(err);
				else resolve(data);
			})
		})
	}

	public static fillNum(num: string | number) {
		let _num = +num;
		if (isNaN(_num)) return `${num}`;
		else if (_num < 10) return `0${_num}`;
		else return `${_num}`;
	}
	public static stripAnsiColorStr(str: string) {
		return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g, '')
	}
}
