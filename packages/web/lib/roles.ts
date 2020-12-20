import _ from "lodash";
import { specialRoleNames } from "../constants";
import roles from "../roles.json";

export { roles };

const servicesExceptProject = _.chain(roles)
  .filter((role) => !specialRoleNames.includes(role.name))
  .map((role) => role.name.split("/")[1].split(".")[0])
  .uniq()
  .value();

export const services = ["project", ...servicesExceptProject].sort();
