import Handlebars from "handlebars/dist/handlebars.runtime";
import compiledTemplate from "./empty.hbs";
import "./empty.scss";

Handlebars.registerPartial({ emptyLayout: compiledTemplate });
