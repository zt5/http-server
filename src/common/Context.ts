import * as vscode from "vscode";
import Logic from "../logic/Logic";
import ServerBar from "../logic/ServerBar";
import WebServer from "../logic/WebServer";
import { BrowserType } from "./define";
export default class Context {
    public vsc!: vscode.ExtensionContext;
    public logic!: Logic;
    public server!: WebServer;
    public bar!: ServerBar;

    public context!: Context;
    public indexpath?: string;
    public browser?: BrowserType;
    public url!: string;
}