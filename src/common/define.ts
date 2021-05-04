import * as cp from 'child_process';
import * as vscode from "vscode";
export enum ProgressMsgType {
    Message, Error, Exit
}
export enum HttpMsgType {
    Message, Error, Exit, Url
}
export interface ChildProcessExt extends cp.ChildProcess {
    isDestroy?: boolean;
}
export enum ServiceStatus {
    Starting, Running, Destroying, Free
}
export type OutPutFun = ((progressMsgType: ProgressMsgType, msg: string) => void) | undefined
export type HttpOutPutFun = ((httpMsgType: HttpMsgType, msg: string) => void) | undefined
export enum LogLevel {
    DEBUG, LOG, WARN, ERROR, RAW
}
export enum Platform {
    OSX, Windows, Linux
}
export enum ChromeType {
    normal = "normal",
    developer = "developer",
    canary = "canary",
}
export enum FirefoxType {
    normal = "normal",
    developer = "developer",
    nightly = "nightly",
}
export enum BrowserType {
    FireFox = "firefox",
    Edge = "edge",
    Chrome = "chrome",
    Ie = "ie"
}
export interface ConfigObj extends vscode.WorkspaceConfiguration {
    /**打印详细日志*/
    devlog: boolean;
    /**firefox类型*/
    firefoxType: FirefoxType;
    /**chrome类型*/
    chromeType: ChromeType;
    /**服务器首选端口*/
    port: number;
}