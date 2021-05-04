import { Platform } from "../../common/define";
import Helper from "../../common/Helper";
import Browser from "./Browser";

export default class Edge extends Browser {
    protected get execPath(): string[] {
        // C:\Program Files (x86)\Microsoft\Edge\Application

        const platformType = Helper.getPlatform();

        if (platformType === Platform.OSX) {
            //TODO
        } else if (platformType === Platform.Windows) {
            return [
                'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
            ]
        } else {
            //TODO 
        }
        return [];
    }
}