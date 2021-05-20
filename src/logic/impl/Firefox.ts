import { FirefoxType, Platform } from "../../common/define";
import Helper from "../../common/Helper";
import BrowserPath from "./BrowserPath";

export default class Firefox extends BrowserPath {
    protected get execPath(): string[] {
        const browserType = Helper.getConfigObj().firefoxType;
        const platformType = Helper.getPlatform();
        switch (browserType) {
            case FirefoxType.normal:
                if (platformType === Platform.OSX) {
                    return ['/Applications/Firefox.app/Contents/MacOS/firefox'];
                } else if (platformType === Platform.Windows) {
                    return [
                        'C:\\Program Files\\Mozilla Firefox\\firefox.exe',
                        'C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe'
                    ];
                }else{
                    return [
                        "/usr/bin/firefox"
                    ]
                }
                break;

            case FirefoxType.developer:
                if (platformType === Platform.OSX) {
                    return [
                        '/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox',
                        '/Applications/FirefoxDeveloperEdition.app/Contents/MacOS/firefox'
                    ];
                } else if (platformType === Platform.Windows) {
                    return [
                        'C:\\Program Files\\Firefox Developer Edition\\firefox.exe',
                        'C:\\Program Files (x86)\\Firefox Developer Edition\\firefox.exe'
                    ];
                }
                break;

            case FirefoxType.nightly:
                if (platformType === Platform.OSX) {
                    return ['/Applications/Firefox Nightly.app/Contents/MacOS/firefox']
                } else if (platformType === Platform.Windows) {
                    return [
                        'C:\\Program Files\\Firefox Nightly\\firefox.exe',
                        'C:\\Program Files (x86)\\Firefox Nightly\\firefox.exe'
                    ];
                }
                break;
        }
        return [];
    }
}