import { BrowserType } from "../../common/define";
import Browser from "./Browser";
import Chrome from "./Chrome";
import Edge from "./Edge";
import Firefox from "./Firefox";
import InternalExplorer from "./InternalExplorer";

export default class BrowserFactory {
    public static factory(type: BrowserType) {
        let browser: Browser | undefined;
        switch (type) {
            case BrowserType.FireFox:
                browser = new Firefox();
                break;
            case BrowserType.Chrome:
                browser = new Chrome();
                break;
            case BrowserType.Ie:
                browser = new InternalExplorer();
                break;
            case BrowserType.Edge:
                browser = new Edge();
                break;
        }
        return browser;
    }
}