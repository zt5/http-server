import { join } from "path";
import { ChromeType, Platform } from "../../common/define";
import Helper from "../../common/Helper";
import Browser from "./Browser";

export default class Chrome extends Browser {
    protected get execPath(): string[] {
        const browserType = Helper.getConfigObj().chromeType;


        const platformType = Helper.getPlatform();

        switch (browserType) {
            case ChromeType.normal:
                if (platformType === Platform.OSX) {
                    return ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
                } else if (platformType === Platform.Windows) {
                    return [
                        join(Helper.getWinAppDataDir(), 'Google\\Chrome\\Application\\chrome.exe'),
                        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                    ]
                } else {
                    return ['/usr/bin/google-chrome']
                }
                break;
            case ChromeType.canary:
                if (platformType === Platform.OSX) {
                    //TODO
                } else if (platformType === Platform.Windows) {
                    return [
                        join(Helper.getWinAppDataDir(), 'Google\\Chrome SxS\\Application\\chrome.exe'),
                    ]
                } else {
                    //TODO
                }
                break;
            case ChromeType.developer:
                if (platformType === Platform.OSX) {
                    //TODO
                } else if (platformType === Platform.Windows) {
                    return [
                        'C:\\Program Files\\Google\\Chrome Dev\\Application\\chrome.exe',
                    ]
                } else {
                     //TODO
                }
                break;
        }
        return [];
    }
}