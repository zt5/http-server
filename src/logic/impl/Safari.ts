import { Platform } from "../../common/define";
import Helper from "../../common/Helper";
import BrowserCmd from "./BrowserCmd";

export default class Safari extends BrowserCmd {
    protected get execPath(): string[] {
        const platformType = Helper.getPlatform();

        if (platformType === Platform.OSX) {
            return ["open", `-a`, `/Applications/Safari.app/Contents/MacOS/Safari`, this.url]
        }
        return [];
    }
}