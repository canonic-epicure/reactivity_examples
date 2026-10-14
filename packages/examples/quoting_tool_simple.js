import { globalGraph } from "@bryntum/chronograph/src/chrono2/graph/Graph.js";
import { SimpleQuote } from "./src/quoting_tool/SimpleQuote.js";
import { Application } from "./src/quoting_tool/QuotingTool.js";
globalGraph.autoCommit = false;
globalGraph.historyLimit = 0;
// set up the quote data
// @ts-ignore
const quote = window.quote = SimpleQuote.new();
quote.price = 100;
quote.quantity = 2;
quote.discount = 10;
globalGraph.commit();
// init the UI
const app = Application.new({ quote });
document.body.appendChild(app.el);
