import * as Bootstrap from "bootstrap";

import "./scss/main.scss";

export * from "./components";

export { setStickyColumnStyles } from "./services/table";
export { getUniqueId } from "./services/id";

// eslint-disable-next-line
(window as any).Bootstrap = Bootstrap;
