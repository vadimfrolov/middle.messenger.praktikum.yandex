import Handlebars from "handlebars/dist/handlebars.runtime";
import compiledTemplate from "./base.hbs";
import "./base.scss";

Handlebars.registerPartial({ baseLayout: compiledTemplate });
