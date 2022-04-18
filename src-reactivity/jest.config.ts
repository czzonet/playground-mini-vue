import { Config } from "@jest/types";

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    testPathIgnorePatterns: ["/node_modules/", "build", "example-*"],
    rootDir: "",
    testEnvironment: "jsdom",
  };
};
