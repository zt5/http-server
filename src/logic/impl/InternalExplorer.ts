import { Platform } from "../../common/define";
import Helper from "../../common/Helper";
import Browser from "./Browser";

export default class InternalExplorer extends Browser {
    protected get execPath(): string[] {
        // C:\Program Files (x86)\Microsoft\Edge\Application

        const platformType = Helper.getPlatform();

        if (platformType === Platform.Windows) {
            return [
                'C:\\Program Files\\Internet Explorer\\iexplore.exe',
                "C:\\Program Files (x86)\\Internet Explorer\\iexplore.exe"
            ]
        }
        return [];
    }
}